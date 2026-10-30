import json
from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    with open("puzzles.json","r") as file:
        puzzles = json.load(file)
        puzzle = puzzles[0]
    return render_template(
        "index.html", 
        fen=puzzle["fen"],
        solution=puzzle["solution"]
    )
    


if __name__ == "__main__":
    app.run(debug=True)