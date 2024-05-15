// logout.js

function handleLogout() {
    // Assuming server-side route clears the session and cookies
    fetch('http://localhost:3000/logout', { method: 'POST' })
        .then(response => {
            // Check if logout was successful based on the response
            if (response.ok) {
                window.location.href = '/'; // Redirect to homepage
            } else {
                alert('Logout failed. Please try again.');
            }
        })
        .catch(error => console.error('Error:', error));
}
