document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ProductForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn?.textContent || 'Add to cart';

    if (submitBtn) {
      submitBtn.textContent = 'Adding...';
      submitBtn.disabled = true;
    }

    try {
      const formData = new FormData(form);
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.description || 'Could not add to cart.');
      }

      document.dispatchEvent(new CustomEvent('cart:item-added'));
    } catch (err) {
      alert(err.message);
    } finally {
      if (submitBtn) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    }
  });
});
