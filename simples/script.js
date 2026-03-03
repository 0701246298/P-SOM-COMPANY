const items = document.querySelectorAll(".sidebar ul li");
const indicator = document.querySelector(".indicator");
const sidebar = document.querySelector(".sidebar");
const toggleBtn = document.querySelector(".menu-toggle");
const overlay = document.querySelector(".overlay");

// Move sliding indicator
function moveIndicator(element){
  indicator.style.top = element.offsetTop + "px";
}

// Handle menu item click
items.forEach(item => {
  item.addEventListener("click", (e) => {
    // Set active
    document.querySelector(".active")?.classList.remove("active");
    item.classList.add("active");
    moveIndicator(item);

    // Ripple effect
    const circle = document.createElement("span");
    circle.style.position = "absolute";
    circle.style.background = "rgba(255,255,255,0.15)";
    circle.style.borderRadius = "50%";
    circle.style.width = "0px";
    circle.style.height = "0px";
    circle.style.left = e.offsetX + "px";
    circle.style.top = e.offsetY + "px";
    circle.style.transform = "translate(-50%, -50%)";
    circle.style.transition = "0.5s ease";
    item.querySelector("a").appendChild(circle);
    setTimeout(() => circle.remove(), 500);

    // Always close menu
    closeMenu();
  });
});

// Open menu
function openMenu(){
  sidebar.classList.add("open");
  overlay.classList.add("show");
  toggleBtn.classList.add("active");
}

// Close menu
function closeMenu(){
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
  toggleBtn.classList.remove("active");
}

// Toggle button
toggleBtn.addEventListener("click", () => {
  sidebar.classList.contains("open") ? closeMenu() : openMenu();
});

// Overlay click
overlay.addEventListener("click", closeMenu);

// Initialize indicator
moveIndicator(document.querySelector(".active"));