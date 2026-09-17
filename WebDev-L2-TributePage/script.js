// Smooth scrolling for navigation links

const navigationLinks = document.querySelectorAll(
    '.header nav a'
);

navigationLinks.forEach(function (link) {

    link.addEventListener('click', function (event) {

        event.preventDefault();

        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {

            targetSection.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

});


// Simple scroll effect for the header

const header = document.querySelector('.header');

window.addEventListener('scroll', function () {

    if (window.scrollY > 50) {
        header.style.boxShadow =
            "0 5px 20px rgba(0, 0, 0, 0.08)";
    } else {
        header.style.boxShadow = "none";
    }

});