// Selecting Elements
const addItemBtn = document.querySelector('.add-item-button');
const inputItem = document.querySelector('.item-input');
const filters = document.querySelector('.filter--container');
const listContainer = document.querySelector('.items--list--container');
const clearBtn = document.querySelector('.clear--btn');
const icons = document.querySelectorAll('i');
const errorMsg = document.createElement('p');

// Set Error Message Styles
function setErrorMessageStyles() {
  errorMsg.textContent = "Item field can't be empty";
  errorMsg.setAttribute('class', 'error');
  errorMsg.style.color = 'red';
  errorMsg.style.fontSize = '.8em';
}
setErrorMessageStyles();

// Capitalize First Letter
function capitalizeText(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
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

// Adding List Items
function createListItem(e) {
  e.preventDefault();
  if (inputItem.value === '') {
    inputItem.insertAdjacentElement('afterend', errorMsg);
    return;
  }
  // Creating Elements
  let list;
  list = listContainer.children.length
    ? document.querySelector('ul')
    : document.createElement('ul');
  list.setAttribute('class', 'item-list'), listContainer.appendChild(list);
  const listItem = document.createElement('li');
  const button = createButton('remove-item btn-link text-red');
  const icon = createIcon('fas fa-solid fa-circle-xmark');
  const span = document.createElement('span');

  if (listContainer.children.length) {
    listContainer.style.display = 'block';
    clearBtn.style.display = 'block';
    filters.style.display = 'block';
  }

  // Setting Attributes
  listItem.setAttribute('class', 'item');
  span.append(capitalizeText(inputItem.value));
  button.append(span, icon);
  listItem.appendChild(button);
  list.appendChild(listItem);
  inputItem.value = '';

  // Event Listeners
  icon.addEventListener('click', removeItem);
}

function removeItem(e) {
  const parentListItem = e.target.parentElement.parentElement;
  parentListItem.remove();
  const listItems = document.querySelectorAll('.item-list li');
  if (!listItems.length) {
    listContainer.style.display = 'none';
    clearBtn.style.display = 'none';
    filters.style.display = 'none';
  }
}

function onInputChange(e) {
  e.target.style.outline =
    e.target.value !== ''
      ? (errorMsg.remove(), 'none')
      : (inputItem.insertAdjacentElement('afterend', errorMsg),
        '1px solid red');
}

// Add Event Listeners
addItemBtn.addEventListener('click', createListItem);
inputItem.addEventListener('input', onInputChange);
