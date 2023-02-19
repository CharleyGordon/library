const book1 = {
  title: "Example book",
  author: "Unknown",
  genres: ["genre1", "genre2"],
  key: "Example book by Unknown",
};
const book2 = {
  title: "Example book2",
  author: "Unknown2",
  genres: ["genre1", "genre2"],
  key: "Example book2 by Unknown2",
};
const myLibrary = { book1, book2 };
// supplementary information:
// cycle, publisher pages, dateOfPublishing, read
class Book {
  constructor(title, author, genres) {
    this.title = title;
    this.author = author;
    this.genres = genres.trim().split(",");
    this.key = `${this.title} by ${this.author}`;
    if (!(this.key in myLibrary)) {
      //not sure why but I need to wrap my logical check inside beackets
      const key = this.key;
      myLibrary[key] = this;
      addDOMBook(this);
    }
  }
  finished() {
    if (!this.wasRead) {
      this.wasRead = true;
    }
  }
  set publisher(title) {
    this._publisher = title;
    // adding an underscore to avoid recursion. We still reffer in getter to this property as <._attribute>
  }
  get publisher() {
    return this._publisher;
  }
  set pages(amount) {
    this._pages = Number(amount);
  }
  get pages() {
    return this._pages;
  }
  set cycle(name) {
    this._cycle = name;
  }
  get cycle() {
    return this._cycle;
  }
  set dateOfPublishing(date) {
    this._dateOfPublishing = date;
  }
  get dateOfPublishing() {
    return this._dateOfPublishing;
  }
  set description(text) {
    this._description = text;
  }
  get description() {
    return this._description;
  }
}
Book.prototype.wasRead = false;
// took away wasRead attribute from constructor to avoid redundancy
const bookForm = document.querySelector(".add-book");
const closeForm = document.querySelector(".close-form");
const library = document.getElementById("library");
const template = document.querySelector(".book-template");
// DOM
const addDOMBook = function (object) {
  function addGenres(array) {
    for (let i of array) {
      const genre = document.createElement("li");
      genre.classList.add("genre");
      genre.textContent = i;
      genres.appendChild(genre);
    }
  }

  const content = template.content.cloneNode("true");
  const book = content.querySelector(".book");
  const title = content.querySelector(".title");
  const author = content.querySelector(".author");
  const genres = content.querySelector(".genres");
  console.log(
    `title: ${object["title"]}, author: ${object["author"]}, genres: ${object["genres"]}}`
  );
  book.title = object["key"];
  title.textContent = object["title"];
  author.textContent = object["author"];
  addGenres(object["genres"]);
  library.appendChild(content);
};
const listOptionals = function (key, optionals) {
  const book = document.querySelector(`.book[title="${key}"]`);
  const detailsList = book.querySelector(".details-list");
  console.log(book, detailsList);
  for (let optional of Object.keys(optionals)) {
    if (optional === "read" && optionals[optional] === "true") {
      myLibrary[key].wasRead = true;
      const toRemove = book.querySelector(".mark-as-read");
      book.removeChild(toRemove);
      book.classList.add("read");
    }
    const detail = document.createElement("li");
    const detailName = document.createElement("span");
    const detailValue = document.createElement("span");
    detailValue.dataset["detail"] = optional;
    detailName.classList.add("detail-name");
    detailValue.classList.add("detail.value");
    detailName.textContent = `${optional}: `;
    detailValue.textContent = optionals[optional];
    detail.appendChild(detailName);
    detail.appendChild(detailValue);
    console.log(detail);
    detailsList.appendChild(detail);
  }
};
const removeOptionals = function (key) {
  const book = document.querySelector(`.book[title="${key}"]`);
  const bookDetails = book.querySelector(".book-details");
  console.log(book, bookDetails);
  book.removeChild(bookDetails);
};
// deleting book both from library and DOM
const deleteBook = function (event) {
  if (!event.target.matches("button.delete-button")) return;
  console.log(event.target);
  const removedBook = event.target.closest(".book");
  const bookKey = removedBook.title;
  delete myLibrary[bookKey];
  // calling global variables
  library.removeChild(removedBook);
};
// book initiation on load
const initBooks = function () {
  const books = Object.keys(myLibrary);
  const bookNumber = books.length;
  if (!Boolean(bookNumber)) return;
  for (let book of books) {
    addDOMBook(myLibrary[book]);
  }
};
initBooks();
// Object manipulations
const toggleConstructor = function (...args) {
  return new Book(...args);
};
const getValues = function (object) {
  const attributes = [];
  for (let i of object) {
    attributes.push(i.value);
  }
  return attributes;
};
const getOptional = function (attributes) {
  return attributes.filter((item) => !item.required);
};
const pickNotEmpty = function (array) {
  function notEmpty(item) {
    console.log(item);
    return item.value !== "" && !item.matches('[type="radio"]:not(:checked)');
  }
  return array.filter(notEmpty);
};
const setOptionals = function (book, filledOptionals) {
  book.optionals = {};
  for (let i of filledOptionals) {
    book[i.name] = i.value;
    book["optionals"][i.name] = i.value;
  }
  //
  return listOptionals(book.key, book.optionals);
};
const addBook = function (event) {
  event.preventDefault();
  console.log(event);
  // console.log(event.target.querySelectorAll("input"));
  const inputs = Array.from(event.target.querySelectorAll("input"));
  console.log("inputs: ", inputs);
  const optionals = getOptional(inputs);
  // console.log("Optional inputs: ", optionals);
  const filledOptionals = pickNotEmpty(optionals);
  for (let i of filledOptionals) {
    console.log(i.type, i.checked);
  }
  console.log("filled optionals: ", filledOptionals);
  const values = getValues(inputs).slice(0, 3);
  // console.log(values);
  const book = toggleConstructor(...values);
  if (Boolean(filledOptionals.length)) {
    return setOptionals(book, filledOptionals);
  }
  return removeOptionals(book.key);
};
const getChecked = function (filledOptionals) {
  for (let optional in filledOptionals) {
    if (optional.type === "radio") {
    }
  }
};
const markAsRead = function (event) {
  if (!event.target.matches(".mark-as-read")) return;
  const book = event.target.closest(".book");
  book.classList.add("read");
  const key = book.title;
  const text = book.querySelector(`[data-detail="read"]`);
  const parent = event.target.parentElement;
  parent.removeChild(event.target);
  text.textContent = "true";
  myLibrary[key].wasRead = true;
};
// anchor redirection
bookForm.addEventListener("submit", addBook); //adding book with form
document.body.addEventListener("transitionend", markAsRead); //vanishing mark as read button
document.body.addEventListener("click", deleteBook);
