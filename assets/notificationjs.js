function launch_toast() {
    var x = document.getElementById("new-notification")
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);
}

launch_toast()

// Print Today's Date
document.addEventListener('DOMContentLoaded', function() {
            const today = new Date();
            const day = today.getDate();
            const monthIndex = today.getMonth();
            const year = today.getFullYear();
            const monthNames = ["January", "February", "March", "April", "May", "June",
                                "July", "August", "September", "October", "November", "December"];
            const formattedDate = `${monthNames[monthIndex]} ${day}, ${year}`;
            document.getElementById('current-date').textContent = formattedDate;
});