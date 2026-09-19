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
        const response = await fetch("data/members.json");
        if (!response.ok) {
            throw new Error(`Member data request failed: ${response.status}`);
        }
        const data = await response.json();
        displayMembers(data);
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
                <div class="member-details">
                    <h3>${member.name}</h3>
                    <p>${member.other}</p>
                    <p>${member.address}</p>
                    <p><a href="${member.website}" target="_blank" rel="noopener">Visit Website</a></p>
                    <p><a href="tel:${member.phone.replace(/[^+\d]/g, "")}">${member.phone}</a></p>
                    <p class="membership-level">${levelLabel}${levelLabel === "Member" ? "" : " Member"}</p>
                </div>
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

});