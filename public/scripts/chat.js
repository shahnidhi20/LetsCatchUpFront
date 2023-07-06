const socket = io();

const sendMessageHandler = async (event) => {
  event.preventDefault();
  alert("Send Message");
  // Collect values from the login form
  const content = document.querySelector("#messg-content").value.trim();
  const from_user_id = document.querySelector("#spuserid").value.trim();

  console.log(content, from_user_id);
  let date = new Date();
  let options = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  console.log(date.toLocaleTimeString("en-us", options));
  let request = {
    body: content,
    user_id: from_user_id,
    // sentTime: date.toLocaleTimeString("en-us", options),
  };
  //TODO: save the message in the DB have a fetch function
  // const response = await fetch("/api/messages/", {
  //   method: "POST",
  //   body: JSON.stringify(request),
  //   headers: { "Content-Type": "application/json" },
  // });

  // if (response.ok) {
  //   // TODO: Show the details page
  //   document.location.replace("/chat");
  // } else {
  //   alert(response.statusText);
  // }

  socket.emit("sendMessage", msg, (error) => {
    // $msgFormButton.removeAttribute("disabled");
    console.log(msg);
    content.value = "";
    content.focus();
    if (error) {
      return console.log(error);
    }
  });
  //get the from user name
  // get the to user name
};

socket.on("message", (msg) => {
  console.log(msg);
  const html = Mustache.render(msgtemplate, {
    username: msg.username,
    msg: msg.text,
    createdAt: moment(msg.createdAt).format("h:m A, DD MMM,YYYY"),
  });
});

// socket.emit("join", { username, room }, (error) => {
//   if (error) {
//     alert(error);
//   }
// });

document
  .querySelector("#btnSendMessage")
  .addEventListener("click", sendMessageHandler);
