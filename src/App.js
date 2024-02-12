import React, { useEffect, useState, useCallback } from 'react';
import ModalEingabeAuftrag from "./component/modal_eingabe_auftrag";
import ModalEingabeAufgabe from "./component/modal_eingabe_aufgabe";
import './App.css';
import axios from 'axios';

function App() {
  const [auftraege, setAuftraege] = useState([]);
  const [selectedAuftrag, setSelectedAuftrag] = useState('');
  const [aufgaben, setAufgaben] = useState([]);

  // useCallback verwenden, um fetchAuftraege zu definieren
  const fetchAuftraege = useCallback(() => {
    axios.get('http://192.168.1.5:8081/auftraege/')
      .then(response => {
        setAuftraege(response.data);
        // Wenn noch kein Auftrag ausgewählt wurde und es Aufträge gibt, den obersten Auftrag auswählen
        if (!selectedAuftrag && response.data.length > 0) {
          setSelectedAuftrag(response.data[0]);
        }
      })
      .catch(err => {
        console.error('Fehler beim Abrufen der Aufträge:', err);
      });
  }, [selectedAuftrag]); // selectedAuftrag als Abhängigkeit hinzufügen

  useEffect(() => {
    // Funktionen initial aufrufen
    fetchAuftraege();

    // setInterval verwenden, um die Funktionen alle 5 Sekunden auszuführen
    const intervalId = setInterval(() => {
      fetchAuftraege();
      if (selectedAuftrag) {
        fetchAufgaben(selectedAuftrag.ID);
      }
    }, 5000);

    // Aufräumen
    return () => clearInterval(intervalId);
  }, [selectedAuftrag, fetchAuftraege]); // Hier fetchAuftraege als Abhängigkeit hinzufügen

  // Funktion zum Laden der Aufgaben des ausgewählten Auftrags
  const fetchAufgaben = (auftragId) => {
    axios.get(`http://192.168.1.5:8081/auftraege/${auftragId}/aufgaben`)
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
      await axios.delete(`http://192.168.1.5:8081/auftraege/delete/${ID}`);
      fetchAuftraege();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App" style={{ backgroundColor: '#1f1f1f', color: '#ffffff' }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ height: '12%', flexDirection: 'row' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <h1 style={{ color: '#61dafb' }}>Volgger OHG</h1>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', height: '80%' }}>
          <div style={{ display: 'flex', backgroundColor: '#292929', padding: '10px', width: '25vh', flexDirection: 'column' }}>
            <div style={{ flex: '1', justifyContent: 'flex-start', flexDirection: 'column', height: '80%', overflowY: 'auto' }}>
              {auftraege.map((auftrag, index) => (
                <button key={index} style={{ display: 'flex', flexDirection: 'row', width: '100%', marginBottom: '5px', justifyContent: 'space-between' }} onClick={() => handleSelectAuftrag(auftrag)}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 'bold' }}>{auftrag.auftrag_name.charAt(0).toUpperCase() + auftrag.auftrag_name.slice(1)}</div>
                    <div>Ladetermin:</div>
                    <div>{auftrag.auftrag_liefertermin}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <button style={{ backgroundColor: '#292929', color: '#ffffff', border: '1px solid #ffffff' }}>edit</button>
                    <button style={{ backgroundColor: '#292929', color: '#ffffff', border: '1px solid #ffffff' }} onClick={e => handleDeleteAuftrag(auftrag.ID)}>Delete</button>
                  </div>
                </button>
              ))}
            </div>
            <div style={{ justifyContent: 'flex-end' }}>
              <ModalEingabeAuftrag onSave={handleSaveAuftrag} />
            </div>
          </div>
          <div style={{ display: 'flex', backgroundColor: '#424242', padding: '10px', width: '100%', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ flex: 1, flexDirection: 'column' }}>
              {selectedAuftrag && (
                <div style={{ padding: '10px', flexDirection: 'row' }}>
                  {aufgaben.map((aufgabe, index) => (
                    <div key={index} style={{ backgroundColor: '#757575', display: 'flex', marginBottom: '5px', flexDirection: 'row', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', marginBottom: '5px', flexDirection: 'column', width: '100%' }}>
                        <div style={{ display: 'flex', marginBottom: '2vh' }}>

                          <div style={{ width: '33%', textAlign: 'left' }}><strong>Menge:</strong> {aufgabe.stueck} </div><div>  <strong>Maße: </strong>{aufgabe.hoehe} x {aufgabe.breite} x {aufgabe.laenge} </div>

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
                          <div style={{ textAlign: 'left', marginTop: '1vh' }}>
                            {aufgabe.kommentar}
                          </div>
                        </div>
                      </div>
                      <div style={{ border: '1px solid #ffffff' }}>
                        <button style={{ backgroundColor: '#757575', color: '#ffffff', border: '1px solid #ffffff' }}>edit</button>
                        <button style={{ backgroundColor: '#757575', color: '#ffffff', border: '1px solid #ffffff' }}>Delete</button>
                      </div>
                    </div>

                  ))}
                </div>
              )}
            </div>
            <div style={{ justifyContent: 'flex-end' }}>
              <ModalEingabeAufgabe
                auftragId={selectedAuftrag.ID}
                auftragName={selectedAuftrag.auftrag_name}
                onSave={handleSaveAuftrag}
              />
            </div>
          </div>
          <div style={{ width: '20vh', backgroundColor: '#292929' }}>
            Chat
          </div>
        </div>
        <div style={{ display: 'flex', position: 'absolute', bottom: '0', height: '8%', width: '100%', backgroundColor: '#757575', alignItems: 'center', justifyContent: 'center' }}>
          Anzeige welches produkt gerade gemacht wird
        </div>
      </div>
    </div>
  );
}

export default App;
