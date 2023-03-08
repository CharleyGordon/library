class Book {
  static library = {};
  #details = {};
  constructor(obj) {
    this.#details = obj;
    const { title, author } = obj;
    const key = `${title} by ${author}. Publish date: ${published}`;
    Book.library[key] = this;
    queries.createBook(this.details);
  }
  get details() {
    const details = Object.assign({}, this.#details);
    return details;
  }
  set detail(item) {
    const { name, value } = item;
    this.#details[name] = value;
  }
  getProperty(property) {
    return (this.#details[property] =
      this.#details[property] ?? "no such property yet");
  }
}
const queries = {
  objects: {
    form: document.querySelector("form"),
    bookTemplate: document.querySelector("template"),
  },
  exceptions: {},
  getData: (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const fields = {};
    for (let [key, value] of formData) {
      if (value === "") continue;
      if (key === "genres") {
        console.trace(key);
        value = value.split(",");
        console.dir(value);
      }
      if (key === "published") {
        value = new Date(value).toLocaleDateString();
      }
      fields[key] = value;
    }
    const book = new Book(fields);
  },
  fillBookdetails: (object, book) => {
    for (let [detail, value] of Object.entries(book)) {
      console.dir(detail);
      console.dir(object.querySelector(`${detail}`));
      if (detail === "read") {
        if (value === "book read") {
          value = "You've read this book";
        } else {
          value = "You Haven't read this book yet";
        }
      }
      if (detail === "genres") {
        for (const i of value) {
          const genre = document.createElement("span");
          genre.classList.add("genre");
          genre.textContent = i.trim();
          object.querySelector(".genres").appendChild(genre);
        }
        continue;
      }
      try {
        object.querySelector(`.${detail}`).textContent = value;
      } catch (err) {
        console.error(detail);
      }
    }
  },
  createBook: (book) => {
    const bookContainer =
      queries.objects.bookTemplate.content.cloneNode("true");
    const div = document.createElement("div");

    div.appendChild(bookContainer);
    document.body.appendChild(div);
    queries.fillBookdetails(div, book);
    div.querySelector(`.descriptions`).addEventListener("click", (event) => {
      const toEdit = event.target.parentElement.querySelector(".to-edit");

      if (
        event.target.matches(`a[href="#edit"]`) &&
        !toEdit.classList.contains("editing")
      ) {
        event.target.dataset.save = "";
        toEdit.setAttribute("contenteditable", "");
        toEdit.classList.add("editing");
        toEdit.focus();
        return;
      }
      if (event.target.matches("[data-save]")) {
        console.dir(toEdit.textContent);
        delete event.target.dataset.save;
        toEdit.classList.remove("editing");
      }
      if (event.target.matches(`a[href="#cancel"]`)) {
        toEdit.removeAttribute("contenteditable");
        toEdit.classList.remove("editing");
      }
    });
  },
  init: () => {
    queries.objects.form.addEventListener("submit", queries.getData);
  },
};
queries.init();
