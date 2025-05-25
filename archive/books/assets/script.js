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

// Books Cards Animation
// This is "probably" IE9 compatible but will need some fallbacks for IE8
// - (event listeners, forEach loop)

// wait for the entire page to finish loading
window.addEventListener('load', function() {
    
    // setTimeout to simulate the delay from a real page load
    setTimeout(lazyLoad, 200);
    
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




