// AuftragModal.js

import React, { useState } from 'react';
import Modal from 'react-modal';

const AuftragModal = ({ onSave }) => {
    const [bezeichnung, setBezeichnung] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleSave = () => {
        onSave(bezeichnung);
        setBezeichnung('');
        closeModal();
    };

    return (
        <div>
            <button onClick={openModal}>Neue Aufgabe erstellen</button>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Neuen Auftrag erstellen"
            >
                <h2>Neuen Aufgabe für xxx erstellen</h2>
                <label>
                    Bezeichnung:
                    <input type="text" value={bezeichnung} onChange={(e) => setBezeichnung(e.target.value)} />

                </label>
                <button onClick={handleSave}>Speichern</button>
                <button onClick={closeModal}>Abbrechen</button>
            </Modal>
        </div>
    );
};

export default AuftragModal;