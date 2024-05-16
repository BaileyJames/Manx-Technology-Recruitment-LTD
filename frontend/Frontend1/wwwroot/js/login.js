/* Login JS */
let captchaValues = ["UIhmA", "YXFTE", "CbLpr", "QoMXa", "HgPTb", "RmKFv", "MLjyA", "3DJzq", "Up7XC", "L2qAi"]
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('form').addEventListener('submit', function(event) {
        event.preventDefault();

        let captchaId = document.querySelector('input[name=captcha]').id
        captchaId = captchaId - 1;
        if (document.querySelector('input[name=captcha]').value != captchaValues[captchaId]) {
            alert("CAPTCHA is incorrect, please try again")
            window.location.href = '/login'
            return null;
        }


        const loginData = {
            username: document.querySelector('input[name="username"]').value,
            email: document.getElementById('email').value,
            password: document.querySelector('input[name="password"]').value
        };

        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                
            },
            body: JSON.stringify(loginData),
            credentials: 'include',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                if (data.privilege && data.privilege === 1) {
                    // Redirect to admin dashboard if user is an admin
                    alert("Admin logged in successfully!");
                    window.location.href = '/index';
                    
                } else {
                    // Redirect to home page for regular users
                    alert("Successfully logged in!");
                    window.location.href = '/index';
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert("Login failed. Please check your credentials and try again.");
                window.location.href = '/login'
            });
    });
});
        
