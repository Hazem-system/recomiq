(function () {

    // 🔒 منع التكرار
    if (window.__MY_SLIDER_CORE__) return;
    window.__MY_SLIDER_CORE__ = true;

    const currentScript = document.currentScript;

    const STORE_ID = currentScript?.dataset.storeId || '';
    let USER_ID = '';

    let lastProductId = null;

    function getCurrentProductId() {
        return window.productId || null;
    }

    function deleteOldSlider() {
        const old = document.getElementById('custom-product-slider');
        if (old) old.remove();
    }

    function createCustomSlider(productIds) {
        deleteOldSlider();

        const container = document.createElement('div');
        container.id = 'custom-product-slider';

        const slider = document.createElement('salla-products-slider');

        productIds.forEach(id => {
            const card = document.createElement('salla-product-card');
            card.setAttribute('data-product-id', id);
            slider.appendChild(card);
        });

        container.appendChild(slider);
        document.body.appendChild(container);
    }

    function createFallbackSlider(productId) {
        deleteOldSlider();

        const container = document.createElement('div');
        container.id = 'custom-product-slider';

        const slider = document.createElement('salla-products-slider');            
        slider.setAttribute('source', 'related');            
        slider.setAttribute('source-value', productId);            
        slider.setAttribute('limit', '10');            
        slider.setAttribute('block-title', 'منتجات مشابهة');            

        container.appendChild(slider);
        document.body.appendChild(container);
    }

    async function fetchSliderProducts() {
        const productId = getCurrentProductId();

        if (!productId || productId === lastProductId) return;
        lastProductId = productId;

        try {
            const response = await fetch('https://api.example.com/get-products', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    storeId: STORE_ID,
                    productId,
                    userId: USER_ID
                })
            });

            const data = await response.json();

            if (Array.isArray(data.productIds) && data.productIds.length) {
                createCustomSlider(data.productIds);
            } else {
                createFallbackSlider(productId);
            }

        } catch (e) {
            createFallbackSlider(productId);
        }
    }

    // 🔥 debounce
    let timeout;
    function safeRun() {
        clearTimeout(timeout);
        timeout = setTimeout(fetchSliderProducts, 300);
    }

    // 🔥 مراقبة الصفحة
    const observer = new MutationObserver(() => {
        safeRun();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 🔥 تشغيل أولي
    if (window.Salla) {
        Salla.onReady(() => safeRun());
    } else {
        safeRun();
    }

})();
