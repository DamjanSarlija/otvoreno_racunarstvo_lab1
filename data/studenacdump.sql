--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: artikli; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.artikli (
    naziv character varying(255),
    cijena double precision,
    oznaka_trgovine character varying(255)
);


ALTER TABLE public.artikli OWNER TO postgres;

--
-- Name: trgovine; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trgovine (
    oznaka character varying(255) NOT NULL,
    adresa character varying(255),
    mjesto character varying(255),
    geo_sirina double precision,
    geo_duzina double precision,
    ocjena double precision,
    broj_glasova integer,
    otvaranje character varying(255),
    zatvaranje character varying(255),
    ima_zeleni_hell boolean
);


ALTER TABLE public.trgovine OWNER TO postgres;

--
-- Data for Name: artikli; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.artikli (naziv, cijena, oznaka_trgovine) FROM stdin;
Gazirana mineralna voda	0.59	T1162
Krem puding Galetta	1.09	T1162
Pirovo integralno brašno	1.89	T876
Tortilja	1.89	T1160
Šibice	0.89	T1160
Carska mješavina	1.65	T1167
Vitaminski napitak	4.19	T1167
Pašteta losos	2.39	T1163
Osvježivač prostora	3.99	T1705
Panirani riblji štapići	2.39	T1705
Pašteta jetrena	0.65	T1705
Puding	0.49	T1166
Grah bijeli	1.69	T1166
Jabuka Idared	1.27	T1166
Keks Choco cookie	1.89	T1415
Tjestenina filini	0.98	T1415
Grah šareni	1.29	T1415
Potpuna hrana za mačke	0.65	T1415
Ćevapčići	8.99	T1415
Čokolada ledena	1.29	T1164
Kikiriki	1.29	T1164
Četvrt mlade kokoši	1.89	T1164
Mliječni napitak	0.69	T1415
Pečena šunka	10.99	T1415
Kukuruz šećerac	0.95	T1161
\.


--
-- Data for Name: trgovine; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trgovine (oznaka, adresa, mjesto, geo_sirina, geo_duzina, ocjena, broj_glasova, otvaranje, zatvaranje, ima_zeleni_hell) FROM stdin;
T1162	Vugrovečka cesta 62	Dobrodol	45.85434	16.11278	5	2	7:00	21:00	t
T876	Zagrebačka cesta 9	Sesvete	45.82747	16.10799	3.7	31	7:00	22:00	f
T1160	Bjelovarska ulica 2	Sesvete	45.82691	16.11117	5	3	6:30	21:00	t
T1167	Varaždinska cesta 90	Popovec	45.85068	16.14063	4.4	5	7:00	21:00	t
T1163	Augusta Šenoe 49	Vugrovec	45.88053	16.10886	3.3	6	6:30	21:00	f
T1705	Žugčićeva 22	Novoselec	45.84942	16.08261	5	1	7:00	21:00	f
T1166	Ulica kaktusa 5	Brestje	45.82746	16.08519	3.7	3	7:00	21:00	t
T1415	Oporovečki vinogradi 17	Oporovec	45.85384	16.0578	3	6	7:00	22:00	t
T1164	Zagrebačka cesta 4C	Sesvete	45.82796	16.10796	5	1	6:30	21:00	t
T1161	Trg Antuna Mihanovića 4	Sesvete	45.8294	16.07957	4.8	6	7:00	22:00	f
\.


--
-- Name: trgovine trgovine_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trgovine
    ADD CONSTRAINT trgovine_pkey PRIMARY KEY (oznaka);


--
-- Name: artikli artikli_oznaka_trgovine_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artikli
    ADD CONSTRAINT artikli_oznaka_trgovine_fkey FOREIGN KEY (oznaka_trgovine) REFERENCES public.trgovine(oznaka);


--
-- PostgreSQL database dump complete
--

