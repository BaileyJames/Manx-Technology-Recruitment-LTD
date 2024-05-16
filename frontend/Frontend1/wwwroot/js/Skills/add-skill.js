document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('form').addEventListener('submit', async function(event) {
        event.preventDefault();

        // Extract form values
        const form = event.target;
        const skillData = {
            name: form.name.value.trim(),
            description: form.description.value.trim(),
        };

        // validation
        for (const [key, value] of Object.entries(skillData)) {
            if (!value) {
                alert(`Please fill in the ${key} field.`);
                return;
            }
        }

        console.log("Skill Data to be sent:", skillData); // log for debugging ignore

        try {
            const response = await fetch('http://localhost:3000/add-skill', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(skillData),
                credentials: 'include',
            });

            if (response.ok) {
                const responseData = await response.text();
                console.log("Server Response:", responseData);
                alert("Successfully added the Skill!");
                window.location.href = '/Admin/Skills/Index';
            } else {
                const error = await response.text();
                console.error("Failed to add skill:", error);
                alert(`Failed to add skill: ${error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the skill. Please try again later.');
        }
    });
});
