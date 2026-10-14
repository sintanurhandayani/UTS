// script.js
// Menangani fallback foto dan efek reveal saat scroll.
// Pastikan path foto: ./foto/foto1.jpg, ./foto/foto2.jpg, ./foto/foto3.jpg

document.addEventListener('DOMContentLoaded', function () {
  // 1) Photo fallback: jika gambar gagal dimuat atau tidak ada, ganti dengan lingkaran berisi inisial.
  document.querySelectorAll('.photo').forEach(function(img){
    // If the image is already broken, handle immediately
    function makeFallback(){
      // create fallback element
      var name = img.getAttribute('data-name') || '';
      var initials = name.split(' ').filter(Boolean).map(n => n[0]).slice(0,2).join('').toUpperCase() || '?';
      var wrapper = document.createElement('div');
      wrapper.className = 'photo-fallback';

      // pick accent color from nearest profile (uses CSS variable --accent if present)
      // We'll compute a background using the computed style of the profile
      var profile = img.closest('.profile');
      var computed = window.getComputedStyle(profile);
      var accent = computed.getPropertyValue('--accent') || '62 75 224'; // fallback indigo
      // convert to rgb() with alpha for nicer look
      wrapper.style.background = 'linear-gradient(135deg, rgba(' + accent.trim() + ',0.95), rgba(0,0,0,0.06))';
      wrapper.style.color = '#fff';
      wrapper.style.fontFamily = "Inter, system-ui, -apple-system, 'Segoe UI', Roboto";
      wrapper.textContent = initials;

      // replace image node with fallback
      img.replaceWith(wrapper);
    }

    // If image fails to load, use fallback
    img.addEventListener('error', makeFallback);

    // Some hosts may return a placeholder 404 image but still fire load; verify naturalWidth
    img.addEventListener('load', function(){
      if (!img.naturalWidth || img.naturalWidth === 0) {
        makeFallback();
      }
    });

    // Trigger immediate check (for cached errors)
    if (!img.complete) {
      // will wait for load/error events
    } else {
      if (!img.naturalWidth || img.naturalWidth === 0) makeFallback();
    }
  });

  // 2) Reveal on scroll using IntersectionObserver (respect prefers-reduced-motion)
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.12});

    // add .reveal to sections and cards
    document.querySelectorAll('.card, .profile-header, .hero, .site-footer').forEach(function(el){
      el.classList.add('reveal');
      observer.observe(el);
    });
  } else {
    // If reduced motion or no observer, just make elements visible
    document.querySelectorAll('.card, .profile-header, .hero, .site-footer').forEach(function(el){
      el.classList.add('visible');
    });
  }

  // 3) Small enhancement: smooth scrolling for navbar links
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    });
  });
});