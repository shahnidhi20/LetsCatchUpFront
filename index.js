const path = require("path");
const express = require("express");
const http = require("http");
//Loads the handlebars module
const handlebars = require("express-handlebars");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const moment = require("moment");
const utilhelpers = require("./utils/helpers");

const app = express();
const PORT = process.env.PORT;

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
//Sets our app to use the handlebars engine
app.set("view engine", "handlebars");
//Sets handlebars configurations (we will go through them later on)
app.engine(
  "handlebars",
  handlebars.engine({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    defaultLayout: "main-layout",
    helpers: {
      json: function (context) {
        return JSON.stringify(context);
      },
      isEqual: (value1, value2, options) => {
        return value1 === value2 ? options.fn(this) : options.inverse(this);
      },
    },
  })
);

//#region Socket IO
let users = [];
const addUser = (userId, socketId, userInfo) => {
  const checkUser = users.some((u) => u.userId === userId);

  if (!checkUser) {
    users.push({ userId, socketId, userInfo });
  }
};

const removeUser = (socketId) => {
  users = users.filter((u) => u.socketId !== socketId);
};

const findFriend = (id) => {
  return users.filter((u) => u.userId.toString() === id);
};

io.on("connection", (socket) => {
  console.log("chat user connected");

  socket.on("addUser", (userid, userinfo) => {
    addUser(userid, socket.id, userinfo);
    console.log("Total Active Users", users);
    io.emit("getUser", users);
  });

  socket.on("sendMessage", (messagedata) => {
    //check if receiver is Active
    const user = findFriend(messagedata.receiverID);

    console.log("User found", user);
    //if user is active then send it to that active user
    if (user !== undefined && user.length > 0) {
      socket.to(user[0].socketId).emit("getMessage", {
        senderId: messagedata.senderId,
        sendername: messagedata.sendername,
        receiverID: messagedata.receiverID,
        message: messagedata.message,
        createdAt: messagedata.time,
      });
    }
    console.log("Scoket message send to", user[0].socketId, messagedata);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    removeUser(socket.id);
    io.emit("getUser", users);
    console.log("After discconect users:", users);
  });
});

//#endregion

const oneDay = 1000 * 60 * 60 * 24;
app.use(
  sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

var session;

app.get("/", (req, res) => {
  try {
    session = req.session;

    res.render("login", { formCSS: true, chatCSS: false });
  } catch (err) {
    console.error("Error loading login", err);
  }
});

app.post("/login", async (req, res) => {
  try {
    console.log("Authenticating...");
    let username = req.body.username;
    let password = req.body.password;
    if (username && password) {
      console.log("username: " + username, "password: " + password);

      // Send a POST request to the API endpoint
      const response = await fetch(
        `${process.env.API_SERVER_URL}/api/messenger/user-login`,
        {
          method: "POST",
          body: JSON.stringify({ username, password }),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (response.ok) {
        console.log("Authenticating Complete...");

        const result = await response.text();

        const userLogin = JSON.parse(result);

        req.session.loggedIn = true;
        req.session.username = username;
        req.session.loggedUser = userLogin.userData;

        console.log("Going to chat");

        res.status(200).json({
          success: true,
          user: userLogin.userData,
        });
      } else {
        console.log("failed to login");
      }
    }
  } catch (err) {
    console.error("Error loading login", err);
  }
});

app.get("/chat", async (req, res) => {
  try {
    console.log(" Loading Chat");
    var cookie = "authToken";
    var requestOptions = {
      method: "GET",
      redirect: "follow",
      credentials: "include",
    };

    const response = await fetch(
      `${process.env.API_SERVER_URL}/api/messenger/get-friends`,
      requestOptions
    );

    if (response.ok) {
      const result = await response.text();
      let listofFriends = JSON.parse(result).friends;
      listofFriends = listofFriends.filter(
        (fr) => fr.id !== req.session.loggedUser.id
      );

      res.render("chat", {
        chatCSS: true,
        formCSS: false,
        friends: { listofFriends },
        loggedInUser: req.session.loggedUser,
        loadFirstTime: true,
      });
    } else {
      alert("Could not retrieve the users list");
    }
  } catch (err) {
    console.error("Error loading chat", err);
  }
});
//user selected
app.post("/partial", async (req, res) => {
  const currentFriend = req.body;
  // Current friend {
  // [1]   senderID: '28',
  // [1]   senderName: 'nid',
  // [1]   receiverID: 31,
  // [1]   receiverUserName: 'Paola',
  // [1]   email: 'paola@gmail.com',
  // [1]   profile_pic_path: 'avatar_4.jpg'
  // [1] }

  const data = {
    senderID: currentFriend.senderID,
    receiverID: currentFriend.receiverID,
  };

  const response = await fetch(
    //get all the messages from the DB for this user and receiver
    `${process.env.API_SERVER_URL}/api/messenger/get-message`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );
  if (response.ok) {
    const result = await response.text();
    var jsonResult = JSON.parse(result);

    //get mymessages
    //get fd messages
    // res.status(200).json({ message: "Data Saved successfully" });
  }
  //if the messages are found then
  // You can retrieve the necessary data for the partial view based on the item ID

  // Render the partial view and pass the data
  res.render("partials/RightSide", {
    currentFriend: currentFriend,
    allmessages: jsonResult.messages,
    profilepic: currentFriend.profile_pic_path,
  });
});

app.post("/activeUsers", async (req, res) => {
  const activeFriends = req.body;

  res.render("partials/ActiveFriends", {
    activeFriends: activeFriends,
  });
});

app.post("/testMessage", async (req, res) => {
  // const data = req.body;

  const data = {
    myBooleanValue: true, // Set your boolean value here
  };

  res.render("partials/SingleMessage", {
    layout: false,
    data: data,
  });
});

app.post("/sendSingleMessage", async (req, res) => {
  try {
    let myUserID = req.body.loggedinUserID;

    const data = {
      messageID: req.body.id,
      senderID: req.body.senderid,
      sendername: req.body.sendername,
      recevierID: req.body.recevierid,
      message: req.body.message,
      createdAt: new Date(req.body.time).toLocaleString("en-US"),
      myUser: myUserID === req.body.senderid,
    };
    res.render("partials/SingleMessage", {
      layout: false,
      data: data,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/sendMessage", async (req, res) => {
  try {
    let myUserID = req.body.loggedinUserID;

    const response = await fetch(
      `${process.env.API_SERVER_URL}/api/messenger/send-message`,
      {
        method: "POST",
        body: JSON.stringify(req.body),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    if (response.ok) {
      const result = await response.text();

      const messageData = JSON.parse(result);
      //get the partial message....
      // Returned Message {"success":true,"message":{
      //"id":16,"senderid":"28","sendername":"nid",
      //"recevierid":"29","message":"hello ",
      //"updatedAt":"2023-07-05T03:40:40.147Z","createdAt":"2023-07-05T03:40:40.147Z"}}

      const data = {
        messageID: messageData.message.id,
        senderID: messageData.message.senderid,
        sendername: messageData.message.sendername,
        recevierID: messageData.message.recevierid,
        message: messageData.message.message,
        createdAt: new Date(messageData.message.createdAt).toLocaleString(
          "en-US"
        ),
        myUser: myUserID === messageData.message.senderid,
      };
      res.render("partials/SingleMessage", {
        layout: false,
        data: data,
      });

      // res.status(200).json({ message: "Data Saved successfully" });
    }
  } catch (error) {
    res.status(404).json({ message: "Failed to save message" });
    console.error(error);
  }

  // You can retrieve the necessary data for the partial view based on the item ID

  // Render the partial view and pass the data
  //res.render("partials/RightSide", { currentFriend: currentFriend });
});

app.post("/register", async (req, res) => {
  try {
    console.log("Registering...");
    console.log(req.body);
    //     {
    // [1]   username: 'nid7',
    // [1]   email: 'nid7@gmail.com',
    // [1]   user_password: '123456789'
    // [1] }
    let username = req.body.username;
    let user_password = req.body.user_password;
    let email = req.body.email;
    let profile_pic_path = "defaultProfile.jpeg";

    if (username && user_password) {
      console.log("Inside register");
      // console.log(
      //   "email" + email + "username: " + username,
      //   "password: " + user_password
      // );

      // Send a POST request to the API endpoint
      const response = await fetch(
        `${process.env.API_SERVER_URL}/api/messenger/user-register`,
        {
          method: "POST",
          body: JSON.stringify({
            username,
            email,
            user_password,
            profile_pic_path,
          }),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (response.ok) {
        console.log("registering Complete...");

        const result = await response.text();

        const userLogin = JSON.parse(result);

        req.session.loggedIn = true;
        req.session.username = username;
        req.session.loggedUser = userLogin.userData;

        console.log("Going to home");

        res.status(200).json({
          success: true,
          user: userLogin.userData,
        });
      } else {
        console.log("failed to register");
      }
    } else {
      console.log("eroror");
    }
  } catch (err) {
    console.error("Error in registering ", err);
  }
});

app.post("/logout", async (req, res) => {
  try {
    console.log("Attempting logginout ");
    req.session.destroy(() => {
      res.status(204).end();
    });

    console.log("Attempting logginout complete ");
  } catch (err) {
    console.error(err);
  }
});

server.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
