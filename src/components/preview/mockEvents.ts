/**
 * Mock events for the preview phone demo.
 *
 * Based on real Helsingborg Events API data structure and authentic
 * Swedish events from the Helsingborg/Nordvästra Skåne region.
 *
 * Coverage:
 *  - 7 categories × 3 subcategories × 3 events = 63 events
 *  - Every tag (1001-1006) appears on at least 5 events
 *  - Authentic Swedish titles, descriptions, locations, and organizers
 */

import { EventDto } from "@/types/events";

// ────────────────────────────────────────────────────────────────
// Category / subcategory / tag metadata (all Swedish)
// ────────────────────────────────────────────────────────────────

const CATS: Record<number, { name: string; nameSv: string }> = {
  1: { name: "Evenemang", nameSv: "Evenemang" },
  2: { name: "Idrott & sport", nameSv: "Idrott & sport" },
  3: { name: "Underhållning", nameSv: "Underhållning" },
  4: { name: "Kultur & sevärdheter", nameSv: "Kultur & sevärdheter" },
  5: { name: "Upplevelser & äventyr", nameSv: "Upplevelser & äventyr" },
  6: { name: "Lära & utforska", nameSv: "Lära & utforska" },
  7: { name: "Hälsa & välmående", nameSv: "Hälsa & välmående" },
};

const SUBS: Record<number, { name: string; nameSv: string }> = {
  101: { name: "Festivaler & skoj", nameSv: "Festivaler & skoj" },
  102: { name: "Fritid & livsstil", nameSv: "Fritid & livsstil" },
  103: { name: "Mässor & marknader", nameSv: "Mässor & marknader" },
  201: { name: "Sport att utöva", nameSv: "Sport att utöva" },
  202: { name: "Sport att se på", nameSv: "Sport att se på" },
  203: { name: "Sport att prova", nameSv: "Sport att prova" },
  301: { name: "Bio & film", nameSv: "Bio & film" },
  302: { name: "Musik & konserter", nameSv: "Musik & konserter" },
  303: { name: "Teater & shower", nameSv: "Teater & shower" },
  401: { name: "Guidade turer", nameSv: "Guidade turer" },
  402: { name: "Konst & gallerier", nameSv: "Konst & gallerier" },
  403: { name: "Museer & sevärdheter", nameSv: "Museer & sevärdheter" },
  501: { name: "Parker & stigar", nameSv: "Parker & stigar" },
  502: { name: "Mat & dryck", nameSv: "Mat & dryck" },
  503: { name: "Utflykter & äventyr", nameSv: "Utflykter & äventyr" },
  601: { name: "Föreläsningar", nameSv: "Föreläsningar" },
  602: { name: "Lär dig...", nameSv: "Lär dig..." },
  603: { name: "Träffar & möten", nameSv: "Träffar & möten" },
  701: { name: "Spa & bad", nameSv: "Spa & bad" },
  702: { name: "Stöd & samverkan", nameSv: "Stöd & samverkan" },
  703: { name: "Trosaktiviteter", nameSv: "Trosaktiviteter" },
};

const TAGS: Record<number, string> = {
  1001: "Gratis",
  1002: "Familjevänligt",
  1003: "Inomhus",
  1004: "Utomhus",
  1005: "Seniorfokus",
  1006: "Rullstolsanpassat",
};

// ────────────────────────────────────────────────────────────────
// Helper to build one EventDto
// ────────────────────────────────────────────────────────────────

let _id = 0;
function evt(
  catCode: number,
  subCode: number,
  title: string,
  description: string,
  organiser: string,
  streetName: string,
  city: string,
  postalCode: string,
  daysFromNow: number,
  tagCodes: number[] = [],
  extra?: Partial<EventDto>,
): EventDto {
  _id++;
  const start = new Date();
  start.setDate(start.getDate() + daysFromNow);
  const cat = CATS[catCode];
  const sub = SUBS[subCode];
  return {
    id: `mock-${_id.toString().padStart(3, "0")}`,
    organiser,
    organisationNumber: "",
    title,
    description,
    streetName,
    city,
    postalCode,
    isActive: true,
    createdAt: new Date().toISOString(),
    sourceProvider: city === "Helsingborg" ? "helsingborg" : "internal",
    startDate: start.toISOString(),
    categories: [{ code: catCode, name: cat.name, nameSv: cat.nameSv }],
    subcategories: [{ code: subCode, name: sub.name, nameSv: sub.nameSv, categoryCode: catCode }],
    tags: tagCodes.map((c) => ({ code: c, name: TAGS[c] })),
    ...extra,
  };
}

// ────────────────────────────────────────────────────────────────
// 63 mock events — realistic Helsingborg/NV Skåne events
// Tags are distributed so each of the 6 tags covers ≥ 5 events
// ────────────────────────────────────────────────────────────────

export const MOCK_EVENTS: EventDto[] = [
  // ── Kategori 1: Evenemang ────────────────────────────────────
  // 101 Festivaler & skoj
  evt(1, 101,
    "Sommarfestival på Sundstorget",
    "Helsingborgs stora sommarfestival med livemusik, street food och aktiviteter för hela familjen. Lokala artister och mat från regionens bästa restauranger.",
    "Helsingborgs stad", "Sundstorget", "Helsingborg", "25221", 5, [1001, 1004, 1002]),
  evt(1, 101,
    "Helsingborgs Kulturnatt",
    "En kväll fylld av kultur, konst och musik på platser runt om i staden. Museer, gallerier och scener håller öppet till midnatt.",
    "Helsingborgs stad", "Stortorget 17", "Helsingborg", "25221", 12, [1001, 1004, 1006]),
  evt(1, 101,
    "Skånsk matfestival",
    "Upplev det bästa av skånsk matkultur med provsmakningar, matlagningsdemonstrationer och lokala producenter. Tre dagar av gastronomiska upplevelser.",
    "Region Skåne", "Kungstorget 1", "Helsingborg", "25221", 18, [1004, 1002]),

  // 102 Fritid & livsstil
  evt(1, 102,
    "Hälsomässan Helsingborg",
    "Sveriges ledande hälsomässa med föreläsningar, provträning och utställare inom hälsa, kost och välmående. Fri entré för alla besökare.",
    "Helsingborg Arena", "Mellersta Stenbocksgatan 16", "Helsingborg", "25437", 3, [1001, 1003, 1006]),
  evt(1, 102,
    "Loppmarknad på Fredriksdal",
    "Stor loppmarknad i den vackra miljön på Fredriksdals friluftsmuseum. Hundratals säljare med allt från antikt till vintage.",
    "Fredriksdals museer och trädgårdar", "Gisela Trapps väg 1", "Helsingborg", "25431", 7, [1004]),
  evt(1, 102,
    "Trädgårdsdagen på Sofiero",
    "Inspiration för alla trädgårdsentusiaster med workshops, försäljning av växter och guidade turer i Sofieros berömda rhododendronpark.",
    "Sofiero Slott", "Sofiero Slottsväg 131", "Helsingborg", "25489", 14, [1004, 1005]),

  // 103 Mässor & marknader
  evt(1, 103,
    "Julmarknad på Stortorget",
    "Traditionell julmarknad med glögg, pepparkakor, hantverk och julklappar. Jultomten delar ut godis till barnen varje lördag.",
    "Helsingborgs stad", "Stortorget", "Helsingborg", "25221", 2, [1004, 1002]),
  evt(1, 103,
    "Bondens egen marknad",
    "Köp direkt från lokala bönder och producenter. Färska grönsaker, ost, bröd, charkuterier och mycket mer från gårdar i Skåne.",
    "Bondens egen marknad", "Konsul Olssons plats", "Helsingborg", "25224", 9, [1004, 1001]),
  evt(1, 103,
    "Antik- och designmarknad",
    "Skandinaviens största antik- och designmarknad med över 200 utställare. Möbler, konst, smycken och kuriosa från hela Europa.",
    "Helsingborg Arena", "Mellersta Stenbocksgatan 16", "Helsingborg", "25437", 20, [1003]),

  // ── Kategori 2: Idrott & sport ──────────────────────────────
  // 201 Sport att utöva
  evt(2, 201,
    "Parkrun Helsingborg",
    "Gratis 5 km löpning varje lördag morgon i Pålsjö Skog. Alla välkomna oavsett tempo — spring, jogga eller gå. Registrera dig på parkrun.se.",
    "Parkrun Sverige", "Pålsjö Skog", "Helsingborg", "25225", 1, [1001, 1004]),
  evt(2, 201,
    "Strandloppet i Ria",
    "10 km löpning längs kusten från Råå hamn till Ria. Fantastisk utsikt över Öresund. Anmälan via hemsidan, begränsat antal platser.",
    "Helsingborgs Idrottsförening", "Råå hamn", "Helsingborg", "25270", 8, [1004]),
  evt(2, 201,
    "Simutmaningen på Tropical Beach",
    "Tävla i simning på 200m, 400m eller 1500m i Tropical Beach äventyrsbad. Alla åldersklasser. Rullstolsanpassade omklädningsrum.",
    "Helsingborgs Simsällskap", "Gröningen 1", "Helsingborg", "25220", 15, [1003, 1006]),

  // 202 Sport att se på
  evt(2, 202,
    "HIF mot Djurgården — Allsvenskan",
    "Allsvensk fotboll på Olympia. Helsingborgs IF tar emot Djurgårdens IF i en spännande ligamatch. Biljetterna säljs på hif.se.",
    "Helsingborgs IF", "Olympiavägen 1", "Helsingborg", "25438", 4, [1004]),
  evt(2, 202,
    "Rögle BK mot Frölunda HC — SHL",
    "Dags för match i SHL! Nedslag mot Frölunda i Catena Arena. En av säsongens hetaste hockeymatcher i nordvästra Skåne.",
    "Rögle BK", "Ishallsvägen", "Ängelholm", "26254", 11, [1003]),
  evt(2, 202,
    "Helsingborg Marathon",
    "Helsingborgs årliga maratontävling med sträckor på 5 km, halvmaraton och fullt maraton. Banan går genom stadens vackraste delar.",
    "Helsingborg Marathon", "Hamntorget 1", "Helsingborg", "25218", 22, [1004, 1006]),

  // 203 Sport att prova
  evt(2, 203,
    "Prova-på padel — gratis introduktion",
    "Kom och testa padel med våra instruktörer. Vi lånar ut racket och bollar. Ingen förkunskap krävs, alla nivåer välkomna.",
    "Padel Center Helsingborg", "Ättekullsvägen 26", "Helsingborg", "25268", 6, [1001, 1003]),
  evt(2, 203,
    "Segling för nybörjare",
    "Lär dig grunderna i segling med erfarna instruktörer från Helsingborgs Segelsällskap. Båtar och flytvästar ingår. Passa på i sommar!",
    "Helsingborgs Segelsällskap", "Parapeten 24", "Helsingborg", "25220", 10, [1004, 1002]),
  evt(2, 203,
    "Klätterkväll på Klättercentret",
    "Prova bouldering och topprepsklättring under kunnig ledning. Utrustning ingår. Barn från 6 år med vuxen. Boka via hemsidan.",
    "Klättercentret Helsingborg", "Garnisonsgatan 53", "Helsingborg", "25466", 17, [1003, 1002]),

  // ── Kategori 3: Underhållning ───────────────────────────────
  // 301 Bio & film
  evt(3, 301,
    "Utomhusbio i Stadsparken",
    "Gratis filmvisning under bar himmel i Helsingborgs Stadspark. Ta med filt och picknick och njut av en svensk filmklassiker.",
    "Helsingborgs stad", "Stadsparken", "Helsingborg", "25234", 3, [1001, 1004, 1002]),
  evt(3, 301,
    "Filmfestival på Dunkers",
    "Tre dagars filmfestival med fokus på skandinavisk film. Visningar, panelsamtal med regissörer och filmquiz. Biljetter på dunkers.se.",
    "Dunkers kulturhus", "Kungsgatan 11", "Helsingborg", "25221", 13, [1003]),
  evt(3, 301,
    "Barnfilmsdag på Röda Kvarn",
    "Specialprogram för de yngsta biobesökarna med animerade filmer och popcornfest. Anpassat för barn 3–10 år. Seniorer gratis.",
    "Filmstaden Helsingborg", "Bruksgatan 18", "Helsingborg", "25221", 19, [1003, 1002, 1005]),

  // 302 Musik & konserter
  evt(3, 302,
    "Konsert på Sofiero Slott",
    "Livemusik i den vackra miljön på Sofieros slottspark. Ta med en picknickfilt och njut av sommarkvällen med akustisk musik och solnedgång.",
    "Sofiero Slott", "Sofiero Slottsväg 131", "Helsingborg", "25489", 2, [1004]),
  evt(3, 302,
    "Jazz på Dunkers kulturhus",
    "Internationella och svenska jazzmusiker uppträder i Dunkers intima konsertsal. Kvällens gäst: Nils Landgren Funk Unit.",
    "Dunkers kulturhus", "Kungsgatan 11", "Helsingborg", "25221", 8, [1003, 1006]),
  evt(3, 302,
    "Sommarkonsert i Ramlösa Brunnspark",
    "Gratis utomhuskonsert i den idylliska Ramlösa Brunnspark. Helsingborgs Symfoniorkester spelar klassiska favoriter under öppen himmel.",
    "Helsingborgs Konserthus", "Ramlösa Brunnspark", "Helsingborg", "25660", 16, [1001, 1004]),

  // 303 Teater & shower
  evt(3, 303,
    "Hamlet på Helsingborgs Stadsteater",
    "Shakespeares klassiker i modern tappning på Helsingborgs Stadsteater. Regi: Sofia Jupither. Rullstolsplatser finns i salongen.",
    "Helsingborgs Stadsteater", "Karl Johans gata 1", "Helsingborg", "25221", 5, [1003, 1006]),
  evt(3, 303,
    "Ståuppkväll på The Tivoli",
    "Skånes roligaste komiker samlas för en kväll fylld av skratt. Tre akter med paus. Mingel och bar. Åldersgräns 18 år.",
    "The Tivoli", "Karl Krooks gata 2", "Helsingborg", "25237", 10, [1003]),
  evt(3, 303,
    "Barnteater: Pippi Långstrump",
    "Astrid Lindgrens älskade Pippi Långstrump lever på scenen! En föreställning för hela familjen med sång, dans och bus.",
    "Helsingborgs Stadsteater", "Karl Johans gata 1", "Helsingborg", "25221", 21, [1003, 1002]),

  // ── Kategori 4: Kultur & sevärdheter ────────────────────────
  // 401 Guidade turer
  evt(4, 401,
    "Historisk stadsvandring i Helsingborg",
    "Följ med på en guidad vandring genom Helsingborgs 900-åriga historia. Från Kärnan till hamnen — berättelser om kungar, krig och handel.",
    "Helsingborgs Turistbyrå", "Stortorget 17", "Helsingborg", "25221", 1, [1004, 1005]),
  evt(4, 401,
    "Guidad tur på Kärnan",
    "Utforska det medeltida tornet Kärnan med en kunnig guide. Lär dig om tornets historia och njut av panoramautsikt över Öresund och Danmark.",
    "Helsingborgs museer", "Slottshagen", "Helsingborg", "25221", 7, [1004]),
  evt(4, 401,
    "Slottsvandring på Sofiero",
    "Guidad tur genom Sofiero Slotts vackra trädgårdar och salar. Hör berättelser om kungafamiljens sommarnöjen och parkens unika växtsamling.",
    "Sofiero Slott", "Sofiero Slottsväg 131", "Helsingborg", "25489", 14, [1004, 1006]),

  // 402 Konst & gallerier
  evt(4, 402,
    "Utställning: Havet och vi",
    "En interaktiv utställning om Öresunds historia och framtid på Dunkers kulturhus. Perfekt för skolklasser och nyfikna besökare i alla åldrar.",
    "Dunkers kulturhus", "Kungsgatan 11", "Helsingborg", "25221", 4, [1003, 1002, 1006]),
  evt(4, 402,
    "Konstnatt Helsingborg",
    "Gallerier och ateljéer i hela staden håller öppet en kväll. Gratis entré, vernissage och samtal med konstnärer. Kartor delas ut på Stortorget.",
    "Helsingborgs Konstförening", "Stortorget 17", "Helsingborg", "25221", 9, [1001, 1003]),
  evt(4, 402,
    "Gatukonstvandring i Söder",
    "Upptäck Helsingborgs bästa gatukonst och muralmålningar på en guidad vandring genom södra staden. Gratis, ingen anmälan krävs.",
    "Street Art Helsingborg", "Södergatan 12", "Helsingborg", "25225", 18, [1001, 1004]),

  // 403 Museer & sevärdheter
  evt(4, 403,
    "Fredriksdals friluftsmuseum — familjedag",
    "Upplev 1800-talets Skåne på Fredriksdals friluftsmuseum. Hästar, getter, traditionellt hantverk och gammaldags lekar för barnen.",
    "Fredriksdals museer och trädgårdar", "Gisela Trapps väg 1", "Helsingborg", "25431", 2, [1004, 1002]),
  evt(4, 403,
    "Landskrona Museum — vikingautställning",
    "Ny utställning om vikingatiden i nordvästra Skåne. Originalfynd, interaktiva stationer och visningar för skolor.",
    "Landskrona Museum", "Slottsgatan 1", "Landskrona", "26131", 11, [1003, 1002, 1006]),
  evt(4, 403,
    "Maritiman — sjöfartshistoria",
    "Besök Helsingborgs sjöfartsmuseum med historiska fartyg, navigationsinstrument och berättelser om Öresunds sjöfart genom tiderna.",
    "Helsingborgs museer", "Hamntorget 1", "Helsingborg", "25218", 20, [1003, 1005]),

  // ── Kategori 5: Upplevelser & äventyr ───────────────────────
  // 501 Parker & stigar
  evt(5, 501,
    "Vandring i Söderåsens nationalpark",
    "Guidad vandring genom Söderåsens dramatiska raviner och urskogar. Sträckan är 8 km och tar cirka 4 timmar. Ta med egen matsäck.",
    "Naturum Söderåsen", "Skäralid", "Ljungbyhed", "26053", 3, [1004, 1001]),
  evt(5, 501,
    "Promenad i Fredriksdals trädgårdar",
    "Botanisk vandring i Fredriksdals vackra trädgårdar med expert som berättar om växter, kryddgårdar och historiska odlingsmetoder.",
    "Fredriksdals museer och trädgårdar", "Gisela Trapps väg 1", "Helsingborg", "25431", 8, [1004, 1005]),
  evt(5, 501,
    "Kvällspromenad i Ramlösa Brunnspark",
    "Guidad kvällspromenad i den atmosfäriska Ramlösa Brunnspark. Lär dig om parkens historia som kurort och njut av den fridfulla naturen.",
    "Helsingborgs stad", "Ramlösa Brunnspark", "Helsingborg", "25660", 15, [1004]),

  // 502 Mat & dryck
  evt(5, 502,
    "Helsingborg Food Walk",
    "Kulinarisk stadsvandring med smakprov på fem olika restauranger i centrala Helsingborg. Upptäck stadens matscen med en lokal guide.",
    "Helsingborg Food Tours", "Stortorget 17", "Helsingborg", "25221", 5, [1004]),
  evt(5, 502,
    "Ölprovning på Helsingborgs Bryggeri",
    "Prova sex lokala hantverksöl med bryggmästaren som guide. Lär dig om bryggprocessen och vad som gör skånsk öl unik. Ost och bröd ingår.",
    "Helsingborgs Bryggeri", "Bergaliden 30", "Helsingborg", "25244", 12, [1003]),
  evt(5, 502,
    "Matlagningskväll — skånsk husmanskost",
    "Laga klassisk skånsk mat som äggakaka, spettekaka och kroppkakor under ledning av kock. Alla ingredienser ingår, ta med hem det du lagat!",
    "Ebbas Fik", "Bruksgatan 20", "Helsingborg", "25221", 19, [1003]),

  // 503 Utflykter & äventyr
  evt(5, 503,
    "Kajaktur till Ven",
    "Paddla kajak över Öresund till ön Ven. Erfarna guider, lunch på ön och transport tillbaka. Grundläggande simkunnighet krävs.",
    "Paddle & Explore", "Råå hamn", "Helsingborg", "25270", 6, [1004]),
  evt(5, 503,
    "Segelbåtstur i Öresund",
    "Upplev Öresund från vattnet på en klassisk segelbåt. Tvåtimmars tur med utsikt mot Kronborg, Ven och Helsingborgs skyline.",
    "Helsingborgs Segelsällskap", "Parapeten 24", "Helsingborg", "25220", 14, [1004]),
  evt(5, 503,
    "Äventyrsparken — klätterbana i skogen",
    "Utmana dig själv i höghöjdsbanor bland trädtopparna. Banor för alla åldrar, från 4 år och uppåt. Säkerhetsutrustning ingår.",
    "Äventyrsparken Skåne", "Rååvägen 10", "Helsingborg", "25265", 22, [1004, 1002]),

  // ── Kategori 6: Lära & utforska ─────────────────────────────
  // 601 Föreläsningar
  evt(6, 601,
    "Föreläsning: Hållbar stadsutveckling",
    "Professor Maria Lindström föreläser om framtidens hållbara stadsplanering med exempel från Helsingborgs H22-projekt. Fri entré.",
    "Campus Helsingborg", "Universitetsplatsen 2", "Helsingborg", "25148", 2, [1003, 1001]),
  evt(6, 601,
    "AI-kväll på Campus Helsingborg",
    "Hur förändrar artificiell intelligens vårt samhälle? Forskare från Lunds universitet presenterar den senaste forskningen. Paneldiskussion efteråt.",
    "Lunds universitet Campus Helsingborg", "Universitetsplatsen 2", "Helsingborg", "25148", 9, [1003]),
  evt(6, 601,
    "Helsingborgs historia — från Kärnan till H22",
    "Stadsantikvarie Peter Nilsson tar dig genom 900 år av Helsingborgs historia. Bildspel, anekdoter och tid för frågor. Anpassat för seniorer.",
    "Stadsbiblioteket Helsingborg", "Bollbrogatan 1", "Helsingborg", "25220", 16, [1003, 1005]),

  // 602 Lär dig...
  evt(6, 602,
    "Keramikverkstad på Kulturhuset",
    "Lär dig grunderna i keramik och dreja din egen skål eller kopp. Material och bränning ingår. Inga förkunskaper krävs.",
    "Dunkers kulturhus", "Kungsgatan 11", "Helsingborg", "25221", 4, [1003]),
  evt(6, 602,
    "Nybörjarkurs i akvarellmålning",
    "Sex veckor med akvarellmålning för nybörjare. Lär dig teknik, färglära och komposition. Material ingår i kursavgiften.",
    "Helsingborgs Konstskola", "Nedre Långvinkelsgatan 3", "Helsingborg", "25221", 7, [1003]),
  evt(6, 602,
    "Fotovandring i Helsingborg",
    "Lär dig ta bättre foton med din mobil eller kamera under en guidad vandring. Tips om komposition, ljus och redigering.",
    "Fotoklubben Helsingborg", "Stortorget 17", "Helsingborg", "25221", 13, [1004]),

  // 603 Träffar & möten
  evt(6, 603,
    "Brädspelskväll på Café Noir",
    "Drop-in brädspelskväll varje onsdag. Vi har över 100 spel att välja bland. Gratis att delta, köp gärna fika i caféet.",
    "Café Noir", "Carl Krooks gata 8", "Helsingborg", "25237", 1, [1003, 1001, 1002]),
  evt(6, 603,
    "Tech Meetup Helsingborg",
    "Nätverksträff för utvecklare, designers och techentusiaster i Helsingborg. Lightning talks, mingel och pizza. Fri entré.",
    "Mindpark", "Bredgatan 11", "Helsingborg", "25225", 10, [1003, 1001]),
  evt(6, 603,
    "Bokcirkel på Stadsbiblioteket",
    "Månadens bok diskuteras i bibliotekets mysiga läshörna. Alla är välkomna, oavsett om du läst boken eller inte. Kaffe serveras.",
    "Stadsbiblioteket Helsingborg", "Bollbrogatan 1", "Helsingborg", "25220", 17, [1003, 1005]),

  // ── Kategori 7: Hälsa & välmående ──────────────────────────
  // 701 Spa & bad
  evt(7, 701,
    "Kallbadhuset — bastu och havsbad",
    "Njut av traditionellt kallbad vid Helsingborgs anrika kallbadhus. Bastu, avkoppling och havsbad med utsikt mot Danmark. Rullstolsanpassat.",
    "Pålsjöbaden", "Pålsjövägen", "Helsingborg", "25225", 3, [1004, 1006]),
  evt(7, 701,
    "Familjedag på Tropical Beach",
    "Heldag i äventyrsbad med vattenrutschbanor, vågor och barnpool. Specialpris för familjer. Cafeteria och omklädningsrum finns.",
    "Tropical Beach", "Gröningen 1", "Helsingborg", "25220", 8, [1003, 1002]),
  evt(7, 701,
    "Bastukväll vid havet — Fria Bad",
    "Vedeldad bastu vid strandkanten, iskallt havsbad och avkoppling under stjärnorna. Handduk ingår. Boka plats i förväg.",
    "Fria Bad Helsingborg", "Tropical Beach-vägen 2", "Helsingborg", "25220", 15, [1004]),

  // 702 Stöd & samverkan
  evt(7, 702,
    "Föräldraträff på Familjecentralen",
    "Öppen träff för nyblivna föräldrar med barn 0–1 år. Barnmorska och BVC-sköterska på plats. Fika ingår. Rullstolsanpassat.",
    "Familjecentralen Helsingborg", "Drottninggatan 14", "Helsingborg", "25221", 5, [1003, 1002, 1006]),
  evt(7, 702,
    "Samtalsgrupp för sörjande",
    "Stödgrupp ledd av utbildad samtalsledare för dig som förlorat en närstående. Sex träffar, en gång i veckan. Kostnadsfritt.",
    "Svenska Kyrkan Helsingborg", "Mariakyrkan", "Helsingborg", "25221", 12, [1003, 1001]),
  evt(7, 702,
    "Seniorträff med föreläsning och fika",
    "Månatlig seniorträff med inspirerande föreläsningar, fika och möjlighet att träffa nya vänner. Denna gång: digital trygghet.",
    "Röda Korset Helsingborg", "Kullagatan 23", "Helsingborg", "25221", 19, [1003, 1005, 1006]),

  // 703 Trosaktiviteter
  evt(7, 703,
    "Mindfulness-meditation i Stadsparken",
    "Gratis guidad meditation utomhus varje söndagsmorgon. Passar alla nivåer. Ta med egen matta eller filt. Vid regn flyttar vi inomhus.",
    "Meditations­gruppen Helsingborg", "Stadsparken", "Helsingborg", "25234", 2, [1001, 1004]),
  evt(7, 703,
    "Kyrkokonsert i Mariakyrkan",
    "Helsingborgs Motettkör framför verk av Bach och Händel i den vackra Mariakyrkan. Fri entré, kollekt till välgörenhet.",
    "Mariakyrkan", "Mariatorget 1", "Helsingborg", "25221", 9, [1003, 1001]),
  evt(7, 703,
    "Interreligiös dialogkväll",
    "Representanter från olika trossamfund samtalar om fred, samexistens och hopp. Öppet för alla, oavsett trosuppfattning. Rullstolsanpassat.",
    "Helsingborgs Interreligiösa Råd", "Stadsbiblioteket, Bollbrogatan 1", "Helsingborg", "25220", 16, [1003, 1006]),
];

// ────────────────────────────────────────────────────────────────
// Client-side filter + paginate helper
// ────────────────────────────────────────────────────────────────

export interface MockFilter {
  categoryCodes?: number[];
  subcategoryCodes?: number[];
  tagCodes?: number[];
  pageSize?: number;
}

export function filterMockEvents(filter: MockFilter = {}): {
  items: EventDto[];
  totalCount: number;
} {
  let result = MOCK_EVENTS;

  if (filter.categoryCodes?.length) {
    result = result.filter((e) =>
      e.categories.some((c) => filter.categoryCodes!.includes(c.code)),
    );
  }

  if (filter.subcategoryCodes?.length) {
    result = result.filter((e) =>
      e.subcategories.some((s) => filter.subcategoryCodes!.includes(s.code)),
    );
  }

  if (filter.tagCodes?.length) {
    result = result.filter((e) =>
      filter.tagCodes!.every((tc) => e.tags.some((t) => t.code === tc)),
    );
  }

  // Sort by startDate ascending
  result = [...result].sort((a, b) => {
    if (!a.startDate) return 1;
    if (!b.startDate) return -1;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  const totalCount = result.length;
  const pageSize = filter.pageSize ?? 30;

  return {
    items: result.slice(0, pageSize),
    totalCount,
  };
}
