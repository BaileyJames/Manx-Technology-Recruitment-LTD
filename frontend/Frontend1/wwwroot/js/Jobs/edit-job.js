document.querySelector('#edit-job-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const id = document.querySelector('#id').value.trim();

    const jobData = {
        title: document.querySelector('#title').value.trim(),
        description: document.querySelector('#description').value.trim(),
        schedule: document.querySelector('#schedule').value.trim(),
        location: document.querySelector('#location').value.trim(),
        postDate: document.querySelector('#postDate').value.trim(),
        salary: document.querySelector('#salary').value.trim(),
        deadline: document.querySelector('#deadline').value.trim(),
        desiredSkills: document.querySelector('#desiredSkills').value.split(',').map(skill => skill.trim()), 
        industry: document.querySelector('#industry').value.trim()
    };

    // validation
    for (const [key, value] of Object.entries(jobData)) {
        if (!value) {
            alert(`Please fill in the ${key} field.`);
            return;
        }
    }

    try {
        const response = await fetch(`http://localhost:3000/Jobs`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jobData)
        });

        if (response.ok) {
            window.location.href = '/Admin/Jobs/Index';
        } else {
            const error = await response.json();
            alert(`Failed to update job: ${error.message || response.statusText}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating the job. Please try again later.');
    }
});

async function loadJob() {
    const id = document.querySelector('#id').value.trim();

    if (!id) {
        alert('No job ID found.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/Jobs`);

        if (response.ok) {
            const job = await response.json();
            document.querySelector('#title').value = job.title;
            document.querySelector('#description').value = job.description;
            document.querySelector('#schedule').value = job.schedule;
            document.querySelector('#location').value = job.location;
            document.querySelector('#postDate').value = job.postDate;
            document.querySelector('#salary').value = job.salary;
            document.querySelector('#deadline').value = job.deadline;
            document.querySelector('#desiredSkills').value = job.desiredSkills.join(', '); 
            document.querySelector('#industry').value = job.industry;
        } else {
            const error = await response.json();
            alert(`Failed to load job: ${error.message || response.statusText}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while loading the job. Please try again later.');
    }
}

document.addEventListener('DOMContentLoaded', loadJob);
