const togglebtn = document.getElementsByClassName('toggle-button')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]
const logoutListItem = document.getElementById('logoutListItem');


togglebtn.addEventListener('click', () => {
    navbarLinks.classList.toggle('active')
})


function logout(){
    const jwtToken = localStorage.getItem('jwt')
    

    if(jwtToken){
        logoutListItem.style.display = 'block';
    }
    else {
        // Token doesn't exist, user is logged out
        logoutListItem.style.display = 'none';
    }
}