import React, { useEffect, useState, useCallback } from 'react';
import ModalEingabeAuftrag from "../component/modal_eingabe_auftrag";
import ModalEingabeAufgabe from "../component/modal_eingabe_aufgabe";
import ModalEditAuftrag from "../component/modal_edit_auftrag";
import ModalEditAufgabe from "../component/modal_edit_aufgabe";
import '../App.css';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { XLg, ArrowUp, Download, ArrowDown, Plus } from 'react-bootstrap-icons';
import ModalAufgabeAbgeschlossen from '../component/modal_aufgabe_abgeschlossen';
import { Link } from 'react-router-dom';
import { Scrollbar } from 'react-scrollbars-custom';


function Eingabe() {


    const [auftraege, setAuftraege] = useState([]);
    const [selectedAuftrag, setSelectedAuftrag] = useState('');
    const [aufgaben, setAufgaben] = useState([]);
    const [aufgabenStatus, setAufgabenStatus] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [color, setColor] = useState('#e5eb34');
    const [users, setUsers] = useState([]);


    // useCallback verwenden, um fetchAuftraege zu definieren
    const fetchAuftraege = useCallback(() => {
        axios.get('http://192.168.1.5:8081/auftraege/')
            .then(response => {
                setAuftraege(response.data);
                // Wenn noch kein Auftrag ausgewählt wurde und es Aufträge gibt, den obersten Auftrag auswählen
                /* if (!selectedAuftrag && response.data.length > 0) {
                  setSelectedAuftrag(response.data[0]);
                }
                console.log(response.data) */
                if (!selectedAuftrag && response.data.length > 0) {
                    setSelectedAuftrag('0');
                }
            })
            .catch(err => {
                console.error('Fehler beim Abrufen der Aufträge:', err);
            });

        axios.get(`http://192.168.1.5:8081/aufgaben/status`)
            .then(response => {
                setAufgabenStatus(response.data);

            })
            .catch(err => {
                console.error('Fehler beim Abrufen der Aufgaben:', err);
            });



    }, [selectedAuftrag]); // selectedAuftrag als Abhängigkeit hinzufügen

    const handleCollapseToggle = () => {
        setCollapsed(!collapsed); // Kollaps-Zustand umkehren
    };

    useEffect(() => {
        // Funktionen initial aufrufen
        fetchAuftraege();




        // setInterval verwenden, um die Funktionen alle 5 Sekunden auszuführen
        const intervalId = setInterval(() => {
            fetchAuftraege();
            if (selectedAuftrag) {
                fetchAufgaben(selectedAuftrag.ID);
            }
        }, 3000);

        // Aufräumen
        return () => clearInterval(intervalId);
    }, [selectedAuftrag, fetchAuftraege]); // Hier fetchAuftraege als Abhängigkeit hinzufügen


    useEffect(() => {
        const intervalId = setInterval(() => {
            setColor(prevColor => (prevColor === '#e5eb34' ? 'red' : '#e5eb34'));
        }, 1000); // Intervallzeit in Millisekunden

        return () => clearInterval(intervalId); // Aufräumen beim Komponentenabbau
    }, []);

    useEffect(() => {
        const fetchOnlineUsers = () => {
            fetch('http://192.168.1.5:8081/online-users')
                .then(response => response.json())
                .then(data => {
                    setUsers(data);
                })
                .catch(error => console.error('Error:', error));
        };

        fetchOnlineUsers();
        const interval = setInterval(fetchOnlineUsers, 5000);

        window.addEventListener('beforeunload', () => {
            navigator.sendBeacon('http://192.168.1.5:8081/logout', JSON.stringify({ sessionToken: localStorage.getItem('sessionToken') }));
        });

        return () => clearInterval(interval);
    }, []);
    // Funktion zum Laden der Aufgaben des ausgewählten Auftrags
    const fetchAufgaben = (auftragId) => {
        axios.get(`http://192.168.1.5:8081/auftraege/${auftragId}/aufgaben`)
            .then(response => {
                setAufgaben(response.data);
            })
            .catch(err => {
                console.error('Fehler beim Abrufen der Aufgaben:', err);
            });
    };


    const handleSaveAuftrag = () => {
        axios.get('http://192.168.1.5:8081/auftraege')
            .then(response => {
                setAuftraege(response.data);

            })
            .catch(error => {
                console.error('Fehler beim Abrufen der Aufträge:', error);
            });
    };

    const handleSelectAuftrag = (auftrag) => {
        setSelectedAuftrag(auftrag);
        fetchAufgaben(auftrag.ID);
    };

    const handleDeleteAuftrag = async (ID) => {

        const isConfirmed = window.confirm('Möchten Sie diesn Auftrag wirklich löschen?');
        if (!isConfirmed) return; // Abbrechen, wenn der Benutzer nicht bestätigt

        try {
            await axios.delete(`http://192.168.1.5:8081/auftraege/delete/${ID}`);
            fetchAuftraege();
        } catch (err) {
            console.log(err);
        }
    };

    const handleDeleteAufgabe = async (ID) => {
        try {
            await axios.delete(`http://192.168.1.5:8081/aufgaben/delete/${ID}`);
            fetchAufgaben(selectedAuftrag.ID);
        } catch (err) {
            console.log(err);
        }
    };

    const formatDate = (dateString) => {
        const options = { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        const formattedDate = new Date(dateString).toLocaleDateString('de-DE', options);
        const [date, time] = formattedDate.split('T');
        return (
            <div style={{ textAlign: 'left' }}>
                <div>{date}</div>
                <div>{time}</div>
            </div>
        );
    };

    const handleReihenfolgeAufgabe = async (ID, rf, aufRF) => {
        try {
            // Abrufen aller Aufgaben

            const aufgaben = aufgabenStatus

            // Sortieren der Aufgaben nach Reihenfolge
            aufgaben.sort((a, b) => a.reihenfolge - b.reihenfolge);



            // Logik für die Aktualisierung der Reihenfolge
            if (rf === 1) {
                // Wenn rf 1 ist, finde die nächste verfügbare Reihenfolge
                if (aufRF < 1) {
                    let nextOrder = 1; // Beginne mit 1 als Standardwert

                    // Erstelle ein Set, um die bisher verwendeten Reihenfolgen zu verfolgen
                    const usedOrders = new Set(aufgaben.map(aufgabe => aufgabe.reihenfolge));

                    // Finde den nächsten verfügbaren Wert für nextOrder
                    while (usedOrders.has(nextOrder)) {
                        nextOrder++; // Inkrementiere nextOrder, bis ein freier Wert gefunden wird
                    }

                    console.log("Der nächste verfügbare Wert für nextOrder ist:", nextOrder);
                    // Aktualisieren der Reihenfolge der ausgewählten Aufgabe
                    await axios.put(`http://192.168.1.5:8081/aufgaben/updateReihenfolge/${ID}`, {
                        reihenfolge: nextOrder
                    });
                }
            } else if (rf === 0) {
                // Wenn rf 0 ist, aktualisiere die Reihenfolge der ausgewählten Aufgabe auf 0


                if ((aufgaben.find(aufgabe => aufgabe.ID === ID)).status === 2) {

                    handelAufgabeSchnitt(ID, 0)
                } else {
                    await axios.put(`http://192.168.1.5:8081/aufgaben/updateReihenfolge/${ID}`, {
                        reihenfolge: 0
                    });
                    // Aktualisieren der Reihenfolge aller anderen Aufgaben
                    let i = 0; // Starte i bei 0
                    for (const aufgabe of aufgaben) {
                        if (aufgabe.ID !== ID) {
                            if (aufgabe.reihenfolge > 0) {
                                await axios.put(`http://192.168.1.5:8081/aufgaben/updateReihenfolge/${aufgabe.ID}`, {
                                    reihenfolge: i + 1
                                });
                                i++; // Erhöhe i nur, wenn die Bedingung erfüllt ist
                            }
                        }
                    }
                }


            } else if (rf === 2) {
                await axios.put(`http://192.168.1.5:8081/aufgaben/updateReihenfolge/${ID}`, {
                    reihenfolge: 1
                });
                let i = 2; // Starte i bei 1, da die Reihenfolge um 1 erhöht werden soll
                for (const aufgabe of aufgaben) {
                    if (aufgabe.ID !== ID && aufgabe.reihenfolge > 0) {
                        // Erhöhe die Reihenfolge der Aufgabe um 1 und speichere sie in der Datenbank
                        await axios.put(`http://192.168.1.5:8081/aufgaben/updateReihenfolge/${aufgabe.ID}`, {
                            reihenfolge: i
                        });
                        i++; // Erhöhe i nur, wenn die Bedingung erfüllt ist
                    }
                }

            }

            console.log('Aufgaben Reihenfolge wurden erfolgreich aktualisiert.');


            fetchAuftraege();
            fetchAufgaben(selectedAuftrag.ID);



        } catch (error) {
            console.error('Fehler beim Aktualisieren der Aufgaben:', error);
        }
    };

    const handelAufgabeSchnitt = async (aufgabeID, neuerstatus) => {


        try {
            await Promise.all(aufgabenStatus.map(async (status) => {
                if (status.ID === aufgabeID) {
                    await axios.put(`http://192.168.1.5:8081/aufgaben/updateAbgeschlossen/${aufgabeID}`, {
                        status: neuerstatus
                    });
                } else {
                    if (status.status === 2 || status.status === neuerstatus) {
                        await axios.put(`http://192.168.1.5:8081/aufgaben/updateAbgeschlossen/${status.ID}`, {
                            status: '0'
                        });
                    }
                }
            }));
            console.log('Alle Aufgaben Status Werte wurden erfolgreich aktualisiert');

            if (neuerstatus === 2) {
                handleReihenfolgeAufgabe(aufgabeID, 2)
            }
            /* if (reihenfolge > 0) {
                handleReihenfolgeAufgabe(aufgabeID, 0)
            } */

            // Nachdem die Aufgaben aktualisiert wurden, führen Sie fetchAuftraege aus
            fetchAuftraege();
            fetchAufgaben(selectedAuftrag.ID);
        } catch (error) {
            console.error('Fehler beim Aktualisieren der Aufgaben:', error);
        }



    };

    return (
        <div className="App" style={{ backgroundColor: '#1f1f1f', color: '#1f1f1f', width: '100%', height: '100%', fontFamily: 'Roboto, sans-serif' }}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

                {/* ÜBERSCHRIFT */}

                <div style={{ flexShrink: 0, height: '8vh', flexDirection: 'row' }}>
                    <div style={{ color: '#007bff', position: 'absolute', margin: '5px' }}>
                        <Link to="/">Zurück</Link>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <h1 style={{ color: '#007bff' }}>Eingabe neuer Daten</h1>
                    </div>
                </div>

                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'row' }}>

                    {/* AUFTRÄGE LISTE */}
                    <div style={{ flexGrow: 1, display: 'flex', backgroundColor: '#292929', padding: '8px', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Scrollbar style={{ flexDirection: 'column', width: '220px' }} noScrollX>


                            {/* Liste der Aufträge, für die nicht alle Aufgaben den Status 99 haben */}
                            {auftraege.filter(auftrag => {
                                // Filtere die Aufträge, deren Aufgaben nicht alle den Status 99 haben
                                const aufgabenDesAuftrags = aufgabenStatus.filter(aufgabenStatus => aufgabenStatus.auftrag_id === auftrag.ID);
                                return aufgabenDesAuftrags.length === 0 || !aufgabenDesAuftrags.every(aufgabenStatus => aufgabenStatus.status === 99);
                            }).sort((a, b) => new Date(a.auftrag_liefertermin) - new Date(b.auftrag_liefertermin)).map((auftrag, index) => (

                                <button key={index} style={{ display: 'flex', flexDirection: 'row', marginBottom: '5px', justifyContent: 'space-between', backgroundColor: selectedAuftrag && selectedAuftrag.ID === auftrag.ID ? '#007bff' : 'lightblue', borderRadius: '5px', width: '97%', border: '1px solid black' }} onClick={() => handleSelectAuftrag(auftrag)}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flexGrow: '1' }}>
                                        <div style={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap' }}>{auftrag.auftrag_name.charAt(0).toUpperCase() + auftrag.auftrag_name.slice(1)}

                                            {aufgabenStatus.filter(aufgabe => aufgabe.auftrag_id === auftrag.ID && aufgabe.status === 1).length === 1 ?
                                                <div style={{ backgroundColor: '#52a152', borderRadius: '15%' }}>
                                                    {aufgabenStatus.filter(aufgabe => aufgabe.auftrag_id === auftrag.ID && aufgabe.status === 99).length}
                                                    /
                                                    {aufgabenStatus.filter(aufgabe => aufgabe.auftrag_id === auftrag.ID).length}
                                                </div> : <div>
                                                    {aufgabenStatus.filter(aufgabe => aufgabe.auftrag_id === auftrag.ID && aufgabe.status === 99).length}
                                                    /
                                                    {aufgabenStatus.filter(aufgabe => aufgabe.auftrag_id === auftrag.ID).length}
                                                </div>}

                                        </div>
                                        <div style={{ fontSize: '14px' }}>Ladetermin:</div>
                                        <div style={{ fontSize: '12px' }}>{formatDate(auftrag.auftrag_liefertermin)}</div>

                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', flexDirection: 'column' }}>
                                        <div style={{ flexGrow: '1' }}>
                                            <ModalEditAuftrag
                                                auftragID={selectedAuftrag ? selectedAuftrag.ID : ''}
                                                auftrag_Name={selectedAuftrag ? selectedAuftrag.auftrag_name : ''}
                                                liefer_datum={selectedAuftrag ? selectedAuftrag.auftrag_liefertermin : ''}
                                                onSave={handleSaveAuftrag}
                                            />
                                        </div>
                                        <div style={{ flexGrow: '1' }}>
                                            <Button variant='outline-danger' onClick={e => handleDeleteAuftrag(auftrag.ID)}><XLg /></Button>
                                        </div>
                                    </div>
                                </button>
                            ))}

                            {/* Liste der Aufträge, für die alle Aufgaben den Status 99 haben */}
                            {auftraege.filter(auftrag => {
                                // Filtere die Aufträge, deren Aufgaben alle den Status 99 haben
                                const aufgabenDesAuftrags = aufgabenStatus.filter(aufgabenStatus => aufgabenStatus.auftrag_id === auftrag.ID);
                                return aufgabenDesAuftrags.length > 0 && aufgabenDesAuftrags.every(aufgabenStatus => aufgabenStatus.status === 99);
                            }).sort((a, b) => new Date(a.auftrag_liefertermin) - new Date(b.auftrag_liefertermin)).map((auftrag, index) => (
                                <button key={index} style={{ display: 'flex', flexDirection: 'row', marginBottom: '5px', justifyContent: 'space-between', backgroundColor: selectedAuftrag && selectedAuftrag.ID === auftrag.ID ? 'green' : 'lightgreen', borderRadius: '5px', width: '97%', border: '1px solid black' }} onClick={() => handleSelectAuftrag(auftrag)}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flexGrow: '1' }}>
                                        <div style={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', width: '100%' }}>{auftrag.auftrag_name.charAt(0).toUpperCase() + auftrag.auftrag_name.slice(1)}
                                            <div>
                                                {aufgabenStatus.filter(aufgabe => aufgabe.auftrag_id === auftrag.ID && aufgabe.status === 99).length}
                                                /
                                                {aufgabenStatus.filter(aufgabe => aufgabe.auftrag_id === auftrag.ID).length}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '14px' }}>Ladetermin:</div>
                                        <div style={{ fontSize: '12px' }}>{formatDate(auftrag.auftrag_liefertermin)}</div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', flexDirection: 'column' }}>
                                        <div style={{ flexGrow: '1' }}>
                                            <ModalEditAuftrag
                                                auftragID={selectedAuftrag ? selectedAuftrag.ID : ''}
                                                auftrag_Name={selectedAuftrag ? selectedAuftrag.auftrag_name : ''}
                                                liefer_datum={selectedAuftrag ? selectedAuftrag.auftrag_liefertermin : ''}
                                                onSave={handleSaveAuftrag}
                                            />
                                        </div>
                                        <div style={{ flexGrow: '1' }}>
                                            <Button variant='outline-danger' onClick={e => handleDeleteAuftrag(auftrag.ID)}><XLg /></Button>
                                        </div>
                                    </div>
                                </button>
                            ))}

                        </Scrollbar>
                        <div style={{ marginTop: '10px', justifyContent: 'flex-end' }}>
                            <ModalEingabeAuftrag onSave={handleSaveAuftrag} />
                        </div>
                    </div>

                    {/* AUFGABEN LISTE */}

                    <div style={{ display: 'flex', backgroundColor: '#424242', padding: '10px', width: '100%', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Scrollbar style={{ flex: 1, flexDirection: 'column', overflowY: 'auto' }} noScrollX>
                            {selectedAuftrag && (
                                <div style={{ padding: '10px', flexDirection: 'row' }}>

                                    {/* AUFGABEN NOCH OFFEN */}

                                    {aufgaben.filter(aufgabe => aufgabe.status !== 99).map((aufgabe, index) => (

                                        <div key={index} style={{ backgroundColor: '#757575', display: 'flex', marginBottom: '5px', padding: '7px', flexDirection: 'row', justifyContent: 'space-between', borderRadius: '10px', border: '1px solid black' }}>
                                            <div style={{ display: 'flex', marginBottom: '5px', flexDirection: 'column', width: '100%' }}>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '2vh', fontSize: '20px' }}>
                                                    <div style={{ textAlign: 'left', flexGrow: '1' }}>  <strong>Maße: </strong>{aufgabe.hoehe} x {aufgabe.breite} x {aufgabe.laenge} </div>
                                                    {aufgabe.stueck !== null ?
                                                        <div style={{ width: '200px', textAlign: 'left', flexGrow: '1' }}><strong>Menge:</strong> {aufgabe.stueck}{aufgabe.stueck_pack === 1 ? ' ST.' : ' P.'} </div>
                                                        : null}


                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', fontSize: '14px' }}>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>

                                                        {aufgabe.kammer !== null || aufgabe.kapplaenge !== null || aufgabe.zugeschnitten !== null ?
                                                            <div style={{ flexGrow: 1, width: '200px', textAlign: 'left' }}>
                                                                {aufgabe.zugeschnitten !== null ? <div ><strong>Zugeschnitten:</strong> {aufgabe.zugeschnitten === 1 ? 'Ja' : 'Nein'}</div> : null}
                                                                {aufgabe.kammer !== null ? <div ><strong>Kammer:</strong> {aufgabe.kammer === 1 ? 'Ja' : 'Nein'}</div> : null}
                                                                {aufgabe.kapplaenge !== null ? <div ><strong>Kapplaenge:</strong>  {aufgabe.kapplaenge}</div> : null}
                                                            </div>
                                                            : null}

                                                        {aufgabe.lagenbreite !== null || aufgabe.lagenhoehe !== null ?
                                                            <div style={{ flexGrow: 1, width: '200px', textAlign: 'left' }}>
                                                                {aufgabe.lagenbreite !== null ? <div ><strong>Lagenbreite:</strong> {aufgabe.lagenbreite}</div> : null}
                                                                {aufgabe.lagenhoehe !== null ? <div ><strong>Lagenhöhe:</strong> {aufgabe.lagenhoehe}</div> : null}
                                                            </div>
                                                            : null}

                                                        {aufgabe.seitenware !== null || aufgabe.ewd_programm !== null ?
                                                            <div style={{ flexGrow: 1, width: '200px', textAlign: 'left' }}>
                                                                {aufgabe.seitenware !== null ? <div ><strong>Seitenware:</strong> {aufgabe.seitenware}</div> : null}
                                                                {aufgabe.ewd_programm !== null ? <div ><strong>EWD Programm:</strong> {aufgabe.ewd_programm}</div> : null}
                                                            </div>
                                                            : null}

                                                    </div>
                                                    <div style={{ textAlign: 'left', marginTop: '1vh' }}>
                                                        {aufgabe.kommentar !== null ? <div><strong>Kommentar:</strong> {aufgabe.kommentar}</div> : null}
                                                    </div>
                                                </div>
                                            </div>


                                            <div>
                                                <ModalAufgabeAbgeschlossen
                                                    ID={aufgabe.ID}
                                                    hoehe={aufgabe.hoehe}
                                                    breite={aufgabe.breite}
                                                    laenge={aufgabe.breite}

                                                    lagenbreite={aufgabe.lagenbreite}
                                                    lagenhoehe={aufgabe.lagenhoehe}
                                                    stueck_pack={aufgabe.stueck_pack}
                                                    stueck={aufgabe.stueck}

                                                    onSave={() => fetchAufgaben(selectedAuftrag.ID)}
                                                />

                                            </div>

                                            <div>
                                                {aufgabe.reihenfolge < 1 ?
                                                    <Button variant='outline-dark' onClick={e => { if (aufgabe.status === 0 || aufgabe.status === null) { handleReihenfolgeAufgabe(aufgabe.ID, 1, aufgabe.reihenfolge) } }}><Plus /></Button>
                                                    : <Button variant='outline-dark' style={{ backgroundColor: aufgabe.status === 2 ? color : '#e5eb34' }}>{aufgabe.reihenfolge}</Button>}
                                                {aufgabe.status === 1 || aufgabe.status === 99 ?
                                                    <Button variant='outline-dark' style={{ backgroundColor: '#52a152' }}><Download /></Button>
                                                    : <Button variant='outline-dark' onClick={e => handelAufgabeSchnitt(aufgabe.ID, 2)}><Download /></Button>}
                                            </div>
                                            <div>
                                                <ModalEditAufgabe
                                                    auftrag_Name={selectedAuftrag ? selectedAuftrag.auftrag_name : ''}
                                                    ID={aufgabe.ID}
                                                    hoehe={aufgabe.hoehe}
                                                    breite={aufgabe.breite}
                                                    laenge={aufgabe.breite}
                                                    kammer={aufgabe.kammer}
                                                    kapplaenge={aufgabe.kapplaenge}
                                                    lagenbreite={aufgabe.lagenbreite}
                                                    lagenhoehe={aufgabe.lagenhoehe}
                                                    stueck_pack={aufgabe.stueck_pack}
                                                    stueck={aufgabe.stueck}
                                                    seitenware={aufgabe.seitenware}
                                                    ewd_programm={aufgabe.ewd_programm}
                                                    zugeschnitten={aufgabe.zugeschnitten}
                                                    kommentar={aufgabe.kommentar}
                                                    onSave={() => fetchAufgaben(selectedAuftrag.ID)}
                                                />
                                                <Button variant='outline-danger' onClick={e => handleDeleteAufgabe(aufgabe.ID)}><XLg /></Button>

                                            </div>
                                        </div>

                                    ))}


                                    {/* AUFGABEN ABGESCHLOSSEN */}

                                    {aufgaben.filter(aufgabe => aufgabe.status === 99)
                                        .sort((a, b) => a.reihenfolge - b.reihenfolge)
                                        .map((aufgabe, index) => (
                                            <div key={index} style={{ backgroundColor: 'lightgreen', display: 'flex', marginBottom: '5px', padding: '7px', flexDirection: 'row', justifyContent: 'space-between', borderRadius: '10px', border: '1px solid black' }}>
                                                <div style={{ display: 'flex', marginBottom: '5px', flexDirection: 'column', width: '100%' }}>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '2vh', fontSize: '20px' }}>
                                                        <div style={{ textAlign: 'left', flexGrow: '1' }}>  <strong>Maße: </strong>{aufgabe.hoehe} x {aufgabe.breite} x {aufgabe.laenge} </div>
                                                        {aufgabe.stueck !== null ?
                                                            <div style={{ width: '200px', textAlign: 'left', flexGrow: '1' }}><strong>Sollmenge:</strong> {aufgabe.stueck}{aufgabe.stueck_pack === 1 ? ' ST.' : ' P.'} </div>
                                                            : null}

                                                        {aufgabe.ist_stueck !== null ?
                                                            <div style={{ width: '200px', textAlign: 'left', flexGrow: '1' }}><strong>Istmenge:</strong> {aufgabe.ist_stueck} ST.
                                                            </div>
                                                            : null}
                                                        <div>
                                                            <strong>M³:</strong> {((aufgabe.hoehe / 1000) * (aufgabe.breite / 1000) * (aufgabe.laenge * aufgabe.ist_stueck)).toFixed(2)}
                                                        </div>


                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', fontSize: '14px' }}>
                                                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>

                                                            {aufgabe.kammer !== null || aufgabe.kapplaenge !== null || aufgabe.zugeschnitten !== null ?
                                                                <div style={{ flexGrow: 1, width: '200px', textAlign: 'left' }}>
                                                                    {aufgabe.kammer !== null ? <div ><strong>Kammer:</strong> {aufgabe.kammer === 1 ? 'Ja' : 'Nein'}</div> : null}
                                                                    {aufgabe.kapplaenge !== null ? <div ><strong>Kapplaenge:</strong>  {aufgabe.kapplaenge}</div> : null}
                                                                </div>
                                                                : null}

                                                            {aufgabe.lagenbreite !== null || aufgabe.lagenhoehe !== null ?
                                                                <div style={{ flexGrow: 1, width: '200px', textAlign: 'left' }}>
                                                                    {aufgabe.lagenbreite !== null ? <div ><strong>Lagenbreite:</strong> {aufgabe.lagenbreite}</div> : null}
                                                                    {aufgabe.lagenhoehe !== null ? <div ><strong>Lagenhöhe:</strong> {aufgabe.lagenhoehe}</div> : null}
                                                                </div>
                                                                : null}



                                                        </div>
                                                        <div style={{ textAlign: 'left', marginTop: '1vh' }}>
                                                            {aufgabe.kommentar !== null ? <div><strong>Kommentar:</strong> {aufgabe.kommentar}</div> : null}
                                                        </div>
                                                    </div>
                                                </div>



                                                <div>
                                                    <ModalAufgabeAbgeschlossen
                                                        ID={aufgabe.ID}
                                                        hoehe={aufgabe.hoehe}
                                                        breite={aufgabe.breite}
                                                        laenge={aufgabe.breite}

                                                        lagenbreite={aufgabe.lagenbreite}
                                                        lagenhoehe={aufgabe.lagenhoehe}
                                                        stueck_pack={aufgabe.stueck_pack}
                                                        stueck={aufgabe.stueck}

                                                        onSave={() => fetchAufgaben(selectedAuftrag.ID)}
                                                    />
                                                    <Button variant='outline-danger' onClick={e => handleDeleteAufgabe(aufgabe.ID)}><XLg /></Button>

                                                </div>
                                            </div>
                                        ))}
                                </div>

                            )}
                        </Scrollbar>
                        <div style={{ justifyContent: 'flex-end', marginTop: '10px' }}>
                            <ModalEingabeAufgabe
                                auftragId={selectedAuftrag.ID}
                                auftragName={selectedAuftrag.auftrag_name}
                                onSave={() => fetchAufgaben(selectedAuftrag.ID)}
                            />
                        </div>
                    </div>

                    {/* CHAT LISTE */}
                    <div style={{ width: '20vh', backgroundColor: '#292929' }}>
                        <h2>Users</h2>
                        <ul>
                            {users.map((user, index) => (
                                <li key={index} style={{ color: user.isLoggedIn ? 'green' : 'grey' }}>
                                    {user.name} - {user.isLoggedIn ? 'Online' : `Last online: ${user.lastLogin}`}
                                    {console.log(user)}
                                </li>
                            ))}
                        </ul>

                    </div>


                </div>

                {/* ANZEIGE WELCHE PRODUKTE ALS NÄCHSTES GEMACHT WERDEN */}

                <div style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', width: '100%' }}>
                    <div style={{ width: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                        {/* Filtern der Aufgaben mit Reihenfolge größer 1 */}
                        {collapsed ?
                            <div style={{ backgroundColor: '#e5eb34', width: '100%' }}>
                                {aufgabenStatus.filter(aufgabe => aufgabe.reihenfolge >= 1).sort((a, b) => b.reihenfolge - a.reihenfolge).map((aufgabe, index) => (
                                    <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: aufgabe.status === 2 ? color : '#e5eb34' }}>
                                        {/* Hier rendern Sie die Informationen zur Aufgabe */}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', fontSize: '24px', marginBottom: '5px', marginTop: '5px' }}>
                                            <div style={{ textAlign: 'left', flexGrow: '1' }}><strong>Reihenfolge: </strong>{aufgabe.reihenfolge} <strong>Maße: </strong>{aufgabe.hoehe} x {aufgabe.breite} x {aufgabe.laenge}</div>
                                            {aufgabe.stueck !== null ?
                                                <div style={{ textAlign: 'left', flexGrow: '1', marginLeft: '5vh' }}><strong>Menge:</strong> {aufgabe.stueck}{aufgabe.stueck_pack === 1 ? ' ST.' : ' P.'} </div>
                                                : null}

                                            <Button variant='outline-danger' onClick={e => handleReihenfolgeAufgabe(aufgabe.ID, 0, null)} style={{ marginLeft: '10px' }}><XLg ></XLg></Button>
                                        </div>
                                        {/* Fügen Sie hier weitere Informationen hinzu, die Sie anzeigen möchten */}
                                    </div>
                                ))} </div> :
                            <div style={{ width: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                                <div style={{ display: 'flex', width: '100%' }}>
                                    {aufgabenStatus.filter(aufgabe => aufgabe.reihenfolge > 0).length > 0 && (
                                        <div style={{ width: '100%', display: 'flex' }}>

                                            {aufgabenStatus.filter(aufgabe => aufgabe.reihenfolge === 1).map((aufgabe, index) => (
                                                <div key={index} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: aufgabe.status === 2 ? color : '#e5eb34' }}>
                                                    {/* Hier rendern Sie die Informationen zur Aufgabe */}

                                                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', fontSize: '24px', marginBottom: '5px', marginTop: '5px' }}>
                                                        <div style={{ marginRight: '15px', alignSelf: 'center', backgroundColor: '#007bff', height: '22px', width: '22px', borderRadius: '50%', textAlign: 'center', fontSize: '16px' }}><strong>{aufgabenStatus.reduce((highest, aufgabe) => aufgabe.reihenfolge > highest ? aufgabe.reihenfolge : highest, 0)}</strong></div>
                                                        <div style={{ textAlign: 'left', flexGrow: '1' }}><strong>Reihenfolge: </strong>{aufgabe.reihenfolge} <strong>Maße: </strong>{aufgabe.hoehe} x {aufgabe.breite} x {aufgabe.laenge}</div>
                                                        {aufgabe.stueck !== null ?
                                                            <div style={{ textAlign: 'left', flexGrow: '1', marginLeft: '5vh' }}><strong>Menge:</strong> {aufgabe.stueck}{aufgabe.stueck_pack === 1 ? ' ST.' : ' P.'} </div>
                                                            : null}

                                                        <Button variant='outline-danger' onClick={e => handleReihenfolgeAufgabe(aufgabe.ID, 0, null)} style={{ marginLeft: '10px' }}><XLg ></XLg></Button>
                                                    </div>
                                                    {/* Fügen Sie hier weitere Informationen hinzu, die Sie anzeigen möchten */}
                                                </div>

                                            ))}
                                        </div>)}
                                </div>
                            </div>}
                    </div>
                    {/* Wenn mehr als ein Element vorhanden ist, anzeigen Sie den Pfeil zum Kollaps */}
                    {aufgabenStatus.filter(aufgabe => aufgabe.reihenfolge >= 1).length > 1 &&
                        <Button variant='outline-dark' onClick={handleCollapseToggle} style={{ position: 'absolute', left: '5px' }}>
                            {collapsed ? <ArrowDown /> : <ArrowUp />}
                        </Button>
                    }
                </div>

                {/* ANZEIGE WELCHES PRODUKT GEMACHT WIRD */}
                <div style={{ flexShrink: 0, backgroundColor: '#52a152', alignItems: 'center', justifyContent: 'center' }}>

                    {/* Filtern der Aufgaben mit Status 1 */}
                    {aufgabenStatus.filter(aufgabe => aufgabe.status === 1).map((aufgabe, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            {/* Hier rendern Sie die Informationen zur Aufgabe */}

                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', fontSize: '24px' }}>
                                <div style={{ textAlign: 'left', flexGrow: '1' }}>  <strong>Maße: </strong>{aufgabe.hoehe} x {aufgabe.breite} x {aufgabe.laenge}</div>
                                {aufgabe.stueck !== null ?
                                    <div style={{ textAlign: 'left', flexGrow: '1', marginLeft: '5vh' }}><strong>Menge:</strong> {aufgabe.stueck}{aufgabe.stueck_pack === 1 ? ' ST.' : ' P.'} </div>
                                    : null}
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', fontSize: '14px' }}>
                                {aufgabe.zugeschnitten !== null ?
                                    <div style={{ flexGrow: 1, width: '200px', textAlign: 'left' }}>
                                        {aufgabe.zugeschnitten !== null ? <div ><strong>Zugeschnitten:</strong> {aufgabe.zugeschnitten === 1 ? 'Ja' : 'Nein'}</div> : null}

                                    </div>
                                    : null}
                                {aufgabe.kammer !== null || aufgabe.kapplaenge !== null ?
                                    <div style={{ flexGrow: 1, width: '200px', textAlign: 'left' }}>

                                        {aufgabe.kammer !== null ? <div ><strong>Kammer:</strong> {aufgabe.kammer === 1 ? 'Ja' : 'Nein'}</div> : null}
                                        {aufgabe.kapplaenge !== null ? <div ><strong>Kapplaenge:</strong>  {aufgabe.kapplaenge}</div> : null}
                                    </div>
                                    : null}

                                {aufgabe.lagenbreite !== null || aufgabe.lagenhoehe !== null ?
                                    <div style={{ flexGrow: 1, width: '200px', textAlign: 'left' }}>
                                        {aufgabe.lagenbreite !== null ? <div ><strong>Lagenbreite:</strong> {aufgabe.lagenbreite}</div> : null}
                                        {aufgabe.lagenhoehe !== null ? <div ><strong>Lagenhöhe:</strong> {aufgabe.lagenhoehe}</div> : null}
                                    </div>
                                    : null}

                                {aufgabe.seitenware !== null || aufgabe.ewd_programm !== null ?
                                    <div style={{ flexGrow: 1, width: '200px', textAlign: 'left' }}>
                                        {aufgabe.seitenware !== null ? <div ><strong>Seitenware:</strong> {aufgabe.seitenware}</div> : null}
                                        {aufgabe.ewd_programm !== null ? <div ><strong>EWD Programm:</strong> {aufgabe.ewd_programm}</div> : null}
                                    </div>
                                    : null}
                                {aufgabe.kommentar !== null ?
                                    <div>
                                        <strong>Kommentar:</strong> {aufgabe.kommentar}
                                    </div>
                                    : null}

                            </div>
                            {/* Fügen Sie hier weitere Informationen hinzu, die Sie anzeigen möchten */}
                        </div>
                    ))}
                </div>


            </div>
        </div>
    );
}

export default Eingabe;
