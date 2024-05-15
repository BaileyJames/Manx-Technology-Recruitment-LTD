document.addEventListener('DOMContentLoaded', (event) => {
    loadSkills().catch(error => {
        console.error('Failed to load skills:', error);
        alert('Failed to load skills');
    });
});

async function loadSkills() {
    try {
        const response = await fetch('http://localhost:3000/skills');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const skills = await response.json();
        const skillsList = document.querySelector('#skills-list');
        skillsList.innerHTML = skills.map(skill => `
            <tr>
                <td>${skill.name}</td>
                <td>${skill.description}</td>
                <td>
                    <a href="/Admin/Skills/Edit?id=${skill._id}">Edit</a>
                    <a href="/Admin/Skills/Remove?id=${skill._id}">Remove</a>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        throw error;
    }
}
