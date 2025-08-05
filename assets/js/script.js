document.addEventListener("DOMContentLoaded", function() {
    const nav_lists = document.querySelectorAll(".main-menu ul li a");
    const nav_lists_mobile = document.querySelectorAll(".mobile-nav ul li a");
    
    nav_lists.forEach(el => el.addEventListener("click", () => add_active_class(nav_lists, el)));
    nav_lists_mobile.forEach(el => el.addEventListener("click", () => add_active_class(nav_lists_mobile, el)));
    
});

function add_active_class(array_lists, el) {
    if (!el.classList.contains("active")) {
        array_lists.forEach(el => el.parentElement.classList.remove('active'));
        el.parentElement.classList.add("active");
    }
}