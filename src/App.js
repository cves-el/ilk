import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Startseite from './pages/Startseite';
import Bandsaege from './pages/Bandsaege';
import Entrindung from './pages/Entrindung';
import Eingabe from './pages/Eingabe';
import Beladung from './pages/Beladung';
import Sortierung from './pages/Sortierung';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Startseite />} />
        <Route path="/bandsaege" element={<Bandsaege />} />
        <Route path="/entrindung" element={<Entrindung />} />
        <Route path="/eingabe" element={<Eingabe />} />
        <Route path="/beladung" element={<Beladung />} />
        <Route path="/sortierung" element={<Sortierung />} />
      </Routes>
    </Router>
  );
}

export default App;
