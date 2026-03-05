const CONFIG = {
  authorizedUsers: ['skhun@dublincleaners.com', 'ss.sku@gmail.com'],
  emailRecipients: [
    'mbutler@dublincleaners.com',
    'bbutler@dublincleaners.com',
    'gbutler@dublincleaners.com'
  ],
  spreadsheetIdProperty: 'BRIDAL_INTAKE_SPREADSHEET_ID',
  rateLimitWindowSec: 60,
  rateLimitMax: 10,
  matchThreshold: 0.78
};

const DESIGNER_CANONICAL = [
  'Allure Bridals', 'Alvina Valenta', 'Amsale', 'Anne Barge', 'Badgley Mischka',
  'Berta', 'BHLDN', 'Carolina Herrera', 'Casablanca Bridal', 'Claire Pettibone',
  'David\'s Bridal', 'Demetrios', 'Enzoani', 'Essense of Australia', 'Eve of Milady',
  'Galia Lahav', 'Hayley Paige', 'Ines Di Santo', 'Jesus Peiro', 'Justin Alexander',
  'Lazaro', 'Maggie Sottero', 'Mikaella', 'Monique Lhuillier', 'Morilee',
  'Oleg Cassini', 'Paloma Blanca', 'Pnina Tornai', 'Pronovias', 'Rivini',
  'Rosa Clara', 'Sareh Nouri', 'Sophia Tolli', 'Stella York', 'Tara Keely',
  'Theia', 'Vera Wang', 'Wtoo', 'Yumi Katsura'
];

const DESIGNER_ALIASES = {
  'allure': 'Allure Bridals',
  'allure bridals': 'Allure Bridals',
  'amsale': 'Amsale',
  'bhldn': 'BHLDN',
  'davids bridal': 'David\'s Bridal',
  'david bridal': 'David\'s Bridal',
  'enzo ani': 'Enzoani',
  'essence of australia': 'Essense of Australia',
  'galia': 'Galia Lahav',
  'justin alexandar': 'Justin Alexander',
  'maggie sotero': 'Maggie Sottero',
  'morilee by madeline gardner': 'Morilee',
  'oleg': 'Oleg Cassini',
  'pronovia': 'Pronovias',
  'rosa claraa': 'Rosa Clara',
  'stella yorke': 'Stella York',
  'vera': 'Vera Wang'
};

const SHEET_HEADERS = [
  'submissionTimestamp', 'submittedByEmail',
  'customerName', 'phone', 'email', 'brideFirstName', 'marriedLastName', 'maidenLastName',
  'address1', 'city', 'state', 'zip',
  'weddingDate', 'gownPrice', 'numberOfPieces',
  'designerInput', 'designerCanonical', 'designerMatchScore',
  'itemsIncluded', 'itemsOtherText',
  'materialType', 'materialOtherText',
  'colorType', 'colorOtherText',
  'inspectionIssues', 'embellishmentsAddedDescription', 'comments',
  'seamstressName', 'bridalSalonName',
  'referralSources', 'referralOtherText',
  'serviceRequested', 'viewBeforeBoxed', 'estimatedCost',
  'consentAccepted', 'signatureName', 'signatureDate'
];

function doGet() {
  const user = getCurrentUserEmail_();
  const template = HtmlService.createTemplateFromFile('index');
  template.appConfig = {
    userEmail: user,
    authorized: isAuthorizedEmail_(user),
    designers: DESIGNER_CANONICAL,
    aliasMap: DESIGNER_ALIASES,
    matchThreshold: CONFIG.matchThreshold
  };
  return template
    .evaluate()
    .setTitle('Dublin Cleaners — Wedding Gown Intake')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getAppBootstrap() {
  const email = getCurrentUserEmail_();
  return {
    userEmail: email,
    authorized: isAuthorizedEmail_(email),
    designers: DESIGNER_CANONICAL,
    aliasMap: DESIGNER_ALIASES,
    matchThreshold: CONFIG.matchThreshold
  };
}

function submitIntake(payload) {
  const email = getCurrentUserEmail_();
  if (!isAuthorizedEmail_(email)) {
    throw new Error('Unauthorized access.');
  }

  enforceRateLimit_(email);

  if (payload && payload.website && String(payload.website).trim() !== '') {
    throw new Error('Submission rejected.');
  }

  const normalized = normalizePayload_(payload || {});
  const validationError = validatePayload_(normalized);
  if (validationError) {
    throw new Error(validationError);
  }

  normalized.submissionTimestamp = new Date();
  normalized.submittedByEmail = email;

  const sheet = getOrCreateSheet_();
  const row = SHEET_HEADERS.map((header) => {
    const value = normalized[header];
    if (Array.isArray(value)) return value.join(', ');
    return value === undefined || value === null ? '' : value;
  });
  sheet.appendRow(row);

  const pdfBlob = buildPdf_(normalized);
  sendNotificationEmail_(normalized, pdfBlob);

  return {
    ok: true,
    message: 'Submission saved and emailed successfully.'
  };
}

function normalizePayload_(payload) {
  const clean = (val) => String(val || '').trim();
  const normalizeList = (arr) => Array.isArray(arr) ? arr.map((x) => clean(x)).filter(Boolean) : [];

  const designerMatch = findBestDesignerMatch_(clean(payload.designerInput));

  return {
    customerName: clean(payload.customerName),
    phone: formatPhone_(clean(payload.phone)),
    email: clean(payload.email).toLowerCase(),
    brideFirstName: clean(payload.brideFirstName),
    marriedLastName: clean(payload.marriedLastName),
    maidenLastName: clean(payload.maidenLastName),
    address1: clean(payload.address1),
    city: clean(payload.city),
    state: clean(payload.state),
    zip: clean(payload.zip),
    weddingDate: clean(payload.weddingDate),
    gownPrice: clean(payload.gownPrice),
    numberOfPieces: clean(payload.numberOfPieces),

    designerInput: clean(payload.designerInput),
    designerCanonical: designerMatch.canonical,
    designerMatchScore: designerMatch.score,

    itemsIncluded: normalizeList(payload.itemsIncluded),
    itemsOtherText: clean(payload.itemsOtherText),

    materialType: clean(payload.materialType),
    materialOtherText: clean(payload.materialOtherText),

    colorType: clean(payload.colorType),
    colorOtherText: clean(payload.colorOtherText),

    inspectionIssues: normalizeList(payload.inspectionIssues),
    embellishmentsAddedDescription: clean(payload.embellishmentsAddedDescription),
    comments: clean(payload.comments),

    seamstressName: clean(payload.seamstressName),
    bridalSalonName: clean(payload.bridalSalonName),

    referralSources: normalizeList(payload.referralSources),
    referralOtherText: clean(payload.referralOtherText),

    serviceRequested: normalizeList(payload.serviceRequested),
    viewBeforeBoxed: clean(payload.viewBeforeBoxed),
    estimatedCost: clean(payload.estimatedCost),

    consentAccepted: Boolean(payload.consentAccepted),
    signatureName: clean(payload.signatureName),
    signatureDate: clean(payload.signatureDate)
  };
}

function validatePayload_(data) {
  const required = [
    ['customerName', 'Customer name is required.'],
    ['phone', 'Phone is required.'],
    ['email', 'Email is required.'],
    ['weddingDate', 'Wedding date is required.'],
    ['designerInput', 'Designer label is required.'],
    ['signatureName', 'Signature name is required.'],
    ['signatureDate', 'Signature date is required.']
  ];

  for (let i = 0; i < required.length; i++) {
    if (!data[required[i][0]]) return required[i][1];
  }
  if (!data.serviceRequested.length) return 'At least one service must be selected.';
  if (!data.consentAccepted) return 'Consent is required.';
  return null;
}

function findBestDesignerMatch_(input) {
  const typed = String(input || '').trim();
  if (!typed) return { canonical: '', score: 0 };

  const normalized = normalizeDesignerKey_(typed);
  if (DESIGNER_ALIASES[normalized]) {
    return { canonical: DESIGNER_ALIASES[normalized], score: 1 };
  }

  let best = { canonical: typed, score: 0 };
  for (let i = 0; i < DESIGNER_CANONICAL.length; i++) {
    const candidate = DESIGNER_CANONICAL[i];
    const score = similarity_(normalizeDesignerKey_(typed), normalizeDesignerKey_(candidate));
    if (score > best.score) {
      best = { canonical: candidate, score: Number(score.toFixed(3)) };
    }
  }

  if (best.score >= CONFIG.matchThreshold) {
    return best;
  }
  return { canonical: typed, score: Number(best.score.toFixed(3)) };
}

function normalizeDesignerKey_(str) {
  return String(str || '').toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
}

function similarity_(a, b) {
  if (a === b) return 1;
  if (!a.length || !b.length) return 0;
  const distance = levenshtein_(a, b);
  return 1 - distance / Math.max(a.length, b.length);
}

function levenshtein_(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = [];

  for (let i = 0; i <= m; i++) {
    dp[i] = [i];
  }
  for (let j = 1; j <= n; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

function getCurrentUserEmail_() {
  return String(Session.getActiveUser().getEmail() || '').toLowerCase().trim();
}

function isAuthorizedEmail_(email) {
  return CONFIG.authorizedUsers.indexOf(String(email || '').toLowerCase()) !== -1;
}

function formatPhone_(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return '(' + digits.slice(0, 3) + ') ' + digits.slice(3, 6) + '-' + digits.slice(6);
  }
  return phone;
}

function enforceRateLimit_(identity) {
  const cache = CacheService.getScriptCache();
  const key = 'rate_' + identity;
  const raw = cache.get(key);
  const count = raw ? Number(raw) : 0;
  if (count >= CONFIG.rateLimitMax) {
    throw new Error('Too many submissions. Please wait a moment and retry.');
  }
  cache.put(key, String(count + 1), CONFIG.rateLimitWindowSec);
}

function getOrCreateSheet_() {
  const props = PropertiesService.getScriptProperties();
  let spreadsheetId = props.getProperty(CONFIG.spreadsheetIdProperty);
  let ss;

  if (spreadsheetId) {
    try {
      ss = SpreadsheetApp.openById(spreadsheetId);
    } catch (err) {
      spreadsheetId = '';
    }
  }

  if (!spreadsheetId) {
    ss = SpreadsheetApp.create('Dublin Cleaners - Bridal Intake');
    props.setProperty(CONFIG.spreadsheetIdProperty, ss.getId());
  }

  let sheet = ss.getSheetByName('Submissions');
  if (!sheet) {
    sheet = ss.insertSheet('Submissions');
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(SHEET_HEADERS);
  }

  return sheet;
}

function buildPdf_(data) {
  const template = HtmlService.createTemplateFromFile('print');
  template.data = data;
  const html = template.evaluate().getContent();
  const safeName = (data.customerName || 'Bridal Intake').replace(/[^a-z0-9]/gi, '_');
  return Utilities.newBlob(html, 'text/html', 'intake.html')
    .getAs(MimeType.PDF)
    .setName('Dublin_Cleaners_Intake_' + safeName + '.pdf');
}

function sendNotificationEmail_(data, pdfBlob) {
  const subject = 'Wedding Gown Intake - ' + data.customerName;
  const body = [
    'New bridal intake submission received.',
    '',
    'Customer: ' + data.customerName,
    'Phone: ' + data.phone,
    'Email: ' + data.email,
    'Wedding Date: ' + data.weddingDate,
    'Designer Input: ' + data.designerInput,
    'Designer Canonical: ' + data.designerCanonical,
    'Services: ' + data.serviceRequested.join(', '),
    'Items Included: ' + data.itemsIncluded.join(', '),
    'View Before Boxed: ' + data.viewBeforeBoxed,
    'Estimated Cost: ' + data.estimatedCost,
    '',
    'Signature: ' + data.signatureName + ' on ' + data.signatureDate
  ].join('\n');

  MailApp.sendEmail({
    to: CONFIG.emailRecipients.join(','),
    subject: subject,
    body: body,
    replyTo: data.email || undefined,
    attachments: [pdfBlob]
  });
}
