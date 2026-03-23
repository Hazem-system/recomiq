// افترض أن window.productId موجود و window.storeId موجود
(async function() {
  const containerId = 'recomiq-slider-container';
  
  // حذف السلايدر القديم إذا موجود
  let oldContainer = document.getElementById(containerId);
  if (oldContainer) oldContainer.remove();

  // إنشاء container جديد
  const container = document.createElement('div');
  container.id = containerId;
  document.body.appendChild(container);

  try {
    const response = await fetch('https://your-backend-api.com/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storeId: window.storeId || 'dev-xik0qt9qmcdedza5',
        productId: window.productId || '',
        userId: window.userId || ''
      })
    });

    const products = await response.json();

    if (Array.isArray(products) && products.length) {
      const slider = document.createElement('salla-products-slider');
      slider.setAttribute('source', 'custom');
      slider.setAttribute('source-value', products.join(','));
      slider.setAttribute('limit', '10');
      slider.setAttribute('block-title', 'منتجات مقترحة');

      container.appendChild(slider);
    } else {
      throw new Error('No products received');
    }
  } catch (e) {
    // fallback: إنشاء سلايدر افتراضي
    const slider = document.createElement('salla-products-slider');            
    slider.setAttribute('source', 'related');            
    slider.setAttribute('source-value', window.productId || '');            
    slider.setAttribute('limit', '10');            
    slider.setAttribute('block-title', 'منتجات مشابهة');            
    container.appendChild(slider);
  }
})();
