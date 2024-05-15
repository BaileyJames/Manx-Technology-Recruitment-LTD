document.addEventListener('DOMContentLoaded', async function() {
    const jobId = document.getElementById('id').value;

    try {
        const response = await fetch(`http://localhost:3000/jobs/${jobId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch job details');
        }

        const jobData = await response.json();

        document.getElementById('title').value = jobData.title || '';
        document.getElementById('description').value = jobData.description || '';
        document.getElementById('schedule').value = jobData.schedule || '';
        document.getElementById('location').value = jobData.location || '';
        document.getElementById('postDate').value = jobData.postDate ? jobData.postDate.split('T')[0] : '';
        document.getElementById('salary').value = jobData.salary || '';
        document.getElementById('deadline').value = jobData.deadline ? jobData.deadline.split('T')[0] : '';
        document.getElementById('desiredSkills').value = jobData.desiredSkills ? jobData.desiredSkills.join(', ') : '';
        document.getElementById('companyId').value = jobData.companyId || '';
    } catch (error) {
        console.error('Error loading job details:', error);
        document.getElementById('response-message').innerText = 'Error loading job details';
        document.getElementById('response-message').style.color = 'red';
    }
});

document.getElementById('update-job-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const jobData = {};
    formData.forEach((value, key) => {
        if (key === 'desiredSkills') {
            jobData[key] = value.split(',').map(skill => skill.trim());
        } else {
            jobData[key] = value;
        }
    });

    try {
        const response = await fetch('http://localhost:3000/update-job', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jobData),
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
        console.error('Error updating job:', error);
        document.getElementById('response-message').innerText = 'An error occurred while updating the job.';
        document.getElementById('response-message').style.color = 'red';
    }
});
