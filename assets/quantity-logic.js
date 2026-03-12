document.addEventListener('DOMContentLoaded', () => {
  // 1. Variant Selection Logic
  const variantScript = document.getElementById('product-variants-json');
  const optionInputs = document.querySelectorAll('.variant-option');
  const variantInput = document.getElementById('SelectedVariantId');

  if (variantScript && optionInputs.length > 0 && variantInput) {
    const variants = JSON.parse(variantScript.textContent);

    function updateVariant() {
      const selectedOptions = [];
      const optionNames = new Map(); // Map position to value

      // Get all checked values
      document.querySelectorAll('.variant-option:checked').forEach((input) => {
        // name="option-{{ option.position }}" e.g. "option-1"
        const position = parseInt(input.name.split('-')[1]) - 1; // 0-indexed
        selectedOptions[position] = input.value;
      });

      const matchedVariant = variants.find(variant => {
        return variant.options.every((opt, i) => opt === selectedOptions[i]);
      });

      if (matchedVariant) {
        variantInput.value = matchedVariant.id;

        // Update price display
        const priceEl = document.getElementById('ProductPrice');
        const comparePriceEl = document.getElementById('ProductComparePrice');
        const comparePriceWrapper = document.getElementById('ProductComparePriceWrapper');
        if (priceEl) priceEl.textContent = matchedVariant.price;
        if (comparePriceWrapper) {
          if (matchedVariant.has_compare) {
            if (comparePriceEl) comparePriceEl.textContent = matchedVariant.compare_at_price;
            comparePriceWrapper.style.display = '';
          } else {
            comparePriceWrapper.style.display = 'none';
          }
        }

        // Update URL state
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('variant', matchedVariant.id);
        window.history.replaceState({}, '', newUrl);
      }
    }

    optionInputs.forEach(input => {
      input.addEventListener('change', updateVariant);
    });

    // Run once on load to ensure state is correct
    // (Optional, usually Liquid renders the correct initial state)
    // updateVariant(); 
  }

  // 2. Variant Price Update (for direct name="id" radios)
  const priceRadios = document.querySelectorAll('.variant-price-radio');
  const productPriceEl = document.getElementById('ProductPrice');
  const productComparePriceEl = document.getElementById('ProductComparePrice');
  const productComparePriceWrapper = document.getElementById('ProductComparePriceWrapper');

  if (priceRadios.length > 0 && productPriceEl) {
    priceRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        productPriceEl.textContent = radio.dataset.price;
        if (productComparePriceEl && productComparePriceWrapper) {
          if (radio.dataset.hasCompare === 'true') {
            productComparePriceEl.textContent = radio.dataset.comparePrice;
            productComparePriceWrapper.style.display = '';
          } else {
            productComparePriceWrapper.style.display = 'none';
          }
        }
      });
    });
  }

  // 3. Quantity Logic
  const qtyInputs = document.querySelectorAll('.qty-input');
  const qtyMinusBtns = document.querySelectorAll('.qty-minus');
  const qtyPlusBtns = document.querySelectorAll('.qty-plus');

  qtyMinusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('.qty-input');
      if (input) {
        let val = parseInt(input.value) || 1;
        if (val > 1) {
          input.value = val - 1;
        }
      }
    });
  });

  qtyPlusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('.qty-input');
      if (input) {
        let val = parseInt(input.value) || 1;
        input.value = val + 1;
      }
    });
  });
});
