var urlParams = new URLSearchParams(window.location.search);
var points = urlParams.get("points");

var scoreElement = document.getElementById("score");
scoreElement.innerHTML = points;

document.getElementById("NG_btn").addEventListener("click", function () {
  window.location.href = "/TomatoGame/client/public/game.html";
});

document.getElementById("LO_btn").addEventListener("click", function () {
  logoutUser();
});
