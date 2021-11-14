const getUserByEMail = function (email, database) {
  for (const id in users) {
    const user = users[id];
    if (user.email === email) return user
  }
}