const loginFormHandler = async (event) => {
  event.preventDefault();
  // Collect values from the login form
  const username = document.querySelector("#username-login").value.trim();
  const password = document.querySelector("#password-login").value.trim();
  console.log(username, password);
  if (username && password) {
    // Send a POST request to the API endpoint
    const response = await fetch("/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });
    //document.location.assign("/chat");
    if (response.ok) {
      const result = await response.text();
      console.log(result);
      const userLogin = JSON.parse(result);
      console.log(userLogin.user);
      localStorage.setItem("user", JSON.stringify(userLogin.user));

      // TODO: Show the details page
      document.location.assign("/chat");
    } else {
      const userField = document.querySelector("#userLog");
      const passField = document.querySelector("#passLog");
      const messageLFail = document.querySelector(".loginF");
      userField.style.borderColor = "red";
      passField.style.borderColor = "red";
      messageLFail.style.visibility = "visible";
      messageLFail.innerHTML = `Login Failed. Check your credentials and try again.`;
    }
  }
};

// const tokenDecode = (token) => {
//   const tokenDecoded = decodetoken(token);
//   const expTime = new Date(tokenDecoded.exp * 1000);
//   if (new Date() > expTime) {
//     return null;
//   }

//   return tokenDecoded;
// };

const signupFormHandler = async (event) => {
  event.preventDefault();

  const username = document.querySelector("#username-signup").value.trim();
  const email = document.querySelector("#email-signup").value.trim();
  const user_password = document.querySelector("#password-signup").value.trim();
  console.log(`${username} ${email} ${user_password}`);

  if (username && email && user_password) {
    const response = await fetch("/signUp", {
      method: "POST",
      body: JSON.stringify({ username, email, user_password }),
      headers: { "Content-Type": "application/json" },
    });
    //document.location.assign("/chat");
    if (response.ok) {
      const result = await response.text();
      console.log(result);
      const userLogin = JSON.parse(result);
      console.log(userLogin.user);
      localStorage.setItem("user", JSON.stringify(userLogin.user));

      // TODO: Show the details page
      document.location.assign("/login");
    }

    // try {
    //   const response = await fetch(
    //     "http://localhost:5000/api/messenger/user-register",
    //     {
    //       method: "POST",
    //       body: JSON.stringify({ username, email, user_password }),
    //       headers: { "Content-Type": "application/json" },
    //     }
    //   );

    //   if (response.ok) {
    //     //show alert with register successfull.

    //     document.location.assign("/login");
    //     //localStorage.setItem("authToken", response.data.user);
    //     // console.log(
    //     //   "UserInfo",
    //     //   response.json().then((user) => {
    //     //    // localStorage.setItem("authUser", user.user.id);
    //     //     console.log(user.user);
    //     //   })
    //     // );
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
  }
};

document.querySelector("#btnLogin").addEventListener("click", loginFormHandler);
document
  .querySelector("#btnSignup")
  .addEventListener("click", signupFormHandler);
// document
//   .querySelector(".login-form")
//   .addEventListener("submit", loginFormHandler);

// document
//   .querySelector(".signup-form")
//   .addEventListener("submit", signupFormHandler);
