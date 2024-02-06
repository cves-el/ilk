import React, { useEffect, useState } from 'react';
import ModalEingabeAuftrag from "./component/modal_eingabe_auftrag";
import ModalEingabeAufgabe from "./component/modal_eingabe_aufgabe";
import './App.css';

function App() {
  const [auftraege, setAuftraege] = useState([]);

  useEffect(() => {
    fetchAuftraege();
  }, []);

  const fetchAuftraege = () => {
    fetch('http://localhost:8081/auftraege')
      .then(res => res.json())
      .then(data => setAuftraege(data))
      .catch(err => console.log(err));
  };

  const handleSaveAuftrag = async (newAuftrag) => {
    try {
      const response = await fetch('http://localhost:8081/auftraege', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAuftrag)
      });
      if (response.ok) {
        fetchAuftraege(); // Aktualisiere die Auftragsliste nach dem Hinzufügen eines neuen Auftrags
      } else {
        console.error('Fehler beim Hinzufügen eines neuen Auftrags:', response.statusText);
      }
    } catch (error) {
      console.error('Fehler beim Hinzufügen eines neuen Auftrags:', error);
    }
  };

  return (
    <div className="App">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ height: '12%', flexDirection: 'row' }}>
          <div style={{ position: 'absolute', left: '0px' }}>
            <img src="/logo.png" alt="Mein Logo" style={{ height: '100%' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <h1>Volgger OHG</h1>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', height: '80%' }}>
          <div style={{ display: 'flex', backgroundColor: 'lightgreen', padding: '10px', width: '20vh', flexDirection: 'column' }}>
            <div style={{ flex: '1', justifyContent: 'flex-start', flexDirection: 'columnn' }}>
              {auftraege.map((auftrag, index) => (
                <button key={index} style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: '5px' }}>
                  <div style={{ fontWeight: 'bold' }}>{auftrag.auftrag_name.charAt(0).toUpperCase() + auftrag.auftrag_name.slice(1)}</div>
                  <div>Ladetermin:</div>
                  <div>{auftrag.auftrag_liefertermin}</div>
                </button>
              ))}
            </div>
            <div style={{ justifyContent: 'flex-end' }}>
              <ModalEingabeAuftrag onSave={handleSaveAuftrag} />
            </div>
          </div>

          <div style={{ display: 'flex', backgroundColor: 'lightcoral', padding: '10px', width: '100%', flexDirection: 'column' }}>
            <div style={{ flex: 1, flexDirection: 'column' }}>
              {/* Hier deine weiteren Komponenten */}
            </div>
            <div style={{ justifyContent: 'flex-end' }}>
              <ModalEingabeAufgabe />
            </div>
          </div>

          <div style={{ width: '20vh', backgroundColor: 'lightgreen' }}>
            Chat
          </div>
        </div>
        <div style={{ display: 'flex', position: 'absolute', bottom: '0', height: '8%', width: '100%', backgroundColor: 'lightgray', alignItems: 'center', justifyContent: 'center' }}>
          Anzeige welches produkt gerade gemacht wird
        </div>
      </div>
    </div>
  );
}

export default App;
