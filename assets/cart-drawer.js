const CartManager = {
  drawer: null,
  overlay: null,

  init() {
    this.drawer = document.querySelector('[data-cart-drawer]');
    this.overlay = document.querySelector('[data-cart-overlay]');

    document.querySelectorAll('[data-cart-open-trigger]').forEach((btn) => {
      btn.addEventListener('click', () => this.open());
    });

    document.querySelector('[data-cart-drawer-close]')?.addEventListener('click', () => this.close());
    this.overlay?.addEventListener('click', () => this.close());

    document.addEventListener('cart:item-added', () => {
      this.fetchCart().then((cart) => {
        this.updateCount(cart.item_count);
        this.renderCart(cart);
        this.open();
      });
    });

    this.fetchCart().then((cart) => this.updateCount(cart.item_count));
  },

  open() {
    this.drawer?.classList.remove('translate-x-full');
    this.overlay?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    this.fetchCart().then((cart) => {
      this.updateCount(cart.item_count);
      this.renderCart(cart);
    });
  },

  close() {
    this.drawer?.classList.add('translate-x-full');
    this.overlay?.classList.add('hidden');
    document.body.style.overflow = '';
  },

  async fetchCart() {
    const res = await fetch('/cart.js');
    return res.json();
  },

  updateCount(count) {
    document.querySelectorAll('.cart-item-count').forEach((el) => {
      el.textContent = count;
      el.classList.toggle('hidden', count === 0);
    });
  },

  renderCart(cart) {
    if (!this.drawer) return;

    const itemsContainer = this.drawer.querySelector('[data-cart-items]');
    const emptyMsg = this.drawer.querySelector('[data-cart-empty]');
    const footer = this.drawer.querySelector('[data-cart-footer]');
    const totalEl = this.drawer.querySelector('[data-cart-total]');

    if (cart.item_count === 0) {
      if (itemsContainer) itemsContainer.innerHTML = '';
      emptyMsg?.classList.remove('hidden');
      footer?.classList.add('hidden');
      return;
    }

    emptyMsg?.classList.add('hidden');
    footer?.classList.remove('hidden');
    if (totalEl) totalEl.textContent = this.formatMoney(cart.total_price);
    if (itemsContainer) {
      itemsContainer.innerHTML = cart.items.map((item, i) => this.itemHTML(item, i + 1)).join('');
    }
  },

  itemHTML(item, index) {
    const image = item.image
      ? `<img src="${item.image}" alt="${item.product_title}" class="w-20 h-20 object-cover rounded-xl flex-shrink-0" width="80" height="80" loading="lazy">`
      : `<div class="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0"></div>`;

    const variant =
      item.variant_title && item.variant_title !== 'Default Title'
        ? `<p class="text-xs text-gray-500 mt-0.5">${item.variant_title}</p>`
        : '';

    const comparePrice =
      item.original_line_price > item.final_line_price
        ? `<p class="text-xs text-gray-400 line-through">${this.formatMoney(item.original_line_price)}</p>`
        : '';

    return `
      <div class="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
        <a href="${item.url}" class="flex-shrink-0">${image}</a>
        <div class="flex-1 min-w-0">
          <a href="${item.url}" class="block hover:underline">
            <h3 class="text-sm font-medium leading-snug line-clamp-2">${item.product_title}</h3>
            ${variant}
          </a>
          <div class="flex items-end justify-between mt-2">
            <cart-actions data-line="${index}">
              <div class="flex items-center border border-[#025A60] rounded-xl overflow-hidden">
                <button data-quantity="${item.quantity - 1}" data-minus
                  class="w-8 h-8 flex items-center justify-center hover:bg-[#025A60]/10 text-[#025A60] font-bold text-base transition-colors">−</button>
                <span class="w-8 text-center text-sm font-semibold text-[#025A60]">${item.quantity}</span>
                <button data-quantity="${item.quantity + 1}" data-plus
                  class="w-8 h-8 flex items-center justify-center hover:bg-[#025A60]/10 text-[#025A60] font-bold text-base transition-colors">+</button>
              </div>
              <button data-quantity="0" data-remove
                class="text-xs text-red-500 hover:text-red-700 mt-1.5 block transition-colors">Remove</button>
            </cart-actions>
            <div class="text-right ml-2">
              <p class="text-sm font-semibold">${this.formatMoney(item.final_line_price)}</p>
              ${comparePrice}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async changeItem(line, quantity) {
    const res = await fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ line, quantity }),
    });
    const cart = await res.json();
    this.updateCount(cart.item_count);
    this.renderCart(cart);
  },

  formatMoney(cents) {
    const currency = window.Shopify?.currency?.active || 'INR';
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
      }).format(cents / 100);
    } catch {
      return `${(cents / 100).toFixed(2)}`;
    }
  },
};

class CartDrawerElement extends HTMLElement {}

class CartActionsElement extends HTMLElement {
  connectedCallback() {
    this.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-quantity]');
      if (!btn) return;
      const line = parseInt(this.dataset.line);
      const quantity = parseInt(btn.dataset.quantity);
      CartManager.changeItem(line, quantity);
    });
  }
}

customElements.define('cart-drawer', CartDrawerElement);
customElements.define('cart-actions', CartActionsElement);

document.addEventListener('DOMContentLoaded', () => CartManager.init());
