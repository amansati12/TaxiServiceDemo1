/* ============================================
   LUXRIDE - Premium Taxi & Ride Booking
   Main JavaScript
   ============================================ */

'use strict';

// ============================================
// PAGE LOADER
// ============================================
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 2000);
  }
});

// ============================================
// NAVBAR SCROLL BEHAVIOR
// ============================================
const mainNav = document.getElementById('mainNav');
if (mainNav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }
  });

  // Active nav link
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  navLinks.forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add('active');
    }
  });
}

// ============================================
// BACK TO TOP
// ============================================
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================
// AOS INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80
    });
  }
});

// ============================================
// ANIMATED COUNTERS
// ============================================
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 2000;
  const start = performance.now();

  function update(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Intersection Observer for counters
const counters = document.querySelectorAll('[data-counter]');
if (counters.length) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));
}

// ============================================
// HERO FARE ESTIMATOR
// ============================================
function initFareEstimator() {
  const pickupInput = document.getElementById('heroPickup');
  const destinationInput = document.getElementById('heroDestination');
  const fareDisplay = document.getElementById('heroFareAmount');
  const fareBox = document.getElementById('heroFareBox');

  if (!pickupInput || !destinationInput) return;

  const baseFares = {
    'economy': 12,
    'premium': 22,
    'suv': 32,
    'luxury': 50
  };

  function estimateFare() {
    const pickup = pickupInput.value.trim();
    const dest = destinationInput.value.trim();
    const carType = document.getElementById('heroCarType')?.value || 'economy';

    if (pickup.length > 2 && dest.length > 2) {
      const distance = Math.floor(Math.random() * 15) + 5;
      const base = baseFares[carType] || 12;
      const fare = (base + distance * 1.8).toFixed(0);
      fareDisplay.textContent = '₹' + fare;
      fareBox.style.display = 'block';
    }
  }

  [pickupInput, destinationInput].forEach(el => {
    el.addEventListener('input', estimateFare);
  });
  document.getElementById('heroCarType')?.addEventListener('change', estimateFare);
}
initFareEstimator();

// ============================================
// BOOKING PAGE FARE CALCULATOR
// ============================================
function initBookingCalculator() {
  const calculateBtn = document.getElementById('calculateFareBtn');
  const fareResult = document.getElementById('fareResult');

  if (!calculateBtn) return;

  const rates = {
    'economy': { base: 12, per_km: 1.5, label: 'Economy Sedan' },
    'premium': { base: 22, per_km: 2.5, label: 'Premium Sedan' },
    'suv': { base: 32, per_km: 3.5, label: 'Premium SUV' },
    'luxury': { base: 50, per_km: 5.0, label: 'Luxury Class' },
    'tesla': { base: 45, per_km: 4.5, label: 'Tesla Electric' }
  };

  calculateBtn.addEventListener('click', () => {
    const pickup = document.getElementById('bookPickup')?.value;
    const destination = document.getElementById('bookDestination')?.value;
    const carType = document.getElementById('bookCarType')?.value || 'economy';
    const passengers = parseInt(document.getElementById('bookPassengers')?.value) || 1;

    if (!pickup || !destination) {
      showToast('Please enter pickup and destination', 'warning');
      return;
    }

    const distance = Math.floor(Math.random() * 20) + 8;
    const rate = rates[carType];
    const baseFare = rate.base;
    const distanceFare = distance * rate.per_km;
    const serviceCharge = 2.5;
    const total = baseFare + distanceFare + serviceCharge;

    if (fareResult) {
      fareResult.style.display = 'block';
      fareResult.innerHTML = `
        <div class="fare-breakdown">
          <h6 class="text-gold mb-3" style="font-family:var(--font-accent);letter-spacing:2px;font-size:0.8rem;">FARE ESTIMATE</h6>
          <div class="fare-row"><span>Vehicle</span><span class="amount">${rate.label}</span></div>
          <div class="fare-row"><span>Estimated Distance</span><span class="amount">${distance} km</span></div>
          <div class="fare-row"><span>Base Fare</span><span class="amount">₹${baseFare.toFixed(0)}</span></div>
          <div class="fare-row"><span>Distance Charge</span><span class="amount">₹${distanceFare.toFixed(0)}</span></div>
          <div class="fare-row"><span>Service Fee</span><span class="amount">₹${serviceCharge.toFixed(0)}</span></div>
          <div class="fare-row total"><span>Total Estimate</span><span class="amount">₹${total.toFixed(0)}</span></div>
        </div>
      `;
      fareResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}
initBookingCalculator();

// ============================================
// CAR SELECTOR (Booking Page)
// ============================================
const carOptions = document.querySelectorAll('.car-option');
carOptions.forEach(option => {
  option.addEventListener('click', () => {
    carOptions.forEach(o => o.classList.remove('selected'));
    option.classList.add('selected');
    const carValue = option.getAttribute('data-car');
    const carInput = document.getElementById('selectedCar');
    if (carInput) carInput.value = carValue;
  });
});

// ============================================
// PAYMENT OPTIONS (Booking Page)
// ============================================
const paymentOptions = document.querySelectorAll('.payment-option');
paymentOptions.forEach(option => {
  option.addEventListener('click', () => {
    paymentOptions.forEach(o => o.classList.remove('selected'));
    option.classList.add('selected');
  });
});

// ============================================
// BOOKING FORM SUBMISSION
// ============================================
const bookingForms = document.querySelectorAll('.booking-form');
bookingForms.forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('🚗 Booking confirmed! Your driver will arrive shortly.', 'success');
  });
});

// Hero booking
const heroBookingForm = document.getElementById('heroBookingForm');
if (heroBookingForm) {
  heroBookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    window.location.href = 'booking.html';
  });
}

// ============================================
// CONTACT FORM
// ============================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('✅ Message sent! We\'ll respond within 2 hours.', 'success');
    contactForm.reset();
  });
}

// Newsletter form
const newsletterForms = document.querySelectorAll('.newsletter-form-js');
newsletterForms.forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('📧 Subscribed! Welcome to LuxRide exclusives.', 'success');
    form.reset();
  });
});

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toastContainer') || createToastContainer();
  const toast = document.createElement('div');
  const colors = {
    success: 'linear-gradient(135deg, #1a3a1a, #2a4a2a)',
    warning: 'linear-gradient(135deg, #3a2a0a, #4a3a1a)',
    error: 'linear-gradient(135deg, #3a0a0a, #4a1a1a)',
    info: 'linear-gradient(135deg, var(--dark-3), var(--dark-2))'
  };
  toast.style.cssText = `
    background: ${colors[type]};
    border: 1px solid rgba(201,168,76,0.4);
    color: #fff;
    padding: 16px 20px;
    border-radius: 12px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.9rem;
    max-width: 340px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.5);
    animation: toastIn 0.4s ease forwards;
    cursor: pointer;
  `;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  toast.addEventListener('click', () => toast.remove());
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.4s ease forwards';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

function createToastContainer() {
  const style = document.createElement('style');
  style.textContent = `
    #toastContainer { position:fixed; bottom:80px; right:30px; z-index:9999; display:flex; flex-direction:column; gap:10px; }
    @keyframes toastIn { from { opacity:0; transform:translateX(50px); } to { opacity:1; transform:translateX(0); } }
    @keyframes toastOut { from { opacity:1; transform:translateX(0); } to { opacity:0; transform:translateX(50px); } }
  `;
  document.head.appendChild(style);
  const container = document.createElement('div');
  container.id = 'toastContainer';
  document.body.appendChild(container);
  return container;
}

// ============================================
// TESTIMONIALS SLIDER (Auto-rotate)
// ============================================
function initTestimonialsSlider() {
  const slider = document.getElementById('testimonialsCarousel');
  if (slider && typeof bootstrap !== 'undefined') {
    new bootstrap.Carousel(slider, { interval: 5000, ride: 'carousel' });
  }
}
document.addEventListener('DOMContentLoaded', initTestimonialsSlider);

// ============================================
// PARALLAX EFFECT
// ============================================
window.addEventListener('scroll', () => {
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  parallaxEls.forEach(el => {
    const speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
    const rect = el.getBoundingClientRect();
    const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
    el.style.transform = `translateY(${offset}px)`;
  });
});

// ============================================
// SMOOTH ANCHOR SCROLLING
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================================
// FLOATING LABEL ANIMATION
// ============================================
document.querySelectorAll('.form-input-dark').forEach(input => {
  input.addEventListener('focus', () => {
    input.closest('.input-wrapper')?.classList.add('focused');
  });
  input.addEventListener('blur', () => {
    input.closest('.input-wrapper')?.classList.remove('focused');
  });
});

// ============================================
// PROMO CODE HANDLER (Booking Page)
// ============================================
const promoBtn = document.getElementById('applyPromoBtn');
if (promoBtn) {
  promoBtn.addEventListener('click', () => {
    const promoInput = document.getElementById('promoCode');
    const promoMsg = document.getElementById('promoMessage');
    const codes = { 'LUXRIDE10': '10% off applied!', 'WELCOME20': '20% off applied!', 'AIRPORT15': '15% off applied!' };
    const code = promoInput?.value.toUpperCase().trim();
    if (promoMsg) {
      if (codes[code]) {
        promoMsg.textContent = '✅ ' + codes[code];
        promoMsg.style.color = '#4ade80';
      } else {
        promoMsg.textContent = '❌ Invalid promo code';
        promoMsg.style.color = '#f87171';
      }
      promoMsg.style.display = 'block';
    }
  });
}

console.log('🚗 LuxRide JS loaded successfully');
