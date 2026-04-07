// Dynamic question generation system - generates unique questions each round

export interface Question {
  question: string;
  answer: string;
  difficulty: number;
}

// Template-based generators that produce different questions each time
type QuestionGenerator = (difficulty: number) => Question;

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ─── MCU ───────────────────────────────────────────────
const mcuFacts: { q: string; a: string; d: number }[] = [
  { q: "Chi interpreta Tony Stark nel MCU?", a: "Robert Downey Jr.", d: 1 },
  { q: "Come si chiama il martello di Thor?", a: "Mjolnir", d: 1 },
  { q: "Quale personaggio dice 'I am Groot'?", a: "Groot", d: 1 },
  { q: "Chi interpreta il Capitano America?", a: "Chris Evans", d: 1 },
  { q: "Qual è il nome del regno di T'Challa?", a: "Wakanda", d: 1 },
  { q: "In quale film appare per la prima volta Spider-Man nel MCU?", a: "Captain America: Civil War", d: 2 },
  { q: "Qual è il vero nome di Black Widow?", a: "Natasha Romanoff", d: 2 },
  { q: "Come si chiama il pianeta natale di Thor?", a: "Asgard", d: 2 },
  { q: "Quale attore interpreta Loki?", a: "Tom Hiddleston", d: 2 },
  { q: "Chi è il villain principale di Avengers: Infinity War?", a: "Thanos", d: 2 },
  { q: "Quante Gemme dell'Infinito esistono?", a: "Sei", d: 2 },
  { q: "In quale film muore Tony Stark?", a: "Avengers: Endgame", d: 2 },
  { q: "Quale Gemma dell'Infinito si trova nella Mente di Vision?", a: "La Gemma della Mente", d: 3 },
  { q: "Come si chiama l'organizzazione segreta infiltrata nello S.H.I.E.L.D.?", a: "HYDRA", d: 3 },
  { q: "Chi ha creato Ultron?", a: "Tony Stark e Bruce Banner", d: 3 },
  { q: "Come si chiama la sostanza che alimenta il cuore di Wakanda?", a: "Vibranio (Vibranium)", d: 3 },
  { q: "Come si chiama il metallo dello scudo di Cap?", a: "Vibranio", d: 3 },
  { q: "In quale Avengers appare per la prima volta la Scarlet Witch?", a: "Avengers: Age of Ultron", d: 3 },
  { q: "Chi è il regista di Avengers: Endgame?", a: "Anthony e Joe Russo", d: 4 },
  { q: "Come si chiama la figlia di Tony Stark?", a: "Morgan Stark", d: 4 },
  { q: "Chi è il Sorcerer Supreme prima di Doctor Strange?", a: "L'Antico (The Ancient One)", d: 4 },
  { q: "Chi è il padre biologico di Star-Lord?", a: "Ego", d: 4 },
  { q: "Chi ha sacrificato la propria vita su Vormir per la Gemma dell'Anima in Endgame?", a: "Natasha Romanoff", d: 4 },
  { q: "Qual è il nome del gatto di Nick Fury in Captain Marvel?", a: "Goose (un Flerken)", d: 5 },
  { q: "Come si chiama l'intelligenza artificiale che sostituisce J.A.R.V.I.S.?", a: "F.R.I.D.A.Y.", d: 5 },
  { q: "In quale pianeta Star-Lord è stato rapito da bambino?", a: "Terra (Missouri)", d: 5 },
  { q: "Chi interpreta Shang-Chi?", a: "Simu Liu", d: 5 },
  { q: "Qual è il numero dell'universo principale del MCU nel multiverso?", a: "Terra-616", d: 6 },
  { q: "In quale anno è ambientato il prologo di Black Panther?", a: "1992", d: 6 },
  { q: "Quanti film ha la Fase 1 del MCU?", a: "Sei", d: 6 },
  { q: "Quale variante di Loki è una donna nella serie TV Loki?", a: "Sylvie", d: 5 },
  { q: "Come si chiama il figlio di Wanda e Vision che ha superpoteri di velocità?", a: "Tommy (Speed)", d: 6 },
  { q: "Quale film del MCU ha incassato di più al botteghino mondiale?", a: "Avengers: Endgame", d: 4 },
  { q: "Chi è il villain di Doctor Strange nel Multiverso della Follia?", a: "Scarlet Witch (Wanda Maximoff)", d: 5 },
  { q: "Come si chiama il nano che forgia Stormbreaker?", a: "Eitri", d: 7 },
  { q: "In quale dimensione è intrappolato Doctor Strange da Dormammu?", a: "Dimensione Oscura", d: 6 },
  { q: "Qual è il nome del programma con cui Wanda crea la realtà alternativa in WandaVision?", a: "L'Hex", d: 7 },
  { q: "Chi è il creatore degli Eterni nel MCU?", a: "Arishem il Giudice (un Celestiale)", d: 8 },
  { q: "Quanti snap vengono fatti con il Guanto dell'Infinito in Endgame?", a: "Tre (Thanos, Hulk, Tony)", d: 7 },
  { q: "Come si chiama il pianeta dove Thanos si ritira dopo lo Snap?", a: "Il Giardino", d: 8 },
];

// ─── STORIA ────────────────────────────────────────────
const storiaFacts: { q: string; a: string; d: number }[] = [
  { q: "In che anno è caduto il Muro di Berlino?", a: "1989", d: 1 },
  { q: "In che anno Cristoforo Colombo raggiunse l'America?", a: "1492", d: 1 },
  { q: "Chi era il primo imperatore romano?", a: "Augusto (Ottaviano)", d: 2 },
  { q: "Quale civiltà costruì Machu Picchu?", a: "Gli Inca", d: 2 },
  { q: "In che anno iniziò la Prima Guerra Mondiale?", a: "1914", d: 2 },
  { q: "Chi è stato l'ultimo Re d'Italia?", a: "Umberto II", d: 4 },
  { q: "Chi ha scritto 'Il Principe'?", a: "Niccolò Machiavelli", d: 3 },
  { q: "In che anno fu fondata Roma secondo la tradizione?", a: "753 a.C.", d: 3 },
  { q: "Chi guidò gli Ebrei fuori dall'Egitto secondo la Bibbia?", a: "Mosè", d: 2 },
  { q: "In quale anno avvenne la Rivoluzione Francese?", a: "1789", d: 2 },
  { q: "Chi era il dittatore della Germania nazista?", a: "Adolf Hitler", d: 1 },
  { q: "Quale impero fu sconfitto nella Battaglia di Waterloo?", a: "L'Impero francese di Napoleone", d: 3 },
  { q: "In che anno l'Italia divenne una repubblica?", a: "1946", d: 3 },
  { q: "Chi fu il primo presidente degli Stati Uniti?", a: "George Washington", d: 1 },
  { q: "Quale trattato pose fine alla Prima Guerra Mondiale?", a: "Trattato di Versailles", d: 4 },
  { q: "Chi fu assassinato il 15 marzo 44 a.C.?", a: "Giulio Cesare", d: 3 },
  { q: "In che anno fu firmata la Costituzione Italiana?", a: "1947 (entrata in vigore 1948)", d: 4 },
  { q: "Quale civiltà inventò la scrittura cuneiforme?", a: "I Sumeri", d: 5 },
  { q: "Chi guidò la Marcia su Roma nel 1922?", a: "Benito Mussolini", d: 3 },
  { q: "In quale anno cadde l'Impero Romano d'Occidente?", a: "476 d.C.", d: 4 },
  { q: "Chi scoprì la penicillina?", a: "Alexander Fleming", d: 3 },
  { q: "In quale battaglia Napoleone fu definitivamente sconfitto?", a: "Waterloo (1815)", d: 3 },
  { q: "Quale faraone è associato alla costruzione della Grande Piramide di Giza?", a: "Cheope (Khufu)", d: 5 },
  { q: "Chi era il leader dell'URSS durante la Seconda Guerra Mondiale?", a: "Iosif Stalin", d: 3 },
  { q: "In che anno fu abolita la schiavitù negli USA?", a: "1865 (XIII Emendamento)", d: 5 },
  { q: "Quale imperatore romano legalizzò il Cristianesimo?", a: "Costantino I (Editto di Milano, 313)", d: 5 },
  { q: "Chi fu il primo uomo a camminare sulla Luna?", a: "Neil Armstrong", d: 1 },
  { q: "In quale anno fu bombardata Pearl Harbor?", a: "1941", d: 4 },
  { q: "Quale popolo costruì i nuraghi in Sardegna?", a: "I Nuragici", d: 6 },
  { q: "In che anno Gutenberg inventò la stampa a caratteri mobili?", a: "Circa 1440", d: 6 },
  { q: "Chi era Hammurabi?", a: "Re di Babilonia autore di uno dei primi codici di leggi", d: 6 },
  { q: "In quale anno iniziò la Guerra dei Cent'anni?", a: "1337", d: 7 },
  { q: "Quale filosofo greco fu condannato a bere la cicuta?", a: "Socrate", d: 4 },
  { q: "Chi fu l'ultimo imperatore romano d'Occidente?", a: "Romolo Augustolo", d: 7 },
  { q: "In che anno la Cina divenne una repubblica popolare?", a: "1949", d: 5 },
  { q: "Quale popolo fondò Cartagine?", a: "I Fenici", d: 6 },
];

// ─── SCIENZA ───────────────────────────────────────────
const scienzaFacts: { q: string; a: string; d: number }[] = [
  { q: "Qual è il simbolo chimico dell'acqua?", a: "H₂O", d: 1 },
  { q: "Qual è la velocità della luce nel vuoto?", a: "Circa 300.000 km/s", d: 2 },
  { q: "Quanti cromosomi ha l'essere umano?", a: "46", d: 2 },
  { q: "Chi ha formulato la teoria della relatività?", a: "Albert Einstein", d: 1 },
  { q: "Qual è l'elemento chimico più abbondante nell'universo?", a: "Idrogeno", d: 2 },
  { q: "Cos'è il DNA?", a: "Acido desossiribonucleico, portatore dell'informazione genetica", d: 2 },
  { q: "Qual è l'unità di misura della forza?", a: "Newton (N)", d: 2 },
  { q: "Quale scienziato scoprì la gravità osservando una mela?", a: "Isaac Newton", d: 1 },
  { q: "Qual è l'organo più grande del corpo umano?", a: "La pelle", d: 2 },
  { q: "Cos'è la fotosintesi?", a: "Il processo con cui le piante convertono luce solare in energia", d: 2 },
  { q: "Qual è il numero atomico dell'ossigeno?", a: "8", d: 3 },
  { q: "Cosa studia la tassonomia?", a: "La classificazione degli esseri viventi", d: 4 },
  { q: "Quale particella subatomica ha carica negativa?", a: "L'elettrone", d: 3 },
  { q: "Cos'è un buco nero?", a: "Una regione dello spazio con gravità così forte che nulla può sfuggire", d: 3 },
  { q: "Quale gas compone circa il 78% dell'atmosfera terrestre?", a: "Azoto (N₂)", d: 3 },
  { q: "Chi ha scoperto la struttura a doppia elica del DNA?", a: "Watson e Crick (e Rosalind Franklin)", d: 4 },
  { q: "Cos'è l'entropia?", a: "La misura del disordine di un sistema termodinamico", d: 5 },
  { q: "Quale legge afferma che 'ad ogni azione corrisponde una reazione uguale e contraria'?", a: "Terza legge di Newton", d: 3 },
  { q: "Qual è la costante di Avogadro?", a: "6,022 × 10²³", d: 5 },
  { q: "Cos'è la mitosi?", a: "La divisione cellulare che produce due cellule identiche", d: 3 },
  { q: "Quale elemento ha simbolo Fe?", a: "Ferro", d: 2 },
  { q: "Cos'è la fusione nucleare?", a: "L'unione di nuclei atomici leggeri che libera energia", d: 4 },
  { q: "Quale scienziato formulò le leggi dell'ereditarietà?", a: "Gregor Mendel", d: 4 },
  { q: "Cos'è un isotopo?", a: "Atomi dello stesso elemento con diverso numero di neutroni", d: 5 },
  { q: "Qual è la formula dell'energia cinetica?", a: "½mv²", d: 4 },
  { q: "Cos'è l'effetto Doppler?", a: "Il cambiamento di frequenza di un'onda dovuto al moto relativo", d: 5 },
  { q: "Quale legge descrive la relazione tra pressione e volume di un gas?", a: "Legge di Boyle", d: 5 },
  { q: "Cos'è un quark?", a: "Una particella elementare costituente di protoni e neutroni", d: 6 },
  { q: "Qual è la teoria che unifica elettromagnetismo e forza debole?", a: "Teoria elettrodebole", d: 7 },
  { q: "Cos'è la costante di Planck?", a: "Una costante fondamentale (h ≈ 6,626 × 10⁻³⁴ J·s) che lega energia e frequenza", d: 7 },
  { q: "Quale principio afferma che non si possono conoscere simultaneamente posizione e quantità di moto?", a: "Principio di indeterminazione di Heisenberg", d: 6 },
];

// ─── SPAZIO ────────────────────────────────────────────
const spazioFacts: { q: string; a: string; d: number }[] = [
  { q: "Qual è il pianeta più grande del Sistema Solare?", a: "Giove", d: 1 },
  { q: "Qual è il pianeta più vicino al Sole?", a: "Mercurio", d: 1 },
  { q: "Quanti pianeti ha il Sistema Solare?", a: "Otto", d: 1 },
  { q: "Qual è il satellite naturale della Terra?", a: "La Luna", d: 1 },
  { q: "Quale pianeta è noto come il Pianeta Rosso?", a: "Marte", d: 1 },
  { q: "In che anno l'uomo è andato sulla Luna per la prima volta?", a: "1969", d: 2 },
  { q: "Cos'è una stella cadente?", a: "Una meteora, frammento che brucia nell'atmosfera", d: 2 },
  { q: "Qual è la stella più vicina alla Terra?", a: "Il Sole", d: 1 },
  { q: "Quale pianeta ha gli anelli più visibili?", a: "Saturno", d: 1 },
  { q: "Cos'è la Via Lattea?", a: "La nostra galassia", d: 2 },
  { q: "Quanto dista la Terra dal Sole in media?", a: "Circa 150 milioni di km (1 UA)", d: 3 },
  { q: "Cos'è un'unità astronomica?", a: "La distanza media Terra-Sole", d: 3 },
  { q: "Quale sonda ha lasciato il Sistema Solare per prima?", a: "Voyager 1", d: 4 },
  { q: "Cos'è una supernova?", a: "L'esplosione di una stella massiccia alla fine della sua vita", d: 3 },
  { q: "Qual è il monte più alto del Sistema Solare?", a: "Monte Olimpo su Marte", d: 4 },
  { q: "Cos'è la fascia di Kuiper?", a: "Una regione oltre Nettuno ricca di corpi ghiacciati", d: 5 },
  { q: "Quale telescopio spaziale è stato lanciato nel 2021?", a: "James Webb Space Telescope", d: 4 },
  { q: "Cos'è un anno luce?", a: "La distanza percorsa dalla luce in un anno (~9,46 trilioni di km)", d: 3 },
  { q: "Quale pianeta ruota su un asse quasi orizzontale?", a: "Urano", d: 5 },
  { q: "Cos'è la radiazione cosmica di fondo?", a: "La radiazione residua del Big Bang", d: 6 },
  { q: "Quale legge descrive il moto dei pianeti attorno al Sole?", a: "Le leggi di Keplero", d: 5 },
  { q: "Cos'è un pulsar?", a: "Una stella di neutroni in rapida rotazione che emette radiazioni", d: 6 },
  { q: "Qual è il diametro approssimativo della Via Lattea?", a: "Circa 100.000 anni luce", d: 6 },
  { q: "Quale missione portò il primo rover su Marte?", a: "Mars Pathfinder (Sojourner, 1997)", d: 7 },
  { q: "Cos'è la materia oscura?", a: "Materia che non emette luce ma esercita gravità, ~27% dell'universo", d: 7 },
];

// ─── GEOGRAFIA ─────────────────────────────────────────
const geografiaFacts: { q: string; a: string; d: number }[] = [
  { q: "Qual è la capitale della Francia?", a: "Parigi", d: 1 },
  { q: "Qual è il fiume più lungo del mondo?", a: "Il Nilo (o il Rio delle Amazzoni)", d: 2 },
  { q: "Qual è il continente più grande?", a: "Asia", d: 1 },
  { q: "In quale continente si trova l'Egitto?", a: "Africa", d: 1 },
  { q: "Qual è la montagna più alta del mondo?", a: "Monte Everest", d: 1 },
  { q: "Qual è la capitale dell'Australia?", a: "Canberra", d: 3 },
  { q: "Quanti oceani ci sono?", a: "Cinque", d: 2 },
  { q: "Qual è il deserto più grande del mondo?", a: "Il Sahara (o l'Antartide come deserto freddo)", d: 3 },
  { q: "Quale Paese ha più abitanti al mondo?", a: "India (dal 2023)", d: 3 },
  { q: "Qual è la capitale del Canada?", a: "Ottawa", d: 3 },
  { q: "In quale Paese si trova il Machu Picchu?", a: "Perù", d: 2 },
  { q: "Qual è il lago più grande d'Italia?", a: "Lago di Garda", d: 3 },
  { q: "Quale Paese ha la forma di uno stivale?", a: "Italia", d: 1 },
  { q: "Qual è la capitale del Brasile?", a: "Brasilia", d: 3 },
  { q: "Quale mare separa l'Italia dalla Croazia?", a: "Mar Adriatico", d: 2 },
  { q: "Qual è il vulcano più alto d'Europa?", a: "Etna", d: 3 },
  { q: "Qual è la capitale della Mongolia?", a: "Ulaanbaatar", d: 5 },
  { q: "In quale oceano si trova il Madagascar?", a: "Oceano Indiano", d: 3 },
  { q: "Quale nazione ha più isole al mondo?", a: "Svezia", d: 6 },
  { q: "Qual è la capitale del Myanmar?", a: "Naypyidaw", d: 7 },
  { q: "Qual è il punto più profondo degli oceani?", a: "Fossa delle Marianne (Challenger Deep)", d: 4 },
  { q: "Quale Paese è attraversato sia dall'Equatore che dal Meridiano di Greenwich?", a: "Ghana (approssimativamente)", d: 7 },
  { q: "Qual è il fiume più lungo d'Europa?", a: "Volga", d: 4 },
  { q: "Quale catena montuosa separa Europa e Asia?", a: "Monti Urali", d: 4 },
  { q: "Qual è lo Stato più piccolo del mondo?", a: "Città del Vaticano", d: 2 },
];

// ─── ITALIANO ──────────────────────────────────────────
const italianoFacts: { q: string; a: string; d: number }[] = [
  { q: "Chi ha scritto la Divina Commedia?", a: "Dante Alighieri", d: 1 },
  { q: "Qual è il plurale di 'uomo'?", a: "Uomini", d: 1 },
  { q: "Cos'è un sinonimo?", a: "Una parola con significato simile a un'altra", d: 1 },
  { q: "Chi ha scritto 'I Promessi Sposi'?", a: "Alessandro Manzoni", d: 2 },
  { q: "Qual è il contrario di 'effimero'?", a: "Duraturo/Eterno", d: 4 },
  { q: "Cos'è una metafora?", a: "Una figura retorica che trasferisce il significato da un termine a un altro", d: 2 },
  { q: "Quante sono le vocali nella lingua italiana?", a: "Cinque (a, e, i, o, u)", d: 1 },
  { q: "Cos'è un ossimoro?", a: "L'accostamento di due termini contraddittori", d: 4 },
  { q: "Chi ha scritto 'Il Gattopardo'?", a: "Giuseppe Tomasi di Lampedusa", d: 4 },
  { q: "Cos'è l'anacoluto?", a: "Una rottura nella costruzione sintattica della frase", d: 6 },
  { q: "Qual è il tempo verbale di 'avessi parlato'?", a: "Congiuntivo trapassato", d: 5 },
  { q: "Chi ha scritto 'Se questo è un uomo'?", a: "Primo Levi", d: 3 },
  { q: "Cos'è un endecasillabo?", a: "Un verso di undici sillabe", d: 4 },
  { q: "Cos'è la sineddoche?", a: "Figura retorica che usa la parte per il tutto o viceversa", d: 5 },
  { q: "Chi ha scritto 'L'Infinito'?", a: "Giacomo Leopardi", d: 2 },
  { q: "Qual è la differenza tra 'che' congiunzione e 'che' pronome relativo?", a: "La congiunzione introduce subordinate, il pronome relativo sostituisce un nome", d: 5 },
  { q: "Chi ha fondato il movimento del Futurismo letterario?", a: "Filippo Tommaso Marinetti", d: 5 },
  { q: "Cos'è un chiasmo?", a: "Disposizione incrociata di elementi (AB-BA)", d: 6 },
  { q: "Chi ha scritto 'Le Operette Morali'?", a: "Giacomo Leopardi", d: 4 },
  { q: "Cos'è il correlativo oggettivo in Montale?", a: "Un oggetto/situazione che esprime un'emozione interna", d: 7 },
  { q: "Chi è l'autore di 'Uno, Nessuno e Centomila'?", a: "Luigi Pirandello", d: 3 },
  { q: "Cos'è l'enjambement?", a: "La continuazione del senso di un verso nel successivo", d: 4 },
];

// ─── MATEMATICA ────────────────────────────────────────
const matematicaGenerators: QuestionGenerator[] = [
  (d) => {
    const a = randInt(2, 5 + d * 3); const b = randInt(2, 5 + d * 3);
    return { question: `Quanto fa ${a} × ${b}?`, answer: `${a * b}`, difficulty: d };
  },
  (d) => {
    const n = randInt(10, 50 + d * 20);
    return { question: `Qual è la radice quadrata di ${n * n}?`, answer: `${n}`, difficulty: d };
  },
  (d) => {
    const base = randInt(2, 4 + d); const exp = randInt(2, 2 + Math.floor(d / 3));
    return { question: `Quanto fa ${base}^${exp}?`, answer: `${Math.pow(base, exp)}`, difficulty: d };
  },
  (d) => {
    const nums = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
    const n = nums[randInt(0, Math.min(nums.length - 1, 3 + d))];
    return { question: `${n} è un numero primo?`, answer: "Sì", difficulty: d };
  },
  (d) => {
    const a = randInt(10 * d, 20 * d); const b = randInt(5, 10 * d);
    return { question: `Quanto fa ${a} + ${b}?`, answer: `${a + b}`, difficulty: d };
  },
  (d) => {
    const perc = pick([10, 15, 20, 25, 30, 50]); const of_ = randInt(2, 5) * 100;
    return { question: `Qual è il ${perc}% di ${of_}?`, answer: `${(perc * of_) / 100}`, difficulty: d };
  },
  (d) => {
    const a = randInt(2, 5 + d); const b = randInt(2, 5 + d);
    return { question: `Qual è il MCD di ${a * 6} e ${b * 6}?`, answer: `${gcd(a * 6, b * 6)}`, difficulty: d };
  },
  (_d) => {
    const shapes = [
      { name: "triangolo con base 10 e altezza 6", a: "30" },
      { name: "cerchio con raggio 7 (arrotondato)", a: "≈153.94" },
      { name: "rettangolo 8×5", a: "40" },
      { name: "quadrato con lato 9", a: "81" },
      { name: "trapezio con basi 6 e 10 e altezza 4", a: "32" },
    ];
    const s = pick(shapes);
    return { question: `Qual è l'area di un ${s.name}?`, answer: s.a, difficulty: _d };
  },
];

const matematicaFacts: { q: string; a: string; d: number }[] = [
  { q: "Cos'è il pi greco?", a: "Il rapporto tra la circonferenza e il diametro di un cerchio (≈3,14159)", d: 3 },
  { q: "Cos'è un numero irrazionale?", a: "Un numero che non può essere espresso come rapporto tra due interi", d: 4 },
  { q: "Quale matematico è famoso per l'ultimo teorema?", a: "Pierre de Fermat", d: 5 },
  { q: "Cos'è la successione di Fibonacci?", a: "Una sequenza in cui ogni numero è la somma dei due precedenti (1,1,2,3,5,8...)", d: 4 },
  { q: "Cos'è un logaritmo?", a: "L'esponente a cui elevare la base per ottenere un dato numero", d: 5 },
  { q: "Qual è la formula dell'area del cerchio?", a: "πr²", d: 2 },
  { q: "Cos'è il teorema di Pitagora?", a: "In un triangolo rettangolo: a² + b² = c²", d: 2 },
  { q: "Cos'è una matrice?", a: "Una tabella rettangolare di numeri organizzata in righe e colonne", d: 5 },
  { q: "Cos'è un numero complesso?", a: "Un numero nella forma a + bi, dove i è l'unità immaginaria", d: 6 },
  { q: "Qual è la derivata di x²?", a: "2x", d: 5 },
];

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

// ─── SPORT ─────────────────────────────────────────────
const sportFacts: { q: string; a: string; d: number }[] = [
  { q: "Quanti giocatori ci sono in una squadra di calcio?", a: "11", d: 1 },
  { q: "In quale sport si usa la racchetta e il volano?", a: "Badminton", d: 2 },
  { q: "Chi ha vinto più Palloni d'Oro?", a: "Lionel Messi", d: 2 },
  { q: "Quanto dura una partita di calcio regolamentare?", a: "90 minuti (due tempi da 45)", d: 1 },
  { q: "In quale Paese si sono svolte le Olimpiadi del 2020?", a: "Giappone (Tokyo, nel 2021)", d: 2 },
  { q: "Qual è lo sport nazionale del Giappone?", a: "Sumo", d: 3 },
  { q: "Chi detiene il record dei 100 metri piani?", a: "Usain Bolt (9.58s)", d: 3 },
  { q: "Quanti set servono per vincere una partita di tennis maschile al Grand Slam?", a: "3 su 5", d: 3 },
  { q: "In quale sport si esegue una 'schiacciata'?", a: "Pallavolo (o Tennis/Badminton)", d: 2 },
  { q: "Quale squadra di calcio ha vinto più Champions League?", a: "Real Madrid", d: 3 },
  { q: "In quale anno l'Italia ha vinto l'ultimo Mondiale di calcio?", a: "2006", d: 2 },
  { q: "Chi è il marcatore più prolifico nella storia della Serie A?", a: "Silvio Piola", d: 5 },
  { q: "Quale tennista ha vinto più titoli del Grande Slam?", a: "Novak Djokovic", d: 3 },
  { q: "In quale sport si compete nel Tour de France?", a: "Ciclismo", d: 1 },
  { q: "Quanti punti vale un touchdown nel football americano?", a: "6", d: 3 },
  { q: "Quale Paese ha ospitato i primi Giochi Olimpici moderni?", a: "Grecia (Atene, 1896)", d: 4 },
  { q: "Chi è il nuotatore più decorato nella storia olimpica?", a: "Michael Phelps", d: 3 },
  { q: "In quale sport si usa il termine 'birdie'?", a: "Golf", d: 3 },
  { q: "Quale squadra NBA ha vinto più titoli?", a: "Boston Celtics", d: 4 },
  { q: "Cos'è l'heptathlon?", a: "Una disciplina di atletica con 7 prove", d: 5 },
  { q: "Chi è l'allenatore più vincente nella storia del calcio?", a: "Sir Alex Ferguson", d: 4 },
  { q: "Quale pilota di F1 ha vinto più campionati mondiali?", a: "Lewis Hamilton e Michael Schumacher (7 ciascuno)", d: 4 },
  { q: "In quale anno si tennero le prime Olimpiadi invernali?", a: "1924 (Chamonix)", d: 6 },
  { q: "Cosa significa il termine 'hat-trick' nel calcio?", a: "Tre gol segnati dallo stesso giocatore nella stessa partita", d: 2 },
];

// ─── FILM ──────────────────────────────────────────────
const filmFacts: { q: string; a: string; d: number }[] = [
  { q: "Chi è il regista di 'Titanic'?", a: "James Cameron", d: 1 },
  { q: "In quale anno è uscito il primo film di Star Wars?", a: "1977", d: 2 },
  { q: "Quale attore interpreta Jack Sparrow?", a: "Johnny Depp", d: 1 },
  { q: "Quale film ha vinto l'Oscar come miglior film nel 1994?", a: "Forrest Gump", d: 3 },
  { q: "Chi è il regista di 'Pulp Fiction'?", a: "Quentin Tarantino", d: 2 },
  { q: "In quale film si dice 'Io sono tuo padre'?", a: "Star Wars: L'Impero colpisce ancora", d: 1 },
  { q: "Quale attrice interpreta Katniss Everdeen?", a: "Jennifer Lawrence", d: 2 },
  { q: "Chi è il regista della trilogia de Il Signore degli Anelli?", a: "Peter Jackson", d: 2 },
  { q: "Quale film d'animazione Pixar parla di emozioni personificate?", a: "Inside Out", d: 2 },
  { q: "Chi interpreta il Joker nel film del 2019?", a: "Joaquin Phoenix", d: 2 },
  { q: "Quale film ha la frase 'Francamente, me ne infischio'?", a: "Via col vento", d: 3 },
  { q: "Chi è il regista di 'Inception'?", a: "Christopher Nolan", d: 2 },
  { q: "Quale film ha vinto 11 Oscar come Il Signore degli Anelli: Il ritorno del re?", a: "Ben-Hur e Titanic", d: 5 },
  { q: "Chi interpreta Neo in Matrix?", a: "Keanu Reeves", d: 1 },
  { q: "Quale film di Kubrick è ambientato nello spazio?", a: "2001: Odissea nello spazio", d: 3 },
  { q: "Chi è il compositore delle colonne sonore di molti film di Spielberg?", a: "John Williams", d: 3 },
  { q: "In quale film Humphrey Bogart dice 'Sarà sempre il nostro Parigi'?", a: "Casablanca", d: 4 },
  { q: "Chi ha diretto 'Parasite' (2019)?", a: "Bong Joon-ho", d: 4 },
  { q: "Quale regista italiano ha vinto 3 Oscar?", a: "Federico Fellini (onorario e per film)", d: 5 },
  { q: "In quale anno è uscito 'Il Padrino'?", a: "1972", d: 3 },
  { q: "Chi è il regista di 'Schindler's List'?", a: "Steven Spielberg", d: 2 },
  { q: "Quale film ha il famoso dialogo 'Tu non puoi reggere la verità!'?", a: "Codice d'onore (A Few Good Men)", d: 5 },
  { q: "Chi interpreta Forrest Gump?", a: "Tom Hanks", d: 1 },
  { q: "Quale film italiano vinse l'Oscar come miglior film straniero nel 1999?", a: "La vita è bella", d: 3 },
];

// ─── SERIE TV ──────────────────────────────────────────
const serieTvFacts: { q: string; a: string; d: number }[] = [
  { q: "Come si chiama il protagonista di Breaking Bad?", a: "Walter White", d: 1 },
  { q: "In quale serie TV si combatte per il Trono di Spade?", a: "Game of Thrones", d: 1 },
  { q: "Quante stagioni ha Friends?", a: "10", d: 2 },
  { q: "Come si chiama il bar di How I Met Your Mother?", a: "MacLaren's Pub", d: 3 },
  { q: "Chi è il creatore di Stranger Things?", a: "I fratelli Duffer", d: 3 },
  { q: "In quale serie un professore organizza una rapina alla Zecca di Spagna?", a: "La Casa di Carta", d: 1 },
  { q: "Quale attore interpreta Sheldon Cooper in The Big Bang Theory?", a: "Jim Parsons", d: 2 },
  { q: "In quale serie TV si dice 'Winter is coming'?", a: "Game of Thrones", d: 1 },
  { q: "Come si chiama il protagonista di Narcos?", a: "Pablo Escobar (interpretato da Wagner Moura)", d: 2 },
  { q: "Quale serie Netflix è ambientata nel mondo degli scacchi?", a: "La regina degli scacchi (The Queen's Gambit)", d: 3 },
  { q: "In quale anno è iniziata la serie Lost?", a: "2004", d: 4 },
  { q: "Chi è il creatore di Black Mirror?", a: "Charlie Brooker", d: 4 },
  { q: "Quale serie HBO racconta la storia della famiglia Soprano?", a: "I Soprano (The Sopranos)", d: 2 },
  { q: "In quale serie un chimico produce metanfetamina nel deserto?", a: "Breaking Bad", d: 1 },
  { q: "Quale serie anime è la più lunga in termini di episodi?", a: "Sazae-san (o One Piece tra le più note)", d: 5 },
  { q: "Come si chiama il protagonista di Peaky Blinders?", a: "Thomas Shelby", d: 2 },
  { q: "Quale serie è ambientata nella prigione di Wentworth/Fox River?", a: "Prison Break", d: 2 },
  { q: "Chi interpreta Eleven in Stranger Things?", a: "Millie Bobby Brown", d: 2 },
  { q: "Quale serie racconta la vita alla corte di Luigi XIV a Versailles?", a: "Versailles", d: 5 },
  { q: "In quale serie un gioco per bambini diventa mortale?", a: "Squid Game", d: 1 },
  { q: "Chi ha creato la serie The Office (versione americana)?", a: "Greg Daniels (adattamento di Ricky Gervais e Stephen Merchant)", d: 5 },
  { q: "Quale serie HBO ha come protagonista un parco a tema con androidi?", a: "Westworld", d: 3 },
  { q: "Quante stagioni ha Breaking Bad?", a: "5", d: 3 },
];

// ─── MUSICA ────────────────────────────────────────────
const musicaFacts: { q: string; a: string; d: number }[] = [
  { q: "Chi ha composto la Nona Sinfonia?", a: "Ludwig van Beethoven", d: 2 },
  { q: "Quale band ha cantato 'Bohemian Rhapsody'?", a: "Queen", d: 1 },
  { q: "Chi è il 'Re del Pop'?", a: "Michael Jackson", d: 1 },
  { q: "Quale strumento ha 88 tasti?", a: "Il pianoforte", d: 1 },
  { q: "Chi ha cantato 'Imagine'?", a: "John Lennon", d: 1 },
  { q: "Quante corde ha una chitarra classica?", a: "Sei", d: 1 },
  { q: "Quale cantante italiana è nota per 'La solitudine'?", a: "Laura Pausini", d: 2 },
  { q: "Chi è il cantante dei Rolling Stones?", a: "Mick Jagger", d: 2 },
  { q: "Quale compositore era sordo?", a: "Ludwig van Beethoven", d: 2 },
  { q: "Quale genere musicale è nato a New Orleans?", a: "Jazz", d: 3 },
  { q: "Chi ha composto 'Le Quattro Stagioni'?", a: "Antonio Vivaldi", d: 2 },
  { q: "Quale cantautore italiano ha scritto 'La canzone di Marinella'?", a: "Fabrizio De André", d: 3 },
  { q: "Cos'è un'ottava in musica?", a: "L'intervallo tra due note con la stessa denominazione", d: 3 },
  { q: "Quale festival musicale italiano si tiene a Sanremo?", a: "Il Festival della Canzone Italiana", d: 1 },
  { q: "Chi è il compositore de 'Il Barbiere di Siviglia'?", a: "Gioachino Rossini", d: 4 },
  { q: "Quale rapper americano è anche noto come Slim Shady?", a: "Eminem", d: 2 },
  { q: "Quale nota musicale segue il 'Sol'?", a: "La", d: 1 },
  { q: "Quanti movimenti ha tipicamente una sinfonia classica?", a: "Quattro", d: 5 },
  { q: "Chi ha composto l'opera 'Aida'?", a: "Giuseppe Verdi", d: 3 },
  { q: "Cos'è il contrappunto?", a: "La tecnica di combinare linee melodiche indipendenti", d: 6 },
  { q: "Quale cantante ha l'album più venduto di sempre ('Thriller')?", a: "Michael Jackson", d: 2 },
  { q: "Chi ha composto 'La Traviata'?", a: "Giuseppe Verdi", d: 3 },
  { q: "Quale musicista jazz è famoso per la tromba e 'What a Wonderful World'?", a: "Louis Armstrong", d: 3 },
  { q: "Cos'è la dodecafonia?", a: "Una tecnica compositiva che usa tutti i 12 toni della scala cromatica", d: 7 },
];

// ─── TECNOLOGIA ────────────────────────────────────────
const tecnologiaFacts: { q: string; a: string; d: number }[] = [
  { q: "Chi ha fondato Apple?", a: "Steve Jobs, Steve Wozniak e Ronald Wayne", d: 1 },
  { q: "Cosa significa 'HTML'?", a: "HyperText Markup Language", d: 2 },
  { q: "In quale anno è stato lanciato il primo iPhone?", a: "2007", d: 2 },
  { q: "Cosa significa 'CPU'?", a: "Central Processing Unit", d: 2 },
  { q: "Chi è il fondatore di Microsoft?", a: "Bill Gates e Paul Allen", d: 1 },
  { q: "Cosa significa 'URL'?", a: "Uniform Resource Locator", d: 3 },
  { q: "Quale azienda ha creato Android?", a: "Google (acquisita da Android Inc.)", d: 2 },
  { q: "In quale anno è stato fondato Facebook?", a: "2004", d: 2 },
  { q: "Cos'è un algoritmo?", a: "Una sequenza finita di istruzioni per risolvere un problema", d: 2 },
  { q: "Cosa significa 'AI'?", a: "Artificial Intelligence (Intelligenza Artificiale)", d: 1 },
  { q: "Chi ha inventato il World Wide Web?", a: "Tim Berners-Lee", d: 3 },
  { q: "Cos'è la blockchain?", a: "Un registro distribuito e immutabile di transazioni", d: 4 },
  { q: "Quale linguaggio di programmazione è il più usato al mondo?", a: "JavaScript (o Python)", d: 3 },
  { q: "Cos'è il cloud computing?", a: "L'uso di risorse informatiche remote tramite internet", d: 3 },
  { q: "In quale anno è stato lanciato ChatGPT?", a: "2022", d: 3 },
  { q: "Chi ha fondato Tesla?", a: "Elon Musk, Martin Eberhard, Marc Tarpenning, JB Straubel, Ian Wright", d: 4 },
  { q: "Cos'è il machine learning?", a: "Un ramo dell'AI dove i sistemi imparano dai dati", d: 4 },
  { q: "Cos'è un API?", a: "Application Programming Interface, un'interfaccia per comunicare tra software", d: 4 },
  { q: "Quale azienda produce i chip M1 e M2?", a: "Apple", d: 3 },
  { q: "Cos'è la crittografia end-to-end?", a: "Un sistema dove solo mittente e destinatario possono leggere i messaggi", d: 5 },
  { q: "Cos'è un container Docker?", a: "Un ambiente isolato e leggero per eseguire applicazioni", d: 6 },
  { q: "Quale protocollo è alla base del Web?", a: "HTTP/HTTPS", d: 3 },
  { q: "Cos'è la legge di Moore?", a: "Il numero di transistor raddoppia circa ogni 2 anni", d: 5 },
  { q: "Quale azienda ha creato il linguaggio Rust?", a: "Mozilla", d: 6 },
];

// ─── CULTURA POP ───────────────────────────────────────
const culturaPopFacts: { q: string; a: string; d: number }[] = [
  { q: "Chi è il creatore dei Simpson?", a: "Matt Groening", d: 2 },
  { q: "Quale social media usa il logo di un uccello (fino al 2023)?", a: "Twitter", d: 1 },
  { q: "Chi è il personaggio principale di Harry Potter?", a: "Harry Potter", d: 1 },
  { q: "Quale gioco da tavolo ha proprietà come Parco della Vittoria?", a: "Monopoly", d: 1 },
  { q: "Chi interpreta Harry Potter nei film?", a: "Daniel Radcliffe", d: 1 },
  { q: "Quale saga ha come protagonisti Frodo e Gandalf?", a: "Il Signore degli Anelli", d: 1 },
  { q: "Cos'è un meme?", a: "Un contenuto virale che si diffonde in internet", d: 1 },
  { q: "Quale YouTuber svedese è uno dei più seguiti al mondo?", a: "PewDiePie (Felix Kjellberg)", d: 3 },
  { q: "Chi ha creato i personaggi di Topolino e Paperino?", a: "Walt Disney", d: 1 },
  { q: "Quale piattaforma di streaming ha il logo rosso con la 'N'?", a: "Netflix", d: 1 },
  { q: "In quale saga un anello dona il potere dell'invisibilità?", a: "Il Signore degli Anelli", d: 2 },
  { q: "Chi è il personaggio giapponese con i baffi e il cappello rosso?", a: "Super Mario", d: 1 },
  { q: "Quale artista ha dipinto la Gioconda?", a: "Leonardo da Vinci", d: 1 },
  { q: "Quale serie di libri parla di una ragazza che combatte in un'arena?", a: "Hunger Games", d: 2 },
  { q: "Chi ha creato il manga 'One Piece'?", a: "Eiichiro Oda", d: 3 },
  { q: "Quale app di video brevi è di proprietà di ByteDance?", a: "TikTok", d: 2 },
  { q: "Chi è il creatore di Pokémon?", a: "Satoshi Tajiri", d: 4 },
  { q: "Quale franchise ha generato più incassi nella storia del cinema?", a: "MCU (Marvel Cinematic Universe)", d: 3 },
  { q: "Quale band coreana è nota per 'Dynamite' e 'Butter'?", a: "BTS", d: 2 },
  { q: "In quale anno è nato YouTube?", a: "2005", d: 3 },
  { q: "Chi ha scritto la saga di Harry Potter?", a: "J.K. Rowling", d: 1 },
  { q: "Quale personaggio dei Simpson lavora alla centrale nucleare?", a: "Homer Simpson", d: 1 },
];

// ─── ARTE ──────────────────────────────────────────────
const arteFacts: { q: string; a: string; d: number }[] = [
  { q: "Chi ha dipinto la Gioconda?", a: "Leonardo da Vinci", d: 1 },
  { q: "In quale museo si trova la Gioconda?", a: "Louvre (Parigi)", d: 2 },
  { q: "Chi ha scolpito il David di Firenze?", a: "Michelangelo", d: 1 },
  { q: "Quale artista è famoso per i girasoli?", a: "Vincent van Gogh", d: 2 },
  { q: "Cos'è il Rinascimento?", a: "Un movimento culturale e artistico nato in Italia nel XIV-XVI secolo", d: 2 },
  { q: "Chi ha dipinto la Cappella Sistina?", a: "Michelangelo", d: 1 },
  { q: "Quale movimento artistico include Picasso e il cubismo?", a: "Le Avanguardie del '900", d: 3 },
  { q: "Chi ha dipinto 'La notte stellata'?", a: "Vincent van Gogh", d: 2 },
  { q: "Cos'è l'Impressionismo?", a: "Movimento artistico francese del XIX secolo che privilegia luce e colore", d: 3 },
  { q: "Chi è l'autore di 'La Persistenza della Memoria' (gli orologi molli)?", a: "Salvador Dalí", d: 3 },
  { q: "In quale città si trova la Galleria degli Uffizi?", a: "Firenze", d: 2 },
  { q: "Chi ha dipinto 'Guernica'?", a: "Pablo Picasso", d: 3 },
  { q: "Cos'è il Barocco?", a: "Stile artistico del XVII-XVIII sec., caratterizzato da drammaticità e ornamento", d: 4 },
  { q: "Chi ha progettato la cupola del Duomo di Firenze?", a: "Filippo Brunelleschi", d: 4 },
  { q: "Quale artista è noto per le sue sculture di ballerine?", a: "Edgar Degas", d: 4 },
  { q: "Cos'è il Dadaismo?", a: "Movimento artistico anti-arte nato nel 1916 a Zurigo", d: 5 },
  { q: "Chi ha creato le 'Ninfee'?", a: "Claude Monet", d: 3 },
  { q: "Quale artista italiano è famoso per le 'nature morte'?", a: "Giorgio Morandi", d: 5 },
  { q: "Cos'è l'arte concettuale?", a: "Arte in cui l'idea è più importante dell'estetica dell'oggetto", d: 6 },
  { q: "Chi è Banksy?", a: "Artista di strada britannico anonimo famoso per la street art satirica", d: 3 },
  { q: "Quale architetto ha progettato la Sagrada Família?", a: "Antoni Gaudí", d: 3 },
  { q: "Cos'è il chiaroscuro in pittura?", a: "La tecnica di contrasto tra luce e ombra per creare volume", d: 4 },
];

// ─── CIBO ──────────────────────────────────────────────
const ciboFacts: { q: string; a: string; d: number }[] = [
  { q: "Da quale Paese proviene il sushi?", a: "Giappone", d: 1 },
  { q: "Qual è l'ingrediente principale della pasta?", a: "Farina (di grano)", d: 1 },
  { q: "Da quale Paese proviene la pizza?", a: "Italia", d: 1 },
  { q: "Cos'è il wasabi?", a: "Una pasta verde piccante giapponese", d: 2 },
  { q: "Quale frutto è noto come 'il re dei frutti' nel Sud-est asiatico?", a: "Durian", d: 4 },
  { q: "Qual è la spezia più costosa al mondo?", a: "Zafferano", d: 3 },
  { q: "Da quale animale si ottiene il prosciutto?", a: "Maiale", d: 1 },
  { q: "Qual è il formaggio italiano più esportato?", a: "Parmigiano Reggiano", d: 2 },
  { q: "Da quale pianta si ottiene il cioccolato?", a: "Cacao", d: 1 },
  { q: "Quale Paese è il maggior produttore di caffè al mondo?", a: "Brasile", d: 3 },
  { q: "Cos'è il tofu?", a: "Un alimento derivato dalla soia", d: 2 },
  { q: "Quale tipo di pasta ha la forma di piccole orecchie?", a: "Orecchiette", d: 2 },
  { q: "Cos'è la fermentazione?", a: "Processo biochimico in cui microrganismi trasformano zuccheri in alcol o acidi", d: 4 },
  { q: "Da quale regione italiana proviene il pesto?", a: "Liguria", d: 2 },
  { q: "Cos'è l'umami?", a: "Il quinto gusto fondamentale (sapore di glutammato)", d: 4 },
  { q: "Quale cucina usa molto il curry?", a: "Indiana (e del Sud-est asiatico)", d: 2 },
  { q: "Cos'è la reazione di Maillard?", a: "La reazione chimica tra aminoacidi e zuccheri durante la cottura che crea sapore e colore", d: 6 },
  { q: "Quale vino italiano è prodotto nella regione del Chianti?", a: "Chianti (Sangiovese)", d: 3 },
  { q: "Da quale Paese proviene il kimchi?", a: "Corea", d: 3 },
  { q: "Cos'è la cucina molecolare?", a: "Un approccio che usa tecniche scientifiche per trasformare alimenti", d: 5 },
  { q: "Quale cereale è alla base della dieta giapponese?", a: "Riso", d: 1 },
  { q: "Quale Paese è famoso per il kebab?", a: "Turchia", d: 2 },
  { q: "Cos'è lo 'slow food'?", a: "Movimento nato in Italia che promuove il cibo locale e la lentezza contrapposta al fast food", d: 4 },
];

// ─── VIDEOGIOCHI ───────────────────────────────────────
const videogiochisFacts: { q: string; a: string; d: number }[] = [
  { q: "In quale gioco si costruiscono e distruggono blocchi in un mondo 3D?", a: "Minecraft", d: 1 },
  { q: "Chi è il protagonista della serie Zelda?", a: "Link", d: 2 },
  { q: "Quale console ha lanciato Nintendo nel 2017?", a: "Nintendo Switch", d: 2 },
  { q: "Quale gioco battle royale ha la modalità 'costruzione'?", a: "Fortnite", d: 1 },
  { q: "In quale gioco si catturano creature chiamate Pokémon?", a: "Pokémon", d: 1 },
  { q: "Quale azienda produce la PlayStation?", a: "Sony", d: 1 },
  { q: "In quale anno è uscito il primo Super Mario Bros?", a: "1985", d: 3 },
  { q: "Quale gioco ha il personaggio 'Master Chief'?", a: "Halo", d: 2 },
  { q: "Quale gioco di ruolo è ambientato a Skyrim?", a: "The Elder Scrolls V: Skyrim", d: 2 },
  { q: "Quale gioco ha venduto più copie nella storia?", a: "Minecraft", d: 2 },
  { q: "Chi ha creato Super Mario?", a: "Shigeru Miyamoto", d: 3 },
  { q: "In quale gioco si esplora un mondo post-apocalittico nella Zona Contaminata?", a: "Fallout", d: 3 },
  { q: "Quale gioco mobile ha spopolato nel 2016 con la realtà aumentata?", a: "Pokémon GO", d: 2 },
  { q: "Cos'è un NPC?", a: "Non-Player Character (personaggio non giocante)", d: 2 },
  { q: "Quale studio ha sviluppato The Witcher 3?", a: "CD Projekt Red", d: 3 },
  { q: "In quale gioco si guida un idraulico che salta su piattaforme?", a: "Super Mario", d: 1 },
  { q: "Quale gioco competitivo 5v5 è sviluppato da Riot Games?", a: "League of Legends (o Valorant)", d: 3 },
  { q: "Cos'è un 'Easter egg' nei videogiochi?", a: "Un contenuto nascosto messo dagli sviluppatori", d: 3 },
  { q: "Quale console è uscita nel 2020 con il suffisso 'Series X'?", a: "Xbox Series X", d: 3 },
  { q: "In quale gioco open world si impersona un cowboy chiamato Arthur Morgan?", a: "Red Dead Redemption 2", d: 3 },
  { q: "Quale gioco horror ha il protagonista Leon S. Kennedy?", a: "Resident Evil (2 e 4)", d: 4 },
  { q: "Quale gioco indie racconta la storia di un bambino negli Inferi?", a: "Hades (o Binding of Isaac)", d: 5 },
  { q: "Quale sviluppatore ha creato Dark Souls?", a: "FromSoftware", d: 4 },
  { q: "In quale anno è stato rilasciato il primo gioco di Pac-Man?", a: "1980", d: 4 },
];

// ─── NATURA ────────────────────────────────────────────
const naturaFacts: { q: string; a: string; d: number }[] = [
  { q: "Qual è l'animale terrestre più veloce?", a: "Ghepardo", d: 1 },
  { q: "Quale gas producono le piante durante la fotosintesi?", a: "Ossigeno", d: 1 },
  { q: "Qual è il mammifero più grande del mondo?", a: "Balenottera azzurra", d: 1 },
  { q: "Quante zampe ha un ragno?", a: "Otto", d: 1 },
  { q: "Cos'è un ecosistema?", a: "L'insieme di organismi viventi e il loro ambiente fisico", d: 2 },
  { q: "Quale animale è noto per cambiare colore?", a: "Camaleonte", d: 1 },
  { q: "Cos'è la biodiversità?", a: "La varietà di specie viventi in un ecosistema", d: 2 },
  { q: "Quale è l'albero più alto del mondo?", a: "Sequoia sempreverde (Hyperion)", d: 4 },
  { q: "Quale processo trasforma il bruco in farfalla?", a: "Metamorfosi", d: 2 },
  { q: "Qual è l'oceano più grande?", a: "Oceano Pacifico", d: 1 },
  { q: "Cos'è la simbiosi?", a: "Una relazione stretta tra due specie diverse", d: 3 },
  { q: "Quale animale ha l'impronta digitale simile a quella umana?", a: "Koala", d: 5 },
  { q: "Cos'è il permafrost?", a: "Terreno permanentemente ghiacciato nelle regioni artiche", d: 4 },
  { q: "Quale fiore è il simbolo del Giappone?", a: "Il ciliegio (sakura)", d: 3 },
  { q: "Cos'è la catena alimentare?", a: "La sequenza di organismi in cui ciascuno è cibo per il successivo", d: 2 },
  { q: "Quale animale può rigenerare parti del corpo?", a: "Salamandra (o stella marina)", d: 4 },
  { q: "Cos'è l'effetto serra?", a: "L'intrappolamento del calore nell'atmosfera da parte di gas serra", d: 3 },
  { q: "Quale è la foresta pluviale più grande?", a: "Amazzonia", d: 2 },
  { q: "Cos'è un bioma?", a: "Una grande comunità ecologica definita da clima e vegetazione", d: 4 },
  { q: "Quale insetto è il più forte in proporzione al suo peso?", a: "Scarabeo rinoceronte", d: 5 },
  { q: "Cos'è la desertificazione?", a: "La trasformazione di terre fertili in deserti", d: 3 },
  { q: "Quale pianta è carnivora e cattura insetti con trappole a scatto?", a: "Venere acchiappamosche (Dionaea muscipula)", d: 4 },
];

// ─── ECONOMIA ──────────────────────────────────────────
const economiaFacts: { q: string; a: string; d: number }[] = [
  { q: "Cos'è il PIL?", a: "Prodotto Interno Lordo, il valore totale dei beni e servizi prodotti", d: 2 },
  { q: "Cos'è l'inflazione?", a: "L'aumento generalizzato dei prezzi nel tempo", d: 2 },
  { q: "Quale valuta usa l'Unione Europea?", a: "Euro (€)", d: 1 },
  { q: "Cos'è una azione (in borsa)?", a: "Una quota di proprietà di un'azienda", d: 2 },
  { q: "Quale banca è la banca centrale degli USA?", a: "Federal Reserve (Fed)", d: 3 },
  { q: "Cos'è la domanda e l'offerta?", a: "Le forze di mercato che determinano prezzi e quantità", d: 2 },
  { q: "Quale economista ha scritto 'La ricchezza delle nazioni'?", a: "Adam Smith", d: 3 },
  { q: "Cos'è una recessione?", a: "Un calo significativo dell'attività economica per almeno due trimestri", d: 3 },
  { q: "Cos'è il tasso di cambio?", a: "Il valore di una valuta rispetto a un'altra", d: 3 },
  { q: "Quale criptovaluta è stata la prima ad essere creata?", a: "Bitcoin", d: 2 },
  { q: "Cos'è il debito pubblico?", a: "Il totale dei debiti contratti dallo Stato", d: 3 },
  { q: "Cos'è un monopolio?", a: "Quando un'unica azienda controlla un intero mercato", d: 3 },
  { q: "Chi ha fondato Amazon?", a: "Jeff Bezos", d: 2 },
  { q: "Cos'è il libero mercato?", a: "Un mercato con minima regolamentazione governativa", d: 3 },
  { q: "Cos'è la stagflazione?", a: "Inflazione alta combinata con stagnazione economica", d: 5 },
  { q: "Cos'è il quantitative easing?", a: "Politica monetaria in cui la banca centrale acquista titoli per stimolare l'economia", d: 6 },
  { q: "Quale economista è associato alla teoria keynesiana?", a: "John Maynard Keynes", d: 4 },
  { q: "Cos'è un ETF?", a: "Exchange-Traded Fund, un fondo che replica un indice ed è scambiato in borsa", d: 5 },
  { q: "Cos'è il deficit di bilancio?", a: "Quando le spese dello Stato superano le entrate", d: 4 },
  { q: "Quale indice misura la borsa italiana?", a: "FTSE MIB", d: 4 },
  { q: "Cos'è il venture capital?", a: "Investimento in aziende giovani ad alto potenziale di crescita", d: 5 },
];

// ─── ATTUALITÀ ─────────────────────────────────────────
const attualitaFacts: { q: string; a: string; d: number }[] = [
  { q: "Quale organizzazione mondiale si occupa di salute?", a: "OMS (Organizzazione Mondiale della Sanità)", d: 1 },
  { q: "In quale anno è iniziata la pandemia di COVID-19?", a: "2019-2020", d: 1 },
  { q: "Quale Paese ha invaso l'Ucraina nel 2022?", a: "Russia", d: 1 },
  { q: "Cos'è il cambiamento climatico?", a: "Il riscaldamento globale causato dalle emissioni di gas serra", d: 2 },
  { q: "Cos'è l'Accordo di Parigi?", a: "Un trattato internazionale per limitare il riscaldamento globale", d: 3 },
  { q: "Quale movimento giovanile per il clima è stato ispirato da Greta Thunberg?", a: "Fridays for Future", d: 2 },
  { q: "Cos'è la NATO?", a: "Organizzazione del Trattato dell'Atlantico del Nord", d: 2 },
  { q: "Quale Paese ha ospitato i Mondiali di calcio nel 2022?", a: "Qatar", d: 2 },
  { q: "Cosa significa 'sostenibilità'?", a: "Soddisfare i bisogni attuali senza compromettere quelli futuri", d: 2 },
  { q: "Cos'è l'intelligenza artificiale generativa?", a: "AI che crea contenuti nuovi (testo, immagini, video)", d: 3 },
  { q: "Chi è il Segretario Generale dell'ONU (dal 2017)?", a: "António Guterres", d: 4 },
  { q: "Quale criptovaluta ha avuto il crollo più noto nel 2022?", a: "Luna/TerraUSD", d: 5 },
  { q: "Quale è l'obiettivo dell'Agenda 2030 dell'ONU?", a: "17 Obiettivi di Sviluppo Sostenibile", d: 4 },
  { q: "Cos'è la transizione energetica?", a: "Il passaggio da fonti fossili a fonti rinnovabili", d: 3 },
  { q: "Quale tecnologia permette di creare video falsi realistici?", a: "Deepfake", d: 3 },
  { q: "In quale anno il Regno Unito ha completato la Brexit?", a: "2020", d: 3 },
  { q: "Cos'è il GDPR?", a: "Regolamento Generale sulla Protezione dei Dati dell'UE", d: 4 },
  { q: "Quale social media è stato acquistato da Elon Musk nel 2022?", a: "Twitter (ora X)", d: 2 },
  { q: "Cos'è l'economia circolare?", a: "Un modello che minimizza rifiuti e riutilizza risorse", d: 4 },
];

// ─── MITOLOGIA ─────────────────────────────────────────
const mitologiaFacts: { q: string; a: string; d: number }[] = [
  { q: "Chi è il re degli dei nell'Olimpo greco?", a: "Zeus", d: 1 },
  { q: "Quale eroe greco ha combattuto il Minotauro?", a: "Teseo", d: 2 },
  { q: "Chi è il dio romano della guerra?", a: "Marte", d: 1 },
  { q: "Quale creatura mitologica è metà uomo e metà cavallo?", a: "Centauro", d: 1 },
  { q: "Chi è la dea greca della saggezza?", a: "Atena", d: 2 },
  { q: "Quale eroe ha compiuto le 12 fatiche?", a: "Eracle (Ercole)", d: 2 },
  { q: "Chi è il dio norreno del tuono?", a: "Thor", d: 1 },
  { q: "Cos'è il Valhalla?", a: "Il paradiso dei guerrieri nella mitologia norrena", d: 2 },
  { q: "Quale mostro ha serpenti al posto dei capelli?", a: "Medusa", d: 1 },
  { q: "Chi è il messaggero degli dei greci?", a: "Ermes (Mercurio)", d: 2 },
  { q: "Quale titano fu condannato a reggere il cielo?", a: "Atlante", d: 3 },
  { q: "Chi è il dio egizio dei morti?", a: "Anubi", d: 3 },
  { q: "Quale eroe omerico ideò il cavallo di Troia?", a: "Ulisse (Odisseo)", d: 2 },
  { q: "Cos'è il Ragnarok?", a: "La fine del mondo nella mitologia norrena", d: 3 },
  { q: "Chi è la dea egizia della magia?", a: "Iside", d: 4 },
  { q: "Quale creatura mitologica rinasce dalle proprie ceneri?", a: "La Fenice", d: 2 },
  { q: "Chi è il dio greco del mare?", a: "Poseidone", d: 1 },
  { q: "Cos'è lo Stige?", a: "Il fiume degli inferi nella mitologia greca", d: 3 },
  { q: "Chi è il fabbro degli dei nell'Olimpo?", a: "Efesto (Vulcano)", d: 3 },
  { q: "Quale semidio sumero è protagonista di un'epica antica?", a: "Gilgamesh", d: 4 },
  { q: "Cos'è l'Yggdrasil?", a: "L'albero cosmico nella mitologia norrena", d: 5 },
  { q: "Chi è la dea greca della caccia?", a: "Artemide (Diana)", d: 2 },
  { q: "Quale mostro a tre teste sorveglia gli Inferi greci?", a: "Cerbero", d: 2 },
  { q: "Chi è il dio azteco del sole e della guerra?", a: "Huitzilopochtli", d: 7 },
  { q: "Quale gigante nordico è il padre di Loki?", a: "Fárbauti", d: 7 },
  { q: "Chi è il dio induista della distruzione e rigenerazione?", a: "Shiva", d: 4 },
];

// ─── Category mapping ─────────────────────────────────
const categoryPools: Record<string, { q: string; a: string; d: number }[]> = {
  "MCU": mcuFacts,
  "Storia": storiaFacts,
  "Scienza": scienzaFacts,
  "Spazio": spazioFacts,
  "Geografia": geografiaFacts,
  "Italiano": italianoFacts,
  "Matematica": matematicaFacts,
  "Sport": sportFacts,
  "Film": filmFacts,
  "Serie TV": serieTvFacts,
  "Musica": musicaFacts,
  "Tecnologia": tecnologiaFacts,
  "Cultura pop": culturaPopFacts,
  "Arte": arteFacts,
  "Cibo": ciboFacts,
  "Videogiochi": videogiochisFacts,
  "Natura": naturaFacts,
  "Economia": economiaFacts,
  "Attualità": attualitaFacts,
  "Mitologia": mitologiaFacts,
};

const categoryGenerators: Record<string, QuestionGenerator[]> = {
  "Matematica": matematicaGenerators,
};

// Track used questions within a single game session
let usedInSession: Set<string> = new Set();

function questionKey(q: string): string {
  return q.trim().toLowerCase();
}

/**
 * Get a question for a category at a given difficulty level.
 * Uses a combination of static pools and dynamic generators.
 * Questions are shuffled each time and tracked to avoid repeats within a session.
 */
export function getQuestion(
  category: string,
  difficultyLevel: number,
  maxLevels: number
): Question | null {
  // Map difficulty level (1-based) to difficulty score (1-10)
  const targetDifficulty = Math.round((difficultyLevel / maxLevels) * 8) + 1;

  // Try dynamic generators first (for categories that have them)
  const generators = categoryGenerators[category];
  if (generators && Math.random() > 0.4) {
    // 60% chance to use generator for variety
    for (let attempt = 0; attempt < 10; attempt++) {
      const gen = pick(generators);
      const q = gen(targetDifficulty);
      const key = questionKey(q.question);
      if (!usedInSession.has(key)) {
        usedInSession.add(key);
        return q;
      }
    }
  }

  // Use static pool
  const pool = categoryPools[category];
  if (!pool || pool.length === 0) return null;

  // Sort by distance to target difficulty, then shuffle within same distance
  const candidates = pool
    .filter(q => !usedInSession.has(questionKey(q.q)))
    .map(q => ({
      ...q,
      dist: Math.abs(q.d - targetDifficulty),
    }))
    .sort((a, b) => a.dist - b.dist);

  if (candidates.length === 0) {
    // All used - clear and retry (should be rare with large pools)
    return null;
  }

  // Pick from the closest difficulty matches with some randomness
  const minDist = candidates[0].dist;
  const closests = candidates.filter(c => c.dist <= minDist + 2);
  const picked = pick(closests);
  
  usedInSession.add(questionKey(picked.q));
  return { question: picked.q, answer: picked.a, difficulty: picked.d };
}

export function resetUsedQuestions(): void {
  usedInSession = new Set();
}

export const ALL_CATEGORIES = [
  "MCU", "Storia", "Scienza", "Spazio", "Geografia",
  "Italiano", "Matematica", "Sport", "Film", "Serie TV",
  "Musica", "Tecnologia", "Cultura pop", "Arte", "Cibo",
  "Videogiochi", "Natura", "Economia", "Attualità", "Mitologia"
];
