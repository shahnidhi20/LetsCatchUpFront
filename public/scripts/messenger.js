var socket = io();

document.addEventListener("DOMContentLoaded", function () {});

const divHoverFriendlist = document.querySelectorAll(".hover-friend");
const rightsidePartialContainer = document.querySelector(
  "#rightsidePartialContainer"
);
const activeUsersDiv = document.querySelector("#activeUsersDiv");

function getLoggedInUser() {
  const user = localStorage.getItem("user");
  const jsonUser = JSON.parse(user);
  console.log("From Local Storage", user);
  socket.emit("addUser", jsonUser.id, jsonUser);
}
let activeUser = [];
socket.on("getUser", (users) => {
  const loggedUserIdDiv = document.getElementById("myInfoID");
  var loggedUserId = loggedUserIdDiv.dataset.value;
  console.log("Users from socket", users);
  console.log("loggedUserId", loggedUserId);

  const activefilterUser = users.filter(
    (u) => u.userId.toString() !== loggedUserId
  );

  activeUser = activefilterUser;

  fetch("/activeUsers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(activefilterUser),
  })
    .then((response) => response.text())
    .then((partialHtml) => {
      // Insert the partial view into the container

      activeUsersDiv.innerHTML = partialHtml;
    })
    .catch((error) => {
      console.log("Error:", error);
    });

  console.log("Socket IO Filter getUser", activefilterUser);
});

socket.on("getMessage", (data) => {
  console.log("Socket Active", data);

  //{ senderId: "29", sendername: "Sam",
  //receiverID: "28", message: "h",
  //createdAt: "2023-07-05T06:08:48.969Z" }

  const data1 = {
    senderId: data.senderId,
    sendername: data.sendername,
    receiverID: data.receiverID,
    message: data.message,
    time: data.createdAt,
    loggedinUserID: data.receiverID,
  };

  //fetch the /sendMessage and pass the object.
  fetch("/sendSingleMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data1),
  })
    .then((response) => response.text())
    .then((result) => {
      // Insert the partial view into the container
      //send this message in the UI
      console.log("UI Message Save", result);
      const tempContainer = document.createElement("div");
      tempContainer.innerHTML = result;
      const showmessagediv = document.getElementById("showmessagediv");

      while (tempContainer.firstChild) {
        showmessagediv.appendChild(tempContainer.firstChild);
      }

      showmessagediv.scrollTop = showmessagediv.scrollHeight;
      //append the partial view to the div
      inputElement.value = "";
      inputElement.focus();
    })
    .catch((error) => {
      console.log("Error:", error);
    });
});

var currentSelectedFriend = { name: "nidhi" };
function currentFriendClick(e) {
  alert("Friend");
  console.log("Current Friend", friend);
}

var selectedDiv = null;

function selectDiv(divElement) {
  if (selectedDiv) {
    selectedDiv.classList.remove("hover-friend-active");
    selectedDiv.classList.add("hover-friend");
  }

  if (selectedDiv !== divElement) {
    divElement.classList.add("hover-friend-active");
    divElement.classList.remove("hover-friend");
    selectedDiv = divElement;
  } else {
    selectedDiv.classList.add("hover-friend");
    selectedDiv = null;
  }
}

function someFunc(e, detail) {
  const senderDiv = document.getElementById("myName");
  var sendername = senderDiv.dataset.value;
  const senderIDDiv = document.getElementById("myInfoID");
  var senderId = senderIDDiv.dataset.value;

  // [1]   id: 30, -->recevier ID
  // [1]   username: 'Amanda',
  // [1]   email: 'amanda@gmail.com',
  // [1]   user_password: '$2b$10$HYjUywETp6GNKNorpbtgVug60GEPARrdDp0cqac.CRSrMhpyo3nbS',
  // [1]   onlineStatus: false,
  // [1]   profile_pic_path: 'avatar_3.jpg',
  // [1]   createdAt: '2023-07-03T01:25:57.000Z',
  // [1]   updatedAt: '2023-07-03T01:25:57.000Z'
  // [1] }

  var num = "" + detail.id;
  var activeStatus = false;
  //set the activeStatus
  if (activeUser.length > 0) {
    // activeUser.forEach((element) => {
    //   console.log("Acive User", typeof element.userId.toString());
    //   console.log("Selected ", typeof num);
    // });
    const userfound = activeUser.find((user) => user.userId.toString() === num);
    if (userfound) activeStatus = true;
  }
  //
  //make all the items in the list as not selected
  currentSelectedFriend = {
    senderID: senderId,
    senderName: sendername,
    receiverID: num,
    receiverUserName: detail.username,
    email: detail.email,
    profile_pic_path: detail.profile_pic_path,
    activeStatus: activeStatus,
  };
  console.log("Sleect fr", currentSelectedFriend);

  var targetElement = document.getElementById("div_" + detail.id);
  selectDiv(targetElement);

  fetch("/partial", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(currentSelectedFriend),
  })
    .then((response) => response.text())
    .then((partialHtml) => {
      // Insert the partial view into the container

      rightsidePartialContainer.innerHTML = partialHtml;
      const showmessagediv = document.getElementById("showmessagediv");
      showmessagediv.scrollTop = showmessagediv.scrollHeight;
    })
    .catch((error) => {
      console.log("Error:", error);
    });

  //const friend = fetch()renderPartial(selectedItem);
}

function messageChange() {
  var inputElement = document.getElementById("message");
  var inputValue = inputElement.value;
  console.log(inputValue);
}

function sendMessage() {
  const senderDiv = document.getElementById("myName");
  var sendername = senderDiv.dataset.value;
  const senderIDDiv = document.getElementById("myInfoID");
  var senderId = senderIDDiv.dataset.value;
  const receiverDiv = document.getElementById("receiverUser");
  var receiverID = receiverDiv.dataset.value;

  var inputElement = document.getElementById("message");
  const message = inputElement.value;
  //get the loggedin user
  //get the receiver user id
  //get the message
  const data = {
    senderId: senderId,
    sendername: sendername,
    receiverID: receiverID,
    message: message,
    time: new Date(),
    loggedinUserID: senderId,
  };
  console.log(
    `sendername: ${sendername}, receiverID: ${receiverID}, message:${message} senderid:${senderId}`
  );

  //socket emit message
  if (message) {
    console.log("Emitteing the sokcet", data);
    socket.emit("sendMessage", data);
  }

  //fetch the /sendMessage and pass the object.
  fetch("/sendMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.text())
    .then((result) => {
      // Insert the partial view into the container
      //send this message in the UI
      console.log("UI Message Save", result);
      const tempContainer = document.createElement("div");
      tempContainer.innerHTML = result;
      const showmessagediv = document.getElementById("showmessagediv");

      while (tempContainer.firstChild) {
        showmessagediv.appendChild(tempContainer.firstChild);
      }

      showmessagediv.scrollTop = showmessagediv.scrollHeight;
      //append the partial view to the div
      inputElement.value = "";
      inputElement.focus();
    })
    .catch((error) => {
      console.log("Error:", error);
    });

  //pull all the messages ffrom the DB for this sender and receiver
}

function testMessageSend() {
  const currentSelectedFriend = {
    myuser: true,
  };

  fetch("/testMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(currentSelectedFriend),
  })
    .then((response) => response.text())
    .then((partialHtml) => {
      const tempContainer = document.createElement("div");
      tempContainer.innerHTML = partialHtml;
      const showmessagediv = document.getElementById("showmessagediv");

      while (tempContainer.firstChild) {
        showmessagediv.appendChild(tempContainer.firstChild);
      }
      // Insert the partial view into the container

      //.appendChild(partialHtml);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

const logout = async (event) => {
  alert("logout");
  localStorage.removeItem("user");
  let username = "testlogout";
  let password = "testPassword";
  const response = await fetch("/logout", {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    console.log(`User ${username} is successfully logout`);
    document.location.assign("/");
  }
};

getLoggedInUser();
