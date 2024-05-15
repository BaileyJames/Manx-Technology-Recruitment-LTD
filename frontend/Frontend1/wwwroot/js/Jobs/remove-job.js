document.querySelector('#remove-job-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const id = document.querySelector('#id').value.trim();

    if (!id) {
        alert('Job ID is required to delete the job.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/Jobs`, {
            method: 'DELETE',
        });

        if (response.ok) {
            window.location.href = '/Admin/Jobs/Index';
        } else {
            const error = await response.json();
            alert(`Failed to delete job: ${error.message || response.statusText}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the job. Please try again later.');
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
            document.querySelector('#job-title').textContent = job.title;
            document.querySelector('#job-description').textContent = job.description;
            document.querySelector('#job-schedule').textContent = job.schedule;
            document.querySelector('#job-location').textContent = job.location;
            document.querySelector('#job-postDate').textContent = job.postDate;
            document.querySelector('#job-salary').textContent = job.salary;
            document.querySelector('#job-deadline').textContent = job.deadline;
            document.querySelector('#job-desiredSkills').textContent = job.desiredSkills.join(', ');
            document.querySelector('#job-industry').textContent = job.industry;
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
