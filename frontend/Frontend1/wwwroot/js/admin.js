document.addEventListener("DOMContentLoaded", function () {
    fetch('http://localhost:3000/user', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.status === 401) {
                // User is not authenticated
                return null;
            }
            return response.json();
        })
        .then(user => {

            if (user && user.privilege === 1) {

            } else if (user) {
                window.location.href = "/../"
            } else {
                window.location.href = "/../"
            }
        })
        .catch(error => {
            window.location.href = "/../"
        });
});