// الحصول على عناصر حاسبة BMI من الصفحة
const heightInput = document.querySelector('#height');
const weightInput = document.querySelector('#weight');
const button = document.querySelector('#calcBtn');
const result = document.querySelector('#result');

// إذا وجد زر BMI، إضافة مستمع للنقر
if (button) {
  button.addEventListener('click', () => {
    // تحويل القيم إلى أرقام
    const heightCm = Number(heightInput.value);
    const weightKg = Number(weightInput.value);

    // التحقق من صحة المدخلات
    if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
      result.textContent = 'Please enter valid height and weight.';
      return;
    }

    // حساب BMI: الوزن بالكيلو / (الطول بالمتر)²
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    // عرض النتيجة
    result.textContent = `Your BMI is ${bmi.toFixed(1)}`;
  });
}

// الحصول على عناصر نموذج التسجيل
const registerForm = document.querySelector('#register-form');
const registerMessage = document.querySelector('#register-message');

// إذا وجد نموذج التسجيل، إضافة مستمع للإرسال
if (registerForm) {
  registerForm.addEventListener('submit', function(event) {
    // منع إعادة تحميل الصفحة
    event.preventDefault();
    
    // الحصول على قيم الحقول
    const username = document.querySelector('#reg-username').value;
    const email = document.querySelector('#reg-email').value;
    const password = document.querySelector('#reg-password').value;
    
    // إرسال طلب POST لتسجيل مستخدم جديد
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    })
      // تحويل الرد إلى JSON مع حالة النجاح
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        console.log('Register response:', data);
        if (ok) {
          // عرض رسالة نجاح
          registerMessage.textContent = 'Registration successful!';
          registerMessage.style.color = 'green';
          // مسح النموذج
          registerForm.reset();
        } else {
          // عرض رسالة الخطأ من الـ backend
          registerMessage.textContent = 'Registration failed: ' + (data.message || data.error || 'Unknown error');
          registerMessage.style.color = 'red';
        }
      })
      .catch(err => {
        // عرض رسالة خطأ إذا فشل الاتصال
        console.error('Register error:', err);
        registerMessage.textContent = 'Registration failed: ' + err.message;
        registerMessage.style.color = 'red';
      });
  });
}
