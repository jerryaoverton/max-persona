const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onstart = function() {
    console.log('voice is activated. you can speak to microphone')
}

recognition.onresult = function(event) {
    const current = event.resultIndex;

    const transcript = event.results[current][0].transcript;
    content.textContent = transcript;
    readOutLoud(transcript);
}

// add the listener to the button
btn.addEventListener('click', () => {
    recognition.start();
})

// make Max speak the given message
function readOutLoud(message){
    const speech = new SpeechSynthesisUtterance();

    // characteristics of the voice
    speech.volume = 1;

    // content of the spoken message
    speech.text = message;

    window.speechSynthesis.speak(speech);
}