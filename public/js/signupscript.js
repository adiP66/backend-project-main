
const togglebtn = document.getElementsByClassName('toggle-button')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]
const signupbtn = document.getElementById('signupbtn');
const memberbtn = document.getElementById('member-btn');


const namefield = document.getElementById('namefield');
const title = document.getElementById('title');
const myForm = document.getElementById('my-form');
const closePopupButton = document.getElementById('closePopupButton');
const popup = document.getElementById('popup');
const successPopup = document.getElementById('successPopup')
const closesuccessPopupButton = document.getElementById('closesuccessPopupButton')


myForm.addEventListener('submit', async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault(); 
   

    // Check if all required fields are filled
    const firstnameInput = document.getElementById('firstname');
    const lastnameInput = document.getElementById('lastname');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password')
    
    


    if (firstnameInput.value.trim() === '' && lastnameInput.value.trim() === '' && emailInput.value.trim() === '') {
        
      // If any of the required fields are empty, display an error message or take appropriate action
    //   alert('Please fill in all required fields.');
    } 
    else{
    
        const formData = new FormData(myForm)   
        formData.append('firstname', firstnameInput.value);
        formData.append('lastname', lastnameInput.value);
        formData.append('email', emailInput.value);
        formData.append('password', passwordInput.value);
        
        

        let formDataObject = Object.fromEntries(formData.entries());
        let formDataJsonString = JSON.stringify(formDataObject);
        
        try {
            const response = await fetch('/signup', {
                method: "POST",
    //Set the headers that specify you're sending a JSON body request and accepting JSON response
                headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                },
    // POST request body as JSON string.
                body: formDataJsonString,
            }); 
    
           
            const responseData = await response.json();

                if (responseData.errorMessage === "Email already in use") {
                    // Show the success popup
                    popup.style.display = 'flex';
                    
                     // Submit the form after successful response
                }
                else if(responseData.message === "Email created!"){
                    window.location.href = 'http://localhost:3000/introone';

                }
            
        } catch (error) {
            console.log(error);
            // Handle form submission error
        }
    }
    
  });





closePopupButton.addEventListener('click', () => {
      popup.style.display = 'none';
})



closesuccessPopupButton.addEventListener('click', () => {
    successPopup.style.display = 'none';
})








    


togglebtn.addEventListener('click', () => {
    navbarLinks.classList.toggle('active');
})




  


document.addEventListener('DOMContentLoaded', () => {
const signupForm = document.getElementById('my-form'); // Add an id to your form

// Clear input fields when the form is submitted
signupForm.addEventListener('submit', () => {
    clearInputFields();
});

// Function to clear input fields
function clearInputFields() {
    const inputFields = signupForm.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="checkbox"]');
    inputFields.forEach(input => {
        input.value = ''; // Clear the input value
    });
}
});






