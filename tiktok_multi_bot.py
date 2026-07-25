import os
import time
import requests

# --- إعدادات التجربة لحساب واحد ---
TOTAL_ACCOUNTS = 1  

# قائمة التعليقات المجهزة لتفادي حظر السبام
COMMENTS = [
    "منور البث يا غالي! 👍", "محتوى أسطوري استمر 🔥", "الصوت والصورة واضحة جداً",
    "تفاعل رائع من المتابعين", "أقوى بث مباشر اليوم! 🚀", "دعمكم يا شباب للمبدع",
    "سؤال سريع: متى موعد البث القادم؟", "توب التوب كالعادة", "شكراً لك على هذا البث المفيد",
    "بالتوفيق والنجاح الدائم"
]

# 🔑 ضع رمز الـ Session ID الخاص بحسابك التجريبي بين القوسين بالأسفل
ACCOUNT_TOKENS = [
    "ضع_رمز_الحساب_هنا"
]

def get_room_id(target_user):
    """جلب معرّف الغرفة الرقمي (Room ID) الخاص بالبث المباشر عبر اسم المستخدم"""
    url = f"https://tiktok.com{target_user}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
    }
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            # استخراج الـ Room ID من البيانات المستلمة
            return data.get("liveRoomInfo", {}).get("roomInfo", {}).get("roomId")
    except:
        return None
    return None

def send_comment_via_api(token, room_id, comment_text):
    """إرسال التعليق عبر الطلبات البرمجية الخلفية"""
    url = "https://tiktok.com" 
    headers = {
        "Cookie": f"sessionid={token}",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    payload = {
        "text": comment_text,
        "room_id": room_id
    }
    try:
        response = requests.post(url, data=payload, headers=headers)
        if response.status_code == 200 and '"status_code":0' in response.text:
            return True
        return False
    except:
        return False

if __name__ == "__main__":
    print("🤖 بوت تعليقات تيك توك الخفيف للهواتف")
    target_user = input("✍️ أدخل يوزر الحساب المستهدف (بدون علامة @): ").strip()
    
    if not target_user:
        print("❌ اسم المستخدم لا يمكن أن يكون فارغاً.")
        exit()
        
    print(f"🔍 جاري البحث عن البث المباشر لـ @{target_user}...")
    room_id = get_room_id(target_user)
    
    if not room_id:
        # إذا فشل الجلب التلقائي، نتيح للمستخدم إدخاله يدوياً كخيار احتياطي
        print("⚠️ لم يتم العثور على معرّف البث تلقائياً (تأكد أن الحساب فاتح بث حالياً).")
        room_id = input("👉 أو أدخل رقم الـ Room ID الخاص بالبث يدوياً إن وجد: ").strip()
    
    if room_id:
        print(f"🚀 بدء تشغيل البوت لإرسال التعليق إلى البث الرقمي: {room_id}...")
        
        token = ACCOUNT_TOKENS[0]
        if token == "ضع_رمز_الحساب_هنا":
            print("❌ خطأ: يرجى وضع رمز الـ Session ID الحقيقي الخاص بك في الكود أولاً.")
            exit()
            
        comment = COMMENTS[0]
        print(f"🔄 جاري محاولة إرسال التعليق التجريبي...")
        
        success = send_comment_via_api(token, room_id, comment)
        if success:
            print(f"✅ تم إرسال التعليق بنجاح من حسابك: {comment}")
        else:
            print(f"❌ فشل الإرسال (تأكد من صلاحية الـ Session ID وأن البث نشط حالياً)")
    else:
        print("❌ تعذر بدء البوت لعدم توفر معرّف البث.")
        
