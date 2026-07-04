// ==========================================================================
// ZEROX — shared behaviour: cursor, loader, nav, reveal, spotlight, chatbot
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- scroll progress bar ---------------- */
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);
  const updateProgress = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop || document.body.scrollTop;
    const height = h.scrollHeight - h.clientHeight;
    progress.style.width = height > 0 ? `${(scrolled / height) * 100}%` : '0%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------------- ambient mouse spotlight ---------------- */
  const spotlight = document.createElement('div');
  spotlight.className = 'spotlight';
  document.body.appendChild(spotlight);
  window.addEventListener('mousemove', e => {
    spotlight.style.setProperty('--sx', `${e.clientX}px`);
    spotlight.style.setProperty('--sy', `${e.clientY}px`);
  }, { passive: true });

  /* ---------------- custom cursor ---------------- */
  const isTouch = window.matchMedia('(hover:none), (pointer:coarse)').matches;

  if(!isTouch){
    const wrap = document.createElement('div');
    wrap.className = 'cursor-wrap';
    wrap.innerHTML = `
      <div class="cursor-ring">
        <span class="tick tick-tl"></span>
        <span class="tick tick-tr"></span>
        <span class="tick tick-bl"></span>
        <span class="tick tick-br"></span>
      </div>
      <div class="cursor-dot"></div>
    `;
    document.body.appendChild(wrap);
    wrap.style.opacity = '0';

    let mx = window.innerWidth/2, my = window.innerHeight/2, cx = mx, cy = my;
    let started = false;
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      if(!started){ started = true; cx = mx; cy = my; wrap.style.removeProperty('opacity'); }
    });

    function raf(){
      cx += (mx - cx) * 0.22;
      cy += (my - cy) * 0.22;
      wrap.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(raf);
    }
    raf();

    const hoverables = 'a, button, .btn, .gallery-card, .chat-toggle, [data-cursor-active]';
    const textFields = 'input, textarea';
    document.addEventListener('mouseover', e => {
      if(e.target.closest(hoverables)) wrap.classList.add('active');
      if(e.target.closest(textFields)) wrap.classList.add('text-field');
    });
    document.addEventListener('mouseout', e => {
      if(e.target.closest(hoverables)) wrap.classList.remove('active');
      if(e.target.closest(textFields)) wrap.classList.remove('text-field');
    });
  } else {
    document.body.classList.add('no-custom-cursor');
  }

  /* ---------------- loading screen ---------------- */
  const loader = document.querySelector('.loader');
  const tapBtn = document.querySelector('.loader-tap');
  const flash = document.querySelector('.loader-flash');
  const ringFill = document.querySelector('.loader-ring-fill');
  const embersContainer = document.querySelector('.loader-embers');

  if(loader && tapBtn){
    let entered = false;

    /* spawn ember particles */
    if(embersContainer){
      for(let i=0;i<28;i++){
        const e=document.createElement('div');
        e.className='loader-ember';
        e.style.left=Math.random()*100+'%';
        e.style.bottom=(Math.random()*30)+'%';
        e.style.animationDuration=(3+Math.random()*5)+'s';
        e.style.animationDelay=(Math.random()*4)+'s';
        e.style.width=e.style.height=(2+Math.random()*3)+'px';
        embersContainer.appendChild(e);
      }
    }

    /* countdown ring: start full, deplete over 4s */
    if(ringFill){
      const circ=2*Math.PI*20;
      ringFill.style.strokeDasharray=circ;
      ringFill.style.strokeDashoffset='0';
      requestAnimationFrame(()=>{
        ringFill.style.transition='stroke-dashoffset 4s linear';
        ringFill.style.strokeDashoffset=circ;
      });
    }

    const enter = () => {
      if(entered) return;
      entered = true;
      document.removeEventListener('keydown', onKey);

      loader.classList.add('exiting');

      setTimeout(() => { flash?.classList.add('active'); }, 40);
      setTimeout(() => { flash?.classList.remove('active'); }, 320);

      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.add('entered');
      }, 600);
    };

    const onKey = (e) => { if(e.key === 'Enter' || e.key === ' ') enter(); };
    tapBtn.addEventListener('click', enter);
    document.addEventListener('keydown', onKey);

    /* auto-enter after 4 seconds */
    setTimeout(() => { if(!entered) enter(); }, 4000);
  }

  /* ---------------- nav scroll state + burger ---------------- */
  const nav = document.querySelector('.nav');
  if(nav){
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    onScroll();
  }
  const burger = document.querySelector('.nav-burger');
  const navLinks = document.querySelector('.nav-links');
  if(burger && navLinks){
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      burger.classList.remove('open'); navLinks.classList.remove('open');
    }));
  }

  /* ---------------- scroll reveal (reveal / img-reveal / text-reveal / luxury-fade / skill bars) ---------------- */
  const revealEls = document.querySelectorAll('.reveal, .img-reveal, .text-reveal, .luxury-fade, .skill-bar-track');
  if('IntersectionObserver' in window && revealEls.length){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------------- FAQ accordion ---------------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if(!q) return;
    q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      item.closest('.faq-list')?.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
      if(!wasOpen) item.classList.add('open');
    });
  });

  /* ---------------- About tabs ---------------- */
  const aboutTabs = document.querySelectorAll('.about-tab');
  if(aboutTabs.length){
    aboutTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        aboutTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.querySelectorAll('.about-panel').forEach(p => p.classList.remove('active'));
        document.getElementById(tab.dataset.tab)?.classList.add('active');
      });
    });
  }

  /* ---------------- chatbot ---------------- */
  initChatbot();
});

function initChatbot(){
  const mount = document.getElementById('zerox-chat-mount');
  if(!mount) return;

  mount.innerHTML = `
    <button class="chat-toggle" aria-label="Open chat" data-cursor-active>
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M4 4h16v12H8l-4 4V4z"/></svg>
    </button>
    <div class="chat-panel">
      <div class="chat-head">
        <div>
          <div class="chat-head-title">ZEROX Assistant</div>
          <div class="chat-head-sub">Usually replies instantly</div>
        </div>
        <button class="chat-close" aria-label="Close chat">✕</button>
      </div>
      <div class="chat-body" id="vyra-chat-body">
        <div class="chat-msg bot">Hey — I'm the ZEROX assistant. Ask me about front-end builds, character/graphic design work, or how to reach Umer.</div>
      </div>
      <div class="chat-quick">
        <button data-q="services">Services</button>
        <button data-q="contact">Contact</button>
        <button data-q="tools">Tools used</button>
      </div>
      <div class="chat-input-row">
        <input type="text" id="vyra-chat-input" placeholder="Type a message…" />
        <button id="vyra-chat-send">Send</button>
      </div>
    </div>
  `;

  const toggle = mount.querySelector('.chat-toggle');
  const panel = mount.querySelector('.chat-panel');
  const closeBtn = mount.querySelector('.chat-close');
  const body = mount.querySelector('#vyra-chat-body');
  const input = mount.querySelector('#vyra-chat-input');
  const send = mount.querySelector('#vyra-chat-send');

  toggle.addEventListener('click', () => panel.classList.toggle('open'));
  closeBtn.addEventListener('click', () => panel.classList.remove('open'));

  const responses = {
    services: "ZEROX (Umer) works across three lanes: Front-End Development (landing pages, e-commerce UI, dashboards in HTML/CSS/JS), Graphic Design, and Character Design (anime illustration, furry/anthro design, chibis, model sheets).",
    contact: "You can reach Umer at umerfarooq63831@gmail.com or via WhatsApp at +92 308 3841500. There's also a contact page linked in the nav.",
    tools: "Adobe Photoshop, Canva, HTML/CSS/JS for front-end, plus AI creative tools like Kling AI, Whisk and Imagine Art for exploratory work.",
  };

  function addMsg(text, who){
    const div = document.createElement('div');
    div.className = `chat-msg ${who}`;
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  function botReply(userText){
    const t = userText.toLowerCase();
    let reply = "Thanks for the message! For anything specific, the fastest way is email: umerfarooq63831@gmail.com.";
    if(t.includes('contact') || t.includes('email') || t.includes('phone')) reply = responses.contact;
    else if(t.includes('service') || t.includes('offer') || t.includes('what do')) reply = responses.services;
    else if(t.includes('tool') || t.includes('software') || t.includes('use')) reply = responses.tools;
    else if(t.includes('price') || t.includes('cost') || t.includes('rate')) reply = "Pricing depends on scope — send a quick note about the project via email and Umer will get back to you.";
    setTimeout(() => addMsg(reply, 'bot'), 500);
  }

  mount.querySelectorAll('.chat-quick button').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.q;
      addMsg(btn.textContent, 'user');
      setTimeout(() => addMsg(responses[key], 'bot'), 450);
    });
  });

  function submit(){
    const val = input.value.trim();
    if(!val) return;
    addMsg(val, 'user');
    botReply(val);
    input.value = '';
  }
  send.addEventListener('click', submit);
  input.addEventListener('keydown', e => { if(e.key === 'Enter') submit(); });
}
