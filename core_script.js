(function() {
    const CONTAINER_ID = 'recomiq-products-slider';

    async function addProductsSlider() {
        // احذف القديم
        let container = document.getElementById(CONTAINER_ID);
        if (container) {
            container.innerHTML = '';
            container.remove();
        }

        container = document.createElement('div');
        container.id = CONTAINER_ID;
        document.body.appendChild(container);

        // إعداد بيانات الطلب
        const payload = {
            storeId: window.storeId || '',
            productId: window.productId || '',
            userId: window.userId || ''
        };

        let products = [];

        try {
            const res = await fetch('https://your-api-endpoint.com/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) products = await res.json();
        } catch (e) {
            console.warn('Recomiq: Failed to fetch products, using fallback.', e);
        }

        // إذا لم توجد استجابة، استخدم fallback
        if (!products || !products.length) {
            const slider = document.createElement('salla-products-slider');            
            slider.setAttribute('source', 'related');            
            slider.setAttribute('source-value', window.productId || '');            
            slider.setAttribute('limit', '10');            
            slider.setAttribute('block-title', 'منتجات مشابهة');            
            container.appendChild(slider);
            return;
        }

        // إنشاء سلايدر ديناميكي بالمنتجات من المصفوفة
        const slider = document.createElement('salla-products-slider');
        slider.setAttribute('source', 'manual');
        slider.setAttribute('source-value', products.join(',')); 
        slider.setAttribute('limit', products.length);
        slider.setAttribute('block-title', 'منتجات مقترحة');
        container.appendChild(slider);
    }

    // شغل السلايدر عند كل تغيير مهم في الصفحة
    if (window.Salla && Salla.onReady) {
        Salla.onReady(addProductsSlider);
    } else {
        document.addEventListener('DOMContentLoaded', addProductsSlider);
    }
})();
