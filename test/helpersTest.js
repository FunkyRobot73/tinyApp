const { assert } = require('chai');

const { getUserByEMail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEMail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    console.log("User===>", user);
    // Write your assert statement here
    assert(user.id === expectedUserID, 'both are equal');
  });

  it('Should return undefined with non-existent email.', function () {
    const user = getUserByEMail("dope@dope.com", testUsers)
    //const expectedUserID = "undefined";
    console.log("User===>", user);
    assert.equal(user, undefined)
  })

});
