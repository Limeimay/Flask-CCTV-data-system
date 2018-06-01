from flask import Flask
from flask import render_template
from flask import Flask, url_for
from flask import request
import json
import sqlite3
import time
import datetime
from help import  helper




app = Flask(__name__)

@app.route('/')
def HomePage():
    return render_template('records.html')

@app.route('/templates/records.html')
def index1():
    return render_template('records.html')

@app.route('/templates/correction.html')
def index2():
    return render_template('correction.html')

@app.route('/templates/update.html')
def index3():
    return render_template('update.html')

@app.route('/templates/settings.html')
def index4():
    return render_template('settings.html')


options = [{'value':1, 'label':"陈柱良"},
            {'value':2, 'label':"吴俊峰"},
            {'value':3, 'label':"李艳雄"},
            {'value':4, 'label':"吴小兰"},
            {'value':5, 'label':"王亚楼"},
            {'value':6, 'label':"庞文丰"}
]



records = [ { 'src' : "../records/face_images/20180518-101634_8_lilihan.jpg", 'id' : 1, 'time' : "2018-03-05", 'second' : "16:13:45", \
'person' : "陈柱良", 'corrected_name':"陈柱良",'isChecked':False},
{ 'src' : "/static/images/2.jpg", 'id' : 2, 'time' : "2018-03-05", 'second' : "16:15:45", \
'person' : "吴俊峰", 'corrected_name':"吴俊峰", 'isChecked':False},
{ 'src' : "/static/images/3.jpg", 'id' : 3, 'time' : "2018-03-05", 'second' : "16:16:41", \
'person' : "李艳雄", 'corrected_name':"李艳雄", 'isChecked':False},
{ 'src' : "/static/images/4.jpg", 'id' : 4, 'time' : "2018-03-05", 'second' : "17:05:12", \
'person' : "陈柱良", 'corrected_name':"", 'isChecked':False},
{ 'src' : "/static/images/5.jpg", 'id' : 5, 'time' : "2018-03-05", 'second' : "17:05:45", \
'person' : "陈柱良", 'corrected_name':"",'isChecked':False},
{ 'src' : "/static/images/6.jpg", 'id' : 6 ,'time' : "2018-03-05", 'second' : "17:26:41", \
'person' : "吴小兰", 'corrected_name':"", 'isChecked':False},
{ 'src' : "/static/images/7.jpg", 'id' : 7, 'time' : "2018-03-05", 'second' : "17:38:44", \
'person' : "陈柱良", 'corrected_name':"", 'isChecked':False},
{ 'src' : "/static/images/8.jpg", 'id' : 8, 'time' : "2018-03-05", 'second' : "18:16:45", \
'person' : "吴俊峰", 'corrected_name':"", 'isChecked':False}

                ]
a = [{'second': '10:16:46', 'corrected_name': '',
'isChecked': False, 'id': 1,
'src': '/home/chilam/workspace/Face_V4/records/face_images/20180518-101634_8_lilihan.jpg',
'time': '2018-05-18', 'person': 'wuxiaolan'},]

setting = [{'start':'', 'end':'', 'mode':''}]


data_return = [{'length':49, 'options':options, 'records':records}]



# 页面加载时发起请求，获取全部数据
@app.route('/get_database_data',methods=['GET', 'POST'])
def return_records():
    print("get the request")
    return_data = {}
    if request.method == 'POST':
        data = request.get_json()
        print(print("len of str:",len(data['startTime'])))
        starttime = helper.transforn_time(data['startTime'])
        endtime = helper.transforn_time(data['endTime'])
        # 请求的参数,是字符形式的.
        # starttime: "2018-05-14T16:00:00.000Z"
        # endtime: "2018-05-14T16:00:00.000Z"
        # person: "陈柱良"
        print("person:", data['person'])
        print("starttime:", starttime)
        print("endtime:", endtime)
        print()
        database = helper.database("../DB/Face_SYS_Log.sqlite")
        values = database.get_log(starttime, endtime, data['person'])
        print("length of get_log database: ", len(values))
        # if(data[''])
        records = helper.get_return_data(database_data = values, page = int(data['page']))
        # print(records)
        return_data = {}
        return_data['records'] = records
        return_data['length'] = int(len(values)/8)
        return_data['options'] = options
        # return_data = [return_data]
    return json.dumps(return_data)


@app.route('/WebApplication1/Home/Test4',methods=['GET'])
def return_all_getrecords():
    print("get the request")
    return json.dumps(data_return)

@app.route('/change_page',methods=['POST'])
def return_next_page():
    print("get the request")
    if request.method == 'POST':
        data = request.get_json()
        starttime = helper.transforn_time(data['startTime'])
        endtime = helper.transforn_time(data['endTime'])
        print("person:", data['person'])
        print("starttime:", starttime)
        print("endtime:", endtime)
        print("page:", data['page'])
        database = helper.database("../DB/Face_SYS_Log.sqlite")
        values = database.get_log(starttime, endtime, data['person'])
        print("length of get_log database: ", len(values))
        records = helper.get_return_data(database_data = values, page = data['page'])
        # print(records)
        return_data = {}
        return_data['records'] = records
        return_data['length'] = int(len(values)/8)
        return_data['options'] = options
        # return_data = [return_data]
    return json.dumps(return_data)


@app.route('/correct_8records',methods=['POST'])
def get_corrected_records():
    print("get the request")
    if request.method == 'POST':
        data = request.get_json()
    return json.dumps(data_return)


@app.route('/update_model',methods=['POST'])
def update_model():
    print("get the request")
    if request.method == 'POST':
        data = request.get_json()
        print(data['select_datas'])
        print("updatePerson_name:",data['updatePerson_name'])
    return json.dumps(data_return)

@app.route('/update_settings',methods=['POST'])
def settings():
    print("get the request")
    if request.method == 'POST':
        setting = request.get_json()
        print("start:", setting['start'])
        print("end:", setting['end'])
        print("mode:",setting['mode'])
    return json.dumps(setting)


if __name__ == '__main__':
    app.run(host='0.0.0.0')