const openNavbarOnMobile = document.querySelector('.open-navbar-button');

const navbarLinks = document.querySelector('.navbar-links');

const searchBox = document.querySelector('.search-box-container');
const button = document.querySelector('.fa-bars');

openNavbarOnMobile.addEventListener('click', function () {
    navbarLinks.classList.toggle('active');

    searchBox.classList.toggle('active');
    button.classList.toggle('fa-xmark');
});
