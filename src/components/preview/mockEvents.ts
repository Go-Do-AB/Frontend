/**
 * Mock events for the preview phone demo.
 *
 * Based on real Helsingborg Events API data structure and authentic
 * Swedish events from the Helsingborg/Nordvästra Skåne region.
 *
 * Coverage:
 *  - 8 categories × 3 subcategories × ~5 events = ~120+ events
 *  - 6 cities, each with 10+ events
 *  - Every tag (1001-1006) appears on many events
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
  8: { name: "Kul för barn", nameSv: "Kul för barn" },
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
  801: { name: "0–4 år", nameSv: "0–4 år" },
  802: { name: "5–10 år", nameSv: "5–10 år" },
  803: { name: "11–15 år", nameSv: "11–15 år" },
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
// 130+ mock events — realistic Skåne events across 6 cities
// Each category: 10+ events | Each city: 10+ events
// ────────────────────────────────────────────────────────────────

export const MOCK_EVENTS: EventDto[] = [
  // ══════════════════════════════════════════════════════════════
  // Kategori 8: Kul för barn (Kids first — family-friendly order)
  // ══════════════════════════════════════════════════════════════

  // 801 — 0–4 år
  evt(8, 801, "Babyrytmik på Familjecentralen", "Sång, musik och rörelse för de allra minsta. Barnmorska finns på plats. Gratis drop-in för barn 0–2 år med förälder.", "Familjecentralen Helsingborg", "Drottninggatan 14", "Helsingborg", "25221", 2, [1001, 1003, 1002, 1006]),
  evt(8, 801, "Sagostund på Stadsbiblioteket", "Bibliotekarien läser sagor och sjunger sånger för barn 1–3 år. Gratis, ingen anmälan krävs. Mjuka mattor och kuddar.", "Stadsbiblioteket Helsingborg", "Bollbrogatan 1", "Helsingborg", "25220", 5, [1001, 1003, 1002]),
  evt(8, 801, "Småbarnsdisco på Kulturhuset", "Dansa, lek och bubbelbad av musik för de yngsta! Anpassat för barn 0–4 år. Fika till föräldrarna.", "Malmö Kulturhus", "Södergatan 8", "Malmö", "21134", 3, [1003, 1002]),
  evt(8, 801, "Kryp & kläng på lekplatsen", "Organiserad utomhuslek för småbarn med pedagoger. Hinderbana, sandlåda och vattenlek. Gratis, drop-in.", "Lunds kommun", "Stadsparken", "Lund", "22100", 7, [1001, 1004, 1002]),

  // 802 — 5–10 år
  evt(8, 802, "Barnens dag på Fredriksdal", "Ansiktsmålning, trollerishow, ponnyriding och glasstånd. Hela dagen med aktiviteter för barn 5–10 år.", "Fredriksdals museer", "Gisela Trapps väg 1", "Helsingborg", "25431", 4, [1004, 1002]),
  evt(8, 802, "Lego-byggverkstad", "Bygg fritt med tusentals legobitar! Tävling om bästa bygge med priser. Alla barn 5–12 år välkomna.", "Landskrona Kulturhus", "Kasernplan 1", "Landskrona", "26131", 6, [1003, 1002, 1001]),
  evt(8, 802, "Cirkusskola för barn", "Lär dig jonglera, balansera och göra akrobatik. Professionella cirkusartister leder workshopen. Ingen erfarenhet krävs.", "Cirkus Helsingborg", "Sundstorget 1", "Helsingborg", "25221", 8, [1003, 1002]),
  evt(8, 802, "Barnteater: Trollskogen", "En magisk föreställning om djuren i skogen. Sång, dans och interaktion med publiken. För barn 4–9 år.", "Malmö Stadsteater", "Östra Rönneholmsvägen 20", "Malmö", "21147", 10, [1003, 1002]),
  evt(8, 802, "Skattjakt i stadsparken", "Följ ledtrådar och hitta skatten! Organiserad skattjakt med priser. Gratis deltagande, samling vid entrén.", "Ängelholms kommun", "Hembygdsparken", "Ängelholm", "26235", 12, [1001, 1004, 1002]),

  // 803 — 11–15 år
  evt(8, 803, "Ungdomskodkväll", "Lär dig programmera spel med Scratch och Python. Datorer finns på plats. Gratis för 11–15-åringar.", "Mindpark Helsingborg", "Bredgatan 11", "Helsingborg", "25225", 3, [1001, 1003]),
  evt(8, 803, "Graffiti-workshop för unga", "Lär dig streetart-teknik med professionella konstnärer. Allt material ingår. Kläder som tål färg rekommenderas.", "Höganäs Kulturskola", "Långarödsvägen 4", "Höganäs", "26332", 9, [1004, 1002]),
  evt(8, 803, "Ungdomsfilmfestival", "Visa din egen kortfilm eller titta på andras! Filmtävling för 12–18-åringar med jury och priser.", "Dunkers kulturhus", "Kungsgatan 11", "Helsingborg", "25221", 14, [1003]),
  evt(8, 803, "Skateboard-klinik", "Prova skateboard med instruktörer från lokala skateföreningen. Hjälm och skydd finns att låna.", "Landskrona Skatepark", "Rådmansgatan 10", "Landskrona", "26131", 16, [1004, 1001]),
  evt(8, 803, "E-sport-turnering för ungdomar", "Tävla i populära spel med vänner! Datorer och konsoler finns. Fikabuffé ingår.", "Lunds ungdomshus", "Kiliansgatan 9", "Lund", "22100", 19, [1003, 1002]),

  // ══════════════════════════════════════════════════════════════
  // Kategori 1: Evenemang
  // ══════════════════════════════════════════════════════════════

  // 101 Festivaler & skoj
  evt(1, 101, "Sommarfestival på Sundstorget", "Helsingborgs stora sommarfestival med livemusik, street food och aktiviteter för hela familjen.", "Helsingborgs stad", "Sundstorget", "Helsingborg", "25221", 5, [1001, 1004, 1002]),
  evt(1, 101, "Helsingborgs Kulturnatt", "En kväll fylld av kultur, konst och musik på platser runt om i staden. Museer och scener håller öppet till midnatt.", "Helsingborgs stad", "Stortorget 17", "Helsingborg", "25221", 12, [1001, 1004, 1006]),
  evt(1, 101, "Malmöfestivalen", "Skandinaviens största stadsfestival med musik, mat och kultur i åtta dagar. Gratis entré till alla scener.", "Malmö stad", "Gustav Adolfs torg", "Malmö", "21139", 18, [1001, 1004, 1002]),
  evt(1, 101, "Midsommarfirande i Höganäs", "Traditionellt midsommarfirande med dans kring stången, sill och jordgubbar. Levande folkmusik hela dagen.", "Höganäs kommun", "Kvickbadet", "Höganäs", "26339", 22, [1001, 1004, 1002]),

  // 102 Fritid & livsstil
  evt(1, 102, "Hälsomässan Helsingborg", "Sveriges ledande hälsomässa med föreläsningar, provträning och utställare. Fri entré.", "Helsingborg Arena", "Mellersta Stenbocksgatan 16", "Helsingborg", "25437", 3, [1001, 1003, 1006]),
  evt(1, 102, "Loppmarknad på Fredriksdal", "Stor loppmarknad i den vackra miljön på Fredriksdals friluftsmuseum. Hundratals säljare.", "Fredriksdals museer", "Gisela Trapps väg 1", "Helsingborg", "25431", 7, [1004]),
  evt(1, 102, "Trädgårdsmässa i Lund", "Inspiration för trädgårdsentusiaster med workshops, växtförsäljning och föreläsningar om hållbar odling.", "Lunds kommun", "Botaniska trädgården", "Lund", "22100", 14, [1004, 1005]),
  evt(1, 102, "Vintagemässan Malmö", "Kläder, möbler och kuriosa från 50-tal till 90-tal. Över 80 utställare under ett tak.", "Malmö Live", "Dag Hammarskjölds torg 4", "Malmö", "21118", 20, [1003]),

  // 103 Mässor & marknader
  evt(1, 103, "Julmarknad på Stortorget", "Traditionell julmarknad med glögg, pepparkakor, hantverk och julklappar.", "Helsingborgs stad", "Stortorget", "Helsingborg", "25221", 2, [1004, 1002]),
  evt(1, 103, "Bondens egen marknad", "Köp direkt från lokala bönder. Färska grönsaker, ost, bröd och charkuterier från Skåne.", "Bondens egen marknad", "Konsul Olssons plats", "Helsingborg", "25224", 9, [1004, 1001]),
  evt(1, 103, "Antik- och designmarknad Malmö", "Skandinaviens största antik- och designmarknad med 200+ utställare. Möbler, konst och smycken.", "Malmö Arena", "Hyllie Stationstorg 2", "Malmö", "21532", 15, [1003]),
  evt(1, 103, "Fiskmarknad i Ängelholm", "Färsk fisk direkt från båtarna. Skaldjur, rökt fisk och lokala delikatesser vid hamnen.", "Ängelholms Fiskeförening", "Hamnen", "Ängelholm", "26234", 11, [1004, 1001]),
  evt(1, 103, "Keramikmarknad Höganäs", "Höganäs berömda keramiktradition lever vidare. Lokala keramiker säljer sina verk. Demobränning.", "Höganäs Keramik", "Fabriksgatan 2", "Höganäs", "26339", 17, [1004]),

  // ══════════════════════════════════════════════════════════════
  // Kategori 3: Underhållning
  // ══════════════════════════════════════════════════════════════

  // 301 Bio & film
  evt(3, 301, "Utomhusbio i Stadsparken", "Gratis filmvisning under bar himmel. Ta med filt och picknick — svensk filmklassiker.", "Helsingborgs stad", "Stadsparken", "Helsingborg", "25234", 3, [1001, 1004, 1002]),
  evt(3, 301, "Filmfestival på Dunkers", "Tre dagars filmfestival med skandinavisk film. Visningar, panelsamtal med regissörer.", "Dunkers kulturhus", "Kungsgatan 11", "Helsingborg", "25221", 13, [1003]),
  evt(3, 301, "Barnfilmsdag i Lund", "Specialprogram för barn med animerade filmer och popcornfest. Anpassat för barn 3–10 år.", "Filmstaden Lund", "Botulfsgatan 1", "Lund", "22100", 19, [1003, 1002, 1005]),
  evt(3, 301, "Dokumentärfilmkväll Malmö", "Visning av prisbelönt dokumentärfilm följd av samtal med regissören. Fri entré.", "Panora Bio", "Friisgatan 19D", "Malmö", "21146", 8, [1003, 1001]),

  // 302 Musik & konserter
  evt(3, 302, "Konsert på Sofiero Slott", "Livemusik i slottsparken. Picknickfilt och sommarkväll med akustisk musik och solnedgång.", "Sofiero Slott", "Sofiero Slottsväg 131", "Helsingborg", "25489", 2, [1004]),
  evt(3, 302, "Jazz på Dunkers kulturhus", "Internationella jazzmusiker i Dunkers intima konsertsal. Kvällens gäst: Nils Landgren Funk Unit.", "Dunkers kulturhus", "Kungsgatan 11", "Helsingborg", "25221", 8, [1003, 1006]),
  evt(3, 302, "Sommarkonsert i Ramlösa", "Gratis utomhuskonsert i idylliska Ramlösa Brunnspark. Symfoniorkestern spelar klassiska favoriter.", "Helsingborgs Konserthus", "Ramlösa Brunnspark", "Helsingborg", "25660", 16, [1001, 1004]),
  evt(3, 302, "Livekonsert på Babel Malmö", "Indie-rock från skandinaviska band. Ståplats, biljetter via hemsidan.", "Babel Malmö", "Spångatan 38", "Malmö", "21124", 6, [1003]),
  evt(3, 302, "Folkmusikkväll i Ängelholm", "Traditionell svensk folkmusik med fiol, nyckelharpa och dragspel. Dansband efteråt.", "Ängelholms Folkets Hus", "Storgatan 40", "Ängelholm", "26232", 10, [1003, 1005]),

  // 303 Teater & shower
  evt(3, 303, "Hamlet på Stadsteatern", "Shakespeares klassiker i modern tappning. Regi: Sofia Jupither. Rullstolsplatser finns.", "Helsingborgs Stadsteater", "Karl Johans gata 1", "Helsingborg", "25221", 5, [1003, 1006]),
  evt(3, 303, "Ståuppkväll i Malmö", "Skånes roligaste komiker. Tre akter med paus. Mingel och bar. Åldersgräns 18 år.", "The Tivoli", "Södergatan 15", "Malmö", "21134", 10, [1003]),
  evt(3, 303, "Barnteater: Pippi Långstrump", "Astrid Lindgrens älskade Pippi lever på scenen! Sång, dans och bus för hela familjen.", "Helsingborgs Stadsteater", "Karl Johans gata 1", "Helsingborg", "25221", 21, [1003, 1002]),
  evt(3, 303, "Improvisationsteater Lund", "Spontan teater baserad på publikens förslag. Varje föreställning är unik! Alla åldrar.", "Lunds Studentteater", "Sölvegatan 22", "Lund", "22100", 15, [1003, 1001]),

  // ══════════════════════════════════════════════════════════════
  // Kategori 2: Idrott & sport
  // ══════════════════════════════════════════════════════════════

  // 201 Sport att utöva
  evt(2, 201, "Parkrun Helsingborg", "Gratis 5 km löpning varje lördag i Pålsjö Skog. Alla välkomna — spring, jogga eller gå.", "Parkrun Sverige", "Pålsjö Skog", "Helsingborg", "25225", 1, [1001, 1004]),
  evt(2, 201, "Strandloppet i Ria", "10 km löpning längs kusten från Råå hamn. Fantastisk utsikt över Öresund.", "Helsingborgs IF", "Råå hamn", "Helsingborg", "25270", 8, [1004]),
  evt(2, 201, "Yoga i Slottsträdgården Malmö", "Utomhusyoga varje söndag morgon. Ta med egen matta. Alla nivåer välkomna. Gratis.", "Yoga Malmö", "Slottsträdgården", "Malmö", "21148", 4, [1001, 1004]),
  evt(2, 201, "Löparträning Landskrona", "Grupplöpning 5–10 km längs kusten. Nybörjare och erfarna. Samling vid hamnen.", "Landskrona Löparklubb", "Hamnen", "Landskrona", "26131", 6, [1001, 1004]),

  // 202 Sport att se på
  evt(2, 202, "HIF mot Djurgården — Allsvenskan", "Allsvensk fotboll på Olympia. HIF tar emot Djurgården. Biljetter på hif.se.", "Helsingborgs IF", "Olympiavägen 1", "Helsingborg", "25438", 4, [1004]),
  evt(2, 202, "Rögle BK mot Frölunda — SHL", "Hockeymatch i SHL! Catena Arena. En av säsongens hetaste matcher.", "Rögle BK", "Ishallsvägen 1", "Ängelholm", "26254", 11, [1003]),
  evt(2, 202, "Helsingborg Marathon", "Årlig maratontävling. 5 km, halvmaraton och fullt maraton genom stadens vackraste delar.", "Helsingborg Marathon", "Hamntorget 1", "Helsingborg", "25218", 22, [1004, 1006]),
  evt(2, 202, "Malmö FF — hemmapremiär", "Allsvensk fotbollspremiär på Stadion. MFF möter Hammarby. Publikfest innan match.", "Malmö FF", "Stadion", "Malmö", "21745", 9, [1004]),
  evt(2, 202, "Landskrona BoIS — fotboll", "Superettan-match på Landskrona IP. Publikvänlig atmosfär med stå- och sittplats.", "Landskrona BoIS", "Landskrona IP", "Landskrona", "26133", 13, [1004]),

  // 203 Sport att prova
  evt(2, 203, "Prova-på padel — gratis", "Testa padel med instruktörer. Racket och bollar lånas ut. Alla nivåer.", "Padel Center Helsingborg", "Ättekullsvägen 26", "Helsingborg", "25268", 6, [1001, 1003]),
  evt(2, 203, "Segling för nybörjare", "Lär dig grunderna i segling. Båtar och flytvästar ingår. Sommaraktivitet!", "Helsingborgs Segelsällskap", "Parapeten 24", "Helsingborg", "25220", 10, [1004, 1002]),
  evt(2, 203, "Klätterkväll på Klättercentret", "Prova bouldering och topprepklättring. Utrustning ingår. Barn från 6 år med vuxen.", "Klättercentret Helsingborg", "Garnisonsgatan 53", "Helsingborg", "25466", 17, [1003, 1002]),
  evt(2, 203, "Surfskola i Höganäs", "Prova surfing vid Skånes bästa strand. Våtdräkt och bräda ingår. Nybörjarkurs 2 timmar.", "Surf Skåne", "Strandbadsvägen", "Höganäs", "26339", 7, [1004, 1002]),
  evt(2, 203, "Prova på disc golf Lund", "Introduktion till disc golf i Lunds fina bana. Discar att låna. Gratis, drop-in.", "Lunds Frisbeeklubb", "Höjeådalen", "Lund", "22100", 5, [1001, 1004]),

  // ══════════════════════════════════════════════════════════════
  // Kategori 5: Upplevelser & äventyr
  // ══════════════════════════════════════════════════════════════

  // 501 Parker & stigar
  evt(5, 501, "Vandring i Söderåsen", "Guidad vandring genom dramatiska raviner och urskogar. 8 km, ca 4 timmar. Ta med matsäck.", "Naturum Söderåsen", "Skäralid", "Höganäs", "26353", 3, [1004, 1001]),
  evt(5, 501, "Promenad i Fredriksdals trädgårdar", "Botanisk vandring med expert. Växter, kryddgårdar och historiska odlingsmetoder.", "Fredriksdals museer", "Gisela Trapps väg 1", "Helsingborg", "25431", 8, [1004, 1005]),
  evt(5, 501, "Kvällspromenad i Ramlösa", "Guidad kvällspromenad i atmosfäriska Ramlösa Brunnspark. Parkens historia som kurort.", "Helsingborgs stad", "Ramlösa Brunnspark", "Helsingborg", "25660", 15, [1004]),
  evt(5, 501, "Strandvandring Kullaberg", "Guidad vandring längs Kullabergs dramatiska kust. Klippor, grottor och havsutsikt. 6 km.", "Kullabergs Naturreservat", "Kullaberg", "Höganäs", "26398", 11, [1004]),
  evt(5, 501, "Skogsbad i Dalby Söderskog", "Upplev skogens läkande kraft med guidad skogsbadspromenad. Mindfulness i naturen.", "Lunds Naturförening", "Dalby Söderskog", "Lund", "22466", 18, [1004]),

  // 502 Mat & dryck
  evt(5, 502, "Helsingborg Food Walk", "Kulinarisk stadsvandring med smakprov på fem restauranger. Upptäck matscenen.", "Helsingborg Food Tours", "Stortorget 17", "Helsingborg", "25221", 5, [1004]),
  evt(5, 502, "Ölprovning på Helsingborgs Bryggeri", "Sex lokala hantverksöl med bryggmästaren som guide. Ost och bröd ingår.", "Helsingborgs Bryggeri", "Bergaliden 30", "Helsingborg", "25244", 12, [1003]),
  evt(5, 502, "Matlagningskväll — skånsk husmanskost", "Laga äggakaka, spettekaka och kroppkakor. Alla ingredienser ingår.", "Ebbas Fik", "Bruksgatan 20", "Helsingborg", "25221", 19, [1003]),
  evt(5, 502, "Vinprovning i Landskrona", "Prova skånska viner från lokala vingårdar. Ost och charkuterier ingår. 18+.", "Landskrona Vingård", "Borstahusen", "Landskrona", "26178", 9, [1003]),
  evt(5, 502, "Streetfood-festival Malmö", "Mat från hela världen i Folkets Park. 30+ foodtrucks, livemusik och barnaktiviteter.", "Malmö Streetfood", "Folkets Park", "Malmö", "21445", 14, [1004, 1002, 1001]),

  // 503 Utflykter & äventyr
  evt(5, 503, "Kajaktur till Ven", "Paddla kajak till ön Ven. Erfarna guider, lunch på ön. Grundläggande simkunnighet krävs.", "Paddle & Explore", "Råå hamn", "Helsingborg", "25270", 6, [1004]),
  evt(5, 503, "Segelbåtstur i Öresund", "Upplev Öresund från vattnet. Tvåtimmars tur med utsikt mot Kronborg och Ven.", "Helsingborgs Segelsällskap", "Parapeten 24", "Helsingborg", "25220", 14, [1004]),
  evt(5, 503, "Äventyrsparken Landskrona", "Klätterbana i trädtopparna. Banor för alla åldrar, från 4 år. Säkerhetsutrustning ingår.", "Äventyrsparken Skåne", "Rååvägen 10", "Landskrona", "26135", 22, [1004, 1002]),
  evt(5, 503, "Cykeltur Helsingborg–Höganäs", "Guidad cykeltur längs kusten. 30 km med fikapauser. Cykel kan hyras. Alla nivåer.", "Cykelturism Skåne", "Hamntorget", "Helsingborg", "25218", 10, [1004]),
  evt(5, 503, "Båttur i Lundåkrabukten", "Rundtur med fiskebåt. Se sälar, fåglar och kustlandskapet. Familjevänligt.", "Ängelholms Båtcharter", "Skeppargatan", "Ängelholm", "26234", 16, [1004, 1002]),

  // ══════════════════════════════════════════════════════════════
  // Kategori 4: Kultur & sevärdheter
  // ══════════════════════════════════════════════════════════════

  // 401 Guidade turer
  evt(4, 401, "Historisk stadsvandring Helsingborg", "Guidad vandring genom 900 års historia. Från Kärnan till hamnen — kungar, krig och handel.", "Helsingborgs Turistbyrå", "Stortorget 17", "Helsingborg", "25221", 1, [1004, 1005]),
  evt(4, 401, "Guidad tur på Kärnan", "Utforska det medeltida tornet med kunnig guide. Panoramautsikt över Öresund.", "Helsingborgs museer", "Slottshagen", "Helsingborg", "25221", 7, [1004]),
  evt(4, 401, "Slottsvandring på Sofiero", "Guidad tur genom slottets trädgårdar och salar. Kungafamiljens sommarnöjen.", "Sofiero Slott", "Sofiero Slottsväg 131", "Helsingborg", "25489", 14, [1004, 1006]),
  evt(4, 401, "Spökvandring i Landskrona", "Guidad kvällsvandring bland stadens spökhistorier och myter. Ficklampa rekommenderas.", "Visit Landskrona", "Stortorget", "Landskrona", "26131", 5, [1004]),
  evt(4, 401, "Rundvandring i Lunds Domkyrka", "Upptäck Nordens mest besökta kyrka med auktoriserad guide. 800 år av historia.", "Lunds Domkyrkoförsamling", "Kyrkogatan 4", "Lund", "22100", 11, [1003, 1006]),

  // 402 Konst & gallerier
  evt(4, 402, "Utställning: Havet och vi", "Interaktiv utställning om Öresunds historia och framtid. Perfekt för skolklasser.", "Dunkers kulturhus", "Kungsgatan 11", "Helsingborg", "25221", 4, [1003, 1002, 1006]),
  evt(4, 402, "Konstnatt Helsingborg", "Gallerier och ateljéer i hela staden håller öppet. Gratis vernissage med konstnärer.", "Helsingborgs Konstförening", "Stortorget 17", "Helsingborg", "25221", 9, [1001, 1003]),
  evt(4, 402, "Gatukonstvandring i Söder", "Upptäck gatukonst och muralmålningar. Gratis guidad vandring, ingen anmälan krävs.", "Street Art Helsingborg", "Södergatan 12", "Helsingborg", "25225", 18, [1001, 1004]),
  evt(4, 402, "Moderna Museet Malmö — ny utställning", "Samtidskonst från nordiska konstnärer. Interaktiva installationer och videoverk.", "Moderna Museet Malmö", "Gasverksgatan 22", "Malmö", "21131", 6, [1003, 1006]),
  evt(4, 402, "Konstuställning Höganäs", "Lokala konstnärer visar målningar, skulpturer och keramik. Vernissage med vin.", "Höganäs Konsthall", "Storgatan 19", "Höganäs", "26332", 13, [1003]),

  // 403 Museer & sevärdheter
  evt(4, 403, "Fredriksdals friluftsmuseum — familjedag", "1800-talets Skåne med hästar, getter, hantverk och gammaldags lekar.", "Fredriksdals museer", "Gisela Trapps väg 1", "Helsingborg", "25431", 2, [1004, 1002]),
  evt(4, 403, "Landskrona Museum — vikingautställning", "Vikingatiden i NV Skåne. Originalfynd, interaktiva stationer.", "Landskrona Museum", "Slottsgatan 1", "Landskrona", "26131", 11, [1003, 1002, 1006]),
  evt(4, 403, "Kulturen i Lund", "Skandinaviens äldsta friluftsmuseum. Historiska hus, trädgårdar och utställningar.", "Kulturen", "Tegnérsplatsen", "Lund", "22350", 8, [1004, 1002]),
  evt(4, 403, "Malmö Museer — slottet", "Utforska Malmöhus slott med konst-, natur- och stadshistoria under ett tak.", "Malmö Museer", "Malmöhusvägen 6", "Malmö", "21118", 16, [1003, 1002, 1006]),

  // ══════════════════════════════════════════════════════════════
  // Kategori 6: Lära & utforska
  // ══════════════════════════════════════════════════════════════

  // 601 Föreläsningar
  evt(6, 601, "Föreläsning: Hållbar stadsutveckling", "Professor Maria Lindström om framtidens stadsplanering med H22-exempel. Fri entré.", "Campus Helsingborg", "Universitetsplatsen 2", "Helsingborg", "25148", 2, [1003, 1001]),
  evt(6, 601, "AI-kväll på Campus", "Hur förändrar AI vårt samhälle? Forskare från Lunds universitet presenterar ny forskning.", "Lunds universitet", "Universitetsplatsen 2", "Helsingborg", "25148", 9, [1003]),
  evt(6, 601, "Helsingborgs historia — föreläsning", "Stadsantikvarie Peter Nilsson: 900 år av historia. Bildspel, anekdoter och frågestund.", "Stadsbiblioteket", "Bollbrogatan 1", "Helsingborg", "25220", 16, [1003, 1005]),
  evt(6, 601, "Klimatföreläsning Lund", "Forskare från LUCSUS om klimatanpassning i Skåne. Paneldiskussion efter. Gratis.", "Lunds universitet", "Geocentrum", "Lund", "22100", 7, [1003, 1001]),
  evt(6, 601, "Författarkväll Malmö", "Prisbelönt författare läser ur ny roman och berättar om skrivprocessen. Signering.", "Malmö Stadsbibliotek", "Kung Oscars väg 11", "Malmö", "21114", 13, [1003]),

  // 602 Lär dig...
  evt(6, 602, "Keramikverkstad på Kulturhuset", "Lär dig grunderna i keramik och dreja en skål eller kopp. Material och bränning ingår.", "Dunkers kulturhus", "Kungsgatan 11", "Helsingborg", "25221", 4, [1003]),
  evt(6, 602, "Nybörjarkurs i akvarellmålning", "Sex veckor med akvarellmålning. Teknik, färglära och komposition. Material ingår.", "Helsingborgs Konstskola", "Nedre Långvinkelsgatan 3", "Helsingborg", "25221", 7, [1003]),
  evt(6, 602, "Fotovandring i Lund", "Lär dig ta bättre foton med mobil eller kamera. Tips om komposition och ljus.", "Fotoklubben Lund", "Stortorget 1", "Lund", "22222", 13, [1004]),
  evt(6, 602, "Surdegsbröd-workshop", "Baka surdegsbröd från grunden. Lär dig om fermentering och smaksättning. Ta med hem ditt bröd.", "Bageriet Ängelholm", "Storgatan 22", "Ängelholm", "26231", 10, [1003]),
  evt(6, 602, "Stickkurs för nybörjare", "Lär dig sticka vantar och mössor. Garn och stickor ingår. Fika serveras.", "Höganäs Hemslöjd", "Köpmansgatan 10", "Höganäs", "26332", 15, [1003, 1005]),

  // 603 Träffar & möten
  evt(6, 603, "Brädspelskväll på Café Noir", "Drop-in brädspelskväll varje onsdag. 100+ spel. Gratis, köp gärna fika.", "Café Noir", "Carl Krooks gata 8", "Helsingborg", "25237", 1, [1003, 1001, 1002]),
  evt(6, 603, "Tech Meetup Helsingborg", "Nätverksträff för utvecklare, designers och techentusiaster. Lightning talks och pizza. Fri entré.", "Mindpark", "Bredgatan 11", "Helsingborg", "25225", 10, [1003, 1001]),
  evt(6, 603, "Bokcirkel på Stadsbiblioteket", "Månadens bok diskuteras. Alla välkomna, oavsett om du läst boken. Kaffe serveras.", "Stadsbiblioteket Malmö", "Kung Oscars väg 11", "Malmö", "21114", 17, [1003, 1005]),
  evt(6, 603, "Språkcafé — svenska för nyanlända", "Öva svenska i avslappnad miljö. Fika ingår. Alla språknivåer välkomna.", "Landskrona Bibliotek", "Rådhustorget 1", "Landskrona", "26131", 5, [1003, 1001, 1006]),
  evt(6, 603, "Träffpunkt för ensamma föräldrar", "Nätverksträff för ensamstående föräldrar. Barn leker medan vuxna minglar. Fika.", "Ängelholms Familjecentral", "Storgatan 50", "Ängelholm", "26232", 12, [1003, 1002, 1001]),

  // ══════════════════════════════════════════════════════════════
  // Kategori 7: Hälsa & välmående
  // ══════════════════════════════════════════════════════════════

  // 701 Spa & bad
  evt(7, 701, "Kallbadhuset — bastu och havsbad", "Traditionellt kallbad vid anrika kallbadhuset. Bastu, avkoppling och havsbad. Rullstolsanpassat.", "Pålsjöbaden", "Pålsjövägen", "Helsingborg", "25225", 3, [1004, 1006]),
  evt(7, 701, "Familjedag på Tropical Beach", "Heldag i äventyrsbad. Vattenrutschbanor, vågor och barnpool. Specialpris för familjer.", "Tropical Beach", "Gröningen 1", "Helsingborg", "25220", 8, [1003, 1002]),
  evt(7, 701, "Bastukväll vid havet", "Vedeldad bastu vid strandkanten, havsbad och avkoppling under stjärnorna. Handduk ingår.", "Fria Bad", "Tropical Beach-vägen 2", "Helsingborg", "25220", 15, [1004]),
  evt(7, 701, "Ribersborgs kallbadhus Malmö", "Klassisk kallbadupplevelse med bastu och havsbad. Öppet hela året.", "Ribban", "Limhamnsvägen", "Malmö", "21614", 5, [1004, 1006]),
  evt(7, 701, "Spa-dag i Höganäs", "Heldag med massage, ansiktsbehandling och havsvattenpool. Lunch ingår.", "Höganäs Spa", "Strandvägen 1", "Höganäs", "26339", 11, [1003]),

  // 702 Stöd & samverkan
  evt(7, 702, "Föräldraträff på Familjecentralen", "Öppen träff för nyblivna föräldrar (barn 0–1 år). Barnmorska på plats. Fika ingår.", "Familjecentralen", "Drottninggatan 14", "Helsingborg", "25221", 5, [1003, 1002, 1006]),
  evt(7, 702, "Samtalsgrupp för sörjande", "Stödgrupp för dig som förlorat en närstående. Sex träffar, en/vecka. Kostnadsfritt.", "Svenska Kyrkan", "Mariakyrkan", "Helsingborg", "25221", 12, [1003, 1001]),
  evt(7, 702, "Seniorträff med föreläsning", "Månatlig seniorträff med inspiration, fika och nya vänner. Tema: digital trygghet.", "Röda Korset", "Kullagatan 23", "Helsingborg", "25221", 19, [1003, 1005, 1006]),
  evt(7, 702, "Anhörigstöd Landskrona", "Stödgrupp för dig som vårdar en närstående. Erfarenhetsutbyte och avlastning.", "Landskrona kommun", "Rådhuset", "Landskrona", "26131", 8, [1003, 1001, 1006]),
  evt(7, 702, "Volontärträff Malmö", "Bli volontär! Introduktionsträff för dig som vill hjälpa till. Många uppdrag att välja bland.", "Volontärbyrån Malmö", "Bergsgatan 20", "Malmö", "21254", 14, [1003, 1001]),

  // 703 Trosaktiviteter
  evt(7, 703, "Mindfulness-meditation i Stadsparken", "Gratis guidad meditation utomhus. Alla nivåer. Ta med matta eller filt. Vid regn: inomhus.", "Meditationsgruppen", "Stadsparken", "Helsingborg", "25234", 2, [1001, 1004]),
  evt(7, 703, "Kyrkokonsert i Mariakyrkan", "Motettkör framför Bach och Händel i vackra Mariakyrkan. Fri entré, kollekt.", "Mariakyrkan", "Mariatorget 1", "Helsingborg", "25221", 9, [1003, 1001]),
  evt(7, 703, "Interreligiös dialogkväll", "Representanter från trossamfund samtalar om fred och samexistens. Öppet för alla.", "Interreligiösa Rådet", "Stadsbiblioteket", "Helsingborg", "25220", 16, [1003, 1006]),
  evt(7, 703, "Yoga och meditation Lund", "Kombinerad yoga och meditationsklass i lugn miljö. Nybörjarvänligt. Gratis prova-på.", "Lunds Yogacenter", "Klostergatan 5", "Lund", "22100", 6, [1003, 1001]),
  evt(7, 703, "Pilgrimsvandring Ängelholm", "Guidad vandring längs pilgrimsleden. Samtal, tystnad och naturnära reflektion.", "Ängelholms Pastorat", "S:t Petri Kyrka", "Ängelholm", "26234", 13, [1004]),

  // ══════════════════════════════════════════════════════════════
  // Extra events for city coverage (Ängelholm + Höganäs → 10+)
  // ══════════════════════════════════════════════════════════════

  // Ängelholm extras
  evt(3, 302, "Jazzkväll i Ängelholm", "Lokala jazzmusiker spelar i Hembygdsparkens musikpaviljong. Medtag picknick. Gratis.", "Ängelholms Jazzförening", "Hembygdsparken", "Ängelholm", "26235", 4, [1004, 1001]),
  evt(4, 403, "Teknikens Hus Ängelholm", "Interaktivt museum med experiment och uppfinningar. Perfekt för nyfikna barn och vuxna.", "Teknikens Hus", "Järnvägsgatan 5", "Ängelholm", "26231", 8, [1003, 1002]),
  evt(8, 802, "Barnens lekdag på stranden", "Sandslottstävling, strandlekar och glass. Gratis aktivitet för barn 4–12 år.", "Ängelholms kommun", "Skälderviken", "Ängelholm", "26235", 14, [1004, 1001, 1002]),

  // Höganäs extras
  evt(4, 401, "Keramikrundtur i Höganäs", "Guidad tur till historiska keramikfabriker och ateljéer. Lär dig om Höganäs keramiktradition.", "Visit Höganäs", "Storgatan 19", "Höganäs", "26332", 4, [1004]),
  evt(1, 102, "Fiskedag i Mölle hamn", "Prova sportfiske från bryggan. Utrustning att låna. Grillning av fångsten efteråt. Familjevänligt.", "Mölle Fiskeförening", "Mölle hamn", "Höganäs", "26342", 10, [1004, 1002, 1001]),
  evt(7, 701, "Havsbad vid Skärets badplats", "Organiserad morgonsimning med simledare. Alla nivåer. Fika efteråt i strandkiosken.", "Höganäs Simsällskap", "Skärets badplats", "Höganäs", "26339", 7, [1004, 1001]),
];

// ────────────────────────────────────────────────────────────────
// Client-side filter + sort + paginate helper
// ────────────────────────────────────────────────────────────────

export type SortMode = "date_asc" | "date_desc" | "alpha_asc";

export interface MockFilter {
  categoryCodes?: number[];
  subcategoryCodes?: number[];
  tagCodes?: number[];
  searchText?: string;
  cities?: string[];
  startDate?: string | null;
  endDate?: string | null;
  sortMode?: SortMode;
  pageSize?: number;
}

export function filterMockEvents(filter: MockFilter = {}): {
  items: EventDto[];
  totalCount: number;
} {
  let result = MOCK_EVENTS;

  if (filter.searchText?.trim()) {
    const q = filter.searchText.trim().toLowerCase();
    result = result.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        (e.description && e.description.toLowerCase().includes(q)) ||
        (e.city && e.city.toLowerCase().includes(q)) ||
        (e.organiser && e.organiser.toLowerCase().includes(q)),
    );
  }

  if (filter.cities?.length) {
    result = result.filter((e) =>
      e.city ? filter.cities!.includes(e.city) : false,
    );
  }

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

  if (filter.startDate) {
    const start = new Date(filter.startDate).getTime();
    result = result.filter((e) => {
      if (!e.startDate) return true;
      return new Date(e.startDate).getTime() >= start;
    });
  }

  if (filter.endDate) {
    const end = new Date(filter.endDate).getTime() + 86400000; // include end day
    result = result.filter((e) => {
      if (!e.startDate) return true;
      return new Date(e.startDate).getTime() <= end;
    });
  }

  // Sort
  const sortMode = filter.sortMode ?? "date_asc";
  result = [...result].sort((a, b) => {
    if (sortMode === "alpha_asc") {
      return a.title.localeCompare(b.title, "sv");
    }
    if (sortMode === "date_desc") {
      if (!a.startDate) return 1;
      if (!b.startDate) return -1;
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    }
    // date_asc (default)
    if (!a.startDate) return 1;
    if (!b.startDate) return -1;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  const totalCount = result.length;
  const pageSize = filter.pageSize ?? 50;

  return {
    items: result.slice(0, pageSize),
    totalCount,
  };
}
