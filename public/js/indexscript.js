const togglebtn = document.getElementsByClassName('toggle-button')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]
const logoutListItem = document.getElementById('logoutListItem');
const feedbackButton = document.getElementById('feedback-button');
const feedbackForm = document.getElementById('feedback-form');
const cancelButton = document.getElementById('cancel-feedback');
const darkmodeButton = document.getElementById('dark-mode')
const navbar = document.getElementById('navbar');
const navbarAnchorLinks = document.querySelectorAll(".navbar-links a");
const logodiv = document.getElementById('logodiv')







const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((e1) => observer.observe(e1));





togglebtn.addEventListener('click', () => {
    navbarLinks.classList.toggle('active')
})

feedbackButton.addEventListener('click', () => {
    console.log(123);
    feedbackForm.style.display = 'block';
});

cancelButton.addEventListener('click', () => {
    feedbackForm.style.display = 'none';
});



AOS.init();