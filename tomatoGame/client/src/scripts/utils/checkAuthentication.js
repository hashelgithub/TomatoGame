document.addEventListener("DOMContentLoaded", async function () {
  await checkAuthentication();
});

async function checkAuthentication() {
  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("user_id=")
  );

  if (!tokenCookie) {
    window.location.href = "/TomatoGame/client/public/index.html";
    return;
  }

  const response = await fetch(
    "http://localhost/tomatoGame/server/src/controllers/AuthController.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: tokenCookie,
      },
      body: JSON.stringify({
        action: "checkAuthentication",
      }),
    }
  );

  const data = await response.json();

  if (!data.status) {
    window.location.href = "/TomatoGame/client/public/index.html";
  }
}
