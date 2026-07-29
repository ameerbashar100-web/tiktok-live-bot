document.addEventListener('DOMContentLoaded', function(){
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(a=>{
    a.addEventListener('click', function(e){
      // if link has href and is same-origin, navigate normally; prevent default to handle single-page feel
      const href = this.getAttribute('href');
      if(!href) return;
      e.preventDefault();
      // go to href (works on static hosting)
      window.location.href = href;
    });
  });

  // set active based on current path
  const path = location.pathname;
  navItems.forEach(a=>{
    const href = a.getAttribute('href');
    if(!href) return;
    try{
      // compare filenames
      const hrefName = href.split('/').pop();
      const pathName = path.split('/').pop();
      if(hrefName === pathName){
        a.classList.add('active');
        const center = a.querySelector('.center-btn');
        if(center) center.style.boxShadow='0 10px 30px rgba(11,99,197,0.28)';
      }
    }catch(e){}
  });
});
