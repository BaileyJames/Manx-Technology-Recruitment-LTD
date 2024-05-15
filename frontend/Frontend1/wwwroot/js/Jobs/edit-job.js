﻿document.addEventListener('DOMContentLoaded', async function() {

    let jobId
    const searchParams = new URLSearchParams(window.location.search);
    for (const param of searchParams) {
        jobId = param[1]
    }
    console.log("jobId = " + jobId)
    

    try {
        let jobData;

        fetch("http://localhost:3000/jobs?_id=" + jobId, {
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
                document.getElementById('_id').value = jobId
                document.getElementById('title').value = data.title || '';
                document.getElementById('description').value = data.description || '';
                document.getElementById('schedule').value = data.schedule || '';
                document.getElementById('location').value = data.location || '';
                document.getElementById('postDate').value = data.postDate ? data.postDate.split('T')[0] : '';
                document.getElementById('salary').value = data.salary || '';
                document.getElementById('deadline').value = data.deadline ? data.deadline.split('T')[0] : '';
                document.getElementById('desiredSkills').value = data.desiredSkills ? data.desiredSkills.join(', ') : '';
                document.getElementById('companyId').value = data.companyId || '';
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        
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
    jobData.a
    formData.forEach((value, key) => {
        if (key === 'desiredSkills') {
            jobData[key] = value.split(',').map(skill => skill.trim());
        } else {
            jobData[key] = value;
        }
    });
    console.log(jobData)
    try {
        const response = await fetch('http://localhost:3000/update-job', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jobData),
            credentials: 'include',
        });
        console.log("poo")
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
