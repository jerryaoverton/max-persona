from flask import Flask, render_template
from flask_socketio import SocketIO
import os
import arrow  # normalizing dates
from simpletransformers.conv_ai import ConvAIModel

# needed to launch the app
app = Flask(__name__)
socketio = SocketIO(app)

# holds the short-term memory for the AI
stm = []

# the model needed to formulate speech responses
model = ConvAIModel("gpt", "gpt_personachat_cache")


@app.route('/')
def index():
    return render_template("index.html")


# clears the memory of anything that has gone stale
def clear_memory(memory):
    memory = [dialog for dialog in memory if not stale_dialog(dialog)]


# determines if a piece of dialog happened long enough in the past to be forgotten
def stale_dialog(dialog):
    # the recent past is anything later than 5 minutes ago
    now = arrow.utcnow()
    recent_past = now.shift(minutes=-5)

    # dialog is stale if it is older than the recent past
    is_stale = dialog["timestamp"] < recent_past

    return is_stale


@socketio.on('signal')
def handle_signal(msg):
    # clear short-term memory of any old dialog
    clear_memory(stm)

    # turn the message received into part of an ongoing dialog
    # by adding a timestamp and a source
    dt = arrow.utcnow()
    dialog = {"content": msg, "timestamp": dt, "source": "user"}

    # add the recent dialog to the short-term memory
    stm.append(dialog)
    print(stm)

    socketio.emit("response", "hello from the server")


if __name__ == "__main__":
    port = int(os.getenv('PORT'))
    socketio.run(app, debug=True, port=port, host='0.0.0.0')
