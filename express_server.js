const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
//const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 8080; // default port 8080

app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
//app.use(cookieParser())

app.use(cookieSession({
  name: 'session',
  keys: ["adele"],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


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
    
    hashedPassword: "$2a$10$ofutHXT033E1QN6ATvM9xebolfpGTWrCNjOPQmHN5IMPaQ9b1NgcS"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "jimmy@jimmy.com",
    
    hashedPassword: "$2a$10$ofutHXT033E1QN6ATvM9xebolfpGTWrCNjOPQmHN5IMPaQ9b1NgcS"
  }
}


const generateRandomString = function() {
  return (Math.random().toString(36).substr(2, 6));
}

const generateID = function() {
  return (Math.random().toString(36).substr(2, 6));
}

const urlsForUser = function(id) {
const userURLObject = {};

for (let shortURLs in urlDatabase) {
  if (urlDatabase[shortURLs].userID === id) {
    userURLObject[shortURLs] = urlDatabase[shortURLs]
  }
}
  return userURLObject;
};

////function (GET USER by EMAIL)

const getUserByEMail = function (email, database) {
  for (const id in users) {
    const user = users[id];
    if (user.email === email) return user
  }
}



app.get("/", (req, res) => {   // "/" after URL returns below
  //console.log(req);
  res.send("You hit End Point '/'    Hello!!! & Welcome");
});


// /urls ******************************************

app.get("/urls", (req, res) => { //shows main page w/ all objects (database)
  // Create Object in Object

  console.log("poop");
  //const id = req.session.user_id; // Totally guessing here *gnort
  const id = req.session.user_id;
  const user = users[req.session.user_id];

  
  //console.log(id, "<== This is it!");
  const templateVars = {
    user,
    URLS: urlsForUser(id)
  }
  //console.log(templateVars, "<=====VARS");
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString()
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
   }
  res.redirect("/urls/" + shortURL)
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
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  //console.log("===============longURL", longURL);
  const templateVars = {
    user,
    shortURL,
    longURL
    //URLS: urlDatabase
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  const userID = users[req.session.user_id];
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL, userID:userID.id };
  //console.log("===============longURL", longURL);
  //console.log(urlDatabase, "<---Database");
  res.redirect("/urls");
});

// ************************************************

app.get("/u/:shortURL", (req, res) => {
  //console.log("What is this??????");
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
})

// /logout ************************************************

app.post("/logout", (req, res) => {   //Form: posts to Login
  //const userName = req.body.username
  req.session = null;  // or...  req.session.id = null  for just the id!
  res.redirect("/urls");
});

// /register ************************************************


///  GARY Helped GARY Helped GARY Helped GARY Helped GARY Helped 
app.post('/register', (req, res) => {
  
  const email = req.body.email;
  const password = req.body.pass;
  const hashedPassword = bcrypt.hashSync(password, 10);
  console.log("Hashed===>", hashedPassword);
  console.log(bcrypt.compareSync(password, hashedPassword));
  
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
  users[id] = { id, email, hashedPassword }
  // delete cookie
  //res.clearCookie("username");
  //res.cookie("user_id", id);   *gnort
  req.session.user_id = id;
  res.redirect("/urls");
  
});

app.get('/register', (req, res) => {
  const user = users[req.session.user_id];
  res.render("urls_register", { user });
});

// /login ************************************************

app.get("/login", (req, res) => {
  //const username = req.body.email
  res.render("urls_login", { user: null });
})


app.post("/login", (req, res) => {   //Form: posts to Login
  //grabs email & password from login Page
  const email = req.body.email;
  const password = req.body.password;
  console.log(email + " " + password);
  console.log(bcrypt.hashSync(password, 10));
  //bcrypt.compareSync(password, hashedPassword);
  //console.log("Encrypted???", bcrypt.compareSync(password, hashedPassword));
  
  if (!password || !email) {
    res.send("<html><body>You need to fill out both <b><a href=\"/urls\">email & password!! </a></b></body></html>\n ");
    return
  }
  
  // if email && password doesn't exist ==> try again
  const user = getUserByEMail(email);
  //console.log("userPassword ===>" + user.hashedPassword + "password======>" + password);
  
  if (!user) {
    res.send("Email does not exist!");
    return
  }

  

  if (!bcrypt.compareSync(password, user.hashedPassword)) {
    return res.send("Invalid Login!");
  }
  
  req.session.user_id = user.id;
  //res.cookie("user_id", user.id);
  res.redirect("/urls");
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








//  **** ask Mentor if these are security risks??
//  ******************  Possible DELETE BEFORE SUBMIT

app.get("/urls.json", (req, res) => { // shows Main as JSON
  res.json(urlDatabase);
});

app.get("/users", (req, res) => { // shows Main as JSON
  res.json(users);
});

//Nov.12 6:25pm