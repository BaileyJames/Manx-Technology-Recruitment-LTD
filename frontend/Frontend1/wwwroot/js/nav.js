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
            const userMenu = document.getElementById('user-menu');
            const debugInfo = document.getElementById('debug-info');

            if (user && user.privilege === 1) {
                document.getElementById('admin-dashboard').style.display = 'block';
                debugInfo.innerHTML = `<p>User is authenticated with admin privileges</p><p>User name: ${user.username}</p>`;
                userMenu.innerHTML = `
                <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#logoutModal">Logout</a></li>
            `;
            } else if (user) {
                userMenu.innerHTML = `
                <li><a class="dropdown-item" href="/Profile">Profile</a></li>
                <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#logoutModal">Logout</a></li>
            `;
            } else {
                userMenu.innerHTML = `
                <li><a class="dropdown-item" href="/Login">Login</a></li>
                <li><a class="dropdown-item" href="/Register">Register</a></li>
            `;
            }
        })
        .catch(error => {
            console.error('Error fetching user:', error);
            const userMenu = document.getElementById('user-menu');
            userMenu.innerHTML = `
            <li><a class="dropdown-item" href="/Login">Login</a></li>
            <li><a class="dropdown-item" href="/Register">Register</a></li>
        `;
        });
});
