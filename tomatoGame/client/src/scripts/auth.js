var x = document.getElementById("login");
var y = document.getElementById("register");
var z = document.getElementById("btn");

function register() {
  x.style.left = "-400px";
  y.style.left = "50px";
  z.style.left = "110px";
}

function login() {
  x.style.left = "50px";
  y.style.left = "450px";
  z.style.left = "0";
}

function validationLogin() {
  var L_username = document.getElementById("l_username").value;
  var L_password = document.getElementById("l_password").value;

  if (L_username == "" || L_password == "") {
    alert("Username and Password cannot be empty.");
    return false;
  }

  return true;
}

function validationRegister() {
  var R_username = document.getElementById("r_username").value;
  var R_password = document.getElementById("r_password").value;
  var R_confirmPassword = document.getElementById("r_confirmPassword").value;

  if (R_username == "" || R_password == "" || R_confirmPassword == "") {
    alert("Username, Password, and Confirm Password cannot be empty.");
    return false;
  }

  if (R_password !== R_confirmPassword) {
    alert("Password and Confirm Password do not match.");
    return false;
  }

  return true;
}

function registerUser() {
  if (!validationRegister()) {
    return false;
  }

  var username = document.getElementById("r_username").value;
  var password = document.getElementById("r_password").value;

  fetch(
    "http://localhost/tomatoGame/server/src/controllers/AuthController.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "register",
        username: username,
        password: password,
      }),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      alert(data.message);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error occurred");
    });

  return false;
}

function loginUser() {
  if (!validationLogin()) {
    return false;
  }

  var username = document.getElementById("l_username").value;
  var password = document.getElementById("l_password").value;

  fetch(
    "http://localhost/tomatoGame/server/src/controllers/AuthController.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "login",
        username: username,
        password: password,
      }),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      alert(data.message);

      if (data.status) {
        window.location.href = "/TomatoGame/client/public/game.html";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error occurred");
    });

  return false;
}
