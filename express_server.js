const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const { getUserByEMail } = require("./helpers");

const app = express();
const PORT = 8080; // default port 8080

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(cookieSession({
  name: 'session',
  keys: ["adele"],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));


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
    
    hashedPassword: "$2a$10$ofutHXT033E1QN6ATvM9xebolfpGTWrCNjOPQmHN5IMPaQ9b1NgcS"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "jimmy@jimmy.com",
    
    hashedPassword: "$2a$10$ofutHXT033E1QN6ATvM9xebolfpGTWrCNjOPQmHN5IMPaQ9b1NgcS"
  }
};


const generateRandomString = function() {
  return (Math.random().toString(36).substr(2, 6));
};

const generateID = function() {
  return (Math.random().toString(36).substr(2, 6));
};

const urlsForUser = function(id) {
const userURLObject = {};

for (let shortURLs in urlDatabase) {
  if (urlDatabase[shortURLs].userID === id) {
    userURLObject[shortURLs] = urlDatabase[shortURLs];
  }
}
  return userURLObject;
};


app.get("/", (req, res) => {   // "/" after URL returns below
  
  const cookie = req.session;
  if (cookie.user_id) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});


// /urls ******************************************

app.get("/urls", (req, res) => { //shows main page w/ all objects (database)
  // Create Object in Object

  
  const id = req.session.user_id;
  const user = users[req.session.user_id];
  const templateVars = {
    user,
    URLS: urlsForUser(id)
  };

  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
   };

   res.redirect("/urls/" + shortURL);
});

// /urls/new **********************************************

app.get("/urls/new", (req, res) => { //shows New_URL Page
  const user = users[req.session.user_id];
  const templateVars = {
    user,
    URLS: urlDatabase
  };

  res.render("urls_new", templateVars);
});

// **********************************************

app.get("/urls/:shortURL", (req, res) => { // Shows Tiny URL
  const user = users[req.session.user_id];
  const cookie = req.session;
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = {
    user,
    shortURL,
    longURL
    //URLS: urlDatabase
  };

  // Only Show URL if correct Logged in User!!!

  if (!cookie.user_id) {
    // Not logged in
    res.redirect('/login');
  } else if (cookie.user_id === urlDatabase[shortURL].userID) {
    // Logged in and url belongs to user
    res.render('urls_show', templateVars);
  } else {
    // Url does not belong to user, return them to their list of URLS with an error message
 
    
    res.redirect('/login');
  }

});

app.post("/urls/:shortURL", (req, res) => {
  const userID = users[req.session.user_id];
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL, userID:userID.id };

  res.redirect("/urls");
});

// ************************************************

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const id = req.session.user_id;
  const usersURL = urlsForUser(id);
  const longURL = usersURL[shortURL].longURL;

  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];

  res.redirect("/urls");
});

// /logout ************************************************

app.post("/logout", (req, res) => {   //Form: posts to Login

  req.session = null;  // or...  req.session.id = null  for just the id!
  res.redirect("/urls");
});

// /register ************************************************


///  GARY Helped GARY Helped GARY Helped GARY Helped GARY Helped 
app.post('/register', (req, res) => {
  
  const email = req.body.email;
  const password = req.body.pass;
  const hashedPassword = bcrypt.hashSync(password, 10);
  //console.log("Hashed===>", hashedPassword);
  //console.log(bcrypt.compareSync(password, hashedPassword));
  
  if (!password || !email) {
    res.send("<html><body>You need to fill out both <b><a href=\"/urls\">email & password!! </a></b></body></html>\n ");
    return;
  }
  
  const user = getUserByEMail(email, users);
  if (user) {
    res.send("User Already exists!");
    return;
  }
  
  const id = generateID();
  users[id] = { id, email, hashedPassword };

  req.session.user_id = id;
  res.redirect("/urls");
  
});

app.get('/register', (req, res) => {
  const user = users[req.session.user_id];

  res.render("urls_register", { user });
});

// /login ************************************************

app.get("/login", (req, res) => {

  res.render("urls_login", { user: null });
});


app.post("/login", (req, res) => {   //Form: posts to Login
  const email = req.body.email;
  const password = req.body.password;
  //console.log(email + " " + password);
  //console.log(bcrypt.hashSync(password, 10));
  
  if (!password || !email) {
    res.send("<html><body>You need to fill out both <b><a href=\"/urls\">email & password!! </a></b></body></html>\n ");
    return;
  }
  
  const user = getUserByEMail(email, users);
  
  if (!user) {
    res.send("Email does not exist!");
    return;
  }

  if (!bcrypt.compareSync(password, user.hashedPassword)) {
    return res.send("Invalid Login!");
  }
  
  req.session.user_id = user.id;
  res.redirect("/urls");
});

// Intro ***************************************************

app.get("/intro", (req, res) => {
  res.send("Welcome... PLease Register or Login Above. 🔔");
});

app.get("/urls/:id", (req, res) => {
  res.send("Welcome... PLease Register or Login Above... 🔔");
});

//************************************************* */



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});








//  **** ask Mentor if these are security risks??
//  ******************  Possible DELETE BEFORE SUBMIT

app.get("/urls.json", (req, res) => { // shows Main as JSON
  res.json(urlDatabase);
});

app.get("/users", (req, res) => { // shows Main as JSON
  res.json(users);
});

