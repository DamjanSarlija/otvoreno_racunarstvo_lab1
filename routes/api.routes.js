const express = require("express")
const router = express.Router();
const { Client } = require("pg")

router.get("/cjelokupniPodaci", async (req, res) => {

    const client = new Client({
        user: "postgres",
        password: "postgres",
        host: "localhost",
        port: "5433",
        database: "Studenac"
    })
    await client.connect();

    rezultati = await client.query("SELECT * FROM trgovine LEFT JOIN artikli ON oznaka = oznaka_trgovine ORDER BY oznaka, adresa, mjesto, geo_sirina, geo_duzina, ocjena, broj_glasova, otvaranje, zatvaranje, ima_zeleni_hell, naziv, cijena, oznaka_trgovine")
    rezultatiRetci = rezultati.rows
    await client.end()

    
    res.json({
        status: "OK",
        message: "Dohvaćeni podaci o trgovinama",
        response: rezultatiRetci
    })
})

router.get("/pojedinacniResurs", async(req, res) => {

    odabranaVrijednost = req.query.odabranaVrijednost

    const client = new Client({
        user: "postgres",
        password: "postgres",
        host: "localhost",
        port: "5433",
        database: "Studenac"
    })
    await client.connect();

    rezultati = await client.query(`SELECT * FROM trgovine LEFT JOIN artikli ON oznaka = oznaka_trgovine WHERE oznaka LIKE '%' || $1 || '%' ORDER BY oznaka, adresa, mjesto, geo_sirina, geo_duzina, ocjena, broj_glasova, otvaranje, zatvaranje, ima_zeleni_hell, naziv, cijena, oznaka_trgovine`, [odabranaVrijednost])
    rezultatiRetci = rezultati.rows
    await client.end()
    if (rezultatiRetci.length > 0) {
        res.json({
                status: "OK",
                message: "Dohvaćeni podaci o trgovini sa željenom oznakom",
                response: rezultatiRetci
        })
    } else {
        res.status(404).json({
            status: "Not Found",
            message: "Ne postoji trgovina sa zadanom oznakom",
            response: null
        })
    }
    
})

router.get("/trgovineUMjestu", async(req, res) => {
    mjesto = req.query.mjesto

    const client = new Client({
        user: "postgres",
        password: "postgres",
        host: "localhost",
        port: "5433",
        database: "Studenac"
    })
    await client.connect();

    rezultati = await client.query(`SELECT * FROM trgovine LEFT JOIN artikli ON oznaka = oznaka_trgovine WHERE mjesto LIKE '%' || $1 || '%' ORDER BY oznaka, adresa, mjesto, geo_sirina, geo_duzina, ocjena, broj_glasova, otvaranje, zatvaranje, ima_zeleni_hell, naziv, cijena, oznaka_trgovine`, [mjesto])
    rezultatiRetci = rezultati.rows
    await client.end()
    if (rezultatiRetci.length > 0) {
        res.json({
                status: "OK",
                message: "Dohvaćeni podaci o trgovinama u zadanom mjestu",
                response: rezultatiRetci
        })
    } else {
        res.status(404).json({
            status: "Not Found",
            message: "Ne postoji trgovina u zadanom mjestu",
            response: null
        })
    }
})

router.get("/trgovineZeleniHell", async (req, res) => {
    const client = new Client({
        user: "postgres",
        password: "postgres",
        host: "localhost",
        port: "5433",
        database: "Studenac"
    })
    await client.connect();
    rezultati = await client.query(`SELECT * FROM trgovine LEFT JOIN artikli ON oznaka = oznaka_trgovine WHERE ima_zeleni_hell = true ORDER BY oznaka, adresa, mjesto, geo_sirina, geo_duzina, ocjena, broj_glasova, otvaranje, zatvaranje, ima_zeleni_hell, naziv, cijena, oznaka_trgovine`)
    rezultatiRetci = rezultati.rows
    await client.end()
    if (rezultatiRetci.length > 0) {
        res.status(200).json({
                status: "OK",
                message: "Dohvaćeni podaci o trgovinama koje u asortimanu sadrže zeleni Hell",
                response: rezultatiRetci
        })
    } else {
        res.status(404).json({
            status: "Not Found",
            message: "Ne postoji trgovina koja u asortimanu sadrži zeleni Hell",
            response: null
        })
    }
})

router.get("/minOcjena", async (req, res) => {
    minOcjena = req.query.minOcjena
    const client = new Client({
        user: "postgres",
        password: "postgres",
        host: "localhost",
        port: "5433",
        database: "Studenac"
    })
    await client.connect();
    rezultati = await client.query(`SELECT * FROM trgovine LEFT JOIN artikli ON oznaka = oznaka_trgovine WHERE ocjena >= $1 ORDER BY oznaka, adresa, mjesto, geo_sirina, geo_duzina, ocjena, broj_glasova, otvaranje, zatvaranje, ima_zeleni_hell, naziv, cijena, oznaka_trgovine`, [minOcjena])
    rezultatiRetci = rezultati.rows
    await client.end()
    if (rezultatiRetci.length > 0) {
        res.json({
                status: "OK",
                message: "Dohvaćeni podaci o trgovinama s ocjenom većom ili jednakom zadanoj",
                response: rezultatiRetci
        })
    } else {
        res.status(404).json({
            status: "Not Found",
            message: "Ne postoji trgovina s ocjenom većom ili jednakom zadanoj",
            response: null
        })
    }
})

router.post("/dodajResurs", async (req, res) => {
    oznaka = req.body.oznaka
    adresa = req.body.adresa
    mjesto = req.body.mjesto
    geo_sirina = req.body.geo_sirina
    geo_duzina = req.body.geo_duzina
    ocjena = req.body.ocjena
    broj_glasova = req.body.broj_glasova
    otvaranje = req.body.otvaranje
    zatvaranje = req.body.zatvaranje
    ima_zeleni_hell = req.body.ima_zeleni_hell
    naziv = req.body.naziv
    cijena = req.body.cijena

    const client = new Client({
        user: "postgres",
        password: "postgres",
        host: "localhost",
        port: "5433",
        database: "Studenac"
    })
    await client.connect();

    try {
        await client.query(`INSERT INTO trgovine VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [oznaka.toString(), adresa.toString(), mjesto.toString(), parseFloat(geo_sirina), parseFloat(geo_duzina), parseFloat(ocjena), parseInt(broj_glasova), otvaranje.toString(), zatvaranje.toString(), ima_zeleni_hell.toString()])
        await client.query(`INSERT INTO artikli VALUES($1, $2, $3)`, [naziv.toString(), parseFloat(cijena), oznaka.toString()])
        await client.end();
        res.json({
            status: "OK",
            message: "Uspješno dodan resurs u bazu podataka"
        })
    } catch {
        await client.end();
        res.status(400).json({
            status: "Bad Request",
            message: "Dodavanje resursa u bazu podataka nije uspjelo"
        })
    }

    

    await client.end();

})

router.put("/zeleniHellStatus", async (req, res) => {
    oznaka = req.body.oznaka
    zeleni_hell_status = req.body.zeleni_hell_status
    const client = new Client({
        user: "postgres",
        password: "postgres",
        host: "localhost",
        port: "5433",
        database: "Studenac"
    })
    await client.connect();
    try {
        rezultat = await client.query(`SELECT * FROM trgovine WHERE oznaka = $1`, [oznaka.toString()])
        if (rezultat.rows.length == 0) {
            await client.end();
            res.status(404).json({
                status: "Not Found",
                message: "Ne postoji traženi resurs"
            })

        } else {
            await client.query(`UPDATE trgovine SET ima_zeleni_hell = $2 WHERE oznaka = $1`, [oznaka.toString(), zeleni_hell_status.toString()])
            await client.end();
            res.json({
                status: "OK",
                message: "Uspješno izmijenjen status resursa"
            })
        }
        
    } catch {
        await client.end();
        res.status(400).json({
            status: "Bad Request",
            message: "Nije uspjela izmjena statusa resursa"
        })
    }
})

router.delete("/izbrisiResurs", async (req, res) => {
    oznaka = req.body.oznaka
    const client = new Client({
        user: "postgres",
        password: "postgres",
        host: "localhost",
        port: "5433",
        database: "Studenac"
    })
    await client.connect();

    try {
        rezultat = await client.query(`SELECT * FROM trgovine WHERE oznaka = $1`, [oznaka.toString()])
        if (rezultat.rows.length == 0) {
            await client.end();
            res.status(404).json({
                status: "Not Found",
                message: "Ne postoji traženi resurs"
            })

        } else {
            await client.query(`DELETE FROM artikli WHERE oznaka_trgovine = $1`, [oznaka.toString()])
            await client.query(`DELETE FROM trgovine WHERE oznaka = $1`, [oznaka.toString()])
            await client.end();
            res.json({
                status: "OK",
                message: "Uspješno izbrisan resurs"
            })
        }
        
    } catch {
        await client.end();
        res.status(400).json({
            status: "Bad Request",
            message: "Nije uspjelo brisanje resursa"
        })
    }
})

router.get("/dohvatiOpenAPI", async(req, res) => {
    res.json({
        "openapi": "3.0.3",
        "info": {
            "title": "Studenac API",
            "version": "1.0.",
            "contact": {
                "name": "Damjan Šarlija",
                "email": "ds54042@fer.hr"
            },
            "license": {
                "name": "Apache 2.0"
            }
        },
        "paths": {
            "/cjelokupniPodaci": {
                "get": {
                    "summary": "Dohvaća sve podatke iz baze",
                    "description": "Vraća JSON zapis koji sadrži sve podatke iz baze",
                    "responses": {
                        "200": {
                            "description": "Uspješno dohvaćeni podaci o trgovinama",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/pojedinacniResurs": {
                "get": {
                    "summary": "Dohvaća podatke iz tablice o trgovini željene oznake (identifikatora)",
                    "description": "Vraća JSON zapis s podacima o trgovini s traženom oznakom",
                    "parameters": [
                        {
                            "name": "odabranaVrijednost",
                            "in": "query",
                            "description": "identifikator trgovine",
                            "required": true,
                            "type": "string"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Uspješno dohvaćeni podaci o traženoj trgovini",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object"
                                    }
                                }
                            }
                        },
                        "404": {
                            "description": "Ne postoji trgovina s traženom oznakom",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/trgovineUMjestu": {
                "get": {
                    "summary": "Dohvaća podatke o trgovinama u željenom mjestu",
                    "description": "Vraća JSON s podacima o trgovinama u željenom mjestu",
                    "parameters": [
                        {
                            "name": "mjesto",
                            "in": "query",
                            "description": "Naziv željenog mjesta",
                            "required": true,
                            "type": "string"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Uspješno dohvaćeni podaci o trgovinama u traženom mjestu",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object"
                                    }
                                }
                            }
                        },
                        "404": {
                            "description": "Ne postoji trgovina u traženom mjestu",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/trgovineZeleniHell": {
                "get": {
                    "summary": "Dohvaća podatke o trgovinama koje sadrže zeleni Hell u svom asortimanu",
                    "description": "Vraća JSON zapis o svim trgovinama koje u svom asortimanu sadrže zeleni Hell",
                    "responses": {
                        "200": {
                            "description": "Uspješno dohvaćeni podaci o trgovinama koje u asortimanu sadrže zeleni Hell",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object"
                                    }
                                }
                            }
                        },
                        "404": {
                            "description": "Ne postoji trgovina u bazi koja sadrži zeleni Hell u asortimanu",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/minOcjena": {
                "get": {
                    "summary": "Dohvaća trgovine čija je prosječna ocjena veća ili jednaka zadanoj",
                    "description": "Dohvaća JSON zapis s podacima o svim trgovinama čija je prosječna ocjena veća ili jednaka zadanoj",
                    "parameters": [
                        {
                            "name": "minOcjena",
                            "in": "query",
                            "description": "Donja granica filtera ocjene trgovine",
                            "required": true,
                            "type": "string"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Uspješno dohvaćeni podaci o trgovinama s prosječnom ocjenom većom ili jednakom zadanoj",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object"
                                    }
                                }
                            }
                        },
                        "404": {
                            "description": "Ne postoji trgovina u bazi koja ima veću ili jednaku ocjenu zadanoj",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/dodajResurs": {
                "post": {
                    "summary": "Dodaje novi resurs u bazu podataka",
                    "description": "Prima vrijednosti atributa retka tablice i dodaje taj redak u tablicu",
                    "parameters": [
                        {
                            "name": "oznaka",
                            "in": "body",
                            "description": "Jedinstveni identifikator trgovine",
                            "required": true,
                            "type": "string"
                        },
                        {
                            "name": "adresa",
                            "in": "body",
                            "description": "Adresa trgovine",
                            "required": true,
                            "type": "string"
                        },
                        {
                            "name": "mjesto",
                            "in": "body",
                            "description": "Naziv mjesta u kojem se trgovina nalazi",
                            "required": true,
                            "type": "string"
                        },
                        {
                            "name": "geo_sirina",
                            "in": "body",
                            "description": "Geografska širina lokacije trgovine",
                            "required": true,
                            "type": "string"
                        },
                        {
                            "name": "geo_duzina",
                            "in": "body",
                            "description": "Geografska dužina lokacije trgovine",
                            "required": true,
                            "type": "string"
                        },
                        {
                            "name": "ocjena",
                            "in": "body",
                            "description": "Prosječna ocjena trgovine na Google kartama",
                            "required": true,
                            "type": "string"
                        },
                        {
                            "name": "broj_glasova",
                            "in": "body",
                            "description": "Broj ocjena trgovine na Google kartama",
                            "required": true,
                            "type": "string"
                        },
                        {
                            "name": "otvaranje",
                            "in": "body",
                            "description": "Vrijeme otvaranja trgovine",
                            "required": true,
                            "type": "string"
                        },
                        {
                            "name": "zatvaranje",
                            "in": "body",
                            "description": "Vrijeme zatvaranja trgovine",
                            "required": true,
                            "type": "string"
                        },
                        {
                            "name": "ima_zeleni_hell",
                            "in": "body",
                            "description": "Sadrži informaciju ima li ili nema trgovina u asortimanu energetsko piće Hell Focus+",
                            "required": true,
                            "type": "string"
                        },
                        {
                            "name": "naziv",
                            "in": "body",
                            "description": "Naziv artikla",
                            "required": true,
                            "type": "string"
                        },
                        {
                            "name": "cijena",
                            "in": "body",
                            "description": "Cijena artikla",
                            "required": true,
                            "type": "string"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Uspješno dodaj resurs u bazu",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object"
                                    }
                                }
                            }
                        },
                        "400": {
                            "description": "Neuspjelo dodavanje resursa u bazu",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "zeleniHellStatus": {
                "put": {
                    "summary": "Postavlja status postojanja zelenog Hella u asortimanu",
                    "description": "Oznakom 'true' ili 'false' određuje i po potrebi mijenja status polja ima_zeleni_hell u bazi podataka",
                    "parameters": [
                        {
                            "name": "oznaka",
                            "in": "body",
                            "description": "Jedinstveni identifikator trgovine",
                            "required": true,
                            "type": "string"
                        },
                        {
                            "name": "zeleni_hell_status",
                            "in": "body",
                            "description": "Sadrži informaciju ima li ili nema trgovina u asortimanu energetsko piće Hell Focus+",
                            "required": true,
                            "type": "string"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Uspješno ažuriran/potvrđen status resursa",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object"
                                    }
                                }
                            }
                        },
                        "400": {
                            "description": "Neuspješno ažuriranje/potvrda statusa resursa",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object"
                                    }
                                }
                            }
                        },
                        "404": {
                            "description": "Ne postoji trgovina s traženom oznakom",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/izbrisiResurs": {
                "delete": {
                    "summary": "Briše podatke o trgovini sa željenom oznakom iz tablice",
                    "description": "Prima oznaku trgovine i iz tablice uklanja retke koji se odnose na tu trgovinu",
                    "parameters": [
                        {
                            "name": "oznaka",
                            "in": "body",
                            "description": "Jedinstveni identifikator trgovine",
                            "required": true,
                            "type": "string"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Uspješno brisanje željenog resursa",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object"
                                    }
                                }
                            }
                        },
                        "400": {
                            "description": "Neuspješno brisanje resursa",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object"
                                    }
                                }
                            }
                        },
                        "404": {
                            "description": "Ne postoji trgovina s traženom oznakom (resurs ne postoji)",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/dohvatiOpenAPI": {
                "get": {
                    "summary": "Dohvaća OpenAPI specifikaciju sučelja (ovu datoteku)",
                    "description": "U JSON formatu vraća ovu datoteku",
                    "responses": [
                        {
                            "200": {
                                "description": "Uspješno dohvaćanje OpenAPI specifikacije",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object"
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        }
    })
})

module.exports = router