// server/index.js
const path = require('path');
const express = require("express");
const timezones = require("./timezone.JSON");
const fs = require("fs");
const { stringify } = require('querystring');

const PORT = process.env.PORT || 3001;

const app = express();

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
      /*var stringListeEvenements = "";
      for (var i = 0, length = evenements.length; i < length; i++)
      {
        stringListeEvenements = stringListeEvenements + "<li>" + evenements[i].nom + "</li>"
        
        console.log("Nom: ", evenements[i].nom);
        //console.log("Date: ", evenements[i].date);
      }
      console.log(evenements);*/
      res.json({ message: evenements });
    }
    catch (err)
    {
      console.log("Error parsing JSON", err);
    }
    
  });
})

app.get("/api", (req, res) => 
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
      var stringListeEvenements = "";
      for (var i = 0, length = evenements.length; i < length; i++)
      {
        stringListeEvenements = stringListeEvenements + "<li>" + evenements[i].nom + "</li>"
        
        console.log("Nom: ", evenements[i].nom);
        //console.log("Date: ", evenements[i].date);
      }
      console.log(stringListeEvenements);
      res.json({ message: "evenements" });
    }
    catch (err)
    {
      console.log("Error parsing JSON", err);
    }
    
  });

});

// Handle GET requests to /api route
app.get("/api/Test", (req, res) => 
{
  
  const newEvenementTest =
  {
    nom: "Festival d'automne de Québec",
    date: "2022/07/07",
    heure: "20:00",
    timezone: "Eastern Standard Time",
    offset: -5,
    description: "Insert description here"
  }

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
      var stringListeEvenements = "";
      for (var i = 0, length = evenements.length; i < length; i++)
      {
        stringListeEvenements = stringListeEvenements + "<li>" + evenements[i].nom + "</li>"
        
        console.log("Nom: ", evenements[i].nom);
        //console.log("Date: ", evenements[i].date);
      }
      console.log(stringListeEvenements);
      res.json({ message: "stringListeEvenements" });
    }
    catch (err)
    {
      console.log("Error parsing JSON", err);
    }
    
  });
  
  

  //Append
  /*
  jsonReader("./server/evenements.JSON", (err, evenements) => 
  {
    if (err) 
    {
      console.log(err);
      return;
    }
    try
    {
      evenements.push(newEvenementTest);    
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
  */
  /*
  const customer = 
  {
    name: "Newbie Corp2.",
    order_count: 3,
    address: "Po Box City+"
  };
  const customer2 = 
  {
    name: "Newbie Corp3.",
    order_count: 4,
    address: "Po Box City++"
  };
  

  const jsonString2 = JSON.stringify(customer, null, 2)
  fs.writeFile('./server/test.json', jsonString2, err => 
  {
    if (err) 
    {
        console.log('Error writing file', err)
    } else 
    {
        console.log('Successfully wrote file')
    }
  })
  */
});


// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });