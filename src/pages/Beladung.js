import React from 'react';
import { Link } from 'react-router-dom';

function Beladung() {
    return (
        <div>
            <h1>Beladung</h1>
            <form>
                <Link to="/">Zurück</Link>

            </form>
        </div>
    );
}

export default Beladung;