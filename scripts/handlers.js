document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('menu-toggle');
  const menu = document.getElementById('nav-menu');

    if (btn && menu) {
        const setMenu = (open) => {
        btn.setAttribute('aria-expanded', String(Boolean(open)));
        menu.hidden = !open;
        document.body.classList.toggle('nav-open', open);
        };

        setMenu(window.innerWidth > 768);
        btn.addEventListener('click', () => setMenu(!(btn.getAttribute('aria-expanded') === 'true')));
        document.addEventListener('click', (e) => {
        if (window.innerWidth > 768) return;
        if (!btn.contains(e.target) && !menu.contains(e.target)) setMenu(false);
        });

        window.addEventListener('resize', () => setMenu(window.innerWidth > 768));
        window.toggleMenu = () => setMenu(!(btn.getAttribute('aria-expanded') === 'true'));
    }

    const filterButtons = document.querySelectorAll('button.filter-btn[data-filter]');
    filterButtons.forEach(b => {
        b.addEventListener('click', () => {
            const filter = b.dataset.filter;
            if (typeof window.filterCourses === 'function') {
                window.filterCourses(filter);
            }
        else{
            console.warn('filterCourses is not defined yet:', filter);
        }
        });
    });
});
