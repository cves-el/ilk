import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Pen } from 'react-bootstrap-icons';

function ModalEditAuftrag({ auftrag_Name, ID, hoehe, breite, laenge, kammer, kapplaenge, lagenbreite, lagenhoehe, stueck_pack, stueck, seitenware, ewd_programm, zugeschnitten, kommentar, onSave }) {
    const [auftragName, setAuftragName] = useState('');
    const [_ID, setID] = useState('');
    const [_hoehe, setHoehe] = useState('');
    const [_breite, setBreite] = useState('');
    const [_laenge, setLaenge] = useState('');
    const [_kammer, setKammer] = useState('');
    const [_kapplaenge, setKapplaenge] = useState('');
    const [_lagenbreite, setLagenbreite] = useState('');
    const [_lagenhoehe, setLagenhoehe] = useState('');
    const [_stueck_pack, setStueck_pack] = useState('');
    const [_stueck, setStueck] = useState('');
    const [_seitenware, setSeitenware] = useState('');
    const [_zugeschnitten, setZugeschnitten] = useState('');
    const [_ewd_programm, setEwdprogramm] = useState('');
    const [_kommentar, setKommentar] = useState('');


    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        setAuftragName(auftrag_Name);
        setID(ID);
        setHoehe(hoehe);
        setBreite(breite);
        setLaenge(laenge);
        setKammer(kammer);
        setKapplaenge(kapplaenge);
        setLagenbreite(lagenbreite);
        setLagenhoehe(lagenhoehe);
        setStueck_pack(stueck_pack);
        setStueck(stueck);
        setSeitenware(seitenware);
        setZugeschnitten(zugeschnitten);
        setEwdprogramm(ewd_programm);
        setKommentar(kommentar);

    }, [auftrag_Name, ID, hoehe, breite, laenge, kammer, kapplaenge, lagenbreite, lagenhoehe, stueck_pack, stueck, seitenware, ewd_programm, zugeschnitten, kommentar]);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://192.168.1.5:8081/aufgaben/update/${_ID}`, {
                hoehe: _hoehe || null,
                breite: _breite || null,
                laenge: _laenge || null,
                kammer: _kammer || '0',
                kapplaenge: _kapplaenge || null,
                lagenbreite: _lagenbreite || null,
                lagenhoehe: _lagenhoehe || null,
                stueck_pack: _stueck_pack || '0',
                stueck: _stueck || null,
                seitenware: _seitenware || null,
                ewd_programm: _ewd_programm || null,
                zugeschnitten: _zugeschnitten || '0',
                kommentar: _kommentar || null
            });
            onSave();
            closeModal();
        } catch (error) {
            console.error('Fehler beim Aktualisieren der Aufgabe:', error);
        }
    };

    return (
        <div>
            <Button variant='outline-dark' onClick={openModal}><Pen /></Button>

            <Modal
                show={modalIsOpen}
                onHide={closeModal}
                contentLabel="Neuen Auftrag erstellen"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Aufgabe für {auftragName} aktualisieren</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <div className="form-group row mb3">
                                <label htmlFor="stueck" className="col-sm-2 col-form-label">Stück:</label>
                                <div className="col-sm-5" style={{ flexDirection: 'row', display: 'flex' }}>
                                    <input type="number" className="form-control" id="stueck" value={stueck} onChange={(e) => setStueck(e.target.value)} />
                                    <label style={{ alignItems: 'center', display: 'flex', paddingLeft: '5vh' }}>
                                        P.
                                        <input type="checkbox" onChange={(e) => setStueck_pack(e.target.checked ? '0' : '1')} checked={_stueck_pack === '0'} />
                                    </label>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="hoehe" className="col-sm-2 col-form-label">Höhe:</label>
                                <div className="col-sm-10">
                                    <input type="number" className="form-control" id="hoehe" value={_hoehe} onChange={(e) => setHoehe(e.target.value)} required />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="breite" className="col-sm-2 col-form-label">Breite:</label>
                                <div className="col-sm-10">
                                    <input type="number" className="form-control" id="breite" value={_breite} onChange={(e) => setBreite(e.target.value)} required />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="laenge" className="col-sm-2 col-form-label">Länge:</label>
                                <div className="col-sm-10">
                                    <input type="number" className="form-control" id="laenge" value={_laenge} onChange={(e) => setLaenge(e.target.value)} required />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-evenly', padding: '5px' }}>
                                <label htmlFor="kammer" >Kammer:</label>
                                <label style={{ alignItems: 'center', display: 'flex' }}>
                                    <input type="checkbox" checked={_kammer === 1} onChange={(e) => setKammer(e.target.checked ? 1 : 0)} />
                                </label>

                                <label htmlFor="zugeschnitten" >Zugeschnitten:</label>
                                <label style={{ alignItems: 'center', display: 'flex' }}>
                                    <input type="checkbox" checked={_zugeschnitten === 1} onChange={(e) => setZugeschnitten(e.target.checked ? 1 : 0)} />
                                </label>

                            </div>
                            <div className="form-group row">
                                <label htmlFor="kapplaenge" className="col-sm-2 col-form-label">Kapplänge:</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="kapplaenge" value={_kapplaenge} onChange={(e) => setKapplaenge(e.target.value)} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="lagenbreite" className="col-sm-2 col-form-label">Lagenbreite:</label>
                                <div className="col-sm-10">
                                    <input type="number" className="form-control" id="lagenbreite" value={_lagenbreite} onChange={(e) => setLagenbreite(e.target.value)} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="lagenhoehe" className="col-sm-2 col-form-label">Lagenhöhe:</label>
                                <div className="col-sm-10">
                                    <input type="number" className="form-control" id="lagenhoehe" value={_lagenhoehe} onChange={(e) => setLagenhoehe(e.target.value)} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="seitenware" className="col-sm-2 col-form-label">Seitenware:</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="seitenware" value={_seitenware} onChange={(e) => setSeitenware(e.target.value)} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="ewdprogramm" className="col-sm-2 col-form-label">EWD Programm:</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="ewdprogramm" value={_ewd_programm} onChange={(e) => setEwdprogramm(e.target.value)} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="kommentar" className="col-sm-2 col-form-label">Kommentar:</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="kommentar" value={_kommentar} onChange={(e) => setKommentar(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <Modal.Footer>
                            <Button variant="primary" type="submit">Aufgabe aktualisieren</Button>
                            <Button variant="secondary" onClick={closeModal}>Abbrechen</Button>
                        </Modal.Footer>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default ModalEditAuftrag;
