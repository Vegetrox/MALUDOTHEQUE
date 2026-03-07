/* ═══════════════════════════════════════════
   LE GÎTE DES JEUX — SCRIPT.JS
   Météo · Livre d'or · Particules · Animations
   ═══════════════════════════════════════════ */

// ─────────────────────────────────────────────────
// CONFIG — À personnaliser
// ─────────────────────────────────────────────────
const CONFIG = {
  // Météo : Open-Meteo (gratuit, sans clé API)
  // Coordonnées : Aubenas, Ardèche (centre géographique)
  weather: {
    lat:  44.619,
    lon:  4.391,
    city: "Ardèche"
  },

  // Supabase — remplacez par vos vraies valeurs
  supabase: {
    url:    "https://VOTRE_PROJECT_ID.supabase.co",
    anonKey:"VOTRE_ANON_KEY"
  },

  // MyLudo — remplacez par vos URLs de collection réelles
  myLudoLinks: {
    enfants:   "https://www.myludo.fr",
    strategie: "https://www.myludo.fr",
    plateau:   "https://www.myludo.fr",
    figurines: "https://www.myludo.fr"
  }
};

// ─────────────────────────────────────────────────
// MÉTÉO — Open-Meteo API (gratuit, sans inscription)
// ─────────────────────────────────────────────────

const WEATHER_CODES = {
  0:  { label: "Ciel dégagé",       icon: "☀️" },
  1:  { label: "Légères nuages",     icon: "🌤️" },
  2:  { label: "Partiellement nuageux", icon: "⛅" },
  3:  { label: "Couvert",            icon: "☁️" },
  45: { label: "Brouillard",         icon: "🌫️" },
  48: { label: "Brouillard givrant", icon: "🌫️" },
  51: { label: "Bruine légère",      icon: "🌦️" },
  53: { label: "Bruine modérée",     icon: "🌧️" },
  55: { label: "Bruine forte",       icon: "🌧️" },
  61: { label: "Pluie légère",       icon: "🌧️" },
  63: { label: "Pluie modérée",      icon: "🌧️" },
  65: { label: "Pluie forte",        icon: "🌧️" },
  71: { label: "Neige légère",       icon: "❄️" },
  73: { label: "Neige modérée",      icon: "❄️" },
  75: { label: "Neige forte",        icon: "❄️" },
  80: { label: "Averses légères",    icon: "🌦️" },
  81: { label: "Averses modérées",   icon: "🌧️" },
  82: { label: "Averses violentes",  icon: "⛈️" },
  95: { label: "Orage",              icon: "⛈️" },
  96: { label: "Orage avec grêle",   icon: "⛈️" },
  99: { label: "Orage avec grêle",   icon: "⛈️" },
};

async function fetchWeather() {
  const badge = document.getElementById('weatherBadge');
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${CONFIG.weather.lat}&longitude=${CONFIG.weather.lon}&current_weather=true&hourly=apparent_temperature&timezone=Europe%2FParis`;
    const res  = await fetch(url);
    if (!res.ok) throw new Error('API météo indisponible');
    const data = await res.json();

    const cw   = data.current_weather;
    const temp = Math.round(cw.temperature);
    const code = cw.weathercode;
    const meta = WEATHER_CODES[code] || { label: "Variable", icon: "🌡️" };
    const wind = Math.round(cw.windspeed);

    badge.innerHTML = `
      <div class="weather-widget">
        <span class="weather-icon">${meta.icon}</span>
        <div>
          <div class="weather-temp">${temp}°C</div>
          <div class="weather-desc">${CONFIG.weather.city} · ${meta.label}</div>
        </div>
        <div style="margin-left:0.5rem; border-left:1px solid rgba(201,146,58,0.2); padding-left:0.75rem;">
          <div class="weather-temp" style="font-size:0.85rem;">💨 ${wind} km/h</div>
          <div class="weather-desc">Vent</div>
        </div>
      </div>
    `;
  } catch (err) {
    badge.innerHTML = `
      <div class="weather-widget">
        <span class="weather-icon">🌡️</span>
        <div><div class="weather-desc">Météo indisponible</div></div>
      </div>
    `;
    console.warn('Météo:', err.message);
  }
}

// ─────────────────────────────────────────────────
// PARTICULES HERO
// ─────────────────────────────────────────────────

function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const symbols = ['✦', '♟', '⚄', '★', '◆', '✧'];

  for (let i = 0; i < 35; i++) {
    const p  = document.createElement('div');
    const isSymbol = Math.random() > 0.6;

    if (isSymbol) {
      p.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        color: rgba(201,146,58,${0.05 + Math.random() * 0.15});
        font-size: ${0.8 + Math.random() * 1.5}rem;
        pointer-events: none;
        animation: floatParticle ${6 + Math.random() * 8}s ease-in-out ${Math.random() * 5}s infinite;
        user-select: none;
      `;
      p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    } else {
      p.classList.add('particle');
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${90 + Math.random() * 10}%;
        --dur: ${5 + Math.random() * 8}s;
        --delay: ${Math.random() * 6}s;
        width: ${1 + Math.random() * 3}px;
        height: ${1 + Math.random() * 3}px;
        box-shadow: 0 0 4px rgba(201,146,58,0.8);
      `;
    }

    container.appendChild(p);
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

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
}

// ─────────────────────────────────────────────────
// STAR RATING
// ─────────────────────────────────────────────────

let selectedRating = 5;

function initStarRating() {
  const stars = document.querySelectorAll('#starRating .star');
  stars.forEach(star => {
    star.addEventListener('click', () => {
      selectedRating = parseInt(star.dataset.val);
      updateStars(stars, selectedRating);
    });
  });
  updateStars(stars, selectedRating); // default 5
}

function updateStars(stars, val) {
  stars.forEach(s => {
    s.classList.toggle('active', parseInt(s.dataset.val) <= val);
  });
}

// ─────────────────────────────────────────────────
// SUPABASE — Livre d'or
// ─────────────────────────────────────────────────

// ──── Helpers Supabase REST ────────────────────
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

// ──── Charger les avis existants depuis Supabase ────
async function loadReviews() {
  try {
    const reviews = await supabaseFetch('reviews', 'GET', null, '?order=created_at.desc&limit=20');
    if (!reviews || reviews.length === 0) return;

    const track = document.getElementById('testimonialsTrack');
    // Effacer les témoignages statiques avant d'ajouter les vrais
    track.innerHTML = '';

    reviews.forEach(r => {
      const stars = '★'.repeat(r.rating || 5) + '☆'.repeat(5 - (r.rating || 5));
      const card = document.createElement('div');
      card.className = 'testimonial-card';
      card.innerHTML = `
        <div class="testimonial-stars">${stars}</div>
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
    console.warn('Impossible de charger les avis Supabase:', err.message);
    // Les témoignages statiques restent affichés si Supabase n'est pas configuré
  }
}

// ──── Soumettre un avis dans Supabase ────
async function submitReview() {
  const name    = document.getElementById('goldName').value.trim();
  const city    = document.getElementById('goldCity').value.trim();
  const message = document.getElementById('goldMsg').value.trim();
  const feedback = document.getElementById('formFeedback');

  if (!name || !message) {
    showFeedback(feedback, '⚠️ Merci de renseigner votre nom et votre message.', 'error');
    return;
  }
  if (message.length < 10) {
    showFeedback(feedback, '⚠️ Votre message est trop court.', 'error');
    return;
  }

  const btn = document.getElementById('submitReview');
  btn.disabled = true;
  btn.querySelector('span').textContent = 'Envoi en cours...';

  try {
    await supabaseFetch('reviews', 'POST', {
      name,
      city,
      message,
      rating: selectedRating
    });

    showFeedback(feedback, '✦ Merci pour votre message ! Il sera affiché après modération.', 'success');

    // Reset form
    document.getElementById('goldName').value  = '';
    document.getElementById('goldCity').value  = '';
    document.getElementById('goldMsg').value   = '';
    selectedRating = 5;
    initStarRating();

    // Rafraîchir les avis
    await loadReviews();

  } catch (err) {
    console.error('Erreur Supabase:', err);
    // Afficher quand même un message de succès côté UX si Supabase n'est pas encore configuré
    if (CONFIG.supabase.url.includes('VOTRE_PROJECT_ID')) {
      showFeedback(feedback, '⚙️ Supabase non configuré. Intégrez vos clés dans script.js pour activer l\'envoi.', 'error');
    } else {
      showFeedback(feedback, '❌ Une erreur est survenue. Veuillez réessayer.', 'error');
    }
  }

  btn.disabled = false;
  btn.querySelector('span').textContent = 'Envoyer mon message';
}

// ─────────────────────────────────────────────────
// CONTACT FORM
// ─────────────────────────────────────────────────

async function submitContact() {
  const name    = document.getElementById('contactName').value.trim();
  const email   = document.getElementById('contactEmail').value.trim();
  const phone   = document.getElementById('contactPhone').value.trim();
  const dates   = document.getElementById('contactDates').value.trim();
  const message = document.getElementById('contactMsg').value.trim();
  const feedback = document.getElementById('contactFeedback');

  if (!name || !email || !message) {
    showFeedback(feedback, '⚠️ Merci de renseigner au minimum votre nom, email et message.', 'error');
    return;
  }
  if (!isValidEmail(email)) {
    showFeedback(feedback, '⚠️ Adresse email invalide.', 'error');
    return;
  }

  try {
    await supabaseFetch('contacts', 'POST', { name, email, phone, dates, message });
    showFeedback(feedback, '✦ Votre demande a été envoyée ! Nous vous répondrons dans les plus brefs délais.', 'success');
    ['contactName', 'contactEmail', 'contactPhone', 'contactDates', 'contactMsg']
      .forEach(id => document.getElementById(id).value = '');
  } catch (err) {
    if (CONFIG.supabase.url.includes('VOTRE_PROJECT_ID')) {
      showFeedback(feedback, '⚙️ Supabase non configuré. Intégrez vos clés dans script.js.', 'error');
    } else {
      showFeedback(feedback, '❌ Erreur d\'envoi. Contactez-nous directement par email.', 'error');
    }
  }
}

// ─────────────────────────────────────────────────
// NAVIGATION ACTIVE (highlight au scroll)
// ─────────────────────────────────────────────────

function initActiveNav() {
  const sections = document.querySelectorAll('.section[id]');
  const navBtns  = document.querySelectorAll('.nav-btn[href^="#"]');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navBtns.forEach(btn => {
          btn.style.color = '';
          btn.style.borderColor = '';
          btn.style.background = '';
        });
        const active = document.querySelector(`.nav-btn[href="#${entry.target.id}"]`);
        if (active) {
          active.style.color = 'var(--gold-light)';
          active.style.borderColor = 'var(--border-strong)';
          active.style.background = 'rgba(201,146,58,0.1)';
        }
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));
}

// ─────────────────────────────────────────────────
// MYLUDO LINKS — mise à jour des cartes
// ─────────────────────────────────────────────────

function initMyLudoLinks() {
  document.querySelectorAll('.game-category-card[data-category]').forEach(card => {
    const cat = card.dataset.category;
    if (CONFIG.myLudoLinks[cat]) {
      card.href = CONFIG.myLudoLinks[cat];
    }
  });
}

// ─────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────

function showFeedback(el, msg, type) {
  el.textContent  = msg;
  el.className    = `form-feedback ${type}`;
  setTimeout(() => {
    if (el.textContent === msg) {
      el.textContent = '';
      el.className   = 'form-feedback';
    }
  }, 6000);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;'
  }[c]));
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─────────────────────────────────────────────────
// MENU HAMBURGER MOBILE
// ─────────────────────────────────────────────────

function initHamburger() {
  const btn  = document.getElementById('hamburgerBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    menu.classList.toggle('open');
    btn.classList.toggle('open');
    btn.setAttribute('aria-expanded', !isOpen);
    menu.setAttribute('aria-hidden', isOpen);
  });

  // Fermer le menu quand on clique sur un lien
  menu.querySelectorAll('[data-close]').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
    });
  });

  // Fermer si on clique en dehors
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
    }
  });
}

// ─────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  fetchWeather();
  createParticles();
  initReveal();
  initStarRating();
  initActiveNav();
  initMyLudoLinks();
  initHamburger();
  loadReviews();    // Tenter de charger les avis Supabase (silencieux si non configuré)
});
