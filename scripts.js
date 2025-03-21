// JavaScript to fix validation issues

// Toggle Navigation Menu
function toggleMenu() {
    document.getElementById("nav-menu").classList.toggle("active");
}

// Course List with Credits
const courses = [
    { code: "CSE 110", category: "CSE", credits: 3 },
    { code: "WDD 130", category: "WDD", credits: 3 },
    { code: "CSE 111", category: "CSE", credits: 4 },
    { code: "CSE 210", category: "CSE", credits: 3 },
    { code: "WDD 131", category: "WDD", credits: 3 },
    { code: "WDD 231", category: "WDD", credits: 4 }
];

function displayCourses(filteredCourses) {
    const courseList = document.getElementById("course-list");
    courseList.innerHTML = "";
    
    filteredCourses.forEach(course => {
        let courseDiv = document.createElement("div");
        courseDiv.textContent = `${course.code} (${course.credits} credits)`;
        courseDiv.classList.add("course-item");
        courseList.appendChild(courseDiv);
    });

    updateTotalCredits(filteredCourses);
}

// Filter Courses
function filterCourses(category) {
    if (category === "all") {
        displayCourses(courses);
    } else {
        const filtered = courses.filter(course => course.category === category);
        displayCourses(filtered);
    }
}

// Calculate Total Credits
function updateTotalCredits(selectedCourses) {
    const totalCredits = selectedCourses.reduce((sum, course) => sum + course.credits, 0);
    document.getElementById("total-credits").textContent = totalCredits;
}

// Set Current Year in Footer
document.getElementById("year").textContent = new Date().getFullYear();

// Set Last Modified Date
document.getElementById("lastModified").textContent = "Last Update: " + document.lastModified;

// Initial Display
displayCourses(courses);
