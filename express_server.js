const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const generateRandomString = function() {
  return (Math.random().toString(36).substr(2, 6));
}


app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!!! & Welcome");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World!</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase }
  console.log(templateVars);
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]/* What goes here? */ };
  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  const shortURL = generateRandomString()
  urlDatabase[shortURL] = req.body.longURL// const longURL = ...
  //res.send("Ok");         // Respond with 'Ok' (we will replace this)
  res.redirect("/urls/" + shortURL)
});

app.get("/u/:shortURL", (req, res) => {
  
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req,res) => {
  // console.log(req.body);
  // delete urlDatabase[req.params.shortURL]
  // res.redirect("/urls")
  // console.log("Hello");
  const shortURL = req.params.shortURL
  console.log("before");
  console.log(urlDatabase);
  delete urlDatabase[shortURL]
  console.log("after");
  console.log(urlDatabase);
  res.redirect("/urls")
})
