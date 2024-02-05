import React, { useState } from 'react';
import ModalEingabeAuftrag from "./component/modal_eingabe_auftrag";
import './App.css';



function App() {
  return (
    <div className="App">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ height: '10%', backgroundColor: 'lightblue', padding: '10px' }}>
          Oberer Bereich
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', height: '75%' }}>
          <div style={{ backgroundColor: 'lightgreen', padding: '10px', width: '20vh' }}>
            <ModalEingabeAuftrag />
          </div>
          <div style={{ backgroundColor: 'lightcoral', padding: '10px', width: '100%' }}>
            Aufgaben
          </div>
          <div style={{ width: '20vh' }}>
            Chat
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '0', height: '15%', width: '100%', backgroundColor: 'lightgray', padding: '10px' }}>
          Unterer Bereich
        </div>
      </div>
    </div>
  );
}

export default App;
