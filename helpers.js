
const getUserByEMail = function (email, users) {
  for (const id in users) {
    const user = users[id];
    if (user.email === email) return user
  }
}

module.exports = { getUserByEMail };

//module.exports = { getUserByEMail:getUserByEMail };