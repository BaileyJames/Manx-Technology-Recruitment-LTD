let skillId
document.addEventListener('DOMContentLoaded', async function () {


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

document.getElementById('delete-skill-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    console.log(skillId)
    console.log(JSON.stringify(skillId))
    try {
        const response = await fetch('http://localhost:3000/delete-skill', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ _id: skillId }),
            credentials: 'include',
        });
        const message = await response.text();
        const responseMessageElement = document.getElementById('response-message');
        
        
        if (response.ok) {
            window.location.href = "/Admin/skills"
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