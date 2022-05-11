import React from "react";
import "./App.css";
import { NavLink, Routes, Route } from 'react-router-dom';
import Parser from 'html-react-parser';
import axios from 'axios';

const App = () => (
  <div className='app'>
    
    <Navigation />
    <Main />
    <Footer />
  </div>
);

const Navigation = () => (
  <header>
    <nav>
      <NavLink exact activeClassName="current" to='/'>Accueil</NavLink>
      <NavLink exact activeClassName="current" to='/liste'>Liste événements</NavLink>
      <NavLink exact activeClassName="current" to='/creer'>Créer événement</NavLink>
      
    </nav>
  </header>
);

const Footer = () => (
  
  <footer>
  
    Créé par Étienne Chouinard 2022 - Tout droits réservés - Etc.
  </footer>
);

const Home = () => (
  <div className='home'>
    <main>
      <h2>Page d'accueil</h2>
      <p>Veuillez utiliser la navigation pour voir les bonnes pages.</p>
      <div id="prefooter"></div>
    </main>
  </div>
);

function Liste()
{
  //Fonction pour cacher les évenements qui ne correspondent pas au critère de recherche.
  function searchEvenements() 
  {
      var strEvenementRecherche = document.getElementById("recherheEvenement").value;

      var allTags = document.getElementById('ulListeEvenements').getElementsByTagName("li");
      for (var i = 0, len = allTags.length; i < len; i++) 
      {
          var labelInnerText = allTags[i].innerHTML;
          
          if (labelInnerText.includes(strEvenementRecherche))
          {
              allTags[i].style.display = "list-item";
          }
          else
          {
              allTags[i].style.display = "none";
          }
      }
  }

  //Fonction pour annuler la recherche d'événements, et afficher tous les événements.
  function showEvenements()
  {
      var allTags = document.getElementById('ulListeEvenements').getElementsByTagName("li");
      for (var i = 0, len = allTags.length; i < len; i++) 
      {
          allTags[i].style.display = "list-item";
      }
  }

  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api/liste")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);
  
  var stringListeEvenements = "";
  
  //Création de la liste des événements en fonction du JSON reçu.
  if (data)
  {
    for (var length = data.length, i = length-1; i >=0; i--)
    {
      
      var evenementNom = data[i].nom;
      var evenementDateHeureQuebec = data[i].dateHeureQuebec;
      var evenementDate = data[i].date;
      var evenementHeureLocale = data[i].heure;
      var evenementTimezone = data[i].timezone;
      var evenementDescription = data[i].description;
      var evenementsiteWeb = data[i].siteWeb;

      stringListeEvenements = stringListeEvenements + "<li><div class='evenement'>";
      stringListeEvenements = stringListeEvenements + "<p>Nom: " + evenementNom + "</p>";
      stringListeEvenements = stringListeEvenements + "<p>Date: " + evenementDate + "</p>";
      stringListeEvenements = stringListeEvenements + "<p>Heure (Locale): " + evenementHeureLocale + "</p>";
      stringListeEvenements = stringListeEvenements + "<p>Fuseau horaire local: " + evenementTimezone + "</p>";
      stringListeEvenements = stringListeEvenements + "<p>Date et Heure (Fuseau horaire de québec): " + evenementDateHeureQuebec + "</p>";
      stringListeEvenements = stringListeEvenements + "<p>Description: " + evenementDescription + "</p>";
      stringListeEvenements = stringListeEvenements + "<p>Site web: " + evenementsiteWeb + "</p>";
      
      stringListeEvenements = stringListeEvenements + "</ul></li>";
      
    }
  }
  

  return (<div className='liste'>
  <main>
    <h2>Liste Évenements</h2>
    
    <div>
      <input type='text' id='recherheEvenement'></input>
      <button id="btn_rechercher" onClick={searchEvenements}>Rechercher</button>
      <button id="btn_annulerRecherche" onClick={showEvenements}>Annuler</button>
    </div>
    <p>Il est peut-être nécessaire de rafraîchir la page avec Ctrl+f5 pour afficher les derniers événements ajoutés.</p>
    <ul id='ulListeEvenements'>
      {Parser(stringListeEvenements)}
      
    </ul>
    <div id="prefooter"></div>
  </main>
</div>);
}

function Creer()
{
  function handleSubmit(e) 
  {
    
    e.preventDefault();

    const evenement = {
      evenementName: e.target.evenementName.value,
      evenementDate: e.target.evenementDate.value,
      evenementHour: e.target.evenementHour.value,
      evenementTimezone: e.target.evenementTimezone.value,
      evenementDateHourQuebec: e.target.evenementDateHourQuebec.value,
      evenementDescription: e.target.evenementDescription.value,
      evenementWebsite: e.target.evenementWebsite.value,
      
    };

    axios
      .post('/api/create', evenement)
      .then(() => console.log('Evenement Created'))
      .catch(err => {
        console.error(err);
      });

      document.getElementById("idSuccessfulCreate").hidden = false;
  };

  function selectTimePeriod()
  {
    var classNameToShow = "";
    if (document.getElementById('IsDST').checked)
    {
      classNameToShow = "IsDST";
    }
    else
    {
      classNameToShow = "NotDST"
    }

    var allTags = document.getElementById('idFuseauHoraire').getElementsByTagName("option");
    for (var i = 0, len = allTags.length; i < len; i++) 
    {
      if (allTags[i].className.includes(classNameToShow))
      {
        allTags[i].style.display = "block";
      }
      else
      {
        allTags[i].style.display = "none";
      }
    }
  }

  function calculateLocalHour()
  {
    var evenementDate = document.getElementById('idDateEvenement').value;
    var evenementTime = document.getElementById('idTimeLocalEvenement').value;
    
    if (evenementDate !== "" && evenementTime !== "")
    {
      var timezone = document.getElementById('idFuseauHoraire').value;
      var offsetTimezoneEvenement = parseFloat(timezone.substring(document.getElementById('idFuseauHoraire').value, timezone.indexOf(':')));
      var offsetTimezoneQuebec = -5;
      var allTags = document.getElementById('idFuseauHoraire').getElementsByTagName("option");
      for (var i = 0, len = allTags.length; i < len; i++) 
      {
        if (allTags[i].selected && allTags[i].className.includes("IsDST"))
        {
          offsetTimezoneQuebec = -4;
          break;
        }
      }
      var dateEvenementHeureQuebec = new Date(evenementDate + " " + evenementTime)
      var offsetDifference =  offsetTimezoneQuebec - offsetTimezoneEvenement;
      dateEvenementHeureQuebec.setTime(dateEvenementHeureQuebec.getTime() + (offsetDifference*60*60*1000));
      var dateEvenementHeureQuebecFormatted = 
        dateEvenementHeureQuebec.getFullYear() + "-" +
        ("0" + (dateEvenementHeureQuebec.getMonth()+1)).slice(-2) + "-" +
        ("0" + dateEvenementHeureQuebec.getDate()).slice(-2) + " " +
        ("0" + dateEvenementHeureQuebec.getHours()).slice(-2) + "h " +
        ("0" + dateEvenementHeureQuebec.getMinutes()).slice(-2);
      
      document.getElementById('idDateEvenementQuebecSpan').innerHTML = dateEvenementHeureQuebecFormatted;
      document.getElementById('idDateEvenementQuebec').value = dateEvenementHeureQuebecFormatted;
    }
    else
    {
      document.getElementById('idDateEvenementQuebec').innerHTML = "-";
    }
  }

  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api/creer")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);
  
  var stringListeTimezones = "";
  
  if (data)
  {
    for (var i = 0, length = data.length; i < length; i++)
    {
      var timezoneIsdst = ""
      if (data[i].isdst === true)
      {
        timezoneIsdst = "IsDST";
      }
      else
      {
        timezoneIsdst = "NotDST";
      }
      var timezoneAbbr = data[i].abbr;
      var timezoneOffset = data[i].offset;
      var timezoneDesc = data[i].text;
      
      stringListeTimezones = stringListeTimezones + "<option class=" + timezoneIsdst + " >"+timezoneOffset + ": "+timezoneAbbr + " - " + timezoneDesc+"</option>";
    }
  }

  return (
    <div className='creer'>
      <main>
        <h2>Créer événement</h2>
        <form  onSubmit={handleSubmit} id="CreerEvenement" >
          <p>
              Nom de l'événement: <input type='text' id='idNomEvenement' name="evenementName" required></input>
          </p>
          <p>
              Date de l'événement: <input type='date' id='idDateEvenement' name="evenementDate" onChange={calculateLocalHour} required></input>
          </p>
          <p>
            <input type="radio" id="IsDST" value="IsDST" name="DaylightSavingTimes" onClick={selectTimePeriod}></input>
            <label for="IsDST">Show Daylight Saving Times</label><br></br>
            <input type="radio" id="NotDST" value="NotDST" name="DaylightSavingTimes" onClick={selectTimePeriod}></input>
            <label for="NotDST">Show Standard Times</label>
          </p>
          <p>
              Fuseau horaire: 
              <select id='idFuseauHoraire' name="evenementTimezone" onChange={calculateLocalHour}>
                {Parser(stringListeTimezones)}
              </select>
              
          </p>
          <p>
              Heure de l'événement (heure locale <span id='idHeureLocaleType'></span>): <input type='time' id='idTimeLocalEvenement' name="evenementHour" required onChange={calculateLocalHour}></input> Exemple: 12:30 p.m.
          </p>
          <p>
              Date et Heure de l'événement (heure de québec): <span id='idDateEvenementQuebecSpan'>-</span><input type="hidden" id="idDateEvenementQuebec" name="evenementDateHourQuebec" required></input>
          </p>
          <p>
            URL de l'événement: <input type='text' id='idSiteWebEvenement' name="evenementWebsite" required></input>
          </p>
          <p>
            Description: <textarea  id="idDescription" name="evenementDescription"></textarea >
          </p>
          <button>Créer événement</button>
        </form>
        <p id="idSuccessfulCreate" hidden>L'événement a été créé avec succès. <NavLink exact activeClassName="current" to='/liste'>Liste événements</NavLink></p>
        <div id="prefooter"></div>
      </main>
    </div>
  );
}
const Main = () => (
  <Routes>
    <Route exact path='/' element={<Home/>}></Route>
    <Route exact path='/liste' element={Liste()}></Route>
    <Route exact path='/creer' element={Creer()}></Route>
  </Routes>
);



export default App;