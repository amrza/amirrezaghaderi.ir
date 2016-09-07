(function(window) {
'use strict';

var sideMenu = document.getElementById("side-menu");
var navbar = document.getElementById("page-nav");
var toggleBtn = document.getElementById("menu-btn");
var body = document.body;

toggleBtn.addEventListener("click",function() {
    if (body.classList.contains("side-menu-activate")) {
        body.classList.remove("side-menu-activate");
        navbar.classList.remove("move-nav-to-right");
        sideMenu.classList.remove("move-menu-to-right");
        toggleBtn.innerHTML = "منوی سایت";
    } else {
        body.classList.add("side-menu-activate");
        navbar.classList.add("move-nav-to-right");
        sideMenu.classList.add("move-menu-to-right");
        toggleBtn.innerHTML = "بستن";
    }
})

})();
