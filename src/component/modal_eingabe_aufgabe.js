import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import axios from 'axios';

const AufgabeModal = ({ auftragId, auftragName, onSave }) => {

    const [showNotification, setShowNotification] = useState(false);
    const [hoehe, setHoehe] = useState(null);
    const [breite, setBreite] = useState(null);
    const [laenge, setLaenge] = useState(null);
    const [kammer, setKammer] = useState('0');
    const [stueck_pack, setStueck_pack] = useState('0');
    const [kapplaenge, setKapplaenge] = useState(null);
    const [lagenbreite, setLagenbreite] = useState(null);
    const [lagenhoehe, setLagenhoehe] = useState(null);
    const [seitenware, setSeitenware] = useState(null);
    const [stueck, setStueck] = useState(null);
    const [ewdprogramm, setEwdprogramm] = useState(null);
    const [zugeschnitten, setZugeschnitten] = useState('0');
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
            const taskData = {
                auftrag_id: auftragId,
                hoehe: hoehe !== '' ? hoehe : null,
                breite: breite !== '' ? breite : null,
                laenge: laenge !== '' ? laenge : null,
                kammer: kammer !== '' ? kammer : '0',
                stueck_pack: stueck_pack !== '' ? stueck_pack : '0',
                kapplaenge: kapplaenge !== '' ? kapplaenge : null,
                lagenbreite: lagenbreite !== '' ? lagenbreite : null,
                lagenhoehe: lagenhoehe !== '' ? lagenhoehe : null,
                seitenware: seitenware !== '' ? seitenware : null,
                stueck: stueck !== '' ? stueck : null,
                ewd_programm: ewdprogramm !== '' ? ewdprogramm : null,
                zugeschnitten: zugeschnitten !== '' ? zugeschnitten : '0',
                kommentar: kommentar !== '' ? kommentar : null
            };

            // Senden Sie die Aufgabeninformationen an den Server
            const response = await axios.post(`http://192.168.1.5:8081/auftraege/${auftragId}/aufgaben/create`, taskData);


            console.log(response.data);
            onSave(); // Aktualisiere die Auftragsliste in der App

            setHoehe('');
            setBreite('');
            setLaenge('');
            setKammer(0);
            setStueck_pack('0');
            setKapplaenge('');
            setLagenbreite('');
            setLagenhoehe('');
            setSeitenware('');
            setStueck('');
            setEwdprogramm('');
            setZugeschnitten(0);
            setKommentar('');



            setShowNotification(true);


        } catch (error) {
            console.error('Fehler beim Speichern des Auftrags:', error);
        }
    };

    return (
        <div>
            <Button variant='primary' onClick={openModal}>Neue Aufgabe erstellen</Button>

            <Modal
                show={modalIsOpen}
                onHide={closeModal}
                contentLabel="Neuen Auftrag erstellen"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Neue Aufgabe für {auftragName} erstellen</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSave}>
                        <div>
                            <div className="form-group row mb3">
                                <label htmlFor="stueck" className="col-sm-2 col-form-label">Stück:</label>
                                <div className="col-sm-5" style={{ flexDirection: 'row', display: 'flex' }}>
                                    <input type="number" className="form-control" id="stueck" value={stueck} onChange={(e) => setStueck(e.target.value)} />
                                    <label style={{ alignItems: 'center', display: 'flex', paddingLeft: '5vh' }}>
                                        P.
                                        <input type="checkbox" onChange={(e) => setStueck_pack(e.target.checked ? '0' : '1')} checked={stueck_pack === '0'} />
                                    </label>
                                </div>

                            </div>
                            <div className="form-group row">
                                <label htmlFor="hoehe" className="col-sm-2 col-form-label">Höhe:</label>
                                <div className="col-sm-10">
                                    <input type="number" className="form-control" id="hoehe" value={hoehe} onChange={(e) => setHoehe(e.target.value)} required />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="breite" className="col-sm-2 col-form-label">Breite:</label>
                                <div className="col-sm-10">
                                    <input type="number" className="form-control" id="breite" value={breite} onChange={(e) => setBreite(e.target.value)} required />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="laenge" className="col-sm-2 col-form-label">Länge:</label>
                                <div className="col-sm-10">
                                    <input type="number" className="form-control" id="laenge" value={laenge} onChange={(e) => setLaenge(e.target.value)} required />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-evenly', padding: '5px' }}>
                                <label htmlFor="kammer" >Kammer:</label>
                                <label style={{ alignItems: 'center', display: 'flex' }}>
                                    <input type="checkbox" onChange={(e) => setKammer(e.target.checked ? '1' : '0')} checked={kammer === '1'} />
                                </label>

                                <label htmlFor="zugeschnitten" >Zugeschnitten:</label>
                                <input type="checkbox" onChange={(e) => setZugeschnitten(e.target.checked ? '1' : '0')} checked={zugeschnitten === '1'} />

                            </div>
                            <div className="form-group row">
                                <label htmlFor="kapplaenge" className="col-sm-2 col-form-label">Kapplänge:</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="kapplaenge" value={kapplaenge} onChange={(e) => setKapplaenge(e.target.value)} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="lagenbreite" className="col-sm-2 col-form-label">Lagenbreite:</label>
                                <div className="col-sm-10">
                                    <input type="number" className="form-control" id="lagenbreite" value={lagenbreite} onChange={(e) => setLagenbreite(e.target.value)} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="lagenhoehe" className="col-sm-2 col-form-label">Lagenhöhe:</label>
                                <div className="col-sm-10">
                                    <input type="number" className="form-control" id="lagenhoehe" value={lagenhoehe} onChange={(e) => setLagenhoehe(e.target.value)} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="seitenware" className="col-sm-2 col-form-label">Seitenware:</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="seitenware" value={seitenware} onChange={(e) => setSeitenware(e.target.value)} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="ewdprogramm" className="col-sm-2 col-form-label">EWD Programm:</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="ewdprogramm" value={ewdprogramm} onChange={(e) => setEwdprogramm(e.target.value)} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="kommentar" className="col-sm-2 col-form-label">Kommentar:</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="kommentar" value={kommentar} onChange={(e) => setKommentar(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <Modal.Footer>
                            <Button variant="primary" type="submit">Aufgabe hinzufügen</Button>
                            <Button variant="secondary" onClick={closeModal}>Abbrechen</Button>
                        </Modal.Footer>
                    </form>

                    <Toast
                        show={showNotification}
                        onClose={() => setShowNotification(false)}
                        delay={2000} // Zeit in Millisekunden, nach der der Toast automatisch ausgeblendet wird
                        autohide
                        className="d-inline-block m-1"
                        bg={'primary' && 'text-white'}

                        style={{
                            position: 'fixed',
                            bottom: '1rem',

                        }}
                    >
                        <Toast.Body>Die Aufgabe wurde erfolgreich hinzugefügt.</Toast.Body>
                    </Toast>
                </Modal.Body>
            </Modal>


        </div>
    );
};

export default AufgabeModal;
