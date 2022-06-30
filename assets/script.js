let shelf = [];
const UPDATE_SHELF = 'update-shelf';

document.addEventListener('DOMContentLoaded', () => {
  const addNewBook = document.querySelector('#new-book');
  addNewBook.addEventListener('submit', (e) => {
    e.preventDefault();
    addBook();
    alertDialog('add');
  });
  const findBookBtn = document.querySelector('#find-book');
  findBookBtn.addEventListener('submit', (e) => {
    e.preventDefault();
    const notFinished = document.querySelector('#not-yet-finished');
    const finished = document.querySelector('#finished');

    notFinished.innerHTML = '';
    finished.innerHTML = '';

    const filteredBook = filterBook();

    for (const item of filteredBook) {
      const bookElement = makeBook(item);
      if (item.isComplete) {
        finished.append(bookElement);
      } else {
        notFinished.append(bookElement);
      }
    }
  })
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

const addBook = () => {
  const addTitle = document.querySelector('#input-title');
  const addAuthor = document.querySelector('#input-author');
  const addYear = document.querySelector('#input-year');
  const checkComplete = document.querySelector('#input-is-complete');
  const newBook = {
    id: +new Date(),
    title: addTitle.value,
    author: addAuthor.value,
    year: addYear.value,
    isComplete: checkComplete.checked
  };
  addTitle.value = '';
  addAuthor.value = '';
  addYear.value = '';
  checkComplete.checked = false;
  shelf.push(newBook);
  document.dispatchEvent(new Event(UPDATE_SHELF));
  saveData();
};

document.addEventListener(UPDATE_SHELF, () => {
  const notFinished = document.querySelector('#not-yet-finished');
  const finished = document.querySelector('#finished');

  notFinished.innerHTML = '';
  finished.innerHTML = '';

  for (const item of shelf) {
    const bookElement = makeBook(item);
    if (item.isComplete) {
      finished.append(bookElement);
    } else {
      notFinished.append(bookElement);
    }
  }
});

const makeBook = (o) => {
  const title = document.createElement('h2');
  title.classList.add('book-title');
  title.textContent = o.title;
  const author = document.createElement('p');
  author.textContent = o.author;
  const year = document.createElement('p');
  year.textContent = o.year;

  const container = document.createElement('div');
  container.classList.add('book-container');
  container.append(title, author, year);
  container.setAttribute('id', o.id);


  if (o.isComplete) {
    const unfinishBtn = document.createElement('button');
    unfinishBtn.classList.add('move');
    unfinishBtn.textContent = 'tandai belum dibaca';
    unfinishBtn.addEventListener('click', () => {
      setUnfinish(o.id);
      alertDialog('change');
    });
    container.append(unfinishBtn, removeItemBtn(o.id));
  } else {
    const finishBtn = document.createElement('button');
    finishBtn.classList.add('move');
    finishBtn.textContent = 'tandai sudah dibaca';
    finishBtn.addEventListener('click', () => {
      setFinish(o.id);
      alertDialog('change');
    });
    container.append(finishBtn, removeItemBtn(o.id));
  }
  return container;
};

const removeItemBtn = (bookId) => {
  const removeBtn = document.createElement('button');
  removeBtn.classList.add('remove');
  removeBtn.textContent = 'hapus';
  removeBtn.addEventListener('click', () => {
    if(confirm("Apakah anda yakin ingin hapus item?")) {
      setRemoveBook(bookId);
      alertDialog('delete');
    }
  });
  return removeBtn;
};

const setFinish = (bookId) => {
  const target = findBookById(bookId);
  if (target == null) return;
  target.isComplete = true;
  document.dispatchEvent(new Event(UPDATE_SHELF));
  saveData();
};

const setUnfinish = (bookId) => {
  const target = findBookById(bookId);
  if (target == null) return;
  target.isComplete = false;
  document.dispatchEvent(new Event(UPDATE_SHELF));
  saveData();
};

const setRemoveBook = (bookId) => {
  const targetIndex = findBookIndexById(bookId);
  if (targetIndex == -1) return;
  shelf.splice(targetIndex, 1);
  document.dispatchEvent(new Event(UPDATE_SHELF));
  saveData();
};

const findBookById = (bookId) => {
  for (const item of shelf) {
    if (item.id === bookId) {
      return item;
    }
  }
  return null;
};

const findBookIndexById = (bookId) => {
  for (const index in shelf) {
    if (shelf[index].id === bookId) {
      return index;
    }
  }
  return -1;
};

const filterBook = () => {
  const findInput = document.querySelector('#input-find-book');
  const key = findInput.value;
  let result;
  if (key) {
    result = shelf.filter(item => {
      return item.title.toLowerCase().includes(key.toLowerCase());
    });
  } else {
    result = shelf;
  }
  return result;
};

const saveData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(shelf);
    localStorage.setItem("SHELF", parsed);
  }
};

const isStorageExist = () => {
  if (typeof (Storage) === undefined) {
    alert('Browser tidak mendukung local storage!');
    return false;
  }
  return true;
};

const loadDataFromStorage = () => {
  const stringData = localStorage.getItem("SHELF");
  let data = JSON.parse(stringData);

  if (data !== null) {
    for (const item of data) {
      shelf.push(item);
    }
  }
  document.dispatchEvent(new Event(UPDATE_SHELF));
};

const alertDialog = (keyword) => {
  const dialogBox = document.querySelector('.alert-container');
  const dialogMessage = document.querySelector('.dialog-message');
  if(dialogBox.classList.contains('hidden')) {
    dialogBox.classList.remove('hidden')
  }
  if (keyword === 'add') {
    dialogBox.style.backgroundColor = '#4dff59';
    dialogMessage.textContent = 'Buku ditambahkan';
  } else if (keyword === 'change') {
    dialogBox.style.backgroundColor = '#ffd54d';
    dialogMessage.textContent = 'Buku dipindahkan';
  } else if (keyword === 'delete') {
    dialogBox.style.backgroundColor = '#ff4d4d';
    dialogMessage.textContent = 'Buku dihapus';
  }
}

const closeAlert = document.querySelector('.close-alert');
closeAlert.addEventListener('click', () => {
  const dialogBox = document.querySelector('.alert-container');
  if(!dialogBox.classList.contains('hidden')) {
    dialogBox.classList.add('hidden')
  }
})