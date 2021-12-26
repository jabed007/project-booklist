// Get the UI Elements
let form = document.querySelector('#book-form');
let booklist = document.querySelector('#book-list');

// Define Class
// Book Class
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Class
class UI {
  static addToBookList(book) {
    let list = document.querySelector('#book-list');
    let row = document.createElement('tr');
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>`;
    list.appendChild(row);
  }
  
  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }

  static showAlert(message, className) {
    let div = document.createElement('div');
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));
    let container = document.querySelector('.container');
    let form = document.querySelector('#book-form');
    container.insertBefore(div, form);

    setTimeout(function() {
      document.querySelector('.alert').remove();
    }, 1000);
  }

  static deleteBook(target) {
    if (target.hasAttribute('href')) {
      target.parentElement.parentElement.remove();
      Store.deleteBookFromLocalStore(target.parentElement.previousElementSibling.textContent.trim());
      UI.showAlert("Book Removed", "success");
    }
  }
}

// Local Store Class
class Store {
  // Get data from local store
  static getBookFromLocalStore() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  // Store data in local store
  static addBookInLocalStore(book) {
    let books;
    books = this.getBookFromLocalStore();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  // Display data from local store
  static displayBookFromLocalStore() {
    let books;
    books = this.getBookFromLocalStore();
    books.forEach(book => {
      UI.addToBookList(book);
    });
  }

  // Delete data from local store
  static deleteBookFromLocalStore(isbn) {
    let books;
    books = this.getBookFromLocalStore();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
  }
}

// Define functions
// Add new Book Function
function newBook(e) {
  let title = document.querySelector('#title').value;
  let author = document.querySelector('#author').value;
  let isbn = document.querySelector('#isbn').value;

  //let ui = new UI();

  if (title === '' || author === '' || isbn === '') {
    UI.showAlert("Please fill all the fields first!", "error");
  } else {
    let book = new Book(title, author, isbn);
    UI.addToBookList(book);
    UI.clearFields();
    UI.showAlert("Book Added!", "success");
    //LocalStorage.addBookInLocalStorage(book);
    Store.addBookInLocalStore(book);
  }
  e.preventDefault();
}

// Remove Book Function
function removeBook(e) {
  //let ui = new UI();
  UI.deleteBook(e.target);
  e.preventDefault;
}

// Add event listener
form.addEventListener('submit', newBook);
booklist.addEventListener('click', removeBook);
document.addEventListener('DOMContentLoaded', Store.displayBookFromLocalStore());
