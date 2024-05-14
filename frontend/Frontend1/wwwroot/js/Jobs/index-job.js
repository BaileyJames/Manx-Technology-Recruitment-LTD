async function loadJobs() {
    try {
        const response = await fetch('/api/jobs');

        if (response.ok) {
            const jobs = await response.json();
            const jobsList = document.querySelector('#jobs-list');

            // Clear any existing content
            jobsList.innerHTML = '';

            // Populate jobs
            jobsList.innerHTML = jobs.map(job => `
                <tr>
                    <td>${job.title}</td>
                    <td>${job.description}</td>
                    <td>${job.schedule}</td>
                    <td>${job.location}</td>
                    <td>${job.postDate}</td>
                    <td>${job.salary}</td>
                    <td>${job.deadline}</td>
                    <td>${job.desiredSkills.join(', ')}</td>
                    <td>${job.industry}</td>
                    <td>
                        <a href="/Admin/Jobs/Edit?id=${job.id}">Edit</a>
                        <a href="/Admin/Jobs/Remove?id=${job.id}">Remove</a>
                    </td>
                </tr>
            `).join('');
        } else {
            const error = await response.json();
            alert(`Failed to load jobs: ${error.message || response.statusText}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while loading jobs. Please try again later.');
    }
}

document.addEventListener('DOMContentLoaded', loadJobs);
