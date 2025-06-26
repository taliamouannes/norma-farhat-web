document.addEventListener('DOMContentLoaded', () => {
  // ===== FADE-IN FOR HOME GALLERY IMAGES =====
  const homeImages = document.querySelectorAll('.homegallery-grid img.fade-in');
  if (homeImages.length) {
    const homeObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    homeImages.forEach(img => {
      if (img.complete) {
        homeObserver.observe(img);
      } else {
        img.addEventListener('load', () => homeObserver.observe(img));
        img.addEventListener('error', () => homeObserver.observe(img));
      }
    });
  }

  // ===== FADE-IN FOR ABOUT PAGE IMAGE =====
  const aboutImage = document.querySelector('.about-image img');
  if (aboutImage) {
    const aboutObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    if (aboutImage.complete) {
      aboutObserver.observe(aboutImage);
    } else {
      aboutImage.addEventListener('load', () => aboutObserver.observe(aboutImage));
      aboutImage.addEventListener('error', () => aboutObserver.observe(aboutImage));
    }
  }

  // ===== FADE-IN FOR ATELIER IMAGES ON SCROLL =====
  const atelierImages = document.querySelectorAll('.atelier-grid img');
  if (atelierImages.length) {
    // Immediate reveal based on scroll position
    const revealAtelier = () => {
      const vh = window.innerHeight;
      atelierImages.forEach(img => {
        const rect = img.getBoundingClientRect();
        if (rect.top <= vh * 0.9) {
          img.classList.add('visible');
        }
      });
    };
    window.addEventListener('scroll', revealAtelier);
    revealAtelier(); // Run once on page load

    // IntersectionObserver fade-in for better performance
    const atelierObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    atelierImages.forEach(img => {
      if (img.complete) {
        atelierObserver.observe(img);
      } else {
        img.addEventListener('load', () => atelierObserver.observe(img));
        img.addEventListener('error', () => atelierObserver.observe(img));
      }
    });
  }

  // ===== MOBILE NAV TOGGLE =====
  const burger = document.getElementById('burger');
  const navList = document.querySelector('.nav ul');
  if (burger && navList) {
    burger.addEventListener('click', () => navList.classList.toggle('open'));
  }

  // ===== GALLERY PAGE FEATURES =====
  const categoryButtons = document.querySelectorAll('.category-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const closeBtn = document.getElementById('close-lightbox');
  const nextBtn = document.getElementById('next');
  const prevBtn = document.getElementById('prev');

  if (categoryButtons.length && galleryItems.length && lightbox && lightboxImage && closeBtn && nextBtn && prevBtn) {
    let currentIndex = 0;
    let currentItems = [];

    // Category filter buttons
    categoryButtons.forEach(button => {
      button.addEventListener('click', () => {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const category = button.dataset.category;
        currentItems = [];

        galleryItems.forEach(item => {
          const itemCategory = item.dataset.category;
          const show = category === 'all' || itemCategory === category;

          if (show) {
            item.style.display = 'block';
            currentItems.push(item);
            setTimeout(() => item.classList.add('visible'), 10);
          } else {
            item.style.display = 'none';
            item.classList.remove('visible');
          }
        });
      });
    });

    // Lightbox open on image click
    galleryItems.forEach((item, index) => {
      const img = item.querySelector('img');
      if (img) {
        img.addEventListener('click', () => {
          currentItems = Array.from(galleryItems).filter(i => i.style.display !== 'none');
          currentIndex = currentItems.indexOf(item);
          showImage(currentItems[currentIndex]);
          lightbox.style.display = 'flex';
        });
      }
    });

    function showImage(item) {
      const img = item.querySelector('img');
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt || '';
    }

    closeBtn.addEventListener('click', () => {
      lightbox.style.display = 'none';
    });

    nextBtn.addEventListener('click', () => {
      if (currentItems.length === 0) return;
      currentIndex = (currentIndex + 1) % currentItems.length;
      showImage(currentItems[currentIndex]);
    });

    prevBtn.addEventListener('click', () => {
      if (currentItems.length === 0) return;
      currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
      showImage(currentItems[currentIndex]);
    });

    // Trigger default category on load
    categoryButtons[0].click();

    // Add landscape/portrait classes to gallery images
    galleryItems.forEach(item => {
      const img = item.querySelector('img');
      if (!img) return;

      img.onload = () => {
        const isLandscape = img.naturalWidth > img.naturalHeight;
        img.classList.add(isLandscape ? 'landscape' : 'portrait');
      };
      if (img.complete) {
        const isLandscape = img.naturalWidth > img.naturalHeight;
        img.classList.add(isLandscape ? 'landscape' : 'portrait');
      }
    });
  }

  // ===== CONTACT PAGE FEATURES =====
  const form = document.getElementById('contact-form');
if (form) {
  const fields = form.querySelectorAll('input, textarea');
  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');
  const progressBar = document.getElementById('form-progress');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate each field
    fields.forEach(field => {
      const error = field.parentElement.querySelector('.error-message');
      if (!field.checkValidity()) {
        isValid = false;
        field.classList.add('has-error');

        if (field.validity.valueMissing) {
          error.textContent = 'Ce champ est requis.';
        } else if (field.type === 'email' && field.validity.typeMismatch) {
          error.textContent = 'Veuillez entrer une adresse email valide.';
        } else {
          error.textContent = 'Entrée invalide.';
        }
        error.style.display = 'block';
      } else {
        field.classList.remove('has-error');
        error.textContent = '';
        error.style.display = 'none';
      }
    });

    if (isValid) {
      submitBtn.disabled = true;
      progressBar.classList.add('sending');
      status.textContent = '';

      // Prepare data
      const formData = new FormData(form);

      // Send to Formspree
      fetch("https://formspree.io/f/mldnolvz", {
        method: "POST",
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      })
      .then(response => {
        progressBar.classList.remove('sending');
        submitBtn.disabled = false;
        if (response.ok) {
          status.textContent = 'Merci pour votre message !';
          form.reset();
        } else {
          status.textContent = 'Une erreur est survenue. Veuillez réessayer.';
        }
      })
      .catch(() => {
        progressBar.classList.remove('sending');
        submitBtn.disabled = false;
        status.textContent = 'Erreur de connexion. Veuillez réessayer.';
      });
    } else {
      status.textContent = '';
    }
  });

  // Clear errors on typing
  fields.forEach(field => {
    field.addEventListener('input', () => {
      const error = field.parentElement.querySelector('.error-message');
      if (field.checkValidity()) {
        field.classList.remove('has-error');
        error.textContent = '';
        error.style.display = 'none';
      }
    });
  });
}
});
