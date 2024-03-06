import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { CheckLg } from 'react-bootstrap-icons';

function ModalAufgabeAbgeschlossen({ ID, hoehe, breite, laenge, lagenbreite, lagenhoehe, stueck_pack, stueck, onSave }) {
    const [_ID, setID] = useState('');
    const [_hoehe, setHoehe] = useState('');
    const [_breite, setBreite] = useState('');
    const [_laenge, setLaenge] = useState('');

    const [_lagenbreite, setLagenbreite] = useState('');
    const [_lagenhoehe, setLagenhoehe] = useState('');
    const [_stueck_pack, setStueck_pack] = useState('');
    const [_stueck, setStueck] = useState('');

    const [_gesamt, setGesamt] = useState('0')
    const [_plus, setPlus] = useState('0');

    const [_lgbreite, setLGbreite] = useState('');
    const [_lghoehe, setLGhoehe] = useState('');


    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        setID(ID);
        setHoehe(hoehe);
        setBreite(breite);
        setLaenge(laenge);

        setLagenbreite(lagenbreite);
        setLagenhoehe(lagenhoehe);
        setStueck_pack(stueck_pack);
        setStueck(stueck);

        setLGbreite(lagenbreite);
        setLGhoehe(lagenhoehe);


    }, [ID, hoehe, breite, laenge, lagenbreite, lagenhoehe, stueck_pack, stueck]);



    useEffect(() => {
        if (_stueck_pack === 1) {
            setGesamt(_stueck);
        }
    }, [_stueck_pack, _stueck]);

    const openModal = () => {
        setID(ID);
        setHoehe(hoehe);
        setBreite(breite);
        setLaenge(laenge);

        setLagenbreite(lagenbreite);
        setLagenhoehe(lagenhoehe);
        setLGbreite(lagenbreite);
        setLGhoehe(lagenhoehe);
        setStueck_pack(stueck_pack);
        setStueck(stueck);

        setModalIsOpen(true);
    };

    const closeModal = () => {
        setGesamt('0');
        setPlus('0');
        setLagenbreite('');
        setLagenhoehe('');
        setLGbreite('');
        setLGhoehe('');
        setModalIsOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://192.168.1.5:8081/aufgaben/updateAbgeschlossen/${_ID}`, {
                ist_stueck: _gesamt || null,
                status: '99'
            });
            onSave();
            closeModal();
        } catch (error) {
            console.error('Fehler beim Aktualisieren der Aufgabe:', error);
        }

    };

    const totale = useCallback(() => {
        const neueLagenbreite = parseFloat(_lagenbreite);
        const neueLagenhoehe = parseFloat(_lagenhoehe);
        const neueLGbreite = parseFloat(_lgbreite);
        const neueLGhoehe = parseFloat(_lghoehe);

        if (_stueck_pack === 0) {

            if (parseInt(_stueck) > 1) {
                if (!isNaN(neueLagenbreite) && !isNaN(neueLagenhoehe) && !isNaN(_stueck)) {
                    if (parseInt(_plus) > 0) {

                        setGesamt((neueLagenhoehe * neueLagenbreite * (_stueck - 1)) + (neueLGbreite * neueLGhoehe) + parseInt(_plus));
                    } else {
                        setGesamt((neueLagenhoehe * neueLagenbreite * (_stueck - 1)) + (neueLGbreite * neueLGhoehe));
                    }
                }
                console.log(neueLagenbreite, neueLagenhoehe)
            } else {
                if (!isNaN(neueLagenbreite) && !isNaN(neueLagenhoehe) && !isNaN(_stueck)) {
                    if (parseInt(_plus) > 0) {
                        setGesamt(neueLagenhoehe * neueLagenbreite * _stueck + parseInt(_plus));
                    } else {
                        setGesamt(neueLagenhoehe * neueLagenbreite * _stueck);
                    }
                }
            }

        }



    }, [_lagenhoehe, _lagenbreite, _stueck, _plus, _lgbreite, _lghoehe, _stueck_pack]);;
    useEffect(() => {
        totale();
    }, [totale, _lagenhoehe, _lagenbreite, _stueck, _plus, _lgbreite, _lghoehe]);

    return (
        <div>
            <Button variant='outline-dark' onClick={openModal}><CheckLg /></Button>

            <Modal
                show={modalIsOpen}
                onHide={closeModal}
                contentLabel="Neuen Auftrag erstellen"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Aufgabe abschließen</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group row mb-3">

                            <div className="col-sm-10">
                                Produkt: {_hoehe} X {_breite} X {_laenge}
                            </div>
                        </div>

                        {_stueck_pack === 1 ? (
                            <div className="form-group row mb-3">
                                <label htmlFor="stueck" className="col-sm-2 col-form-label">Stück:</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="stueck" name="stueck" value={_gesamt} onChange={(e) => setGesamt(e.target.value)} />
                                </div>
                            </div>
                        ) : (
                            <div>
                                {parseInt(_stueck) > 1 ? (
                                    <div>
                                        <div className="form-group row mb-3">
                                            <div className="col-sm-2">
                                                {_stueck - 1} P.
                                            </div>

                                            <div className="col-sm-3">
                                                <input type="text" className="form-control" value={_lagenbreite} onChange={(e) => { setLagenbreite(e.target.value); totale(); }} />
                                            </div>
                                            <div className="col-sm-3">
                                                <input type="text" className="form-control" value={_lagenhoehe} onChange={(e) => { setLagenhoehe(e.target.value); totale(); }} />
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control" value={_lagenbreite * _lagenhoehe * (_stueck - 1)} />
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <div className="col-sm-2">
                                                1 P.
                                            </div>

                                            <div className="col-sm-3">
                                                <input type="text" className="form-control" value={_lgbreite} onChange={(e) => { setLGbreite(e.target.value); totale(); }} />
                                            </div>
                                            <div className="col-sm-3">
                                                <input type="text" className="form-control" value={_lghoehe} onChange={(e) => { setLGhoehe(e.target.value); totale(); }} />
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control" value={_lgbreite * _lghoehe * 1} />
                                            </div>
                                        </div>

                                        <div className='form-group row mb-3'>
                                            <div className="col-sm-2">Plus:</div>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" value={_plus} onChange={(e) => setPlus(e.target.value)}></input>
                                            </div>
                                        </div>
                                        <div className='form-group row mb-3'>
                                            <div className="col-sm-2">Gesamt:</div>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" value={_gesamt} onChange={(e) => setGesamt(e.target.value)}></input>
                                            </div>
                                        </div>

                                    </div>
                                ) : (
                                    <div>
                                        <div className="form-group row mb-3">
                                            <div className="col-sm-2">
                                                {_stueck} P.
                                            </div>

                                            <div className="col-sm-3">
                                                <input type="text" className="form-control" value={_lagenbreite} onChange={(e) => { setLagenbreite(e.target.value); totale(); }} />
                                            </div>
                                            <div className="col-sm-3">
                                                <input type="text" className="form-control" value={_lagenhoehe} onChange={(e) => { setLagenhoehe(e.target.value); totale(); }} />
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control" value={_lagenbreite * _lagenhoehe * _stueck} />
                                            </div>
                                        </div>

                                        <div className='form-group row mb-3'>
                                            <div className="col-sm-2">Plus:</div>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" value={_plus} onChange={(e) => setPlus(e.target.value)}></input>
                                            </div>
                                        </div>
                                        <div className='form-group row mb-3'>
                                            <div className="col-sm-2">Gesamt:</div>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" value={_gesamt} onChange={(e) => setGesamt(e.target.value)}></input>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        )}
                        <Modal.Footer>
                            <Button variant="primary" type="submit">Aufgabe abschließen</Button>
                            <Button variant="secondary" onClick={closeModal}>Abbrechen</Button>
                        </Modal.Footer>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default ModalAufgabeAbgeschlossen;
