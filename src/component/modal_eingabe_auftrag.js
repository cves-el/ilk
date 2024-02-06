import React, { useState } from 'react';
import Modal from 'react-modal';

const AuftragModal = ({ onSave }) => {
    const [auftragName, setAuftragName] = useState('');
    const [lieferdatum, setLieferdatum] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleSave = () => {
        onSave({ auftragName, lieferdatum });
        setAuftragName('');
        setLieferdatum('');
        closeModal();
    };

    return (
        <div>
            <button onClick={openModal}>Neuen Auftrag erstellen</button>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Neuen Auftrag erstellen"
            >
                <h2>Neuen Auftrag erstellen</h2>
                <label>
                    Auftrag Name:
                    <input type="text" value={auftragName} onChange={(e) => setAuftragName(e.target.value)} />
                </label>
                <label>
                    Lieferdatum:
                    <input type="date" value={lieferdatum} onChange={(e) => setLieferdatum(e.target.value)} />
                </label>
                <button onClick={handleSave}>Speichern</button>
                <button onClick={closeModal}>Abbrechen</button>
            </Modal>
        </div>
    );
};

export default AuftragModal;
