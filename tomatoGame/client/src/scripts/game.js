
var problem = "";
var solution = -1;
var lifes = 3;
var points = 0;
let timerInterval;
var finalValue;
var lifesElement = document.getElementById("lifes");
var pointsElement = document.getElementById("points");
var timerElement = document.getElementById("timer");
let gameStarted = false;

let startup = function () {
  resetTime();
  
};

function startgame() {
  resetGame();
  startCountdown();
  gameStarted = true;
}

let newgame = function (x) {
  startup();
};

document.getElementById("str_btn").addEventListener("click", function () {
  startup();
  startgame();
});

function updateTimerName(name) {
  const timerNameElement = document.getElementById("timer-name");
  if (timerNameElement) {
    timerNameElement.textContent = name;
  }
}

function updateTimer(seconds) {
  if (timerElement) {
    timerElement.textContent = seconds;
  }
}

function startCountdown() {
  let countdownSeconds = 3;

  let countdownInterval = setInterval(function () {
    updateTimerName("Start In : ");
    updateTimer(countdownSeconds);

    let img = document.getElementById("problem");
    if (img) {
      img.style.opacity = 0.2;
    }

    countdownSeconds--;

    if (countdownSeconds < 0) {
      clearInterval(countdownInterval);
      updateTimerName("Time Ends : ");
      startTimer();
    }
  }, 1000);
}

async function startTimer() {
  await fetchText();

  let seconds = 15;

  updateAnswerStatus("");

  clearInterval(timerInterval);
  timerInterval = setInterval(function () {
    updateTimer(seconds);
    seconds--;
    if (seconds < 0) {
      clearInterval(timerInterval);
      deductLife();
    }
  }, 1000);
}

function deductLife() {
  lifes = lifes - 1;
  lifesElement.innerHTML = lifes;

  if (lifes === 0) {
    endGame();
  } else {
    resetTime();
    startup();
  }
}

function updateAnswerStatus(status) {
  const answerStatusElement = document.getElementById("answer-status");
  if (answerStatusElement) {
    answerStatusElement.textContent = status;
    console.log(status);
    answerStatusElement.style.color =
      status === "Correct Answer" ? "green" : "red";
  }
}

function showValue(value) {
  if (!gameStarted) {
    return;
  }

  finalValue = value;

  if (finalValue === solution) {
    points = points + 10;
    pointsElement.innerHTML = points;
    updateAnswerStatus("Correct Answer");
    resetTime();
    startup();
  } else {
    updateAnswerStatus("Wrong Answer");
    deductLife();
  }
}

let resetTime = function () {
  clearInterval(timerInterval);
  seconds = 15;
  timerElement.textContent = seconds;
  startCountdown();
};

function endGame() {
  window.location.href =
    "/TomatoGame/client/public/score.html?points=" + points;
  resetGame();
}

let resetGame = function () {
  lifes = 3;
  lifesElement.innerHTML = lifes;
  points = 0;
  pointsElement.innerHTML = points;
  resetTime();
};

let startTomatoGame = function (data) {
  var parsed = JSON.parse(data);
  problem = parsed.question;
  solution = parsed.solution;
  let img = document.getElementById("problem");
  if (img) {
    img.src = problem;
    img.style.opacity = 1;
  }
};

let fetchText = async function () {
  let response = await fetch("https://marcconrad.com/uob/tomato/api.php");
  let data = await response.text();
  startTomatoGame(data);
};

document.getElementById("LO_btn").addEventListener("click", function () {
  logoutUser();
});
