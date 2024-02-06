import React from 'react';
import ModalEingabeAuftrag from "./component/modal_eingabe_auftrag";
import ModalEingabeAufgabe from "./component/modal_eingabe_aufgabe";
import './App.css';





function App() {
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
              <button>Mailand Ladetermin: 05.02.24</button>
              <button>Mailand Ladetermin: 05.02.24</button>
              <button>Mailand Ladetermin: 05.02.24</button>
              <button>Mailand Ladetermin: 05.02.24</button>
            </div>
            <div style={{ justifyContent: 'flex-end' }}>
              <ModalEingabeAuftrag />
            </div>
          </div>


          <div style={{ display: 'flex', backgroundColor: 'lightcoral', padding: '10px', width: '100%', flexDirection: 'column' }}>
            <div style={{ flex: 1, flexDirection: 'column' }}>

              <button style={{ width: '100%', textAlign: 'left' }}>1P 74 x 74 x 4m für Kammer 15x15 Lagen</button>
              <button style={{ width: '100%', textAlign: 'left' }}>1P 74 x 74 x 4m für Kammer 15x15 Lagen</button>
              <button style={{ width: '100%', textAlign: 'left' }}>1P 74 x 74 x 4m für Kammer 15x15 Lagen</button>
              <button style={{ width: '100%', textAlign: 'left' }}>1P 74 x 74 x 4m für Kammer 15x15 Lagen</button>
              <button style={{ width: '100%', textAlign: 'left' }}>1P 74 x 74 x 4m für Kammer 15x15 Lagen</button>
              <button style={{ width: '100%', textAlign: 'left' }}>1P 74 x 74 x 4m für Kammer 15x15 Lagen</button>



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
    </div >
  );
}

export default App;
