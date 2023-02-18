const myLibrary = {};
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
    if (optional === "read" && optional[optional] === true) {
      myLibrary[key].wasRead = true;
    }
    const detail = document.createElement("li");
    const detailName = document.createElement("span");
    const detailValue = document.createElement("span");
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
    return item.value !== "";
  }
  return array.filter(notEmpty);
};
const setOptionals = function (book, filledOptionals) {
  book.optionals = {};
  for (let i of filledOptionals) {
    book[i.id] = i.value;
    book["optionals"][i.id] = i.value;
  }
  //
  return listOptionals(book.key, book.optionals);
};
const addBook = function (event) {
  event.preventDefault();
  console.log(event);
  // console.log(event.target.querySelectorAll("input"));
  const inputs = Array.from(event.target.querySelectorAll("input"));
  // console.log(inputs);
  const optionals = getOptional(inputs);
  // console.log("Optional inputs: ", optionals);
  const filledOptionals = pickNotEmpty(optionals);
  console.log("filled optionals: ", filledOptionals);
  const values = getValues(inputs).slice(0, 3);
  // console.log(values);
  const book = toggleConstructor(...values);
  if (Boolean(filledOptionals.length)) {
    return setOptionals(book, filledOptionals);
  }
  return removeOptionals(book.key);
};
const markAsRead = function (event) {
  if (!event.target.matches(".mark-as-read")) return;
  const book = event.target.closest(".book");
  book.classList.add("read");
  const key = book.title;
  const parent = event.target.parentElement;
  parent.removeChild(event.target);
  myLibrary[key].wasRead = true;
};

bookForm.addEventListener("submit", addBook);
document.body.addEventListener("transitionend", markAsRead);
