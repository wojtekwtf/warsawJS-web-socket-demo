import data from './data';
import * as ui from './ui';
import { WEB_SOCKET_PORT } from './consts';

function handleStudentIdentificationInputChange() {
  const submitButton = document.querySelector('#student-identification-submit-button');
  const identification = document.querySelector('#student-identification-input').value;
  submitButton.disabled = !identification.trim();
}

function saveStudentIdentification() {
  data.identification = document.querySelector('#student-identification-input').value;
  ui.showHeader(`Student: ${data.identification}`);
  ui.hideStudentIdentificationForm();
  connectAsStudent();
}

function connectAsStudent() {
  data.webSocket = new WebSocket(`ws://127.0.0.1:${ WEB_SOCKET_PORT }`);

  data.webSocket.addEventListener(`open`, function(){
    data.webSocket.send(JSON.stringify({ type: 'identification', role: data.role, identification: data.identification }));
    ui.hideMessage();
    ui.showStudentPanel();
  });
  data.webSocket.addEventListener('message', function(event){
    const message = JSON.parse(event.data);
    const messageHandler = studentMessagesHandlers[message.type];
    if (messageHandler){
      messageHandler(message);
    }
  });
  data.webSocket.addEventListener('close', function(){
    ui.showMessage('Server disconnected');
    ui.hideStudentPanel();
  });
  data.webSocket.addEventListener('error', function(){
    ui.showMessage('Server error occured')
  });

  ui.showMessage('Connecting...')
}

const studentMessagesHandlers = {
  'trainer-assigned': function(){
    ui.showMessage(`Trainer will approach you in a moment!`);
  },
  'position-in-list': function(message){
    ui.showMessage(`All trainers are busy, you position in waiting list is ${message.position}`)
  },
  'help-finished': function(){
    ui.hideMessage();
    ui.showStudentPanel();
  }
}

function sendHelpRequest() {
  data.webSocket.send(JSON.stringify({type: 'help-request'}));
  ui.hideStudentPanel();
  ui.showMessage("Wating for trainers...");
}

export function initializeStudentPart() {
  ui.addEventListener('#student-identification-input', 'keyup',  handleStudentIdentificationInputChange);
  ui.addEventListener('#student-identification-form',  'submit', saveStudentIdentification);
  ui.addEventListener('#i-need-help-button',           'click',  sendHelpRequest);
}
