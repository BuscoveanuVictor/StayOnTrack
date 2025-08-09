from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
import logging

app = Flask(__name__)

logging.basicConfig(
    filename='app.log',              # Save logs to file
    level=logging.DEBUG,             # Log all levels
    format='%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
)


client = MongoClient("mongodb://localhost:27017/")
db = client["StayOnTrack"]  # your database

@app.route('/')
def hello():
    return render_template('index.html')

@app.route('/block_list')
def block_list():
    return render_template('block_list.html')

@app.route('/block_list/add_domain', methods =['POST'])
def add_domain():
    data = request.get_json()
    logging.info(f"Received data: {data['domain']}")
    db.users.update_one(
        {"nume": "Victor"},           
        {"$push": {"block_list": data['domain']}} 
    )
    return jsonify({"message": "Domain added successfully", "domain": data})

@app.route('/block_list/load_block_list')
def load_block_list():
    data = db["users"].find_one({"nume": "Victor"})
    block_list = data.get('block_list', [])
    logging.info(f"Retrieved block list: {block_list}")
    return jsonify({"block_list": block_list})
    

@app.route('/block_list/delete_domain', methods=['POST'])
def delete_domain():
    pass

@app.route('/tasks')
def tasks():
    return render_template('tasks.html')

@app.route('/tasks/load_tasks')
def load_tasks():
    data = db["users"].find_one({"nume": "Victor"})
    # for task in tasks:
    #     task['_id'] = str(task['_id'])
    logging.info(data['tasks'])
    return jsonify(data['tasks'])

@app.route('/tasks/add_task', methods=['POST'])
def add_task():
    tasks = request.get_json()
    result = db.users.update_one(
        {"nume": "Victor"},           
        {"$push": {"tasks": tasks[-1]}} 
    )
    return jsonify({"Task added ": tasks[-1], "task_id": str(result.upserted_id)})


def delete_task():
    pass


def update_task():
    pass


@app.route('/habits')
def habits():
    return render_template('habits.html')

@app.route('/habits/load_habits')
def load_habits():
    habits = list(db["Tasks"].find())
    for habbit in habits:
        habbit['_id'] = str(habbit['_id'])
    logging.info(f"Retrieved habits: {habits}")
    return jsonify(habits)

@app.route('/habits/add_habbit', methods=['POST'])
def add_habbit():
    data = request.get_json()
    db.users.update_one(
        {"nume": "Victor"},           
        {"$push": {"habits": data}} 
    )
    return jsonify({"raspunsul primit": data})


@app.route('/habits/add_task', methods=['POST'])
def add_habit_task():
    data = request.get_json()
    db.users.update_one(
        {"nume": "Victor", "habits.id": data['habit_id']},           
        {"$push": {"habits.$.tasks": data['task']}} 
    )
    return jsonify({"raspunsul primit": data})

@app.route('/progress')
def progress():
    return render_template('progress.html')

if __name__ == '__main__':
    app.run(debug=True, port="80", host="0.0.0.0")