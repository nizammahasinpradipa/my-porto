(function(){
  var root=document.documentElement,$=function(s){return document.querySelector(s)};
  $('#year').textContent=new Date().getFullYear();

  /* theme */
  try{var t=localStorage.getItem('theme');if(t)root.setAttribute('data-theme',t)}catch(e){}
  $('#theme').addEventListener('click',function(){
    var dark=root.getAttribute('data-theme')?root.getAttribute('data-theme')==='dark':matchMedia('(prefers-color-scheme:dark)').matches;
    var next=dark?'light':'dark';root.setAttribute('data-theme',next);
    try{localStorage.setItem('theme',next)}catch(e){}
  });

  /* mobile menu */
  var nav=$('#nav'),mb=$('#menuBtn');
  function setMenu(o){nav.classList.toggle('open',o);mb.setAttribute('aria-expanded',String(o));mb.setAttribute('aria-label',o?'Close menu':'Open menu')}
  mb.addEventListener('click',function(){setMenu(!nav.classList.contains('open'))});
  nav.addEventListener('click',function(e){if(e.target.closest('a'))setMenu(false)});

  /* active nav on scroll */
  var sections=document.querySelectorAll('section[id]');
  var navLinks=document.querySelectorAll('nav a');
  function onScroll(){
    var y=window.scrollY+80,active='home';
    sections.forEach(function(s){if(s.offsetTop<=y)active=s.id});
    navLinks.forEach(function(a){
      var on=a.getAttribute('href')==='#'+active;
      a.classList.toggle('active',on);
      if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* toast for unbuilt pages */
  var toast=$('#toast'),tt;
  document.addEventListener('click',function(e){
    var a=e.target.closest('[data-soon]');if(!a)return;
    e.preventDefault();
    toast.textContent=a.getAttribute('data-soon')+' section is coming soon.';
    toast.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('show')},2200);
  });

  /* ===== IMAGES – edit paths here in the code ===== */
  var PROFILE_IMAGE='profile.jpeg';            /* e.g. 'images/me.jpg' */
  var PROJECT_IMAGES=['calc.png','login.png','quiz.png','porto.png']; /* Calculator, Login System, Quiz App, Portfolio — add paths here */
  function setImage(el,src){if(!el||!src)return;el.style.backgroundImage='url("'+src+'")';el.classList.add('filled')}
  setImage($('#photo'),PROFILE_IMAGE);
  setImage($('#photo2'),PROFILE_IMAGE);

  /* ===== CV – put the PDF path here ===== */
  var CV_URL='';
  document.addEventListener('click',function(e){
    var a=e.target.closest('[data-cv]');if(!a)return;e.preventDefault();
    if('https://drive.google.com/file/d/1pneDXhhyvrhiNFRnn8J-DB9q9grveQ0n/view?usp=sharing'){window.open('https://drive.google.com/file/d/1pneDXhhyvrhiNFRnn8J-DB9q9grveQ0n/view?usp=sharing','_blank')}
    else{toast.textContent='Add your CV path in CV_URL in the code.';toast.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('show')},2600)}
  });

  /* ===== BACKGROUND TIMELINE ===== */
  var BACKGROUND=[
    {when:'Now',title:'Software Engineering major, 10th grade',place:'SMK Telkom Malang',text:'Vocational study – learning to build software and websites with JavaScript, HTML and CSS.'},
    {when:'Goal',title:'Professional software engineer and web developer',place:'',text:'Building applications and websites that are good for people.'}
  ];
  $('#timeline').innerHTML=BACKGROUND.map(function(b){
    return '<li><p class="when">'+b.when+'</p><h3>'+b.title+'</h3>'+(b.place?'<p class="place">'+b.place+'</p>':'')+'<p class="txt">'+b.text+'</p></li>';
  }).join('');

  /* ===== PROJECT CARDS ===== */
  var data=[
    ['Calculator',       [['brands','html5','HTML'],['brands','css3-alt','CSS'],['brands','js','JavaScript']],'A web-based calculator that handles basic arithmetic operations, built with vanilla JavaScript.','calc'],
    ['Login System',     [['brands','php','PHP'],['solid','database','MySQL'],['brands','html5','HTML']],'A user authentication system with register and login pages, built with PHP and a MySQL database.','login'],
    ['Quiz App',         [['brands','html5','HTML'],['brands','css3-alt','CSS'],['brands','js','JavaScript']],'An interactive quiz that shows questions one by one, tracks your score, and shows the result at the end.','quiz'],
    ['Portfolio Website',[['brands','html5','HTML'],['brands','css3-alt','CSS'],['brands','js','JavaScript']],'This portfolio site — a single-page layout showcasing my profile, skills, and projects.','portfolio']
  ];
  var track=$('#track'),slider=$('#slider');
  data.forEach(function(d,n){
    var c=document.createElement('article');c.className='card';
    c.innerHTML='<div class="ph" role="img" aria-label="'+d[0]+' project image"><span class="ph-hint"><i class="fa-solid fa-image"></i>Project image</span></div>'+
      '<div class="info"><h3>'+d[0]+'</h3><p>'+d[2]+'</p>'+
      '<ul class="tags">'+d[1].map(function(t){return '<li><i class="fa-'+t[0]+' fa-'+t[1]+'"></i>'+t[2]+'</li>'}).join('')+'</ul>'+
      '<a class="btn small primary more" href="#project-'+d[3]+'"><i class="fa-solid fa-arrow-up-right-from-square"></i>View project</a></div>';
    setImage(c.querySelector('.ph'),PROJECT_IMAGES[n]);
    track.appendChild(c);
  });

  /* continuous slider */
  var x=0,nudge=0,last=0,hover=false,busy=false,
      userPaused=matchMedia('(prefers-reduced-motion:reduce)').matches,SPEED=36;

  function wrap(){
    var f;
    while((f=track.firstElementChild)&&x>=f.offsetWidth+20){x-=f.offsetWidth+20;track.appendChild(f)}
    while(x<0){var l=track.lastElementChild;x+=l.offsetWidth+20;track.insertBefore(l,track.firstElementChild)}
  }
  function frame(now){
    var dt=Math.min((now-last)/1000,.05);last=now;
    if(!userPaused&&!hover&&!busy)x+=SPEED*dt;
    if(nudge){var s=Math.abs(nudge)<1?nudge:nudge*.12;x+=s;nudge-=s}
    wrap();track.style.transform='translate3d('+(-x)+'px,0,0)';
    requestAnimationFrame(frame);
  }
  function step(dir){nudge+=dir*(track.firstElementChild.offsetWidth+20)}
  $('#prev').addEventListener('click',function(){step(-1)});
  $('#next').addEventListener('click',function(){step(1)});
  slider.addEventListener('mouseenter',function(){hover=true});
  slider.addEventListener('mouseleave',function(){hover=false});
  slider.addEventListener('focusin',function(){busy=true});
  slider.addEventListener('focusout',function(){busy=false});
  var down=false,px=0,moved=false;
  slider.addEventListener('pointerdown',function(e){down=true;moved=false;px=e.clientX});
  slider.addEventListener('pointermove',function(e){
    if(!down)return;var d=e.clientX-px;
    if(!moved&&Math.abs(d)<6)return;
    if(!moved){moved=true;slider.classList.add('drag');try{slider.setPointerCapture(e.pointerId)}catch(_){}}
    x-=d;px=e.clientX;
  });
  function up(){down=false;slider.classList.remove('drag')}
  slider.addEventListener('pointerup',up);slider.addEventListener('pointercancel',up);
  slider.addEventListener('click',function(e){if(moved){e.stopPropagation();e.preventDefault();moved=false}},true);
  requestAnimationFrame(function(t){last=t;frame(t)});

  /* animate skill bars when they scroll into view */
  document.querySelectorAll('.skill-bar-fill').forEach(function(bar){
    bar.style.width=(parseFloat(bar.style.getPropertyValue('--w')||0)*100)+'%';
  });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}});
    },{threshold:.3});
    document.querySelectorAll('.skill-bar-fill').forEach(function(b){io.observe(b)});
  } else {
    document.querySelectorAll('.skill-bar-fill').forEach(function(b){b.classList.add('show')});
  }

  /* contact form */
  var form=$('#contactForm'),status=$('#formStatus');
  form&&form.addEventListener('submit',function(e){
    e.preventDefault();
    var name=$('#cf-name').value.trim(),email=$('#cf-email').value.trim(),msg=$('#cf-msg').value.trim();
    var emailOk=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    status.className='form-status';
    if(!name||!email||!msg){
      status.textContent='Please fill in your name, email and message.';status.classList.add('err');return;
    }
    if(!emailOk){
      status.textContent='Please enter a valid email address.';status.classList.add('err');return;
    }
    /* ── TO CONNECT A REAL BACKEND: replace this block with your Formspree/EmailJS call ── */
    status.textContent='✓ Message sent! I\'ll get back to you soon.';status.classList.add('ok');
    form.reset();
  });

  /* gallery project images */
  for(var gi=0;gi<PROJECT_IMAGES.length;gi++){
    setImage($('#proj-img-'+gi),PROJECT_IMAGES[gi]);
  }

  /* filter buttons */
  var filterBtns=document.querySelectorAll('.filter-btn');
  var projCards=document.querySelectorAll('.proj-card');
  filterBtns.forEach(function(btn){
    btn.addEventListener('click',function(){
      filterBtns.forEach(function(b){b.classList.remove('on')});
      btn.classList.add('on');
      var f=btn.getAttribute('data-filter');
      projCards.forEach(function(card){
        var cat=card.getAttribute('data-cat')||'';
        card.classList.toggle('hide', f!=='all' && cat.indexOf(f)===-1);
      });
    });
  });
})();