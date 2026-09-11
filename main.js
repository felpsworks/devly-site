(function(){
  // ---- mobile menu ----
  var btn = document.getElementById('menuBtn');
  var nav = document.getElementById('navLinks');
  if(btn && nav){
    btn.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded','false');
      });
    });
  }

  // ---- "Serviços" dropdown ----
  document.querySelectorAll('.nav-dropdown').forEach(function(dd){
    var ddBtn = dd.querySelector('.nav-dropdown-btn');
    if(!ddBtn) return;
    ddBtn.addEventListener('click', function(e){
      e.stopPropagation();
      var isOpen = dd.classList.toggle('open');
      ddBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function(e){
    document.querySelectorAll('.nav-dropdown.open').forEach(function(dd){
      if(!dd.contains(e.target)){
        dd.classList.remove('open');
        dd.querySelector('.nav-dropdown-btn').setAttribute('aria-expanded','false');
      }
    });
  });

  // ---- navbar scroll state (discrete style swap, not motion) ----
  var navHeader = document.querySelector('header.nav');
  if(navHeader){
    var onNavScroll = function(){
      if(window.scrollY > 12) navHeader.classList.add('scrolled');
      else navHeader.classList.remove('scrolled');
    };
    document.addEventListener('scroll', onNavScroll, {passive:true});
    onNavScroll();
  }

  // ---- lead form: turns what's typed into a ready-to-send WhatsApp/e-mail message ----
  var leadNome = document.getElementById('leadNome');
  var leadWhats = document.getElementById('leadWhats');
  var leadEmpresa = document.getElementById('leadEmpresa');
  var leadSegmento = document.getElementById('leadSegmento');
  var leadTipo = document.getElementById('leadTipo');
  var leadIdeia = document.getElementById('leadIdeia');
  var leadFaixa = document.getElementById('leadFaixa');
  var leadSubmitBtn = document.getElementById('leadSubmitBtn');
  var leadEmailLink = document.getElementById('leadEmailLink');
  if(leadSubmitBtn){
    var LEAD_WA_NUMBER = '5519981862800';
    var LEAD_EMAIL = 'contatodevly@gmail.com';
    var checkedValue = function(group){
      if(!group) return '';
      var el = group.querySelector('input:checked');
      return el ? el.value : '';
    };
    var buildLeadMessage = function(){
      var nome = leadNome ? leadNome.value.trim() : '';
      var whats = leadWhats ? leadWhats.value.trim() : '';
      var empresa = leadEmpresa ? leadEmpresa.value.trim() : '';
      var segmento = leadSegmento ? leadSegmento.value : '';
      var tipo = checkedValue(leadTipo);
      var ideia = leadIdeia ? leadIdeia.value.trim() : '';
      var faixa = checkedValue(leadFaixa);
      var msg = 'Olá!';
      if(nome) msg += ' Meu nome é ' + nome + '.';
      if(empresa) msg += ' Empresa: ' + empresa + '.';
      if(segmento) msg += ' Segmento: ' + segmento + '.';
      if(tipo) msg += ' Preciso de: ' + tipo + '.';
      if(ideia) msg += ' Quero conversar sobre isto: ' + ideia + (/[.!?]$/.test(ideia) ? '' : '.');
      else msg += ' Vim pelo site da DEVLY e quero conversar sobre um projeto.';
      if(faixa) msg += ' Faixa de investimento: ' + faixa + '.';
      if(whats) msg += ' (Meu contato: ' + whats + ')';
      return msg;
    };
    var updateLeadLinks = function(){
      var msg = buildLeadMessage();
      leadSubmitBtn.href = 'https://wa.me/' + LEAD_WA_NUMBER + '?text=' + encodeURIComponent(msg);
      if(leadEmailLink){
        leadEmailLink.href = 'mailto:' + LEAD_EMAIL + '?subject=' + encodeURIComponent('Contato pelo site da DEVLY') + '&body=' + encodeURIComponent(msg);
      }
    };
    [leadNome, leadWhats, leadEmpresa, leadSegmento, leadIdeia].forEach(function(f){
      if(f) f.addEventListener('input', updateLeadLinks);
    });
    [leadSegmento].forEach(function(f){
      if(f) f.addEventListener('change', updateLeadLinks);
    });
    [leadTipo, leadFaixa].forEach(function(group){
      if(group) group.addEventListener('change', updateLeadLinks);
    });
    updateLeadLinks();
  }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduceMotion) return; // everything below is a motion enhancement; HTML/CSS defaults already show the finished, correct state

  // let the lateral phone entrance play once, then drop the animation classes
  document.querySelectorAll('.phone-enter-l, .phone-enter-r').forEach(function(p){
    p.addEventListener('animationend', function(){
      p.classList.remove('phone-enter-l','phone-enter-r');
    }, {once:true});
  });

  // ---- credibility numbers: count up once in view (cheap, one-shot) ----
  var statNums = document.querySelectorAll('.stat-num[data-count-to]');
  if(statNums.length && 'IntersectionObserver' in window){
    var animateCount = function(el){
      var target = parseFloat(el.getAttribute('data-count-to'));
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      var padWidth = parseInt(el.getAttribute('data-pad') || '0', 10);
      var fmt = function(n){
        var s = String(n);
        while(s.length < padWidth) s = '0' + s;
        return prefix + s + suffix;
      };
      var dur = 1100, start = null;
      function step(ts){
        if(!start) start = ts;
        var p = Math.min(1, (ts - start) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(Math.round(target * eased));
        if(p < 1) requestAnimationFrame(step);
        else el.textContent = fmt(target);
      }
      requestAnimationFrame(step);
    };
    var statsObs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ animateCount(entry.target); statsObs.unobserve(entry.target); }
      });
    }, {threshold:.6});
    statNums.forEach(function(el){ statsObs.observe(el); });
  }
})();
