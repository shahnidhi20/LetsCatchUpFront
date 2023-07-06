// changes styling to dark (login/sign-up)
function darkMode() {
  const signInUp = document.querySelector(".sign-in-sign-up");
  const container = document.querySelector(".container");
  const title = document.querySelectorAll(".title");
  const fields = document.querySelectorAll(".input-field");
  const button = document.querySelectorAll(".btn");
  const sunIcon = document.querySelectorAll(".fa-sun");
  const moonIcon = document.querySelectorAll(".fa-moon");

  signInUp.style.background = "black";
  container.classList.toggle("darkBack");
  fields.forEach((field) => {
    field.style.borderColor = "#888";
  });
  title.forEach((titles) => {
    titles.style.color = "#fff";
  });
  button.forEach((buttons) => {
    buttons.style.background = "#888";
  });
  moonIcon.forEach((moon) => {
    moon.style.display = "none";
  });
  sunIcon.forEach((sun) => {
    sun.style.display = "flex";
  });
}

// changes styles back to default (login-sign-up)
function lightMode() {
  const signInUp = document.querySelector(".sign-in-sign-up");
  const container = document.querySelector(".container");
  const title = document.querySelectorAll(".title");
  const fields = document.querySelectorAll(".input-field");
  const button = document.querySelectorAll(".btn");
  const sunIcon = document.querySelectorAll(".fa-sun");
  const moonIcon = document.querySelectorAll(".fa-moon");

  signInUp.style.background = "#fff";
  container.classList.toggle("darkBack");
  fields.forEach((field) => {
    field.style.borderColor = "";
  });
  title.forEach((titles) => {
    titles.style.color = "";
  });
  button.forEach((buttons) => {
    buttons.style.background = "";
  });
  moonIcon.forEach((moon) => {
    moon.style.display = "flex";
  });
  sunIcon.forEach((sun) => {
    sun.style.display = "";
  });
}

const moonIcon = document.querySelector(".fa-moon");
const sunIcon = document.querySelector(".fa-sun");

moonIcon.addEventListener("click", darkModeChat);
sunIcon.addEventListener("click", lightModeChat);

// changes styles to dark-mode (chat)
function darkModeChat() {
  const topBox = document.querySelector(".box-top");
  const messageBox = document.querySelector(".message-box");
  const inputBox = document.querySelector(".input-box");
  const userInput = document.querySelector("#messg-content");
  const sendIcon = document.querySelector(".fa-paper-plane");
  const sideBar = document.querySelector(".sidebar");

  topBox.style.background = "linear-gradient(91deg, #111111, #1c1c1c)";
  messageBox.style.background = "black";
  inputBox.style.background = "black";
  inputBox.style.color = "white";
  inputBox.style.borderColor = "#888888";
  userInput.style.color = "#ffffff";
  sendIcon.style.color = "#ffffff";
  sideBar.style.background = "linear-gradient(91deg, #000000, #111111)";
  sunIcon.style.display = "flex";
  sunIcon.style.color = "white";
  moonIcon.style.display = "none";
}

// changes styles back to default
function lightModeChat() {
  const topBox = document.querySelector(".box-top");
  const messageBox = document.querySelector(".message-box");
  const inputBox = document.querySelector(".input-box");
  const userInput = document.querySelector("#messg-content");
  const sendIcon = document.querySelector(".fa-paper-plane");
  const sideBar = document.querySelector(".sidebar");

  topBox.style.background = "";
  messageBox.style.background = "";
  inputBox.style.background = "";
  inputBox.style.color = "";
  inputBox.style.borderColor = "";
  userInput.style.color = "";
  sendIcon.style.color = "";
  sideBar.style.background = "";
  sunIcon.style.display = "";
  moonIcon.style.display = "";
}
