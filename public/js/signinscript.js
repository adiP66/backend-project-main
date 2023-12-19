
const togglebtn = document.getElementsByClassName('toggle-button')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]
const signinbtn = document.getElementById('signinbtn');
const memberbtn = document.getElementById('member-btn');


const title = document.getElementById('title');
const myForm = document.getElementById('my-form');
const closePopupButton = document.getElementById('closePopupButton');
const popup = document.getElementById('popup');
const logoutListItem = document.getElementById('logoutListItem');




myForm.addEventListener('submit', async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault(); 
   

    // Check if all required fields are filled
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password')
    



    
    {
    
        const formData = new FormData(myForm)   
        
        formData.append('email', emailInput.value);
        formData.append('password', passwordInput.value);
       

        
        let formDataObject = Object.fromEntries(formData.entries());
        let formDataJsonString = JSON.stringify(formDataObject);
        
        try {
            const response = await fetch('/signin', {
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
    
            console.log(responseData)

            
            console.log(responseData.message)
            if (response.ok) {
                if(responseData.message === "admin is logging in"){
                    window.location.href = "http://localhost:3000/"
                }
                else if(responseData.message === "member is logging in") {
                    // Redirect to index page
                    window.location.href = 'http://localhost:3000/'; // Change '/index' to your actual index page URL
                } 

                localStorage.setItem('key', 'session');
               

            }
            else if(responseData.message == "Password is wrong!"){
                alert('Password is wrong')
            }
            else if(responseData.message == "User doesn't exist"){
                alert("User doesn't exist")
            }


            
        } catch (error) {
            console.error(error);
            // Handle form submission error
        }
    }
    
  });


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






closePopupButton.addEventListener('click', () => {
    popup.style.display = 'none';
})








    


togglebtn.addEventListener('click', () => {
    navbarLinks.classList.toggle('active');
})




  


document.addEventListener('DOMContentLoaded', () => {
const signinForm = document.getElementById('my-form'); // Add an id to your form

// Clear input fields when the form is submitted
signinForm.addEventListener('submit', () => {
    clearInputFields();
});

// Function to clear input fields
function clearInputFields() {
    const inputFields = signinForm.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="checkbox"]');
    inputFields.forEach(input => {
        input.value = ''; // Clear the input value
    });
}
});






