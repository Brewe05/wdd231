document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("currentYear").textContent = new Date().getFullYear();
    document.getElementById("lastModified").textContent = `Last Modification: ${document.lastModified}`;
    const menuBtn = document.getElementById("menu-button");
    const navMenu = document.getElementById("nav-menu");
    if (menuBtn) {
        menuBtn.addEventListener("click", () => navMenu.classList.toggle("open"));
    }

    const memberContainer = document.getElementById("member-container");
    const gridBtn = document.getElementById("grid-view-btn");
    const listBtn = document.getElementById("list-view-btn");
    async function getMembers() {
        try {
            const response = await fetch('data/members.json');
            const data = await response.json();
            displayMembers(data);
        } catch (error) {
            console.error("Error loading JSON:", error);
        }
    }

    function displayMembers(members) {
        memberContainer.innerHTML = "";

        members.forEach(member => {
            const section = document.createElement("section");
            section.className = "member-card";
            const levels = ["", "Member", "Silver", "Gold"];
            const levelLabel = levels[member.level] || "Member";
            section.innerHTML = `
                <img src="${member.image}" alt="${member.name} logo" loading="lazy">
                <h3>${member.name}</h3>
                <p>${member.address}</p>
                <p>${member.phone}</p>
                <p><a href="${member.website}" target="_blank">Visit Website</a></p>
                <p class="membership-level">Level: ${levelLabel}</p>
            `;
            memberContainer.appendChild(section);
        });
    }

    if (gridBtn && listBtn) {
        gridBtn.addEventListener("click", () => {
            memberContainer.classList.add("grid");
            memberContainer.classList.remove("list");
        });
        listBtn.addEventListener("click", () => {
            memberContainer.classList.add("list");
            memberContainer.classList.remove("grid");
        });
    }

    getMembers();
});