document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     MOBILE NAVIGATION MENU
     ========================================================================== */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // Close mobile menu when a nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  });

  /* ==========================================================================
     STICKY HEADER & SCROLL SPY
     ========================================================================== */
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section');

  const handleScroll = () => {
    // Sticky Header
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll Spy (Active nav links matching current section view)
    let scrollPosition = window.scrollY + 200; // Offset for headers

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', handleScroll);
  // Trigger once on load to establish state
  handleScroll();

  /* ==========================================================================
     TYPEWRITER EFFECT (Hero)
     ========================================================================== */
  const typewriterElement = document.getElementById('typewriter');
  const words = ['Specialist', 'Optimizations', 'Strategies', 'WordPress Builds', 'AI Integrations'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  const type = () => {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50; // Speed up deleting
    } else {
      typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 100; // Normal typing speed
    }

    if (!isDeleting && charIndex === currentWord.length) {
      // Pause at full word
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500; // Short pause before typing next word
    }

    setTimeout(type, typeSpeed);
  };

  if (typewriterElement) {
    type();
  }

  /* ==========================================================================
     INTERSECTION OBSERVER (Scroll Reveals)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom, .reveal-stagger');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once animation is run to prevent repeating triggers
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1, // Trigger when 10% of element is in view
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before it enters screen
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  /* ==========================================================================
     PROJECT GALLERY FILTERS
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card-wrapper');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Manage active state of buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      const filterValue = e.target.getAttribute('data-filter');

      projectCards.forEach(card => {
        // Reset card wrapper animation to re-trigger transition
        card.style.animation = 'none';
        card.offsetHeight; // Trigger reflow to restart CSS animations
        card.style.animation = '';

        const cardCategories = card.getAttribute('data-category').split(',');

        if (filterValue === 'all' || cardCategories.includes(filterValue)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     CONTACT FORM HANDLING & CLIENT-SIDE VALIDATION
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');
      
      let hasError = false;

      // Simple validations
      [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = '#ef4444';
          hasError = true;
        } else {
          input.style.borderColor = 'var(--border-color)';
        }
      });

      if (emailInput.value && !validateEmail(emailInput.value)) {
        emailInput.style.borderColor = '#ef4444';
        hasError = true;
      }

      if (hasError) {
        showFormMessage('Please verify all details and try again.', 'error');
        return;
      }

      // Success flow simulation
      const submitBtn = contactForm.querySelector('.submit-btn');
      const originalBtnText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-circle-notch fa-spin"></i>';

      setTimeout(() => {
        showFormMessage('Thank you! Your message was sent successfully.', 'success');
        contactForm.reset();
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        // Reset borders
        [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
          input.style.borderColor = 'var(--border-color)';
        });
      }, 1500);
    });
  }

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const showFormMessage = (msg, type) => {
    if (formMessage) {
      formMessage.textContent = msg;
      formMessage.className = `form-message ${type}`;
      
      // Auto fadeout for success
      if (type === 'success') {
        setTimeout(() => {
          formMessage.style.display = 'none';
        }, 5000);
      }
    }
  };

  /* ==========================================================================
     SCROLL TO TOP BUTTON
     ========================================================================== */
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     INTERACTIVE EXPERIENCE TABS
     ========================================================================== */
  const expTabs = document.getElementById('expTabs');
  if (expTabs) {
    const tabButtons = expTabs.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Deactivate all buttons
        tabButtons.forEach(b => b.classList.remove('active'));
        // Deactivate all panels
        tabPanels.forEach(p => p.classList.remove('active'));

        // Activate current button
        btn.classList.add('active');
        // Activate target panel
        const targetId = btn.getAttribute('data-target');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }
});
