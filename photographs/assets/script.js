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

// Photo Grid Animation Open/Close 
function openModal(element) {
    var modal = document.getElementById("myModal");
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");
    modal.style.display = "flex";
    modalImg.src = element.style.backgroundImage.slice(5, -2); // Removes 'url("")'
    captionText.innerHTML = element.getAttribute("data-caption"); // Set the caption
}

function closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

// When the user clicks anywhere on the modal (outside the image), close it
var modal = document.getElementById("myModal");
modal.addEventListener('click', function(event) {
    if (event.target === modal) {
        closeModal();
    }
});

// Event listener for modal image
var modalImg = document.getElementById("img01");

// Close the modal on left click
modalImg.addEventListener('click', function() {
    closeModal();
});

// Close the modal on right click
modalImg.addEventListener('contextmenu', function(event) {
    event.preventDefault(); // Prevent the default context menu
    closeModal();
    return false;
});



