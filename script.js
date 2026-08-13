// التبديل السلس بين واجهة تسجيل الدخول وإنشاء الحساب بنفس أبعاد المربع
function toggleForms() {
    const signIn = document.getElementById('signInContainer');
    const signUp = document.getElementById('signUpContainer');
    if (signIn.style.display === 'none') {
        signIn.style.display = 'flex';
        signUp.style.display = 'none';
    } else {
        signIn.style.display = 'none';
        signUp.style.display = 'flex';
    }
}

// عرض رسالة الخطأ لتختفي تلقائياً خلال ثانية واحدة (1000 مللي ثانية)
function showToast(message, isSuccess = false) {
    const toast = document.getElementById('toastNotification');
    toast.textContent = message;
    toast.style.backgroundColor = isSuccess ? '#10b981' : '#ef4444';
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 1000); // 1000 مللي ثانية تساوي ثانية واحدة تماماً
}

// معالجة إنشاء الحساب وتطبيق شرط رمز الدعوة وحفظ بيانات الشخص
function handleSignUp(event) {
    event.preventDefault();
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const code = document.getElementById('inviteCode').value;

    // الشرط الصارم: تعذر التسجيل إذا لم يكن الرمز 6134
    if (code !== '6134') {
        showToast('تعذر تسجيل الدخول: رمز الدعوة غير صحيح!');
        return;
    }

    // حفظ الحساب بأمان داخل ذاكرة المتصفح المحلية (Local Storage) للشخص نفسه
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userPassword', password);

    showToast('تم إنشاء الحساب بنجاح!', true);
    setTimeout(() => {
        toggleForms(); // العودة لواجهة الدخول بعد النجاح
    }, 1000);
}

// معالجة تسجيل الدخول والتحقق الصارم من صاحب الحساب الحقيقي فقط
function handleSignIn(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // استدعاء البيانات المحفوظة لصاحب الحساب
    const savedEmail = localStorage.getItem('userEmail');
    const savedPassword = localStorage.getItem('userPassword');

    // التحقق المطابق: الدخول فقط للشخص الذي قام بإنشاء الحساب
    if (email === savedEmail && password === savedPassword) {
        showToast('مرحباً بك! تم تسجيل الدخول بنجاح', true);
        // هنا يمكنك توجيه المستخدم لصفحة موقعك الداخلية مستقبلاً
    } else {
        showToast('خطأ: البريد أو كلمة المرور غير مطابقة لصاحب الحساب!');
    }
}
