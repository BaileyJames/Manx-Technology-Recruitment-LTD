
let captchaValues = ["UIhmA", "YXFTE", "CbLpr", "QoMXa", "HgPTb", "RmKFv", "MLjyA", "3DJzq", "Up7XC", "L2qAi"]
let currentPwValue = -1;

function randomPassword() {
    var passwordLength = 15
    var characters = "abcdefghjklmnpqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ123456789@$£!%*?&"
    var genPassword = ""
    var validPassword = false

    do { 
        genPassword = ""
        for (var i = 0; i < passwordLength; i++) {
        let randNum = Math.floor(Math.random() * characters.length)
        genPassword += characters.charAt(randNum)
        }
        validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$£!%*?&])[A-Za-z\d@$£!%*?&]{12,}$/.test(genPassword)
    } while (!validPassword)
    
    alert("Generated Password: " + genPassword);
    return
}


let password = document.getElementById("password1")
let power = document.getElementById("power-point")
password.oninput = function () {
    console.log(password.value)
    let point = -1
    let value = password.value;
    let width =
        ["1%", "25%", "50%", "75%", "100%"];
    let color =
        ["#D73F40", "#DC6551", "#F2B84F", "#BDE952", "#3ba62f"];
        
        let arrayTest =
            [/[a-z]/, /[A-Z]/, /\d/, /[@$£!%*?&]/, /[A-Za-z\d@$£!%*?&]{12,}/];

        for (var i = 0; i < arrayTest.length; i++) {
            if (arrayTest[i].test(value)) {
                point += 1;
                switch (i) {
                    case 0:
                        document.getElementById("LC").className = "hide"
                        break;
                    case 1:
                        document.getElementById("UC").className = "hide"
                        break;
                    case 2:
                        document.getElementById("Num").className = "hide"
                        break;
                    case 3:
                        document.getElementById("SC").className = "hide"
                        break;
                    case 4:
                        document.getElementById("Twelve").className = "hide"
                        break;
                    default:
                        break;
                }
            }
            else {
                switch (i) {
                    case 0:
                        document.getElementById("LC").className = ""
                        break;
                    case 1:
                        document.getElementById("UC").className = ""
                        break;
                    case 2:
                        document.getElementById("Num").className = ""
                        break;
                    case 3:
                        document.getElementById("SC").className = ""
                        break;
                    case 4:
                        document.getElementById("Twelve").className = ""
                        break;
                    default:
                        break;
                }
            }
    };
        currentPwValue = point
    if (currentPwValue == 4) {
        document.getElementById("Reqs").className = "hide"
    }
    else {
        document.getElementById("Reqs").className = "passwordRequirements red"
    }
    power.style.width = width[point];
    power.style.backgroundColor = color[point];
};




document.addEventListener("DOMContentLoaded", function () {


    document.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault();

        var username = document.getElementById("username").value;
        var email = document.getElementById("email").value;
        var password1 = document.getElementById("password1").value;
        var password2 = document.getElementById("password2").value;

        let captchaId = document.querySelector('input[name=captcha]').id
        captchaId = captchaId - 1;
        if (document.querySelector('input[name=captcha]').value != captchaValues[captchaId]) {
            alert("CAPTCHA is incorrect, please try again")
            window.location.href = '/register'
            return null;
        }

        if (username.length < 6) {
            alert("Username is too short.")
            return;
        }


        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!emailRegex.test(email)) {
            alert("Email is not in the correct format.")
            return;
        }

        if (password1 !== password2) {
            alert("Passwords do not match.");
            return;
        }

        if (currentPwValue != 4) {
            alert("Password is not strong enough!")
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
            body: JSON.stringify(userData),
            credentials: 'include'
        })
            .then(response => {
                if (response.ok) {
                    return response;
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
});
