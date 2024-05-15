/* Login JS */
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('form').addEventListener('submit', function(event) {
        event.preventDefault();

        const loginData = {
            username: document.querySelector('input[name="username"]').value,
            password: document.querySelector('input[name="password"]').value
        };

        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
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
                    window.location.href = '/admin/admin-dashboard';
                } else {
                    // Redirect to home page for regular users
                    alert("Successfully logged in!");
                    window.location.href = '/index';
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert("Login failed. Please check your credentials and try again.");
            });
    });
});
        
