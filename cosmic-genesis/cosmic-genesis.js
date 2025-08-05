/*
  COSMIC GENESIS - Timeline Control
  Scientific accuracy with sequential animations
  No text overlaps, CERN-level precision
*/

class CosmicGenesis {
  constructor() {
    this.currentEra = 0;
    this.totalEras = 25; // Updated to include quantum gravity, string theory, and multiverse
    this.isPlaying = false;
    this.playbackSpeed = 1;
    this.animationTimeouts = [];
    this.observerInstances = [];
    this.isProgrammaticNavigation = false; // Flag to prevent scroll conflict
    
    this.init();
  }

  init() {
    this.setupElements();
    this.setupNavigation();
    this.setupControls();
    this.setupScrollObserver();
    this.setupKeyboardControls();
    this.setupTooltips();
    this.setupHorizontalScrolling();
    this.initializeTimeline();
    this.preventTextOverlaps();
    
    // Start with first era and ensure proper positioning
    // Add a small delay to ensure DOM is fully loaded
    setTimeout(() => {
      console.log('Initializing cosmic genesis timeline...');
      this.forceLayoutRecalculation();
      this.navigateToEra(0);
      // Ensure dropdown is initialized with correct era
      this.updateDropdownActiveState(0);
    }, 100);
  }

  setupElements() {
    this.container = document.getElementById('cosmicContainer');
    this.canvas = document.getElementById('cosmic-canvas');
    this.timeline = document.querySelector('.timeline-navigation');
    this.navProgress = document.querySelector('.nav-progress');
    this.markers = document.querySelectorAll('.nav-marker');
    this.eras = document.querySelectorAll('.cosmic-era');
    
    // Era navigation circles (legacy)
    this.eraNavigation = document.getElementById('eraNavigation');
    this.navCircles = document.querySelectorAll('.nav-circle');
    
    // Era dropdown navigation
    this.eraDropdown = document.getElementById('eraDropdown');
    this.dropdownToggle = document.getElementById('dropdownToggle');
    this.dropdownMenu = document.getElementById('dropdownMenu');
    this.dropdownItems = document.querySelectorAll('.dropdown-item');
    this.currentEraText = document.querySelector('.current-era-text');
    
    // Control buttons
    this.playBtn = document.getElementById('playPause');
    this.speedBtn = document.getElementById('speedControl');
    this.fullscreenBtn = document.getElementById('fullscreenBtn');
    
    // Initialize canvas for particle effects
    this.initializeCanvas();
  }

  initializeCanvas() {
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    this.particles = [];
    for (let i = 0; i < 100; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        color: this.getParticleColor()
      });
    }
    
    this.animateParticles();
    
    // Resize handler
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      
      // Recalculate scroll position on resize to maintain current era view
      if (this.currentEra !== undefined) {
        // Use a timeout to allow layout to settle after resize
        setTimeout(() => {
          this.navigateToEra(this.currentEra);
        }, 100);
      }
    });
  }

  getParticleColor() {
    const colors = [
      'rgba(102, 126, 234, 0.6)',
      'rgba(240, 147, 251, 0.6)',
      'rgba(79, 172, 254, 0.6)',
      'rgba(67, 233, 123, 0.6)',
      'rgba(0, 242, 254, 0.6)'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  animateParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fill();
    });
    
    this.ctx.globalAlpha = 1;
    requestAnimationFrame(() => this.animateParticles());
  }

  setupNavigation() {
    // Navigation markers click handlers
    this.markers = document.querySelectorAll('.nav-marker');
    this.markers.forEach((marker, index) => {
      marker.addEventListener('click', () => {
        this.navigateToEra(index);
      });
      
      // Add hover effects
      marker.addEventListener('mouseenter', () => {
        this.showEraPreview(index);
      });
      
      marker.addEventListener('mouseleave', () => {
        this.hideEraPreview();
      });
    });

    // Era navigation circles click handlers
    console.log(`Setting up ${this.navCircles.length} navigation circles`);
    this.navCircles.forEach((circle, index) => {
      circle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(`Navigation circle ${index} clicked`);
        this.navigateToEra(index);
      });
      
      // Add visual feedback on click
      circle.addEventListener('mousedown', () => {
        circle.style.transform = 'scale(0.95)';
      });
      
      circle.addEventListener('mouseup', () => {
        circle.style.transform = 'scale(1)';
      });
      
      circle.addEventListener('mouseleave', () => {
        circle.style.transform = 'scale(1)';
      });
    });

    // Era dropdown navigation handlers
    if (this.dropdownToggle && this.dropdownMenu) {
      // Toggle dropdown on button click
      this.dropdownToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleDropdown();
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!this.eraDropdown.contains(e.target)) {
          this.closeDropdown();
        }
      });

      // Handle dropdown item clicks
      this.dropdownItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const eraIndex = parseInt(item.dataset.era);
          console.log(`Dropdown item ${eraIndex} clicked`);
          this.navigateToEra(eraIndex);
          this.closeDropdown();
        });
      });

      console.log(`Setting up dropdown with ${this.dropdownItems.length} items`);
    }
  }

  setupControls() {
    // Play/Pause button
    this.playBtn?.addEventListener('click', () => {
      this.togglePlayback();
    });
    
    // Speed control
    this.speedBtn?.addEventListener('click', () => {
      this.cycleSpeed();
    });
    
    // Fullscreen toggle
    this.fullscreenBtn?.addEventListener('click', () => {
      this.toggleFullscreen();
    });
  }

  setupScrollObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: [0.1, 0.5, 0.9] // Multiple thresholds for better detection
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Only update if era is significantly visible (>70%) and not during programmatic navigation
        if (entry.isIntersecting && entry.intersectionRatio > 0.7 && !this.isProgrammaticNavigation) {
          const eraIndex = parseInt(entry.target.dataset.era);
          if (this.currentEra !== eraIndex) {
            console.log(`📜 Intersection observer detected manual scroll: Era ${this.currentEra} → ${eraIndex} (ratio: ${entry.intersectionRatio.toFixed(2)})`);
            
            // Debounce rapid changes to prevent flickering
            clearTimeout(this.intersectionTimeout);
            this.intersectionTimeout = setTimeout(() => {
              this.currentEra = eraIndex;
              this.updateTimeline();
              this.updateActiveNavCircle(eraIndex);
              this.updateDropdownActiveState(eraIndex);
              this.triggerEraAnimations(eraIndex);
            }, 100);
          }
        }
      });
    }, options);

    this.eras.forEach(era => {
      this.observer.observe(era);
    });

    // Additional scroll listener for more precise detection
    let scrollTimeout;
    this.container.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.detectCurrentEraFromScroll();
      }, 50); // Reduced debounce for faster response
    });

    // Enhanced wheel event for page snapping
    this.container.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        // Horizontal scroll detected - let CSS scroll-snap handle it
        return;
      }
      
      if (Math.abs(e.deltaY) > 50) { // Significant vertical scroll
        e.preventDefault();
        
        let targetEra = null;
        if (e.deltaY > 0 && this.currentEra < this.totalEras - 1) {
          // Scroll down/right - next era
          targetEra = this.currentEra + 1;
        } else if (e.deltaY < 0 && this.currentEra > 0) {
          // Scroll up/left - previous era
          targetEra = this.currentEra - 1;
        }
        
        if (targetEra !== null) {
          // Immediate dropdown update to prevent flickering
          this.updateDropdownActiveState(targetEra);
          this.navigateToEra(targetEra);
        }
      }
    }, { passive: false });
  }

  setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
      switch(e.code) {
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          this.previousEra();
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          this.nextEra();
          break;
        case 'Space':
          e.preventDefault();
          this.togglePlayback();
          break;
        case 'KeyF':
          e.preventDefault();
          this.toggleFullscreen();
          break;
        case 'KeyR':
          e.preventDefault();
          this.resetTimeline();
          break;
      }
    });
  }

  setupHorizontalScrolling() {
    // Force recalculate layout for inline-block
    this.container.style.whiteSpace = 'nowrap';
    this.container.style.fontSize = '0'; // Remove whitespace between inline-block elements
    
    this.eras.forEach((era, index) => {
      era.style.width = '100vw';
      era.style.minWidth = '100vw';
      era.style.maxWidth = '100vw';
      era.style.display = 'inline-block';
      era.style.verticalAlign = 'top';
      era.style.whiteSpace = 'normal';
      era.style.fontSize = '1rem'; // Reset font size for content
      era.style.boxSizing = 'border-box';
      
      // Debug: log each era's computed width
      setTimeout(() => {
        const computedWidth = window.getComputedStyle(era).width;
        console.log(`Era ${index} computed width: ${computedWidth}, offsetWidth: ${era.offsetWidth}px`);
      }, 50);
    });
    
    // Simplified wheel event listener
    this.container.addEventListener('wheel', (e) => {
      e.preventDefault();
      
      // Convert vertical wheel to horizontal scroll with high sensitivity
      const scrollAmount = e.deltaY * 5;
      this.container.scrollLeft += scrollAmount;
      
      // Visual feedback
      this.container.style.outline = '3px solid rgba(102, 126, 234, 0.8)';
      setTimeout(() => {
        this.container.style.outline = 'none';
      }, 200);
    }, { passive: false });

    // Handle scroll events to update current era (immediate response)
    this.container.addEventListener('scroll', (e) => {
      const scrollLeft = this.container.scrollLeft;
      this.updateCurrentEraFromScroll(scrollLeft);
    });
    
    // Also add a throttled version for debugging
    let scrollTimeout;
    this.container.addEventListener('scroll', (e) => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        console.log(`📜 Throttled scroll check at ${this.container.scrollLeft}px`);
      }, 100);
    });
  }

  setupTooltips() {
    // Add keyboard shortcut tooltips
    const tooltips = [
      { element: this.playBtn, text: 'Play/Pause (Space)' },
      { element: this.speedBtn, text: 'Speed Control' },
      { element: this.fullscreenBtn, text: 'Fullscreen (F)' }
    ];
    
    tooltips.forEach(({ element, text }) => {
      if (element) {
        element.title = text;
      }
    });
  }

  initializeTimeline() {
    // Set initial timeline state
    this.updateTimeline();
    
    // Initialize MathJax if available
    if (window.MathJax) {
      MathJax.typesetPromise().catch(() => {
        // MathJax initialization handled silently
      });
    }
  }

  preventTextOverlaps() {
    // Stagger animations to prevent text overlaps
    const phaseLabels = document.querySelectorAll('.phase-label');
    const forceLabels = document.querySelectorAll('.force-line, .decay-products');
    
    // Sequential fade-in for phase labels with proper delays
    phaseLabels.forEach((label, index) => {
      const baseDelay = index * 3; // 3 second intervals
      label.style.animationDelay = `${baseDelay}s`;
      label.style.animationDuration = '2s'; // Shorter duration to prevent overlap
    });
    
    // Stagger force separation animations
    forceLabels.forEach((label, index) => {
      const baseDelay = index * 1.5; // 1.5 second intervals
      label.style.animationDelay = `${baseDelay}s`;
      label.style.animationFillMode = 'both';
    });
    
    // Ensure Big Bang phase labels don't overlap
    this.staggerBigBangLabels();
  }

  staggerBigBangLabels() {
    const bigBangPhases = document.querySelectorAll('.epoch-phase .phase-label');
    const intervals = [0, 5, 10, 15, 20, 25, 35, 45]; // Non-overlapping intervals
    
    bigBangPhases.forEach((phase, index) => {
      if (intervals[index]) {
        phase.style.animationDelay = `${intervals[index]}s`;
        phase.style.animationDuration = '4s'; // 4 second display time
        phase.style.animationFillMode = 'both';
        
        // Add fade out before next phase
        const fadeOutDelay = intervals[index] + 3; // Fade out 1 second before next
        phase.style.animation = `
          fadeInOut 4s ${intervals[index]}s both,
          fadeOut 1s ${fadeOutDelay}s both
        `;
      }
    });
  }

  navigateToEra(eraIndex, isAutoplay = false) {
    if (eraIndex < 0 || eraIndex >= this.totalEras) {
      console.warn(`Invalid era index: ${eraIndex}. Valid range is 0-${this.totalEras - 1}`);
      return;
    }
    
    // Only stop auto-play if this is not an autoplay navigation
    if (this.isPlaying && !isAutoplay) {
      this.stopAutoplay();
    }
    
    // Set flag to prevent scroll detection conflicts
    this.isProgrammaticNavigation = true;
    
    // Update dropdown IMMEDIATELY to prevent flickering
    this.updateDropdownActiveState(eraIndex);
    
    this.currentEra = eraIndex;
    this.showEra(eraIndex);
    this.updateTimeline();
    this.updateActiveNavCircle(eraIndex);
    
    // Calculate exact scroll position to fit the era page perfectly
    const targetEra = document.querySelector(`[data-era="${eraIndex}"]`);
    
    if (!targetEra) {
      console.error(`Era element not found for index ${eraIndex}`);
      return;
    }
    
    if (!this.container) {
      console.error('Container element not found');
      return;
    }
    
    // Method 1: Use the element's offset position (most accurate)
    let targetLeft = targetEra.offsetLeft;
    
    // Method 2: Fallback calculation based on viewport width (in case of layout issues)
    const fallbackLeft = eraIndex * window.innerWidth;
    
    // Use the offset method, but verify it's reasonable compared to fallback
    const difference = Math.abs(targetLeft - fallbackLeft);
    if (difference > window.innerWidth * 0.1) { // If more than 10% off, use fallback
      console.warn(`Era ${eraIndex} offset seems incorrect (${targetLeft} vs expected ${fallbackLeft}), using fallback`);
      targetLeft = fallbackLeft;
    }
    
    // Ensure pixel-perfect alignment
    const preciseLeft = Math.round(targetLeft);
    
    console.log(`Navigating to Era ${eraIndex}: "${targetEra.querySelector('.era-title')?.textContent || 'Unknown'}" at position ${preciseLeft}px`);
    
    // Smooth scroll to the exact position
    try {
      this.container.scrollTo({
        left: preciseLeft,
        behavior: 'smooth'
      });
      
      // Update internal tracking
      this.currentScrollLeft = preciseLeft;
      
      // Verify scroll after a short delay
      setTimeout(() => {
        const actualScrollLeft = this.container.scrollLeft;
        const scrollDifference = Math.abs(actualScrollLeft - preciseLeft);
        if (scrollDifference > 10) {
          console.warn(`Scroll verification failed. Expected: ${preciseLeft}, Actual: ${actualScrollLeft}, Difference: ${scrollDifference}px`);
          // Try immediate scroll as fallback
          this.container.scrollLeft = preciseLeft;
        }
        // Clear programmatic navigation flag after scroll is complete
        setTimeout(() => {
          this.isProgrammaticNavigation = false;
        }, 50); // Shorter delay for autoplay compatibility
      }, 300); // Reduced timeout for faster responsiveness
      
    } catch (error) {
      console.error('Error during scroll:', error);
      // Fallback to immediate scroll
      this.container.scrollLeft = preciseLeft;
      // Clear flag even if error occurred (with delay)
      setTimeout(() => {
        this.isProgrammaticNavigation = false;
      }, 350);
    }
  }

  testNavigation() {
    console.log('=== Navigation System Test ===');
    console.log(`Total eras: ${this.totalEras}`);
    console.log(`Container element:`, this.container);
    console.log(`Container scroll width: ${this.container?.scrollWidth}px`);
    console.log(`Window width: ${window.innerWidth}px`);
    console.log(`Expected total width: ${this.totalEras * window.innerWidth}px`);
    console.log(`Navigation circles found: ${this.navCircles?.length || 0}`);
    
    // Test all era elements
    console.log('--- Era Position Analysis ---');
    let totalWidthSum = 0;
    for (let i = 0; i < this.totalEras; i++) {
      const era = document.querySelector(`[data-era="${i}"]`);
      if (era) {
        const computedStyle = window.getComputedStyle(era);
        const actualWidth = era.offsetWidth;
        const expectedLeft = i * window.innerWidth;
        const actualLeft = era.offsetLeft;
        const difference = actualLeft - expectedLeft;
        
        console.log(`Era ${i}: offsetLeft=${actualLeft}px (expected=${expectedLeft}px, diff=${difference}px), width=${actualWidth}px (computed=${computedStyle.width})`);
        totalWidthSum += actualWidth;
      } else {
        console.warn(`Era ${i}: element not found!`);
      }
    }
    
    console.log(`Total width sum: ${totalWidthSum}px vs container scroll width: ${this.container?.scrollWidth}px`);
    
    // Test navigation circle functionality
    if (this.navCircles && this.navCircles.length > 0) {
      console.log('Navigation circles are properly initialized');
      console.log('Click any navigation circle to test navigation');
    } else {
      console.error('Navigation circles not found or not initialized!');
    }
    
    // Layout diagnosis
    if (this.container?.scrollWidth < this.totalEras * window.innerWidth * 0.9) {
      console.warn('⚠️  LAYOUT ISSUE DETECTED: Container scroll width is much smaller than expected!');
      console.log('This suggests eras are not taking full 100vw width as intended.');
      console.log('Check CSS and inline-block whitespace issues.');
    } else {
      console.log('✅ Layout appears correct - eras are taking proper width');
    }
    
    console.log('=== End Navigation Test ===');
  }

  forceLayoutRecalculation() {
    console.log('🔄 Forcing layout recalculation...');
    
    // Force a reflow by accessing offsetHeight
    this.container.offsetHeight;
    
    // Re-apply styles to ensure proper layout
    this.container.style.fontSize = '0';
    this.container.style.whiteSpace = 'nowrap';
    
    this.eras.forEach((era, index) => {
      era.style.width = '100vw';
      era.style.minWidth = '100vw';
      era.style.maxWidth = '100vw';
      era.style.display = 'inline-block';
      era.style.verticalAlign = 'top';
      era.style.fontSize = '1rem';
      era.style.boxSizing = 'border-box';
      
      // Force reflow for each era
      era.offsetWidth;
    });
    
    console.log(`After recalculation: Container scroll width: ${this.container.scrollWidth}px`);
    
    // Re-run test
    setTimeout(() => this.testNavigation(), 100);
  }

  updateCurrentEraFromScroll(scrollLeft) {
    // More robust era detection based on actual element positions
    let newEra = 0;
    let minDistance = Infinity;
    
    for (let i = 0; i < this.totalEras; i++) {
      const era = document.querySelector(`[data-era="${i}"]`);
      if (era) {
        const eraLeft = era.offsetLeft;
        const distance = Math.abs(scrollLeft - eraLeft);
        
        if (distance < minDistance) {
          minDistance = distance;
          newEra = i;
        }
      }
    }
    
    if (newEra !== this.currentEra && newEra >= 0 && newEra < this.totalEras) {
      console.log(`🎯 Scroll navigation: Era ${this.currentEra} → Era ${newEra} (scroll: ${scrollLeft}px)`);
      this.currentEra = newEra;
      this.updateTimeline();
      this.updateActiveNavCircle(newEra); // Update navigation circle highlighting
      this.showEra(newEra); // Update era display
    }
  }

  updateActiveNavCircle(eraIndex) {
    // Update active state for navigation circles
    if (this.navCircles) {
      let changedCircles = [];
      this.navCircles.forEach((circle, index) => {
        const wasActive = circle.classList.contains('active');
        const shouldBeActive = index === eraIndex;
        circle.classList.toggle('active', shouldBeActive);
        
        if (wasActive !== shouldBeActive) {
          changedCircles.push(`${index}:${shouldBeActive ? 'ON' : 'OFF'}`);
        }
      });
      
      if (changedCircles.length > 0) {
        console.log(`🔘 Circle updates: ${changedCircles.join(', ')}`);
      }
    } else {
      console.error('❌ No navigation circles found in updateActiveNavCircle');
    }
    
    // Update dropdown active state
    this.updateDropdownActiveState(eraIndex);
  }

  detectCurrentEraFromScroll() {
    if (!this.container || this.isProgrammaticNavigation) return;
    
    const scrollLeft = this.container.scrollLeft;
    const viewportWidth = window.innerWidth;
    
    // Calculate which era is currently most visible
    const currentEraFromScroll = Math.round(scrollLeft / viewportWidth);
    
    // Ensure era index is within valid range
    const clampedEra = Math.max(0, Math.min(currentEraFromScroll, this.totalEras - 1));
    
    if (this.currentEra !== clampedEra) {
      console.log(`🖱️ Scroll-based detection: Era ${this.currentEra} → ${clampedEra} (scrollLeft: ${scrollLeft}px)`);
      
      // Clear any pending intersection observer updates to prevent conflicts
      clearTimeout(this.intersectionTimeout);
      
      this.currentEra = clampedEra;
      this.updateTimeline();
      this.updateActiveNavCircle(clampedEra);
      this.updateDropdownActiveState(clampedEra);
      this.triggerEraAnimations(clampedEra);
    }
  }

  toggleDropdown() {
    const isOpen = this.dropdownMenu.classList.contains('show');
    if (isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown() {
    this.dropdownMenu.classList.add('show');
    this.dropdownToggle.classList.add('open');
  }

  closeDropdown() {
    this.dropdownMenu.classList.remove('show');
    this.dropdownToggle.classList.remove('open');
  }

  updateDropdownActiveState(eraIndex) {
    // Update active state for dropdown items
    if (this.dropdownItems) {
      this.dropdownItems.forEach((item, index) => {
        const itemEra = parseInt(item.dataset.era);
        item.classList.toggle('active', itemEra === eraIndex);
      });
    }

    // Update current era text in dropdown toggle
    if (this.currentEraText) {
      const eraNames = [
        'The Singularity', 'Planck Epoch', 'Grand Unification', 'Baryogenesis',
        'Cosmic Inflation', 'Electroweak Breaking', 'Quark-Gluon Plasma',
        'Neutrino Decoupling', 'Big Bang Nucleosynthesis', 'Matter-Radiation Equality',
        'Recombination', 'Dark Ages', 'First Stars', 'Reionization',
        'Galaxy Formation', 'Supermassive Black Holes', 'Structure Formation',
        'Solar System Formation', 'Quantum Gravity Theory', 'String Theory',
        'Galaxy Clusters', 'Dark Energy Domination', 'Cosmological Observations',
        'Gravitational Waves', 'Multiverse Theory'
      ];
      
      if (eraNames[eraIndex]) {
        this.currentEraText.textContent = eraNames[eraIndex];
      }
    }
  }

  showEra(eraIndex) {
    this.eras.forEach((era, index) => {
      era.classList.toggle('active', index === eraIndex);
    });
    
    // Update marker states
    this.markers.forEach((marker, index) => {
      marker.classList.toggle('active', index === eraIndex);
    });
    
    // Update navigation circle states
    this.navCircles.forEach((circle, index) => {
      circle.classList.toggle('active', index === eraIndex);
    });
    
    // Trigger era-specific animations
    this.triggerEraAnimations(eraIndex);
    
    // Update particles based on era
    this.updateParticlesForEra(eraIndex);
    
    // Update current era
    this.currentEra = eraIndex;
  }

  triggerEraAnimations(eraIndex) {
    // Clear previous timeouts
    this.clearAnimationTimeouts();
    
    const era = document.querySelector(`[data-era="${eraIndex}"]`);
    if (!era) return;
    
    // Era-specific animation triggers
    switch(eraIndex) {
      case 0: // Singularity
        this.animateSingularity(era);
        break;
      case 1: // Planck Epoch
        this.animatePlanckEpoch(era);
        break;
      case 2: // Grand Unification
        this.animateGrandUnification(era);
        break;
      case 3: // Baryogenesis
        this.animateBaryogenesis(era);
        break;
      case 4: // Cosmic Inflation
        this.animateCosmicInflation(era);
        break;
      case 5: // Electroweak Breaking
        this.animateElectroweakBreaking(era);
        break;
      case 6: // QCD Phase Transition
        this.animateQCDTransition(era);
        break;
      case 7: // Neutrino Decoupling
        this.animateNeutrinoDecoupling(era);
        break;
      case 8: // Big Bang Nucleosynthesis  
        this.animateBBN(era);
        break;
      case 9: // Matter-Radiation Equality
        this.animateMatterRadiationEquality(era);
        break;
      case 10: // Recombination
        this.animateRecombination(era);
        break;
      case 11: // Dark Ages
        this.animateDarkAges(era);
        break;
      case 12: // First Stars
        this.animateFirstStars(era);
        break;
      case 13: // Reionization
        this.animateReionization(era);
        break;
      case 14: // Galaxy Formation
        this.animateGalaxyFormation(era);
        break;
      case 15: // Supermassive Black Holes
        this.animateBlackHoles(era);
        break;
      case 16: // Structure Formation
        this.animateStructureFormation(era);
        break;
      case 17: // Solar System
        this.animateSolarSystem(era);
        break;
      case 18: // Quantum Gravity Theory
        this.animateQuantumGravity(era);
        break;
      case 19: // String Theory
        this.animateStringTheory(era);
        break;
      case 20: // Gravitational Waves
        this.animateGravitationalWaves(era);
        break;
      case 21: // Dark Energy Era
        this.animateDarkEnergyEra(era);
        break;
      case 22: // Cosmological Observations
        this.animateCosmologicalObservations(era);
        break;
      case 23: // Gravitational Waves Detection
        this.animateGravitationalWaveDetection(era);
        break;
      case 24: // Multiverse Theory
        this.animateMultiverse(era);
        break;
    }
  }

  // Individual era animation methods
  animateSingularity(era) {
    const singularity = era.querySelector('.quantum-singularity');
    const curvature = era.querySelector('.spacetime-curvature');
    
    if (singularity) {
      singularity.style.animation = 'singularityPulse 3s ease-in-out infinite';
    }
    
    if (curvature) {
      this.addTimeout(() => {
        curvature.style.animation = 'spacetimeCurve 4s ease-in-out infinite';
      }, 500);
    }
  }

  animatePlanckEpoch(era) {
    const foamBubbles = era.querySelectorAll('.foam-bubble');
    
    foamBubbles.forEach((bubble, index) => {
      this.addTimeout(() => {
        bubble.style.animation = 'foamBubble 2s ease-in-out infinite';
      }, index * 700);
    });
  }

  animateGrandUnification(era) {
    const unifiedField = era.querySelector('.unified-force-field');
    const gravityLine = era.querySelector('.gravity-separates');
    const gutLine = era.querySelector('.gut-unified');
    
    if (unifiedField) {
      unifiedField.style.animation = 'unifiedField 4s ease-in-out infinite';
    }
    
    this.addTimeout(() => {
      if (gravityLine) gravityLine.style.animation = 'gravitySeparate 6s ease-in-out infinite';
      if (gutLine) gutLine.style.animation = 'gutUnify 6s ease-in-out infinite';
    }, 1000);
  }

  animateCosmicInflation(era) {
    const inflaton = era.querySelector('.inflaton-potential');
    const spaceGrid = era.querySelector('.space-grid');
    const horizon = era.querySelector('.horizon-problem');
    
    if (inflaton) {
      inflaton.style.animation = 'inflatonRoll 6s ease-in-out infinite';
    }
    
    this.addTimeout(() => {
      if (spaceGrid) spaceGrid.style.animation = 'spaceExpansion 8s ease-out infinite';
    }, 1000);
    
    this.addTimeout(() => {
      if (horizon) horizon.style.animation = 'horizonSolve 8s ease-out infinite';
    }, 2000);
  }

  animateElectroweakBreaking(era) {
    const higgsField = era.querySelector('.higgs-field-vev');
    const bosons = era.querySelectorAll('.w-boson, .z-boson, .photon');
    
    if (higgsField) {
      higgsField.style.animation = 'higgsVEV 5s ease-in-out infinite';
    }
    
    bosons.forEach((boson, index) => {
      this.addTimeout(() => {
        boson.style.animation = 'bosonMotion 4s linear infinite';
      }, index * 1300);
    });
  }

  animateQCDTransition(era) {
    const plasma = era.querySelector('.quark-gluon-plasma');
    const quarks = era.querySelectorAll('.quark');
    const hadrons = era.querySelectorAll('.proton-form, .neutron-form');
    
    if (plasma) {
      plasma.style.animation = 'plasmaState 3s ease-in-out infinite';
    }
    
    quarks.forEach((quark, index) => {
      this.addTimeout(() => {
        quark.style.animation = 'quarkFloat 2s ease-in-out infinite';
      }, index * 700);
    });
    
    this.addTimeout(() => {
      hadrons.forEach((hadron, index) => {
        this.addTimeout(() => {
          hadron.style.animation = 'hadronForm 4s ease-in-out infinite';
        }, index * 500);
      });
    }, 2000);
  }

  animateBBN(era) {
    const reactions = era.querySelectorAll('.reaction');
    const elements = era.querySelectorAll('.element');
    
    reactions.forEach((reaction, index) => {
      this.addTimeout(() => {
        reaction.style.animation = 'reactionSequence 12s ease-in-out infinite';
      }, index * 4000); // 4 second intervals to prevent overlap
    });
    
    this.addTimeout(() => {
      elements.forEach((element, index) => {
        this.addTimeout(() => {
          element.style.animation = 'elementAbundance 8s ease-in-out infinite';
        }, index * 2000); // 2 second intervals
      });
    }, 6000);
  }

  animateMatterRadiationEquality(era) {
    const radiationCurve = era.querySelector('.radiation-curve');
    const matterCurve = era.querySelector('.matter-curve');
    const intersection = era.querySelector('.intersection-point');
    
    if (radiationCurve) {
      radiationCurve.style.animation = 'radiationDensity 10s ease-in-out infinite';
    }
    
    this.addTimeout(() => {
      if (matterCurve) matterCurve.style.animation = 'matterDensity 10s ease-in-out infinite';
    }, 1000);
    
    this.addTimeout(() => {
      if (intersection) intersection.style.animation = 'intersectionPulse 6s ease-in-out infinite';
    }, 5000);
  }

  animateRecombination(era) {
    const plasmaParticles = era.querySelectorAll('.ion, .free-electron, .scattered-photon');
    const atoms = era.querySelectorAll('.hydrogen-atom, .helium-atom');
    const cmbDecoupling = era.querySelector('.photon-decoupling');
    
    plasmaParticles.forEach((particle, index) => {
      this.addTimeout(() => {
        particle.style.animation = 'particleFloat 3s ease-in-out infinite';
      }, index * 500);
    });
    
    this.addTimeout(() => {
      atoms.forEach((atom, index) => {
        this.addTimeout(() => {
          atom.style.animation = 'particleFloat 3s ease-in-out infinite';
        }, index * 1000);
      });
    }, 2000);
    
    this.addTimeout(() => {
      if (cmbDecoupling) cmbDecoupling.style.animation = 'cmbDecoupling 8s ease-in-out infinite';
    }, 3000);
  }

  animateDarkAges(era) {
    const halos = era.querySelectorAll('.dm-halo');
    const gas = era.querySelectorAll('.hydrogen-gas, .helium-gas');
    
    halos.forEach((halo, index) => {
      this.addTimeout(() => {
        halo.style.animation = 'haloGrowth 8s ease-in-out infinite';
      }, index * 2000);
    });
    
    this.addTimeout(() => {
      gas.forEach((gasCloud, index) => {
        this.addTimeout(() => {
          gasCloud.style.animation = 'gasCollapse 10s ease-in-out infinite';
        }, index * 2000);
      });
    }, 4000);
  }

  animateFirstStars(era) {
    const stellarCore = era.querySelector('.stellar-core');
    const nuclearBurning = era.querySelector('.nuclear-burning');
    const fusionChain = era.querySelector('.fusion-chain');
    const coreCollapse = era.querySelector('.core-collapse');
    
    if (stellarCore) {
      stellarCore.style.animation = 'stellarCore 4s ease-in-out infinite';
    }
    
    this.addTimeout(() => {
      if (nuclearBurning) nuclearBurning.style.animation = 'nuclearBurning 3s ease-in-out infinite';
    }, 1000);
    
    this.addTimeout(() => {
      if (fusionChain) fusionChain.style.animation = 'fusionChain 6s ease-in-out infinite';
    }, 2000);
    
    this.addTimeout(() => {
      if (coreCollapse) coreCollapse.style.animation = 'coreCollapse 8s ease-in-out infinite';
    }, 4000);
  }

  animateGalaxyFormation(era) {
    const haloLarge = era.querySelector('.dm-halo-large');
    const gasAccretion = era.querySelector('.gas-accretion');
    const starFormationRegions = era.querySelectorAll('.sf-region');
    const spiralGalaxy = era.querySelector('.spiral-galaxy');
    
    if (haloLarge) {
      haloLarge.style.animation = 'haloGrowth 10s ease-in-out infinite';
    }
    
    this.addTimeout(() => {
      if (gasAccretion) gasAccretion.style.animation = 'gasAccretion 8s ease-in-out infinite';
    }, 2000);
    
    this.addTimeout(() => {
      starFormationRegions.forEach((region, index) => {
        this.addTimeout(() => {
          region.style.animation = 'starFormation 6s ease-in-out infinite';
        }, index * 1000);
      });
    }, 4000);
    
    this.addTimeout(() => {
      if (spiralGalaxy) {
        const disk = spiralGalaxy.querySelector('.galactic-disk');
        const arms = spiralGalaxy.querySelector('.spiral-arms');
        if (disk) disk.style.animation = 'diskRotation 12s linear infinite';
        if (arms) arms.style.animation = 'spiralRotation 15s linear infinite';
      }
    }, 6000);
  }

  animateBlackHoles(era) {
    const eventHorizon = era.querySelector('.event-horizon');
    const accretionDisks = era.querySelectorAll('.disk-inner, .disk-outer');
    const jets = era.querySelectorAll('.jet');
    
    if (eventHorizon) {
      eventHorizon.style.animation = 'eventHorizon 6s ease-in-out infinite';
    }
    
    this.addTimeout(() => {
      accretionDisks.forEach((disk, index) => {
        disk.style.animation = `accretionDisk ${3 + index * 3}s linear infinite`;
      });
    }, 1000);
    
    this.addTimeout(() => {
      jets.forEach((jet, index) => {
        this.addTimeout(() => {
          jet.style.animation = 'relativisticJets 3s ease-in-out infinite';
        }, index * 1500);
      });
    }, 2000);
  }

  animateSolarSystem(era) {
    const protoSun = era.querySelector('.stellar-ignition');
    const tTauri = era.querySelector('.t-tauri-phase');
    const dust = era.querySelector('.dust-grains');
    const planets = era.querySelectorAll('.planet');
    
    if (protoSun) {
      protoSun.style.animation = 'solarIgnition 5s ease-in-out infinite';
    }
    
    this.addTimeout(() => {
      if (tTauri) tTauri.style.animation = 'tTauriWind 4s ease-in-out infinite';
    }, 1000);
    
    this.addTimeout(() => {
      if (dust) dust.style.animation = 'dustAccretion 8s ease-in-out infinite';
    }, 2000);
    
    this.addTimeout(() => {
      planets.forEach((planet, index) => {
        this.addTimeout(() => {
          planet.style.animation = 'planetOrbit 12s linear infinite';
        }, index * 1000);
      });
    }, 4000);
  }

  animateLargeScaleStructure(era) {
    const galaxies = era.querySelectorAll('.galaxy');
    const icm = era.querySelector('.intracluster-medium');
    const filaments = era.querySelector('.filaments');
    const nodes = era.querySelector('.nodes');
    
    galaxies.forEach((galaxy, index) => {
      this.addTimeout(() => {
        galaxy.style.animation = 'galaxyClusterMotion 8s ease-in-out infinite';
      }, index * 2000);
    });
    
    this.addTimeout(() => {
      if (icm) icm.style.animation = 'icmGlow 6s ease-in-out infinite';
    }, 3000);
    
    this.addTimeout(() => {
      if (filaments) filaments.style.animation = 'filamentGrowth 12s ease-in-out infinite';
    }, 5000);
    
    this.addTimeout(() => {
      if (nodes) nodes.style.animation = 'nodesPulse 6s ease-in-out infinite';
    }, 7000);
  }

  animateBaryogenesis(era) {
    const particlePair = era.querySelector('.particle-pair');
    const annihilationFlash = era.querySelector('.annihilation-flash');
    const cpSymbol = era.querySelector('.cp-symbol');
    const violationArrow = era.querySelector('.violation-arrow');
    
    if (particlePair) {
      const particles = particlePair.querySelectorAll('.particle, .antiparticle');
      particles.forEach((particle, index) => {
        this.addTimeout(() => {
          particle.style.animation = 'particleVibrate 2s ease-in-out infinite';
        }, index * 500);
      });
    }
    
    this.addTimeout(() => {
      if (annihilationFlash) annihilationFlash.style.animation = 'annihilationFlash 3s ease-in-out infinite';
    }, 1000);
    
    this.addTimeout(() => {
      if (cpSymbol) cpSymbol.style.animation = 'cpViolation 4s ease-in-out infinite';
      if (violationArrow) violationArrow.style.animation = 'violationPulse 2s ease-in-out infinite';
    }, 2000);
  }

  animateNeutrinoDecoupling(era) {
    const neutrinoParticles = era.querySelectorAll('.neutrino-particle');
    const interactionLine = era.querySelector('.interaction-line');
    const boundary = era.querySelector('.decoupling-boundary');
    
    neutrinoParticles.forEach((neutrino, index) => {
      this.addTimeout(() => {
        neutrino.style.animation = 'neutrinoFloat 4s ease-in-out infinite';
      }, index * 1300);
    });
    
    this.addTimeout(() => {
      if (interactionLine) interactionLine.style.animation = 'interactionWeaken 6s ease-in-out infinite';
    }, 2000);
    
    this.addTimeout(() => {
      if (boundary) boundary.style.animation = 'boundaryPulse 3s ease-in-out infinite';
    }, 3000);
  }

  animateReionization(era) {
    const hiiRegions = era.querySelectorAll('.hii-region');
    const uvSources = era.querySelectorAll('.uv-source');
    const ionizationFronts = era.querySelectorAll('.ionization-front');
    const neutralIgm = era.querySelector('.neutral-igm');
    const ionizedIgm = era.querySelector('.ionized-igm');
    
    hiiRegions.forEach((region, index) => {
      this.addTimeout(() => {
        region.style.animation = 'bubbleGrowth 8s ease-in-out infinite';
      }, index * 2000);
    });
    
    uvSources.forEach((source, index) => {
      this.addTimeout(() => {
        source.style.animation = 'uvEmission 3s ease-in-out infinite';
      }, index * 2000 + 500);
    });
    
    ionizationFronts.forEach((front, index) => {
      this.addTimeout(() => {
        front.style.animation = 'ionizationExpand 6s ease-in-out infinite';
      }, index * 2000 + 1000);
    });
    
    this.addTimeout(() => {
      if (neutralIgm) neutralIgm.style.animation = 'neutralShrink 10s ease-in-out infinite';
      if (ionizedIgm) ionizedIgm.style.animation = 'ionizedGrow 10s ease-in-out infinite';
    }, 4000);
  }

  animateStructureFormation(era) {
    const perturbations = era.querySelectorAll('.perturbation');
    const haloSmall = era.querySelectorAll('.halo-small');
    const mergerArrow = era.querySelector('.merger-arrow');
    const haloLarge = era.querySelector('.halo-large');
    const dmParticles = era.querySelector('.dark-matter-particles');
    const filaments = era.querySelector('.filament-structure');
    
    perturbations.forEach((perturbation, index) => {
      this.addTimeout(() => {
        perturbation.style.animation = 'perturbationGrow 6s ease-in-out infinite';
      }, index * 2000);
    });
    
    this.addTimeout(() => {
      haloSmall.forEach((halo, index) => {
        this.addTimeout(() => {
          halo.style.animation = 'haloMerge 8s ease-in-out infinite';
        }, index * 500);
      });
      if (mergerArrow) mergerArrow.style.animation = 'mergerPulse 4s ease-in-out infinite';
    }, 3000);
    
    this.addTimeout(() => {
      if (haloLarge) haloLarge.style.animation = 'haloResult 8s ease-in-out infinite';
    }, 4000);
    
    this.addTimeout(() => {
      if (dmParticles) dmParticles.style.animation = 'particleEvolution 10s ease-in-out infinite';
      if (filaments) filaments.style.animation = 'filamentForm 12s ease-in-out infinite';
    }, 6000);
  }

  animateModernObservations(era) {
    const acousticPeaks = era.querySelector('.acoustic-peaks');
    const dampingTail = era.querySelector('.damping-tail');
    const correlationFunction = era.querySelector('.correlation-function');
    const baoScale = era.querySelector('.bao-scale');
    const hubbleDiagram = era.querySelector('.hubble-diagram');
    const accelerationEvidence = era.querySelector('.acceleration-evidence');
    
    if (acousticPeaks) {
      acousticPeaks.style.animation = 'acousticOscillation 4s ease-in-out infinite';
    }
    
    this.addTimeout(() => {
      if (dampingTail) dampingTail.style.animation = 'dampingFade 6s ease-in-out infinite';
    }, 1000);
    
    this.addTimeout(() => {
      if (correlationFunction) correlationFunction.style.animation = 'baoRing 5s ease-in-out infinite';
      if (baoScale) baoScale.style.animation = 'scalePulse 3s ease-in-out infinite';
    }, 2000);
    
    this.addTimeout(() => {
      if (hubbleDiagram) hubbleDiagram.style.animation = 'hubbleExpansion 8s ease-in-out infinite';
      if (accelerationEvidence) accelerationEvidence.style.animation = 'accelerationShow 6s ease-in-out infinite';
    }, 3000);
  }

  animateGravitationalWaves(era) {
    const tensorPerturbation = era.querySelector('.tensor-perturbation');
    const gwPropagation = era.querySelector('.gw-propagation');
    const binaryMerger = era.querySelector('.binary-merger');
    const inspiralPhase = era.querySelector('.inspiral-phase');
    const mergerRingdown = era.querySelector('.merger-ringdown');
    const detectors = era.querySelectorAll('.ligo-virgo, .lisa, .pta');
    
    if (tensorPerturbation) {
      tensorPerturbation.style.animation = 'tensorWave 3s linear infinite';
    }
    
    if (gwPropagation) {
      gwPropagation.style.animation = 'gwPropagate 4s linear infinite';
    }
    
    this.addTimeout(() => {
      if (binaryMerger) binaryMerger.style.animation = 'binaryOrbit 6s linear infinite';
      if (inspiralPhase) inspiralPhase.style.animation = 'inspiralTighten 6s ease-in infinite';
    }, 1000);
    
    this.addTimeout(() => {
      if (mergerRingdown) mergerRingdown.style.animation = 'ringdownPulse 6s ease-out infinite';
    }, 4000);
    
    this.addTimeout(() => {
      detectors.forEach((detector, index) => {
        this.addTimeout(() => {
          detector.style.animation = 'detectorActive 4s ease-in-out infinite';
        }, index * 1300);
      });
    }, 2000);
  }

  animateDarkEnergyEra(era) {
    const scaleFactor = era.querySelector('.scale-factor-curve');
    const acceleration = era.querySelector('.acceleration-phase');
    const vacuum = era.querySelector('.vacuum-energy');
    const lambda = era.querySelector('.cosmological-constant');
    
    if (scaleFactor) {
      scaleFactor.style.animation = 'scaleFactor 10s ease-out infinite';
    }
    
    this.addTimeout(() => {
      if (acceleration) acceleration.style.animation = 'accelerationGlow 8s ease-in-out infinite';
    }, 2000);
    
    this.addTimeout(() => {
      if (vacuum) vacuum.style.animation = 'vacuumFluctuation 6s ease-in-out infinite';
    }, 3000);
    
    this.addTimeout(() => {
      if (lambda) lambda.style.animation = 'lambdaPulse 4s ease-in-out infinite';
    }, 4000);
  }

  animateCosmologicalObservations(era) {
    const acousticPeaks = era.querySelector('.acoustic-peaks');
    const dampingTail = era.querySelector('.damping-tail');
    const correlationFunction = era.querySelector('.correlation-function');
    const hubbleDiagram = era.querySelector('.hubble-diagram');
    const accelerationEvidence = era.querySelector('.acceleration-evidence');
    
    if (acousticPeaks) {
      acousticPeaks.style.animation = 'acousticOscillation 4s ease-in-out infinite';
    }
    
    this.addTimeout(() => {
      if (dampingTail) dampingTail.style.animation = 'dampingFade 6s ease-in-out infinite';
    }, 1000);
    
    this.addTimeout(() => {
      if (correlationFunction) correlationFunction.style.animation = 'baoRing 5s ease-in-out infinite';
    }, 2000);
    
    this.addTimeout(() => {
      if (hubbleDiagram) hubbleDiagram.style.animation = 'hubbleExpansion 8s ease-in-out infinite';
    }, 3000);
    
    this.addTimeout(() => {
      if (accelerationEvidence) accelerationEvidence.style.animation = 'accelerationShow 6s ease-in-out infinite';
    }, 4000);
  }

  animateGravitationalWaveDetection(era) {
    const tensorPerturbation = era.querySelector('.tensor-perturbation');
    const gwPropagation = era.querySelector('.gw-propagation');
    const binaryMerger = era.querySelector('.binary-merger');
    const inspiralPhase = era.querySelector('.inspiral-phase');
    const mergerRingdown = era.querySelector('.merger-ringdown');
    const detectors = era.querySelectorAll('.ligo-virgo, .lisa, .pta');
    
    if (tensorPerturbation) {
      tensorPerturbation.style.animation = 'tensorWave 3s linear infinite';
    }
    
    if (gwPropagation) {
      gwPropagation.style.animation = 'gwPropagate 4s linear infinite';
    }
    
    this.addTimeout(() => {
      if (binaryMerger) binaryMerger.style.animation = 'binaryOrbit 6s linear infinite';
      if (inspiralPhase) inspiralPhase.style.animation = 'inspiralTighten 6s ease-in infinite';
    }, 1000);
    
    this.addTimeout(() => {
      if (mergerRingdown) mergerRingdown.style.animation = 'ringdownPulse 6s ease-out infinite';
    }, 4000);
    
    this.addTimeout(() => {
      detectors.forEach((detector, index) => {
        this.addTimeout(() => {
          detector.style.animation = 'detectorActive 4s ease-in-out infinite';
        }, index * 1300);
      });
    }, 2000);
  }

  animateMultiverse(era) {
    const bubbleUniverses = era.querySelectorAll('.bubble-universe');
    const inflationField = era.querySelector('.inflation-field');
    const quantumTunneling = era.querySelector('.quantum-tunneling');
    const parameters = era.querySelectorAll('.parameter');
    
    // Start bubble universe animations
    bubbleUniverses.forEach((bubble, index) => {
      this.addTimeout(() => {
        bubble.style.animation = 'bubbleFloat 8s ease-in-out infinite';
      }, index * 500);
    });
    
    // Animate eternal inflation
    this.addTimeout(() => {
      if (inflationField) inflationField.style.animation = 'inflationExpand 6s ease-in-out infinite';
    }, 1000);
    
    // Animate quantum tunneling
    this.addTimeout(() => {
      if (quantumTunneling) quantumTunneling.style.animation = 'quantumTunnel 4s ease-in-out infinite';
    }, 2000);
    
    // Animate fine-tuning parameters
    this.addTimeout(() => {
      parameters.forEach((param, index) => {
        this.addTimeout(() => {
          param.style.animation = 'parameterTweak 5s ease-in-out infinite';
        }, index * 1600);
      });
    }, 3000);
  }

  animateQuantumGravity(era) {
    const foamBubbles = era.querySelectorAll('.foam-bubble');
    const planckIndicator = era.querySelector('.planck-length-indicator');
    const fluctuations = era.querySelectorAll('.fluctuation');
    const gravitons = era.querySelectorAll('.graviton');
    const curvatureGrid = era.querySelector('.curvature-grid');
    
    // Animate spacetime foam bubbles
    foamBubbles.forEach((bubble, index) => {
      this.addTimeout(() => {
        bubble.style.animation = 'foamFluctuation 3s ease-in-out infinite, quantumTunneling 4s linear infinite, planckBubble 2.5s ease-in-out infinite';
        bubble.style.animationDelay = `${index * 0.7}s, ${index * 1}s, ${index * 0.5}s`;
      }, index * 200);
    });
    
    // Animate Planck scale indicator
    this.addTimeout(() => {
      if (planckIndicator) {
        planckIndicator.style.animation = 'planckScale 4s ease-in-out infinite, quantumRotation 6s linear infinite';
      }
    }, 500);
    
    // Animate quantum fluctuations
    fluctuations.forEach((fluctuation, index) => {
      this.addTimeout(() => {
        fluctuation.style.animation = 'quantumFluctuation 1.5s ease-in-out infinite, randomMotion 3s linear infinite';
        fluctuation.style.animationDelay = `${index * 0.3}s, ${index * 1}s`;
      }, index * 300);
    });
    
    // Animate gravitons
    gravitons.forEach((graviton, index) => {
      this.addTimeout(() => {
        graviton.style.animation = 'gravitonWave 2.5s ease-in-out infinite, gravitonPath 4s linear infinite';
        graviton.style.animationDelay = `${index * 0.8}s, ${index * 1.3}s`;
      }, index * 400);
    });
    
    // Animate spacetime curvature
    this.addTimeout(() => {
      if (curvatureGrid) {
        curvatureGrid.style.animation = 'spacetimeCurvature 6s ease-in-out infinite, gridDistortion 4s ease-in-out infinite';
      }
    }, 1000);
  }

  animateStringTheory(era) {
    const dimensionLayers = era.querySelectorAll('.dimension-layer');
    const calabiYau = era.querySelector('.calabi-yau-manifold');
    const stringModes = era.querySelectorAll('.string-mode');
    const membraneSurface = era.querySelector('.membrane-surface');
    const braneWorld = era.querySelector('.brane-world');
    
    // Animate extra dimensions
    dimensionLayers.forEach((layer, index) => {
      this.addTimeout(() => {
        layer.style.animation = 'dimensionalShift 6s ease-in-out infinite';
        layer.style.animationDelay = `${index * 1}s`;
      }, index * 300);
    });
    
    // Animate Calabi-Yau manifold
    this.addTimeout(() => {
      if (calabiYau) {
        calabiYau.style.animation = 'calabiYauMorphing 10s ease-in-out infinite, manifoldRotation 8s linear infinite';
      }
    }, 500);
    
    // Animate vibrating strings
    stringModes.forEach((stringMode, index) => {
      this.addTimeout(() => {
        stringMode.style.animation = 'hyperStringVibration 2s ease-in-out infinite';
        stringMode.style.animationDelay = `${index * 0.3}s`;
      }, index * 200);
    });
    
    // Animate M-theory membrane
    this.addTimeout(() => {
      if (membraneSurface) {
        membraneSurface.style.animation = 'membraneWave 5s ease-in-out infinite, membraneFluctuation 4s ease-in-out infinite';
      }
    }, 800);
    
    // Animate brane world
    this.addTimeout(() => {
      if (braneWorld) {
        braneWorld.style.animation = 'braneOscillation 3s ease-in-out infinite';
      }
    }, 1200);
    
    // Add extra dimensional flow effects
    const extraDimEffects = era.querySelectorAll('.extra-dimensions, .higher-dimensions');
    extraDimEffects.forEach((effect, index) => {
      this.addTimeout(() => {
        effect.style.animation = 'extraDimensionalFlow 8s ease-in-out infinite';
        effect.style.animationDelay = `${index * 1.5}s`;
      }, index * 500);
    });
  }

  updateParticlesForEra(eraIndex) {
    // Update particle colors and behavior based on current era
    const eraColors = {
      0: ['rgba(255, 255, 255, 0.8)'], // Singularity - white
      1: ['rgba(102, 126, 234, 0.6)', 'rgba(255, 255, 255, 0.4)'], // Planck - blue/white
      2: ['rgba(102, 126, 234, 0.6)', 'rgba(240, 147, 251, 0.6)'], // GUT - blue/purple
      3: ['rgba(79, 172, 254, 0.6)', 'rgba(0, 242, 254, 0.6)'], // Inflation - cyan
      4: ['rgba(67, 233, 123, 0.6)', 'rgba(56, 249, 215, 0.6)'], // EW - green
      5: ['rgba(255, 68, 0, 0.6)', 'rgba(255, 100, 50, 0.6)'], // QCD - orange/red
      6: ['rgba(255, 200, 0, 0.6)', 'rgba(255, 150, 0, 0.6)'], // BBN - yellow/orange
      7: ['rgba(255, 0, 0, 0.4)', 'rgba(0, 255, 0, 0.4)'], // Equality - red/green
      8: ['rgba(255, 255, 0, 0.6)', 'rgba(255, 200, 100, 0.6)'], // Recombination - yellow
      9: ['rgba(102, 51, 153, 0.6)'], // Dark Ages - purple
      10: ['rgba(255, 170, 0, 0.8)', 'rgba(255, 200, 100, 0.6)'], // First Stars - bright yellow
      11: ['rgba(255, 255, 255, 0.6)', 'rgba(102, 126, 234, 0.4)'], // Galaxies - white/blue
      12: ['rgba(255, 100, 0, 0.8)', 'rgba(0, 0, 0, 0.8)'], // Black Holes - orange/black
      13: ['rgba(255, 200, 0, 0.6)', 'rgba(150, 100, 50, 0.4)'], // Solar System - yellow/brown
      14: ['rgba(102, 51, 153, 0.4)', 'rgba(255, 255, 255, 0.3)'], // LSS - purple/white
      15: ['rgba(0, 100, 255, 0.6)', 'rgba(0, 200, 255, 0.4)'], // Dark Energy - blue
      16: ['rgba(102, 51, 153, 0.4)', 'rgba(255, 255, 255, 0.3)'], // Structure Formation
      17: ['rgba(255, 200, 0, 0.6)', 'rgba(150, 100, 50, 0.4)'], // Solar System
      18: ['rgba(102, 126, 234, 0.6)', 'rgba(240, 147, 251, 0.6)'], // Quantum Gravity
      19: ['rgba(240, 147, 251, 0.6)', 'rgba(79, 172, 254, 0.6)'], // String Theory
      20: ['rgba(255, 255, 255, 0.6)', 'rgba(102, 126, 234, 0.4)'], // Galaxy Clusters
      21: ['rgba(0, 100, 255, 0.6)', 'rgba(0, 200, 255, 0.4)'], // Dark Energy
      22: ['rgba(255, 255, 255, 0.8)', 'rgba(102, 126, 234, 0.6)'], // Observations
      23: ['rgba(0, 242, 254, 0.6)', 'rgba(102, 126, 234, 0.4)'], // Gravitational Waves
      24: ['rgba(102, 126, 234, 0.4)', 'rgba(240, 147, 251, 0.4)', 'rgba(79, 172, 254, 0.4)'] // Multiverse
    };
    
    const colors = eraColors[eraIndex] || eraColors[0];
    
    this.particles.forEach(particle => {
      particle.color = colors[Math.floor(Math.random() * colors.length)];
      
      // Adjust particle behavior based on era
      const speedMultiplier = this.getSpeedMultiplierForEra(eraIndex);
      particle.vx *= speedMultiplier;
      particle.vy *= speedMultiplier;
    });
  }

  getSpeedMultiplierForEra(eraIndex) {
    // Slower particles for early universe, faster for later eras
    const speedMap = {
      0: 0.1, // Singularity - almost static
      1: 0.2, // Planck - very slow
      2: 0.3, // GUT
      3: 2.0, // Inflation - very fast expansion
      4: 0.7, // EW
      5: 1.2, // QCD - active
      6: 0.8, // BBN
      7: 0.6, // Equality
      8: 0.5, // Recombination - slowing down
      9: 0.3, // Dark Ages - slow
      10: 1.5, // First Stars - active
      11: 1.0, // Galaxies - normal
      12: 1.8, // Black Holes - dynamic
      13: 0.9, // Solar System
      14: 0.7, // LSS
      15: 1.3  // Dark Energy - accelerating
    };
    
    return speedMap[eraIndex] || 1.0;
  }

  updateTimeline() {
    const progress = (this.currentEra / (this.totalEras - 1)) * 100;
    if (this.navProgress) {
      this.navProgress.style.width = `${progress}%`;
    }
    
    // Update marker states
    this.markers.forEach((marker, index) => {
      marker.classList.toggle('active', index === this.currentEra);
      
      // Progressive activation
      marker.classList.toggle('completed', index < this.currentEra);
    });
  }

  togglePlayback() {
    this.isPlaying = !this.isPlaying;
    
    if (this.isPlaying) {
      this.startAutoplay();
      if (this.playBtn) {
        this.playBtn.innerHTML = '<span class="pause-icon">⏸</span>';
      }
    } else {
      this.stopAutoplay();
      if (this.playBtn) {
        this.playBtn.innerHTML = '<span class="play-icon">▶</span>';
      }
    }
  }

  startAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
    
    this.autoplayInterval = setInterval(() => {
      if (this.currentEra < this.totalEras - 1) {
        this.nextEra(true); // Pass true to indicate this is autoplay navigation
      } else {
        this.stopAutoplay();
      }
    }, 8000 / this.playbackSpeed); // 8 seconds per era by default
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
    this.isPlaying = false;
    if (this.playBtn) {
      this.playBtn.innerHTML = '<span class="play-icon">▶</span>';
    }
  }

  cycleSpeed() {
    const speeds = [0.5, 1, 1.5, 2];
    const currentIndex = speeds.indexOf(this.playbackSpeed);
    this.playbackSpeed = speeds[(currentIndex + 1) % speeds.length];
    
    this.speedBtn.textContent = `${this.playbackSpeed}x`;
    
    // Restart autoplay with new speed if currently playing
    if (this.isPlaying) {
      this.stopAutoplay();
      this.startAutoplay();
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        // Fullscreen request failed silently
      });
    } else {
      document.exitFullscreen().catch((err) => {
        // Exit fullscreen failed silently
      });
    }
  }

  nextEra(isAutoplay = false) {
    if (this.currentEra < this.totalEras - 1) {
      this.navigateToEra(this.currentEra + 1, isAutoplay);
    }
  }

  previousEra(isAutoplay = false) {
    if (this.currentEra > 0) {
      this.navigateToEra(this.currentEra - 1, isAutoplay);
    }
  }

  resetTimeline() {
    this.stopAutoplay();
    this.navigateToEra(0);
    this.clearAnimationTimeouts();
  }

  showEraPreview(eraIndex) {
    // Could add era preview functionality here
  }

  hideEraPreview() {
    // Hide era preview
  }

  addTimeout(callback, delay) {
    const timeoutId = setTimeout(callback, delay);
    this.animationTimeouts.push(timeoutId);
    return timeoutId;
  }

  clearAnimationTimeouts() {
    this.animationTimeouts.forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
    this.animationTimeouts = [];
  }

  destroy() {
    // Cleanup
    this.stopAutoplay();
    this.clearAnimationTimeouts();
    
    if (this.observer) {
      this.observer.disconnect();
    }
    
    this.observerInstances.forEach(observer => {
      observer.disconnect();
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.cosmicGenesis = new CosmicGenesis();
  
  // Add global test functions for manual debugging
  window.testNavigation = () => window.cosmicGenesis.testNavigation();
  window.navigateToEra = (index) => window.cosmicGenesis.navigateToEra(index);
  window.forceLayoutRecalculation = () => window.cosmicGenesis.forceLayoutRecalculation();
  window.testScrollHighlighting = (scrollPos) => window.cosmicGenesis.updateCurrentEraFromScroll(scrollPos || window.cosmicGenesis.container.scrollLeft);
  window.highlightCircle = (index) => window.cosmicGenesis.updateActiveNavCircle(index);
  
  console.log('Cosmic Genesis initialized.');
  console.log('Available commands: testNavigation(), navigateToEra(index), forceLayoutRecalculation()');
  console.log('Scroll debugging: testScrollHighlighting(), highlightCircle(index)');
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
  if (window.cosmicGenesis) {
    if (document.hidden) {
      window.cosmicGenesis.stopAutoplay();
    }
  }
});

// Add additional CSS animation classes for text overlap prevention
const additionalStyles = `
<style>
@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(20px); }
  20% { opacity: 1; transform: translateY(0); }
  80% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-20px); }
}

@keyframes fadeOut {
  0% { opacity: 1; }
  100% { opacity: 0; }
}

.epoch-phase .phase-label {
  opacity: 0;
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}

/* Ensure sequential display without overlap */
.planck-phase .phase-label { animation-delay: 0s !important; }
.gut-phase .phase-label { animation-delay: 5s !important; }
.inflation-phase .phase-label { animation-delay: 10s !important; }
.ewsb-phase .phase-label { animation-delay: 15s !important; }
.qcd-phase .phase-label { animation-delay: 20s !important; }
.bbn-phase .phase-label { animation-delay: 25s !important; }
.recombination-phase .phase-label { animation-delay: 35s !important; }
.structure-phase .phase-label { animation-delay: 45s !important; }
</style>
`;

// Inject additional styles
document.head.insertAdjacentHTML('beforeend', additionalStyles);