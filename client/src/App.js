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
  /*
  for (var i = 0, length = data.length; i < length; i++)
  {
    
    var evenementNom = data[i].nom;
    var evenementHeureQuebec = data[i].heure;
    var evenementDate = data[i].date;
    var evenementHeureLocale = data[i].heure;
    var evenementTimezone = data[i].timezone;
    //var evenementOffset = data[i].offset;
    var evenementDescription = data[i].description;
    var evenementsiteWeb = data[i].siteWeb;

    stringListeEvenements = stringListeEvenements + "<li><div class='evenement'>"
    stringListeEvenements = stringListeEvenements + "<p>Nom: " + evenementNom + "</p>"
    stringListeEvenements = stringListeEvenements + "<p>Heure (Québec): " + evenementHeureQuebec + "</p>"
    stringListeEvenements = stringListeEvenements + "<p>Date: " + evenementDate + "</p>"
    stringListeEvenements = stringListeEvenements + "<p>Heure (Locale): " + evenementHeureLocale + "</p>"
    stringListeEvenements = stringListeEvenements + "<p>Fuseau horaire local: " + evenementTimezone + "</p>"
    stringListeEvenements = stringListeEvenements + "<p>Description: " + evenementDescription + "</p>"
    stringListeEvenements = stringListeEvenements + "<p>Site web: " + evenementsiteWeb + "</p>"
    
    stringListeEvenements = stringListeEvenements + "</ul></li>"
    
  }
  */

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
  /*
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);
*/
  //<p>{!stringListeEvenements ? "Loading..." : stringListeEvenements}</p>
  

  return (
    <div className='creer'>
      <main>
        <div>
          
        </div>
        <h2>Créer événement</h2>
        <form action="POST" id="CreerEvenement">
          <p>
              Nom de l'événement: <input type='text' id='idNomEvenement'></input>
          </p>
          <p>
              Date de l'événement: <input type='date' id='idDateEvenement'></input>
          </p>
          <p>
              Fuseau horaire: 
              <select id='idFuseauHoraire'>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
              </select>
          </p>
          <p>
              Heure de l'événement (heure locale <span id='idHeureLocaleType'></span>): <input type='date' id='idDateEvenement'></input>
          </p>
          <p>
              Date et Heure de l'événement (heure de québec/EST): <span id='idDateEvenementQuebec'>-</span>
          </p>
          <p>
            URL de l'événement: <input type='text' id='idDateEvenement'></input>
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
  </Routes>
);



export default App;