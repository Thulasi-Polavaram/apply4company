# Apply4Company — V1 Static-Site Compliance & Accessibility Review

## Scope

Reviewed the V1 static website pages, shared CSS, shared JavaScript, registration legal pages, login flow, and password-recovery UI.

This is an engineering review, not a legal opinion, certification, or formal WCAG conformance audit.

## Current password-recovery behavior

- Forgot Password is a three-step flow: email → OTP → new password.
- The frontend calls a production API rather than generating or storing OTPs locally.
- OTP entry supports `autocomplete="one-time-code"`, numeric input, and paste.
- Recovery messages are generic to reduce account-enumeration risk.
- Resend has a client-side 60-second cooldown; the backend must enforce rate limits too.
- OTP lifetime is specified as 10 minutes or less for production.
- OTPs must be single-use.
- The backend returns a short-lived reset token/session after OTP verification.
- The new password must be different from the previous 3 passwords; the backend is authoritative for this check.
- The frontend never stores passwords, OTPs, or reset tokens in localStorage/sessionStorage.
- Successful password reset redirects to a dedicated success page and provides a clear path back to Login.
- Successful password reset should revoke existing sessions/refresh tokens according to the backend security design.

## WCAG 2.2 improvements applied

- Skip-to-main-content link added across pages.
- Consistent `<main id="main-content">` target added.
- Keyboard-visible focus styling retained and extended.
- Password fields use appropriate autocomplete tokens.
- OTP uses `autocomplete="one-time-code"` and accepts paste.
- Password visibility buttons have accessible names/states and practical target sizes.
- Error messages use field associations and `aria-invalid`.
- Reset status and step messages use live regions.
- No CAPTCHA/image puzzle/cognitive test is introduced into authentication.
- The recovery process avoids unnecessary repeated email entry.
- Reduced-motion support is included.
- Navigation/help placement remains consistent across pages.

## IT / security controls reflected in the frontend contract

- No password or OTP is sent through the Contact form.
- The backend contract calls for HTTPS/TLS, secure password hashing, OTP expiry, single-use recovery sessions, rate limiting, audit logging, session revocation, and CSRF protection where applicable.
- Password history must be checked server-side against secure password hashes.
- Authentication secrets must not be written to browser storage or logs.
- Privacy and Terms pages now explain password-recovery data handling and the password-history rule.
- The legal pages keep intermediary-specific grievance requirements conditional on the final legal classification of the service; required Grievance Officer details should be published before production if those obligations apply.

## Static checks completed

- JavaScript syntax check: passed with `node --check`.
- CSS brace balance: passed.
- Local HTML links and script/style references: passed.
- Duplicate HTML IDs: none found.
- One `<main>` and one `<h1>` per page: verified.
- Form controls: labels/accessible associations checked.

## Password-reset API contract

The frontend is designed for these backend operations:

1. `POST /auth/password-reset/request-otp` — accept the email and trigger a short-lived OTP email. Return a generic outward response whether or not an account exists.
2. `POST /auth/password-reset/verify-otp` — validate the OTP, enforce expiry/attempt limits/single use, and return a short-lived reset session/token.
3. `POST /auth/password-reset/complete` — accept the reset session and new password, verify the password-history rule against the previous 3 secure password hashes, update the credential, revoke active sessions/refresh tokens as designed, and return success.
4. Redirect the browser to `password-reset-success.html` after a successful completion.

The backend, not the browser, is authoritative for OTP delivery, OTP validity, password history, session revocation, rate limiting, hashing, and audit records.

## Remaining production work

1. Implement the password-reset API and transactional email service.
2. Implement secure password hashing and previous-3 password history.
3. Implement OTP rate limiting, expiry, attempt limits, and single-use invalidation server-side.
4. Implement session/refresh-token revocation after reset.
5. Configure production security headers, HTTPS, CSP, cookie settings, and CSRF controls as applicable.
6. Complete the final data-flow, processor/service-provider, retention, grievance, and user-rights mapping for Indian privacy requirements.
7. Perform a browser-based accessibility audit with keyboard-only navigation, screen reader testing, zoom/reflow testing, and an automated tool such as axe before claiming formal WCAG conformance.
8. Have final Terms, Privacy Policy, grievance process, and data-protection implementation reviewed by qualified counsel/privacy professionals before production launch.

## Official references used for this review

- W3C Web Content Accessibility Guidelines (WCAG) 2.2: https://www.w3.org/TR/wcag/
- W3C What's New in WCAG 2.2: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- MeitY IT Rules, 2021 page, updated 10 February 2026 with 26 February 2026 corrigenda: https://www.meity.gov.in/documents/act-and-policies/information-technology-intermediary-guidelines-and-digital-media-ethics-code-rules-2021-it-rules-2021-IjM5QjMtQWa
- MeitY Digital Personal Data Protection Rules, 2025: https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa
