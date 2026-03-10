const CONFIG = {
  emailRecipients: [
    'mbutler@dublincleaners.com',
    'bbutler@dublincleaners.com',
    'gbutler@dublincleaners.com',
    'dublincleanerstech@gmail.com'
  ],
  spreadsheetIdProperty: 'BRIDAL_INTAKE_SPREADSHEET_ID',
  spreadsheetEditorsProperty: 'BRIDAL_INTAKE_ALLOWED_EDITOR_EMAILS',
  imageFolderIdProperty: 'BRIDAL_INTAKE_IMAGE_FOLDER_ID',
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
  allure: 'Allure Bridals',
  'allure bridals': 'Allure Bridals',
  amsale: 'Amsale',
  bhldn: 'BHLDN',
  'davids bridal': 'David\'s Bridal',
  'david bridal': 'David\'s Bridal',
  'enzo ani': 'Enzoani',
  'essence of australia': 'Essense of Australia',
  galia: 'Galia Lahav',
  'justin alexandar': 'Justin Alexander',
  'maggie sotero': 'Maggie Sottero',
  'morilee by madeline gardner': 'Morilee',
  oleg: 'Oleg Cassini',
  pronovia: 'Pronovias',
  'rosa claraa': 'Rosa Clara',
  'stella yorke': 'Stella York',
  vera: 'Vera Wang'
};

// 1:1 mapping contract: payload key -> sheet header -> PDF section/label.
const FIELD_MAP = [
  { key: 'submissionTimestamp', header: 'submissionTimestamp', section: 'Submission', label: 'Submitted at', type: 'datetime' },
  { key: 'submittedByEmail', header: 'submittedByEmail', section: 'Submission', label: 'Submitted by', type: 'text' },

  { key: 'customerName', header: 'customerName', section: 'Customer info', label: 'Customer name', type: 'text' },
  { key: 'phone', header: 'phone', section: 'Customer info', label: 'Phone', type: 'text' },
  { key: 'email', header: 'email', section: 'Customer info', label: 'Email', type: 'text' },
  { key: 'brideFirstName', header: 'brideFirstName', section: 'Customer info', label: 'Bride first name', type: 'text' },
  { key: 'marriedLastName', header: 'marriedLastName', section: 'Customer info', label: 'Married last name', type: 'text' },
  { key: 'maidenLastName', header: 'maidenLastName', section: 'Customer info', label: 'Maiden last name', type: 'text' },
  { key: 'address1', header: 'address1', section: 'Customer info', label: 'Address line 1', type: 'text' },
  { key: 'city', header: 'city', section: 'Customer info', label: 'City', type: 'text' },
  { key: 'state', header: 'state', section: 'Customer info', label: 'State', type: 'text' },
  { key: 'zip', header: 'zip', section: 'Customer info', label: 'ZIP', type: 'text' },

  { key: 'weddingDate', header: 'weddingDate', section: 'Wedding & gown basics', label: 'Wedding date', type: 'text' },
  { key: 'gownPrice', header: 'gownPrice', section: 'Wedding & gown basics', label: 'Gown price', type: 'text' },
  { key: 'numberOfPieces', header: 'numberOfPieces', section: 'Wedding & gown basics', label: 'Number of pieces', type: 'text' },
  { key: 'designerInput', header: 'designerInput', section: 'Wedding & gown basics', label: 'Designer input', type: 'text' },
  { key: 'designerCanonical', header: 'designerCanonical', section: 'Wedding & gown basics', label: 'Designer canonical', type: 'text' },
  { key: 'designerMatchScore', header: 'designerMatchScore', section: 'Wedding & gown basics', label: 'Designer match score', type: 'text' },

  { key: 'itemsIncluded', header: 'itemsIncluded', section: 'Items included', label: 'Items included', type: 'array' },
  { key: 'itemsOtherText', header: 'itemsOtherText', section: 'Items included', label: 'Items other text', type: 'text' },

  { key: 'materialType', header: 'materialType', section: 'Materials', label: 'Material type', type: 'text' },
  { key: 'materialOtherText', header: 'materialOtherText', section: 'Materials', label: 'Material other text', type: 'text' },
  { key: 'colorType', header: 'colorType', section: 'Color', label: 'Color type', type: 'text' },
  { key: 'colorOtherText', header: 'colorOtherText', section: 'Color', label: 'Color other text', type: 'text' },

  { key: 'inspectionIssues', header: 'inspectionIssues', section: 'Condition / notes', label: 'Inspection issues', type: 'array' },
  { key: 'embellishmentsAddedDescription', header: 'embellishmentsAddedDescription', section: 'Condition / notes', label: 'Embellishments description', type: 'text' },
  { key: 'comments', header: 'comments', section: 'Condition / notes', label: 'Comments', type: 'text' },

  { key: 'seamstressName', header: 'seamstressName', section: 'Operations', label: 'Seamstress name', type: 'text' },
  { key: 'bridalSalonName', header: 'bridalSalonName', section: 'Operations', label: 'Bridal salon name', type: 'text' },

  { key: 'referralSources', header: 'referralSources', section: 'How did you hear about us?', label: 'Referral sources', type: 'array' },
  { key: 'referralOtherText', header: 'referralOtherText', section: 'How did you hear about us?', label: 'Referral other text', type: 'text' },

  { key: 'specialConcernDetails', header: 'specialConcernDetails', section: 'Special concerns', label: 'Special concern details', type: 'text' },
  { key: 'specialConcernImageCount', header: 'specialConcernImageCount', section: 'Special concerns', label: 'Special concern image count', type: 'text' },
  { key: 'specialConcernImageUrls', header: 'specialConcernImageUrls', section: 'Special concerns', label: 'Special concern image URLs', type: 'array' },

  { key: 'serviceRequested', header: 'serviceRequested', section: 'Services', label: 'Service requested', type: 'array' },
  { key: 'viewBeforeBoxed', header: 'viewBeforeBoxed', section: 'Services', label: 'View before boxed', type: 'text' },
  { key: 'estimatedCost', header: 'estimatedCost', section: 'Services', label: 'Estimated cost', type: 'text' },

  { key: 'consentAccepted', header: 'consentAccepted', section: 'Consent + signature', label: 'Consent accepted', type: 'boolean' },
  { key: 'signatureName', header: 'signatureName', section: 'Consent + signature', label: 'Signature name', type: 'text' },
  { key: 'signatureDate', header: 'signatureDate', section: 'Consent + signature', label: 'Signature date', type: 'text' }
];

const SHEET_HEADERS = FIELD_MAP.map((x) => x.header);

function doGet() {
  const template = HtmlService.createTemplateFromFile('index');
  template.appConfig = {
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
  const rawName = String(filename || '').trim();
  const normalizedName = rawName.replace(/\.html$/i, '');

  if (!normalizedName) {
    console.warn('include() called without a filename; returning empty content.');
    return '';
  }
  if (!/^[A-Za-z0-9_-]+$/.test(normalizedName)) {
    console.warn(`include() received invalid filename "${rawName}"; returning empty content.`);
    return '';
  }

  return HtmlService.createHtmlOutputFromFile(normalizedName).getContent();
}

function submitIntake(payload) {
  const submittedBy = getCurrentUserEmail_();

  enforceRateLimit_(getRequesterIdentity_());
  if (payload && payload.website && String(payload.website).trim() !== '') throw new Error('Submission rejected.');

  const normalized = normalizePayload_(payload || {});
  const validationError = validatePayload_(normalized);
  if (validationError) throw new Error(validationError);

  const uploadedImageUrls = uploadSpecialConcernImages_(normalized.specialConcernImagesRaw, normalized.customerName);

  normalized.submissionTimestamp = new Date();
  normalized.submittedByEmail = submittedBy;
  normalized.specialConcernImageUrls = uploadedImageUrls;
  normalized.specialConcernImageCount = uploadedImageUrls.length;

  const sheet = getOrCreateSheet_();
  const row = FIELD_MAP.map((field) => toSheetValue_(normalized[field.key], field.type));
  sheet.appendRow(row);

  const pdfBlob = buildPdf_(normalized);
  sendNotificationEmail_(normalized, pdfBlob);

  return { ok: true, message: 'Submission saved and emailed successfully.' };
}

function normalizePayload_(payload) {
  const clean = (val) => String(val || '').trim();
  const normalizeList = (arr) => Array.isArray(arr) ? arr.map((x) => clean(x)).filter(Boolean) : [];
  const normalizeImageList_ = (arr) => Array.isArray(arr) ? arr.filter((img) => img && img.dataBase64).map((img) => ({
    name: clean(img.name),
    mimeType: clean(img.mimeType) || 'application/octet-stream',
    dataBase64: clean(img.dataBase64)
  })) : [];

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

    specialConcernDetails: clean(payload.specialConcernDetails),
    specialConcernImagesRaw: normalizeImageList_(payload.specialConcernImages),
    specialConcernImageUrls: [],
    specialConcernImageCount: '',

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

function toSheetValue_(value, type) {
  if (type === 'array') return Array.isArray(value) ? value.join(', ') : '';
  if (type === 'boolean') return value ? 'Yes' : 'No';
  if (value === undefined || value === null) return '';
  return value;
}

function buildPdfModel_(data) {
  const sections = {};
  FIELD_MAP.forEach((field) => {
    const value = toSheetValue_(data[field.key], field.type);
    if (value === '' || value === 'No') return;
    if (!sections[field.section]) sections[field.section] = [];
    sections[field.section].push({
      label: field.label,
      value: value
    });
  });

  return Object.keys(sections).map((sectionName) => ({
    sectionName: sectionName,
    rows: sections[sectionName]
  }));
}


function uploadSpecialConcernImages_(images, customerName) {
  const safeImages = Array.isArray(images) ? images : [];
  if (!safeImages.length) return [];
  if (safeImages.length > 5) throw new Error('Please attach up to 5 images.');

  const folder = getOrCreateImageFolder_();
  const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd_HHmmss');
  const safeCustomerName = (customerName || 'customer').replace(/[^a-z0-9]/gi, '_');

  return safeImages.map((img, idx) => {
    const bytes = Utilities.base64Decode(img.dataBase64);
    if (bytes.length > 5 * 1024 * 1024) throw new Error('Each image must be 5MB or smaller.');

    const fileExt = String((img.mimeType || '').split('/')[1] || 'bin').replace(/[^a-z0-9]/gi, '');
    const fileName = 'concern_' + safeCustomerName + '_' + stamp + '_' + (idx + 1) + '.' + (fileExt || 'bin');
    const blob = Utilities.newBlob(bytes, img.mimeType || 'application/octet-stream', fileName);
    const file = folder.createFile(blob);
    return file.getUrl();
  });
}

function getOrCreateImageFolder_() {
  const props = PropertiesService.getScriptProperties();
  const existingId = String(props.getProperty(CONFIG.imageFolderIdProperty) || '').trim();

  if (existingId) {
    try {
      return DriveApp.getFolderById(existingId);
    } catch (err) {
      // fall through and recreate
    }
  }

  const folder = DriveApp.createFolder('Dublin Cleaners - Bridal Intake Images');
  folder.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
  props.setProperty(CONFIG.imageFolderIdProperty, folder.getId());
  return folder;
}

function findBestDesignerMatch_(input) {
  const typed = String(input || '').trim();
  if (!typed) return { canonical: '', score: 0 };

  const normalized = normalizeDesignerKey_(typed);
  if (DESIGNER_ALIASES[normalized]) return { canonical: DESIGNER_ALIASES[normalized], score: 1 };

  let best = { canonical: typed, score: 0 };
  for (let i = 0; i < DESIGNER_CANONICAL.length; i++) {
    const candidate = DESIGNER_CANONICAL[i];
    const score = similarity_(normalizeDesignerKey_(typed), normalizeDesignerKey_(candidate));
    if (score > best.score) best = { canonical: candidate, score: Number(score.toFixed(3)) };
  }

  if (best.score >= CONFIG.matchThreshold) return best;
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
  for (let i = 0; i <= m; i++) dp[i] = [i];
  for (let j = 1; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function getCurrentUserEmail_() {
  return String(Session.getActiveUser().getEmail() || '').toLowerCase().trim();
}

function getRequesterIdentity_() {
  return getCurrentUserEmail_() || String(Session.getTemporaryActiveUserKey() || '').trim() || 'anonymous';
}

function formatPhone_(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return '(' + digits.slice(0, 3) + ') ' + digits.slice(3, 6) + '-' + digits.slice(6);
  return phone;
}

function enforceRateLimit_(identity) {
  const cache = CacheService.getScriptCache();
  const key = 'rate_' + identity;
  const count = Number(cache.get(key) || '0');
  if (count >= CONFIG.rateLimitMax) throw new Error('Too many submissions. Please wait a moment and retry.');
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
  if (!sheet) sheet = ss.insertSheet('Submissions');

  hardenSpreadsheetAccess_(ss, sheet);

  if (sheet.getLastRow() === 0) sheet.appendRow(SHEET_HEADERS);

  return sheet;
}

function hardenSpreadsheetAccess_(ss, sheet) {
  const owner = ss.getOwner();
  const ownerEmail = owner ? String(owner.getEmail() || '').toLowerCase().trim() : '';
  const allowedEditors = getConfiguredAllowedEditors_();
  const editorSet = {};

  if (ownerEmail) editorSet[ownerEmail] = true;
  for (let i = 0; i < allowedEditors.length; i++) editorSet[allowedEditors[i]] = true;

  const editorEmails = Object.keys(editorSet);

  ss.getEditors().forEach((user) => {
    const email = String(user.getEmail() || '').toLowerCase().trim();
    if (!editorSet[email]) ss.removeEditor(user);
  });

  ss.getViewers().forEach((user) => ss.removeViewer(user));

  const file = DriveApp.getFileById(ss.getId());
  file.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);

  const protection = sheet.protect().setDescription('Only approved staff and the app can edit intake data.');
  const unprotectedRanges = protection.getUnprotectedRanges();
  if (unprotectedRanges.length) protection.setUnprotectedRanges([]);
  protection.setDomainEdit(false);

  protection.getEditors().forEach((user) => {
    const email = String(user.getEmail() || '').toLowerCase().trim();
    if (!editorSet[email]) protection.removeEditor(user);
  });

  if (editorEmails.length) {
    protection.addEditors(editorEmails);
    ss.addEditors(editorEmails);
  }
}

function getConfiguredAllowedEditors_() {
  const raw = String(PropertiesService.getScriptProperties().getProperty(CONFIG.spreadsheetEditorsProperty) || '').trim();
  if (!raw) return [];

  const seen = {};
  return raw
    .split(',')
    .map((email) => String(email || '').toLowerCase().trim())
    .filter((email) => {
      if (!email || seen[email]) return false;
      seen[email] = true;
      return true;
    });
}

function buildPdf_(data) {
  const template = HtmlService.createTemplateFromFile('print');
  template.sections = buildPdfModel_(data);
  const html = template.evaluate().getContent();
  const safeName = (data.customerName || 'Bridal Intake').replace(/[^a-z0-9]/gi, '_');
  return Utilities.newBlob(html, 'text/html', 'intake.html').getAs(MimeType.PDF).setName('Dublin_Cleaners_Intake_' + safeName + '.pdf');
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
    'Designer Canonical: ' + data.designerCanonical + ' (' + data.designerMatchScore + ')',
    'Services: ' + (data.serviceRequested || []).join(', '),
    'Items Included: ' + (data.itemsIncluded || []).join(', '),
    'View Before Boxed: ' + data.viewBeforeBoxed,
    'Estimated Cost: ' + data.estimatedCost,
    'Special Concern Notes: ' + data.specialConcernDetails,
    'Special Concern Images: ' + (data.specialConcernImageUrls || []).join(', '),
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
