document.addEventListener('DOMContentLoaded', () => {
  // === Dark Mode Toggle Switch ===
  const toggleInput = document.getElementById('modeToggle');

  // On page load: apply saved mode if any
  const savedMode = localStorage.getItem('darkModeEnabled');
  if (savedMode === 'true') {
    document.body.classList.add('dark-mode');
    toggleInput.checked = true;
  } else {
    toggleInput.checked = false;
  }

  toggleInput.addEventListener('change', () => {
    const isDark = toggleInput.checked;
    document.body.classList.toggle('dark-mode', isDark);
    
    // Save preference
    localStorage.setItem('darkModeEnabled', isDark);
  });


    // === Reading Time Calculation ===
    const content = document.querySelector('.blog-content');
    if (content) {
      let text = '';
      
      // Include all readable text content: headings, paragraphs, list items, etc.
      content.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li').forEach(element => {
        text += element.innerText + ' ';
      });
      
      // Also include any remaining text content that might not be in the above elements
      const remainingText = content.innerText;
      
      // Use the longer text (either from specific elements or all content)
      const finalText = text.length > remainingText.length ? text : remainingText;
      
      // Filter out empty strings and count words
      const words = finalText.trim().split(/\s+/).filter(word => word.length > 0);
      const wordCount = words.length;
      
      // Standard reading speed: 200-250 words per minute for average readers
      const wordsPerMinute = 200;
      const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
      
      const readingTimeDiv = document.getElementById('readingTime');
      if (readingTimeDiv) {
        readingTimeDiv.textContent = `Estimated reading time: ${readingTimeMinutes} min${readingTimeMinutes > 1 ? 's' : ''}`;
      }
    }

    // === Citation Tooltip & Reference List ===

    const citations = Array.from(document.querySelectorAll('.citation'));
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
      
      // Add click functionality for scrolling to reference
      cite.addEventListener('click', (e) => {
        e.preventDefault();
        const key = cite.dataset.citekey;
        const refElement = document.getElementById(`ref-${key}`);
        
        if (refElement) {
          // Scroll to the reference
          refElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          
          // Highlight the reference temporarily
          refElement.classList.add('highlight-reference');
          setTimeout(() => {
            refElement.classList.remove('highlight-reference');
          }, 2000);
        }
      });
    });

  // === Go to Top Button ===
  const goToTopBtn = document.getElementById('goToTop');
  
  if (goToTopBtn) {
    // Show/hide button on scroll
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        goToTopBtn.classList.add('show');
      } else {
        goToTopBtn.classList.remove('show');
      }
    });

    // Scroll to top when clicked
    goToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // === Enhanced Code Blocks ===
  function enhanceCodeBlocks() {
    const codeBlocks = document.querySelectorAll('.code-block');
    
    codeBlocks.forEach(block => {
      const pre = block.querySelector('pre');
      const code = block.querySelector('code');
      
      if (!pre || !code) return;
      
      // Get language from data attribute or class
      const language = block.dataset.language || 
                      code.className.match(/lang-(\w+)/)?.[1] ||
                      'text';
      
      // Create header with language label and copy button
      if (!block.querySelector('.code-header')) {
        const header = document.createElement('div');
        header.className = 'code-header';
        
        const languageLabel = document.createElement('span');
        languageLabel.className = 'language-label';
        languageLabel.textContent = language;
        
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copy';
        copyButton.setAttribute('aria-label', 'Copy code to clipboard');
        
        header.appendChild(languageLabel);
        header.appendChild(copyButton);
        
        block.insertBefore(header, pre);
        
        // Add copy functionality
        copyButton.addEventListener('click', () => copyCode(code, copyButton));
      }
      
      // Add line numbers
      addLineNumbers(code);
      
      // Apply syntax highlighting
      block.classList.add(`lang-${language}`);
      highlightLanguage(code, language);
    });
  }

  function copyCode(codeElement, button) {
    const text = codeElement.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      button.classList.add('copied');
      
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('copied');
      }, 2000);
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      button.textContent = 'Copied!';
      button.classList.add('copied');
      setTimeout(() => {
        button.textContent = 'Copy';
        button.classList.remove('copied');
      }, 2000);
    });
  }

  function addLineNumbers(codeElement) {
    if (codeElement.classList.contains('code-with-lines')) return;
    
    // Add line numbers class
    codeElement.classList.add('code-with-lines');
    
    // Create line numbers container
    const pre = codeElement.closest('pre');
    if (pre && !pre.querySelector('.line-numbers')) {
      const lines = codeElement.textContent.split('\n');
      const lineCount = lines[lines.length - 1] === '' ? lines.length - 1 : lines.length;
      
      const lineNumbers = document.createElement('div');
      lineNumbers.className = 'line-numbers';
      lineNumbers.setAttribute('aria-hidden', 'true');
      
      for (let i = 1; i <= lineCount; i++) {
        const lineNumber = document.createElement('div');
        lineNumber.textContent = i;
        lineNumbers.appendChild(lineNumber);
      }
      
      pre.appendChild(lineNumbers);
    }
  }

  function highlightLanguage(element, language) {
    let text = element.textContent;
    
    // Define patterns for different languages
    const patterns = {
      // C/C++ patterns
      c: {
        keywords: /\b(int|char|float|double|void|if|else|for|while|do|switch|case|break|continue|return|struct|typedef|enum|union|const|static|extern|auto|register|volatile|sizeof|goto|default)\b/g,
        types: /\b(unsigned|signed|short|long|FILE|size_t|NULL)\b/g,
        preprocessor: /^#.*$/gm,
        strings: /"([^"\\]|\\.)*"/g,
        comments: /\/\/.*$|\/\*[\s\S]*?\*\//gm,
        numbers: /\b\d+\.?\d*[fl]?\b/g
      },
      cpp: {
        keywords: /\b(class|public|private|protected|virtual|override|namespace|using|template|typename|new|delete|this|try|catch|throw|const_cast|static_cast|dynamic_cast|reinterpret_cast|auto|decltype|nullptr|constexpr|noexcept)\b/g,
        types: /\b(std|string|vector|map|set|list|queue|stack|pair|shared_ptr|unique_ptr|weak_ptr|iostream|fstream|stringstream)\b/g,
        preprocessor: /^#.*$/gm,
        strings: /"([^"\\]|\\.)*"/g,
        comments: /\/\/.*$|\/\*[\s\S]*?\*\//gm,
        numbers: /\b\d+\.?\d*[fl]?\b/g
      },
      python: {
        keywords: /\b(def|class|if|elif|else|for|while|try|except|finally|with|as|import|from|return|yield|lambda|pass|break|continue|and|or|not|in|is|True|False|None)\b/g,
        builtins: /\b(print|len|range|str|int|float|list|dict|tuple|set|open|enumerate|zip|map|filter|sum|max|min|abs|round)\b/g,
        strings: /"""[\s\S]*?"""|'''[\s\S]*?'''|"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g,
        comments: /#.*$/gm,
        numbers: /\b\d+\.?\d*\b/g
      },
      javascript: {
        keywords: /\b(function|var|let|const|if|else|for|while|do|switch|case|break|continue|return|try|catch|finally|throw|new|this|typeof|instanceof|in|of|async|await|class|extends|super|static|import|export|default)\b/g,
        builtins: /\b(console|window|document|Array|Object|String|Number|Boolean|Date|Math|JSON|Promise|setTimeout|setInterval|clearTimeout|clearInterval)\b/g,
        strings: /`[\s\S]*?`|"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g,
        comments: /\/\/.*$|\/\*[\s\S]*?\*\//gm,
        numbers: /\b\d+\.?\d*\b/g
      },
      bash: {
        keywords: /\b(if|then|else|elif|fi|for|while|do|done|case|esac|function|return|exit|break|continue|export|local|readonly|declare|unset|shift|test|echo|printf|read|cd|pwd|ls|cp|mv|rm|mkdir|rmdir|chmod|chown|grep|sed|awk|sort|uniq|wc|head|tail|cat|less|more)\b/g,
        variables: /\$\{?[a-zA-Z_][a-zA-Z0-9_]*\}?/g,
        strings: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g,
        comments: /#.*$/gm,
        numbers: /\b\d+\b/g
      },
      verilog: {
        keywords: /\b(module|endmodule|input|output|inout|wire|reg|integer|parameter|localparam|always|initial|begin|end|if|else|case|endcase|for|while|repeat|forever|assign|generate|endgenerate|function|endfunction|task|endtask)\b/g,
        types: /\b(logic|bit|byte|shortint|int|longint|real|shortreal|string|event)\b/g,
        strings: /"([^"\\]|\\.)*"/g,
        comments: /\/\/.*$|\/\*[\s\S]*?\*\//gm,
        numbers: /\b\d+'[bBdDhH][0-9a-fA-F_xXzZ]+|\b\d+\b/g
      },
      systemverilog: {
        keywords: /\b(module|endmodule|interface|endinterface|class|endclass|package|endpackage|program|endprogram|input|output|inout|logic|bit|byte|shortint|int|longint|real|shortreal|string|event|always_comb|always_ff|always_latch|initial|begin|end|if|else|case|endcase|for|while|repeat|forever|do|foreach|return|break|continue|function|endfunction|task|endtask|virtual|extends|implements|super|this|null|new|typedef|enum|struct|union|packed|unpacked|static|automatic|const|ref|modport|clocking|endclocking|constraint|solve|before|covergroup|endgroup|coverpoint|cross|bins|illegal_bins|ignore_bins|assert|assume|cover|expect|property|endproperty|sequence|endsequence|randcase|randsequence|dist)\b/g,
        types: /\b(logic|bit|byte|shortint|int|longint|real|shortreal|string|chandle|event|mailbox|semaphore|process)\b/g,
        strings: /"([^"\\]|\\.)*"/g,
        comments: /\/\/.*$|\/\*[\s\S]*?\*\//gm,
        numbers: /\b\d+'[bBdDhH][0-9a-fA-F_xXzZ]+|\b\d+\b/g
      },
      vhdl: {
        keywords: /\b(entity|architecture|library|use|package|component|signal|variable|constant|type|subtype|array|record|access|file|procedure|function|process|begin|end|if|then|else|elsif|case|when|others|for|while|loop|next|exit|wait|assert|report|severity|map|port|generic|configuration|block|generate|group|attribute|alias|disconnect|guard|transport|reject|inertial|after|until|linkage|buffer|register|bus)\b/gi,
        types: /\b(std_logic|std_logic_vector|bit|bit_vector|boolean|integer|natural|positive|real|time|string|character|severity_level|file_open_kind|file_open_status)\b/gi,
        strings: /"([^"\\]|\\.)*"/g,
        comments: /--.*$/gm,
        numbers: /\b\d+\.?\d*[eE]?[+-]?\d*\b/g
      },
      skill: {
        keywords: /\b(defun|lambda|let|cond|if|when|unless|while|for|foreach|mapcar|apply|funcall|quote|setq|setf|prog1|progn|case|and|or|not|null|listp|numberp|stringp|symbolp|boundp|fboundp)\b/g,
        functions: /\b(car|cdr|cons|list|append|length|member|assoc|reverse|sort|nth|nthcdr|last|butlast|subst|remove|delete|find|position|count|every|some|notany|notevery|reduce|concatenate|coerce|type-of|typep|format|print|princ|prin1|read|read-line|write|write-line|open|close|with-open-file)\b/g,
        strings: /"([^"\\]|\\.)*"/g,
        comments: /;.*$/gm,
        numbers: /\b\d+\.?\d*\b/g
      },
      matlab: {
        keywords: /\b(function|if|else|elseif|end|for|while|switch|case|otherwise|try|catch|break|continue|return|global|persistent|clear|clc|close|hold|on|off|figure|plot|subplot|title|xlabel|ylabel|legend|grid|axis|xlim|ylim)\b/g,
        functions: /\b(fprintf|sprintf|disp|input|load|save|size|length|numel|zeros|ones|eye|rand|randn|linspace|logspace|meshgrid|sin|cos|tan|exp|log|log10|sqrt|abs|round|floor|ceil|fix|mod|rem|min|max|sum|mean|std|var|sort|find|unique|intersect|union|setdiff|ismember|isnan|isinf|isfinite|isempty|strcmp|strcmpi|strcat|strrep|regexp|regexprep)\b/g,
        strings: /'([^'\\]|\\.)*'/g,
        comments: /%.*$/gm,
        numbers: /\b\d+\.?\d*[eE]?[+-]?\d*\b/g
      },
      // Generic fallback for any other language
      text: {
        strings: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g,
        comments: /\/\/.*$|\/\*[\s\S]*?\*\/|#.*$/gm,
        numbers: /\b\d+\.?\d*\b/g
      }
    };

    const langPatterns = patterns[language] || patterns.c;
    
    // Apply highlighting
    if (langPatterns.comments) {
      text = text.replace(langPatterns.comments, '<span class="comment">$&</span>');
    }
    if (langPatterns.strings) {
      text = text.replace(langPatterns.strings, '<span class="string">$&</span>');
    }
    if (langPatterns.preprocessor) {
      text = text.replace(langPatterns.preprocessor, '<span class="preprocessor">$&</span>');
    }
    if (langPatterns.keywords) {
      text = text.replace(langPatterns.keywords, '<span class="keyword">$&</span>');
    }
    if (langPatterns.types) {
      text = text.replace(langPatterns.types, '<span class="type">$&</span>');
    }
    if (langPatterns.builtins || langPatterns.functions) {
      const pattern = langPatterns.builtins || langPatterns.functions;
      text = text.replace(pattern, '<span class="builtin">$&</span>');
    }
    if (langPatterns.variables) {
      text = text.replace(langPatterns.variables, '<span class="variable">$&</span>');
    }
    if (langPatterns.numbers) {
      text = text.replace(langPatterns.numbers, '<span class="number">$&</span>');
    }

    element.innerHTML = text;
  }

  // === Table of Contents / Articles List ===
  function generateTableOfContents() {
    const tocMenu = document.getElementById('tocMenu');
    const headings = document.querySelectorAll('.blog-content h4, .blog-content h3, .blog-content h2');
    
    if (!tocMenu) return;
    
    // Clear existing TOC
    tocMenu.innerHTML = '';
    
    // Check if this is the articles page
    if (document.title === 'Periodic Perplexities') {
      // Generate articles dropdown for articles.html
      const articles = [
        { title: "The Hardware Lottery: We may be trying to build a ladder to the Moon", link: "cognitive-sciences.html" },
        { title: "Understanding Neural Network Architectures: From Perceptrons to Transformers", link: "#" },
        { title: "The Future of Quantum Computing: Challenges and Opportunities", link: "#" }
      ];
      
      articles.forEach(article => {
        const tocItem = document.createElement('div');
        tocItem.className = 'toc-menu-item';
        tocItem.textContent = article.title;
        tocItem.addEventListener('click', () => {
          if (article.link !== '#') {
            window.location.href = article.link;
          }
          toggleTOCDropdown(false);
        });
        
        tocMenu.appendChild(tocItem);
      });
    } else if (headings.length > 0) {
      // Generate regular TOC for blog posts
      headings.forEach((heading, index) => {
        // Create unique ID for the heading if it doesn't have one
        if (!heading.id) {
          const id = heading.textContent.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50);
          heading.id = `section-${index}-${id}`;
        }
        
        // Create TOC menu item
        const tocItem = document.createElement('div');
        tocItem.className = 'toc-menu-item';
        tocItem.textContent = heading.textContent;
        tocItem.addEventListener('click', () => {
          // Scroll to heading with offset for sticky header
          const targetPosition = heading.offsetTop - 80;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Close dropdown
          toggleTOCDropdown(false);
        });
        
        tocMenu.appendChild(tocItem);
      });
    }
  }

  function toggleTOCDropdown(forceState = null) {
    const dropdown = document.getElementById('tocDropdown');
    const menu = document.getElementById('tocMenu');
    
    if (forceState !== null) {
      dropdown.classList.toggle('open', forceState);
      menu.classList.toggle('open', forceState);
    } else {
      dropdown.classList.toggle('open');
      menu.classList.toggle('open');
    }
  }

  // === Sticky Header ===
  const stickyHeader = document.getElementById('stickyHeader');
  const blogTitle = document.querySelector('.blog-title');
  
  if (stickyHeader && blogTitle) {
    // Get the title text and set it in the sticky header
    const titleText = blogTitle.textContent;
    const stickyTitle = document.getElementById('stickyTitle');
    if (stickyTitle) {
      stickyTitle.textContent = titleText;
    }
    
    // Generate Table of Contents
    generateTableOfContents();
    
    // TOC dropdown functionality
    const tocButton = document.getElementById('tocButton');
    if (tocButton) {
      tocButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTOCDropdown();
      });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('tocDropdown');
      if (dropdown && !dropdown.contains(e.target)) {
        toggleTOCDropdown(false);
      }
    });
    
    // Show/hide sticky header on scroll
    let lastScrollY = window.scrollY;
    const titleOffset = blogTitle.offsetTop + blogTitle.offsetHeight;
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > titleOffset + 100) {
        stickyHeader.classList.add('visible');
      } else {
        stickyHeader.classList.remove('visible');
        // Close TOC dropdown when header is hidden
        toggleTOCDropdown(false);
      }
      
      lastScrollY = currentScrollY;
    });
  }

  // === Lazy Loading for Images ===
  function initLazyLoading() {
    // Only implement if browser doesn't support native lazy loading
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading, add loading="lazy" to images
      const images = document.querySelectorAll('img:not([loading])');
      images.forEach(img => {
        img.setAttribute('loading', 'lazy');
      });
    } else {
      // Fallback for browsers without native lazy loading support
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              img.classList.remove('lazy-loading');
              img.classList.add('lazy-loaded');
              observer.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      // Find all images that should be lazy loaded
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => {
        img.classList.add('lazy-loading');
        imageObserver.observe(img);
      });
    }
  }

  // === Scroll Progress Bar ===
  function initScrollProgress() {
    // Create scroll progress elements
    const progressContainer = document.createElement('div');
    progressContainer.className = 'scroll-progress';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    
    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);
    
    // Update progress on scroll
    function updateScrollProgress() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / scrollHeight) * 100;
      
      progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', updateScrollProgress);
    
    // Initial update
    updateScrollProgress();
  }

  // === Dynamic Article Count ===
  function updateArticleCount() {
    // Only run on articles page
    if (document.title === 'Periodic Perplexities') {
      const articleItems = document.querySelectorAll('.article-item');
      const articleCountDiv = document.getElementById('articleCount');
      
      if (articleCountDiv && articleItems.length > 0) {
        const count = articleItems.length;
        articleCountDiv.textContent = `${count} article${count === 1 ? '' : 's'}`;
      }
    }
  }

  // Apply enhancements on page load
  enhanceCodeBlocks();
  initLazyLoading();
  initScrollProgress();
  updateArticleCount();
});

