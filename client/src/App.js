import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <a href="#">Accueil</a>
          <a href="#">Liste événements</a>
          <a href="#">Créer événement</a>
        </nav>
      </header>
      <main>
        <div>
          <p>{!data ? "Loading..." : data}</p>
        </div>
        <div>
          <h2>Créer événement</h2>
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
        </div>
        <div>
          <h2>Liste Évenements</h2>
        
          <div>
            <input type='text'></input>
            <button>Rechercher</button>
          </div>
          <ul>
            <li>...</li>
            <li>...</li>
            <li>...</li>
          </ul>
        </div>
      </main>
      <footer>

        Créé par Étienne Chouinard 2022 - Tout droits réservés - Etc.
      </footer>
    </div>
  );
}

export default App;