const router = require('express').Router();
const mysql = require('mysql');

// DB 연결
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'danbidanbi',
    database: 'danbi',
    multipleStatements: true
});
con.connect();

function cal_intake_once(_intake_goal, _bed_time, _wakeup_time, _cycle){
    var bed_time = new Date(_bed_time);
    var wakeup_time = new Date(_wakeup_time);
    var waking_hour = (bed_time - wakeup_time) / 60000; //분 단위
    var intake_howmanytimes = Math.floor(waking_hour / Number(_cycle)) + 1; //분 단위
    var intake_once = Math.floor(Number(_intake_goal) / intake_howmanytimes); //ml단위
    return intake_once;
}

router.post('/registration', function(req, res) {
    var email = req.body.email;
    var nickname = req.body.nickname;
    var member_type = req.body.member_type;
    var weight = req.body.weight;
    var wakeup_time = req.body.wakeup_time;
    var bed_time = req.body.bed_time;
    var temperature = req.body.temperature;
    var intake_goal = req.body.intake_goal;
    var cycle = req.body.cycle;
    var intake_once = cal_intake_once(intake_goal, bed_time, wakeup_time, cycle);

    var pet_type = req.body.pet_type;
    var plant_type = req.body.plant_type;

    if(member_type == 1){
        var _wakeup_time = new Date(req.body.wakeup_time);
        var utcNow = _wakeup_time.getTime() + (_wakeup_time.getTimezoneOffset() * 60 * 1000);
        const koreaTimeDiff = 9 * 60 * 60 * 1000;
        const wakeup_time = new Date(utcNow + koreaTimeDiff).toISOString().slice(0, 19).replace('T', ' ').split(" ")[1];

        var _bed_time = new Date(req.body.bed_time);
        utcNow = _bed_time.getTime() + (_bed_time.getTimezoneOffset() * 60 * 1000);
        const bed_time = new Date(utcNow + koreaTimeDiff).toISOString().slice(0, 19).replace('T', ' ').split(" ")[1];

        con.query(`SELECT id FROM user WHERE email='${email}'`, (err, row) => {
            if (err) res.json({success: false, msg: 'registration select error'});
            else{
                con.query(`INSERT INTO member (nickname, member_type, weight, wakeup_time, bed_time, temperature, intake_goal, cycle, intake_once, user_id)
                        VALUES (\'${nickname}\', \'${member_type}\', ${weight}, \'${wakeup_time}\', \'${bed_time}\', ${temperature}, ${intake_goal}, ${cycle}, ${intake_once}, ${row[0].id});`, (err) => {
                            if(err) res.json({success: false, msg: 'person registration insert error'});
                            else res.json({success: true, msg: 'person registration insert success'});
                });
            }
        });
    }
    else if(member_type == 2){
        
        var _wakeup_time = new Date(req.body.wakeup_time);
        var utcNow = _wakeup_time.getTime() + (_wakeup_time.getTimezoneOffset() * 60 * 1000);
        const koreaTimeDiff = 9 * 60 * 60 * 1000;
        const wakeup_time = new Date(utcNow + koreaTimeDiff).toISOString().slice(0, 19).replace('T', ' ').split(" ")[1];

        var _bed_time = new Date(req.body.bed_time);
        utcNow = _bed_time.getTime() + (_bed_time.getTimezoneOffset() * 60 * 1000);
        const bed_time = new Date(utcNow + koreaTimeDiff).toISOString().slice(0, 19).replace('T', ' ').split(" ")[1];

        con.query(`SELECT id FROM user WHERE email='${email}'`, (err, row) => {
            if (err) console.log('registration select error');
            else{
                con.query(`INSERT INTO member (nickname, member_type, weight, wakeup_time, bed_time, intake_goal, cycle, intake_once, pet_type, user_id)
                        VALUES (\'${nickname}\', \'${member_type}\', ${weight}, \'${wakeup_time}\', \'${bed_time}\', ${intake_goal}, ${cycle}, ${intake_once}, \'${pet_type}\',${row[0].id});`, (err) => {
                            if(err) res.json({success: false, msg: 'pet registration insert error'});
                            else res.json({success: true, msg: 'pet registration insert success'});
                });
            }
        });
    }
    else if(member_type == 3){
        var _supply_time = new Date(req.body.supply_time);
        const utcNow = _supply_time.getTime() + (_supply_time.getTimezoneOffset() * 60 * 1000);
        const koreaTimeDiff = 9 * 60 * 60 * 1000;
        const supply_time = new Date(utcNow + koreaTimeDiff).toISOString().slice(0,19).replace('T', ' ').split(" ")[1];

        var last_supply_date = new Date(req.body.last_supply_date).toISOString().slice(0, 19).replace('T', ' ').split(" ")[0];
        con.query(`SELECT id FROM user WHERE email='${email}'`, (err, row) => {
            if (err) console.log('registration select error');
            else{
                con.query(`INSERT INTO member (nickname, member_type, intake_goal, cycle, intake_once, plant_type, last_supply_date, supply_time, user_id)
                        VALUES (\'${nickname}\', \'${member_type}\', ${intake_goal}, ${cycle}, ${intake_goal}, \'${plant_type}\', \'${last_supply_date}\', \'${supply_time}\', ${row[0].id});`, (err) => {
                            if(err) res.json({success: false, msg: err});
                            else res.json({success: true, msg: 'plant registration insert success'});
                });
            }
        });
    }
    else res.send('membertype error');
});

//edit member
router.post('/editmemberinfo', function(req, res) {
    var member_id = req.body.member_id;
    var edit_nickname = req.body.nickname;
    var edit_weight = req.body.weight;
    var edit_wakeup_time = req.body.wakeup_time;
    var edit_bed_time = req.body.bed_time;
    var edit_temperature = req.body.temperature;
    var edit_intake_goal = req.body.intake_goal;
    var edit_cycle = req.body.cycle;
    var edit_intake_once = cal_intake_once(edit_intake_goal, edit_bed_time, edit_wakeup_time, edit_cycle);
    var edit_plant_type = req.body.plant_type;

    edit_wakeup_time = new Date(edit_wakeup_time).toISOString().slice(0, 19).replace('T', ' ').split(" ")[1];
    edit_bed_time = new Date(edit_bed_time).toISOString().slice(0, 19).replace('T', ' ').split(" ")[1];

    console.log(member_id);
    con.query(`SELECT member_type FROM member WHERE id = ${member_id};`, (err, row) => {
        if(err) console.log('select error');
        else{
            if(row[0].member_type == 1){
                con.query(`UPDATE member SET nickname = '${edit_nickname}',  weight = ${edit_weight}, wakeup_time = '${edit_wakeup_time}', bed_time = '${edit_bed_time}',intake_goal = ${edit_intake_goal}, 'temperature' = ${edit_temperature},
                cycle = ${edit_cycle}, intake_once = ${edit_intake_once}  WHERE id = ${member_id};`, (err) =>{
                    if(err) res.json({success: false, msg: 'person edit insert error'});
                    else res.json({success: true, msg: 'person edit insert success'});
                });
            }
            else if(row[0].member_type == 2){
                con.query(`UPDATE member SET nickname = '${edit_nickname}', weight = ${edit_weight}, wakeup_time = '${edit_wakeup_time}', bed_time = '${edit_bed_time}',intake_goal = ${edit_intake_goal},
                cycle = ${edit_cycle}, intake_once = ${edit_intake_once} WHERE id = ${member_id};`, (err) =>{
                    if(err) res.json({success: false, msg: 'pet edit insert error'});
                    else res.json({success: true, msg: 'pet edit insert success'});
                });
            }
            else if(row[0].member_type == 3){
                var edit_supply_time = new Date(req.body.supply_time).toISOString().slice(0,19).replace('T', ' ').split(" ")[1];
                var edit_last_supply_date = new Date(req.body.last_supply_date).toISOString().slice(0, 19).replace('T', ' ').split(" ")[0];
                con.query(`UPDATE member SET nickname = '${edit_nickname}', intake_goal = ${edit_intake_goal}, cycle = ${edit_cycle}, intake_once = ${edit_intake_once}, plant_type = '${edit_plant_type}'
                ,last_supply_date = '${edit_last_supply_date}',supply_time = '${edit_supply_time}' WHERE id = ${member_id};`, (err) =>{
                    if(err) res.json({success: false, msg: 'plant edit insert error'});
                    else res.json({success: true, msg: 'plant edit insert success'});
                });
            }
            else res.send('membertype error');
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


//specification
router.post('/specification', function(req, res) {
    var member_id = req.body.member_id; 

    con.query(`SELECT * FROM member WHERE id= ${member_id};`, (err, row) => {
        if(err){
            res.json({success: false, msg: 'loading member fail'});
        }
        else if (row.length == 0){
            res.json({success: false, msg: 'There is not that member'});
        }
        else {
            if (row[0].member_type == 1){
                var sql1 = `SELECT JSON_ARRAYAGG(JSON_OBJECT('nickname', nickname, 'member_type', member_type, 'weight', weight, 'wakeup_time', wakeup_time, 'bed_time', bed_time, 'temperature', temperature, 'intake_goal', intake_goal,'cycle', cycle,'intake_once', intake_once)) AS result FROM member WHERE id = ${member_id}; `;
                var sql2 = `SELECT JSON_ARRAYAGG(JSON_OBJECT('date', date, 'actual_intake', actual_intake)) As record FROM record WHERE member_id = ${member_id} AND DATE(date) = CURDATE();`;
                var today_intake = 0;
                con.query(sql1 + sql2, (err, rows) => {
                    if(err) res.send('SELECT error getting memberlist');
                    else {
                        if(rows[1][0].record == null){
                            console.log(1);
                            res.json({success: true, result : JSON.parse(rows[0][0].result), record: JSON.parse(rows[1][0].record), next_intake: cal_nextintake(row[0].bed_time, row[0].wakeup_time, row[0].cycle), today_intake: today_intake});
                        }else{
                            for(var i=0; i<JSON.parse(rows[1][0].record).length; i++){
                                today_intake += JSON.parse(rows[1][0].record)[i].actual_intake;
                            }
                            res.json({success: true, result : JSON.parse(rows[0][0].result), record: JSON.parse(rows[1][0].record), next_intake: cal_nextintake(row[0].bed_time, row[0].wakeup_time, row[0].cycle), today_intake: today_intake});
                        }
                    }
                });
            }
            else if (row[0].member_type ==2){
                var sql1 = `SELECT JSON_ARRAYAGG(JSON_OBJECT('nickname', nickname, 'member_type', member_type, 'weight', weight, 'wakeup_time', wakeup_time, 'bed_time', bed_time, 'intake_goal', intake_goal,'cycle', cycle,'intake_once', intake_once,'pet_type', pet_type)) AS result FROM member WHERE id = ${member_id};`;
                var sql2 = `SELECT JSON_ARRAYAGG(JSON_OBJECT('date', date, 'actual_intake', actual_intake)) As record FROM record WHERE member_id = ${member_id} AND DATE(date) = CURDATE();`;
                var today_intake = 0;
                con.query(sql1 + sql2, (err, rows) => {
                    if(err) res.send(err);
                    else {
                        if(rows[1][0].record == null){
                            res.json({success: true, result : JSON.parse(rows[0][0].result), record: JSON.parse(rows[1][0].record), next_intake: cal_nextintake(row[0].bed_time, row[0].wakeup_time, row[0].cycle), today_intake: today_intake});
                        }else{
                            for(var i=0; i<JSON.parse(rows[1][0].record).length; i++){
                                today_intake += JSON.parse(rows[1][0].record)[i].actual_intake;
                            }
                            res.json({success: true, result : JSON.parse(rows[0][0].result), record: JSON.parse(rows[1][0].record), next_intake: cal_nextintake(row[0].bed_time, row[0].wakeup_time, row[0].cycle), today_intake: today_intake});
                        }
                    }
                });
            }
            else{
                var sql1 = `SELECT JSON_ARRAYAGG(JSON_OBJECT('nickname', nickname, 'member_type', member_type, 'intake_goal', intake_goal,'cycle', cycle,'intake_once', intake_once, 'plant_type', plant_type, 'last_supply_date', DATE_FORMAT(last_supply_date, "%Y-%m-%d"), 'supply_time', supply_time)) AS result FROM member WHERE id = ${member_id};`;
                var sql2 = `SELECT JSON_ARRAYAGG(JSON_OBJECT('date', date, 'actual_intake', actual_intake)) As record FROM record WHERE member_id = ${member_id}; `;
                var sql3 = `SELECT JSON_ARRAYAGG(JSON_OBJECT('date', date, 'actual_intake', actual_intake)) As record FROM record WHERE member_id = ${member_id} AND DATE(date) = CURDATE(); `;
                
                var today_intake = 0; 
                con.query(sql1 + sql2 + sql3, (err, rows) => {
                    if(err) res.send(err);
                    else {
                        if(rows[2][0].record == null){
                            res.json({success: true, result : JSON.parse(rows[0][0].result), record: JSON.parse(rows[1][0].record), next_intake: cal_nextintake_plant(row[0].last_supply_date, row[0].cycle), today_intake: today_intake});
                        }else{
                            for(var i=0; i<JSON.parse(rows[2][0].record).length; i++){
                                today_intake += JSON.parse(rows[2][0].record)[i].actual_intake;
                            }
                            res.json({success: true, result : JSON.parse(rows[0][0].result), record: JSON.parse(rows[1][0].record), next_intake: cal_nextintake_plant(row[0].last_supply_date, row[0].cycle), today_intake: today_intake});
                        }
                    }
                });
            }  
        }
    });    
});

module.exports = router;