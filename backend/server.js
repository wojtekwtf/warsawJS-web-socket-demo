const WebSocket = require('ws');
const { pull } = require('lodash')

const WEB_SOCKET_PORT = 3333;

const ROLES = {
    TRAINER: 'trainer',
    STUDENT: 'student',
}

const freeTrainers = [];
const StudentsWaitingForHelp = [];

function pushTrainerOnList(trainer){
    freeTrainers.push(trainer);
}

function pushStudentOnList(student){
    StudentsWaitingForHelp.push(student)
}

function print_state() {
    console.log('There are', freeTrainers.length, 'free trainers');
    console.log('There are', StudentsWaitingForHelp.length, 'students waiting for a trainer');
}

function handleFreeTrainer(trainer){
    if(StudentsWaitingForHelp.length > 0){
        const student = StudentsWaitingForHelp.shift();
        assignTrainerToStudent(trainer, student);
        notifyStudentsNewPosition()
    } else{
        pushTrainerOnList(trainer);
    }
}

function assignTrainerToStudent(trainer, student){
    trainer.student = student;
    student.trainer = trainer;
    trainer.webSocket.send(JSON.stringify({type: 'help-request', studnetIdentification: student.identification}));
    student.webSocket.send(JSON.stringify({type: 'trainer-assigned'}));
}

function notifyStudentsNewPosition(){
    StudentsWaitingForHelp.forEach(function(student, index){
        student.webSocket.send(JSON.stringify({type: 'position-in-list', position: index+1}));
    })
}

function handleStudentLeaving(student){
    if (student.trainer) {
        const trainer = student.trainer;
        student.trainer = null;
        trainer.student = null;
        trainer.webSocket.send(JSON.stringify({type: "help-request-cancelled"}))
        handleFreeTrainer(trainer);
    }else if(StudentsWaitingForHelp.includes(student)){
        pull(StudentsWaitingForHelp, student)
        notifyStudentsNewPosition();
    }
}

function assignFirstTrainerToStudent(student){
    const trainer = freeTrainers.shift();
    assignTrainerToStudent(trainer, student);
}

function handleStundetRequestingHelp(student){
    if (freeTrainers.length > 0){
        assignFirstTrainerToStudent(student);
    }else{
        pushStudentOnList(student);
        student.webSocket.send(JSON.stringify({type: 'position-in-list', position: StudentsWaitingForHelp.length}));
    }
}

const webSocketServer = new WebSocket.Server({port: WEB_SOCKET_PORT});

webSocketServer.on('connection', function(WebSocket){
    console.log("Client connected");

    const connectedPerson = {
        webSocket: WebSocket,
        role: null,
        identification: null,
    }

    const freshConnectionMessageHandler = {
        'identification': function(message){
            connectedPerson.role = message.role;
            connectedPerson.identification = message.identification;

            switch(message.role) {
                case ROLES.TRAINER:
                    connectedPerson.student = null;
                    messagesHandler = trainerMessageHandler;
                    handleFreeTrainer(connectedPerson);
                    print_state()
                    break;

                case ROLES.STUDENT:
                    connectedPerson.trainer = null;
                    messagesHandler = studentMessageHandler;
                    break;
            }
        }
    };

    const studentMessageHandler = {
        'help-request': function(){
            handleStundetRequestingHelp(connectedPerson);
        }
    }

    const trainerMessageHandler = {
        'help-provided': function(){
            const trainer = connectedPerson;
            const student = trainer.student;
            student.trainer = null;
            trainer.student = null;

            student.webSocket.send(JSON.stringify({type: "help-finished"}));
            handleFreeTrainer(trainer);
        }
    }

    let messagesHandler = freshConnectionMessageHandler;

    WebSocket.on('message', function(data){
        const message = JSON.parse(data);
        console.log("Recieved message", message)

        const messageHandler = messagesHandler[message.type]
        if (messageHandler) {
            messageHandler(message);
        }
    });

    WebSocket.on('close', function(){
        switch(connectedPerson.role){
            case ROLES.TRAINER:
                pull(freeTrainers, connectedPerson)
                print_state()
                break;
            
            case ROLES.STUDENT:
                handleStudentLeaving(connectedPerson)
                print_state()
                break;
        }
        
        console.log('Client', connectedPerson.role, connectedPerson.identification, 'disconnected');
    });

    WebSocket.on('error', function(){
        console.log('WebSocket error occured', 'error')
    });
});

console.log('TrainerNeeded server...');
