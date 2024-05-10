document.getElementById("registrationForm").addEventListener("submit", function(event) {
    event.preventDefault(); 

    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var password1 = document.getElementById("password1").value;
    var password2 = document.getElementById("password2").value;


    if (password1 !== password2) {
        alert("Passwords do not match.");
        return; 
    }

    
    var userData = {
        username: username,
        email: email,
        password: password1
    };

    
    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => {
            if (response.ok) {
                return response.json(); 
            } else {
                throw new Error('Failed to register');
            }
        })
        .then(data => {
            alert('Successfully registered!');
            window.location.href = '/'; 
        })
        .catch(error => {
            alert(error.message); 
        });
});
