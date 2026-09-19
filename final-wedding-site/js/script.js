/* =========================================================
   Arjun & Priya — Wedding Invitation Script
   ========================================================= */
(function(){
  "use strict";

  /* ---------- CONFIG: edit these to match your event ---------- */
  const CONFIG = {
    coupleNames: "Arjun & Priya",
    // Reception / main event date-time used for the countdown (local time)
    eventDateTime: "2026-11-25T19:00:00",
    // Used for the "Add to Calendar" file
    eventEnd: "2026-12-05T21:30:00",
    venueName: "Rambagh Palace, Jaipur",
    venueAddress: "Rambagh Palace, Bhawani Singh Road, Jaipur, Rajasthan 302005, India",
    calendarYear: 2026,
    calendarMonth: 11, // November
    calendarHighlightDay: 25
  };

  /* ---------- INTRO OVERLAY + MUSIC START ---------- */
  const intro = document.getElementById('intro');
  const introCard = document.getElementById('introCard');
  const introParticles = document.getElementById('introParticles');
  const flowersTL = document.getElementById('introFlowersTL');
  const flowersBR = document.getElementById('introFlowersBR');
  const btnEnter = document.getElementById('btnEnter');
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');

  document.body.style.overflow = 'hidden';

  /* ambient falling petals inside the intro overlay */
  const PETAL_GLYPHS = ['\u2740','\u273F','\u2742','\u2744'];
  function spawnAmbientPetal(){
    if (!introParticles) return;
    const el = document.createElement('span');
    el.className = 'petal';
    el.textContent = PETAL_GLYPHS[Math.floor(Math.random()*PETAL_GLYPHS.length)];
    const left = Math.random()*100;
    const duration = 7 + Math.random()*7;
    const size = 10 + Math.random()*14;
    const drift = (Math.random()*120 - 60) + 'px';
    el.style.left = left + 'vw';
    el.style.fontSize = size + 'px';
    el.style.setProperty('--drift', drift);
    el.style.animationDuration = duration + 's';
    introParticles.appendChild(el);
    setTimeout(() => el.remove(), duration*1000 + 200);
  }
  let ambientTimer = null;
  function startAmbientPetals(){
    for (let i=0;i<10;i++){ setTimeout(spawnAmbientPetal, i*350); }
    ambientTimer = setInterval(spawnAmbientPetal, 500);
  }
  function stopAmbientPetals(){ if (ambientTimer) clearInterval(ambientTimer); }
  startAmbientPetals();

  /* burst of petals blown outward from a corner, fixed to viewport */
  function burstFromCorner(cornerEl){
    const rect = cornerEl.getBoundingClientRect();
    const originX = rect.left + rect.width/2;
    const originY = rect.top + rect.height/2;
    const count = 18;
    for (let i=0;i<count;i++){
      const el = document.createElement('span');
      el.className = 'burst-petal';
      el.textContent = PETAL_GLYPHS[Math.floor(Math.random()*PETAL_GLYPHS.length)];
      const size = 10 + Math.random()*16;
      el.style.left = originX + 'px';
      el.style.top = originY + 'px';
      el.style.fontSize = size + 'px';
      el.style.color = Math.random() > 0.5 ? '#d94f6b' : '#f3c8c0';
      document.body.appendChild(el);

      const angle = Math.random()*Math.PI*2;
      const distance = 160 + Math.random()*260;
      const dx = Math.cos(angle)*distance;
      const dy = Math.sin(angle)*distance - 60; // slight upward bias
      const rot = (Math.random()*720 - 360);
      const duration = 700 + Math.random()*500;

      el.animate([
        { transform: 'translate(-50%,-50%) translate(0,0) rotate(0deg)', opacity: 1 },
        { transform: `translate(-50%,-50%) translate(${dx}px, ${dy}px) rotate(${rot}deg)`, opacity: 0 }
      ], { duration, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' });

      setTimeout(() => el.remove(), duration + 100);
    }
  }

  function enterSite(){
    btnEnter.disabled = true;
    introCard.classList.add('bursting');
    flowersTL.classList.add('blow');
    flowersBR.classList.add('blow');
    burstFromCorner(flowersTL);
    burstFromCorner(flowersBR);

    bgMusic.play().then(()=>{
      musicToggle.classList.add('playing');
    }).catch(()=>{ /* autoplay blocked, user can tap the music icon */ });

    setTimeout(() => {
      intro.classList.add('hide');
      document.body.style.overflow = '';
      stopAmbientPetals();
    }, 650);
  }
  btnEnter && btnEnter.addEventListener('click', enterSite);

  musicToggle && musicToggle.addEventListener('click', function(){
    if (bgMusic.paused){
      bgMusic.play();
      musicToggle.classList.add('playing');
    } else {
      bgMusic.pause();
      musicToggle.classList.remove('playing');
    }
  });

  /* ---------- HERO FALLING PETALS ---------- */
  const heroPetals = document.getElementById('heroPetals');
  const PETAL_SVG = '<svg viewBox="0 0 20 26" width="{s}" height="{s}"><path d="M10 0C15 5 20 10 20 16a10 10 0 01-20 0C0 10 5 5 10 0z" fill="{c}"/></svg>';
  const PETAL_COLORS = ['#c8385f', '#d6567a', '#e58aa0', '#b23052'];

  function spawnHeroPetal(){
    if (!heroPetals) return;
    const el = document.createElement('span');
    el.className = 'hero-petal';
    const size = 10 + Math.random()*10;
    const color = PETAL_COLORS[Math.floor(Math.random()*PETAL_COLORS.length)];
    el.innerHTML = PETAL_SVG.replace('{s}', size).replace('{s}', size).replace('{c}', color);
    const left = 4 + Math.random()*92;
    const duration = 9 + Math.random()*9;
    const drift = (Math.random()*140 - 70) + 'px';
    el.style.left = left + '%';
    el.style.opacity = 0.75 + Math.random()*0.2;
    el.style.setProperty('--drift', drift);
    el.style.animationDuration = duration + 's';
    heroPetals.appendChild(el);
    setTimeout(() => el.remove(), duration*1000 + 200);
  }
  for (let i=0;i<5;i++){ setTimeout(spawnHeroPetal, i*700); }
  setInterval(spawnHeroPetal, 1400);


  const navLinks = document.querySelectorAll('.side-nav a');
  const sections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute('href')));
  function updateNav(){
    let idx = 0;
    const y = window.scrollY + window.innerHeight * 0.4;
    sections.forEach((sec, i) => { if (sec && sec.offsetTop <= y) idx = i; });
    navLinks.forEach((a,i) => a.classList.toggle('active', i === idx));
  }
  window.addEventListener('scroll', updateNav, { passive:true });
  updateNav();

  /* ---------- PHOTO GALLERY COVERFLOW ---------- */
  const galleryImages = Array.from({length:7}, (_,i)=>`assets/images/gallery/gallery-${i+1}.jpeg`);
  const cfTrack = document.getElementById('cfTrack');
  const cfCurrent = document.getElementById('cfCurrent');
  const cfTotal = document.getElementById('cfTotal');
  let cfIndex = 0;

  function buildCoverflow(){
    cfTrack.innerHTML = '';
    galleryImages.forEach((src, i) => {
      const div = document.createElement('div');
      div.className = 'cf-slide';
      div.dataset.index = i;
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Wedding photo ${i+1}`;
      img.loading = 'lazy';
      div.appendChild(img);
      div.addEventListener('click', () => { cfIndex = i; renderCoverflow(); });
      cfTrack.appendChild(div);
    });
    cfTotal.textContent = galleryImages.length;
    renderCoverflow();
  }

  function renderCoverflow(){
    const slides = cfTrack.querySelectorAll('.cf-slide');
    const n = slides.length;
    slides.forEach((slide, i) => {
      let offset = i - cfIndex;
      if (offset > n/2) offset -= n;
      if (offset < -n/2) offset += n;

      const abs = Math.abs(offset);
      const x = offset * 130;
      const scale = abs === 0 ? 1 : Math.max(0.6, 1 - abs*0.18);
      const rotate = offset * -18;
      const z = 100 - abs;
      const opacity = abs > 3 ? 0 : 1 - abs*0.18;

      slide.style.transform = `translateX(${x}px) scale(${scale}) rotateY(${rotate}deg)`;
      slide.style.zIndex = z;
      slide.style.opacity = opacity;
      slide.style.filter = abs === 0 ? 'none' : 'brightness(0.85)';
      slide.style.pointerEvents = abs > 3 ? 'none' : 'auto';
    });
    cfCurrent.textContent = cfIndex + 1;
  }

  document.getElementById('cfPrev').addEventListener('click', () => {
    cfIndex = (cfIndex - 1 + galleryImages.length) % galleryImages.length;
    renderCoverflow();
  });
  document.getElementById('cfNext').addEventListener('click', () => {
    cfIndex = (cfIndex + 1) % galleryImages.length;
    renderCoverflow();
  });
  buildCoverflow();
  window.addEventListener('resize', renderCoverflow);

  /* ---------- COUNTDOWN ---------- */
  const countdownEl = document.getElementById('countdown');
  const targetDate = new Date(CONFIG.eventDateTime);

  function updateCountdown(){
    const now = new Date();
    let diff = targetDate - now;
    if (diff <= 0){
      countdownEl.textContent = "The celebration has begun!";
      return;
    }
    const day = 1000*60*60*24;
    const days = Math.floor(diff / day); diff -= days*day;
    const hours = Math.floor(diff / (1000*60*60)); diff -= hours*1000*60*60;
    const mins = Math.floor(diff / (1000*60)); diff -= mins*1000*60;
    const secs = Math.floor(diff / 1000);
    countdownEl.textContent = `${days} days ${hours} hours ${mins} min ${secs} sec`;
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------- CALENDAR ---------- */
  const calendarGrid = document.getElementById('calendarGrid');
  function buildCalendar(){
    const { calendarYear:y, calendarMonth:m, calendarHighlightDay:hi } = CONFIG;
    const heads = ['Mo','Tu','We','Th','Fr','Sa','Su'];
    heads.forEach(h => {
      const el = document.createElement('div');
      el.className = 'cg-head';
      el.textContent = h;
      calendarGrid.appendChild(el);
    });
    const firstDay = new Date(y, m-1, 1);
    // convert JS Sunday=0 -> Monday-first index
    let startIdx = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(y, m, 0).getDate();

    for (let i=0; i<startIdx; i++){
      const el = document.createElement('div');
      el.className = 'cg-day empty';
      calendarGrid.appendChild(el);
    }
    for (let d=1; d<=daysInMonth; d++){
      const el = document.createElement('div');
      el.className = 'cg-day' + (d === hi ? ' highlight' : '');
      el.textContent = d;
      calendarGrid.appendChild(el);
    }
  }
  buildCalendar();

  /* ---------- ADD TO CALENDAR (.ics) ---------- */
  document.getElementById('addToCalendar').addEventListener('click', function(e){
    e.preventDefault();
    const fmt = (iso) => iso.replace(/[-:]/g,'').split('.')[0];
    const start = fmt(CONFIG.eventDateTime);
    const end = fmt(CONFIG.eventEnd);
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Wedding Invitation//EN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@wedding-invite`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${CONFIG.coupleNames} - Wedding Reception`,
      `LOCATION:${CONFIG.venueAddress}`,
      `DESCRIPTION:Join us to celebrate the wedding of ${CONFIG.coupleNames}.`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-invitation.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  /* ---------- MODAL HELPERS ---------- */
  function openModal(modal){ modal.classList.add('open'); }
  function closeModal(modal){ modal.classList.remove('open'); }
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.closest('.modal')));
  });
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(modal); });
  });

  /* ---------- GIFT MODAL ---------- */
  const giftModal = document.getElementById('giftModal');
  document.getElementById('btnGift').addEventListener('click', () => openModal(giftModal));

  /* ---------- GUESTBOOK ---------- */
  const guestList = document.getElementById('guestList');
  const guestForm = document.getElementById('guestForm');
  const STORAGE_KEY = 'guestbook_wishes';

  function loadWishes(){
    try{
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      return saved && saved.length ? saved : defaultWishes;
    }catch(err){ return defaultWishes; }
  }
  function saveWishes(wishes){
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes)); }catch(err){}
  }
  function renderWishes(){
    const wishes = loadWishes();
    guestList.innerHTML = '';
    wishes.forEach(w => {
      const card = document.createElement('div');
      card.className = 'guest-card';
      card.innerHTML = `
        <div class="guest-card-head">
          <span class="guest-card-name"></span>
          <span class="guest-card-date"></span>
        </div>
        <p class="guest-card-msg"></p>
      `;
      card.querySelector('.guest-card-name').textContent = w.name;
      card.querySelector('.guest-card-date').textContent = w.date;
      card.querySelector('.guest-card-msg').textContent = w.msg;
      guestList.appendChild(card);
    });
  }
  renderWishes();

  guestForm.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('guestName').value.trim();
    const msg = document.getElementById('guestWish').value.trim();
    if (!name || !msg) return;
    const wishes = loadWishes();
    wishes.unshift({ name, msg, date: new Date().toLocaleString('en-US') });
    saveWishes(wishes);
    renderWishes();
    guestForm.reset();
  });

  document.getElementById('btnClearForm').addEventListener('click', function(){
    guestForm.reset();
  });

})();