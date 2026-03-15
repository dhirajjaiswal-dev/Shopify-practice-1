const CartManager = {
  drawer: null,
  overlay: null,

  init() {
    this.drawer = document.querySelector('[data-cart-drawer]');
    this.overlay = document.querySelector('[data-cart-overlay]');

    document.querySelectorAll('[data-cart-open-trigger]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    });

    document.querySelector('[data-cart-drawer-close]')?.addEventListener('click', () => this.close());
    this.overlay?.addEventListener('click', () => this.close());

    document.addEventListener('cart:item-added', () => {
      this.fetchCart().then((cart) => {
        this.updateCount(cart.item_count);
        this.renderCart(cart);
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
        ? `<p class="text-xs text-gray-400 mt-0.5">${item.variant_title}</p>`
        : '';

    const comparePrice =
      item.original_line_price > item.final_line_price
        ? `<span class="text-xs text-gray-400 line-through ml-1.5">${this.formatMoney(item.original_line_price)}</span>`
        : '';

    const trashIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`;

    return `
      <div class="flex gap-4 py-5 border-b border-gray-100 last:border-0">
        <a href="${item.url}" class="flex-shrink-0">${image}</a>
        <div class="flex-1 min-w-0 flex flex-col justify-between gap-3">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <a href="${item.url}" class="hover:underline">
                <h3 class="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">${item.product_title}</h3>
              </a>
              ${variant}
            </div>
            <div class="text-right flex-shrink-0">
              <p class="text-sm font-bold text-gray-900">${this.formatMoney(item.final_line_price)}</p>
              ${comparePrice}
            </div>
          </div>
          <div class="flex items-center justify-between">
            <cart-actions data-line="${index}" class="flex items-center gap-3">
              <div class="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden select-none">
                <button data-quantity="${item.quantity - 1}" data-minus
                  class="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-lg transition-colors leading-none">−</button>
                <span class="w-9 h-9 flex items-center justify-center text-sm font-semibold text-gray-900 bg-white">${item.quantity}</span>
                <button data-quantity="${item.quantity + 1}" data-plus
                  class="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-lg transition-colors leading-none">+</button>
              </div>
              <button data-quantity="0" data-remove
                class="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium transition-colors py-1 px-2 rounded-md hover:bg-red-50">
                ${trashIcon}
                Remove
              </button>
            </cart-actions>
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
