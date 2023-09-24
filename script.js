/****************************** Selecting Elements **************************/

const addItemBtn = document.querySelector('.add-item-button');
const inputItem = document.querySelector('.item-input');
const filters = document.querySelector('.filter--container');
const listContainer = document.querySelector('.items--list--container');
const clearBtn = document.querySelector('.clear--btn');
const errorMsg = document.createElement('p');
let itemList;

/************************ Set Error Message Styles ************************/

function setErrorMessageStyles(text) {
  errorMsg.textContent = text;
  errorMsg.setAttribute('class', 'error');
  errorMsg.style.color = 'red';
  errorMsg.style.fontSize = '.8em';
}

/****************************** Utility Functions **************************/

// Capitalize First Letter
function capitalizeText(text) {
  let words = text.trim().split(' ');
  words = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  console.log(words);
  return words.join(' ');
}

// Create Button
function createButton(classes) {
  const button = document.createElement('button');
  button.setAttribute('class', classes);
  return button;
}

// Create Icon
function createIcon(classes) {
  const icon = document.createElement('i');
  icon.setAttribute('class', classes);
  return icon;
}

// CheckUI
function checkUI() {
  const itemsFromStorage = getItemsFromStorage();
  if (!itemsFromStorage) removeAllItemsFromStorage();
  itemList && itemList.children.length
    ? ((listContainer.style.display = 'block'),
      (clearBtn.style.display = 'block'),
      (filters.style.display = 'block'))
    : ((listContainer.style.display = 'none'),
      (clearBtn.style.display = 'none'),
      (filters.style.display = 'none'));
}

/****************************** Local Storage Functions **************************/

// Get all items from storage
function getItemsFromStorage() {
  return JSON.parse(localStorage.getItem('items'));
}

// Add an items to local storage
function addItemsToStorage(text) {
  const itemsFromStorage = getItemsFromStorage() || [];
  itemsFromStorage.push(text);
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// Remove an item from local storage
function removeItemFromStorage(itemValue) {
  const itemsFromStorage = getItemsFromStorage();
  const newItems = itemsFromStorage.filter((item) => item !== itemValue);
  localStorage.removeItem('items');
  localStorage.setItem('items', JSON.stringify(newItems));
}

function removeAllItemsFromStorage() {
  localStorage.clear();
}

/********************************** DOM Updation ***********************************/

// create list item
function createListItem(text) {
  let list;
  list = listContainer.children.length
    ? document.querySelector('ul')
    : document.createElement('ul');
  list.setAttribute('class', 'item-list'), listContainer.appendChild(list);
  itemList = list;
  const listItem = document.createElement('li');
  const button = createButton('remove-item btn-link text-red');
  const icon = createIcon('fas fa-solid fa-circle-xmark');
  const span = document.createElement('span');

  // Setting Attributes
  listItem.setAttribute('class', 'item');
  span.append(text);
  button.append(span, icon);
  listItem.appendChild(button);
  list.appendChild(listItem);
  return listItem;
}

// Add List Items
function addItemsToDOMFromStorage() {
  const itemsFromStorage = getItemsFromStorage();
  if (!itemsFromStorage || !itemsFromStorage.length) return;
  const items = itemsFromStorage;
  items.forEach((text) => {
    const listItem = createListItem(text);
    itemList.appendChild(listItem);
  });
  itemList.addEventListener('click', removeItem);
}

// Adding List Items
function addListItemToDOM(e) {
  e.preventDefault();
  if (inputItem.value === '') {
    setErrorMessageStyles("Item can't be empty");
    inputItem.insertAdjacentElement('afterend', errorMsg);
    return;
  }
  const inputValue = capitalizeText(inputItem.value);
  const itemsFromStorage = getItemsFromStorage();
  if (itemsFromStorage && itemsFromStorage.includes(inputValue)) {
    setErrorMessageStyles('Item already exists');
    inputItem.style.outline = '1px solid red';
    inputItem.insertAdjacentElement('afterend', errorMsg);
    return;
  }
  createListItem(inputValue);
  addItemsToStorage(inputValue);
  inputItem.value = '';
  checkUI(itemList.children);
  itemList.addEventListener('click', removeItem);
}

// Remove an Item
function removeItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    const itemToRemove = e.target.parentElement.firstElementChild.textContent;
    e.target.parentElement.parentElement.remove();
    removeItemFromStorage(itemToRemove);
    checkUI();
  }
}

// Clear All Items
function clearAllItems() {
  const itemList = document.querySelector('.item-list');
  // OR we could have done -> listContainer.innerHTML = ''(Not a performant way)
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  checkUI();
  removeAllItemsFromStorage();
}

// Show Error Message
function onInputChange(e) {
  e.target.style.outline =
    e.target.value !== ''
      ? (errorMsg.remove(), 'none')
      : (inputItem.insertAdjacentElement('afterend', errorMsg),
        '1px solid red');
}

/************************************ Filter Results ***********************************/

// Apply Filters
function filterResults(e) {
  const filter = e.target.value.toLowerCase();
  const listItems = document.querySelectorAll('.item-list li');
  if (filter === '') {
    listItems.forEach((item) => (item.style.display = ''));
    return;
  }
  listItems.forEach((item) => {
    item.style.display =
      !item.firstElementChild.firstElementChild.textContent
        .toLowerCase()
        .includes(filter) && 'none';
  });
}

/************************************** Event Listeners *************************************/

addItemBtn.addEventListener('click', addListItemToDOM);
inputItem.addEventListener('input', onInputChange);
clearBtn.addEventListener('click', clearAllItems);
filters && filters.addEventListener('input', filterResults);

addItemsToDOMFromStorage();
checkUI();
