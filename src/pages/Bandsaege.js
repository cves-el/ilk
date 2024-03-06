import React, { useEffect, useState, useCallback } from 'react';
import '../App.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Bandsaege() {

    const [aufgabenStatus, setAufgabenStatus] = useState([]);
    const [color, setColor] = useState('#e5eb34');

    // useCallback verwenden, um fetchAuftraege zu definieren
    const fetchAuftraege = useCallback(() => {

        axios.get(`http://192.168.1.5:8081/aufgaben/status`)
            .then(response => {
                setAufgabenStatus(response.data);

            })
            .catch(err => {
                console.error('Fehler beim Abrufen der Aufgaben:', err);
            });

    }, []); // selectedAuftrag als Abhängigkeit hinzufügen


    useEffect(() => {
        // Funktionen initial aufrufen
        fetchAuftraege();

        // setInterval verwenden, um die Funktionen alle 5 Sekunden auszuführen
        const intervalId = setInterval(() => {
            fetchAuftraege();
        }, 3000);

        // Aufräumen
        return () => clearInterval(intervalId);
    }, [fetchAuftraege]); // Hier fetchAuftraege als Abhängigkeit hinzufügen

    useEffect(() => {
        const intervalId = setInterval(() => {
            setColor(prevColor => (prevColor === '#e5eb34' ? 'red' : '#e5eb34'));
        }, 500); // Intervallzeit in Millisekunden

        return () => clearInterval(intervalId); // Aufräumen beim Komponentenabbau
    }, []);



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




        } catch (error) {
            console.error('Fehler beim Aktualisieren der Aufgaben:', error);
        }
    };

    const handelAufgabeSchnitt = async (aufgabeID, neuerstatus) => {

        console.log(aufgabeID, neuerstatus)
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

            if (neuerstatus === 1) {
                handleReihenfolgeAufgabe(aufgabeID, 0)
            }
            /* if (reihenfolge > 0) {
                handleReihenfolgeAufgabe(aufgabeID, 0)
            } */

            // Nachdem die Aufgaben aktualisiert wurden, führen Sie fetchAuftraege aus
            fetchAuftraege();

        } catch (error) {
            console.error('Fehler beim Aktualisieren der Aufgaben:', error);
        }



    };

    return (
        <div className="App" style={{ backgroundColor: '#1f1f1f', color: '#1f1f1f', width: '100%', height: '100%', fontFamily: 'Roboto, sans-serif' }}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>


                {/* ANZEIGE WELCHE PRODUKTE ALS NÄCHSTES GEMACHT WERDEN */}
                {aufgabenStatus.filter(aufgabe => aufgabe.reihenfolge > 0).length > 0 && (
                    <div style={{ display: 'flex', flex: '1' }}>
                        {aufgabenStatus.filter(aufgabe => aufgabe.status === 2).length > 0 ?
                            <button style={{ flex: '1', backgroundColor: color, alignItems: 'center', justifyContent: 'center', display: 'flex' }} onClick={() => handelAufgabeSchnitt(((aufgabenStatus.find(aufgabe => aufgabe.status === 2)).ID), 1)}>

                                {/* Filtern der Aufgaben mit Reihenfolge größer 1 */}

                                <div>
                                    <div style={{ display: 'flex' }}>

                                        <div style={{ display: 'flex' }}>

                                            {aufgabenStatus.filter(aufgabe => aufgabe.reihenfolge === 1).map((aufgabe, index) => (
                                                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                    {/* Hier rendern Sie die Informationen zur Aufgabe */}
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', fontSize: '6vh', marginBottom: '5px', marginTop: '5px' }}>
                                                        <div style={{ textAlign: 'left', flexGrow: '1' }}><strong>Als nächstes:  </strong> <strong>Maße: </strong>{aufgabe.hoehe} x {aufgabe.breite} x {aufgabe.laenge}m</div>
                                                        {aufgabe.stueck !== null ?
                                                            <div style={{ textAlign: 'left', flexGrow: '1', marginLeft: '5vh' }}><strong>Menge:</strong> {aufgabe.stueck}{aufgabe.stueck_pack === 1 ? ' ST.' : ' P.'} </div>
                                                            : null}


                                                    </div>
                                                    {/* Fügen Sie hier weitere Informationen hinzu, die Sie anzeigen möchten */}
                                                </div>

                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </button>
                            : <div style={{ flex: '1', backgroundColor: '#e5eb34', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>

                                {/* Filtern der Aufgaben mit Reihenfolge größer 1 */}

                                <div>
                                    <div style={{ display: 'flex' }}>

                                        <div style={{ display: 'flex' }}>

                                            {aufgabenStatus.filter(aufgabe => aufgabe.reihenfolge === 1).map((aufgabe, index) => (
                                                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                    {/* Hier rendern Sie die Informationen zur Aufgabe */}
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', fontSize: '6vh', marginBottom: '5px', marginTop: '5px' }}>
                                                        <div style={{ textAlign: 'left', flexGrow: '1' }}><strong>Als nächstes:  </strong> <strong>Maße: </strong>{aufgabe.hoehe} x {aufgabe.breite} x {aufgabe.laenge}m</div>
                                                        {aufgabe.stueck !== null ?
                                                            <div style={{ textAlign: 'left', flexGrow: '1', marginLeft: '5vh' }}><strong>Menge:</strong> {aufgabe.stueck}{aufgabe.stueck_pack === 1 ? ' ST.' : ' P.'} </div>
                                                            : null}


                                                    </div>
                                                    {/* Fügen Sie hier weitere Informationen hinzu, die Sie anzeigen möchten */}
                                                </div>

                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>}
                    </div>)}

                {/* ANZEIGE WELCHES PRODUKT GEMACHT WIRD */}
                <div style={{ flex: '1', flexShrink: 0, backgroundColor: '#52a152', alignItems: 'center', justifyContent: 'center' }}>

                    {/* Filtern der Aufgaben mit Status 1 */}
                    {aufgabenStatus.filter(aufgabe => aufgabe.status === 1).map((aufgabe, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            {/* Hier rendern Sie die Informationen zur Aufgabe */}

                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', fontSize: '7vh' }}>
                                <div style={{ textAlign: 'left', flexGrow: '1' }}>  <strong>Maße: </strong>{aufgabe.hoehe} x {aufgabe.breite} x {aufgabe.laenge}m</div>
                                {aufgabe.stueck !== null ?
                                    <div style={{ textAlign: 'left', flexGrow: '1', marginLeft: '5vh' }}><strong>Menge:</strong> {aufgabe.stueck}{aufgabe.stueck_pack === 1 ? ' ST.' : ' P.'} </div>
                                    : null}
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', fontSize: '4vh', padding: '5vh' }}>
                                {aufgabe.zugeschnitten !== null ?
                                    <div style={{ flexGrow: 1, textAlign: 'left', marginRight: '3vh' }}>
                                        {aufgabe.zugeschnitten !== null ? <div ><strong>Zugeschnitten:</strong> {aufgabe.zugeschnitten === 1 ? 'Ja' : 'Nein'}</div> : null}

                                    </div>
                                    : null}
                                {aufgabe.kammer !== null ?
                                    <div style={{ flexGrow: 1, width: '200px', textAlign: 'left', marginRight: '3vh' }}>

                                        {aufgabe.kammer !== null ? <div ><strong>Kammer:</strong> {aufgabe.kammer === 1 ? 'Ja' : 'Nein'}</div> : null}

                                    </div>
                                    : null}



                                {aufgabe.seitenware !== null ?
                                    <div style={{ flexGrow: 1, width: '200px', textAlign: 'left', marginRight: '3vh' }}>
                                        {aufgabe.seitenware !== null ? <div ><strong>Seitenware:</strong> {aufgabe.seitenware}</div> : null}

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

export default Bandsaege;
