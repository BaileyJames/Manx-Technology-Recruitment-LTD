document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('form').addEventListener('submit', async function(event) {
        event.preventDefault();

        // Extract form values
        const form = event.target;
        const jobData = {
            title: form.title.value.trim(),
            description: form.description.value.trim(),
            schedule: form.schedule.value.trim(),
            location: form.location.value.trim(),
            postDate: form.postDate.value.trim(),
            salary: form.salary.value.trim(),
            deadline: form.deadline.value.trim(),
            desiredSkills: form.desiredSkills.value.split(',').map(skill => skill.trim()),
        };

        // validation
        for (const [key, value] of Object.entries(jobData)) {
            if (!value) {
                alert(`Please fill in the ${key} field.`);
                return;
            }
        }

        console.log("Job Data to be sent:", jobData); // log for debugging ignore

        try {
            const response = await fetch('http://localhost:3000/add-job', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jobData),
                credentials: 'include',
            });

            if (response.ok) {
                const responseData = await response.text();
                console.log("Server Response:", responseData);
                alert("Successfully added the job!");
                window.location.href = '/Admin/Jobs/Index';
            } else {
                const error = await response.text();
                console.error("Failed to add job:", error);
                alert(`Failed to add job: ${error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the job. Please try again later.');
        }
    });
});
