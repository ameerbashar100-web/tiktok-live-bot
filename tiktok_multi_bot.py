import os
import time
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

# عدد الحسابات المستهدفة التي تملكها
TOTAL_ACCOUNTS = 20  

# قائمة التعليقات المجهزة لتفادي حظر السبام
COMMENTS = [
    "منور البث يا غالي! 👍", "محتوى أسطوري استمر 🔥", "الصوت والصورة واضحة جداً",
    "تفاعل رائع من المتابعين", "أقوى بث مباشر اليوم! 🚀", "دعمكم يا شباب للمبدع",
    "سؤال سريع: متى موعد البث القادم؟", "توب التوب كالعادة", "شكراً لك على هذا البث المفيد",
    "بالتوفيق والنجاح الدائم", "بث مميز جداً هاد اليوم", "كفو والله مبدع",
    "تحياتي لك من المتابعين", "استمر ولا تتوقف", "أفضل صانع محتوى",
    "روعة الروعة", "الله يسعدك ويسعد ه البث", "تفاعل ناري", "منورين جميعاً", "جيش الداعمين هنا"
]

PROFILES_DIR = os.path.join(os.getcwd(), "tiktok_profiles")

def setup_accounts():
    """تجهيز الحسابات الـ 20 وتسجيل الدخول فيها للمرة الأولى فقط"""
    print("\n--- 🛠️ مرحلة تسجيل دخول الحسابات الـ 20 ---")
    for i in range(1, TOTAL_ACCOUNTS + 1):
        print(f"\n👤 جاري تجهيز الحساب رقم ({i}/{TOTAL_ACCOUNTS})...")
        options = uc.ChromeOptions()
        options.add_argument(f"--user-data-dir={PROFILES_DIR}")
        options.add_argument(f"--profile-directory=Account_{i}")
        
        driver = uc.Chrome(options=options)
        driver.get("https://tiktok.com")
        
        print(f"⚠️ سجل الدخول يدويًا للحساب رقم {i} الآن في المتصفح المفتوح واجتاز الكابتشا.")
        input("👉 اضغط Enter هنا بعد إتمام تسجيل الدخول بنجاح للانتقال للحساب التالي...")
        driver.quit()
        time.sleep(2)

def start_commenting_bot(target_user):
    """تشغيل البوت وإرسال التعليقات إلى اليوزر الذي اخترته"""
    live_url = f"https://tiktok.com@{target_user}/live"
    print(f"\n🚀 بدء إرسال التعليقات التلقائية إلى بث: {live_url}")
    
    for i in range(1, TOTAL_ACCOUNTS + 1):
        print(f"\n🔄 دور الحساب رقم ({i}/{TOTAL_ACCOUNTS})...")
        options = uc.ChromeOptions()
        options.add_argument(f"--user-data-dir={PROFILES_DIR}")
        options.add_argument(f"--profile-directory=Account_{i}")
        options.add_argument("--mute-audio") 
        
        try:
            driver = uc.Chrome(options=options)
            driver.get(live_url)
            time.sleep(8)  # وقت تحميل الصفحة
            
            selectors = ['//div[@contenteditable="true"]', '//textarea', '//div[contains(@class, "ChatInput")]']
            comment_box = None
            for selector in selectors:
                try:
                    comment_box = driver.find_element(By.XPATH, selector)
                    if comment_box: break
                except: continue
            
            if comment_box:
                current_comment = COMMENTS[(i - 1) % len(COMMENTS)]
                comment_box.click()
                comment_box.send_keys(current_comment)
                time.sleep(1)
                comment_box.send_keys(Keys.ENTER)
                
                print(f"✅ الحساب {i} أرسل بنجاح إلى @{target_user}: {current_comment}")
                time.sleep(3)
            else:
                print(f"❌ الحساب {i}: لم يجد صندوق الكتابة (تأكد من تسجيل الدخول)")
                
        except Exception as e:
            print(f"❌ خطأ في الحساب رقم {i}: {e}")
        finally:
            driver.quit()
            time.sleep(5) 

if __name__ == "__main__":
    print("🤖 مرحباً بك في بوت تعليقات تيك توك المتعددة")
    print("1. تسجيل دخول وتجهيز الحسابات الـ 20 (أول مرة فقط)")
    print("2. تشغيل البوت لإرسال التعليقات إلى البث مباشرة")
    
    choice = input("اختر رقم العملية (1 أو 2): ").strip()
    if choice == "1":
        setup_accounts()
        print("\n🎉 تم حفظ جلسات الـ 20 حساباً بنجاح! يمكنك تشغيل البوت الآن.")
    elif choice == "2":
        username = input("✍️ أدخل يوزر الحساب المستهدف (بدون علامة @): ").strip()
        if username:
            start_commenting_bot(username)
        else:
            print("❌ اسم المستخدم لا يمكن أن يكون فارغاً.")
    else:
        print("اختيار خاطئ.")
                  
