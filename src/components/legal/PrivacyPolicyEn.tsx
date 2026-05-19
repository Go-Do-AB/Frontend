/**
 * English-language Privacy Policy content.
 *
 * Authored as a strong DRAFT. All values still pending legal review are
 * flagged with `<!-- TODO: confirm ... -->` in JSX comments and rendered
 * as visible "[TBD]" markers so legal counsel can locate them on a
 * printed/exported copy.
 */
export function PrivacyPolicyEn() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-600 mb-8">
        Effective date: 19 May 2026 · Last updated: 19 May 2026
      </p>

      <p>
        This Privacy Policy describes how <strong>Go.Do AB</strong> (&quot;Go.Do&quot;,
        &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) collects, uses, and protects your personal
        data when you use the Go.Do mobile application (iOS and Android, package{" "}
        <code>nu.godo.app</code>), the Go.Do organiser website at{" "}
        <a href="https://godo-dev.nu" className="underline">
          godo-dev.nu
        </a>
        , and our backend services (together, the &quot;Service&quot;).
      </p>

      <p>
        Go.Do AB is the <strong>data controller</strong> for the personal data described in this
        policy, in accordance with the EU General Data Protection Regulation (Regulation (EU)
        2016/679, &quot;GDPR&quot;) and the Swedish Data Protection Act (2018:218).
      </p>

      {/* ---------------------------------------------------------------- */}
      <h2 className="mt-10">1. Who we are</h2>
      <p>
        <strong>Go.Do AB</strong>
        <br />
        Sweden
        <br />
        {/* TODO: confirm legal registered address (street, postal code, city) */}
        Registered address: <em>[TBD — pending counsel]</em>
        <br />
        {/* TODO: confirm Swedish organisation number */}
        Organisation number: <em>[TBD — pending counsel]</em>
        <br />
        Contact for privacy matters:{" "}
        <a href="mailto:privacy@godo.nu" className="underline">
          privacy@godo.nu
        </a>
      </p>
      <p>
        {/* TODO: confirm whether a formal DPO is appointed; if not, name the responsible privacy contact role */}
        We have appointed a privacy contact who is responsible for overseeing questions in
        relation to this Privacy Policy. If you have any questions about this Privacy Policy,
        including any requests to exercise your legal rights, please contact us at the email
        above.
      </p>

      {/* ---------------------------------------------------------------- */}
      <h2 className="mt-10">2. What data we collect</h2>
      <p>We collect only the data we need to operate the Service. Specifically:</p>

      <h3 className="mt-6">2.1 Account information</h3>
      <ul>
        <li>
          <strong>Email address</strong> — required to create an account, log in, and receive
          essential service emails (password reset, account notices).
        </li>
        <li>
          <strong>Name</strong> — required at registration and displayed in your profile.
        </li>
        <li>
          <strong>Password</strong> (if you registered with email and password) — stored as a
          salted hash using HMAC-SHA512 with a per-user random salt. We never store passwords in
          plain text and we never see your password. Accounts created via social login only
          (Apple or Google) have no password stored at all.
        </li>
        <li>
          <strong>Role</strong> — whether you are a regular user, an event organiser, or an
          administrator. This determines what features you can access.
        </li>
      </ul>

      <h3 className="mt-6">2.2 Authentication providers (social login)</h3>
      <p>
        If you sign in with Google or Apple, we receive a stable identifier and your email
        address from that provider. We do <strong>not</strong> receive your social-network
        password.
      </p>
      <ul>
        <li>
          <strong>Google Sign-In</strong> via the official Google Identity Services library
          (mobile: <code>@react-native-google-signin/google-signin</code>).
        </li>
        <li>
          <strong>Apple Sign in with Apple</strong> via{" "}
          <code>expo-apple-authentication</code>. Apple may return a private relay email; we
          treat it the same way as a normal email.
        </li>
      </ul>

      <h3 className="mt-6">2.3 Location data (optional)</h3>
      <p>
        With your permission, the mobile app may use your <strong>approximate</strong> or{" "}
        <strong>precise</strong> location to find events near you and to show your position on
        the in-app map. You can grant or deny this permission at any time in your device
        settings. The Service still works without location access — you simply pick a city
        manually.
      </p>

      <h3 className="mt-6">2.4 Calendar access (optional)</h3>
      <p>
        With your permission, the mobile app can read and write entries in your device calendar,
        so you can add an event you are interested in to your own calendar with one tap. We do
        not transmit your calendar contents to our servers; the read/write happens locally on
        your device.
      </p>

      <h3 className="mt-6">2.5 In-app purchases and subscriptions</h3>
      <p>
        Premium features (such as Spotlight promotions and Premium subscriptions) are billed
        through <strong>Apple App Store</strong> (in-app purchases) or{" "}
        <strong>Google Play Billing</strong>. Apple and Google process your payment and we{" "}
        <strong>never see your card number or full payment details</strong>. We receive only:
      </p>
      <ul>
        <li>A receipt or purchase token that we validate server-side to confirm the purchase.</li>
        <li>The product identifier you purchased (e.g. premium tier).</li>
        <li>Purchase and renewal status, so we can grant or revoke entitlements.</li>
      </ul>

      <h3 className="mt-6">2.6 Authentication tokens stored on your device</h3>
      <p>
        After login, we store a short-lived access token (about 5 minutes) and a refresh token
        in your device&apos;s secure storage (iOS Keychain / Android Keystore, via{" "}
        <code>expo-secure-store</code>). These tokens stay on your device and are sent only to
        our API when you make a request.
      </p>

      <h3 className="mt-6">2.7 Usage data</h3>
      <p>
        We record, in general terms, how the Service is used: which event listings are viewed,
        which categories and filters are selected, and similar product analytics. We use this to
        improve the Service. We do not sell this data and we do not use it for cross-app
        tracking.
      </p>

      {/* ---------------------------------------------------------------- */}
      <h2 className="mt-10">3. How we use your data</h2>
      <table className="my-4 border-collapse">
        <thead>
          <tr className="text-left">
            <th className="border p-2">Data type</th>
            <th className="border p-2">Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">Email, name, password hash</td>
            <td className="border p-2">Create and secure your account; sign you in.</td>
          </tr>
          <tr>
            <td className="border p-2">Social-login identifier</td>
            <td className="border p-2">Sign you in via Apple or Google.</td>
          </tr>
          <tr>
            <td className="border p-2">Location</td>
            <td className="border p-2">Show events near you; sort results by distance.</td>
          </tr>
          <tr>
            <td className="border p-2">Calendar access</td>
            <td className="border p-2">Add events you select to your device calendar.</td>
          </tr>
          <tr>
            <td className="border p-2">Purchase receipts</td>
            <td className="border p-2">Grant access to paid features; handle refunds.</td>
          </tr>
          <tr>
            <td className="border p-2">Auth tokens</td>
            <td className="border p-2">Keep you signed in securely between sessions.</td>
          </tr>
          <tr>
            <td className="border p-2">Usage data</td>
            <td className="border p-2">Improve the Service, fix bugs, prioritise features.</td>
          </tr>
        </tbody>
      </table>

      {/* ---------------------------------------------------------------- */}
      <h2 className="mt-10">4. Legal bases (GDPR Article 6)</h2>
      <ul>
        <li>
          <strong>Performance of a contract</strong> (Art. 6(1)(b)) — to create your account,
          deliver the Service you signed up for, and process purchases.
        </li>
        <li>
          <strong>Legitimate interests</strong> (Art. 6(1)(f)) — to operate, secure, and improve
          the Service (e.g. fraud prevention, basic product analytics). We balance this against
          your rights and freedoms.
        </li>
        <li>
          <strong>Consent</strong> (Art. 6(1)(a)) — for optional features that require your
          permission, such as location and calendar access. You may withdraw consent at any
          time, with no effect on the lawfulness of processing before withdrawal.
        </li>
        <li>
          <strong>Legal obligation</strong> (Art. 6(1)(c)) — where we must retain records (for
          example, accounting records for purchases, under Swedish bookkeeping law).
        </li>
      </ul>

      {/* ---------------------------------------------------------------- */}
      <h2 className="mt-10">5. Sharing and third-party processors</h2>
      <p>
        We do not sell your personal data. We share data only with the service providers
        (&quot;processors&quot;) we need to run the Service. Each processor handles data on our
        instructions under a data processing agreement.
      </p>
      <table className="my-4 border-collapse">
        <thead>
          <tr className="text-left">
            <th className="border p-2">Processor</th>
            <th className="border p-2">Purpose</th>
            <th className="border p-2">Location</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">Apple Inc.</td>
            <td className="border p-2">
              iOS app distribution, Sign in with Apple, App Store in-app purchases.
            </td>
            <td className="border p-2">US / global</td>
          </tr>
          <tr>
            <td className="border p-2">Google LLC</td>
            <td className="border p-2">
              Google Play distribution, Google Sign-In, Google Maps (event locations), Play
              Billing.
            </td>
            <td className="border p-2">US / global</td>
          </tr>
          <tr>
            <td className="border p-2">GleSYS AB</td>
            <td className="border p-2">
              Primary infrastructure host (servers, database, backups).
            </td>
            <td className="border p-2">Sweden (EU)</td>
          </tr>
          <tr>
            <td className="border p-2">Resend</td>
            <td className="border p-2">
              Transactional email delivery (password reset, account notices).
            </td>
            <td className="border p-2">US / EU</td>
          </tr>
          <tr>
            <td className="border p-2">Expo / EAS (Expo Inc.)</td>
            <td className="border p-2">
              Mobile build and over-the-air update tooling. No end-user personal data is sent
              to Expo by the Service.
            </td>
            <td className="border p-2">US</td>
          </tr>
        </tbody>
      </table>
      {/* TODO: confirm any other subprocessors (e.g. analytics, error tracking, push notification provider) */}
      <p className="text-xs text-gray-500">
        [TBD — counsel to confirm whether any additional subprocessors are in use (analytics,
        error tracking, push notifications, etc.).]
      </p>

      {/* ---------------------------------------------------------------- */}
      <h2 className="mt-10">6. International transfers</h2>
      <p>
        Most of your personal data is processed on servers located in <strong>Sweden</strong>{" "}
        (EU/EEA). However, certain processors (notably Apple, Google, Resend, and Expo) may
        transfer or access personal data outside the EEA — typically to the United States.
        Where this happens, we rely on the European Commission&apos;s Standard Contractual
        Clauses (SCCs) and any additional safeguards required under Articles 44–49 of the GDPR.
      </p>

      {/* ---------------------------------------------------------------- */}
      <h2 className="mt-10">7. Data retention</h2>
      {/* TODO: confirm retention periods — defaults below are reasonable but legal counsel should sign off */}
      <ul>
        <li>
          <strong>Active accounts</strong> — kept for as long as your account exists.
        </li>
        <li>
          <strong>Deleted accounts</strong> — personal data is deleted or anonymised within{" "}
          <em>[TBD — proposed: 30 days]</em> after you delete your account, except where we are
          required to retain certain records by law.
        </li>
        <li>
          <strong>Purchase / billing records</strong> — retained for{" "}
          <em>[TBD — proposed: 7 years]</em> to comply with the Swedish Bookkeeping Act
          (Bokföringslagen 1999:1078).
        </li>
        <li>
          <strong>Server logs</strong> — retained for{" "}
          <em>[TBD — proposed: 90 days]</em> for security and debugging.
        </li>
        <li>
          <strong>Backups</strong> — encrypted backups rotate out within{" "}
          <em>[TBD — proposed: 30 days]</em>.
        </li>
      </ul>

      {/* ---------------------------------------------------------------- */}
      <h2 className="mt-10">8. Your rights</h2>
      <p>Under the GDPR (Articles 15–22), you have the right to:</p>
      <ul>
        <li>
          <strong>Access</strong> the personal data we hold about you (Art. 15).
        </li>
        <li>
          <strong>Rectify</strong> data that is inaccurate or incomplete (Art. 16).
        </li>
        <li>
          <strong>Erase</strong> your data (&quot;right to be forgotten&quot;, Art. 17). You can
          do this yourself in the app — see Section 9 below.
        </li>
        <li>
          <strong>Restrict processing</strong> of your data (Art. 18).
        </li>
        <li>
          <strong>Data portability</strong> — receive your data in a machine-readable format
          (Art. 20).
        </li>
        <li>
          <strong>Object</strong> to processing based on legitimate interests (Art. 21).
        </li>
        <li>
          <strong>Withdraw consent</strong> at any time, where processing is based on consent
          (Art. 7(3)).
        </li>
        <li>
          <strong>Lodge a complaint</strong> with the Swedish supervisory authority,{" "}
          <strong>Integritetsskyddsmyndigheten (IMY)</strong> —{" "}
          <a href="https://www.imy.se" className="underline">
            imy.se
          </a>{" "}
          — or with the supervisory authority in your EU country of residence.
        </li>
      </ul>
      <p>
        To exercise any of these rights, email us at{" "}
        <a href="mailto:privacy@godo.nu" className="underline">
          privacy@godo.nu
        </a>
        . We will respond within one month (with a possible two-month extension for complex
        requests, as permitted by GDPR Art. 12(3)).
      </p>

      {/* ---------------------------------------------------------------- */}
      <h2 className="mt-10">9. Account deletion</h2>
      <p>You can delete your Go.Do account at any time, directly inside the mobile app:</p>
      <ol>
        <li>
          Open the Go.Do app and sign in.
        </li>
        <li>
          Go to the <strong>Profile</strong> tab.
        </li>
        <li>
          Tap <strong>Delete Account</strong> and confirm.
        </li>
      </ol>
      <p>
        Once you confirm, your account is scheduled for deletion. Personal data is removed or
        anonymised in accordance with the retention rules in Section 7. Some records (notably
        purchase / accounting records) must be kept by law and will be retained for the period
        required, then deleted.
      </p>
      <p>
        If you cannot access the app for any reason, email{" "}
        <a href="mailto:privacy@godo.nu" className="underline">
          privacy@godo.nu
        </a>{" "}
        from the email address linked to your account and we will process the deletion for you.
      </p>

      {/* ---------------------------------------------------------------- */}
      <h2 className="mt-10">10. Children&apos;s privacy</h2>
      {/* TODO: confirm minimum age — default is 16 to align with GDPR Art. 8 (Sweden has not lowered it) */}
      <p>
        The Service is not intended for children under <strong>16</strong>. We do not knowingly
        collect personal data from a child under 16. If you are a parent or guardian and you
        believe your child has provided us with personal data, please contact us and we will
        delete the data.
      </p>

      {/* ---------------------------------------------------------------- */}
      <h2 className="mt-10">11. Security</h2>
      <ul>
        <li>All communication with our API is encrypted over <strong>HTTPS (TLS)</strong>.</li>
        <li>
          Passwords are stored as <strong>HMAC-SHA512 hashes with a unique salt per user</strong>
          . We never log or store plain-text passwords.
        </li>
        <li>
          In-app purchase receipts are <strong>validated server-side</strong> against Apple and
          Google — clients cannot grant themselves access to paid features.
        </li>
        <li>
          Access tokens on your device are stored in the operating system&apos;s secure
          storage (iOS Keychain / Android Keystore).
        </li>
        <li>
          We restrict internal access to personal data on a least-privilege basis and review
          access regularly.
        </li>
      </ul>

      {/* ---------------------------------------------------------------- */}
      <h2 className="mt-10">12. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. When we make material changes, we
        will update the &quot;Last updated&quot; date at the top of this page and, where
        appropriate, notify you in the app or by email. Continuing to use the Service after a
        change means you accept the updated policy. We encourage you to review this page
        periodically.
      </p>

      {/* ---------------------------------------------------------------- */}
      <h2 className="mt-10">13. Contact</h2>
      <p>
        For any privacy-related question or to exercise a right above, contact:
        <br />
        <strong>Go.Do AB</strong>
        <br />
        <a href="mailto:privacy@godo.nu" className="underline">
          privacy@godo.nu
        </a>
        <br />
        {/* TODO: confirm legal postal address */}
        <em>[Legal postal address TBD — pending counsel]</em>
      </p>

      <p className="mt-12 text-sm text-gray-600">Last updated: 19 May 2026.</p>

      {/*
        --------------------------------------------------------------------
        APPLE PRIVACY NUTRITION LABEL MAPPING (paste into App Store Connect):
        --------------------------------------------------------------------
        - Data Used to Track You: None
        - Data Linked to You:
            * Contact Info — email address, name
            * User Content — none (we do not host user-generated content beyond
              organiser-submitted events, which are public business listings)
            * Identifiers — User ID (account identifier)
            * Purchases — purchase history (in-app purchases, subscriptions)
            * Location — Precise Location, Coarse Location (both optional, user
              must grant permission)
            * Usage Data — Product Interaction (categories viewed, events viewed)
        - Data Not Linked to You:
            * Diagnostics — Crash Data, Performance Data (if/when added; today
              the app does not ship a dedicated analytics SDK — confirm before
              filing)
        - Data Used to Track You: None

        --------------------------------------------------------------------
        GOOGLE PLAY DATA SAFETY MAPPING (paste into Play Console):
        --------------------------------------------------------------------
        - Personal info:
            * Name              — collected, linked, REQUIRED
            * Email address     — collected, linked, REQUIRED
            * User IDs          — collected, linked, REQUIRED
        - Location:
            * Approximate location — collected, linked, OPTIONAL
            * Precise location     — collected, linked, OPTIONAL
        - Financial info:
            * Purchase history — collected (handled by Google Play Billing /
              Apple App Store; we receive a receipt only)
        - App activity:
            * App interactions  — collected, linked  (categories selected,
              events viewed)
            * Other actions     — collected, linked  (favourites, lists)
        - App info and performance:
            * Crash logs        — collected (if/when a crash SDK is added —
              confirm before filing)
            * Diagnostics       — collected (general request logs for support)
        - Device or other IDs:
            * Account-level user ID — collected, linked
        - Security practices:
            * Data is encrypted in transit:  YES (HTTPS / TLS to api.godo-dev.nu)
            * Data is encrypted at rest:     YES (GleSYS managed encryption)
            * Users can request data deletion: YES — in-app: Profile → Delete
              Account; or by emailing privacy@godo.nu
            * Does the app follow Play Families Policy?  NOT a Families app
              (minimum age 16)
            * Has the app been independently validated against a global
              security standard?  NO (confirm with counsel before filing)
      */}
    </>
  );
}
