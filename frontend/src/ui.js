export function addEventListener(selector, eventName, callback) {
  document.querySelector(selector).addEventListener(eventName, function(event) {
    event.preventDefault();
    callback();
  });
}

export function showElement(element) {
  element.style.display = '';
}

export function hideElement(element) {
  element.style.display = 'none';
}

export function showHeader(text) {
  const headerElement = document.querySelector('#header');
  headerElement.textContent = text;
  showElement(headerElement);
}

export function showMessage(message) {
  document.querySelector('#message').textContent = message;
  showElement(document.querySelector('#message-panel'));
}

export function hideMessage() {
  document.querySelector('#message').textContent = '...';
  hideElement(document.querySelector('#message-panel'));
}

export function showRoleSelection() {
  showElement(document.querySelector('#role-selection'));
}

export function hideRoleSelection() {
  hideElement(document.querySelector('#role-selection'));
}

export function showStudentIdentificationForm() {
  showElement(document.querySelector('#student-identification-form'));
}

export function hideStudentIdentificationForm() {
  hideElement(document.querySelector('#student-identification-form'));
}

export function showStudentPanel() {
  showElement(document.querySelector('#student-panel'));
}

export function hideStudentPanel() {
  hideElement(document.querySelector('#student-panel'));
}

export function showTrainerPanel() {
  showElement(document.querySelector('#trainer-panel'));
}

export function hideTrainerPanel() {
  hideElement(document.querySelector('#trainer-panel'));
}
