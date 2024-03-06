import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const AuftragModal = ({ onSave }) => {
    const [auftragName, setAuftragName] = useState('');
    const [lieferdatum, setLieferdatum] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setAuftragName('');
        setLieferdatum('');
        setModalIsOpen(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://192.168.1.5:8081/auftraege/create', {
                auftrag_name: auftragName,
                auftrag_liefertermin: lieferdatum
            });

            console.log(response.data);
            onSave(); // Aktualisiere die Auftragsliste in der App
            setAuftragName('');
            setLieferdatum('');
            closeModal();
        } catch (error) {
            console.error('Fehler beim Speichern des Auftrags:', error);
        }
    };

    return (
        <div>
            <Button variant="outline-primary" onClick={openModal}>Neuen Auftrag erstellen</Button>
            <Modal
                show={modalIsOpen}
                onHide={closeModal}

            >
                <Modal.Header closeButton>
                    <Modal.Title>Neuen Auftrag erstellen</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSave}>
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
};

export default AuftragModal;
