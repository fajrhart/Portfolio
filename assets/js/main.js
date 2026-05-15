/* =============================================
   MAIN.JS — Portfolio Dynamic Rendering
   ============================================= */

(function () {
  'use strict';

  // ========== DATA LOADING ==========
  async function loadJSON(path) {
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`Failed to load ${path}`);
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  // ========== RENDER FUNCTIONS ==========

  function renderHero(profile) {
    const nameEl = document.getElementById('heroName');
    const roleEl = document.getElementById('heroRole');
    const taglineEl = document.getElementById('heroTagline');
    const cvBtn = document.getElementById('downloadCv');

    if (nameEl) nameEl.textContent = profile.name;
    if (roleEl) roleEl.textContent = profile.role;
    if (taglineEl) taglineEl.textContent = profile.tagline;
    if (cvBtn && profile.cvLink) cvBtn.href = profile.cvLink;

    // Update page title
    document.title = `${profile.name} — ${profile.role} Portfolio`;
  }

  function renderAbout(profile) {
    const aboutEl = document.getElementById('aboutText');
    if (!aboutEl) return;

    let html = `<p>${profile.about}</p>`;

    if (profile.focusAreas && profile.focusAreas.length > 0) {
      html += `<div class="focus-areas">`;
      profile.focusAreas.forEach(area => {
        html += `<span class="focus-tag"><i class="fa-solid fa-check"></i>${area}</span>`;
      });
      html += `</div>`;
    }

    aboutEl.innerHTML = html;

    const statYears = document.getElementById('statYears');
    if (statYears) statYears.textContent = profile.yearsOfExperience;
  }

  function renderSkills(data) {
    const grid = document.getElementById('skillsGrid');
    if (!grid || !data || !data.categories) return;

    grid.innerHTML = data.categories.map(cat => `
      <div class="skill-card animate-on-scroll">
        <div class="skill-card-header">
          <div class="skill-card-icon">
            <i class="${cat.icon}"></i>
          </div>
          <h3 class="skill-card-title">${cat.title}</h3>
        </div>
        <div class="skill-tags">
          ${cat.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  function renderExperience(data) {
    const timeline = document.getElementById('timeline');
    if (!timeline || !data || !data.experiences) return;

    timeline.innerHTML = data.experiences.map(exp => `
      <div class="timeline-item animate-on-scroll">
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          <div class="timeline-header">
            <span class="timeline-company">${exp.company}</span>
            <span class="timeline-period">${exp.period}</span>
          </div>
          <p class="timeline-role">${exp.role}</p>
          <ul class="timeline-contributions">
            ${exp.contributions.map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>
      </div>
    `).join('');
  }

  function renderEducation(data) {
    const grid = document.getElementById('educationGrid');
    if (!grid || !data || !data.education) return;

    if (data.education.length === 0) {
      const section = document.getElementById('education');
      if (section) section.style.display = 'none';
      return;
    }

    grid.innerHTML = data.education.map(edu => `
      <div class="education-card animate-on-scroll">
        <div class="education-icon">
          <i class="fa-solid fa-graduation-cap"></i>
        </div>
        <div class="education-body">
          <div class="education-header">
            <h3 class="education-degree">${edu.degree}</h3>
            <span class="education-period">${edu.period}</span>
          </div>
          <p class="education-field">${edu.field}</p>
          <p class="education-institution">
            <i class="fa-solid fa-building-columns"></i> ${edu.institution}
          </p>
          ${edu.gpa ? `<p class="education-gpa"><i class="fa-solid fa-star"></i> GPA: ${edu.gpa}</p>` : ''}
        </div>
      </div>
    `).join('');
  }

  function renderProjects(data) {
    const grid = document.getElementById('projectsGrid');
    if (!grid || !data || !data.projects) return;

    grid.innerHTML = data.projects.map(proj => {
      let imageHtml = '';
      if (proj.screenshot) {
        const images = proj.screenshot.split(',').map(s => s.trim());

        // Helper function to render media (img or video)
        const renderMedia = (src) => {
          const isVideo = src.toLowerCase().endsWith('.mp4') || src.toLowerCase().endsWith('.webm');
          if (isVideo) {
            return `<video src="${src}" controls muted loop playsinline class="project-media"></video>`;
          }
          return `<img src="${src}" alt="${proj.name}" loading="lazy" class="project-media">`;
        };

        if (images.length > 1) {
          imageHtml = `
            <div class="project-slider-container">
              <div class="project-slider">
                ${images.map(src => renderMedia(src)).join('')}
              </div>
              <div class="slider-hint"><i class="fa-solid fa-arrows-left-right"></i> Geser media</div>
            </div>`;
        } else {
          imageHtml = `
            <div class="project-image">
              ${renderMedia(images[0])}
            </div>`;
        }
      } else {
        imageHtml = `
          <div class="project-image-placeholder">
            <i class="fa-solid fa-microchip"></i>
          </div>`;
      }

      return `
      <div class="project-card animate-on-scroll">
        ${imageHtml}
        <div class="project-body">
          <span class="project-role">${proj.role}</span>
          <h3 class="project-name">${proj.name}</h3>
          <p class="project-description">${proj.description}</p>
          <div class="project-tech">
            ${proj.tech.map(t => `<span class="tech-badge">${t}</span>`).join('')}
          </div>
          <div class="project-links">
            ${proj.github ? `<a href="${proj.github}" target="_blank" rel="noopener" class="project-link"><i class="fa-brands fa-github"></i> GitHub</a>` : ''}
          </div>
        </div>
      </div>
      `;
    }).join('');
  }

  function renderCertifications(data) {
    const grid = document.getElementById('certsGrid');
    if (!grid || !data || !data.certifications) return;

    if (data.certifications.length === 0) {
      // Hide section if no certs
      const section = document.getElementById('certifications');
      if (section) section.style.display = 'none';
      return;
    }

    grid.innerHTML = data.certifications.map(cert => `
      <div class="cert-card animate-on-scroll">
        <div class="cert-icon"><i class="fa-solid fa-award"></i></div>
        <h3 class="cert-name">${cert.name}</h3>
        <p class="cert-vendor">${cert.vendor}</p>
        <p class="cert-year">${cert.year}</p>
      </div>
    `).join('');
  }

  function renderContact(profile) {
    const linksEl = document.getElementById('contactLinks');
    const availabilityEl = document.getElementById('contactAvailability');
    const emailBtn = document.getElementById('contactEmail');

    if (availabilityEl && profile.availability) {
      availabilityEl.textContent = profile.availability;
    }

    if (emailBtn && profile.contact && profile.contact.email) {
      emailBtn.href = `mailto:${profile.contact.email}`;
    }

    if (!linksEl || !profile.contact) return;

    const links = [];

    if (profile.contact.email) {
      links.push(`
        <a href="mailto:${profile.contact.email}" class="contact-link-item">
          <i class="fa-solid fa-envelope"></i> ${profile.contact.email}
        </a>
      `);
    }
    if (profile.contact.phone) {
      const waNumber = profile.contact.phone.replace('+', '');
      links.push(`
        <a href="https://wa.me/${waNumber}" target="_blank" rel="noopener" class="contact-link-item">
          <i class="fa-brands fa-whatsapp"></i> ${profile.contact.phone}
        </a>
      `);
    }
    if (profile.contact.location) {
      links.push(`
        <span class="contact-link-item">
          <i class="fa-solid fa-location-dot"></i> ${profile.contact.location}
        </span>
      `);
    }
    if (profile.contact.linkedin) {
      links.push(`
        <a href="${profile.contact.linkedin}" target="_blank" rel="noopener" class="contact-link-item">
          <i class="fa-brands fa-linkedin"></i> LinkedIn
        </a>
      `);
    }
    if (profile.contact.github) {
      links.push(`
        <a href="${profile.contact.github}" target="_blank" rel="noopener" class="contact-link-item">
          <i class="fa-brands fa-github"></i> GitHub
        </a>
      `);
    }

    linksEl.innerHTML = links.join('');
  }

  // ========== NAVIGATION ==========

  function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll → navbar background
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    // Mobile toggle
    if (navToggle) {
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
      });
    }

    // Close mobile menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY + 120;
      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);

        if (link) {
          if (scrollY >= top && scrollY < top + height) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        }
      });
    });
  }

  // ========== SCROLL ANIMATIONS ==========

  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    // Observe initial elements
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });

    // Re-observe after dynamic content loads
    setTimeout(() => {
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        if (!el.classList.contains('visible')) {
          observer.observe(el);
        }
      });
    }, 500);
  }

  // ========== THEME TOGGLE ==========
  function initTheme() {
    const toggleBtn = document.getElementById('themeToggle');
    const icon = toggleBtn ? toggleBtn.querySelector('i') : null;

    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode');
      if (icon) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      }
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');

        if (icon) {
          icon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }

        localStorage.setItem('theme', isLight ? 'light' : 'dark');
      });
    }
  }

  // ========== CONTACT FORM ==========
  function initContactForm() {
    const form = document.getElementById('contactForm');
    const statusEl = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;
      statusEl.textContent = '';
      statusEl.className = 'form-status';

      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: new FormData(form),
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          statusEl.textContent = 'Message sent successfully! I will get back to you soon.';
          statusEl.classList.add('success');
          form.reset();
        } else {
          statusEl.textContent = 'Oops! There was a problem sending your message.';
          statusEl.classList.add('error');
        }
      } catch (error) {
        statusEl.textContent = 'Oops! There was a network error.';
        statusEl.classList.add('error');
      } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }

  // ========== INIT ==========

  async function init() {
    // Load all data in parallel
    const [profile, skills, experience, projects, education] = await Promise.all([
      loadJSON('data/profile.json'),
      loadJSON('data/skills.json'),
      loadJSON('data/experience.json'),
      loadJSON('data/projects.json'),
      loadJSON('data/education.json')
    ]);

    // Render sections
    if (profile) {
      renderHero(profile);
      renderAbout(profile);
      renderContact(profile);
    }

    if (skills) renderSkills(skills);
    if (experience) renderExperience(experience);
    if (education) renderEducation(education);
    if (projects) {
      renderProjects(projects);
      renderCertifications(projects);
    }

    // Initialize interactivity
    initNavigation();
    initScrollAnimations();
    initTheme();
    initContactForm();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
