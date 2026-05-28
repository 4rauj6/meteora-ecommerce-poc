const openNavbarOnMobile = document.querySelector('.open-navbar-button');
const navbarLinks = document.querySelector('.sidebar-links');
const searchBox = document.querySelector('.search-box-container');
const icon = document.querySelector('.open-navbar-button i');

if (openNavbarOnMobile && icon && navbarLinks) {
    openNavbarOnMobile.addEventListener('click', function () {
        navbarLinks.classList.toggle('active');
        searchBox.classList.toggle('active');

        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
    });
}
