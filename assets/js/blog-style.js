document.addEventListener('DOMContentLoaded', () => {
  // === Dark Mode Toggle ===
  // === Dark Mode Toggle with persistence ===
  const toggleBtn = document.getElementById('modeToggle');

  // On page load: apply saved mode if any
  const savedMode = localStorage.getItem('darkModeEnabled');
  if (savedMode === 'true') {
    document.body.classList.add('dark-mode');
    <!--toggleBtn.textContent = 'L'; -->
  } else {
    <!--toggleBtn.textContent = 'D'; -->
  }

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    <!-- toggleBtn.textContent = isDark ? 'L' : 'D'; -->

    // Save preference
    localStorage.setItem('darkModeEnabled', isDark);
  });


    // === Reading Time Calculation ===
    const content = document.querySelector('.content');
    if (content) {
      let text = '';
      content.querySelectorAll('p').forEach(p => {
        text += p.innerText + ' ';
      });
      const words = text.trim().split(/\s+/).length;
      const wordsPerMinute = 200;
      const readingTimeMinutes = Math.ceil(words / wordsPerMinute);
      const readingTimeDiv = document.getElementById('readingTime');
      if (readingTimeDiv) {
        readingTimeDiv.textContent = `Estimated reading time: ${readingTimeMinutes} min${readingTimeMinutes > 1 ? 's' : ''}`;
      }
    }

    // === Citation Tooltip & Reference List ===

    const citations = Array.from(document.querySelectorAll('sup.citation'));
    const citedKeys = new Map(); // citation key => number

    // Assign numbers to unique citation keys in order of appearance
    citations.forEach(cite => {
      const key = cite.dataset.citekey;
      if (!citedKeys.has(key)) {
        citedKeys.set(key, citedKeys.size + 1);
      }
      const num = citedKeys.get(key);
      cite.textContent = `[${num}]`;
      cite.setAttribute('aria-describedby', `ref-${key}`);
    });

    // Create tooltips for citations based on corresponding reference <li> text
    citations.forEach(cite => {
      const key = cite.dataset.citekey;
      const refEl = document.getElementById(`ref-${key}`);
      const tooltipText = refEl ? refEl.textContent.trim() : 'Reference not found';

      const tooltip = document.createElement('div');
      tooltip.className = 'citation-tooltip';
      tooltip.textContent = tooltipText;
      Object.assign(tooltip.style, {
        position: 'absolute',
        backgroundColor: '#333',
        color: '#fff',
        padding: '6px 10px',
        borderRadius: '5px',
        fontSize: '0.85rem',
        maxWidth: '300px',
        zIndex: '10000',
        visibility: 'hidden',
        pointerEvents: 'none',
      });

      document.body.appendChild(tooltip);

      function showTooltip() {
        tooltip.style.visibility = 'visible';
        const rect = cite.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        let top = window.scrollY + rect.top - tooltipRect.height - 8;
        let left = window.scrollX + rect.left;

        if (left + tooltipRect.width > window.innerWidth) {
          left = window.innerWidth - tooltipRect.width - 10;
        }

        if (top < window.scrollY) {
          top = window.scrollY + rect.bottom + 8;
        }

        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
      }

      function hideTooltip() {
        tooltip.style.visibility = 'hidden';
      }

      cite.addEventListener('mouseenter', showTooltip);
      cite.addEventListener('focus', showTooltip);
      cite.addEventListener('mouseleave', hideTooltip);
      cite.addEventListener('blur', hideTooltip);
    });
  });

