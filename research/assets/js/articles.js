// Client-side articles loading
document.addEventListener('DOMContentLoaded', async function() {
    await loadArticles();
});

async function loadArticles() {
    try {
        const response = await fetch('articles/articles-index.json');
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
            const articlesList = document.getElementById('articlesList');
            const articleCount = document.getElementById('articleCount');
            
            // Sort articles by date (newest first)
            const sortedArticles = data.articles.sort((a, b) => 
                new Date(b.dateSort) - new Date(a.dateSort)
            );
            
            // Update article count
            articleCount.textContent = `${sortedArticles.length} article${sortedArticles.length !== 1 ? 's' : ''}`;
            
            // Generate article HTML
            const articlesHTML = sortedArticles.map(article => `
                <div class="article-item">
                    <div class="article-date">${article.date}</div>
                    <div class="article-title">
                        <a href="articles/${article.filename}">${article.title}</a>
                    </div>
                </div>
            `).join('');
            
            articlesList.innerHTML = articlesHTML;
        } else {
            // No articles found
            document.getElementById('articleCount').textContent = '0 articles';
            document.getElementById('articlesList').innerHTML = '';
            document.getElementById('noArticlesMessage').style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading articles:', error);
        document.getElementById('articleCount').textContent = 'Error loading articles';
        document.getElementById('articlesList').innerHTML = `
            <div style="text-align: center; color: #dc3545; padding: 2rem;">
                Error loading articles index. Please check the articles-index.json file.
            </div>
        `;
    }
}

// Function to extract article metadata from HTML content
function extractArticleMetadata(htmlContent, filename) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Extract title
    let title = '';
    const blogTitle = doc.querySelector('h1.blog-title');
    const titleTag = doc.querySelector('title');
    
    if (blogTitle) {
        title = blogTitle.textContent.trim();
    } else if (titleTag) {
        title = titleTag.textContent.trim();
    } else {
        title = filename.replace('.html', '').replace(/-/g, ' ');
    }
    
    // Extract date
    let date = '';
    let dateSort = '';
    const dateElements = doc.querySelectorAll('.author-info div');
    for (const element of dateElements) {
        if (element.innerHTML.includes('<strong>Date:</strong>')) {
            date = element.textContent.replace('Date:', '').trim();
            // Try to parse date for sorting
            try {
                const parsedDate = new Date(date);
                if (!isNaN(parsedDate.getTime())) {
                    dateSort = parsedDate.toISOString().split('T')[0];
                }
            } catch (e) {
                // Use current date as fallback
                dateSort = new Date().toISOString().split('T')[0];
            }
            break;
        }
    }
    
    // Fallback to current date if no date found
    if (!date) {
        const now = new Date();
        date = now.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        dateSort = now.toISOString().split('T')[0];
    }
    
    return {
        filename: filename,
        title: title,
        date: date,
        dateSort: dateSort
    };
}

// Function to scan articles and update index (for manual use)
async function updateArticlesIndex() {
    console.log('This function would need to be run server-side or manually.');
    console.log('To add a new article:');
    console.log('1. Add the HTML file to the articles folder');
    console.log('2. Update articles/articles-index.json with the new article information');
    console.log('3. The article list will automatically refresh');
}