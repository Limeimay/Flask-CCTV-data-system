import time
import datetime


def utc2local(utc_st):
    # UTC时间转本地时间（+8:00）
    now_stamp = time.time()
    local_time = datetime.datetime.fromtimestamp(now_stamp)
    utc_time = datetime.datetime.utcfromtimestamp(now_stamp)
    offset = local_time - utc_time
    local_st = utc_st + offset
    return local_st

def transforn_time(str):
    print("len of str:",len(str))
    if(len(str) == 0):
        return ''
    else:
        year = str.split ('-')[0]
        mon = str.split ('-')[1]
        day = (str.split ('-')[2]).split ('T')[0]
        utc_time = datetime.datetime (int(year), int(mon), int(day), 16, 42, 16, 126000)
        local = utc2local (utc_time)
        print (local.strftime ("%Y-%m-%d"))
        return local.strftime ("%Y-%m-%d")


# 定义一个数据库类
import sqlite3
class database:
    def __init__(self, path = "./DB/Face_SYS_Log.sqlite"):
        self.path = path
        self.conn = sqlite3.connect (self.path)
        self.cursor = self.conn.cursor ()
    def connect(self):
        pass

    def write_log(self, value_list):
        comm = "INSERT INTO log (Video_name, Image_name, Motion, Face, Recog_ID, Recog_name, \
                           Correction_ID, Correction_name) VALUES (?,?,?,?,?,?,?,?)"
        try:
            self.cursor.execute(comm, value_list)
        except:
            print("[ERROR]  Raise error whilie writing database.")
            self.conn.rollback()
        finally:
            #print("succeful")
            self.conn.commit ()
    def get_log(self, start_time='', end_time='', person = ''):
        #person_name = ''
        if(person == ''):
            person_name = '%'
        else:
            person_name = person

        if(start_time == '' and (end_time == '')):
            comm = "SELECT * FROM log where Recog_name like ?"
            # 要变成一个元组,添加一个逗号,否则报错
            value_list = (person_name,)
            print('database_data: execute 3 None')
            self.cursor.execute(comm, value_list)
            return self.cursor.fetchall()
        elif(start_time is not '' and (end_time is not '')):
            start_time = start_time+ ' 00:00:00'
            end_time = end_time + '24:00:00'
            value_list = (start_time, end_time, person_name)
            comm = "SELECT * FROM log where (Time Between ? AND ?) and (Recog_name like ?)"
            self.cursor.execute(comm, value_list)
            return self.cursor.fetchall()
        elif(start_time is not '' and (end_time is '')):
            start_time = start_time+ ' 00:00:00'
            end_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            value_list = (start_time, end_time, person_name)
            comm = "SELECT * FROM log where (Time Between ? AND ?) and (Recog_name like ?)"
            self.cursor.execute(comm, value_list)
            return self.cursor.fetchall()
        else:
            raise Exception("The start_time is None but the end_time is not None")
            return None


    def update_log(self, record = None):
        pass
    def close_database(self):
        self.cursor.close ()
        self.conn.close()


def get_return_data(database_data = None, page = 1):
    # 定制一个Record
    # { 'src' : "/static/images/8.jpg", 'id' : 8, 'time' : "2018-03-05", \
    # 'second' : "18:16:45", \
    # 'person' : "吴俊峰", 'corrected_name':"", 'isChecked':False}
    if((page-1)*8 > len(database_data)):
        print("[ERROR]  Tha page num is larger than the length of database")
        return None
    start_index = (page-1)*8
    if(len(database_data) < page*8):
        end_index = len(database_data)-1
    else:
        end_index = page*8-1
    print("start_index:", start_index)
    print("end_index:  ", end_index)
    records = []
    # 绝对路径
    path = '/static/face_images/'
    for id in range(start_index, end_index+1):
        record = {}
        value = database_data[id]
        record['src']= path + value[3]
        # record['src']= '/home/chilam/workspace/7.jpg'
        # record['src']= '/static/images/8.jpg'
        record['id'] = id + 1 # id从1开始
        record['time'] = value[1].split(' ')[0]
        record['second'] = value[1].split(' ')[1]
        record['person'] = value[7]
        if(value[9] == 'nothing'):
            record['corrected_name'] = ''
        else:
            record['corrected_name'] = value[9]
        record['isChecked'] = False
        # record['src'] = '/static/images/8.jpg'
        # record['id'] =  1 # id从1开始
        # record['time'] = "2018-03-05"
        # record['second'] = "18:16:45"
        # record['person'] = "陈柱良"
        # record['isChecked'] = False
        # record['corrected_name'] = ''
        records.append(record)
    return records


