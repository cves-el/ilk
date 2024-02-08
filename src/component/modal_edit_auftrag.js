import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditAuftrag() {
    const [name, setName] = useState('');
    const [liefertermin, setLiefertermin] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8081/auftraege/${id}`)
            .then(res => {
                setName(res.data.auftrag_name);
                setLiefertermin(res.data.auftrag_liefertermin);
            })
            .catch(err => console.log(err));
    }, [id]);

    function handleSubmit(event) {
        event.preventDefault();
        axios.put(`http://localhost:8081/update/${id}`, { auftrag_name: name, auftrag_liefertermin: liefertermin })
            .then(res => {
                console.log(res);
                navigate('/');
            })
            .catch(err => console.log(err));
    }

    return (
        <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
            <div className='w-50 bg-white rounded p-3'>
                <form onSubmit={handleSubmit}>
                    <h2>Update Student</h2>
                    <div className='mb-2'>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder='Enter Name'
                            className='form-control'
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="liefertermin">Liefertermin</label>
                        <input
                            type="text"
                            id="liefertermin"
                            placeholder='Enter Liefertermin'
                            className='form-control'
                            value={liefertermin}
                            onChange={e => setLiefertermin(e.target.value)}
                        />
                    </div>
                    <button className='btn btn-success'>Update</button>
                </form>
            </div>
        </div>
    );
}

export default EditAuftrag;
