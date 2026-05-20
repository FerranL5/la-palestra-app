// Seeders - Dades d'exemple per a l'aplicació de concerts

// GRUPS MUSICALS
export const grups = [
  {
    id: 1,
    nom: "Txarango",
    descripcio: "Grup de música festiva i reivindicativa amb molt d'èxit arreu dels Països Catalans",
    genere: "Festiva",
    imatge: "/images/grups/txarango.jpg",
    paisOrigen: "Catalunya"
  },
  {
    id: 2,
    nom: "Zoo",
    descripcio: "Banda de pop-rock amb lletres en català i melodies enganxadisses",
    genere: "Pop-Rock",
    imatge: "/images/grups/zoo.jpg",
    paisOrigen: "Catalunya"
  },
  {
    id: 3,
    nom: "Doctor Prats",
    descripcio: "Grup d'indie pop amb energia desbordant i cançons per cantar a cor",
    genere: "Indie Pop",
    imatge: "/images/grups/doctorprats.jpg",
    paisOrigen: "Catalunya"
  },
  {
    id: 4,
    nom: "Smoking Souls",
    descripcio: "Rock amb essència mediterrània i lletres que emocionen",
    genere: "Rock",
    imatge: "/images/grups/smokingsouls.jpg",
    paisOrigen: "País Valencià"
  },
  {
    id: 5,
    nom: "Auxili",
    descripcio: "Banda de rock alternatiu amb força i potència escènica",
    genere: "Rock Alternatiu",
    imatge: "/images/grups/auxili.jpg",
    paisOrigen: "Catalunya"
  },
  {
    id: 6,
    nom: "Andreu Valor",
    descripcio: "Cantautor amb una veu única i cançons profundes",
    genere: "Cantautor",
    imatge: "/images/grups/andreuvalor.jpg",
    paisOrigen: "País Valencià"
  },
  {
    id: 7,
    nom: "La Pegatina",
    descripcio: "Rumba catalana amb molt de ritme i festa assegurada",
    genere: "Rumba",
    imatge: "/images/grups/lapegatina.jpg",
    paisOrigen: "Catalunya"
  },
  {
    id: 8,
    nom: "Manel",
    descripcio: "Pop amb lletres literàries i melodies sofisticades",
    genere: "Pop",
    imatge: "/images/grups/manel.jpg",
    paisOrigen: "Catalunya"
  },
  {
    id: 9,
    nom: "Buhos",
    descripcio: "Mestissatge musical amb rumba, reggae i ska",
    genere: "Rumba-Reggae",
    imatge: "/images/grups/buhos.jpg",
    paisOrigen: "Catalunya"
  },
  {
    id: 10,
    nom: "Catarres",
    descripcio: "Pop-rock amb himnes generacionals i concerts multitudinaris",
    genere: "Pop-Rock",
    imatge: "/images/grups/catarres.jpg",
    paisOrigen: "Catalunya"
  },
  {
    id: 11,
    nom: "Oques Grasses",
    descripcio: "Indie pop fresc amb cançons d'estiu i bones vibracions",
    genere: "Indie Pop",
    imatge: "/images/grups/oquesgrasses.jpg",
    paisOrigen: "Catalunya"
  },
  {
    id: 12,
    nom: "Blaumut",
    descripcio: "Pop d'autor amb arranjaments acurats i veu característica",
    genere: "Pop d'Autor",
    imatge: "/images/grups/blaumut.jpg",
    paisOrigen: "Catalunya"
  },
  {
    id: 13,
    nom: "Stay Homas",
    descripcio: "Fenomen viral amb cançons intimistes i directes",
    genere: "Pop",
    imatge: "/images/grups/stayhomas.jpg",
    paisOrigen: "Catalunya"
  },
  {
    id: 14,
    nom: "Lildami",
    descripcio: "Rap i trap en català amb flow únic",
    genere: "Rap/Trap",
    imatge: "/images/grups/lildami.jpg",
    paisOrigen: "Catalunya"
  },
  {
    id: 15,
    nom: "Joan Dausà",
    descripcio: "Cantautor amb cançons plenes de sinceritat i emoció",
    genere: "Cantautor",
    imatge: "/images/grups/joandausa.jpg",
    paisOrigen: "Catalunya"
  }
];

// ESDEVENIMENTS (Festivals)
export const esdeveniments = [
  {
    id: 1,
    nom: "Canet Rock 2026",
    descripcio: "El festival de referència de la música en català a la platja de Canet de Mar",
    dataInici: "2026-07-04",
    dataFi: "2026-07-06",
    lloc: "Platja de Canet de Mar",
    ciutat: "Canet de Mar",
    imatge: "/images/esdeveniments/canetrock.jpg",
    concertIds: [1, 2, 3, 4, 5, 6]
  },
  {
    id: 2,
    nom: "Embassa't 2026",
    descripcio: "Festival a la vora de l'embassament de Darnius amb música i natura",
    dataInici: "2026-08-15",
    dataFi: "2026-08-17",
    lloc: "Embassament de Darnius",
    ciutat: "Darnius",
    imatge: "/images/esdeveniments/embassat.jpg",
    concertIds: [7, 8, 9, 10]
  },
  {
    id: 3,
    nom: "Festivalet",
    descripcio: "Festival familiar amb música i activitats per a tota la família",
    dataInici: "2026-06-20",
    dataFi: "2026-06-22",
    lloc: "Parc de la Ciutadella",
    ciutat: "Barcelona",
    imatge: "/images/esdeveniments/festivalet.jpg",
    concertIds: [11, 12, 13]
  },
  {
    id: 4,
    nom: "Acústica 2026",
    descripcio: "Concerts acústics en format íntim a diferents espais de Figueres",
    dataInici: "2026-09-10",
    dataFi: "2026-09-14",
    lloc: "Diversos espais",
    ciutat: "Figueres",
    imatge: "/images/esdeveniments/acustica.jpg",
    concertIds: [14, 15, 16]
  },
  {
    id: 5,
    nom: "Les Nits de Vivers",
    descripcio: "Concerts d'estiu als Jardins de Vivers de València",
    dataInici: "2026-07-15",
    dataFi: "2026-07-30",
    lloc: "Jardins de Vivers",
    ciutat: "València",
    imatge: "/images/esdeveniments/nitsvivers.jpg",
    concertIds: [17, 18, 19, 20]
  }
];

// CONCERTS
export const concerts = [
  // Concerts del Canet Rock
  {
    id: 1,
    grupId: 1,
    titol: "Txarango - Canet Rock 2026",
    data: "2026-07-04",
    hora: "23:00",
    lloc: "Escenari Principal",
    ciutat: "Canet de Mar",
    preu: 0, // Inclòs en l'entrada del festival
    descripcio: "Concert de cap de cartell de Txarango al Canet Rock",
    imatge: "/images/concerts/txarango-canet.jpg",
    esdevenimentId: 1
  },
  {
    id: 2,
    grupId: 3,
    titol: "Doctor Prats - Canet Rock 2026",
    data: "2026-07-05",
    hora: "22:00",
    lloc: "Escenari Principal",
    ciutat: "Canet de Mar",
    preu: 0,
    descripcio: "Doctor Prats portarà tota la seva energia al Canet Rock",
    imatge: "/images/concerts/doctorprats-canet.jpg",
    esdevenimentId: 1
  },
  {
    id: 3,
    grupId: 7,
    titol: "La Pegatina - Canet Rock 2026",
    data: "2026-07-05",
    hora: "19:30",
    lloc: "Escenari Secundari",
    ciutat: "Canet de Mar",
    preu: 0,
    descripcio: "Rumba i festa amb La Pegatina",
    imatge: "/images/concerts/lapegatina-canet.jpg",
    esdevenimentId: 1
  },
  {
    id: 4,
    grupId: 9,
    titol: "Buhos - Canet Rock 2026",
    data: "2026-07-06",
    hora: "20:00",
    lloc: "Escenari Principal",
    ciutat: "Canet de Mar",
    preu: 0,
    descripcio: "Buhos tancarà el festival amb el seu millor repertori",
    imatge: "/images/concerts/buhos-canet.jpg",
    esdevenimentId: 1
  },
  {
    id: 5,
    grupId: 11,
    titol: "Oques Grasses - Canet Rock 2026",
    data: "2026-07-04",
    hora: "21:00",
    lloc: "Escenari Secundari",
    ciutat: "Canet de Mar",
    preu: 0,
    descripcio: "Les millors cançons d'Oques Grasses",
    imatge: "/images/concerts/oquesgrasses-canet.jpg",
    esdevenimentId: 1
  },
  {
    id: 6,
    grupId: 14,
    titol: "Lildami - Canet Rock 2026",
    data: "2026-07-06",
    hora: "18:00",
    lloc: "Escenari Electrònic",
    ciutat: "Canet de Mar",
    preu: 0,
    descripcio: "Rap i trap amb Lildami",
    imatge: "/images/concerts/lildami-canet.jpg",
    esdevenimentId: 1
  },

  // Concerts de l'Embassa't
  {
    id: 7,
    grupId: 2,
    titol: "Zoo - Embassa't 2026",
    data: "2026-08-15",
    hora: "22:30",
    lloc: "Escenari Principal",
    ciutat: "Darnius",
    preu: 0,
    descripcio: "Zoo obre el festival Embassa't",
    imatge: "/images/concerts/zoo-embassat.jpg",
    esdevenimentId: 2
  },
  {
    id: 8,
    grupId: 4,
    titol: "Smoking Souls - Embassa't 2026",
    data: "2026-08-16",
    hora: "23:00",
    lloc: "Escenari Principal",
    ciutat: "Darnius",
    preu: 0,
    descripcio: "Rock potent amb Smoking Souls",
    imatge: "/images/concerts/smokingsouls-embassat.jpg",
    esdevenimentId: 2
  },
  {
    id: 9,
    grupId: 8,
    titol: "Manel - Embassa't 2026",
    data: "2026-08-17",
    hora: "22:00",
    lloc: "Escenari Principal",
    ciutat: "Darnius",
    preu: 0,
    descripcio: "Concert especial de Manel",
    imatge: "/images/concerts/manel-embassat.jpg",
    esdevenimentId: 2
  },
  {
    id: 10,
    grupId: 10,
    titol: "Catarres - Embassa't 2026",
    data: "2026-08-16",
    hora: "20:00",
    lloc: "Escenari Secundari",
    ciutat: "Darnius",
    preu: 0,
    descripcio: "Els himnes de Catarres",
    imatge: "/images/concerts/catarres-embassat.jpg",
    esdevenimentId: 2
  },

  // Concerts del Festivalet
  {
    id: 11,
    grupId: 13,
    titol: "Stay Homas - Festivalet 2026",
    data: "2026-06-20",
    hora: "19:00",
    lloc: "Parc de la Ciutadella",
    ciutat: "Barcelona",
    preu: 0,
    descripcio: "Concert familiar amb Stay Homas",
    imatge: "/images/concerts/stayhomas-festivalet.jpg",
    esdevenimentId: 3
  },
  {
    id: 12,
    grupId: 15,
    titol: "Joan Dausà - Festivalet 2026",
    data: "2026-06-21",
    hora: "20:00",
    lloc: "Parc de la Ciutadella",
    ciutat: "Barcelona",
    preu: 0,
    descripcio: "Cançons per a tota la família",
    imatge: "/images/concerts/joandausa-festivalet.jpg",
    esdevenimentId: 3
  },
  {
    id: 13,
    grupId: 12,
    titol: "Blaumut - Festivalet 2026",
    data: "2026-06-22",
    hora: "19:30",
    lloc: "Parc de la Ciutadella",
    ciutat: "Barcelona",
    preu: 0,
    descripcio: "Pop d'autor amb Blaumut",
    imatge: "/images/concerts/blaumut-festivalet.jpg",
    esdevenimentId: 3
  },

  // Concerts de l'Acústica
  {
    id: 14,
    grupId: 6,
    titol: "Andreu Valor - Acústica 2026",
    data: "2026-09-10",
    hora: "21:00",
    lloc: "Teatre El Jardí",
    ciutat: "Figueres",
    preu: 15,
    descripcio: "Concert acústic íntim d'Andreu Valor",
    imatge: "/images/concerts/andreuvalor-acustica.jpg",
    esdevenimentId: 4
  },
  {
    id: 15,
    grupId: 12,
    titol: "Blaumut Acústic - Acústica 2026",
    data: "2026-09-12",
    hora: "20:30",
    lloc: "Museu Dalí",
    ciutat: "Figueres",
    preu: 20,
    descripcio: "Versió acústica de Blaumut",
    imatge: "/images/concerts/blaumut-acustica.jpg",
    esdevenimentId: 4
  },
  {
    id: 16,
    grupId: 15,
    titol: "Joan Dausà Acústic - Acústica 2026",
    data: "2026-09-14",
    hora: "21:00",
    lloc: "Església de Sant Pere",
    ciutat: "Figueres",
    preu: 18,
    descripcio: "Joan Dausà en format acústic especial",
    imatge: "/images/concerts/joandausa-acustica.jpg",
    esdevenimentId: 4
  },

  // Concerts de Les Nits de Vivers
  {
    id: 17,
    grupId: 4,
    titol: "Smoking Souls - Nits de Vivers",
    data: "2026-07-15",
    hora: "22:00",
    lloc: "Jardins de Vivers",
    ciutat: "València",
    preu: 25,
    descripcio: "Rock al fresc als Vivers",
    imatge: "/images/concerts/smokingsouls-vivers.jpg",
    esdevenimentId: 5
  },
  {
    id: 18,
    grupId: 6,
    titol: "Andreu Valor - Nits de Vivers",
    data: "2026-07-20",
    hora: "21:30",
    lloc: "Jardins de Vivers",
    ciutat: "València",
    preu: 22,
    descripcio: "Cantautor valencià als Vivers",
    imatge: "/images/concerts/andreuvalor-vivers.jpg",
    esdevenimentId: 5
  },
  {
    id: 19,
    grupId: 1,
    titol: "Txarango - Nits de Vivers",
    data: "2026-07-25",
    hora: "22:30",
    lloc: "Jardins de Vivers",
    ciutat: "València",
    preu: 28,
    descripcio: "Festa amb Txarango",
    imatge: "/images/concerts/txarango-vivers.jpg",
    esdevenimentId: 5
  },
  {
    id: 20,
    grupId: 9,
    titol: "Buhos - Nits de Vivers",
    data: "2026-07-30",
    hora: "22:00",
    lloc: "Jardins de Vivers",
    ciutat: "València",
    preu: 24,
    descripcio: "Rumba-reggae per tancar les Nits",
    imatge: "/images/concerts/buhos-vivers.jpg",
    esdevenimentId: 5
  },

  // Concerts individuals (no pertanyen a cap esdeveniment)
  {
    id: 21,
    grupId: 1,
    titol: "Txarango - Gira Primavera",
    data: "2026-05-15",
    hora: "21:00",
    lloc: "Palau Sant Jordi",
    ciutat: "Barcelona",
    preu: 35,
    descripcio: "Concert especial de presentació del nou disc",
    imatge: "/images/concerts/txarango-palau.jpg",
    esdevenimentId: null
  },
  {
    id: 22,
    grupId: 8,
    titol: "Manel - Concert Únic",
    data: "2026-06-10",
    hora: "21:30",
    lloc: "Gran Teatre del Liceu",
    ciutat: "Barcelona",
    preu: 45,
    descripcio: "Concert especial al Liceu amb orquestra",
    imatge: "/images/concerts/manel-liceu.jpg",
    esdevenimentId: null
  },
  {
    id: 23,
    grupId: 3,
    titol: "Doctor Prats - Tour Tardor",
    data: "2026-10-20",
    hora: "20:30",
    lloc: "Sala Apolo",
    ciutat: "Barcelona",
    preu: 20,
    descripcio: "Concert íntim a la Sala Apolo",
    imatge: "/images/concerts/doctorprats-apolo.jpg",
    esdevenimentId: null
  },
  {
    id: 24,
    grupId: 2,
    titol: "Zoo - Acústic",
    data: "2026-11-05",
    hora: "20:00",
    lloc: "Teatre Principal",
    ciutat: "Vic",
    preu: 18,
    descripcio: "Versió acústica de Zoo a Vic",
    imatge: "/images/concerts/zoo-vic.jpg",
    esdevenimentId: null
  },
  {
    id: 25,
    grupId: 5,
    titol: "Auxili - Gira Nacional",
    data: "2026-09-28",
    hora: "21:00",
    lloc: "Razzmatazz",
    ciutat: "Barcelona",
    preu: 22,
    descripcio: "Rock alternatiu amb tota la força",
    imatge: "/images/concerts/auxili-razz.jpg",
    esdevenimentId: null
  },
  {
    id: 26,
    grupId: 7,
    titol: "La Pegatina - Festa Major",
    data: "2026-08-24",
    hora: "23:30",
    lloc: "Plaça Major",
    ciutat: "Girona",
    preu: 0,
    descripcio: "Concert gratuït a la Festa Major de Girona",
    imatge: "/images/concerts/lapegatina-girona.jpg",
    esdevenimentId: null
  },
  {
    id: 27,
    grupId: 10,
    titol: "Catarres - 15 Anys",
    data: "2026-12-15",
    hora: "21:00",
    lloc: "Palau Firal i de Congressos",
    ciutat: "Tarragona",
    preu: 30,
    descripcio: "Concert especial 15è aniversari",
    imatge: "/images/concerts/catarres-tarragona.jpg",
    esdevenimentId: null
  },
  {
    id: 28,
    grupId: 11,
    titol: "Oques Grasses - Estiu 2026",
    data: "2026-07-12",
    hora: "22:00",
    lloc: "Platja del Trabucador",
    ciutat: "Deltebre",
    preu: 15,
    descripcio: "Concert a la platja amb posta de sol",
    imatge: "/images/concerts/oquesgrasses-platja.jpg",
    esdevenimentId: null
  },
  {
    id: 29,
    grupId: 13,
    titol: "Stay Homas - Acústic",
    data: "2026-10-08",
    hora: "20:00",
    lloc: "Luz de Gas",
    ciutat: "Barcelona",
    preu: 25,
    descripcio: "Concert acústic íntim",
    imatge: "/images/concerts/stayhomas-luzdgas.jpg",
    esdevenimentId: null
  },
  {
    id: 30,
    grupId: 14,
    titol: "Lildami - Solo Tour",
    data: "2026-11-15",
    hora: "21:30",
    lloc: "Sala Bóveda",
    ciutat: "Barcelona",
    preu: 18,
    descripcio: "Rap i trap en directe",
    imatge: "/images/concerts/lildami-boveda.jpg",
    esdevenimentId: null
  }
];

// USUARIS (per a autenticació)
export const usuaris = [
  {
    id: 1,
    nom: "Jordi Garcia",
    email: "jordi@exemple.cat",
    password: "12345678", // En producció, això estaria encriptat!
    grupsPreferits: [1, 3, 8, 11] // IDs dels grups preferits
  },
  {
    id: 2,
    nom: "Maria Puig",
    email: "maria@exemple.cat",
    password: "password",
    grupsPreferits: [2, 4, 7, 10, 13]
  },
  {
    id: 3,
    nom: "Pau Martínez",
    email: "pau@exemple.cat",
    password: "test1234",
    grupsPreferits: [6, 12, 15]
  }
];