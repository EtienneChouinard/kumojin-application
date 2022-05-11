// server/index.js
const path = require('path');
const express = require("express");
const logger = require('morgan');
const cors = require('cors');
const timezones = require("./timezone.JSON");
const fs = require("fs");
const { stringify } = require('querystring');
const res = require('express/lib/response');

const PORT = process.env.PORT || 3001;

const app = express();

//use cors to allow cross origin resource sharing
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


function jsonReader(filePath, cb) 
{
  fs.readFile(filePath, "utf8",(err, fileData) => 
  {
    if (err) 
    {
      return cb && cb(err);
    }
    try 
    {
      const object = JSON.parse(fileData);
      return cb && cb(null, object);
    } 
    catch (err) 
    {
      return cb && cb(err);
    }
  });
}

  // Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get("/api/liste", (req, res) => 
{
  //Read
  jsonReader("./server/evenements.JSON", (err, evenements) => 
  {
    if (err) 
    {
      console.log(err);
      return;
    }
    try
    {
      res.json({ message: evenements });
    }
    catch (err)
    {
      console.log("Error parsing JSON", err);
    }
    
  });
});

app.get("/api/creer", (req, res) => 
{
  //Read
  jsonReader("./server/timezone.JSON", (err, timezones) => 
  {
    if (err) 
    {
      console.log(err);
      return;
    }
    try
    {
      res.json({ message: timezones });
    }
    catch (err)
    {
      console.log("Error parsing JSON", err);
    }
    
  });

});

app.post("/api/create", (req,res) =>
{
  console.log(req.body.evenementName);
  //Append
  const newEvenement =
  {
    nom: req.body.evenementName,
    date: req.body.evenementDate,
    heure: req.body.evenementHour,
    timezone: req.body.evenementTimezone,
    
    dateHeureQuebec: req.body.evenementDateHourQuebec,
    description: req.body.evenementDescription,
    siteWeb: req.body.evenementWebsite,
  }

  //Mettre à true pour effectuer l'ajout d'un événement
  if (true)
  {
    jsonReader("./server/evenements.JSON", (err, evenements) => 
    {
      if (err) 
      {
        console.log(err);
        return;
      }
      try
      {
        evenements.push(newEvenement);    
        fs.writeFile("./server/evenements.JSON", JSON.stringify(evenements, null, 2), function(err)
        {
          if (err) throw err;
          console.log('The "data to append" was appended to file!');
        });
      }
      catch (err)
      {
        console.log("Error parsing JSON", err);
      }
    })
  }
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });