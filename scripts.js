document.addEventListener("DOMContentLoaded", () => {
    const courses = [
        { code: "CSE 110", category: "CSE", credits: 3, completed: true },
        { code: "WDD 130", category: "WDD", credits: 3, completed: false },
        { code: "CSE 111", category: "CSE", credits: 3, completed: true },
        { code: "CSE 210", category: "CSE", credits: 4, completed: false },
        { code: "WDD 131", category: "WDD", credits: 3, completed: false },
        { code: "WDD 231", category: "WDD", credits: 3, completed: true }
    ];

    const courseList = document.getElementById("course-list");
    const totalCreditsElement = document.getElementById("total-credits");
    const navMenu = document.getElementById("nav-menu");

    function displayCourses(filter) {
        courseList.innerHTML = "";
        let totalCredits = 0;

        courses.filter(course => filter === "all" || course.category === filter)
            .forEach(course => {
                const courseItem = document.createElement("div");
                courseItem.textContent = course.code;
                courseItem.classList.add("course-item");

                if (course.completed) {
                    courseItem.style.backgroundColor = "lightgray";
                } else {
                    courseItem.style.backgroundColor = "#654321";
                    courseItem.style.color = "white";
                }

                totalCredits += course.credits;
                courseList.appendChild(courseItem);
            });

        totalCreditsElement.textContent = totalCredits;
    }

    window.filterCourses = displayCourses;
    displayCourses("all");

    document.getElementById("year").textContent = new Date().getFullYear();
    document.getElementById("lastModified").textContent = "Last Update: " + document.lastModified;

    window.toggleMenu = function() {
        navMenu.classList.toggle("active");
    };
});
