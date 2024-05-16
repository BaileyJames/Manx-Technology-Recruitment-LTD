document.addEventListener('DOMContentLoaded', (event) => {
    loadJobs().catch(error => {
        console.error('Failed to load jobs:', error);
        alert('Failed to load jobs');
    });
});

async function loadJobs() {
    try {
        const response = await fetch('http://localhost:3000/jobs');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jobs = await response.json();
        const jobsList = document.querySelector('#jobs-list');
        jobsList.innerHTML = jobs.map(job => `
            <tr>
                <td>${job.title}</td>
                <td>${job.description}</td>
                <td>${job.schedule}</td>
                <td>${job.location}</td>
                <td>${new Date(job.postDate).toLocaleDateString()}</td>
                <td>${job.salary}</td>
                <td>${new Date(job.deadline).toLocaleDateString()}</td>
                 <td>${job.desiredSkills}</td>
                <td>${job.industry}</td>
                <td>
                    <a href="/Admin/Jobs/Edit?id=${job._id}">Edit</a>
                    <a href="/Admin/Jobs/Remove?id=${job._id}">Remove</a>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        throw error;
    }
}
