var express = require('express');
var app = express();
var sql = require("mysql");
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    if ('OPTIONS' === req.method) {
        res.sendStatus(200);
    } else {
        //  console.log(`${req.ip} ${req.method}  ${req.url}`);
        next();
    }

});
///Body Parse parse application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({ extended: true }))

//Setting up server
var server = app.listen(8080, "192.168.43.233", function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

//Initiallising connection string
var dbConfig = sql.createConnection({
    user: "mahesh",
    password: 'mahesh@123',
    database: 'mahesh',
    host: "db4free.net",
    port: 3306
});
// GET aPI fOR dATA FROM DATABES    ....
app.get('/getStudents', (req, res) => {
    dbConfig.connect(function () {
        var stringRequest = 'select * from Student_Profile';
        dbConfig.query(stringRequest, function (err, recordset) {
            if (err) console.log(err);
            res.send(JSON.stringify(recordset)); // Result in JSON format
        })
    })
});
app.get('/getStudentsofRank/:rankId', (req, res) => {
    console.log(req)
    var RankId = req.params.rankId;
    console.log(RankId);
    var stringRequest = "SELECT * FROM Student_Profile WHERE `Rank` =" + sql.escape(RankId);
    dbConfig.connect(function () {
        dbConfig.query(stringRequest, function (err, recordset) {
            if (err) console.log(err);
            res.send(JSON.stringify(recordset)); // Result in JSON format
        })
    })


    // dbConfig.connect(function () {
    //     var stringRequest = 'select * from Student_Profile';
    //     dbConfig.query(stringRequest, function (err, recordset) {
    //         if (err) console.log(err);
    //         res.send(JSON.stringify(recordset)); // Result in JSON format
    //     })
    // })
});

app.post('/addStudents', (req, res) => {
    console.log(req.body)
    dbConfig.connect(function () {
        var stringRequest = "INSERT INTO `Student_Profile` (`Name`,`CLass`,`Roll`,`Rank`) VALUES ('" + req.body.Name + "', '" + req.body.CLass + " ' , '" + req.body.Roll + "', '" + req.body.Rank + "')"
        dbConfig.query(stringRequest, function (err, recordset) {
            if (err) console.log(err);
            var data = {
                status: "SUCCESS",
                statusecode: 200,
                message: "succesfully added ypur record"
            }
            res.send(data)
            //  res.json(data)
            // res.send(JSON.stringify(recordset)); // Result in JSON format
        })
    })
});
/// DELETE THE aPI REQUEST ERECORED ......
app.get('/deleteStudents', (req, res) => {
    console.log(req);
    console.log(req.query)
    console.log("parammm" + req.query.id);
    dbConfig.connect(function () {
        var stringRequest = "DELETE FROM Student_Profile WHERE Name='" + req.query.id + "'";
        //var stringRequest = 'select * from Student_Profile';
        dbConfig.query(stringRequest, function (err, recordset) {
            if (err) console.log(err);
            var data = { 
                status: "DELETED SUCCESSFULLY",
                statusecode: 200,
                message: "succesfully deleted your record"
            }
            res.send(JSON.stringify(data)); // Result in JSON format
            // res.end('Record has been deleted!');
        });
        //console.log(recordset.affectedRows)DCASCSAC
    })
});

app.post('/login', (req, res) => {
    // Mock user 
    const user = {
        userName: 'some@yopmail.com',
        password: 1234
    }
    jwt.sign({ user: user }, "secreatKey", (err, token) => {
        res.json({
            token: token
        })
    })
})
