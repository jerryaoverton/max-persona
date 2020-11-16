// connects to the button on the main page that starts the AI listening
const btn = document.querySelector('.talk');

// the place on the main page to display the response to the user
const content = document.querySelector('.console');

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
    console.log('voice is activated. you can speak to microphone')
}

// triggered when the speech recognizer recognizes a result
recognition.onresult = function(event) {
    const current = event.resultIndex;

    // transcribe what was recognized
    const transcript = event.results[current][0].transcript;
    content.textContent = transcript;

    // repeat back what was recognized
    speak(transcript);
}

// speak the given message
function speak(message){
    // set the content of the spoken message
    speech.text = message;

    // speak
    window.speechSynthesis.speak(speech);
}

// fired when the ai stops speaking
speech.onend = function(event){
    // the ai starts listening as soon as it stops talking
    recognition.start();
}

// start listening
recognition.start();