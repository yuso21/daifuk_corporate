document.addEventListener('DOMContentLoaded', () => {
  // Custom cursor
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  
  if (cursor && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    });

    function animateRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Use event delegation for hover scaling on standard & dynamic elements (modal close, links, buttons, cards)
    document.addEventListener('mouseover', e => {
      const target = e.target.closest('a, button, input, textarea, .contact-link, .work-item, .works-modal-close, .modal-action-btn');
      if (target) {
        cursor.style.transform = 'translate(-50%,-50%) scale(2)';
        ring.style.width = '56px';
        ring.style.height = '56px';
      }
    });

    document.addEventListener('mouseout', e => {
      const target = e.target.closest('a, button, input, textarea, .contact-link, .work-item, .works-modal-close, .modal-action-btn');
      if (target) {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        ring.style.width = '36px';
        ring.style.height = '36px';
      }
    });
  }

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  
  reveals.forEach(el => io.observe(el));

  // Tabs (visual only as in original)
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Logo and Nav link color inversion on dark sections & SP nav scroll visibility
  const navLogo = document.querySelector('.nav-logo');
  const navLinks = document.querySelector('.nav-links');
  const darkSections = document.querySelectorAll('.services, .about, footer');
  const promiseSection = document.getElementById('promise');
  const navElement = document.querySelector('nav');
  
  if (navLogo && darkSections.length > 0) {
    window.addEventListener('scroll', () => {
      // Mobile layout scroll handling
      if (window.innerWidth <= 900) {
        navLogo.classList.remove('invert-logo');
        if (navLinks) navLinks.classList.remove('invert-links');
        
        // Show/hide SP nav when scrolling past Hero section to Promise
        if (promiseSection && navElement) {
          if (window.scrollY >= promiseSection.offsetTop - 80) {
            navElement.classList.add('nav-visible');
          } else {
            navElement.classList.remove('nav-visible');
          }
        }
        return;
      }
      
      // Desktop layout inversion handling
      const logoRect = navLogo.getBoundingClientRect();
      const logoMid = logoRect.top + (logoRect.height / 2);
      
      let isDark = false;
      darkSections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        if (logoMid >= rect.top && logoMid <= rect.bottom) {
          isDark = true;
        }
      });
      
      if (isDark) {
        navLogo.classList.add('invert-logo');
        if (navLinks) navLinks.classList.add('invert-links');
      } else {
        navLogo.classList.remove('invert-logo');
        if (navLinks) navLinks.classList.remove('invert-links');
      }
    });
    // Trigger scroll event once on load to ensure correct initial state
    window.dispatchEvent(new Event('scroll'));
  }
});

// Works Modal Logic
function openWorksModal(element) {
  const modal = document.getElementById('worksModal');
  const modalContent = document.getElementById('worksModalContent');
  const gallery = element.querySelector('.work-gallery');
  const url = element.getAttribute('data-url');
  const urlLabel = element.getAttribute('data-url-label');
  
  if (modal && modalContent && gallery) {
    modalContent.innerHTML = gallery.innerHTML;
    
    // Append button if URL exists
    if (url && urlLabel) {
      modalContent.innerHTML += `<a href="${url}" target="_blank" class="modal-action-btn">${urlLabel}</a>`;
    }
    
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  }
}

function closeWorksModal() {
  const modal = document.getElementById('worksModal');
  const modalContent = document.getElementById('worksModalContent');
  if (modal) {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    // Optional: clear content after transition
    setTimeout(() => {
      if (modalContent && !modal.classList.contains('active')) {
        modalContent.innerHTML = '';
      }
    }, 400);
  }
}
