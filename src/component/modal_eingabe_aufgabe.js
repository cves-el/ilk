// AuftragModal.js

import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

const AufgabeModal = ({ auftragId, auftragName, onSave }) => {
    const [hoehe, setHoehe] = useState(null);
    const [breite, setBreite] = useState(null);
    const [laenge, setLaenge] = useState(null);
    const [kammer, setKammer] = useState(null);
    const [kapplaenge, setKapplaenge] = useState(null);
    const [lagenbreite, setLagenbreite] = useState(null);
    const [lagenhoehe, setLagenhoehe] = useState(null);
    const [stueck, setStueck] = useState(null);
    const [ewdprogramm, setEwdprogramm] = useState(null);
    const [kommentar, setKommentar] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://192.168.1.5:8081/auftraege/${auftragId}/aufgaben/create`, {
                auftrag_id: auftragId,
                hoehe: hoehe,
                breite: breite,
                laenge: laenge,
                kammer: kammer,
                kapplaenge: kapplaenge,
                lagenbreite: lagenbreite,
                lagenhoehe: lagenhoehe,
                stueck: stueck,
                ewd_program: ewdprogramm,
                kommentar: kommentar
            });

            console.log(response.data);
            onSave(); // Aktualisiere die Auftragsliste in der App
            setHoehe(null);
            setBreite(null);
            setLaenge(null);
            setKammer(null);
            setKapplaenge(null);
            setLagenbreite(null);
            setLagenhoehe(null);
            setStueck(null);
            setEwdprogramm(null);
            setKommentar(null);

            closeModal();
        } catch (error) {
            console.error('Fehler beim Speichern des Auftrags:', error);
        }
    };

    return (
        <div>
            <button onClick={openModal}>Neue Aufgabe erstellen</button>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Neuen Auftrag erstellen"
            >
                <form onSubmit={handleSave}>
                    <h2>Neuen Aufgabe für {auftragName} erstellen</h2>
                    <div style={{ flexDirection: 'column', display: 'flex' }}>
                        <div>
                            Stück:
                            <input type="text" id="stueck" value={stueck} onChange={(e) => setStueck(e.target.value)} />
                        </div>
                        <div>
                            Höhe:
                            <input type="text" id="hoehe" value={hoehe} onChange={(e) => setHoehe(e.target.value)} required />
                        </div>
                        <div>
                            Breite:
                            <input type="text" id="breite" value={breite} onChange={(e) => setBreite(e.target.value)} required />
                        </div>
                        <div>
                            Länge:
                            <input type="text" id="laenge" value={laenge} onChange={(e) => setLaenge(e.target.value)} required />
                        </div>
                        <div>
                            Kammer:
                            <input type="text" id="kammer" value={kammer} onChange={(e) => setKammer(e.target.value)} />
                        </div>
                        <div>
                            Kapplänge:
                            <input type="text" id="kapplaenge" value={kapplaenge} onChange={(e) => setKapplaenge(e.target.value)} />
                        </div>
                        <div>
                            Lagenbreite:
                            <input type="text" id="lagenbreite" value={lagenbreite} onChange={(e) => setLagenbreite(e.target.value)} />
                        </div>
                        <div>
                            Lagenhöhe:
                            <input type="text" id="lagenhoehe" value={lagenhoehe} onChange={(e) => setLagenhoehe(e.target.value)} />
                        </div>
                        <div>
                            EWD Programm:
                            <input type="text" id="ewdprogramm" value={ewdprogramm} onChange={(e) => setEwdprogramm(e.target.value)} />
                        </div>
                        <div>
                            Kommentar:
                            <input type="text" id="kommentar" value={kommentar} onChange={(e) => setKommentar(e.target.value)} />
                        </div>


                    </div>
                    <button type='submit'>Speichern</button>
                    <button onClick={closeModal}>Abbrechen</button>
                </form>
            </Modal>
        </div>
    );
};

export default AufgabeModal;