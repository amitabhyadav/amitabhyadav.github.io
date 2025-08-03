// Blog Editor JavaScript - HTML Mode

let references = [];
let citationCounter = 1;
let selectedTextForHyperlink = { start: 0, end: 0, text: '' };

// Undo/Redo functionality
let undoStack = [];
let redoStack = [];
let maxUndoSteps = 100;

// Initialize the editor when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing HTML editor...');
    
    try {
        initializeEventListeners();
        initializeModals();
        
        // Set today's date as default in blog format
        const today = new Date();
        const blogDate = today.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        document.getElementById('article-date').value = blogDate;
        console.log('HTML Editor initialized successfully!');
    } catch (error) {
        console.error('Error initializing editor:', error);
    }
});

// Initialize event listeners
function initializeEventListeners() {
    // Toolbar buttons
    document.getElementById('btn-bold').addEventListener('click', () => insertFormatting('<strong>', '</strong>'));
    document.getElementById('btn-italic').addEventListener('click', () => insertFormatting('<em>', '</em>'));
    document.getElementById('btn-underline').addEventListener('click', () => insertFormatting('<u>', '</u>'));
    document.getElementById('btn-strike').addEventListener('click', () => insertFormatting('<s>', '</s>'));
    document.getElementById('btn-subscript').addEventListener('click', () => insertFormatting('<sub>', '</sub>'));
    document.getElementById('btn-superscript').addEventListener('click', () => insertFormatting('<sup>', '</sup>'));
    
    document.getElementById('btn-ordered-list').addEventListener('click', insertOrderedList);
    document.getElementById('btn-unordered-list').addEventListener('click', insertUnorderedList);
    
    document.getElementById('btn-image').addEventListener('click', showImageModal);
    document.getElementById('btn-equation').addEventListener('click', showEquationModal);
    document.getElementById('btn-hyperlink').addEventListener('click', showHyperlinkModal);
    document.getElementById('btn-citation').addEventListener('click', showCitationModal);
    document.getElementById('btn-code').addEventListener('click', showCodeModal);
    
    document.getElementById('btn-quote').addEventListener('click', insertQuote);
    document.getElementById('heading-select').addEventListener('change', insertHeading);
    
    document.getElementById('btn-align-left').addEventListener('click', () => insertAlignment('left'));
    document.getElementById('btn-align-center').addEventListener('click', () => insertAlignment('center'));
    document.getElementById('btn-align-right').addEventListener('click', () => insertAlignment('right'));
    document.getElementById('btn-align-justify').addEventListener('click', () => insertAlignment('justify'));
    
    // Color dropdown functionality
    document.getElementById('text-color-btn').addEventListener('click', () => toggleColorDropdown('text-color-dropdown'));
    document.getElementById('highlight-color-btn').addEventListener('click', () => toggleColorDropdown('highlight-color-dropdown'));
    
    // Color picker changes
    document.getElementById('text-color-picker').addEventListener('change', updateTextColorBar);
    document.getElementById('highlight-color-picker').addEventListener('change', updateHighlightColorBar);
    
    // Apply and cancel buttons
    document.getElementById('apply-text-color').addEventListener('click', () => applySelectedColor('text'));
    document.getElementById('cancel-text-color').addEventListener('click', () => closeColorDropdown('text-color-dropdown'));
    document.getElementById('apply-highlight-color').addEventListener('click', () => applySelectedColor('highlight'));
    document.getElementById('cancel-highlight-color').addEventListener('click', () => closeColorDropdown('highlight-color-dropdown'));
    
    // Color preset clicks
    initializeColorPresets();
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.color-dropdown-container')) {
            document.querySelectorAll('.color-dropdown').forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        }
    });
    
    // Modal buttons
    document.getElementById('insert-image').addEventListener('click', insertImage);
    document.getElementById('insert-citation').addEventListener('click', insertCitation);
    document.getElementById('insert-equation').addEventListener('click', insertEquation);
    document.getElementById('preview-equation').addEventListener('click', previewEquation);
    document.getElementById('insert-hyperlink').addEventListener('click', insertHyperlink);
    document.getElementById('insert-code').addEventListener('click', insertCodeBlock);
    
    // Language select handler
    document.getElementById('code-language-select').addEventListener('change', handleLanguageSelect);
    
    // Reference management
    const addRefButton = document.getElementById('add-reference');
    if (addRefButton) {
        addRefButton.addEventListener('click', addReference);
    }
    
    // Generate HTML
    document.getElementById('generate-html').addEventListener('click', generateHTML);
    
    // Update on metadata changes
    ['article-title', 'article-subtitle', 'article-author', 'article-date'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', updateWordCount);
        }
    });
    
    // Update word count on content changes
    document.getElementById('html-editor').addEventListener('input', updateWordCount);
    
    // Initialize undo system
    initializeUndoSystem();
}

// Initialize modal functionality
function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// Get current cursor position and selected text in textarea
function getCurrentSelection() {
    const editor = document.getElementById('html-editor');
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selectedText = editor.value.substring(start, end);
    return { start, end, selectedText, editor };
}

// Insert formatting tags around selected text
function insertFormatting(openTag, closeTag) {
    forceSaveUndoState(); // Save state before making changes
    
    const { start, end, selectedText, editor } = getCurrentSelection();
    
    const beforeText = editor.value.substring(0, start);
    const afterText = editor.value.substring(end);
    
    if (selectedText) {
        // Wrap selected text
        const newText = beforeText + openTag + selectedText + closeTag + afterText;
        editor.value = newText;
        editor.setSelectionRange(start + openTag.length, start + openTag.length + selectedText.length);
    } else {
        // Insert empty tags
        const newText = beforeText + openTag + closeTag + afterText;
        editor.value = newText;
        editor.setSelectionRange(start + openTag.length, start + openTag.length);
    }
    
    editor.focus();
    updateWordCount();
}

// Insert ordered list
function insertOrderedList() {
    forceSaveUndoState(); // Save state before making changes
    const { start, editor } = getCurrentSelection();
    const beforeText = editor.value.substring(0, start);
    const afterText = editor.value.substring(start);
    
    const listHtml = `\n<ol>\n  <li>Item 1</li>\n  <li>Item 2</li>\n  <li>Item 3</li>\n</ol>\n`;
    
    editor.value = beforeText + listHtml + afterText;
    editor.setSelectionRange(start + listHtml.length, start + listHtml.length);
    editor.focus();
    updateWordCount();
}

// Insert unordered list
function insertUnorderedList() {
    forceSaveUndoState(); // Save state before making changes
    const { start, editor } = getCurrentSelection();
    const beforeText = editor.value.substring(0, start);
    const afterText = editor.value.substring(start);
    
    const listHtml = `\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n  <li>Item 3</li>\n</ul>\n`;
    
    editor.value = beforeText + listHtml + afterText;
    editor.setSelectionRange(start + listHtml.length, start + listHtml.length);
    editor.focus();
    updateWordCount();
}

// Insert quote
function insertQuote() {
    forceSaveUndoState(); // Save state before making changes
    const { start, end, selectedText, editor } = getCurrentSelection();
    const beforeText = editor.value.substring(0, start);
    const afterText = editor.value.substring(end);
    
    if (selectedText) {
        const quoteHtml = `<blockquote>\n  <p>${selectedText}</p>\n</blockquote>`;
        editor.value = beforeText + quoteHtml + afterText;
    } else {
        const quoteHtml = `\n<blockquote>\n  <p>Your quote here</p>\n</blockquote>\n`;
        editor.value = beforeText + quoteHtml + afterText;
    }
    
    editor.focus();
    updateWordCount();
}

// Insert heading
function insertHeading() {
    const select = document.getElementById('heading-select');
    const tag = select.value;
    
    if (tag === 'p') return;
    
    forceSaveUndoState(); // Save state before making changes
    
    const { start, end, selectedText, editor } = getCurrentSelection();
    const beforeText = editor.value.substring(0, start);
    const afterText = editor.value.substring(end);
    
    const headingText = selectedText || 'Your heading here';
    const headingHtml = `\n<${tag}>${headingText}</${tag}>\n`;
    
    editor.value = beforeText + headingHtml + afterText;
    editor.focus();
    updateWordCount();
    
    // Reset select
    select.value = 'p';
}

// Insert alignment
function insertAlignment(align) {
    forceSaveUndoState(); // Save state before making changes
    const { start, end, selectedText, editor } = getCurrentSelection();
    const beforeText = editor.value.substring(0, start);
    const afterText = editor.value.substring(end);
    
    const content = selectedText || 'Your content here';
    const alignHtml = `\n<p style="text-align: ${align};">${content}</p>\n`;
    
    editor.value = beforeText + alignHtml + afterText;
    editor.focus();
    updateWordCount();
}

// Apply text color
function applyTextColor() {
    const color = document.getElementById('text-color').value;
    const { start, end, selectedText, editor } = getCurrentSelection();
    
    if (!selectedText) {
        alert('Please select text to apply color to.');
        return;
    }
    
    const beforeText = editor.value.substring(0, start);
    const afterText = editor.value.substring(end);
    
    const colorHtml = `<span style="color: ${color};">${selectedText}</span>`;
    editor.value = beforeText + colorHtml + afterText;
    editor.focus();
    updateWordCount();
}

// Apply highlight
function applyHighlight() {
    const color = document.getElementById('highlight-color').value;
    const { start, end, selectedText, editor } = getCurrentSelection();
    
    if (!selectedText) {
        alert('Please select text to highlight.');
        return;
    }
    
    const beforeText = editor.value.substring(0, start);
    const afterText = editor.value.substring(end);
    
    const highlightHtml = `<span style="background-color: ${color};">${selectedText}</span>`;
    editor.value = beforeText + highlightHtml + afterText;
    editor.focus();
    updateWordCount();
}

// Show modals
function showImageModal() {
    document.getElementById('image-modal').style.display = 'block';
    document.getElementById('image-src').value = '';
    document.getElementById('image-alt').value = '';
    document.getElementById('image-caption').value = '';
}

function showEquationModal() {
    document.getElementById('equation-modal').style.display = 'block';
    document.getElementById('equation-latex').value = '';
    document.getElementById('equation-preview').textContent = 'Preview will appear here...';
}

function showHyperlinkModal() {
    // Store current selection for later use
    const { start, end, selectedText } = getCurrentSelection();
    selectedTextForHyperlink = { start, end, text: selectedText };
    
    document.getElementById('hyperlink-modal').style.display = 'block';
    document.getElementById('link-text').value = selectedText; // Pre-fill with selected text
    document.getElementById('link-url').value = '';
    document.getElementById('link-target').checked = false;
}

function showCitationModal() {
    document.getElementById('citation-modal').style.display = 'block';
    document.getElementById('citation-key').value = `ref${citationCounter}`;
}

function showCodeModal() {
    document.getElementById('code-modal').style.display = 'block';
    document.getElementById('code-content').value = '';
    document.getElementById('code-language-select').value = '';
    document.getElementById('custom-language-group').style.display = 'none';
    document.getElementById('custom-language').value = '';
}

// Handle language selection
function handleLanguageSelect() {
    const select = document.getElementById('code-language-select');
    const customGroup = document.getElementById('custom-language-group');
    
    if (select.value === 'custom') {
        customGroup.style.display = 'block';
    } else {
        customGroup.style.display = 'none';
    }
}

// Insert functions
function insertImage() {
    forceSaveUndoState(); // Save state before making changes
    const src = document.getElementById('image-src').value.trim();
    const alt = document.getElementById('image-alt').value.trim();
    const caption = document.getElementById('image-caption').value.trim();
    
    if (!src) {
        alert('Please enter an image source.');
        return;
    }
    
    const { start, editor } = getCurrentSelection();
    const beforeText = editor.value.substring(0, start);
    const afterText = editor.value.substring(start);
    
    let imageHtml;
    if (caption) {
        imageHtml = `\n<figure class="blog-figure">\n  <img src="${src}" alt="${alt}" class="blog-image" />\n  <figcaption>${caption}</figcaption>\n</figure>\n`;
    } else {
        imageHtml = `\n<img src="${src}" alt="${alt}" class="blog-image" />\n`;
    }
    
    editor.value = beforeText + imageHtml + afterText;
    document.getElementById('image-modal').style.display = 'none';
    editor.focus();
    updateWordCount();
}

function previewEquation() {
    const latex = document.getElementById('equation-latex').value.trim();
    const type = document.querySelector('input[name="eq-type"]:checked').value;
    
    if (!latex) {
        alert('Please enter LaTeX code to preview.');
        return;
    }
    
    const previewDiv = document.getElementById('equation-preview');
    const equation = type === 'inline' ? `\\(${latex}\\)` : `\\[${latex}\\]`;
    
    previewDiv.innerHTML = equation;
    
    // Re-render MathJax
    if (window.MathJax) {
        MathJax.typesetPromise([previewDiv]).then(() => {
            // Math has been rendered
        }).catch((ex) => {
            console.error('MathJax error:', ex);
            previewDiv.textContent = 'Error rendering equation. Please check your LaTeX syntax.';
        });
    }
}

function insertEquation() {
    forceSaveUndoState(); // Save state before making changes
    const latex = document.getElementById('equation-latex').value.trim();
    const type = document.querySelector('input[name="eq-type"]:checked').value;
    
    if (!latex) {
        alert('Please enter LaTeX code for the equation.');
        return;
    }
    
    const { start, editor } = getCurrentSelection();
    const beforeText = editor.value.substring(0, start);
    const afterText = editor.value.substring(start);
    
    const equation = type === 'inline' ? `\\(${latex}\\)` : `\n\\[\n  ${latex}\n\\]\n`;
    
    editor.value = beforeText + equation + afterText;
    document.getElementById('equation-modal').style.display = 'none';
    editor.focus();
    updateWordCount();
}

function insertHyperlink() {
    forceSaveUndoState(); // Save state before making changes
    const text = document.getElementById('link-text').value.trim();
    const url = document.getElementById('link-url').value.trim();
    const target = document.getElementById('link-target').checked;
    
    if (!text || !url) {
        alert('Please enter both link text and URL.');
        return;
    }
    
    const editor = document.getElementById('html-editor');
    const beforeText = editor.value.substring(0, selectedTextForHyperlink.start);
    const afterText = editor.value.substring(selectedTextForHyperlink.end);
    
    const targetAttr = target ? ' target="_blank"' : '';
    const linkHtml = `<a href="${url}"${targetAttr}>${text}</a>`;
    
    // Replace the originally selected text with the complete HTML
    editor.value = beforeText + linkHtml + afterText;
    
    // Set cursor position after the inserted link
    const newCursorPos = selectedTextForHyperlink.start + linkHtml.length;
    editor.setSelectionRange(newCursorPos, newCursorPos);
    
    document.getElementById('hyperlink-modal').style.display = 'none';
    editor.focus();
    updateWordCount();
}

function insertCitation() {
    forceSaveUndoState(); // Save state before making changes
    const citationKey = document.getElementById('citation-key').value.trim();
    
    if (!citationKey) {
        alert('Please enter a citation key.');
        return;
    }
    
    const { start, editor } = getCurrentSelection();
    const beforeText = editor.value.substring(0, start);
    const afterText = editor.value.substring(start);
    
    const citationHtml = `<span class="citation" data-citekey="${citationKey}" tabindex="0">[${citationCounter}]</span>`;
    
    editor.value = beforeText + citationHtml + afterText;
    citationCounter++;
    document.getElementById('citation-modal').style.display = 'none';
    editor.focus();
    updateWordCount();
}

function insertCodeBlock() {
    forceSaveUndoState(); // Save state before making changes
    const languageSelect = document.getElementById('code-language-select').value;
    const customLanguage = document.getElementById('custom-language').value.trim();
    const code = document.getElementById('code-content').value.trim();
    
    if (!code) {
        alert('Please enter some code.');
        return;
    }
    
    // Determine the language to use
    let language, displayLanguage;
    if (languageSelect === 'custom') {
        if (!customLanguage) {
            alert('Please enter a custom language name.');
            return;
        }
        // Use "text" for highlighting (no syntax highlighting)
        language = 'text';
        // But display the actual language name entered by user with nbsp to avoid conflicts
        displayLanguage = customLanguage.toLowerCase() + '&nbsp;&nbsp;';
    } else if (languageSelect === '') {
        alert('Please select a programming language.');
        return;
    } else {
        language = languageSelect;
        displayLanguage = languageSelect;
    }
    
    const { start, editor } = getCurrentSelection();
    const beforeText = editor.value.substring(0, start);
    const afterText = editor.value.substring(start);
    
    // Escape HTML characters in code
    const escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    
    const codeHtml = `\n<div class="code-block" data-language="${displayLanguage}">
  <pre><code class="lang-${language}">${escapedCode}</code></pre>
</div>\n`;
    
    editor.value = beforeText + codeHtml + afterText;
    document.getElementById('code-modal').style.display = 'none';
    editor.focus();
    updateWordCount();
}

// Add reference
function addReference() {
    const referencesList = document.getElementById('references-list');
    const referenceIndex = references.length;
    const referenceNumber = referenceIndex + 1;
    
    const referenceDiv = document.createElement('div');
    referenceDiv.className = 'reference-item';
    referenceDiv.innerHTML = `
        <span class="reference-label">ref${referenceNumber}</span>
        <input type="text" placeholder="Enter reference citation" value="" data-index="${referenceIndex}">
        <button class="reference-remove" onclick="removeReference(${referenceIndex})">Remove</button>
    `;
    
    referencesList.appendChild(referenceDiv);
    references.push('');
    
    // Add event listener for input changes
    const input = referenceDiv.querySelector('input');
    input.addEventListener('input', function() {
        references[this.dataset.index] = this.value;
    });
}

// Remove reference
function removeReference(index) {
    references.splice(index, 1);
    renderReferences();
}

// Render references
function renderReferences() {
    const referencesList = document.getElementById('references-list');
    referencesList.innerHTML = '';
    
    references.forEach((ref, index) => {
        const referenceNumber = index + 1;
        const referenceDiv = document.createElement('div');
        referenceDiv.className = 'reference-item';
        referenceDiv.innerHTML = `
            <span class="reference-label">ref${referenceNumber}</span>
            <input type="text" placeholder="Enter reference citation" value="${ref}" data-index="${index}">
            <button class="reference-remove" onclick="removeReference(${index})">Remove</button>
        `;
        
        referencesList.appendChild(referenceDiv);
        
        // Add event listener for input changes
        const input = referenceDiv.querySelector('input');
        input.addEventListener('input', function() {
            references[this.dataset.index] = this.value;
        });
    });
}

// Update word count (optional)
function updateWordCount() {
    // This function can be expanded to show word count if needed
}

// Toggle color dropdown
function toggleColorDropdown(dropdownId) {
    // Close all other dropdowns first
    document.querySelectorAll('.color-dropdown').forEach(dropdown => {
        if (dropdown.id !== dropdownId) {
            dropdown.classList.remove('show');
        }
    });
    
    // Toggle the requested dropdown
    const dropdown = document.getElementById(dropdownId);
    dropdown.classList.toggle('show');
}

// Close color dropdown
function closeColorDropdown(dropdownId) {
    document.getElementById(dropdownId).classList.remove('show');
}

// Initialize color presets
function initializeColorPresets() {
    // Text color presets
    document.querySelectorAll('#text-color-presets .color-preset').forEach(preset => {
        preset.addEventListener('click', function() {
            const color = this.dataset.color;
            document.getElementById('text-color-picker').value = color;
            updateTextColorBar();
        });
    });
    
    // Highlight color presets
    document.querySelectorAll('#highlight-color-presets .color-preset').forEach(preset => {
        preset.addEventListener('click', function() {
            const color = this.dataset.color;
            document.getElementById('highlight-color-picker').value = color;
            updateHighlightColorBar();
        });
    });
}

// Apply selected color
function applySelectedColor(type) {
    if (type === 'text') {
        const color = document.getElementById('text-color-picker').value;
        applyTextColorWithValue(color);
        closeColorDropdown('text-color-dropdown');
    } else if (type === 'highlight') {
        const color = document.getElementById('highlight-color-picker').value;
        applyHighlightColorWithValue(color);
        closeColorDropdown('highlight-color-dropdown');
    }
}

// Apply text color with specific value
function applyTextColorWithValue(color) {
    forceSaveUndoState(); // Save state before making changes
    const { start, end, selectedText, editor } = getCurrentSelection();
    
    if (!selectedText) {
        alert('Please select text to apply color to.');
        return;
    }
    
    const beforeText = editor.value.substring(0, start);
    const afterText = editor.value.substring(end);
    
    const colorHtml = `<span style="color: ${color};">${selectedText}</span>`;
    editor.value = beforeText + colorHtml + afterText;
    editor.focus();
    updateWordCount();
}

// Apply highlight color with specific value
function applyHighlightColorWithValue(color) {
    forceSaveUndoState(); // Save state before making changes
    const { start, end, selectedText, editor } = getCurrentSelection();
    
    if (!selectedText) {
        alert('Please select text to highlight.');
        return;
    }
    
    const beforeText = editor.value.substring(0, start);
    const afterText = editor.value.substring(end);
    
    const highlightHtml = `<span style="background-color: ${color};">${selectedText}</span>`;
    editor.value = beforeText + highlightHtml + afterText;
    editor.focus();
    updateWordCount();
}

// Update color bar in text color icon
function updateTextColorBar() {
    const color = document.getElementById('text-color-picker').value;
    const colorBar = document.getElementById('text-color-bar');
    if (colorBar) {
        colorBar.setAttribute('fill', color);
    }
}

// Update color bar in highlight color icon
function updateHighlightColorBar() {
    const color = document.getElementById('highlight-color-picker').value;
    const colorBar = document.getElementById('highlight-color-bar');
    if (colorBar) {
        colorBar.setAttribute('fill', color);
    }
}

// Initialize undo/redo system
function initializeUndoSystem() {
    const editor = document.getElementById('html-editor');
    
    // Save initial state
    saveUndoState();
    
    // Track changes with debouncing to avoid too many undo states
    let inputTimeout;
    editor.addEventListener('input', function() {
        clearTimeout(inputTimeout);
        inputTimeout = setTimeout(() => {
            saveUndoState();
        }, 500); // Save state 500ms after user stops typing
    });
    
    // Handle keyboard shortcuts
    editor.addEventListener('keydown', function(e) {
        // Ctrl+Z (Undo)
        if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            performUndo();
        }
        // Ctrl+Y or Ctrl+Shift+Z (Redo)
        else if (e.ctrlKey && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
            e.preventDefault();
            performRedo();
        }
    });
}

// Save current editor state to undo stack
function saveUndoState() {
    const editor = document.getElementById('html-editor');
    const currentState = {
        content: editor.value,
        selectionStart: editor.selectionStart,
        selectionEnd: editor.selectionEnd
    };
    
    // Don't save if content hasn't changed
    if (undoStack.length > 0 && undoStack[undoStack.length - 1].content === currentState.content) {
        return;
    }
    
    undoStack.push(currentState);
    
    // Limit undo stack size
    if (undoStack.length > maxUndoSteps) {
        undoStack.shift();
    }
    
    // Clear redo stack when new change is made
    redoStack = [];
}

// Perform undo operation
function performUndo() {
    if (undoStack.length <= 1) return; // Need at least 2 states (current + previous)
    
    const editor = document.getElementById('html-editor');
    const currentState = {
        content: editor.value,
        selectionStart: editor.selectionStart,
        selectionEnd: editor.selectionEnd
    };
    
    // Move current state to redo stack
    redoStack.push(currentState);
    
    // Remove current state from undo stack
    undoStack.pop();
    
    // Get previous state
    const previousState = undoStack[undoStack.length - 1];
    
    // Restore previous state
    editor.value = previousState.content;
    editor.setSelectionRange(previousState.selectionStart, previousState.selectionEnd);
    
    // Update word count
    updateWordCount();
}

// Perform redo operation
function performRedo() {
    if (redoStack.length === 0) return;
    
    const editor = document.getElementById('html-editor');
    
    // Get state from redo stack
    const nextState = redoStack.pop();
    
    // Save current state to undo stack
    const currentState = {
        content: editor.value,
        selectionStart: editor.selectionStart,
        selectionEnd: editor.selectionEnd
    };
    undoStack.push(currentState);
    
    // Restore next state
    editor.value = nextState.content;
    editor.setSelectionRange(nextState.selectionStart, nextState.selectionEnd);
    
    // Update word count
    updateWordCount();
}

// Force save undo state (for manual operations like inserting formatting)
function forceSaveUndoState() {
    saveUndoState();
}

// Generate HTML
async function generateHTML() {
    const title = document.getElementById('article-title').value.trim();
    const subtitle = document.getElementById('article-subtitle').value.trim();
    const author = document.getElementById('article-author').value.trim();
    const date = document.getElementById('article-date').value;
    const content = document.getElementById('html-editor').value.trim();
    const filteredReferences = references.filter(ref => ref.trim());
    
    if (!title) {
        alert('Please enter a title for your article.');
        return;
    }
    
    if (!content) {
        alert('Please add some content to your article.');
        return;
    }
    
    // Show loading status
    const statusDiv = document.getElementById('generation-status');
    statusDiv.innerHTML = 'Generating HTML file...';
    statusDiv.className = 'status-loading';
    
    try {
        const response = await fetch('/generate-html', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                subtitle,
                author,
                date,
                content,
                references: filteredReferences
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            statusDiv.innerHTML = `
                <div>HTML file generated successfully!</div>
                <div style="margin-top: 10px;">
                    <a href="${result.downloadUrl}" download style="color: white; text-decoration: underline;">
                        Download ${result.filename}
                    </a>
                </div>
            `;
            statusDiv.className = 'status-success';
        } else {
            statusDiv.innerHTML = `Error: ${result.error}`;
            statusDiv.className = 'status-error';
        }
    } catch (error) {
        statusDiv.innerHTML = `Error: ${error.message}`;
        statusDiv.className = 'status-error';
    }
}