document.addEventListener('DOMContentLoaded', async function() {

    let skillId
    const searchParams = new URLSearchParams(window.location.search);
    for (const param of searchParams) {
        skillId = param[1]
    }
    console.log("skillId = " + skillId)
    

    try {
        let skillData;

        fetch("http://localhost:3000/skills?_id=" + skillId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data)
                document.getElementById('_id').value = skillId
                document.getElementById('name').value = data.name || '';
                document.getElementById('description').value = data.description || '';
                console.log("")
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        
    } catch (error) {
        console.error('Error loading skill details:', error);
        document.getElementById('response-message').innerText = 'Error loading skill details';
        document.getElementById('response-message').style.color = 'red';
    }
});

document.getElementById('update-skill-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const skillData = {};
    skillData.a
    formData.forEach((value, key) => {
            skillData[key] = value;
    });
    try {
        const response = await fetch('http://localhost:3000/update-skill', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(skillData),
            credentials: 'include',
        });
        const message = await response.text();
        const responseMessageElement = document.getElementById('response-message');
        
        if (response.ok) {
            responseMessageElement.innerText = message;
            responseMessageElement.style.color = 'green';
        } else {
            responseMessageElement.innerText = message;
            responseMessageElement.style.color = 'red';
        }
        
    } catch (error) {
        console.error('Error updating skill:', error);
        document.getElementById('response-message').innerText = 'An error occurred while updating the skill.';
        document.getElementById('response-message').style.color = 'red';
    }
});
