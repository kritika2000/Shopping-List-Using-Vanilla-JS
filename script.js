/****************************** Selecting Elements **************************/

const addItemBtn = document.querySelector('.add-item-button');
const inputItem = document.querySelector('.item-input');
const filters = document.querySelector('.filter--container');
const listContainer = document.querySelector('.items--list--container');
const clearBtn = document.querySelector('.clear--btn');
const errorMsg = document.createElement('p');
const dialog = document.querySelector('.update--dialog--container');
const root = document.querySelector('.root');
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

// If Item Exists in local Storage already
function ifAlreadyExistsInStorage(text) {
  const itemsFromStorage = getItemsFromStorage() || [];
  return itemsFromStorage.includes(text);
}

// Add an items to local storage
function addItemsToStorage(text) {
  const itemsFromStorage = getItemsFromStorage() || [];
  itemsFromStorage.push(text);
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// Update an item in local storage
function updateItemInStorage(text, newText) {
  let itemsFromStorage = getItemsFromStorage() || [];
  itemsFromStorage = itemsFromStorage.map((item) =>
    item === text ? newText : item
  );
  localStorage.removeItem('items');
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
  itemList.addEventListener('click', updateItem);
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
  itemList.addEventListener('click', updateItem);
}

// Remove an Item
function removeItem(e) {
  if (
    e.target.parentElement.classList.contains('remove-item') &&
    e.target === e.target.parentElement.children[1]
  ) {
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
  if (inputItem.value === '') {
    setErrorMessageStyles("Item can't be empty");
  }
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

/************************************** Dialog Methods *************************************/

// Close Dialog
function closeDialog(e) {
  console.log(e.target, e.currentTarget);
  e.stopPropagation();
  dialog.classList.add('hidden');
  root.style.opacity = '1';
  root.style.zIndex = '1';
  document.body.removeEventListener('click', closeDialog);
}

function onFormInputChange(e) {
  e.stopPropagation();
  if (inputItem.value === '') {
    setErrorMessageStyles("Item can't be empty");
  }
  e.target.style.outline =
    e.target.value !== ''
      ? (errorMsg.remove(), 'none')
      : (e.target.insertAdjacentElement('afterend', errorMsg), '1px solid red');
}

function onFormClickHandler(e) {
  e.stopPropagation();
}

// Open Dialog
function openDialog(text, item) {
  const form = document.querySelector('.update--form');
  const input = document.querySelector('#updated-item');
  document.body.addEventListener('click', closeDialog);

  function saveChanges(e) {
    console.log(e.target, e.currentTarget);
    e.preventDefault();
    const inputValue = capitalizeText(input.value);
    if (
      inputValue === '' ||
      (item.textContent !== input.value &&
        ifAlreadyExistsInStorage(capitalizeText(inputValue)))
    ) {
      setErrorMessageStyles('Item already exists');
      input.style.outline = '1px solid red';
      input.insertAdjacentElement('afterend', errorMsg);
      return;
    }
    updateItemInStorage(item.textContent, inputValue);
    closeDialog(e);
    item.innerText = inputValue;
    form.removeEventListener('submit', saveChanges);
    form.removeEventListener('click', onFormClickHandler);
  }

  root.style.opacity = '0.2';
  root.style.zIndex = '-1';
  dialog.classList.remove('hidden');
  const crossIcon = document.querySelector('.update--dialog--container i');
  input.addEventListener('input', onFormInputChange);
  form.addEventListener('submit', saveChanges);
  form.addEventListener('click', onFormClickHandler);
  crossIcon.addEventListener('click', closeDialog);
  input.value = text;
}

function updateItem(e) {
  if (e.target.nodeName === 'I' || e.target.nodeName === 'UL') return;
  e.stopPropagation();
  console.log(e.target, e.currentTarget);
  switch (e.target.nodeName) {
    case 'LI':
      openDialog(
        e.target.firstElementChild.firstElementChild.textContent,
        e.target.firstElementChild.firstElementChild
      );
      break;
    case 'SPAN':
      openDialog(e.target.textContent, e.target);
      break;
    case 'BUTTON':
      openDialog(
        e.target.firstElementChild.textContent,
        e.target.firstElementChild
      );
      break;
  }
}

/************************************** Event Listeners *************************************/

addItemBtn.addEventListener('click', addListItemToDOM);
inputItem.addEventListener('input', onInputChange);
clearBtn.addEventListener('click', clearAllItems);
filters && filters.addEventListener('input', filterResults);

addItemsToDOMFromStorage();
checkUI();
