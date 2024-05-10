document.getElementById("registrationForm").addEventListener("submit", function(event) {
    var password1 = document.getElementById("password1").value;
    var password2 = document.getElementById("password2").value;

    if (password1 !== password2) {
        alert("Passwords do not match.");
        event.preventDefault(); 
    }
});
