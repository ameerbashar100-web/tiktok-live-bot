// App JS: simplified registration/login flow for GAT
(function(){
  const $ = (s,ctx=document)=>ctx.querySelector(s);
  const $$ = (s,ctx=document)=>Array.from(ctx.querySelectorAll(s));

  const registerForm = $('#registerForm');
  const loginForm = $('#loginForm');
  const regPanel = $('#registerPanel');
  const logPanel = $('#loginPanel');
  const dashPanel = $('#dashPanel');
  const haveAccount = $('#haveAccount');
  const dashUser = $('#dashUser');

  // helpers for users storage
  function getUsers(){ try{ return JSON.parse(localStorage.getItem('gat_users')||'[]'); }catch(e){return[]} }
  function saveUsers(users){ localStorage.setItem('gat_users', JSON.stringify(users)); }
  function addUser(u){ const users=getUsers(); users.push(u); saveUsers(users); }
  function findUserByEmail(email){ return getUsers().find(x=>x.email===email); }

  // show panels
  function showPanel(id){ regPanel.setAttribute('aria-hidden','true'); logPanel.setAttribute('aria-hidden','true'); dashPanel.setAttribute('aria-hidden','true');
    if(id==='register') regPanel.removeAttribute('aria-hidden');
    if(id==='login') logPanel.removeAttribute('aria-hidden');
    if(id==='dash') dashPanel.removeAttribute('aria-hidden');
  }

  // restrict password to English letters & digits (remove Arabic chars/spaces)
  $('#regPass').addEventListener('input', function(){ this.value = this.value.replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s]/g,''); });
  $('#logPass').addEventListener('input', function(){ this.value = this.value.replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s]/g,''); });

  // register submit (Nix button)
  registerForm.addEventListener('submit', function(e){
    e.preventDefault();
    const user = $('#regUser').value.trim();
    const email = $('#regEmail').value.trim().toLowerCase();
    const pass = $('#regPass').value;
    const code = $('#regCode').value;
    if(!user||!email||!pass||!code){ alert('الرجاء تعبئة كل الحقول'); return; }
    // simple duplicate check
    if(findUserByEmail(email)){ alert('هذا الحساب موجود مسبقاً'); return; }
    addUser({user,email,pass});
    // create session
    localStorage.setItem('gat_session', JSON.stringify({email,user}));
    // go to page 3
    showPanel('dash');
    renderDashboard();
  });

  // have account -> go to login
  haveAccount.addEventListener('click', ()=>{ showPanel('login'); });

  // login submit
  loginForm.addEventListener('submit', function(e){
    e.preventDefault();
    const email = $('#logEmail').value.trim().toLowerCase();
    const pass = $('#logPass').value;
    const u = findUserByEmail(email);
    if(!u || u.pass!==pass){ alert('بيانات الدخول غير صحيحة'); return; }
    localStorage.setItem('gat_session', JSON.stringify({email,user:u.user}));
    showPanel('dash');
    renderDashboard();
  });

  function renderDashboard(){ const s = JSON.parse(localStorage.getItem('gat_session')||'null'); if(!s) return; dashUser.textContent = 'المستخدم: '+s.user+' ('+s.email+')'; }

  // bottom nav actions
  document.addEventListener('click', function(e){ const btn = e.target.closest('.nav-icon'); if(!btn) return; const t = btn.dataset.target; alert('تنقل إلى '+t); });

  // initial
  document.addEventListener('DOMContentLoaded', function(){ const s = JSON.parse(localStorage.getItem('gat_session')||'null'); if(s){ showPanel('dash'); renderDashboard(); } else { showPanel('register'); } });

})();
