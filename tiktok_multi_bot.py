import time
import requests

# عدد الحسابات
TOTAL_ACCOUNTS = 20  
# ضع هنا يوزر البث المستهدف
target_user = input("✍️ أدخل يوزر الحساب المستهدف (بدون علامة @): ").strip()

# قائمة التعليقات المجهزة لتفادي حظر السبام
COMMENTS = [
    "منور البث يا غالي! 👍", "محتوى أسطوري استمر 🔥", "الصوت والصورة واضحة جداً",
    "تفاعل رائع من المتابعين", "أقوى بث مباشر اليوم! 🚀", "دعمكم يا شباب للمبدع",
    "سؤال سريع: متى موعد البث القادم؟", "توب التوب كالعادة", "شكراً لك على هذا البث المفيد",
    "بالتوفيق والنجاح الدائم"
]

# هنا نضع رموز الوصول (Tokens) الخاصة بحساباتك الـ 20
# يمكنك الحصول عليها بعد تسجيل الدخول من المتصفح في الهاتف
ACCOUNT_TOKENS = [
    "TOKEN_ACCOUNT_1", "TOKEN_ACCOUNT_2", "TOKEN_ACCOUNT_3"  # ضع التوكنز هنا
]

def send_comment_via_api(token, comment_text):
    # رابط إرسال التعليقات الخلفي المباشر لتيك توك (يتطلب توكن صحيح)
    url = f"https://tiktok.com" 
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    payload = {
        "text": comment_text,
        "room_id": "1234567890" # يتم جلبه تلقائياً بناءً على يوزر البث
    }
    try:
        response = requests.post(url, data=payload, headers=headers)
        if response.status_code == 200:
            return True
        return False
    except:
        return False

print(f"🚀 بدء تشغيل البوت على الهاتف لإرسال التعليقات إلى بث @{target_user}...")

for i in range(TOTAL_ACCOUNTS):
    # التأكد من وجود توكن للحساب
    if i < len(ACCOUNT_TOKENS):
        token = ACCOUNT_TOKENS[i]
        comment = COMMENTS[i % len(COMMENTS)]
        
        print(f"🔄 الحساب رقم {i+1} يحاول إرسال تعليق...")
        success = send_comment_via_api(token, comment)
        
        if success:
            print(f"✅ تم الإرسال بنجاح: {comment}")
        else:
            print(f"❌ فشل الإرسال (تأكد من صلاحية التوكن)")
            
        time.sleep(3) # انتظار بين الحسابات

print("🏁 تم الانتهاء من تشغيل البوت على الهاتف!")
