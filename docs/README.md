# Dublin Cleaners Wedding Gown Intake Web App

## Architecture & Data Flow
1. **Web app load (`doGet`)**
   - Server reads active Google account email via `Session.getActiveUser().getEmail()`.
   - Server returns HTML bootstrap config: authorized status, designer seed list, alias map, and threshold.
2. **Authentication gate**
   - Client renders either full app (authorized) or Unauthorized-only view.
   - Server enforces allowlist in `submitIntake`.
3. **Form UX**
   - Mobile-first form with accessible labels, keyboardable autocomplete, aria-live status.
4. **Submission**
   - Honeypot + basic rate limiting.
   - Normalize + validate payload.
   - Write row to Sheets.
   - Render PDF from canonical field map.
   - Email summary + PDF attachment.

## Canonical 1:1 Field Mapping Table (source of truth)
This implementation uses a single `FIELD_MAP` in `Code.gs` to drive:
- Sheet headers order (`SHEET_HEADERS`),
- Row serialization (`toSheetValue_`),
- PDF rendering sections/labels (`buildPdfModel_`).

| Payload key | Sheet header | PDF section | PDF label |
|---|---|---|---|
| submissionTimestamp | submissionTimestamp | Submission | Submitted at |
| submittedByEmail | submittedByEmail | Submission | Submitted by |
| customerName | customerName | Customer info | Customer name |
| phone | phone | Customer info | Phone |
| email | email | Customer info | Email |
| brideFirstName | brideFirstName | Customer info | Bride first name |
| marriedLastName | marriedLastName | Customer info | Married last name |
| maidenLastName | maidenLastName | Customer info | Maiden last name |
| address1 | address1 | Customer info | Address line 1 |
| city | city | Customer info | City |
| state | state | Customer info | State |
| zip | zip | Customer info | ZIP |
| weddingDate | weddingDate | Wedding & gown basics | Wedding date |
| gownPrice | gownPrice | Wedding & gown basics | Gown price |
| numberOfPieces | numberOfPieces | Wedding & gown basics | Number of pieces |
| designerInput | designerInput | Wedding & gown basics | Designer input |
| designerCanonical | designerCanonical | Wedding & gown basics | Designer canonical |
| designerMatchScore | designerMatchScore | Wedding & gown basics | Designer match score |
| itemsIncluded | itemsIncluded | Items included | Items included |
| itemsOtherText | itemsOtherText | Items included | Items other text |
| materialType | materialType | Materials | Material type |
| materialOtherText | materialOtherText | Materials | Material other text |
| colorType | colorType | Color | Color type |
| colorOtherText | colorOtherText | Color | Color other text |
| inspectionIssues | inspectionIssues | Condition / notes | Inspection issues |
| embellishmentsAddedDescription | embellishmentsAddedDescription | Condition / notes | Embellishments description |
| comments | comments | Condition / notes | Comments |
| seamstressName | seamstressName | Operations | Seamstress name |
| bridalSalonName | bridalSalonName | Operations | Bridal salon name |
| referralSources | referralSources | Referral tracking | Referral sources |
| referralOtherText | referralOtherText | Referral tracking | Referral other text |
| serviceRequested | serviceRequested | Services | Service requested |
| viewBeforeBoxed | viewBeforeBoxed | Services | View before boxed |
| estimatedCost | estimatedCost | Services | Estimated cost |
| consentAccepted | consentAccepted | Consent + signature | Consent accepted |
| signatureName | signatureName | Consent + signature | Signature name |
| signatureDate | signatureDate | Consent + signature | Signature date |

## Deployment Setup (Google Apps Script)
1. Create a standalone Apps Script project.
2. Replace project files with repository root files.
3. Ensure V8 runtime is enabled.
4. Deploy Web App and use an auth mode that exposes user email for `Session.getActiveUser().getEmail()`.
5. Authorize scopes on first execution.
6. First successful submit creates the spreadsheet and headers.

## Testing
From `test/`:
```bash
npm test
```
