import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Startseite() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const name = localStorage.getItem('userName');
        if (name) {
            setUserName(name);
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = () => {
        const name = prompt("Please enter your name:");
        if (name) {
            fetch('http://192.168.1.5:8081/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            })
                .then(response => response.json())
                .then(() => {
                    localStorage.setItem('userName', name);
                    setUserName(name);
                    setIsLoggedIn(true);
                })
                .catch(error => console.error('Error:', error));
        }
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
                <Link to="/eingabe" className="btn btn-outline-dark btn-lg btn-block mb-3">Eingabe</Link>
                <Link to="/entrindung" className="btn btn-outline-dark btn-lg btn-block mb-3">Entrindung</Link>
                <Link to="/bandsaege" className="btn btn-outline-dark btn-lg btn-block mb-3">Bandsäge</Link>
                <Link to="/sortierung" className="btn btn-outline-dark btn-lg btn-block mb-3">Sortierung</Link>
                <Link to="/beladung" className="btn btn-outline-dark btn-lg btn-block mb-3">Beladung</Link>

                {isLoggedIn ? (
                    <button onClick={handleLogout}>Logout</button>
                ) : (
                    <button onClick={handleLogin} className="btn btn-success btn-lg btn-block">Login</button>
                )}
            </div>
        </div>
    );
}

export default Startseite;