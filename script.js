let activeProfitRate = 0;
let currentTotalProfit = 0.00;
let profitInterval = null;

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

function showToast(message, isSuccess = false) {
    const toast = document.getElementById('toastNotification');
    toast.textContent = message;
    toast.style.backgroundColor = isSuccess ? '#10b981' : '#ef4444';
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 1000);
}

function handleSignUp(event) {
    event.preventDefault();
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const code = document.getElementById('inviteCode').value;

    if (code !== '6134') {
        showToast('تعذر تسجيل الدخول: رمز الدعوة غير صحيح!');
        return;
    }

    localStorage.setItem('userEmail', email);
    localStorage.setItem('userPassword', password);
    showToast('تم إنشاء الحساب بنجاح!', true);
    setTimeout(() => { toggleForms(); }, 1000);
}

function handleSignIn(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const savedEmail = localStorage.getItem('userEmail');
    const savedPassword = localStorage.getItem('userPassword');

    if (email === savedEmail && password === savedPassword) {
        showToast('تم تسجيل الدخول بنجاح', true);
        document.getElementById('authContainer').style.display = 'none';
        document.getElementById('mainAppContainer').style.display = 'flex';
        document.getElementById('profileEmail').textContent = email;
        startProfitSimulation();
    } else {
        showToast('خطأ: البيانات غير مطابقة لصاحب الحساب!');
    }
}

function handleLogOut() {
    clearInterval(profitInterval);
    document.getElementById('mainAppContainer').style.display = 'none';
    document.getElementById('authContainer').style.display = 'flex';
    showToast('تم تسجيل الخروج بنجاح', true);
}

function switchPage(pageNumber) {
    document.getElementById('page1').style.display = pageNumber === 1 ? 'flex' : 'none';
    document.getElementById('page2').style.display = pageNumber === 2 ? 'flex' : 'none';
    document.getElementById('page3').style.display = pageNumber === 3 ? 'flex' : 'none';
    document.getElementById('btnPage1').classList.toggle('active', pageNumber === 1);
    document.getElementById('btnPage2').classList.toggle('active', pageNumber === 2);
    document.getElementById('btnPage3').classList.toggle('active', pageNumber === 3);
}

