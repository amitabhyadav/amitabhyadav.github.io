const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

// Create necessary directories
fs.ensureDirSync('./uploads');
fs.ensureDirSync('./generated');
fs.ensureDirSync('../research/articles');

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Routes

// Serve the editor interface
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Handle image uploads
app.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }
  
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ 
    success: true, 
    imageUrl: imageUrl,
    filename: req.file.filename
  });
});

// Serve uploaded images
app.use('/uploads', express.static('./uploads'));


// Generate HTML article
app.post('/generate-html', async (req, res) => {
  try {
    const { title, subtitle, author, date, content, references } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Generate datetime-based filename (YYYYMMDDHHMM.html)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    
    const filename = `${year}${month}${day}${hour}${minute}.html`;

    // Generate HTML content
    const htmlContent = generateBlogHTML({
      title,
      subtitle,
      author,
      date,
      content,
      references
    });

    // Save the generated HTML file to the correct blog articles directory
    const outputPath = path.join('../research/articles', filename);
    await fs.writeFile(outputPath, htmlContent);

    // Update articles index
    let dateSort;
    try {
      dateSort = new Date(date).toISOString().split('T')[0];
    } catch (e) {
      dateSort = new Date().toISOString().split('T')[0];
    }
    
    await updateArticlesIndex({
      filename,
      title,
      date,
      dateSort
    });

    res.json({
      success: true,
      filename: filename,
      downloadUrl: `/download/${filename}`,
      message: 'HTML file generated successfully!'
    });

  } catch (error) {
    console.error('Error generating HTML:', error);
    res.status(500).json({ error: 'Failed to generate HTML file' });
  }
});


// Download generated HTML files
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join('../research/articles', filename);
  
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// Function to update articles index
async function updateArticlesIndex(newArticle) {
  try {
    const indexPath = path.join('../research/articles', 'articles-index.json');
    
    let indexData = {
      articles: [],
      lastUpdated: new Date().toISOString()
    };
    
    // Read existing index if it exists
    if (await fs.pathExists(indexPath)) {
      const existingData = await fs.readJson(indexPath);
      indexData.articles = existingData.articles || [];
    }
    
    // Check if article already exists (update) or add new
    const existingIndex = indexData.articles.findIndex(article => article.filename === newArticle.filename);
    
    if (existingIndex >= 0) {
      // Update existing article
      indexData.articles[existingIndex] = newArticle;
    } else {
      // Add new article
      indexData.articles.push(newArticle);
    }
    
    // Sort by date (newest first)
    indexData.articles.sort((a, b) => new Date(b.dateSort) - new Date(a.dateSort));
    
    // Update timestamp
    indexData.lastUpdated = new Date().toISOString();
    
    // Write updated index
    await fs.writeJson(indexPath, indexData, { spaces: 2 });
    
    console.log(`Updated articles index with: ${newArticle.title}`);
  } catch (error) {
    console.error('Error updating articles index:', error);
  }
}

// Function to generate blog HTML
function generateBlogHTML({ title, subtitle, author, date, content, references }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<link rel="stylesheet" href="../assets/css/blog-style.css" />

<!-- Favicon -->
<link rel="icon" type="image/png" href="../assets/media/images/favicon.svg" />

<!-- MathJax CDN -->
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" async></script>
</head>
<body>
  <!-- Sticky Header -->
  <header class="sticky-header" id="stickyHeader">
    <div class="sticky-header-content">
      <h1 class="sticky-header-title" id="stickyTitle">${title}</h1>
      <div class="toc-dropdown" id="tocDropdown">
        <button class="toc-button" id="tocButton">
          <span>Table of Contents</span>
          <span class="toc-dropdown-arrow">▼</span>
        </button>
        <div class="toc-menu" id="tocMenu">
          <!-- Table of contents items will be generated by JavaScript -->
        </div>
      </div>
    </div>
  </header>

  <!-- Dark/Light Mode Toggle -->
  <div class="mode-toggle-container">
    <label class="toggle-switch">
      <input type="checkbox" id="modeToggle">
      <span class="slider"></span>
    </label>
  </div>

  <div class="blog-container">
    <header class="blog-header">
      <h1 class="blog-title">${title}</h1>
      ${subtitle ? `<div class="blog-subtitle">
        ${subtitle}
      </div>` : ''}
      <div class="blog-meta">
        <div id="readingTime" class="reading-time" aria-label="Estimated reading time"></div>
        ${author || date ? `<div class="author-info">
          ${author ? `<div><strong>Author:</strong> ${author}</div>` : ''}
          ${date ? `<div><strong>Date:</strong> ${date}</div>` : ''}
        </div>` : ''}
      </div>
    </header>

    <article class="blog-content">

      ${content}

      ${references && references.length > 0 ? `
    <section id="references-section" aria-label="References">
    <h3>References</h3>
    <ol id="references-list">
      ${references.map((ref, index) => `<li id="ref-ref${index + 1}">${ref}</li>`).join('\n      ')}
        </ol>
      </section>` : ''}
    </article>
  </div>

  <!-- Fixed Footer -->
  <div class="fixed-footer">
    <div class="left-links">
      <a href="../../">Home</a> &#9474; <a href="../" style="font-weight: bold; border: 2px solid #0074D9; padding: 4px 8px; border-radius: 4px; text-decoration: none; color: #0074D9;">Research</a> &#9474; <a href="https://flora.squareone.house/amitabh" target="_blank">Reading Stats</a> &#9474; <a href="../../cv/">CV</a> &#9474; <a href="../../contact/">Contact</a>
    </div>
    <div class="right-copy" style="padding-left: 5px;">
    &#169; 2018–<span id="currentYear"></span> Amitabh Yadav.
    </div>
  </div>
  
  <script>
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear().toString().slice(-2);
  </script>


  </div>

  <!-- Go to Top Button -->
  <button class="go-to-top" id="goToTop" aria-label="Go to top"></button>

  <!-- Home Button -->
  <a href="../index.html" class="home-button" aria-label="Go to home"></a>


  <script src="../assets/js/blog-style.js" defer></script>
</body>
</html>`;
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Express Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit, just log the error
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  // Don't exit, just log the error
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Blog Editor Server running at http://localhost:${PORT}`);
  console.log('Open your browser and navigate to the URL above to start editing!');
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server Error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please close other instances or change the port.`);
  }
});

// Gracful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});