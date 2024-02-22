const express = require('express');
let booksdb = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
// const axios = require('axios');


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({message: "username or password are not provided"});
  }
  if (!isValid(username)) {
    return res.status(404).json({message: "username is not valid"});
  }
  users.push({username, password})
  return res.status(200).json({message: "Registered"});
});

function getBooks() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(booksdb), 100);
  });
}
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  getBooks().then((books) => {
    return res.status(200).json(books);
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  getBooks().then((books) => {
    const book = books[req.params.isbn]
    return res.status(200).json(book);
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  getBooks().then((books) => {
    for (const [isbn, book] of Object.entries(books)) {
      if (book.author === req.params.author) {
        return res.status(200).json(book);
      }
    }
    return res.status(404).json({message: "Not found"});
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  getBooks().then((books) => {
    for (const [isbn, book] of Object.entries(books)) {
      if (book.title === req.params.title) {
        return res.status(200).json(book);
      }
    }
    return res.status(404).json({message: "Not found"});
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const book = books[req.params.isbn]
  return res.status(200).json(book.review);
});


module.exports.general = public_users;
