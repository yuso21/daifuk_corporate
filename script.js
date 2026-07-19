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

  // SP View More Logic
  const worksMoreBtn = document.getElementById('worksMoreBtn');
  const workItems = document.querySelectorAll('.works-grid .work-item');
  
  function initSPWorks() {
    if (window.innerWidth <= 900) {
      if (workItems.length <= 6) {
        workItems.forEach(item => {
          item.classList.remove('sp-hidden');
        });
        if (worksMoreBtn) {
          const btnContainer = document.querySelector('.works-more-btn-container');
          if (btnContainer) btnContainer.style.display = 'none';
          worksMoreBtn.style.display = 'none';
        }
        return;
      }
      workItems.forEach((item, index) => {
        if (index >= 5) {
          item.classList.add('sp-hidden');
        } else {
          item.classList.remove('sp-hidden');
        }
      });
      if (worksMoreBtn) {
        const btnContainer = document.querySelector('.works-more-btn-container');
        if (btnContainer) btnContainer.style.display = 'flex';
        worksMoreBtn.style.display = 'inline-flex';
      }
    } else {
      workItems.forEach(item => {
        item.classList.remove('sp-hidden');
      });
      if (worksMoreBtn) {
        const btnContainer = document.querySelector('.works-more-btn-container');
        if (btnContainer) btnContainer.style.display = 'none';
        worksMoreBtn.style.display = 'none';
      }
    }
  }

  if (worksMoreBtn) {
    worksMoreBtn.addEventListener('click', () => {
      workItems.forEach(item => {
        item.classList.remove('sp-hidden');
        item.classList.add('reveal', 'visible');
      });
      const btnContainer = document.querySelector('.works-more-btn-container');
      if (btnContainer) {
        btnContainer.style.display = 'none';
      }
    });
  }

  // Run on load
  initSPWorks();
  
  // Also run on resize to handle layout shifts cleanly
  window.addEventListener('resize', () => {
    const btnContainer = document.querySelector('.works-more-btn-container');
    if (btnContainer && btnContainer.style.display !== 'none') {
      initSPWorks();
    }
  });

  // Contact Form Submission Handler
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');
  const formError = document.getElementById('formError');
  const submitBtn = document.getElementById('submitBtn');
  
  if (contactForm && contactSuccess && formError && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Clear previous errors
      formError.style.display = 'none';
      formError.textContent = '';
      
      // Get inputs
      const company = contactForm.querySelector('input[name="会社名"]').value;
      const name = contactForm.querySelector('input[name="お名前"]').value;
      const email = contactForm.querySelector('input[name="メールアドレス"]').value;
      const content = contactForm.querySelector('textarea[name="お問い合わせ内容"]').value;
      
      // Disable inputs and button
      const inputs = contactForm.querySelectorAll('input, textarea');
      inputs.forEach(el => el.disabled = true);
      submitBtn.disabled = true;
      submitBtn.textContent = '送信中...';
      
      const payload = {
        company: company,
        name: name,
        email: email,
        content: content
      };
      
      // Check if testing locally via file protocol
      const isLocalFile = window.location.protocol === 'file:';
      
      function showSuccess() {
        contactForm.classList.add('fade-out');
        setTimeout(() => {
          contactForm.style.display = 'none';
          contactSuccess.classList.add('active');
        }, 400);
      }
      
      function showError(msg) {
        formError.textContent = msg;
        formError.style.display = 'block';
        inputs.forEach(el => el.disabled = false);
        submitBtn.disabled = false;
        submitBtn.textContent = '送信する';
      }
      
      // Local file testing mock
      if (isLocalFile) {
        console.warn('Local file protocol detected. Simulating form submission response...');
        setTimeout(() => {
          showSuccess();
        }, 1200);
        return;
      }
      
      // Actual server send
      fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(async response => {
        const responseText = await response.text();
        let data;

        try {
          data = responseText ? JSON.parse(responseText) : null;
        } catch {
          throw new Error('送信サーバーから正しい応答が返されませんでした。時間をおいて再度お試しください。');
        }

        if (!response.ok) {
          throw new Error(data?.error || '送信中にエラーが発生しました。');
        }

        if (!data) {
          throw new Error('送信サーバーから応答が返されませんでした。時間をおいて再度お試しください。');
        }

        return data;
      })
      .then(data => {
        if (data.success) {
          showSuccess();
        } else {
          throw new Error(data.error || '送信中にエラーが発生しました。');
        }
      })
      .catch(error => {
        console.error('Submission error:', error);
        // If testing on local server that doesn't support PHP, fallback to simulation
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          console.warn('Localhost detected without PHP support. Simulating success...');
          setTimeout(() => {
            showSuccess();
          }, 1000);
        } else {
          showError(error.message || '接続エラーが発生しました。インターネット接続を確認するか、直接 kobayashi@daifuk.jp までご連絡ください。');
        }
      });
    });
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
