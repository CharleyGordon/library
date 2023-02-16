const iterateArgs = function (item, index, array) {
  this;
};
const myLibrary = [];
// supplementary information:
// cycle, publisher pages, dateOfPublishing, read
class Book {
  constructor(title, author, genres) {
    this.title = title;
    this.author = author;
    this.genres = genres;
  }
  finished() {
    if (!"wasRead" in this) {
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
    this._pages = amount;
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
    this.dateOfPublishing = date;
  }
}
