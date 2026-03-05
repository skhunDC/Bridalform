# Dublin Cleaners Wedding Gown Intake Web App

## Architecture & Data Flow
1. **Web app load (`doGet`)**
   - Server reads active Google account email via `Session.getActiveUser().getEmail()`.
   - Server returns HTML with bootstrap config: authorized status, designer seed list, alias map, confidence threshold.
2. **Authentication gate**
   - Client immediately shows either:
     - full intake app (authorized), or
     - Unauthorized-only view (all other UI hidden).
   - Server also enforces authorization in `submitIntake` as defense in depth.
3. **Form UX**
   - Mobile-first responsive form with sectioned layout.
   - Typo-tolerant designer autocomplete with fuzzy scoring, alias correction, keyboard navigation.
   - Conditional “Other” fields and accessible status messaging (`aria-live`).
4. **Submission (`submitIntake`)**
   - Honeypot bot check.
   - Optional rate limit by account and time window.
   - Normalize + validate payload.
   - Canonicalize designer value and save match score.
5. **Persistence**
   - Auto-create spreadsheet on first run and store ID in Script Properties.
   - Auto-create header row.
   - Append each submission row (arrays saved as comma-separated values).
6. **PDF + Email**
   - Build printable HTML from `print.html` and convert to PDF blob.
   - Email PDF + plain-text summary to:
     - mbutler@dublincleaners.com
     - bbutler@dublincleaners.com
     - gbutler@dublincleaners.com
   - Reply-to is set to customer email.

## Deployment Setup (Google Apps Script)
1. Create a standalone Apps Script project.
2. Replace project files with repository root files.
3. In **Project Settings**, enable V8 runtime.
4. In **appsscript.json**, ensure scopes are present (Sheets, Drive, Mail, user email).
5. Deploy:
   - **Deploy → New deployment → Web app**
   - Execute as: **User accessing the web app** (recommended for reliable identity)
   - Who has access: org-safe setting as needed (authorization list still enforced in app)
6. Open deployed URL while signed in with one of:
   - skhun@dublincleaners.com
   - ss.sku@gmail.com
7. First successful submission auto-creates sheet + header row.
8. Confirm mail delivery and allow any prompted OAuth permissions.

## OAuth Consent / Identity Notes
- `Session.getActiveUser().getEmail()` requires proper deployment/auth context.
- If email is blank in your domain policy, set deployment/access so identity is exposed and authenticated.
- Unauthorized users always see only the Unauthorized card and cannot submit because `submitIntake` checks authorization server-side.

## Testing
From `test/`:
```bash
npm test
```
Covers:
- Designer fuzzy matching behavior.
- Payload normalization basics.
- Authorization gating logic.
