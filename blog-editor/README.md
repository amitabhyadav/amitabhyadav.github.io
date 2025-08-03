# Blog Editor - Square One House

A powerful browser-based WYSIWYG editor for creating academic blog posts with support for equations, citations, images, and automatic HTML generation.

## Features

### 📝 **Rich Text Editing**
- **Quill.js-powered** WYSIWYG editor
- **Formatting options**: Bold, italic, underline, headers, lists
- **Code blocks** with syntax highlighting support
- **Real-time preview** of your content

### 🧮 **Mathematical Equations**
- **MathJax integration** for LaTeX equation rendering
- **Inline equations**: `\(E = mc^2\)`
- **Display equations**: `\[E = mc^2\]`
- **Live preview** before insertion

### 🖼️ **Image Management**
- **Drag & drop** image upload
- **Image captions** with figure support
- **Automatic optimization** and storage
- **Multiple format support** (JPG, PNG, GIF, etc.)

### 📚 **Citation System**
- **Easy citation insertion** with custom keys
- **Reference management** with automatic numbering
- **Click-to-scroll** citation functionality
- **Academic formatting** support

### 🎨 **Blog Features**
- **Metadata management**: Title, subtitle, author, date
- **Reading time estimation**
- **Table of Contents** generation
- **Dark/Light mode** toggle
- **Responsive design** for all devices
- **Print-friendly** formatting

### ⚡ **HTML Generation**
- **One-click HTML export** compatible with your blog
- **Automatic styling** integration
- **SEO-friendly** markup
- **Download ready files**

## Installation

1. **Clone or navigate to the blog-editor directory:**
   ```bash
   cd blog-editor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## Usage

### Creating a New Article

1. **Fill in article metadata:**
   - Title (required)
   - Subtitle (optional)
   - Author name
   - Publication date

2. **Write your content:**
   - Use the rich text editor for formatting
   - Add headings with the "H" button
   - Insert equations with the "∑" button
   - Upload images with the "🖼️" button
   - Add citations with the "[1]" button
   - Create code blocks with the "&lt;/&gt;" button

3. **Add references:**
   - Click "Add Reference" to create citation entries
   - Enter full citation text for each reference
   - References will be automatically numbered

4. **Preview your work:**
   - See live preview in the right panel
   - Equations and formatting render in real-time

5. **Generate HTML:**
   - Click "Generate HTML Article" when ready
   - Download the generated HTML file
   - Place it in your blog's articles directory

### Equation Examples

**Inline equations:**
```
\(E = mc^2\)
\(\sum_{i=1}^{n} x_i\)
```

**Display equations:**
```
\[E = mc^2\]
\[\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}\]
```

### Citation Format

1. **Insert citation** with key (e.g., "ref1")
2. **Add corresponding reference** in the References section
3. **Citations automatically link** to references in generated HTML

## File Structure

```
blog-editor/
├── server.js              # Express server
├── package.json           # Dependencies
├── public/                 # Frontend files
│   ├── index.html         # Main editor interface
│   ├── styles.css         # Editor styling
│   └── editor.js          # Editor functionality
├── uploads/               # Uploaded images
├── generated/             # Generated HTML files
└── README.md              # This file
```

## API Endpoints

- **GET** `/` - Editor interface
- **POST** `/upload-image` - Image upload
- **GET** `/uploads/:filename` - Serve uploaded images  
- **POST** `/generate-html` - Generate article HTML
- **GET** `/download/:filename` - Download generated files

## Generated HTML Features

The generated HTML files include:

✅ **Complete blog styling** integration  
✅ **Responsive design** for mobile/tablet  
✅ **Dark/light mode** toggle  
✅ **Sticky header** with table of contents  
✅ **Citation tooltips** and reference linking  
✅ **MathJax equation** rendering  
✅ **Code syntax highlighting**  
✅ **Image lazy loading**  
✅ **Reading time calculation**  
✅ **Print-friendly** formatting  
✅ **Navigation buttons** (home, go-to-top)  

## Browser Support

- **Chrome/Edge**: Full support
- **Firefox**: Full support  
- **Safari**: Full support
- **Mobile browsers**: Responsive design

## Troubleshooting

### Images not uploading?
- Check file size (max 10MB)
- Ensure file is an image format
- Check server permissions for uploads/ directory

### Equations not rendering?
- Verify LaTeX syntax is correct
- Check MathJax loading in browser console
- Try refreshing the page

### Generated HTML not working?
- Ensure the HTML file is in the correct directory
- Check that CSS/JS paths are correct relative to your blog structure
- Verify all image paths are accessible

## Development

To modify or extend the editor:

1. **Frontend**: Edit files in `public/` directory
2. **Backend**: Modify `server.js` for API changes
3. **Styling**: Update `public/styles.css`
4. **Editor logic**: Enhance `public/editor.js`

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify all dependencies are installed
3. Ensure the server is running on port 3000
4. Check file permissions for uploads and generated directories

---

**Happy writing! 📝✨**