document.addEventListener('DOMContentLoaded', function() {
    const useUploadedCVButton = document.getElementById('useUploadedCVButton');
    const selectUploadedFilesButton = document.getElementById('selectUploadedFilesButton');
    const applicationForm = document.getElementById('application-form');
    const applyButton = document.getElementById('applyButton');
    const coverLetterFileInput = document.getElementById('coverLetterFile');
    const cvFileInput = document.getElementById('cvFile');
    const otherFilesInput = document.getElementById('otherFiles');

    let coverLetterCompleted = false;
    let cvCompleted = false;

    if (useUploadedCVButton) {
        useUploadedCVButton.addEventListener('click', useUploadedCV);
    }

    if (selectUploadedFilesButton) {
        selectUploadedFilesButton.addEventListener('click', selectUploadedFiles);
    }

    if (coverLetterFileInput) {
        coverLetterFileInput.addEventListener('change', function() {
            if (coverLetterFileInput.files.length > 0) {
                coverLetterCompleted = true;
                document.getElementById('coverLetterStatus').innerHTML = 'Cover letter file uploaded.';
            } else {
                coverLetterCompleted = false;
                document.getElementById('coverLetterStatus').innerHTML = '';
            }
            checkCompletionStatus();
        });
    }

    if (cvFileInput) {
        cvFileInput.addEventListener('change', function() {
            if (cvFileInput.files.length > 0) {
                cvCompleted = true;
                document.getElementById('cvStatus').innerHTML = 'CV file uploaded.';
            } else {
                cvCompleted = false;
                document.getElementById('cvStatus').innerHTML = '';
            }
            checkCompletionStatus();
        });
    }

    if (applicationForm) {
        applicationForm.addEventListener('submit', handleFormSubmit);
    }

    async function fetchDocuments() {
        try {
            let response = await fetch('http://localhost:3000/documents', {
                method: 'GET',
                credentials: 'include' // Include credentials for cookies
            });
            if (response.ok) {
                let files = await response.json();
                return files;
            } else {
                console.error('Error fetching documents');
            }
        } catch (error) {
            console.error('Fetch error: ', error);
        }
        return [];
    }

    async function useUploadedCV() {
        let files = await fetchDocuments();
        if (files.length > 0) {
            let fileSelection = prompt(`Available CV files:\n${files.join('\n')}\n\nEnter the file name you want to use:`);
            if (fileSelection && files.includes(fileSelection)) {
                const cvSelectionElement = document.getElementById('cvSelection');
                if (cvSelectionElement) {
                    cvSelectionElement.textContent = `You selected: ${fileSelection}`;
                } else {
                    document.getElementById('useUploadedCVButton').insertAdjacentHTML('afterend', `<p id="cvSelection">You selected: ${fileSelection}</p>`);
                }
                cvCompleted = true;
                document.getElementById('cvStatus').innerHTML = 'CV file selected.';
            } else {
                alert('Invalid selection');
            }
        } else {
            alert('No uploaded CV files found');
        }
        checkCompletionStatus();
    }

    async function selectUploadedFiles() {
        let files = await fetchDocuments();
        if (files.length > 0) {
            let fileSelection = prompt(`Available files:\n${files.join('\n')}\n\nEnter the file names you want to use (comma separated):`);
            if (fileSelection) {
                let selectedFiles = fileSelection.split(',').map(file => file.trim()).filter(file => files.includes(file));
                if (selectedFiles.length > 0) {
                    const fileSelectionElement = document.getElementById('fileSelection');
                    if (fileSelectionElement) {
                        fileSelectionElement.textContent = `You selected: ${selectedFiles.join(', ')}`;
                    } else {
                        document.getElementById('selectUploadedFilesButton').insertAdjacentHTML('afterend', `<p id="fileSelection">You selected: ${selectedFiles.join(', ')}</p>`);
                    }
                    document.getElementById('otherFilesStatus').innerHTML = 'Other files selected.';
                } else {
                    alert('Invalid selection');
                }
            } else {
                alert('No files selected');
            }
        } else {
            alert('No uploaded files found');
        }
    }

    function checkCompletionStatus() {
        if ((coverLetterCompleted || coverLetterFileInput.files.length > 0 || document.getElementById('coverLetter').value.trim() !== '') &&
            (cvCompleted || cvFileInput.files.length > 0)) {
            applyButton.disabled = false;
        } else {
            applyButton.disabled = true;
        }
    }

    async function handleFormSubmit(event) {
        event.preventDefault();
        window.location.href = '/Confirmation';
    }
});
