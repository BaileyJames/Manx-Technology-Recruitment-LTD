document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:3000/user", {
        method: 'GET',
        headers: {
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
            document.getElementById("_id").value = data._id
            document.getElementById("email").value = data.email
            document.getElementById("username").value = data.username
            document.getElementById("firstName").value = data.firstName || "";
            document.getElementById("lastName").value = data.lastName || "";
            document.getElementById("address").value = data.address || "";
            document.getElementById("phone").value = data.phone || "";
            console.log("haahahahahahhahahah")
        })
        .catch(error => console.error("Error fetching user data:", error));


    // Handle file uploads
    document.getElementById("document").addEventListener("change", function (event) {
        uploadDocument(event.target.files[0], 'document');
    });

    document.getElementById("cv").addEventListener("change", function (event) {
        uploadDocument(event.target.files[0], 'cv');
    });

    document.getElementById("certificates").addEventListener("change", function (event) {
        uploadDocument(event.target.files[0], 'certificates');
    });
});
document.getElementById('update-profile-form').addEventListener('submit', async function (event) {
    event.preventDefault();


    const userData = {
        _id: document.getElementById("_id").value,
        email: document.getElementById("email").value,
        username: document.getElementById("username").value,
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        phone: document.getElementById("phone").value
    };

    console.log(userData)
    try {
        const response = await fetch('http://localhost:3000/update-user', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData),
            credentials: 'include',
        });
        const responseMessageElement = document.getElementById('response-message');

        if (response.ok) {
            console.log(response)
            alert("Profile saved successfully!");
            location.reload()
        }
        else {
            alert("no again")
            console.log("oka")
            console.log(response)
        }

    } catch (error) {
        alert("no")
        console.error('Error updating user:', error);
    }
});

function uploadDocument(file, file_name) {

    const formData = new FormData();
    formData.append('document', file);

    console.log(`Uploading ${file.name} to the server...`);
    fetch('http://localhost:3000/documents', {
        method: 'POST',
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
