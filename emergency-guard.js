<!-- Emergency client-side guard: disable any Nix action and force perf-card layout -->
<script>
(function(){
  // Prevent accidental charges by disabling Nix buttons and intercepting clicks
  function guardNix(){
    const buttons = Array.from(document.querySelectorAll('#nixBtn, .btn-nix'));
    if(buttons.length){
      buttons.forEach(btn=>{
        // visually disable
        btn.classList.add('btn-disabled');
        // ensure disabled attribute where possible
        try{ btn.disabled = true; }catch(e){}
        // intercept clicks anyway
        btn.addEventListener('click', function(e){
          e.preventDefault(); e.stopPropagation();
          // show a clear immediate message
          try{ alert('تم تعطيل زر الشحن مؤقتاً لحماية رصيدك'); }catch(err){}
        }, {capture:true});
      });
    }
  }

  function fixPerfCard(){
    const cards = document.querySelectorAll('.perf-card');
    cards.forEach(c=>{
      c.style.display = 'flex';
      c.style.flexDirection = 'row';
      c.style.justifyContent = 'space-between';
      c.style.alignItems = 'center';
      c.style.direction = 'ltr';
      // ensure child sizes
      const left = c.querySelector('.perf-left');
      if(left){ left.style.textAlign = 'left'; left.style.alignItems = 'flex-start'; }
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    guardNix();
    fixPerfCard();
    // also run again after a short delay in case elements load later
    setTimeout(()=>{ guardNix(); fixPerfCard(); }, 300);
  });
})();
</script>
