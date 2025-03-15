const toggleBtn = document.getElementById("toggle-btn");
const sidebar = document.getElementById("sidebar");

// Select all buttons with the same class
const dropDownBtn = document.querySelectorAll(".dropdown-btn");

toggleBtn.addEventListener("click", () => toggleSidebar());

// Loop through each button and attach a click event listener
dropDownBtn.forEach((button) => {
  button.addEventListener("click", () => toggleSubMenu(button));
});

function toggleSidebar() {
  sidebar.classList.toggle("close");
  toggleBtn.classList.toggle("rotate");

  Array.from(sidebar.getElementsByClassName("show")).forEach((ul) => {
    ul.classList.remove("show");
    ul.previousElementSibling.classList.remove("rotate");
  });
}

function toggleSubMenu(button) {
  button.nextElementSibling.classList.toggle("show");
  button.classList.toggle("rotate");

  if (sidebar.classList.contains("close")) {
    sidebar.classList.toggle("close");
    toggleBtn.classList.toggle("rotate");
  }
}
