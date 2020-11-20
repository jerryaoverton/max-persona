from flask import Flask, render_template
import os

app = Flask(__name__)

@app.route('/background')
def background():
    return render_template("background.html")


@app.route('/')
def index():
    return render_template("index.html")


if __name__ == "__main__":
    port = int(os.getenv('PORT'))
    app.run(debug=True, port=port, host='0.0.0.0')
