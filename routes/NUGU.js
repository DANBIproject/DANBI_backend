const router = require('express').Router();
const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'danbidanbi',
    database: 'danbi'
});
con.connect();

router.post('/test', function(req, res){
    var obj = req.body;

    console.log(obj);

    var param = obj.action.parameters;
    console.log(param);

    var nickname = obj.action.parameters.nickname;
    console.log("nickname : " + nickname); 

    var value = obj.action.parameters.nickname.value;
    console.log("value : " + value); 

    if(value == "지윤이"){
        obj.output = {"test" : "hihi"}; 
    }else{
        obj.output = {"test" : "nohi"};
    }

    obj.resultCode ="OK";

    res.send(obj);
    res.end;
});

router.post('/check_amount', function(req, res){
    var obj = req.body;
    var amount = 0;

    console.log(obj);
    console.log(obj.action.parameters);

    var nickname = obj.action.parameters.nickname.value;

    con.query(`SELECT id FROM member WHERE nickname='${nickname}';`, (err, row) => {
        if(err){
            obj.resultCode ="Error"; 
            res.send(obj);
            res.end;
        }
        else if (row.length == 0){
            obj.resultCode ="Error member";
            res.send(obj);
            res.end;
        }
        else {
            con.query(`SELECT * FROM record WHERE member_id = ${row[0].id} AND DATE(date) = CURDATE();`, (err, rows) => {
                if(err) console.log('SELECT error getting memberlist');
                else if (rows.length == 0){
                    obj.output = {"amount" : '0'};
                    obj.resultCode ="OK"; 

                    res.send(obj);
                    res.end;
                }
                else {
                    for(var i=0; i<rows.length; i++){
                        amount += rows[i].actual_intake;
                    }
                    obj.output = {"amount" : amount};
                    obj.resultCode ="OK";

                    res.send(obj);
                    res.end;
                }
            });
        }
    });   
});

router.post('/check_record', function(req, res){
    var obj = req.body;
    var record = 0;

    console.log(obj);
    console.log(obj.action.parameters);

    var nickname = obj.action.parameters.nickname.value;

    con.query(`SELECT * FROM member WHERE nickname='${nickname}';`, (err, row) => {
        if(err){
            obj.resultCode ="Error";
            res.send(obj);
            res.end;
        }
        else if (row.length == 0){
            obj.resultCode ="Error";
            res.send(obj);
            res.end;
        }
        else {
            if(row[0].member_type==1 || row[0].member_type==2){
                con.query(`SELECT date FROM record WHERE member_id = ${row[0].id} ;`, (err, row) => {
                    if(err) res.send('SELECT error getting record');
                    else if (row.length ==0){ 
                        obj.resultCode ="no record";
                        res.send(obj);
                        res.end;
                    }
                    else {
                        var fulltime = row[row.length-1].date;
                        fulltime = new Date(fulltime).toISOString().slice(0,19).replace('T', ' ').split(" ")[1];
                        hour = fulltime.slice(0,2);
                        minute = fulltime.slice(3,5);
                        record = hour+"시 "+minute+"분";
        
                        obj.output = {"record" : record};
                        obj.resultCode ="OK";
    
                        res.send(obj);
                        res.end;
                    }
                });
            }
            else if(row[0].member_type==3){
                con.query(`SELECT date FROM record WHERE member_id = ${row[0].id} ;`, (err, row) => {
                    if(err) res.send('SELECT error getting record');
                    else if (row.length ==0){
                        obj.output = {"record" : '기록없음'};
                        obj.resultCode ="OK";
    
                        res.send(obj)
                        res.end;
                    }
                    else {
                        var fulltime = row[row.length-1].date;
                        console.log(fulltime);
                        fulltime = new Date(fulltime).toISOString().slice(0,19).replace('T', ' ').split(" ")[0];
                        console.log(fulltime);
                        month = fulltime.slice(6,8);
                        date = fulltime.slice(10,12);
                        record = month+"월 "+date+"일";
                        obj.output = {"record" : record};
                        obj.resultCode ="OK";
    
                        res.send(obj)
                        res.end;
                    }
                });
            }
            else {
                obj.resultCode ="Error";
    
                res.send(obj);
                res.end;
            }
        }
    });   
});

function cal_nextintake(_bed_time, _wakeup_time, _cycle) {
    var Now = new Date();
    const utcNow = Now.getTime() + (Now.getTimezoneOffset() * 60 * 1000);
    const koreaTimeDiff = 9 * 60 * 60 * 1000;
    const today = new Date(utcNow + koreaTimeDiff);
    
    var bed_time = new Date(today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate()+" "+_bed_time);
    var wakeup_time = new Date(today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate()+" "+_wakeup_time);
    
    var waking_hour = (bed_time - wakeup_time) / 60000;
    var intake_howmanytimes = Math.floor(waking_hour / Number(_cycle)) + 1;
    var nexttime = wakeup_time;
    
    for(var i=0; i<intake_howmanytimes; i++){
        if (today.getTime() > nexttime.getTime()){
            nexttime.setMinutes(nexttime.getMinutes()+_cycle);
        } else {
            return nexttime;
        }
    }
    return 'error';
}

function cal_nextintake_plant(_last_supply_date, _cycle) {

    var Now = new Date();
    const utcNow = Now.getTime() + (Now.getTimezoneOffset() * 60 * 1000);
    const koreaTimeDiff = 9 * 60 * 60 * 1000;
    const today = new Date(utcNow + koreaTimeDiff);

    var last_supply_date = new Date(_last_supply_date);
    var next_day = last_supply_date;
    while(today.getTime()>last_supply_date.getTime()){
        next_day.setDate(next_day.getDate()+_cycle);
    }
    return next_day;
}

router.post('/check_schedule', function(req, res){
    var obj = req.body;
    console.log(obj);
    console.log(obj.action.parameters);
    var schedule = 0;

    var nickname = obj.action.parameters.nickname.value;

    con.query(`SELECT * FROM member WHERE nickname='${nickname}';`, (err, row) => {
        if(err){
            console.log('haha');
            obj.resultCode ="Error";
            res.send(obj);
            res.end;
        }
        else if (row.length == 0){
            console.log('hihi');
            obj.resultCode ="Error member";
            res.send(obj);
            res.end;
        }
        else {
            if(row[0].member_type==1 || row[0].member_type==2){
                nexttime = cal_nextintake(row[0].bed_time, row[0].wakeup_time, row[0].cycle);
                nexttime = new Date(nexttime).toISOString().slice(0, 19).replace('T', ' ').split(" ")[1];
                hour = nexttime.slice(0,2);
                minute = nexttime.slice(3,5);
                schedule = hour+"시 "+minute+"분";
            
                obj.output = {"schedule" : schedule};
                obj.resultCode ="OK";

                res.send(obj);
                res.end;
            }
            else if(row[0].member_type==3){
                con.query(`SELECT * FROM record WHERE member_id = ${row[0].id}`, (err, row) => {
                    if(err){
                        obj.resultCode ="Error";
                
                        res.send(obj);
                        res.end;
                    }
                    else if (row.length == 0){
                        obj.resultCode ="Error";
                
                        res.send(obj);
                        res.end;
                    }
                    else {
                        cal_nextintake_plant(row[0].last_supply_date, row[0].cycle);
                        nexttime = new Date(nexttime).toISOString().slice(0, 19).replace('T', ' ').split(" ")[0];
                        month = nexttime.slice(5,6);
                        date = nexttime.slice(8,9);
                        var schedule = month+"월 "+date+"일";
            
                        obj.output = {"schedule" : schedule};
                        obj.resultCode ="OK";

                        res.send(obj);
                        res.end;
                    }
                });
            }
            else{
                obj.resultCode ="Error";
    
                res.send(obj);
                res.end;
            }
        }
    })
});

module.exports = router;