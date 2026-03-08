// استيراد دالة إعداد Vite
import { defineConfig } from 'vite';

// تصدير إعدادات المشروع
export default defineConfig({
  // إعدادات السيرفر المحلي
  server: {
    // إعداد البروكسي لحل مشكلة CORS
    proxy: {
      // كل الطلبات التي تبدأ بـ /api
      '/api': {
        // توجيهها إلى سيرفر الـ backend
        target: 'http://127.0.0.1:3000',
        // تغيير الأصل لتجنب مشاكل CORS
        changeOrigin: true
      }
    }
  }
});
