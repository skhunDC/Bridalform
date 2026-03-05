const DESIGNER_CANONICAL = [
  'Allure Bridals', 'Amsale', 'BHLDN', 'David\'s Bridal', 'Enzoani', 'Essense of Australia', 'Justin Alexander', 'Maggie Sottero', 'Morilee', 'Pronovias', 'Rosa Clara', 'Stella York', 'Vera Wang'
];
const DESIGNER_ALIASES = {
  'davids bridal': 'David\'s Bridal',
  'justin alexandar': 'Justin Alexander',
  pronovia: 'Pronovias'
};
const MATCH_THRESHOLD = 0.78;

const FIELD_MAP = [
  'submissionTimestamp','submittedByEmail','customerName','phone','email','brideFirstName','marriedLastName','maidenLastName','address1','city','state','zip',
  'weddingDate','gownPrice','numberOfPieces','designerInput','designerCanonical','designerMatchScore','itemsIncluded','itemsOtherText',
  'materialType','materialOtherText','colorType','colorOtherText','inspectionIssues','embellishmentsAddedDescription','comments','seamstressName','bridalSalonName',
  'referralSources','referralOtherText','serviceRequested','viewBeforeBoxed','estimatedCost','consentAccepted','signatureName','signatureDate'
];

function normalizeKey(str){return String(str||'').toLowerCase().replace(/[^a-z0-9]/g,' ').replace(/\s+/g,' ').trim();}
function levenshtein(a,b){const m=a.length,n=b.length,dp=Array.from({length:m+1},()=>Array(n+1).fill(0));for(let i=0;i<=m;i++)dp[i][0]=i;for(let j=0;j<=n;j++)dp[0][j]=j;for(let i=1;i<=m;i++){for(let j=1;j<=n;j++){const c=a[i-1]===b[j-1]?0:1;dp[i][j]=Math.min(dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+c)}}return dp[m][n]}
function similarity(a,b){if(a===b)return 1;if(!a||!b)return 0;return 1-levenshtein(a,b)/Math.max(a.length,b.length)}

function findBestDesignerMatch(input){
  const typed = String(input||'').trim();
  if(!typed) return {canonical:'',score:0};
  const k = normalizeKey(typed);
  if(DESIGNER_ALIASES[k]) return {canonical:DESIGNER_ALIASES[k],score:1};
  let best={canonical:typed,score:0};
  for(const cand of DESIGNER_CANONICAL){
    const score = similarity(normalizeKey(typed), normalizeKey(cand));
    if(score>best.score) best={canonical:cand,score:Number(score.toFixed(3))};
  }
  return best.score>=MATCH_THRESHOLD ? best : {canonical:typed,score:Number(best.score.toFixed(3))};
}

function normalizePayload(payload){
  const clean=(v)=>String(v||'').trim();
  const list=(a)=>Array.isArray(a)?a.map(clean).filter(Boolean):[];
  return {
    customerName: clean(payload.customerName),
    serviceRequested: list(payload.serviceRequested),
    consentAccepted: Boolean(payload.consentAccepted),
    designerInput: clean(payload.designerInput),
    designerCanonical: findBestDesignerMatch(clean(payload.designerInput)).canonical
  };
}

module.exports = { findBestDesignerMatch, normalizePayload, FIELD_MAP };
