import React, { useEffect, useState } from 'react';
import ModalEingabeAuftrag from "./component/modal_eingabe_auftrag";
import ModalEingabeAufgabe from "./component/modal_eingabe_aufgabe";
import './App.css';
import axios from 'axios';

function App() {
  const [auftraege, setAuftraege] = useState([]);
  const [selectedAuftrag, setSelectedAuftrag] = useState(null);
  const [aufgaben, setAufgaben] = useState([]);

  useEffect(() => {
    fetchAuftraege();
  }, []);

  const fetchAuftraege = () => {
    axios.get('http://localhost:8081/auftraege/')
      .then(response => {
        setAuftraege(response.data);
      })
      .catch(err => {
        console.error('Fehler beim Abrufen der Aufträge:', err);
      });
  };

  const fetchAufgaben = (auftragId) => {
    axios.get(`http://localhost:8081/auftraege/${auftragId}/aufgaben`)
      .then(response => {
        setAufgaben(response.data);
      })
      .catch(err => {
        console.error('Fehler beim Abrufen der Aufgaben:', err);
      });
  };

  const handleSaveAuftrag = () => {
    fetchAuftraege();
  };

  const handleSelectAuftrag = (auftrag) => {
    setSelectedAuftrag(auftrag);
    fetchAufgaben(auftrag.ID);
  };

  const handleDeleteAuftrag = async (ID) => {
    try {
      await axios.delete(`http://localhost:8081/auftraege/auftraege/${ID}`);
      fetchAuftraege();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ height: '12%', flexDirection: 'row' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <h1>Volgger OHG</h1>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', height: '80%' }}>
          <div style={{ display: 'flex', backgroundColor: 'lightgreen', padding: '10px', width: '25vh', flexDirection: 'column' }}>
            <div style={{ flex: '1', justifyContent: 'flex-start', flexDirection: 'column', height: '80%', overflowY: 'auto' }}>
              {auftraege.map((auftrag, index) => (
                <button key={index} style={{ display: 'flex', flexDirection: 'row', width: '100%', marginBottom: '5px', justifyContent: 'space-between' }} onClick={() => handleSelectAuftrag(auftrag)}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 'bold' }}>{auftrag.auftrag_name.charAt(0).toUpperCase() + auftrag.auftrag_name.slice(1)}</div>
                    <div>Ladetermin:</div>
                    <div>{auftrag.auftrag_liefertermin}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <button>edit</button>
                    <button onClick={e => handleDeleteAuftrag(auftrag.ID)}>Delete</button>
                  </div>
                </button>
              ))}
            </div>
            <div style={{ justifyContent: 'flex-end' }}>
              <ModalEingabeAuftrag onSave={handleSaveAuftrag} />
            </div>
          </div>
          <div style={{ display: 'flex', backgroundColor: 'lightcoral', padding: '10px', width: '100%', flexDirection: 'column' }}>
            <div style={{ flex: 1, flexDirection: 'column' }}>
              {selectedAuftrag && (
                <div style={{ padding: '10px', flexDirection: 'row' }}>
                  {aufgaben.map((aufgabe, index) => (
                    <div key={index} style={{ backgroundColor: 'lightblue', display: 'flex', marginBottom: '5px', flexDirection: 'column' }}>
                      <div style={{ display: 'flex' }}>

                        <h3>{aufgabe.stueck}   {aufgabe.hoehe} x {aufgabe.breite} x {aufgabe.laenge} </h3>

                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', width: '33%', textAlign: 'left' }}>
                            {aufgabe.kammer !== null ? <div>Kammer: {aufgabe.kammer === 1 ? 'Ja' : 'Nein'}</div> : null}
                            {aufgabe.kapplaenge !== null ? <div>Kapplaenge: {aufgabe.kapplaenge}</div> : null}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', width: '33%', textAlign: 'left' }}>
                            {aufgabe.lagenbreite !== null ? <div>Lagenbreite: {aufgabe.lagenbreite}</div> : null}
                            {aufgabe.lagenhoehe !== null ? <div>Lagenhoehe: {aufgabe.lagenhoehe}</div> : null}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {aufgabe.ewd_programm !== null ? <div>EWD Programm: {aufgabe.ewd_programm}</div> : null}

                          </div>
                        </div>
                        <div>
                          {aufgabe.kommentar}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
