/**
 * Swedish-language Privacy Policy content.
 *
 * Authored as a strong DRAFT. All values still pending legal review are
 * flagged with `<!-- TODO: confirm ... -->` in JSX comments and rendered
 * as visible "[TBD]" markers so legal counsel can locate them on a
 * printed/exported copy. Tone uses "du" to match the rest of the site.
 */
export function PrivacyPolicySv() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-2">Integritetspolicy</h1>
      <p className="text-sm text-gray-600 mb-8">
        Gäller från: 19 maj 2026 · Senast uppdaterad: 19 maj 2026
      </p>

      <p>
        Den här integritetspolicyn beskriver hur <strong>Go.Do AB</strong> (&quot;Go.Do&quot;,
        &quot;vi&quot;, &quot;oss&quot;) samlar in, använder och skyddar dina personuppgifter
        när du använder Go.Do mobilapp (iOS och Android, paket{" "}
        <code>nu.godo.app</code>), arrangörswebbplatsen{" "}
        <a href="https://godo-dev.nu" className="underline">
          godo-dev.nu
        </a>{" "}
        samt våra backend-tjänster (tillsammans &quot;Tjänsten&quot;).
      </p>

      <p>
        Go.Do AB är <strong>personuppgiftsansvarig</strong> för behandlingen av de
        personuppgifter som beskrivs i denna policy, i enlighet med EU:s allmänna
        dataskyddsförordning (förordning (EU) 2016/679, &quot;GDPR&quot;) och
        dataskyddslagen (2018:218).
      </p>

      {/* ---------------------------------------------------------------- */}
      <h2 className="mt-10">1. Vilka vi är</h2>
      <p>
        <strong>Go.Do AB</strong>
        <br />
        Sverige
        <br />
        {/* TODO: confirm SV legal registered address */}
        Registrerad adress: <em>[Att fastställas — väntar på juridiskt ombud]</em>
        <br />
        {/* TODO: confirm SV organisation number */}
        Organisationsnummer: <em>[Att fastställas — väntar på juridiskt ombud]</em>
        <br />
        Kontakt i integritetsfrågor:{" "}
        <a href="mailto:privacy@godo.nu" className="underline">
          privacy@godo.nu
        </a>
      </p>
      <p>
        {/* TODO: confirm whether a formal DPO (dataskyddsombud) is appointed */}
        Vi har utsett en kontaktperson för integritetsfrågor som ansvarar för att besvara
        frågor om denna policy. Hör av dig till adressen ovan om du har frågor eller vill
        utöva dina lagstadgade rättigheter.
      </p>

      {/* ---------------------------------------------------------------- */}
      <h2 className="mt-10">2. Vilka uppgifter vi samlar in</h2>
      <p>Vi samlar bara in de uppgifter vi behöver för att driva Tjänsten:</p>

      <h3 className="mt-6">2.1 Kontouppgifter</h3>
      <ul>
        <li>
          <strong>E-postadress</strong> — krävs för att skapa konto, logga in och ta emot
          nödvändiga servicemejl (lösenordsåterställning, kontomeddelanden).
        </li>
        <li>
          <strong>Namn</strong> — krävs vid registrering och visas i din profil.
        </li>
        <li>
          <strong>Lösenord</strong> (om du registrerade dig med e-post och lösenord) — lagras
          som en saltad hash med HMAC-SHA512 och unikt salt per användare. Vi lagrar aldrig
          lösenord i klartext och vi ser aldrig ditt lösenord. Konton som skapats enbart via
          sociala inloggningar (Apple eller Google) har inget lösenord alls.
        </li>
        <li>
          <strong>Roll</strong> — om du är vanlig användare, arrangör eller administratör.
          Detta styr vilka funktioner du har åtkomst till.
        </li>
      </ul>

      <h3 className="mt-6">2.2 Inloggningsleverantörer (social inloggning)</h3>
      <p>
        Om du loggar in med Google eller Apple får vi en stabil identifierare och din
        e-postadress från leverantören. Vi får <strong>aldrig</strong> ditt
        sociala-medie-lösenord.
      </p>
      <ul>
        <li>
          <strong>Google Sign-In</strong> via Googles officiella bibliotek (mobil:{" "}
          <code>@react-native-google-signin/google-signin</code>).
        </li>
        <li>
          <strong>Logga in med Apple</strong> via <code>expo-apple-authentication</code>.
          Apple kan returnera en s.k. privat relay-e-postadress; vi behandlar den på samma
          sätt som en vanlig e-postadress.
        </li>
      </ul>

      <h3 className="mt-6">2.3 Platsdata (valfritt)</h3>
      <p>
        Med ditt samtycke kan mobilappen använda din <strong>ungefärliga</strong> eller{" "}
        <strong>exakta</strong> position för att visa evenemang nära dig och placera dig på
        kartan. Du kan ge eller dra tillbaka detta samtycke när som helst i enhetens
        inställningar. Tjänsten fungerar även utan plats — då väljer du stad manuellt.
      </p>

      <h3 className="mt-6">2.4 Kalenderåtkomst (valfritt)</h3>
      <p>
        Med ditt samtycke kan mobilappen läsa och skriva i enhetens kalender, så att du kan
        lägga till ett intressant evenemang i din egen kalender med en knapptryckning. Vi
        skickar inte innehållet i din kalender till våra servrar — läs/skriv sker lokalt på
        din enhet.
      </p>

      <h3 className="mt-6">2.5 Köp i appen och prenumerationer</h3>
      <p>
        Premiumfunktioner (t.ex. Spotlight-marknadsföring och Premium-prenumerationer)
        faktureras via <strong>Apple App Store</strong> (köp i appen) eller{" "}
        <strong>Google Play Billing</strong>. Apple och Google hanterar betalningen och vi
        ser <strong>aldrig ditt kortnummer eller fullständiga betalningsuppgifter</strong>.
        Vi får endast:
      </p>
      <ul>
        <li>Ett kvitto eller token som vi validerar serverside för att bekräfta köpet.</li>
        <li>Produkt-id för det du köpt (t.ex. premium-nivå).</li>
        <li>Köp- och förnyelsestatus så att vi kan ge eller dra in åtkomst.</li>
      </ul>

      <h3 className="mt-6">2.6 Inloggningstokens på din enhet</h3>
      <p>
        Efter inloggning lagrar vi en kortlivad access-token (ungefär 5 minuter) och en
        refresh-token i enhetens säkra lagring (iOS Keychain / Android Keystore, via{" "}
        <code>expo-secure-store</code>). Dessa tokens stannar på din enhet och skickas
        endast till vårt API när du gör en förfrågan.
      </p>

      <h3 className="mt-6">2.7 Användardata</h3>
      <p>
        Vi registrerar översiktligt hur Tjänsten används — vilka evenemang som visas, vilka
        kategorier och filter som väljs och liknande produktanalys. Vi använder detta för
        att förbättra Tjänsten. Vi säljer inte data och använder den inte för spårning
        mellan appar.
      </p>

      {/* ---------------------------------------------------------------- */}
      <h2 className="mt-10">3. Hur vi använder dina uppgifter</h2>
      <table className="my-4 border-collapse">
        <thead>
          <tr className="text-left">
            <th className="border p-2">Typ av uppgift</th>
            <th className="border p-2">Ändamål</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">E-post, namn, lösenords-hash</td>
            <td className="border p-2">Skapa och skydda ditt konto; logga in dig.</td>
          </tr>
          <tr>
            <td className="border p-2">Social inloggnings-id</td>
            <td className="border p-2">Logga in dig via Apple eller Google.</td>
          </tr>
          <tr>
            <td className="border p-2">Plats</td>
            <td className="border p-2">Visa evenemang nära dig; sortera efter avstånd.</td>
          </tr>
          <tr>
            <td className="border p-2">Kalenderåtkomst</td>
            <td className="border p-2">Lägg till valda evenemang i din enhets kalender.</td>
          </tr>
          <tr>
            <td className="border p-2">Köpkvitton</td>
            <td className="border p-2">Aktivera betalda funktioner; hantera återbetalningar.</td>
          </tr>
          <tr>
            <td className="border p-2">Inloggningstokens</td>
            <td className="border p-2">Hålla dig säkert inloggad mellan sessioner.</td>
          </tr>
          <tr>
            <td className="border p-2">Användardata</td>
            <td className="border p-2">Förbättra Tjänsten, åtgärda buggar, prioritera nya funktioner.</td>
          </tr>
        </tbody>
      </table>

      {/* ---------------------------------------------------------------- */}
      <h2 className="mt-10">4. Rättsliga grunder (GDPR artikel 6)</h2>
      <ul>
        <li>
          <strong>Fullgörande av avtal</strong> (art. 6.1 b) — för att skapa ditt konto,
          leverera Tjänsten du registrerat dig för och hantera köp.
        </li>
        <li>
          <strong>Berättigat intresse</strong> (art. 6.1 f) — för att driva, säkra och
          förbättra Tjänsten (t.ex. bedrägeriskydd, grundläggande produktanalys). Vi gör
          alltid en avvägning mot dina rättigheter och friheter.
        </li>
        <li>
          <strong>Samtycke</strong> (art. 6.1 a) — för valfria funktioner som kräver
          tillstånd, t.ex. plats- och kalenderåtkomst. Du kan när som helst dra tillbaka
          samtycket, utan att det påverkar lagligheten av tidigare behandling.
        </li>
        <li>
          <strong>Rättslig förpliktelse</strong> (art. 6.1 c) — där vi enligt lag måste
          spara uppgifter, t.ex. bokföringsmaterial enligt bokföringslagen (1999:1078).
        </li>
      </ul>

      {/* ---------------------------------------------------------------- */}
      <h2 className="mt-10">5. Delning och personuppgiftsbiträden</h2>
      <p>
        Vi säljer inte dina personuppgifter. Vi delar uppgifter endast med leverantörer
        (&quot;personuppgiftsbiträden&quot;) som behövs för att driva Tjänsten. Varje
        biträde behandlar uppgifter enligt våra instruktioner under ett
        biträdesavtal/personuppgiftsbiträdesavtal (DPA).
      </p>
      <table className="my-4 border-collapse">
        <thead>
          <tr className="text-left">
            <th className="border p-2">Leverantör</th>
            <th className="border p-2">Ändamål</th>
            <th className="border p-2">Plats</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">Apple Inc.</td>
            <td className="border p-2">
              Distribution av iOS-app, Logga in med Apple, köp i appen via App Store.
            </td>
            <td className="border p-2">USA / globalt</td>
          </tr>
          <tr>
            <td className="border p-2">Google LLC</td>
            <td className="border p-2">
              Distribution via Google Play, Google Sign-In, Google Maps (kartor för
              evenemang), Play Billing.
            </td>
            <td className="border p-2">USA / globalt</td>
          </tr>
          <tr>
            <td className="border p-2">GleSYS AB</td>
            <td className="border p-2">
              Primär infrastruktur (servrar, databas, säkerhetskopior).
            </td>
            <td className="border p-2">Sverige (EU)</td>
          </tr>
          <tr>
            <td className="border p-2">Resend</td>
            <td className="border p-2">
              Transaktionsmejl (lösenordsåterställning, kontomeddelanden).
            </td>
            <td className="border p-2">USA / EU</td>
          </tr>
          <tr>
            <td className="border p-2">Expo / EAS (Expo Inc.)</td>
            <td className="border p-2">
              Build- och OTA-uppdateringsverktyg för mobilen. Inga personuppgifter om
              slutanvändare skickas av Tjänsten till Expo.
            </td>
            <td className="border p-2">USA</td>
          </tr>
        </tbody>
      </table>
      {/* TODO: confirm any other subprocessors */}
      <p className="text-xs text-gray-500">
        [Att fastställas — juridiskt ombud bekräftar om ytterligare biträden används
        (analytics, felrapportering, push-notiser m.m.).]
      </p>

      {/* ---------------------------------------------------------------- */}
      <h2 className="mt-10">6. Överföringar utanför EES</h2>
      <p>
        De flesta personuppgifter behandlas på servrar i <strong>Sverige</strong> (EU/EES).
        Vissa biträden (särskilt Apple, Google, Resend och Expo) kan dock överföra eller
        komma åt personuppgifter utanför EES — typiskt sett till USA. När det sker
        tillämpar vi EU-kommissionens standardavtalsklausuler (SCC) och, vid behov,
        ytterligare skyddsåtgärder enligt GDPR artikel 44–49.
      </p>

      {/* ---------------------------------------------------------------- */}
      <h2 className="mt-10">7. Lagringstid</h2>
      {/* TODO: confirm retention periods */}
      <ul>
        <li>
          <strong>Aktiva konton</strong> — så länge ditt konto finns.
        </li>
        <li>
          <strong>Raderade konton</strong> — personuppgifter raderas eller anonymiseras
          inom <em>[Att fastställas — föreslaget: 30 dagar]</em> efter att du raderat ditt
          konto, utom där lag kräver att vi sparar vissa uppgifter.
        </li>
        <li>
          <strong>Köp- och bokföringsunderlag</strong> — sparas i{" "}
          <em>[Att fastställas — föreslaget: 7 år]</em> enligt bokföringslagen
          (1999:1078).
        </li>
        <li>
          <strong>Serverloggar</strong> — sparas i{" "}
          <em>[Att fastställas — föreslaget: 90 dagar]</em> för säkerhet och felsökning.
        </li>
        <li>
          <strong>Säkerhetskopior</strong> — krypterade säkerhetskopior roteras ut inom{" "}
          <em>[Att fastställas — föreslaget: 30 dagar]</em>.
        </li>
      </ul>

      {/* ---------------------------------------------------------------- */}
      <h2 className="mt-10">8. Dina rättigheter</h2>
      <p>Enligt GDPR (artikel 15–22) har du rätt att:</p>
      <ul>
        <li>
          <strong>Få tillgång till</strong> de personuppgifter vi har om dig (art. 15).
        </li>
        <li>
          <strong>Rätta</strong> felaktiga eller ofullständiga uppgifter (art. 16).
        </li>
        <li>
          <strong>Radera</strong> dina uppgifter (&quot;rätten att bli glömd&quot;, art.
          17). Du kan göra detta själv i appen — se avsnitt 9.
        </li>
        <li>
          <strong>Begränsa behandlingen</strong> av dina uppgifter (art. 18).
        </li>
        <li>
          {/* TODO: confirm SV term — "dataportabilitet" is the established term */}
          <strong>Dataportabilitet</strong> — få ut dina uppgifter i ett maskinläsbart
          format (art. 20).
        </li>
        <li>
          <strong>Invända</strong> mot behandling baserad på berättigat intresse (art. 21).
        </li>
        <li>
          <strong>Dra tillbaka samtycke</strong> när som helst, där behandlingen är
          baserad på samtycke (art. 7.3).
        </li>
        <li>
          <strong>Klaga</strong> hos den svenska tillsynsmyndigheten,{" "}
          <strong>Integritetsskyddsmyndigheten (IMY)</strong> —{" "}
          <a href="https://www.imy.se" className="underline">
            imy.se
          </a>{" "}
          — eller hos tillsynsmyndigheten i ditt hemland inom EU.
        </li>
      </ul>
      <p>
        Skicka ett mejl till{" "}
        <a href="mailto:privacy@godo.nu" className="underline">
          privacy@godo.nu
        </a>{" "}
        för att utöva någon av dessa rättigheter. Vi svarar inom en månad (med möjlighet
        till ytterligare två månader för komplexa ärenden, enligt GDPR art. 12.3).
      </p>

      {/* ---------------------------------------------------------------- */}
      <h2 className="mt-10">9. Radera kontot</h2>
      <p>Du kan radera ditt Go.Do-konto när som helst, direkt i mobilappen:</p>
      <ol>
        <li>Öppna Go.Do-appen och logga in.</li>
        <li>
          Gå till fliken <strong>Profil</strong>.
        </li>
        <li>
          Tryck på <strong>Radera konto</strong> och bekräfta.
        </li>
      </ol>
      <p>
        När du bekräftar schemaläggs kontot för radering. Personuppgifter tas bort eller
        anonymiseras enligt reglerna i avsnitt 7. Vissa uppgifter (särskilt köp- och
        bokföringsunderlag) måste enligt lag sparas under en viss tid och raderas därefter.
      </p>
      <p>
        Om du av någon anledning inte kommer åt appen, mejla{" "}
        <a href="mailto:privacy@godo.nu" className="underline">
          privacy@godo.nu
        </a>{" "}
        från den e-postadress som är kopplad till ditt konto, så hanterar vi raderingen åt
        dig.
      </p>

      {/* ---------------------------------------------------------------- */}
      <h2 className="mt-10">10. Barns integritet</h2>
      {/* TODO: confirm minimum age — default 16 to align with GDPR art. 8 */}
      <p>
        Tjänsten riktar sig inte till barn under <strong>16</strong> år. Vi samlar inte
        medvetet in personuppgifter från barn under 16. Om du är vårdnadshavare och tror
        att ditt barn har lämnat personuppgifter till oss, kontakta oss så raderar vi
        uppgifterna.
      </p>

      {/* ---------------------------------------------------------------- */}
      <h2 className="mt-10">11. Säkerhet</h2>
      <ul>
        <li>All kommunikation med vårt API är krypterad via <strong>HTTPS (TLS)</strong>.</li>
        <li>
          Lösenord lagras som <strong>HMAC-SHA512-hashar med unikt salt per användare</strong>
          . Vi loggar eller sparar aldrig lösenord i klartext.
        </li>
        <li>
          Köpkvitton valideras <strong>serverside</strong> mot Apple och Google — klienter
          kan inte aktivera betalda funktioner själva.
        </li>
        <li>
          Access-tokens på din enhet lagras i operativsystemets säkra lagring (iOS
          Keychain / Android Keystore).
        </li>
        <li>
          Vi begränsar intern åtkomst till personuppgifter enligt principen om minsta
          behörighet och granskar åtkomst regelbundet.
        </li>
      </ul>

      {/* ---------------------------------------------------------------- */}
      <h2 className="mt-10">12. Ändringar i denna policy</h2>
      <p>
        Vi kan komma att uppdatera denna integritetspolicy. När vi gör väsentliga
        ändringar uppdaterar vi datumet &quot;Senast uppdaterad&quot; överst på sidan och
        informerar dig vid behov i appen eller via e-post. Om du fortsätter att använda
        Tjänsten efter en ändring innebär det att du accepterar den uppdaterade policyn.
        Vi rekommenderar att du läser sidan regelbundet.
      </p>

      {/* ---------------------------------------------------------------- */}
      <h2 className="mt-10">13. Kontakt</h2>
      <p>
        För integritetsrelaterade frågor eller för att utöva någon av rättigheterna
        ovan, kontakta:
        <br />
        <strong>Go.Do AB</strong>
        <br />
        <a href="mailto:privacy@godo.nu" className="underline">
          privacy@godo.nu
        </a>
        <br />
        {/* TODO: confirm SV legal postal address */}
        <em>[Postadress att fastställas — väntar på juridiskt ombud]</em>
      </p>

      <p className="mt-12 text-sm text-gray-600">Senast uppdaterad: 19 maj 2026.</p>

      {/*
        --------------------------------------------------------------------
        APPLE PRIVACY NUTRITION LABEL MAPPING (paste into App Store Connect):
        --------------------------------------------------------------------
        See the English version (/privacy) for the canonical mapping that
        the user pastes into App Store Connect and Google Play Console.
        Console UIs are English-only, so we keep the mapping single-sourced
        on the English page to avoid drift.
      */}
    </>
  );
}
