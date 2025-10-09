/**
 * SALi Main JavaScript - Modular Architecture
 * Entry point for the modular JavaScript system
 */

// Import modules
import { ComponentLoader } from './modules/ComponentLoader.js';
import { PerformanceMonitor } from './modules/PerformanceMonitor.js';

// Initialize the application
class SALiApp {
  constructor() {
    this.componentLoader = new ComponentLoader();
    this.performanceMonitor = new PerformanceMonitor();
    this.isInitialized = false;
  }

  /**
   * Initialize the application
   */
  async init() {
    if (this.isInitialized) {
      return;
    }

    try {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.initializeApp());
      } else {
        this.initializeApp();
      }
    } catch (error) {
      console.error('Failed to initialize SALi App:', error);
    }
  }

  /**
   * Initialize application components
   */
  async initializeApp() {
    console.log('🚀 Initializing SALi App...');

    // Initialize performance monitoring
    this.performanceMonitor.init();

    // Load components from files
    await this.loadComponents();

    // Initialize component system
    this.componentLoader.initComponents();

    // Initialize other modules
    this.initializeModules();

    // Setup event listeners
    this.setupEventListeners();

    // Mark as initialized
    this.isInitialized = true;

    console.log('✅ SALi App initialized successfully');
  }

  /**
   * Load component templates from files
   */
  async loadComponents() {
    const components = [
      { name: 'header', path: './components/header.html' },
      { name: 'footer', path: './components/footer.html' },
      { name: 'page-title', path: './components/page-title.html' },
      { name: 'contact-info', path: './components/contact-info.html' }
    ];

    for (const component of components) {
      try {
        await this.componentLoader.loadComponentFromFile(component.name, component.path);
        console.log(`✅ Loaded component: ${component.name}`);
      } catch (error) {
        console.warn(`⚠️ Failed to load component: ${component.name}`, error);
      }
    }
  }

  /**
   * Initialize other modules
   */
  initializeModules() {
    // Initialize lazy loading for images
    this.initializeLazyLoading();

    // Initialize smooth scrolling
    this.initializeSmoothScrolling();

    // Initialize form validation
    this.initializeFormValidation();

    // Initialize accessibility features
    this.initializeAccessibility();
  }

  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Component loaded event
    document.addEventListener('componentLoaded', (event) => {
      const { componentName, element } = event.detail;
      console.log(`📦 Component loaded: ${componentName}`, element);
      
      // Reinitialize any components that need it
      this.reinitializeComponents(element);
    });

    // Performance monitoring
    window.addEventListener('beforeunload', () => {
      this.performanceMonitor.sendToAnalytics();
      this.performanceMonitor.cleanup();
    });

    // Resize event for responsive adjustments
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
  }

  /**
   * Initialize lazy loading for images
   */
  initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      // Observe all images with lazy class
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for older browsers
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
      });
    }
  }

  /**
   * Initialize smooth scrolling
   */
  initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  /**
   * Initialize form validation
   */
  initializeFormValidation() {
    const forms = document.querySelectorAll('.sali-form');
    
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        if (!this.validateForm(form)) {
          e.preventDefault();
        }
      });

      // Real-time validation
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('blur', () => {
          this.validateField(input);
        });
      });
    });
  }

  /**
   * Validate entire form
   */
  validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Validate individual field
   */
  validateField(field) {
    const value = field.value.trim();
    const fieldGroup = field.closest('.sali-form-group');
    const errorElement = fieldGroup?.querySelector('.sali-form-group__error');
    
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }

    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }

    // Phone validation
    if (field.type === 'tel' && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
      }
    }

    // Update field state
    if (fieldGroup) {
      fieldGroup.classList.toggle('sali-form-group--error', !isValid);
      fieldGroup.classList.toggle('sali-form-group--success', isValid && value);
    }

    if (errorElement) {
      errorElement.textContent = errorMessage;
      errorElement.classList.toggle('sali-form-group__error--visible', !isValid);
    }

    return isValid;
  }

  /**
   * Initialize accessibility features
   */
  initializeAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link sr-only';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Focus management for modals and dropdowns
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close any open modals or dropdowns
        const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
        openDropdowns.forEach(dropdown => {
          dropdown.classList.remove('show');
        });
      }
    });

    // ARIA live region for dynamic content
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
  }

  /**
   * Reinitialize components after dynamic loading
   */
  reinitializeComponents(container) {
    // Reinitialize any interactive elements within the loaded component
    const interactiveElements = container.querySelectorAll('[data-toggle], [data-target]');
    interactiveElements.forEach(element => {
      // Reinitialize tooltips, modals, etc.
      if (typeof bootstrap !== 'undefined') {
        bootstrap.Tooltip.getOrCreateInstance(element);
      }
    });
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Recalculate any size-dependent layouts
    const carousels = document.querySelectorAll('.slick-carousel');
    carousels.forEach(carousel => {
      if (carousel.slick) {
        carousel.slick('refresh');
      }
    });
  }

  /**
   * Public API methods
   */
  getComponentLoader() {
    return this.componentLoader;
  }

  getPerformanceMonitor() {
    return this.performanceMonitor;
  }

  // Utility method to announce changes to screen readers
  announceToScreenReader(message) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }
}

// Initialize the application when the script loads
const saliApp = new SALiApp();
saliApp.init();

// Export for global access
window.SALiApp = saliApp;

// Export for module systems
export default saliApp;
