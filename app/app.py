from flask import Flask, render_template
from pymongo import MongoClient

app = Flask(__name__)

client = MongoClient("mongodb://localhost:27017/")
db = client["mydatabase"]  # your database
collection = db["users"]   # your collection

@app.route('/')
def hello():
    return render_template('index.html')

@app.route('/block_list')
def block_list():
    return render_template('block_list.html')

@app.route('/tasks')
def tasks():
    return render_template('tasks.html')

@app.route('/habbits')
def habbits():
    return render_template('habbits.html')

@app.route('/progress')
def progress():
    return render_template('progress.html')

if __name__ == '__main__':
    app.run(debug=True, port="80")