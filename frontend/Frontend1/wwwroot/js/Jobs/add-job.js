document.querySelector('#add-job-form').addEventListener('submit', async function(event) {
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
        industry: form.industry.value.trim()
    };

    // validation
    for (const [key, value] of Object.entries(jobData)) {
        if (!value) {
            alert(`Please fill in the ${key} field.`);
            return;
        }
    }

    try {
        const response = await fetch('/api/jobs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jobData)
        });

        if (response.ok) {
            window.location.href = '/Admin/Jobs/Index';
        } else {
            const error = await response.json();
            alert(`Failed to add job: ${error.message || response.statusText}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the job. Please try again later.');
    }
});
