
let skillIds = ''
let skillsArray = new Array();
function on_Load() {

    fetch('http://localhost:3000/skills', {
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
            for (let i = 0; i < data.length; i++) {
                skillsArray.push(data[i])
            }
            createSkillLabels()
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}


function createSkillLabels() {
    const skillLabels = document.getElementById("skillLabels");
    for (let i = 0; i < skillsArray.length; i++) {
        let input = document.createElement("input");
        input.type = "checkbox";
        input.className = "skill-checkbox";
        input.setAttribute("skillid", skillsArray[i]._id)
        let label = document.createElement("label");
        label.appendChild(input);
        label.appendChild(document.createTextNode(skillsArray[i].name));
        let br = document.createElement("br")
        label.appendChild(br)
        skillLabels.appendChild(label)
    }
    checkTickBoxes()
}

function checkTickBoxes() {
    const checkboxes = document.querySelectorAll('.skill-checkbox');


    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', (event) => {
            const skillId = event.target.getAttribute('skillId');
            if (event.target.checked) {
                if (skillIds == '') {
                    skillIds += skillId;
                }
                else {
                    skillIds += "+" + skillId;
                }
            } else if (!event.target.checked) {
                splitIds = skillIds.split('+');
                splitIds = splitIds.filter(id => id !== skillId);
                skillIds = splitIds.join('+');

            }
        });
    });

}

function submitForm() {
    document.getElementById('SkillIds').value = skillIds;
    console.log(skillIds)
    getJobs()
}

function getJobs() {
    let jobsArray = new Array();
    let skillIds = document.getElementById('SkillIds').value
    console.log("http://localhost:3000/jobs?desiredSkills=" + skillIds)
    fetch("http://localhost:3000/jobs?desiredSkills=" + skillIds, {
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
            for (let i = 0; i < data.length; i++) {
                jobsArray.push(data[i])
            }
            createJobLabels(jobsArray)
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function createJobLabels(jobArray) {

    let jobLabels = document.getElementById("jobLabels");
    jobLabels.innerHTML = ''
    for (let i = 0; i < jobArray.length; i++) {
        let list = document.createElement("li")
        let title = document.createElement("strong")
        let br = document.createElement("br")
        let property = document.createElement("span")

        jobLabels.appendChild(document.createElement("br"))
        title.appendChild(document.createTextNode(jobArray[i].title))
        title.appendChild(document.createElement("br"))
        list.appendChild(title)

        property.appendChild(document.createTextNode(jobArray[i].description))
        property.appendChild(document.createElement("br"))
        property.appendChild(document.createTextNode(jobArray[i].location))
        property.appendChild(document.createElement("br"))
        property.appendChild(document.createTextNode(jobArray[i].schedule))
        property.appendChild(document.createElement("br"))
        property.appendChild(document.createTextNode(jobArray[i].salary))
        property.appendChild(document.createElement("br"))
        property.appendChild(document.createTextNode(jobArray[i].deadline))
        property.appendChild(document.createElement("br"))
        console.log(jobArray[i].desiredSkills.length)
        if (jobArray[i].desiredSkills.length > 0) {
            property.appendChild(document.createTextNode("Desired Skills: "))
            for (let j = 0; j < jobArray[i].desiredSkills.length; j++) {
                property.appendChild(document.createTextNode(getSkillName(jobArray[i].desiredSkills[j])))
                if (jobArray[i].desiredSkills.length > 1) {
                    property.appendChild(document.createTextNode(", "))
                }
            }
        }
        else {
            property.appendChild(document.createTextNode("Desired Skills: None"))
        }
        property.appendChild(document.createElement("br"))
        list.appendChild(property)

        console.log("Por")

        let button = document.createElement("button")
        button.className = "btn btn-default";
        button.onclick = function () { location.href = "/Job%20Application/JobDetails?id=" + jobArray[i]._id }
        button.textContent = "More Info"
        list.appendChild(button)

        jobLabels.appendChild(list)
    }
}

function getSkillName(skillId) {
    for (var i = 0; i < skillsArray.length; i++) {
        if (skillsArray[i]._id == skillId) {
            return skillsArray[i].name
        }
    }
}