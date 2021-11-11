const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

const app = express();
const PORT = 8080; // default port 8080

app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cookieParser())

const generateRandomString = function() {
  return (Math.random().toString(36).substr(2, 6));
}


app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/", (req, res) => {   // "/" after URL returns below
  res.send("You hit End Point '/'    Hello!!! & Welcome");
});


app.get("/urls.json", (req, res) => { // shows Main as JSON
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {  // responds with HTML below
  res.send("<html><body>Hello <b>World!</b></body></html>\n");
});

// BROWSE see all URLs
// GET /urls

app.get("/urls", (req, res) => { //shows main page w/ all objects (database)
  // Create Object in Object
  const templateVars = { 
  username: req.cookies["username"],
  URLS: urlDatabase }
  //console.log(templateVars);
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => { //shows New_URL Page
  const templateVars = { 
    username: req.cookies["username"]/* What goes here? */ };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => { // Shows Tiny URL
  const templateVars = { 
    username: req.cookies["username"],
    shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]/* What goes here? */ };
  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  const shortURL = generateRandomString()
  urlDatabase[shortURL] = req.body.longURL// const longURL = ...
  //res.send("Ok");         // Respond with 'Ok' (we will replace this)
  res.redirect("/urls/" + shortURL)
});

app.get("/u/:shortURL", (req, res) => {
  urlDatabase[shortURL] = longURL
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req,res) => {
  const shortURL = req.params.shortURL
  delete urlDatabase[shortURL]
  res.redirect("/urls")
})

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  //console.log(shortURL)
  const longURL = req.body.longURL
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls");
});

app.get('/login', (req, res) => {
  res.render("/urls")
});
  
app.post("/login", (req, res) => {   //Form: posts to Login
  const userName = req.body.username
  console.log(userName);
  res.cookie("username", userName);
  res.redirect("/urls")
});

app.get('/logout', (req, res) => {
  res.render("/logout")
});

app.post("/logout", (req, res) => {   //Form: posts to Login
  const userName = req.body.username
  console.log(userName);
  res.clearCookie("username", userName);
  res.redirect("/urls")
});

