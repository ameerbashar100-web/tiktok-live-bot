(() => {
  'use strict';

  // منع إنشاء شريط التنقل أكثر من مرة
  const oldNav = document.querySelector('[data-site-bottom-nav]');
  if (oldNav) oldNav.remove();

  /*
   * تحديد الصفحة الحالية
   * أولاً من اسم الملف، ثم من محتوى الصفحة.
   */
  const path = window.location.pathname.toLowerCase();
  const currentFile = path.split('/').pop() || '';

  let active = 'main';

  if (
    currentFile === 'page3.html' ||
    /profile|الملف\s*الشخصي/i.test(document.body.innerText)
  ) {
    active = 'profile';

  } else if (
    currentFile === 'page2.html' ||
    /shop|المتجر/i.test(document.body.innerText)
  ) {
    active = 'shop';

  } else {
    active = 'main';
  }


  /*
   * 3 أيقونات فقط
   * Main - Shop - Profile
   */
  const items = [
    {
      key: 'main',
      text: 'Main',
      href: new URL('page1.html', window.location.href).href,

      icon: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect
            x="3.5"
            y="3.5"
            width="6.5"
            height="6.5"
            rx="1.4"
          />

          <rect
            x="14"
            y="3.5"
            width="6.5"
            height="6.5"
            rx="1.4"
          />

          <rect
            x="3.5"
            y="14"
            width="6.5"
            height="6.5"
            rx="1.4"
          />

          <rect
            x="14"
            y="14"
            width="6.5"
            height="6.5"
            rx="1.4"
          />
        </svg>
      `
    },


    {
      key: 'shop',
      text: 'Shop',
      href: new URL('page2.html', window.location.href).href,

      icon: `
        <svg viewBox="0 0 24 24" aria-hidden="true">

          <path
            d="M4 8.5h16v10.2
               a2 2 0 0 1-2 2H6
               a2 2 0 0 1-2-2z"
          />

          <path
            d="M5 8.5L7 4h10l2 4.5"
          />

          <path
            d="M8 8.5v2.2
               a4 4 0 0 0 8 0V8.5"
          />

        </svg>
      `
    },


    {
      key: 'profile',
      text: 'Profile',
      href: new URL('page3.html', window.location.href).href,

      icon: `
        <svg viewBox="0 0 24 24" aria-hidden="true">

          <circle
            cx="12"
            cy="7.2"
            r="3.5"
          />

          <path
            d="M5.2 20
               c.7-3.8 3-5.8 6.8-5.8
               s6.1 2 6.8 5.8z"
          />

        </svg>
      `
    }
  ];


  /*
   * إنشاء شريط التنقل
   */
  const nav = document.createElement('nav');

  nav.setAttribute(
    'data-site-bottom-nav',
    ''
  );

  nav.setAttribute(
    'aria-label',
    'Main navigation'
  );


  /*
   * إنشاء الأيقونات
   */
  nav.innerHTML = items.map(item => {

    const isActive =
      active === item.key
        ? ' active'
        : '';

    return `
      <a
        class="site-nav-item${isActive}"
        href="${item.href}"
      >

        <span class="site-nav-icon">
          ${item.icon}
        </span>

        <span class="site-nav-label">
          ${item.text}
        </span>

      </a>
    `;

  }).join('');


  /*
   * CSS الخاص بشريط التنقل
   */
  const style = document.createElement('style');

  style.textContent = `

    [data-site-bottom-nav] {

      position: fixed !important;

      left: 50% !important;

      bottom: 16px !important;

      transform:
        translateX(-50%) !important;

      z-index: 2147483647 !important;


      width:
        min(92vw, 620px) !important;

      height: 86px !important;


      padding:
        7px 12px !important;

      box-sizing:
        border-box !important;


      display: grid !important;

      grid-template-columns:
        repeat(3, 1fr) !important;

      gap: 8px !important;


      border-radius:
        27px !important;


      background:
        rgba(15, 18, 16, .94) !important;


      border:
        1px solid
        rgba(255, 255, 255, .10) !important;


      box-shadow:
        0 18px 50px
        rgba(0, 0, 0, .55),

        inset 0 1px 0
        rgba(255, 255, 255, .04) !important;


      backdrop-filter:
        blur(18px) !important;

      -webkit-backdrop-filter:
        blur(18px) !important;
    }


    /*
     * الأزرار
     */
    [data-site-bottom-nav]
    .site-nav-item {

      height: 72px !important;

      display: flex !important;

      flex-direction:
        column !important;

      align-items:
        center !important;

      justify-content:
        center !important;

      gap: 4px !important;


      color:
        #8b908d !important;


      background:
        transparent !important;


      text-decoration:
        none !important;


      border:
        0 !important;


      border-radius:
        20px !important;


      -webkit-tap-highlight-color:
        transparent !important;
    }


    /*
     * الأيقونة النشطة
     */
    [data-site-bottom-nav]
    .site-nav-item.active {

      color:
        #b7ff20 !important;


      filter:
        drop-shadow(
          0 0 8px
          rgba(183, 255, 32, .30)
        ) !important;
    }


    /*
     * مكان الأيقونة
     */
    [data-site-bottom-nav]
    .site-nav-icon {

      width: 34px !important;

      height: 35px !important;


      display: flex !important;

      align-items:
        center !important;

      justify-content:
        center !important;


      visibility:
        visible !important;

      opacity:
        1 !important;
    }


    /*
     * شكل الأيقونات
     */
    [data-site-bottom-nav]
    .site-nav-icon svg {

      display: block !important;


      width: 30px !important;

      height: 30px !important;


      fill:
        none !important;


      stroke:
        currentColor !important;


      stroke-width:
        1.7 !important;


      stroke-linecap:
        round !important;


      stroke-linejoin:
        round !important;


      visibility:
        visible !important;


      opacity:
        1 !important;
    }


    /*
     * أسماء الأيقونات
     */
    [data-site-bottom-nav]
    .site-nav-label {

      display: block !important;


      color:
        currentColor !important;


      font-family:
        system-ui,
        -apple-system,
        "Segoe UI",
        Tahoma,
        Arial,
        sans-serif !important;


      font-size:
        14px !important;


      line-height:
        1 !important;


      font-weight:
        650 !important;


      visibility:
        visible !important;


      opacity:
        1 !important;
    }


    /*
     * الهواتف الصغيرة
     */
    @media (max-width: 480px) {

      [data-site-bottom-nav] {

        width:
          92vw !important;

        height:
          84px !important;

        bottom:
          14px !important;
      }


      [data-site-bottom-nav]
      .site-nav-icon svg {

        width:
          29px !important;

        height:
          29px !important;
      }
    }

  `;


  /*
   * إضافة CSS والـ Navigation إلى الصفحة
   */
  document.head.appendChild(style);

  document.body.appendChild(nav);

})();
