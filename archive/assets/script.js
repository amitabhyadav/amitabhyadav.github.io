//Dark/Light Theme Switching
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    // Apply the saved theme
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            themeToggle.checked = true;
        }
    }

    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    });
});



// Categorizing
document.addEventListener('DOMContentLoaded', function() {
    const articles = document.querySelectorAll('.article');

    function showArticlesByCategory(category) {
        articles.forEach(article => {
            if (category === 'all') {
                article.style.display = 'block';
            } else if (article.getAttribute('data-category') === category) {
                article.style.display = 'block';
            } else {
                article.style.display = 'none';
            }
        });
    }

    document.querySelectorAll('.category-button').forEach(button => {
        button.addEventListener('click', function() {
            showArticlesByCategory(this.getAttribute('data-category'));
        });
    });

    // Automatically show all articles when the page loads
    showArticlesByCategory('all');
});

//Article Count
document.addEventListener('DOMContentLoaded', function() {
    const articles = document.querySelectorAll('.article');
    const categoryButtons = document.querySelectorAll('.category-button');

    function countArticlesByCategory(category) {
        if (category === 'all') {
            return articles.length; // Return the count of all articles
        } else {
            return Array.from(articles).filter(article => 
                article.getAttribute('data-category') === category).length;
        }
    }

    categoryButtons.forEach(button => {
        const category = button.getAttribute('data-category');
        const count = countArticlesByCategory(category);
        button.textContent = category === 'all' ? `All Articles (${count})` : `${category} (${count})`;
    });
});

// Books Cards Animation
// This is "probably" IE9 compatible but will need some fallbacks for IE8
// - (event listeners, forEach loop)

// wait for the entire page to finish loading
window.addEventListener('load', function() {
    
    // setTimeout to simulate the delay from a real page load
    setTimeout(lazyLoad, 1000);
    
});

function lazyLoad() {
    var card_images = document.querySelectorAll('.card-image');
    
    // loop over each card image
    card_images.forEach(function(card_image) {
        var image_url = card_image.getAttribute('data-image-full');
        var content_image = card_image.querySelector('img');
        
        // change the src of the content image to load the new high res photo
        content_image.src = image_url;
        
        // listen for load event when the new photo is finished loading
        content_image.addEventListener('load', function() {
            // swap out the visible background image with the new fully downloaded photo
            card_image.style.backgroundImage = 'url(' + image_url + ')';
            // add a class to remove the blur filter to smoothly transition the image change
            card_image.className = card_image.className + ' is-loaded';
        });
        
    });
    
}

//estimated reading time for article
function calculateReadingTime() {
    // Get the text content of the <article> tag
    var articleText = document.querySelector('article').innerText;

    // Count the number of words in the article
    var wordCount = articleText.split(/\s+/).length;

    // Average reading speed: around 200-250 words per minute
    var wordsPerMinute = 200; // You can adjust this value

    // Calculate the reading time
    var readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);

    // Return the reading time
    return readingTimeMinutes;
}

// Call the function and write the reading time to the <span> element
var readingTime = calculateReadingTime();
document.getElementById('reading-time').innerText = readingTime + ' minute read';

// Disable Right Click on Image 
document.addEventListener('DOMContentLoaded', (event) => {
    var img = document.getElementById('noRightClickImg');
    
    img.addEventListener('contextmenu', function(e) {
        e.preventDefault();  // Prevents the default context menu from showing
        alert('Right click disabled on this image.'); // Optional: Alert the user
    }, false);
});
