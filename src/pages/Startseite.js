import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Startseite() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const name = localStorage.getItem('userName');
        if (name) {
            setUserName(name);
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = () => {
        fetch('http://192.168.1.5:8081/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: selectedUser }),
        })
            .then(response => response.json())
            .then(() => {
                localStorage.setItem('userName', selectedUser);
                setUserName(selectedUser);
                setIsLoggedIn(true);
                setShowModal(false);
            })
            .catch(error => console.error('Error:', error));
    };

    const handleLogout = () => {
        fetch('http://192.168.1.5:8081/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: userName }),
        })
            .then(() => {
                localStorage.removeItem('userName');
                setIsLoggedIn(false);
                setUserName('');
            })
            .catch(error => console.error('Error:', error));
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h1 className="mb-4">Startseite</h1>
            <div className="list-group w-50">
            {isLoggedIn && (
                <>
                    <Link to="/eingabe" className="btn btn-outline-dark btn-lg btn-block mb-3">Eingabe</Link>
                    <Link to="/entrindung" className="btn btn-outline-dark btn-lg btn-block mb-3">Entrindung</Link>
                    <Link to="/bandsaege" className="btn btn-outline-dark btn-lg btn-block mb-3">Bandsäge</Link>
                    <Link to="/sortierung" className="btn btn-outline-dark btn-lg btn-block mb-3">Sortierung</Link>
                    <Link to="/beladung" className="btn btn-outline-dark btn-lg btn-block mb-3">Beladung</Link>
                </>
            )}

                {isLoggedIn ? (
                    <button onClick={handleLogout} className='btn btn-danger btn-lg btn-block mb-3'>Logout ({userName})</button>
                ) : (
                    <>
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic" className="btn btn-success btn-lg btn-block mb-3 w-100">
                                {selectedUser ? selectedUser : 'Benutzer auswählen'}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setSelectedUser('Elmar')}>Elmar</Dropdown.Item>
                                <Dropdown.Item onClick={() => setSelectedUser('Elias')}>Elias</Dropdown.Item>
                                <Dropdown.Item onClick={() => setSelectedUser('Jonathan')}>Jonathan</Dropdown.Item>
                                <Dropdown.Item onClick={() => setSelectedUser('Klaus')}>Klaus</Dropdown.Item>
                                <Dropdown.Item onClick={() => setSelectedUser('Hartmann')}>Hartmann</Dropdown.Item>
                                <Dropdown.Item onClick={() => setSelectedUser('Peter')}>Peter</Dropdown.Item>
                                <Dropdown.Item onClick={() => setSelectedUser('Arthur')}>Arthur</Dropdown.Item>
                                <Dropdown.Item onClick={() => setSelectedUser('Martin')}>Martin</Dropdown.Item>
                                <Dropdown.Item onClick={() => setSelectedUser('Ludwig')}>Ludwig</Dropdown.Item>
                                {/* Weitere Benutzeroptionen nach Bedarf hinzufügen */}
                            </Dropdown.Menu>
                        </Dropdown>

                        <Button className='btn btn-success btn-lg btn-block mb-3' onClick={handleLogin}>Login</Button>
                    </>
                )}

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Benutzer auswählen: {selectedUser}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Benutzeroptionen im Modal können hier hinzugefügt werden */}
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
}

export default Startseite;
