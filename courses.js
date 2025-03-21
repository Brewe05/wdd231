// Course List with Credits
const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'Introduction to programming concepts using Python.',
        technology: ['Python'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'Introduction to web development using HTML and CSS.',
        technology: ['HTML', 'CSS'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'Writing and using functions in programming.',
        technology: ['Python'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'Object-oriented programming using C#.',
        technology: ['C#'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'Creating dynamic websites with JavaScript.',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'Focus on user experience and API usage.',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: false
    }
];

// Display Courses
function displayCourses(filteredCourses) {
    const courseList = document.getElementById("course-list");
    courseList.innerHTML = "";

    filteredCourses.forEach(course => {
        let courseDiv = document.createElement("div");
        courseDiv.classList.add("course-item");
        if (course.completed) {
            courseDiv.classList.add("completed");
        }
        courseDiv.innerHTML = `<strong>${course.subject} ${course.number}: ${course.title}</strong> 
                               <p>${course.description}</p>
                               <p><strong>Credits:</strong> ${course.credits}</p>
                               <p><strong>Technology:</strong> ${course.technology.join(", ")}</p>`;
        courseList.appendChild(courseDiv);
    });

    updateTotalCredits(filteredCourses);
}

// Filter Courses
function filterCourses(category) {
    if (category === "all") {
        displayCourses(courses);
    } else {
        const filtered = courses.filter(course => course.subject === category);
        displayCourses(filtered);
    }
}

// Calculate Total Credits
function updateTotalCredits(selectedCourses) {
    const totalCredits = selectedCourses.reduce((sum, course) => sum + course.credits, 0);
    document.getElementById("total-credits").textContent = totalCredits;
}

// Initial Display
document.addEventListener("DOMContentLoaded", () => {
    displayCourses(courses);
});