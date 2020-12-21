const socket = io.connect('http://127.0.0.1:5000')

// transmits a message to the artificial nervous system
function signalANS(message){
    // send a signal to the server for processing
    socket.emit('signal', message);

    // log the event to the output console
    log("Signal sent to artificial nervous system");
}

// log when where are successfully connected to the ANS
socket.on('connect', () => {
  log("Connected to the artificial nervous system (ANS)");
});

// speak responses from the ANS
socket.on('response', msg => {
    // speak the response from the artificial nervous system
    speak(msg);
});