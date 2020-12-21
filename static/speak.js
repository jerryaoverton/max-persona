// the place on the main page to display the response to the user
const content = document.getElementById("ui-participant");

// allows the ai to listen
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// continue listening until the user says something
recognition.continuous = true;

// allows the ai to speak
const speech = new SpeechSynthesisUtterance();

// characteristics of the ai's voice:
speech.lang = "en-GB"; // British accent
speech.rate = 0.8; // moderate speaking rate
speech.volume = 1; // maximum speaking

// turn on the mic and begin listening
recognition.onstart = function() {
    log("listening for verbal input");
}

// triggered when the speech recognizer recognizes a result
recognition.onresult = function(event) {

    log("verbal input recognized")

    const current = event.resultIndex;

    // transcribe what was recognized
    const transcript = event.results[current][0].transcript;
    content.innerHTML = transcript;
    log("verbal input transcribed");

    // repeat back what was recognized
    //speak(transcript);

    // transmit transcript to artificial nervous system for processing
    signalANS(transcript);
}

// speak the given message
function speak(message){
    // set the content of the spoken message
    speech.text = message;

    // speak
    stopListening();
    window.speechSynthesis.speak(speech);

    log("verbal response given");
}

// fired when the ai stops speaking
speech.onend = function(event){
    // the ai starts listening as soon as it stops talking
    recognition.start();
}

function startListening(){
    // start listening
    recognition.start();
}

function stopListening(){
    // start listening
    recognition.stop();
}

// the chrome browser deactivates voice recognition after so many
// seconds of not receiving input. this thread makes sure that
// the voice recognition stays open
//
voiceInterval = setInterval(async () => {
        if (isMicOn) {
            startListening();
        }
}, 2000);