document.addEventListener('DOMContentLoaded', () => {
    const cartForm = document.getElementById('cart-form');
    if (!cartForm) return;

    document.querySelectorAll('.quantity-increase, .quantity-decrease').forEach((button) => {
        button.addEventListener('click', (e) => {
            const line = e.currentTarget.dataset.line;
            const input = cartForm.querySelector(`input[data-line="${line}"]`);
            const currentValue = parseInt(input.value);

            if (e.currentTarget.classList.contains('quantity-increase')) {
                input.value = currentValue + 1;
            } else if (e.currentTarget.classList.contains('quantity-decrease')) {
                input.value = Math.max(0, currentValue - 1);
            }

            cartForm.submit();
        });
    });

    document.querySelectorAll('.quantity-input').forEach((input) => {
        input.addEventListener('change', () => {
            if (parseInt(input.value) < 0) {
                input.value = 0;
            }
            cartForm.submit();
        });
    });
});