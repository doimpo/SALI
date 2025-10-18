/**
 * Image Optimizer Module
 * 
 * Client-side image optimization utilities:
 * - Progressive image loading
 * - Format detection and serving
 * - Responsive image sizing
 * - Blur-up technique
 */

class ImageOptimizer {
  constructor(options = {}) {
    this.options = {
      rootMargin: '50px',
      threshold: 0.01,
      enableBlurUp: true,
      formats: ['avif', 'webp', 'jpg'],
      ...options
    };

    this.observer = null;
    this.images = new Map();
    this.init();
  }

  /**
   * Initialize the optimizer
   */
  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        {
          rootMargin: this.options.rootMargin,
          threshold: this.options.threshold
        }
      );
    }

    this.observeImages();
    this.detectWebPSupport();
    this.detectAVIFSupport();
  }

  /**
   * Observe all images on the page
   */
  observeImages() {
    const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
    
    images.forEach(img => {
      if (this.observer) {
        this.observer.observe(img);
        this.images.set(img, {
          loaded: false,
          loading: false
        });
      } else {
        // Fallback: load immediately if IntersectionObserver not supported
        this.loadImage(img);
      }
    });
  }

  /**
   * Handle intersection observer callback
   */
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const imageData = this.images.get(img);

        if (imageData && !imageData.loading && !imageData.loaded) {
          this.loadImage(img);
          this.observer.unobserve(img);
        }
      }
    });
  }

  /**
   * Load an image
   */
  loadImage(img) {
    const imageData = this.images.get(img);
    if (imageData) {
      imageData.loading = true;
    }

    const src = img.dataset.src || img.src;
    
    // Apply blur-up if enabled
    if (this.options.enableBlurUp && img.dataset.blurSrc) {
      this.applyBlurUp(img, img.dataset.blurSrc, src);
    } else {
      this.loadDirectly(img, src);
    }
  }

  /**
   * Apply blur-up loading technique
   */
  applyBlurUp(img, blurSrc, fullSrc) {
    // Load tiny blur placeholder first
    const placeholder = new Image();
    placeholder.src = blurSrc;
    
    placeholder.onload = () => {
      img.src = blurSrc;
      img.style.filter = 'blur(10px)';
      img.style.transition = 'filter 0.3s ease-out';

      // Load full image
      const fullImage = new Image();
      fullImage.src = fullSrc;

      fullImage.onload = () => {
        img.src = fullSrc;
        img.style.filter = 'blur(0)';
        this.markAsLoaded(img);
      };

      fullImage.onerror = () => {
        console.error('Failed to load image:', fullSrc);
        img.style.filter = 'blur(0)';
      };
    };
  }

  /**
   * Load image directly
   */
  loadDirectly(img, src) {
    const tempImage = new Image();
    tempImage.src = src;

    tempImage.onload = () => {
      img.src = src;
      this.markAsLoaded(img);
    };

    tempImage.onerror = () => {
      console.error('Failed to load image:', src);
      img.classList.add('image-error');
    };
  }

  /**
   * Mark image as loaded
   */
  markAsLoaded(img) {
    const imageData = this.images.get(img);
    if (imageData) {
      imageData.loaded = true;
      imageData.loading = false;
    }

    img.classList.add('loaded');
    img.removeAttribute('data-src');

    // Dispatch custom event
    img.dispatchEvent(new CustomEvent('imageLoaded', {
      detail: { src: img.src }
    }));
  }

  /**
   * Detect WebP support
   */
  detectWebPSupport() {
    const webpTest = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
    
    const img = new Image();
    img.onload = img.onerror = () => {
      const isSupported = img.height === 1;
      document.documentElement.classList.toggle('webp-supported', isSupported);
      this.webpSupported = isSupported;
    };
    img.src = webpTest;
  }

  /**
   * Detect AVIF support
   */
  detectAVIFSupport() {
    const avifTest = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    
    const img = new Image();
    img.onload = img.onerror = () => {
      const isSupported = img.height === 2;
      document.documentElement.classList.toggle('avif-supported', isSupported);
      this.avifSupported = isSupported;
    };
    img.src = avifTest;
  }

  /**
   * Get optimized image URL based on support
   */
  getOptimizedUrl(basePath) {
    if (this.avifSupported && this.options.formats.includes('avif')) {
      return basePath.replace(/\.(jpg|jpeg|png)$/i, '.avif');
    }
    if (this.webpSupported && this.options.formats.includes('webp')) {
      return basePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    return basePath;
  }

  /**
   * Preload critical images
   */
  preloadCritical(urls) {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = this.getOptimizedUrl(url);
      document.head.appendChild(link);
    });
  }

  /**
   * Destroy the optimizer
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.images.clear();
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImageOptimizer;
}

// Global initialization
if (typeof window !== 'undefined') {
  window.ImageOptimizer = ImageOptimizer;
  
  // Auto-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.imageOptimizer = new ImageOptimizer();
    });
  } else {
    window.imageOptimizer = new ImageOptimizer();
  }
}

