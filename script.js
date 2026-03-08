/* ═══════════════════════════════════════════
   LE GÎTE DES JEUX — SCRIPT.JS
   ═══════════════════════════════════════════ */

// ─────────────────────────────────────────────────
// CONFIG — À personnaliser
// ─────────────────────────────────────────────────
const CONFIG = {
  weather: {
    lat:  44.619,
    lon:  4.391,
    city: "Ardèche"
  },
  supabase: {
    url:     "https://VOTRE_PROJECT_ID.supabase.co",
    anonKey: "VOTRE_ANON_KEY"
  },
  myLudoLinks: {
    enfants:   "https://www.myludo.fr",
    strategie: "https://www.myludo.fr",
    plateau:   "https://www.myludo.fr",
    figurines: "https://www.myludo.fr"
  }
};

// ─────────────────────────────────────────────────
// MÉTÉO — Open-Meteo (gratuit, sans clé API)
// ─────────────────────────────────────────────────

const WEATHER_CODES = {
  0:  { label: "Ciel dégagé",           icon: "☀️" },
  1:  { label: "Légères nuages",         icon: "🌤️" },
  2:  { label: "Partiellement nuageux",  icon: "⛅" },
  3:  { label: "Couvert",               icon: "☁️" },
  45: { label: "Brouillard",            icon: "🌫️" },
  48: { label: "Brouillard givrant",    icon: "🌫️" },
  51: { label: "Bruine légère",         icon: "🌦️" },
  53: { label: "Bruine modérée",        icon: "🌧️" },
  55: { label: "Bruine forte",          icon: "🌧️" },
  61: { label: "Pluie légère",          icon: "🌧️" },
  63: { label: "Pluie modérée",         icon: "🌧️" },
  65: { label: "Pluie forte",           icon: "🌧️" },
  71: { label: "Neige légère",          icon: "❄️" },
  73: { label: "Neige modérée",         icon: "❄️" },
  75: { label: "Neige forte",           icon: "❄️" },
  80: { label: "Averses légères",       icon: "🌦️" },
  81: { label: "Averses modérées",      icon: "🌧️" },
  82: { label: "Averses violentes",     icon: "⛈️" },
  95: { label: "Orage",                 icon: "⛈️" },
  96: { label: "Orage avec grêle",      icon: "⛈️" },
  99: { label: "Orage avec grêle",      icon: "⛈️" },
};

async function fetchWeather() {
  const badge = document.getElementById('weatherBadge');
  if (!badge) return;

  try {
    const url = `https://api.open-meteo.com/v1/forecast`
      + `?latitude=${CONFIG.weather.lat}`
      + `&longitude=${CONFIG.weather.lon}`
      + `&current_weather=true`
      + `&timezone=Europe%2FParis`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const cw   = data.current_weather;

    if (!cw) throw new Error('Données météo absentes');

    const temp = Math.round(cw.temperature);
    const wind = Math.round(cw.windspeed);
    const code = cw.weathercode;
    const meta = WEATHER_CODES[code] || { label: "Variable", icon: "🌡️" };

    badge.innerHTML = `
      <div class="weather-widget">
        <span class="w-icon">${meta.icon}</span>
        <div>
          <div class="w-temp">${temp}°C</div>
          <div class="w-desc">${CONFIG.weather.city} · ${meta.label}</div>
        </div>
        <div class="w-sep"></div>
        <div>
          <div class="w-wind-val">💨 ${wind} km/h</div>
          <div class="w-desc">Vent</div>
        </div>
      </div>
    `;

    // Recalculer la hauteur du header après ajout météo
    updateScrollPadding();

  } catch (err) {
    console.warn('Météo indisponible :', err.message);
    badge.innerHTML = `
      <div class="weather-widget">
        <span class="w-icon">🌡️</span>
        <div><div class="w-desc">${CONFIG.weather.city} — météo indisponible</div></div>
      </div>
    `;
    updateScrollPadding();
  }
}

// ─────────────────────────────────────────────────
// SCROLL PADDING — compense la hauteur du header sticky
// ─────────────────────────────────────────────────

function updateScrollPadding() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  const h = header.getBoundingClientRect().height;
  document.documentElement.style.setProperty('--header-height', h + 'px');
}

// ─────────────────────────────────────────────────
// MENU HAMBURGER MOBILE
// ─────────────────────────────────────────────────

function initHamburger() {
  const btn  = document.getElementById('hamburgerBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    menu.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Fermer au clic sur un lien
  menu.querySelectorAll('[data-close-menu]').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
      // Laisser le temps à l'animation de fermeture avant le scroll
      // (le scroll-padding-top CSS s'occupe du décalage)
    });
  });

  // Fermer en cliquant ailleurs
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      closeMenu();
    }
  });

  // Fermer si on passe en desktop (resize)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
    updateScrollPadding();
  });
}

// ─────────────────────────────────────────────────
// PARTICULES HERO
// ─────────────────────────────────────────────────

function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const symbols = ['✦', '♟', '⚄', '★', '◆', '✧'];

  for (let i = 0; i < 35; i++) {
    const el = document.createElement('div');
    const isSymbol = Math.random() > 0.6;

    if (isSymbol) {
      el.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        color: rgba(201,146,58,${0.05 + Math.random() * 0.12});
        font-size: ${0.8 + Math.random() * 1.4}rem;
        pointer-events: none;
        user-select: none;
        animation: floatParticle ${6 + Math.random() * 8}s ease-in-out ${Math.random() * 5}s infinite;
      `;
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    } else {
      el.classList.add('particle');
      el.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${90 + Math.random() * 10}%;
        --dur: ${5 + Math.random() * 8}s;
        --delay: ${Math.random() * 6}s;
        width: ${1 + Math.random() * 3}px;
        height: ${1 + Math.random() * 3}px;
        background: rgba(201,146,58,0.8);
        box-shadow: 0 0 4px rgba(201,146,58,0.8);
      `;
    }
    container.appendChild(el);
  }
}

// ─────────────────────────────────────────────────
// SCROLL REVEAL
// ─────────────────────────────────────────────────

function initReveal() {
  const targets = document.querySelectorAll(
    '.section-header, .bienvenue-text, .bienvenue-card, ' +
    '.game-category-card, .testimonial-card, .gold-book-form, ' +
    '.contact-infos, .contact-form-wrap, .contact-item, .feature-pill'
  );
  targets.forEach(el => el.classList.add('reveal'));

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => obs.observe(el));
}

// ─────────────────────────────────────────────────
// STAR RATING
// ─────────────────────────────────────────────────

let selectedRating = 5;

function initStarRating() {
  const container = document.getElementById('starRating');
  if (!container) return;
  const stars = container.querySelectorAll('.star');

  stars.forEach(star => {
    star.addEventListener('click', () => {
      selectedRating = parseInt(star.dataset.val);
      stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.val) <= selectedRating));
    });
  });
  // Étoiles actives par défaut (5)
  stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.val) <= selectedRating));
}

// ─────────────────────────────────────────────────
// NAVIGATION ACTIVE
// ─────────────────────────────────────────────────

function initActiveNav() {
  const sections = document.querySelectorAll('.section[id]');
  const navBtns  = document.querySelectorAll('.nav-btn');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navBtns.forEach(btn => btn.classList.remove('active'));
        const active = document.querySelector(`.nav-btn[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));
}

// ─────────────────────────────────────────────────
// MYLUDO LINKS
// ─────────────────────────────────────────────────

function initMyLudoLinks() {
  document.querySelectorAll('.game-category-card[data-category]').forEach(card => {
    const cat = card.dataset.category;
    if (CONFIG.myLudoLinks[cat]) card.href = CONFIG.myLudoLinks[cat];
  });
}

// ─────────────────────────────────────────────────
// SUPABASE HELPERS
// ─────────────────────────────────────────────────

async function supabaseFetch(table, method = 'GET', body = null, filters = '') {
  const url = `${CONFIG.supabase.url}/rest/v1/${table}${filters}`;
  const opts = {
    method,
    headers: {
      'apikey':        CONFIG.supabase.anonKey,
      'Authorization': `Bearer ${CONFIG.supabase.anonKey}`,
      'Content-Type':  'application/json',
      'Prefer':        method === 'POST' ? 'return=representation' : ''
    }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Supabase error ${res.status}`);
  }
  return method === 'GET' ? res.json() : res;
}

async function loadReviews() {
  try {
    const reviews = await supabaseFetch('reviews', 'GET', null, '?order=created_at.desc&limit=20');
    if (!reviews || reviews.length === 0) return;
    const track = document.getElementById('testimonialsTrack');
    if (!track) return;
    track.innerHTML = '';
    reviews.forEach(r => {
      const filled = '★'.repeat(Math.min(r.rating || 5, 5));
      const empty  = '☆'.repeat(Math.max(5 - (r.rating || 5), 0));
      const card = document.createElement('div');
      card.className = 'testimonial-card';
      card.innerHTML = `
        <div class="testimonial-stars">${filled}${empty}</div>
        <p class="testimonial-text">"${escapeHtml(r.message)}"</p>
        <div class="testimonial-author">
          <div class="author-avatar">${r.name ? r.name[0].toUpperCase() : '?'}</div>
          <div>
            <strong>${escapeHtml(r.name || 'Anonyme')}</strong>
            <span>${escapeHtml(r.city || '')} · ${formatDate(r.created_at)}</span>
          </div>
        </div>
      `;
      track.appendChild(card);
    });
  } catch (err) {
    console.warn('Avis Supabase non chargés :', err.message);
  }
}

async function submitReview() {
  const name     = document.getElementById('goldName').value.trim();
  const city     = document.getElementById('goldCity').value.trim();
  const message  = document.getElementById('goldMsg').value.trim();
  const feedback = document.getElementById('formFeedback');
  const btn      = document.getElementById('submitReview');

  if (!name || !message) {
    showFeedback(feedback, '⚠️ Merci de renseigner votre nom et votre message.', 'error');
    return;
  }
  if (message.length < 10) {
    showFeedback(feedback, '⚠️ Votre message est trop court (10 caractères minimum).', 'error');
    return;
  }

  btn.disabled = true;
  btn.querySelector('span').textContent = 'Envoi en cours...';

  try {
    await supabaseFetch('reviews', 'POST', { name, city, message, rating: selectedRating });
    showFeedback(feedback, '✦ Merci ! Votre message sera affiché après modération.', 'success');
    document.getElementById('goldName').value = '';
    document.getElementById('goldCity').value = '';
    document.getElementById('goldMsg').value  = '';
    selectedRating = 5;
    initStarRating();
    await loadReviews();
  } catch (err) {
    if (CONFIG.supabase.url.includes('VOTRE_PROJECT_ID')) {
      showFeedback(feedback, '⚙️ Supabase non configuré — ajoutez vos clés dans script.js.', 'error');
    } else {
      showFeedback(feedback, '❌ Erreur d\'envoi. Réessayez plus tard.', 'error');
    }
  }

  btn.disabled = false;
  btn.querySelector('span').textContent = 'Envoyer mon message';
}

async function submitContact() {
  const name     = document.getElementById('contactName').value.trim();
  const email    = document.getElementById('contactEmail').value.trim();
  const phone    = document.getElementById('contactPhone').value.trim();
  const dates    = document.getElementById('contactDates').value.trim();
  const message  = document.getElementById('contactMsg').value.trim();
  const feedback = document.getElementById('contactFeedback');

  if (!name || !email || !message) {
    showFeedback(feedback, '⚠️ Merci de renseigner nom, email et message.', 'error');
    return;
  }
  if (!isValidEmail(email)) {
    showFeedback(feedback, '⚠️ Adresse email invalide.', 'error');
    return;
  }
  try {
    await supabaseFetch('contacts', 'POST', { name, email, phone, dates, message });
    showFeedback(feedback, '✦ Demande envoyée ! Nous vous répondrons très vite.', 'success');
    ['contactName','contactEmail','contactPhone','contactDates','contactMsg']
      .forEach(id => { document.getElementById(id).value = ''; });
  } catch (err) {
    if (CONFIG.supabase.url.includes('VOTRE_PROJECT_ID')) {
      showFeedback(feedback, '⚙️ Supabase non configuré — ajoutez vos clés dans script.js.', 'error');
    } else {
      showFeedback(feedback, '❌ Erreur. Contactez-nous directement par email.', 'error');
    }
  }
}

// ─────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────

function showFeedback(el, msg, type) {
  if (!el) return;
  el.textContent = msg;
  el.className = `form-feedback ${type}`;
  setTimeout(() => {
    if (el.textContent === msg) { el.textContent = ''; el.className = 'form-feedback'; }
  }, 6000);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  updateScrollPadding();  // 1. Calculer hauteur header dès le départ
  fetchWeather();         // 2. Charger météo (recalcule ensuite)
  createParticles();
  initReveal();
  initStarRating();
  initActiveNav();
  initMyLudoLinks();
  initHamburger();        // 3. Menu mobile
  loadReviews();
});
