// ==============================================
// إعدادات الموقع الأساسية
// Site Configuration
// ==============================================
// يمكنك تعديل هذه البيانات بسهولة دون الحاجة للتعديل على الكود

const SITE_CONFIG = {
  // رقم الواتساب للتواصل
  whatsapp: '966555862272',

  // البريد الإلكتروني
  email: 'safigroup@gmail.com',

  // بيانات العلامة التجارية
  brand: {
    name: 'مجموعة الصافي',
    tagline: 'SAFI GROUP',
    logo: 'assets/logo.webp'
  },

  // الموقع الجغرافي
  location: {
    city: 'محايل عسير',
    cityEn: 'Muhayl Asir, Saudi Arabia',
    mapsUrl: 'https://maps.google.com/?q=Muhayl+Asir'
  },

  // روابط التواصل الاجتماعي
  social: {
    twitter: '',
    instagram: '',
    snapchat: '',
    tiktok: ''
  }
};

// تصدير للاستخدام العام
window.SITE_CONFIG = SITE_CONFIG;
