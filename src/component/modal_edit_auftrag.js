import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Pen } from 'react-bootstrap-icons';

function ModalEditAuftrag({ auftragID, auftrag_Name, liefer_datum, onSave }) {
    const [auftragName, setAuftragName] = useState('');
    const [lieferdatum, setLieferdatum] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        setAuftragName(auftrag_Name);
        setLieferdatum(liefer_datum);
    }, [auftrag_Name, liefer_datum]);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://192.168.1.5:8081/auftraege/update/${auftragID}`, { auftrag_name: auftragName, auftrag_liefertermin: lieferdatum });
            onSave();
            closeModal();
        } catch (error) {
            console.error('Fehler beim Speichern des Auftrags:', error);
        }
    };

    return (
        <div>
            <Button variant="outline-dark" onClick={openModal}><Pen /></Button>
            <Modal
                show={modalIsOpen}
                onHide={closeModal}

            >
                <Modal.Header closeButton>
                    <Modal.Title>Neuen Auftrag erstellen</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="auftragName" className="form-label"><strong>Auftrag Name:</strong></label>
                            <input
                                type="text"
                                className="form-control"
                                id="auftragName"
                                value={auftragName}
                                onChange={(e) => setAuftragName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="auftragLiefertermin" className="form-label"><strong>Auftrag Liefertermin:</strong></label>
                            <input
                                type="datetime-local"
                                className="form-control"
                                id="lieferdatum"
                                value={lieferdatum}
                                onChange={(e) => setLieferdatum(e.target.value)}
                            />
                        </div>
                        <div className="d-grid gap-2">
                            <Button variant="primary" type="submit">Auftrag erstellen</Button>
                            <Button variant="secondary" onClick={closeModal}>Abbrechen</Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default ModalEditAuftrag;
