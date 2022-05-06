import React from "react";
import "./App.css";
import { NavLink, Routes, Route } from 'react-router-dom';
import Parser from 'html-react-parser';

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
      <NavLink exact activeClassName="current" to='/creerEvenement'>Créer événement automatiquement via Backend REST API</NavLink>
      
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

function CreerEvenement()
{
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api/creerEvenement")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (<div className='creerEvenement'>
  <main>
    <h2>Page débug - Creer un Evenement</h2>
    <p>Cette page appelle un REST API qui ajoute un événement.</p>
    <p>Malheureusement, je n'ai pas eu le temps pour soumettre des données au REST API via un formulaire en ReactNodeJS</p>
    <p>Mais au moins, je peux créer une nouvelle entrée dans un fichier JSON à partir du backend.</p>
    <p>{!data ? "Loading..." : data}</p>
    <p><NavLink exact activeClassName="current" to='/liste'>Liste événements</NavLink></p>
    <div id="prefooter"></div>
  </main>
</div>);
}


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
      var evenementHeureQuebec = data[i].heure;
      var evenementDate = data[i].date;
      var evenementHeureLocale = data[i].heure;
      var evenementTimezone = data[i].timezone;
      //var evenementOffset = data[i].offset;
      var evenementDescription = data[i].description;
      var evenementsiteWeb = data[i].siteWeb;

      stringListeEvenements = stringListeEvenements + "<li><div class='evenement'>";
      stringListeEvenements = stringListeEvenements + "<p>Nom: " + evenementNom + "</p>";
      stringListeEvenements = stringListeEvenements + "<p>Heure (Québec): " + evenementHeureQuebec + "</p>";
      stringListeEvenements = stringListeEvenements + "<p>Date: " + evenementDate + "</p>";
      stringListeEvenements = stringListeEvenements + "<p>Heure (Locale): " + evenementHeureLocale + "</p>";
      stringListeEvenements = stringListeEvenements + "<p>Fuseau horaire local: " + evenementTimezone + "</p>";
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
    
    <ul id='ulListeEvenements'>
      {Parser(stringListeEvenements)}
      
    </ul>
    <div id="prefooter"></div>
  </main>
</div>);
}

function Creer()
{
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

      document.getElementById('idDateEvenementQuebec').innerHTML = dateEvenementHeureQuebec;
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
        <form action="POST" id="CreerEvenement" >
          <p>
              Nom de l'événement: <input type='text' id='idNomEvenement' required></input>
          </p>
          <p>
              Date de l'événement: <input type='date' id='idDateEvenement' onChange={calculateLocalHour} required></input>
          </p>
          <p>
            <input type="radio" id="IsDST" name="fav_language" value="IsDST" onClick={selectTimePeriod}></input>
            <label for="IsDST">Show Daylight Saving Times</label><br></br>
            <input type="radio" id="NotDST" name="fav_language" value="NotDST" onClick={selectTimePeriod}></input>
            <label for="NotDST">Show Standard Times</label>
          </p>
          <p>
              Fuseau horaire: 
              <select id='idFuseauHoraire' onChange={calculateLocalHour}>
                {Parser(stringListeTimezones)}
              </select>
              
          </p>
          <p>
              Heure de l'événement (heure locale <span id='idHeureLocaleType'></span>): <input type='time' id='idTimeLocalEvenement' required onChange={calculateLocalHour}></input> Exemple: 12:30 p.m.
          </p>
          <p>
              Date et Heure de l'événement (heure de québec): <span id='idDateEvenementQuebec'>-</span>
          </p>
          <p>
            URL de l'événement: <input type='text' id='idSiteWebEvenement' required></input>
          </p>
          <p>
            Description: <textarea  id="idDescription"></textarea >
          </p>
          <button>Créer événement</button>
        </form>
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
    <Route exact path='/creerEvenement' element={CreerEvenement()}></Route>
  </Routes>
);



export default App;