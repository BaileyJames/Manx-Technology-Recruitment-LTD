document.addEventListener('DOMContentLoaded', function () {
    const jobId = getJobIdFromUrl();
    loadJobDetails(jobId);
    document.getElementById('application-form').addEventListener('submit', handleFormSubmit);
});

function getJobIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

async function loadJobDetails(id) {
    try {
        const response = await fetch(`http://localhost:3000/jobs`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const job = await response.json();
        const jobDetails = Array.isArray(job) ? job[0] : job;

        document.getElementById('job-title').textContent = jobDetails.title.trim();
        document.getElementById('job-description').textContent = jobDetails.description.trim();
        document.getElementById('job-salary').textContent = `Salary: ${jobDetails.salary.trim()}`;
        document.getElementById('job-working-hours').textContent = `Working Hours: ${jobDetails.schedule.trim()}`;
        document.getElementById('job-location').textContent = `Location: ${jobDetails.location.trim()}`;
        document.getElementById('job-post-date').textContent = `Post Date: ${jobDetails.postDate.trim()}`;
        document.getElementById('job-deadline').textContent = `Deadline: ${jobDetails.deadline.trim()}`;
        
        const jobRequirements = document.getElementById('job-requirements');
        jobRequirements.innerHTML = '';
        jobDetails.desiredSkills.forEach(skill => {
            const li = document.createElement('li');
            li.textContent = skill;
            jobRequirements.appendChild(li);
        });

        // apply button
        document.getElementById('apply-button').onclick = function() {
            location.href = `/jobs/apply/${jobDetails._id}`;
        };

    } catch (error) {
        console.error('Failed to load job details:', error);
    }
}
