const express = require("express")
const router = express.Router();
const { Client } = require("pg")

router.get("/pretraziBazu", async (req, res) => {
    odabranoPolje = req.query.odabranoPolje
    odabranaVrijednost = req.query.odabranaVrijednost

    const client = new Client({
        user: "postgres",
        password: "postgres",
        host: "localhost",
        port: "5433",
        database: "Studenac"
    })

    await client.connect();

    if (odabranaVrijednost == "") {
        rezultati = await client.query("SELECT * FROM trgovine LEFT JOIN artikli ON oznaka = oznaka_trgovine ORDER BY oznaka, adresa, mjesto, geo_sirina, geo_duzina, ocjena, broj_glasova, otvaranje, zatvaranje, ima_zeleni_hell, naziv, cijena, oznaka_trgovine")
    } else if (odabranoPolje == "Sva polja (wildcard)") {
        rezultati = await client.query(`SELECT * FROM trgovine LEFT JOIN artikli ON oznaka = oznaka_trgovine WHERE oznaka LIKE '%' || $1 || '%' OR adresa LIKE '%' || $1 || '%' OR mjesto LIKE '%' || $1 || '%' OR CAST(geo_sirina AS TEXT) LIKE '%' || $1 || '%' OR CAST(geo_duzina AS TEXT) LIKE '%' || $1 || '%' OR CAST(ocjena AS TEXT) LIKE '%' || $1 || '%' OR CAST(broj_glasova AS TEXT) LIKE '%' || $1 || '%' OR otvaranje LIKE '%' || $1 || '%' OR zatvaranje LIKE '%' || $1 || '%' OR CAST(ima_zeleni_hell AS TEXT) LIKE '%' || $1 || '%' OR naziv LIKE '%' || $1 || '%' OR CAST(cijena AS TEXT) LIKE '%' || $1 || '%' ORDER BY oznaka, adresa, mjesto, geo_sirina, geo_duzina, ocjena, broj_glasova, otvaranje, zatvaranje, ima_zeleni_hell, naziv, cijena, oznaka_trgovine`, [odabranaVrijednost])
    }
    else {
        rezultati = await client.query(`SELECT * FROM trgovine LEFT JOIN artikli ON oznaka = oznaka_trgovine WHERE CAST(${odabranoPolje} AS TEXT) LIKE '%' || $1 || '%' ORDER BY oznaka, adresa, mjesto, geo_sirina, geo_duzina, ocjena, broj_glasova, otvaranje, zatvaranje, ima_zeleni_hell, naziv, cijena, oznaka_trgovine`, [odabranaVrijednost])

    }
    rezultatiRetci = rezultati.rows
    await client.end()
    
    res.json(rezultatiRetci)
})

router.get("/generirajJson", async (req,res) => {
    const client = new Client({
        user: "postgres",
        password: "postgres",
        host: "localhost",
        port: "5433",
        database: "Studenac"
    })

    await client.connect();

    rezultati = await client.query(`SELECT json_agg(
                    json_build_object(
                        'oznaka', oznaka,
                        'adresa', adresa,
                        'mjesto', mjesto,
                        'geo_sirina', geo_sirina,
                        'geo_duzina', geo_duzina,
                        'ocjena', ocjena,
                        'broj_glasova', broj_glasova,
                        'otvaranje', otvaranje,
                        'zatvaranje', zatvaranje,
                        'ima_zeleni_hell', ima_zeleni_hell,
                        'artikli', (
                            SELECT json_agg(
                                json_build_object(
                                    'naziv', naziv,
                                    'cijena', cijena
                                )
                            )
                            FROM artikli
                            WHERE oznaka_trgovine = oznaka
                        )
                    )
                )
                FROM trgovine`)
    jsonArray = rezultati.rows[0].json_agg
    await client.end()

    

    jsonArrayFiltered = []
    if (req.query.odabranoPolje == "naziv" || req.query.odabranoPolje == "cijena") {
        jsonArray.forEach(jsonObject => {
            listaArtikala = jsonObject.artikli
            listaArtikalaFiltered = []
            listaArtikala.forEach(artikl => {
                if ((String(artikl[req.query.odabranoPolje])).includes(String(req.query.odabranaVrijednost))) {
                    listaArtikalaFiltered.push(artikl)
                }
            })
            if (listaArtikalaFiltered.length > 0) {
                jsonObject.artikli = listaArtikalaFiltered
                jsonArrayFiltered.push(jsonObject)
            }
            
        })
    } else if(req.query.odabranoPolje == "Sva polja (wildcard)") {
        jsonArray.forEach(jsonObject => {
            if ((String(jsonObject.oznaka)).includes(String(req.query.odabranaVrijednost)) ||
                (String(jsonObject.adresa)).includes(String(req.query.odabranaVrijednost)) ||
                (String(jsonObject.mjesto)).includes(String(req.query.odabranaVrijednost)) ||
                (String(jsonObject.geo_sirina)).includes(String(req.query.odabranaVrijednost)) ||
                (String(jsonObject.geo_duzina)).includes(String(req.query.odabranaVrijednost)) ||
                (String(jsonObject.ocjena)).includes(String(req.query.odabranaVrijednost)) ||
                (String(jsonObject.broj_glasova)).includes(String(req.query.odabranaVrijednost)) ||
                (String(jsonObject.otvaranje)).includes(String(req.query.odabranaVrijednost)) ||
                (String(jsonObject.zatvaranje)).includes(String(req.query.odabranaVrijednost)) ||
                (String(jsonObject.ima_zeleni_hell)).includes(String(req.query.odabranaVrijednost))
            ) {
                jsonArrayFiltered.push(jsonObject)
            } else {
                listaArtikala = jsonObject.artikli
                listaArtikalaFiltered = []
                listaArtikala.forEach(artikl => {
                    if ((String(artikl.naziv)).includes(String(req.query.odabranaVrijednost)) ||
                        (String(artikl.cijena)).includes(String(req.query.odabranaVrijednost))
                    ) {
                        listaArtikalaFiltered.push(artikl)
                    }
                })
                if (listaArtikalaFiltered.length > 0) {
                    jsonObject.artikli = listaArtikalaFiltered
                    jsonArrayFiltered.push(jsonObject)
                }
            }
        })
    }
    
    else {
        jsonArray.forEach(jsonObject => {
            if (String(jsonObject[req.query.odabranoPolje]).includes(String(req.query.odabranaVrijednost))) {
                jsonArrayFiltered.push(jsonObject)
            }
        })
        
    }

    res.json(jsonArrayFiltered)
})


module.exports = router