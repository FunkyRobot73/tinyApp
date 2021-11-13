const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

const app = express();
const PORT = 8080; // default port 8080

app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser())
app.set("view engine", "ejs");

const urlDatabase = {
  b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "aJ48lW"
  },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "aJ48lW"
  }
};


///  User Database
const users = {
  "aJ48lW": {
    id: "aJ48lW",
    email: "user@example.com",
    password: "1"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}


const generateRandomString = function() {
  return (Math.random().toString(36).substr(2, 6));
}

const generateID = function() {
  return (Math.random().toString(36).substr(2, 6));
}

const urlsForUser = function(id) {
  //URLs of Current UserID
  console.log(id, "<-----URLS for USERid");
  const userURLObject = {};
  for (let shortURLs in urlDatabase) {
    //console.log(shortURLs);
    if (urlDatabase[shortURLs].userID === id) {
      userURLObject[shortURLs] = urlDatabase[shortURLs]
    }
    console.log(userURLObject);
  }
  return userURLObject;
};

////function (GET USER by EMAIL)
const getUserByEMail = function (email) {
  for (const id in users) {
    const user = users[id]
    if (user.email === email) return user
  }
}



app.get("/", (req, res) => {   // "/" after URL returns below
  console.log(req);
  res.send("You hit End Point '/'    Hello!!! & Welcome");
});


// /urls ******************************************

app.get("/urls", (req, res) => { //shows main page w/ all objects (database)
  // Create Object in Object
  
  const id = req.cookies["user_id"];
  
  console.log(id, "<== This is it!");
  const templateVars = {
    user: id,
    URLS: urlsForUser(id)
  }
  console.log(templateVars, "<=====VARS");
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString()
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.cookies["user_id"]
   }
  res.redirect("/urls/" + shortURL)
});

// /urls/new **********************************************

app.get("/urls/new", (req, res) => { //shows New_URL Page
  const user = users[req.cookies["user_id"]];
  const templateVars = {
    user,
    URLS: urlDatabase
  };
  res.render("urls_new", templateVars);
});

// **********************************************

app.get("/urls/:shortURL", (req, res) => { // Shows Tiny URL
  const user = users[req.cookies["user_id"]];
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL].longURL
  console.log("===============longURL", longURL);
  const templateVars = {
    user,
    shortURL,
    longURL
    //URLS: urlDatabase
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  const userID = users[req.cookies["user_id"]];
  const shortURL = req.params.shortURL
  const longURL = req.body.longURL
  urlDatabase[shortURL] = { longURL, userID:userID.id };
  //console.log("===============longURL", longURL);
  console.log(urlDatabase, "<---Database");
  res.redirect("/urls");
});

// ************************************************

app.get("/u/:shortURL", (req, res) => {
  
  res.redirect(urlDatabase[req.params.shortURL]);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL
  delete urlDatabase[shortURL]
  res.redirect("/urls")
})

// /logout ************************************************

app.get('/logout', (req, res) => {
  res.render("/logout")
});

app.post("/logout", (req, res) => {   //Form: posts to Login
  const userName = req.body.username
  console.log(userName);
  res.clearCookie("user_id");
  res.redirect("/urls")
});

// /register ************************************************


///  GARY Helped GARY Helped GARY Helped GARY Helped GARY Helped 
app.post('/register', (req, res) => {
  
  const email = req.body.email
  const password = req.body.pass
  
  if (!password || !email) {
    res.send("<html><body>You need to fill out both <b><a href=\"/urls\">email & password!! </a></b></body></html>\n ");
    return
  }
  
  const user = getUserByEMail(email)
  if (user) {
    res.send("User Already exists!");
    return
  }
  
  const id = generateID();
  users[id] = { id, email, password }
  // delete cookie
  //res.clearCookie("username");
  res.cookie("user_id", id);
  res.redirect("/urls")
  
});

app.get('/register', (req, res) => {
  const user = users[req.cookies["user_id"]];
  res.render("urls_register", { user })
});

// /login ************************************************

app.get("/login", (req, res) => {
  //const username = req.body.email
  res.render("urls_login", { user: null })
})


app.post("/login", (req, res) => {   //Form: posts to Login
  //grabs email & password from login Page
  const email = req.body.email
  const password = req.body.password
  console.log(email + " " + password);
  
  if (!password || !email) {
    res.send("<html><body>You need to fill out both <b><a href=\"/urls\">email & password!! </a></b></body></html>\n ");
    return
  }
  
  // if email && password doesn't exist ==> try again
  const user = getUserByEMail(email)
  console.log(user);
  
  if (!user) {
    res.send("Email does not exist!");
    return
  }

  if (user.password !== password) {
    return res.send("Invalid Login!");
  }
  
  res.cookie("user_id", user.id);
  res.redirect("/urls")
});

// Intro ***************************************************

app.get("/intro", (req, res) => {
  res.send("PLease Register or Login Above...");
});

app.get("/urls/:id", (req, res) => {
  res.send("PLease Register or Login Above...");
});

//************************************************* */



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});








//  **** ask if these are security risks??
//  ******************  Possible DELETE BEFORE SUBMIT

app.get("/urls.json", (req, res) => { // shows Main as JSON
  res.json(urlDatabase);
});

app.get("/users", (req, res) => { // shows Main as JSON
  res.json(users);
});

//Nov.12 6:25pm