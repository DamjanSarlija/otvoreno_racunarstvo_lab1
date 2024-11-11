---
PODACI O AUTORU I SADRŽAJU REPOZITORIJA>:
Licenca: MIT
Autor: Damjan Šarlija
Kontakt: ds54042@fer.hr
Verzija: 1.0
Učestalost ažuriranja: nedefinirano
Jezik: Hrvatski
Geografsko područje: županija Grad Zagreb
Datum: 27. listopada 2024.
Institucija: Fakultet elektrotehnike i računarstva Sveučilišta u Zagrebu
Predmet: Otvoreno računarstvo
ATRIBUTI TRGOVINE>: 
oznaka: Jedinstveni identifikator Studenac poslovnice naveden na službenoj internetskoj stranici Studenca
adresa: Ulica i kućni broj poslovnice
mjesto: Naziv naselja u kojem se nalazi poslovnica
geo_sirina: Geografska širina lokacije poslovnice
geo_duzina: Geografska dužina lokacije poslovnice
ocjena: Prosječna ocjena dodijeljena lokaciji na Google kartama
broj_glasova: Broj ocijena dodijeljenih lokaciji na Google kartama
otvaranje: Početak radnog vremena poslovnice radnim danom, ali ne nužno i nedjeljom
zatvaranje: Završetak radnog vremena poslovnice radnim danom, ali ne nužno i nedjeljom
ima_zeleni_hell: Označava nalazi li se trenutno u asortimanu poslovnice energetsko piće Hell Focus+
artikli: Nekoliko artikala iz asortimana trgovine
ATRIBUTI ARTIKLI>:
naziv: Naziv artikla naveden u službenom katalogu Studenca pronađenom na službenoj internetskoj stranici Studenca
cijena: Trenutna cijena artikla navedena u službenom katalogu Studenca pronađenom na službenoj internetskoj stranici Studenca, može podrazumijevati i akcijsku cijenu ako je akcija trenutno u tijeku
oznaka_trgovine (nema u .json i .csv datotekama): Jedinstveni identifikator Studenac poslovnice naveden na službenoj internetskoj stranici Studenca. Preslikani atribut atributa "oznaka" objekata trgovine, služi za povezivanje dviju tablica baze podataka
---


Ovaj skup podataka obuhvaća podatke o deset odabranih Studenac poslovnica na području županije Grad Zagreb. Skup je pohranjen u PostgreSQL bazu podataka modeliranu koristeći dvije tablice: trgovine i artikli. Ove dvije tablice povezane su putem atributa oznaka u tablici trgovine, koji odgovara atributu oznaka_trgovine u tablici artikli. Opisi svih atributa prikazani su u tablici iznad. Podaci su prikupljeni koristeći službenu internetsku stranicu Studenca te Google karte.

Iz PostgreSQL baze podataka, podaci su izdvojeni u .json i .csv datoteke. Izvoz u .json izveden je sljedećim SQL naredbama:

COPY (
    SELECT json_agg(
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
    FROM trgovine
) TO 'C:/isprobaj/rez.json';


Izvoz iz PostgreSQL baze podataka u .csv datoteku izveden je sljedećim SQL naredbama:

COPY (
	SELECT oznaka, adresa, mjesto, geo_sirina, geo_duzina, ocjena, broj_glasova, otvaranje, zatvaranje, ima_zeleni_hell, naziv, cijena
	FROM trgovine LEFT JOIN artikli ON oznaka = oznaka_trgovine
) TO 'C:/isprobaj/rezcsv.csv' WITH csv;
