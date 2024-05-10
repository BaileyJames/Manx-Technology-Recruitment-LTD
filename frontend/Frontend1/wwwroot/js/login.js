document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");
    form.addEventListener("submit", function(event) {
        event.preventDefault(); 

        
        const loginData = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

     
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
            .then(response => response.json()) 
            .then(data => {
                console.log('Success:', data);
                alert("Successfully logged in!");
                window.location.href = '/home'; 
            })
            .catch((error) => {
                console.error('Error:', error);
                alert("Login failed. Please check your credentials and try again.");
            });
    });
});
