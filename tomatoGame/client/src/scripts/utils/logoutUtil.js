function logoutUser() {
  fetch(
    "http://localhost/tomatoGame/server/src/controllers/AuthController.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "logout",
      }),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      alert(data.message);

      if (data.status) {
        window.location.href = "/TomatoGame/client/public/index.html";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error occurred");
    });

  return false;
}
