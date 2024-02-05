import React, { useState } from 'react';
import ModalEingabeAuftrag from "./component/modal_eingabe_auftrag";
import ModalEingabeAufgabe from "./component/modal_eingabe_aufgabe";
import './App.css';




function App() {
  return (
    <div className="App">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ height: '15%', backgroundColor: 'lightblue', flexDirection: 'row' }}>
        <div style={{position: 'absolute', left: '0px'}}>
        <img src="/logo.png" alt="Mein Logo" style={{height: '100%'}} />
        </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent:  'center', height: '100%'}}>
        <h1>Volgger OHG</h1>
        </div>
         
          
        </div>


        <div style={{ display: 'flex', flexDirection: 'row', height: '77%' }}>
          <div style={{ backgroundColor: 'lightgreen', padding: '10px', width: '20vh', flexDirection: 'column', height: '100%' }}>
            test123
            <div style={{position: 'absolute', bottom: '0', left: '0'}}>
            <ModalEingabeAuftrag />
            </div>
          </div>
          <div style={{ backgroundColor: 'lightcoral', padding: '10px', width: '100%' }}>
            <ModalEingabeAufgabe />
          </div>
          <div style={{ width: '20vh' }}>
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
