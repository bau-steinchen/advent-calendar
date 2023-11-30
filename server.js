const path = require('path')

const express = require('express');
const methodOverride = require('method-override');
const fs = require("fs");
const app = express();

// variable declaration for this server
const port = 8080;

const configPath = "/config/conf.json"
let config = {}
fs.readFile("config/conf.json", "utf8", (error, data) => {
    if (error) {
      console.log(error);
      return;
    }
    config = JSON.parse(data);
  });

// all files like css images are located in the public folder
app.use(express.static(path.join(__dirname, '/public/')));

// use the ejs engine to render html pages
app.set('view engine', 'ejs');

// enable the urlencoded to acess the body of requests
app.use(express.urlencoded({ extended: false }));

// override method to be able to delete, or put (not only GET,POST)
app.use(methodOverride('_method'));

// title screen
app.get('/', async(req, res) => {
    let date_ob = new Date();
    let day = date_ob.getDate();
    let message = "[" + day + "] new request from: " + req.socket.remoteAddress + " at " + date_ob
    console.log(message)
    fs.writeFile('access.log', message, {flag: 'a+'}, (err) => { 
        if (err) {
            throw err;
        }
    })
    //console.log(date_ob.getMonth())
    if (date_ob.getMonth() < 11) {
        res.render('main/notdecember');
    } else {
        res.render('main/index', {day: day});
    }
    
})

// tthis will be the page redirected after the title screen
app.get('/:day', async(req, res) => {
    if ( req.params.day != "favicon.ico"){
        let date_ob = new Date();
        console.log("new request on day: " + req.params.day + " page at: " + date_ob)

        var dayNum = req.params.day;
        if (dayNum <= 24 ){
            var day = {};
            config.calendar.forEach((element, index, array) => {
                if (dayNum == element.day) {
                    day = element;
                    return;
                }   
            });
            //console.log(day)

            // decide the type and render the specific page
            if (day.type == "number" || day.type == "Number") {
                res.render('main/number', { "day": day });
            } else if (day.type == "word" || day.type == "Word") {
                res.render('main/word', { "day": day });
            } else if (day.type == "multi" || day.type == "Multi") {
                res.render('main/multi', { "day": day });
            } else {
                // default page if nothing matches (fallback)
                res.render('main/index', { day: dayNum});
            }
        } else {
            res.render('main/stilldecember');
        }
    } else {
        // get rid of the error that the browser cant fetch the favicon icon 
        res.sendStatus(404);
    }
    
     
})

// tthis will be the page redirected after the title screen
app.get('/reward/:day', async(req, res) => {
    //provide the result 
    //res.render('main/index');
    console.log("Reward for day: " + req.params.day)
    res.json( {} )    
})

// this will start the webserver with the port to listen at
app.listen(port);