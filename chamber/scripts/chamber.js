document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("currentYear").textContent = new Date().getFullYear();
    document.getElementById("lastModified").textContent = `Last Modification: ${document.lastModified}`;

    const menuBtn = document.getElementById("menu-button");
    const navMenu = document.getElementById("nav-menu");
    if (menuBtn) {
        menuBtn.addEventListener("click", () => navMenu.classList.toggle("open"));
    }

    const spotlightContainer = document.getElementById("spotlight-container");
    if (spotlightContainer) {
        getSpotlights();
    }

    async function getSpotlights() {
        try {
            const response = await fetch("data/members.json");
            if (!response.ok) {
                throw new Error(`Data fetch failed with status: ${response.status}`);
            }
            const members = await response.json();
            const qualifiedMembers = members.filter(member => member.level === 2 || member.level === 3);
            const shuffled = qualifiedMembers.sort(() => 0.5 - Math.random());
            const selectedCount = Math.floor(Math.random() * 2) + 2; 
            const selectedMembers = shuffled.slice(0, selectedCount);

            displaySpotlights(selectedMembers);
        } catch (error) {
            console.error("Error fetching spotlight data:", error);
            spotlightContainer.innerHTML = "<p>Unable to load spotlights at this time.</p>";
        }
    }

    function displaySpotlights(members) {
        spotlightContainer.innerHTML = "";
        const levels = ["", "Bronze", "Silver", "Gold"];

        members.forEach(member => {
            const card = document.createElement("article");
            card.className = "spotlight-card";

            card.innerHTML = `
                <img src="${member.image}" alt="${member.name} Logo" loading="lazy">
                <h3>${member.name}</h3>
                <p><strong>Phone:</strong> <a href="tel:${member.phone.replace(/[^+\d]/g, "")}">${member.phone}</a></p>
                <p><strong>Address:</strong> ${member.address}</p>
                <p><a href="${member.website}" target="_blank" rel="noopener">Website</a></p>
                <span class="membership-badge">${levels[member.level]} Member</span>
            `;

            spotlightContainer.appendChild(card);
        });
    }

    const memberContainer = document.getElementById("member-container");
    const gridBtn = document.getElementById("grid-view-btn");
    const listBtn = document.getElementById("list-view-btn");

    if (memberContainer) {
        getMembers();
    }

    async function getMembers() {
        try {
            const response = await fetch("data/members.json");
            if (!response.ok) {
                throw new Error(`Member data request failed: ${response.status}`);
            }
            const data = await response.json();
            displayMembers(data);
        } catch (error) {
            console.error("Error loading directory members:", error);
            memberContainer.innerHTML = "<p class='directory-error'>Unable to load directory members at this time.</p>";
        }
    }

    function displayMembers(members) {
        memberContainer.innerHTML = "";
        const levels = ["", "Bronze", "Silver", "Gold"];

        members.forEach(member => {
            const section = document.createElement("section");
            section.className = "member-card";
            const levelLabel = levels[member.level] || "Member";
            
            section.innerHTML = `
                <img src="${member.image}" alt="${member.name} logo" loading="lazy">
                <div class="member-details">
                    <h3>${member.name}</h3>
                    <p class="member-address">${member.address}</p>
                    <p class="member-phone"><a href="tel:${member.phone.replace(/[^+\d]/g, "")}">${member.phone}</a></p>
                    <p class="member-website"><a href="${member.website}" target="_blank" rel="noopener">Visit Website</a></p>
                    <p class="membership-level">${levelLabel} Member</p>
                </div>
            `;
            memberContainer.appendChild(section);
        });
    }

    if (gridBtn && listBtn && memberContainer) {
        gridBtn.addEventListener("click", () => {
            memberContainer.classList.add("grid");
            memberContainer.classList.remove("list");
            gridBtn.classList.add("active-view");
            listBtn.classList.remove("active-view");
        });

        listBtn.addEventListener("click", () => {
            memberContainer.classList.add("list");
            memberContainer.classList.remove("grid");
            listBtn.classList.add("active-view");
            gridBtn.classList.remove("active-view");
        });
    }
});