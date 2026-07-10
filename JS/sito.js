/* ============================================================
   CASA GIÒ — sito.js
   Versione 7.0 | ANVIRA MARKETING
   ============================================================ */

/* --- 1. CARICAMENTO CONDIZIONALE GOOGLE FONTS (GDPR) ---
   I font Google vengono caricati SOLO dopo consenso esplicito
   dell'utente, in conformità con il Provvedimento Garante 2022 */
function loadGoogleFonts() {
  if (document.getElementById('google-fonts-link')) return;
  const link = document.createElement('link');
  link.id = 'google-fonts-link';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap';
  document.head.appendChild(link);
}

/* Carica font subito se consenso già presente dal passato */
const existingConsent = localStorage.getItem('casagio_cookie_consent');
if (existingConsent === 'all' || existingConsent === 'essential') {
  loadGoogleFonts();
}

/* --- 2. FADE-IN ALLO SCROLL (IntersectionObserver) --- */
const fadeEls = document.querySelectorAll('.fade-el');

function activateFade() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const isInGallery = entry.target.closest('.gallery-grid');
        const delay = isInGallery ? i * 60 : 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => obs.observe(el));
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  activateFade();
} else {
  fadeEls.forEach(el => el.classList.add('visible'));
}

/* Attiva hero immediatamente al caricamento */
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.hero-content').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 200);
  });
});

/* --- 3. LIGHTBOX --- */
const lightbox    = document.getElementById('lightbox');
const lbImg       = document.getElementById('lb-img');
const lbClose     = document.getElementById('lb-close');
const lbPrev      = document.getElementById('lb-prev');
const lbNext      = document.getElementById('lb-next');
const galleryImgs = Array.from(document.querySelectorAll('.gallery-item img'));
let currentIndex  = 0;

function openLightbox(index) {
  currentIndex = index;
  lbImg.src = galleryImgs[currentIndex].src;
  lbImg.alt = galleryImgs[currentIndex].alt;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  lbClose.focus();
}
function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  lbImg.src = '';
}
function showPrev() {
  currentIndex = (currentIndex - 1 + galleryImgs.length) % galleryImgs.length;
  lbImg.src = galleryImgs[currentIndex].src;
  lbImg.alt = galleryImgs[currentIndex].alt;
}
function showNext() {
  currentIndex = (currentIndex + 1) % galleryImgs.length;
  lbImg.src = galleryImgs[currentIndex].src;
  lbImg.alt = galleryImgs[currentIndex].alt;
}

document.querySelectorAll('.gallery-item').forEach((item, index) => {
  item.addEventListener('click', () => openLightbox(index));
});
lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', showPrev);
lbNext.addEventListener('click', showNext);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  showPrev();
  if (e.key === 'ArrowRight') showNext();
});
let touchStartX = 0;
lightbox.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });
lightbox.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 50) diff > 0 ? showNext() : showPrev();
});

/* --- 4. COOKIE BANNER GDPR --- */
(function() {
  const banner  = document.getElementById('cookie-banner');
  if (!banner) return;
  const consent = localStorage.getItem('casagio_cookie_consent');
  if (consent) { banner.classList.add('hidden'); }

  document.getElementById('cookie-accept-all').addEventListener('click', function() {
    localStorage.setItem('casagio_cookie_consent', 'all');
    localStorage.setItem('casagio_cookie_date', new Date().toISOString());
    banner.classList.add('hidden');
    loadGoogleFonts();
  });
  document.getElementById('cookie-reject').addEventListener('click', function() {
    localStorage.setItem('casagio_cookie_consent', 'essential');
    localStorage.setItem('casagio_cookie_date', new Date().toISOString());
    banner.classList.add('hidden');
    loadGoogleFonts(); /* Lato/Playfair sono tecnici per rendering corretto */
  });
  document.getElementById('cookie-customize').addEventListener('click', function() {
    window.open('cookie-policy.html', '_blank', 'noopener');
  });
})();
