from flask import Flask, render_template
from flask_socketio import SocketIO
import os
from simpletransformers.conv_ai import ConvAIModel, ConvAIArgs


# needed to launch the app
app = Flask(__name__)
socketio = SocketIO(app)


# define arguments for the speech response model creation
model_args = ConvAIArgs()
# for formulating the speech response, consider the last 5 user interactions
model_args.max_history = 5
# the model needed to formulate speech responses
model = ConvAIModel("gpt", "static/language_model/", use_cuda=False, args=model_args)


# create the ai persona
personality = [
    "My name is Max.",
    "I'm a machine'.",
    "I was created by Jerry Overton.",
]

# define the interaction history
history = [
    "Hello, what's your name?",
    "Max",
    "What do you do for a living?",
    "I'm an artificial intelligence",
]


@app.route('/')
def index():
    return render_template("index.html")


@socketio.on('signal')
def handle_signal(msg):
    global history

    # try the model
    response, history = model.interact_single(msg, history, personality=personality)

    socketio.emit("response", response)
    print(history)


if __name__ == "__main__":
    port = int(os.getenv('PORT'))
    socketio.run(app, debug=True, port=port, host='0.0.0.0')
