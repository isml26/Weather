//jshint esversion:6

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser"); //npm i body-parser,allows to loock then throught the body of the pst request and fect data
const app = express();
//necessary for post request
app.use(express.urlencoded({extended:true}))//body parser deprecated instead of we can use 
app.use(express.static(__dirname+"/public"));
app.use(express.static("images"));
app.set('view engine', 'ejs');
require('dotenv').config();
//fetch data external server
//when we use app we can only one res.send()

app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
});

app.post("/",function(req,res){
  //useing live data using an api
  const query = req.body.cityName;
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+process.env.APP_ID;
  //getting data form of a json
  https.get(url,function(response){
      console.log(response.statusCode);
      response.on("data",function(data){
      //parsing spesific items
      const weatherData = JSON.parse(data);//parsing actual javascript object
      var temp;
      try {
      temp = weatherData.main.temp;
      const weatherDescription = "The weather is currently "+weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const image = "http://openweathermap.org/img/wn/"+icon+"@2x.png"
      //sending it back to the browser
      const temperature = Math.ceil(temp);
      res.render("header",{query:query,temp:temperature,weatherDescription:weatherDescription,img:image});

      //res.write("<p>" +weatherDescription+"</p>");
      //res.write("<h1>The temperature in "+query+ " is "+temp+" degrees Celcius "+weatherDescription+"</h1>");
      //res.write("<img src="+image+">");
      res.end();
        
      } catch (error) {
        res.render("error",{city:query});
        res.end();
      }         
    })
  });
  console.log(req.body.cityName);
});
const PORT = process.env.PORT||3000;
app.listen(PORT,function(){
  console.log("Server is running on port 3000");
});
