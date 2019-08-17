import * as ui from './ui';
import { WEB_SOCKET_PORT } from './consts';
import data from './data';

export function connectAsTrainer() {
  data.webSocket = new WebSocket(`ws://127.0.0.1:${ WEB_SOCKET_PORT }`);
  data.webSocket.addEventListener(`open`, function(){
    ui.showMessage('Waiting for requests')
    data.webSocket.send(JSON.stringify({ type: 'identification', role: data.role, identification: data.identification }));
    ui.showMessage('Waiting for help requests...');
  });
  data.webSocket.addEventListener('message', function(event){
    const message = JSON.parse(event.data);
    const messageHandler = trainerMessagesHandlers[message.type];
    if (messageHandler){
      messageHandler(message);
    }
  });
  data.webSocket.addEventListener('close', function(){
    ui.showMessage('Server disconnected')
  })
  data.webSocket.addEventListener('error', function(){
    ui.showMessage('Server error occured')
  })

  ui.showMessage('Connecting...');
}

function sendNotificationThatHelpWasProvided() {
  data.webSocket.send(JSON.stringify({type: "help-provided"}));
  ui.hideTrainerPanel()
  ui.showMessage('Waiting for help requests...')
}

const trainerMessagesHandlers = {
  'help-request': function(message){
    ui.showMessage(`Student ${message.studnetIdentification} requested help`);
    ui.showTrainerPanel();
  }
}

export function initializeTrainerPart() {
  ui.addEventListener('#help-provided-button', 'click', sendNotificationThatHelpWasProvided);
}
