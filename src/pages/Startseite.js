import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Startseite() {


    useEffect(() => {
        const sessionToken = localStorage.getItem('sessionToken');
        if (sessionToken) {
            login(null, sessionToken);
        }
    }, []);

    const login = (name) => {
        fetch('http://192.168.1.5:8081/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.name) {
                    alert(`Logged in as ${data.name}`);
                    // If you decide to use sessionToken in the future:
                    // localStorage.setItem('sessionToken', data.sessionToken);
                } else {
                    alert("Failed to log in. Please try again.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Failed to log in. Please check the console for errors.");
            });
    };

    const handleLogin = () => {
        const name = prompt("Please enter your name:");
        if (name) login(name);
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

                <button onClick={handleLogin} className="btn btn-success btn-lg btn-block">Login</button>

            </div>
        </div>
    );
}

export default Startseite;