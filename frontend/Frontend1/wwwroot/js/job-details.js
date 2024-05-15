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
        const response = await fetch(`/api/jobs/${id}`); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const job = await response.json();
        document.getElementById('job-title').textContent = job.title;
    } catch (error) {
        console.error('Failed to load job details:', error);
    }
}

function useUploadedCV() {
    alert("Function to use uploaded CV goes here.");
}

function selectUploadedFiles() {
    alert("Function to select uploaded files goes here.");
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(document.getElementById('application-form'));
    const coverLetterText = document.getElementById('coverLetter').value;
    const coverLetterFile = document.getElementById('coverLetterFile').files[0];
    const cvFile = document.getElementById('cvFile').files[0];
    const otherFiles = document.getElementById('otherFiles').files;

    formData.append('CoverLetterText', coverLetterText);
    if (coverLetterFile) formData.append('CoverLetterFile', coverLetterFile);
    if (cvFile) formData.append('CVFile', cvFile);
    for (let file of otherFiles) {
        formData.append('OtherFiles', file);
    }

    try {
        const response = await fetch('/api/applications', {  
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Application submitted successfully!');
            window.location.href = '/Jobs/Index';
        } else {
            alert('Failed to submit application.');
        }
    } catch (error) {
        console.error('Failed to submit application:', error);
        alert('Failed to submit application.');
    }
}
