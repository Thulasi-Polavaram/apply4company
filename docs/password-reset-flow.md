# Apply4Company — Password Reset Flow

## User journey

1. Customer selects **Forgot password?** on the Login page.
2. Customer enters the account email address and selects **Send OTP**.
3. Apply4Company backend accepts the request and sends a short-lived, single-use OTP to the account email when recovery is eligible.
4. The UI shows a generic message so the service does not reveal whether an email is registered.
5. Customer enters the 6-digit OTP and selects **Verify OTP**.
6. Backend validates the OTP, expiry, attempt limits, single-use status, and recovery session. On success it returns a short-lived reset session/token.
7. Customer creates and confirms a new password.
8. Backend rejects the new password if it matches any of the previous 3 password hashes.
9. Backend stores the new password using a modern password-hashing mechanism and invalidates the used reset session/OTP.
10. Backend revokes active sessions/refresh tokens according to the account-security policy.
11. Browser redirects to `password-reset-success.html`.
12. Customer selects **Back to Sign In** and returns to `login.html`.

## Security requirements

- Use HTTPS/TLS in production.
- Never send or store passwords in email, URL parameters, browser localStorage, or sessionStorage.
- Never store OTP values or reset tokens in browser storage.
- Store passwords only as secure password hashes using a modern password-hashing algorithm suitable for the production stack.
- Store previous password history as secure hashes only; retain enough history to enforce the previous-3 rule.
- OTPs must expire quickly, be single-use, and have server-side attempt limits.
- Rate-limit OTP requests, OTP verification, and password-reset completion.
- Return generic outward-facing recovery messages to reduce account enumeration.
- Do not log raw passwords, OTPs, reset tokens, or authorization headers.
- Protect reset sessions/tokens against replay and bind them to the intended recovery transaction as appropriate.
- Revoke or rotate active authentication sessions after a successful reset according to the security design.
- Use secure cookies and CSRF protection where cookie-based authentication is used.
- Send security notifications where required by the account-security design and applicable law.
- Maintain appropriate security/audit records without retaining secret credential values.

## Frontend API contract

### Request OTP

`POST /auth/password-reset/request-otp`

```json
{ "email": "customer@example.com" }
```

Expected behavior: generic success response; the service may send an OTP if the account is eligible.

### Verify OTP

`POST /auth/password-reset/verify-otp`

```json
{ "email": "customer@example.com", "otp": "123456" }
```

Expected success response:

```json
{ "resetToken": "short-lived-server-issued-token" }
```

The actual token format and storage mechanism are backend implementation details. Do not place it in localStorage/sessionStorage.

### Complete reset

`POST /auth/password-reset/complete`

```json
{ "resetToken": "short-lived-server-issued-token", "newPassword": "new-secret" }
```

Expected success: password changed and reset session invalidated.

Expected password-history error code:

`PASSWORD_REUSED`

The backend is authoritative for the previous-3-password rule.

## WCAG 2.2 considerations

- Email and password fields have explicit labels.
- OTP uses `autocomplete="one-time-code"` and accepts paste.
- Password managers are supported through appropriate autocomplete values.
- No CAPTCHA or cognitive puzzle is required.
- Validation errors are associated with fields and use `aria-invalid`.
- Status messages use live regions.
- Keyboard focus is visible.
- Interactive controls use practical minimum target sizes.
- The reset process avoids asking the user to re-enter information unnecessarily.
- A dedicated success page provides a clear, keyboard-accessible path back to Sign In.

WCAG 2.2 accessibility should still be verified through browser, keyboard, screen-reader, zoom/reflow, and automated testing before claiming formal conformance.

## Legal / privacy implementation notes

The frontend should be aligned with the final privacy notice and actual backend data flows. Password-recovery processing may involve account email, OTP/recovery metadata, security records, and password-history hashes. Final retention, user-rights, grievance, breach-response, and processor/service-provider controls must be mapped to the applicable Indian legal framework before production launch.
