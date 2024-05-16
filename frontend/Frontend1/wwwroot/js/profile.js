document.addEventListener("DOMContentLoaded", function () {
    // Load profile data from cookies
    loadProfileFromCookies();
    setTimeout(fetchUserData, 500);

    // Save profile to cookies
    document.querySelector(".save-btn").addEventListener("click", function () {
        saveProfileToCookies();
        alert("Profile saved successfully!");
    });

    // Handle file uploads
    document.getElementById("profilePicture").addEventListener("change", function (event) {
        uploadDocument(event.target.files[0], 'profilePicture');
    });

    document.getElementById("cv").addEventListener("change", function (event) {
        uploadDocument(event.target.files[0], 'cv');
    });

    document.getElementById("certificates").addEventListener("change", function (event) {
        uploadDocument(event.target.files[0], 'certificates');
    });
});

function fetchUserData() {
    const authToken = getCookie('authToken');
    if (!authToken) {
        console.error('Auth token not found');
        return;
    }

    fetch("http://localhost:3000/user", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`
        },
        credentials: 'include',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("User data fetched:", data);
            document.getElementById("firstName").value = data.firstName || "";
            document.getElementById("lastName").value = data.lastName || "";
            document.getElementById("dateOfBirth").value = data.dateOfBirth || "";
            document.getElementById("address").value = data.address || "";
            document.getElementById("phoneNumber").value = data.phoneNumber || "";
        })
        .catch(error => console.error("Error fetching user data:", error));
}

function saveProfileToCookies() {
    const profileData = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        dateOfBirth: document.getElementById("dateOfBirth").value,
        address: document.getElementById("address").value,
        phoneNumber: document.getElementById("phoneNumber").value,
    };

    console.log("Saving profile data to cookies:", profileData);
    document.cookie = `profileData=${JSON.stringify(profileData)};path=/;`;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(";").shift();
    } else {
        console.log(`Cookie named ${name} not found.`);
        return null;
    }
}


function loadProfileFromCookies() {
    const profileData = getCookie("profileData");
    console.log("Loading profile data from cookies:", profileData);
    if (profileData) {
        const data = JSON.parse(profileData);
        document.getElementById("firstName").value = data.firstName || "";
        document.getElementById("lastName").value = data.lastName || "";
        document.getElementById("dateOfBirth").value = data.dateOfBirth || "";
        document.getElementById("address").value = data.address || "";
        document.getElementById("phoneNumber").value = data.phoneNumber || "";
    }
}


// This doesnt work yet
function uploadDocument(file, fieldName) {
    const authToken = getCookie('authToken');
    console.log(`Auth Token on upload: ${authToken}`); // Debug log

    if (!authToken) {
        console.error('Auth token not found');
        return;
    }

    const formData = new FormData();
    formData.append('document', file);

    console.log(`Uploading ${file.name} to the server...`); // More detailed log
    fetch('http://localhost:3000/documents', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authToken}`
        },
        body: formData,
        credentials: 'include',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`File upload failed: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            console.log(data);
            alert('File uploaded successfully');
        })
        .catch(error => {
            console.error('Error uploading file:', error);
            alert('Error uploading file');
        });
}
