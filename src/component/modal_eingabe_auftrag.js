import React, { useState } from 'react';
import axios from 'axios';
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

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8081/auftraege/create', {
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
            <button onClick={openModal}>Neuen Auftrag erstellen</button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Neuen Auftrag erstellen"
                ariaHideApp={false}
            >
                <form onSubmit={handleSave}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ padding: '2vh' }}>
                            <label htmlFor="auftragName">Auftrag Name: </label>
                            <input
                                type="text"
                                id="auftragName"
                                value={auftragName}
                                onChange={(e) => setAuftragName(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ padding: '2vh' }}>
                            <label htmlFor="auftragLiefertermin">Auftrag Liefertermin: </label>
                            <input
                                type="date"
                                id="lieferdatum"
                                value={lieferdatum}
                                onChange={(e) => setLieferdatum(e.target.value)}
                            />
                        </div>
                        <button style={{ padding: '2vh', marginBottom: '2vh' }} type="submit">Auftrag erstellen</button>
                        <button style={{ padding: '2vh' }} onClick={closeModal}>Abbrechen</button>
                    </div>
                </form>

            </Modal>
        </div>
    );
};

export default AuftragModal;
