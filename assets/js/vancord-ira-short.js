const CONFIG = {
  bookCallUrl: 'https://www.vancord.com/contact-us/',
  shareBaseUrl: window.IRA_SHORT_DATA?.share_url || window.location.href.split('#')[0].split('?')[0],
  privacyNoticeUrl: 'https://www.vancord.com/privacy-policy/',
  crmEnabled: false,
  privacyNoticeVersion: '2026-05-19'
};
const QUESTIONS = window.IRA_SHORT_DATA?.questions || window.IRA_QUESTIONS || [];
const CATEGORY_ORDER = ['Govern','Identify','Protect','Detect','Respond','Recover'];
const ANSWER_KEYS = ['yes','partial','no','dontknow'];
const MOBILE_SHORT_QUESTIONS = {"q10":"Do you regularly update and test a formal incident response plan?","q19":"Do you have documented recovery and continuity plans based on business impact?","q26":"Do you inventory physical and data assets?","q27":"Do you run independent penetration tests at least annually?","q30":"Does everyone receive regular security awareness training?","q42":"Is EDR or MDR deployed across all systems?","q45":"Do you use multifactor authentication (MFA)?","q3":"Do you scan for vulnerabilities and know who does it and how often?","q4":"Are IT and security logs centralized in a SIEM?","q55":"Do you hold annual incident response tabletop exercises with assigned roles?","q50":"Do you regularly back up systems, applications, and data?","q51":"Do you periodically test whether backups can be restored?"};
let mobileCardIndex=0;
const ANSWER_LABELS = ['Yes','Partially','No','Not sure'];
const ANSWER_VALUES = { yes:1, partial:.5, no:0, dontknow:0, na:null };
const CATEGORY_META = {
  Govern: { color:'#4b3f8f', soft:'#eeebfa', css:'govern', blurb:'Govern establishes the strategy, policies, accountability, and oversight that make security a leadership concern rather than an isolated IT task.', first:'Confirm ownership, policy approval, incident-response authority, and leadership review cadence.' },
  Identify: { color:'#0f766e', soft:'#ddf7f3', css:'identify', blurb:'Identify answers the question: what assets, data, vendors, exposures, and vulnerabilities must be understood before an incident occurs?', first:'Validate asset inventory, data inventory, vendor access, and vulnerability visibility.' },
  Protect: { color:'#1c6db3', soft:'#e8f1fa', css:'protect', blurb:'Protect covers the preventive controls that reduce the likelihood and blast radius of an incident, including MFA, EDR/MDR, segmentation, backups, awareness, and access control.', first:'Check for exceptions in MFA, EDR/MDR coverage, privileged access, segmentation, and backup isolation.' },
  Detect: { color:'#c08418', soft:'#fcefd1', css:'detect', blurb:'Detect covers the ability to see suspicious activity quickly enough for the organization to act before a contained event becomes a breach.', first:'Confirm logging, SIEM coverage, alert ownership, retention, and response timing.' },
  Respond: { color:'#9a2820', soft:'#f3dad6', css:'respond', blurb:'Respond covers what happens after detection: roles, escalation, communications, tabletop exercises, plan updates, and executive decision-making under pressure.', first:'Schedule a tabletop exercise and update the incident response plan based on what breaks.' },
  Recover: { color:'#2d6a4f', soft:'#d8e8df', css:'recover', blurb:'Recover covers the ability to restore critical operations, validate backups, coordinate legal and insurance concerns, and return to service without improvising.', first:'Test restore capability and confirm the recovery sequence for critical systems.' }
};
const TIERS = [
  { min:0, max:40, name:'Foundational', color:'#9a2820', soft:'#f3dad6', text:'Building blocks are incomplete or not operating reliably yet. The most useful next step is to confirm which gaps are real, assign ownership, and prioritize controls that matter during a live incident.' },
  { min:41, max:65, name:'Developing', color:'#c08418', soft:'#fcefd1', text:'Several foundational controls appear to exist, but readiness may still depend on informal knowledge, uneven implementation, or untested assumptions. This is the point where validation and ownership matter most.' },
  { min:66, max:85, name:'Mature', color:'#2d6a4f', soft:'#d8e8df', text:'The program appears disciplined across most functions. The remaining value comes from testing assumptions, documenting evidence, and making sure governance and operations work under pressure.' },
  { min:86, max:100, name:'Resilient', color:'#002247', soft:'#e8eef5', text:'The posture appears strong across the six functions. The priority is to maintain evidence, run regular exercises, validate third-party assumptions, and keep executive oversight active.' }
];
const INDUSTRY_FIELDS = {
  Education: [
    { id:'edu_category', label:'Institution Category', type:'select', options:['K-12 School','School District','Private or Independent School','College or University','Community College','Technical or Trade School','Other'] },
    { id:'edu_size', label:'Student Body Size', type:'select', options:['Small: Under 1,000 students','Lower Mid-Size: 1,000–4,999 students','Mid-Size: 5,000–9,999 students','Large: 10,000–19,999 students','Very Large: 20,000+ students'] },
    { id:'edu_ownership', label:'Ownership / Funding Structure', type:'select', options:['Public / State Funded','Municipal or District Funded','Private Nonprofit','Private For-Profit','Church or Faith-Based','Charter / Sponsored','Other'] }
  ],
  Manufacturing: [
    { id:'mfg_environment', label:'Manufacturing Environment', type:'select', options:['General Manufacturing','Defense / Aerospace Supplier','Industrial or OT-Heavy Environment','Multi-Site Production','Food, Pharma, or Regulated Production','Other'] },
    { id:'mfg_size', label:'Operational Headcount', type:'select', options:['Small: Under 100 employees','Lower Mid-Market: 100–499 employees','Upper Mid-Market: 500–1,499 employees','Large / Enterprise: 1,500+ employees'] },
    { id:'mfg_ownership', label:'Ownership Structure', type:'select', options:['Privately Held','Family-Owned','Private Equity-Backed','Publicly Traded','Cooperative or Employee-Owned','Government Contractor / Defense Supplier','Other'] }
  ],
  'Public Sector': [
    { id:'public_type', label:'Public-Sector Organization Type', type:'select', options:['Municipality / Town / City','County or Regional Authority','Public Safety','Public Utility','School or Education Agency','State Agency / Department','Other'] },
    { id:'public_size', label:'Population or Constituency Served', type:'select', options:['Very Small: Under 2,500','Small: 2,500–9,999','Medium: 10,000–49,999','Large: 50,000–99,999','Very Large: 100,000+'] },
    { id:'public_governance', label:'Governance / Spending Approval Structure', type:'select', options:['Town Manager / Administrator','Mayor / Executive Office','Council / Board Approval','Department-Led Budget','State-Controlled Funding','Other'] }
  ],
  Healthcare: [
    { id:'health_type', label:'Healthcare Organization Type', type:'select', options:['Single Practice or Clinic','Multi-Location Practice','Community or Critical Access Hospital','Regional Health System','Senior Care / Long-Term Care','Behavioral Health','Healthcare Vendor or Service Provider','Other'] },
    { id:'health_size', label:'Approximate Size', type:'select', options:['Small: 1 location or under 25 providers','Mid-Size: 2–5 locations or 25–100 providers','Large: 6+ locations, 100+ providers, or hospital-based','Enterprise / Health System'] },
    { id:'health_data', label:'Primary Data Sensitivity', type:'select', options:['PHI / Patient Records','Payment / Billing Data','Employee Health Data','Research or Clinical Data','Mixed Sensitive Data','Other'] }
  ],
  'Financial Services': [
    { id:'fin_type', label:'Financial Organization Type', type:'select', options:['Bank','Credit Union','Insurance','Lender / Mortgage / Loan Servicer','Wealth / Advisory','Fintech or Financial SaaS','Other'] },
    { id:'fin_size', label:'Approximate Size Indicator', type:'select', options:['Small: 1–2 branches or local service area','Mid-Size: 3–10 branches or regional service area','Large: 10+ branches or multi-state service area','Enterprise / National'] },
    { id:'fin_trigger', label:'Most Relevant Oversight Pressure', type:'select', options:['GLBA / Safeguards Rule','Regulatory Examination','Cyber Insurance','Board or Audit Committee','Customer / Contract Requirement','Other'] }
  ],
  Nonprofit: [
    { id:'np_type', label:'Nonprofit Category', type:'select', options:['501(c)(3) Charity / Educational / Religious','Church or Religious Organization','Private Foundation','501(c)(4) Social Welfare','501(c)(6) Trade or Professional Association','Healthcare or Human Services Nonprofit','Other'] },
    { id:'np_other', label:'Other Nonprofit Category', type:'text', showWhen:{ field:'np_type', value:'Other' } },
    { id:'np_size', label:'Approximate Organization Size', type:'select', options:['Small: Under 25 staff','Mid-Size: 25–99 staff','Large: 100–499 staff','Very Large: 500+ staff'] }
  ],
  Other: [
    { id:'other_industry', label:'Industry Type', type:'text' },
    { id:'other_focus', label:'Organization Focus', type:'text' },
    { id:'other_size', label:'Organization Size', type:'select', options:['Small: Under 50 staff','Mid-Size: 50–249 staff','Large: 250–999 staff','Enterprise: 1,000+ staff'] }
  ]
};
let state = { mode:'quick', answers:{}, stage:0, isShared:false, consent:null };
const STAGES = [{title:'Planning & visibility',subtitle:'Know your plans, assets, and exposure.',label:'Plan'},{title:'Protection & detection',subtitle:'Check safeguards, threat visibility, and monitoring.',label:'Protect'},{title:'Incident response & recovery',subtitle:'Test your ability to respond and restore operations.',label:'Respond'}];
window.addEventListener('DOMContentLoaded', () => {
  const boot = window.IRA_SHORT_BOOT || {};
  if (boot.kind === 'view' || boot.kind === 'edit') {
    const saved = boot.data || {};
    const report = saved.report || {};
    const profile = saved.customization || report.profile || {};
    state.answers = Object.fromEntries(Object.entries(report.answers || {}).filter(([id,key]) => QUESTIONS.some(q => q.id === id) && ANSWER_KEYS.includes(key)));
    state.mode = 'quick';
    state.stage = 0;
    document.querySelector('.ira-short-app')?.classList.add(boot.kind === 'view' ? 'ira-view-only' : 'ira-edit-mode');
    renderTable();
    updateIndustryFields();
    restoreShortProfile(profile);
    validateCustomForm();
    if (boot.kind === 'edit') addShortSaveButton();
    updateProgress();
    renderResults();
    document.getElementById('results-section')?.classList.add('show');
    return;
  }
  if (window.location.hash && window.location.hash.length > 5) {
    try {
      const decoded = LZString.decompressFromEncodedURIComponent(window.location.hash.substring(1));
      const shared = JSON.parse(decoded);
      if (shared.answers && shared.mode) {
        state.mode = 'quick';
        state.stage = 0;
        state.answers = Object.fromEntries(Object.entries(shared.answers).filter(([id,key])=>getVisibleQuestions().some(q=>q.id===id) && ANSWER_KEYS.includes(key)));
        state.isShared = true;
        
        renderTable();
        renderResults();
        document.getElementById('shared-banner').classList.add('show');
        document.getElementById('results-section').classList.add('show');
        return;
      }
    } catch(e) { console.warn('Could not parse shared URL', e); }
  }
  renderTable();
  updateIndustryFields();
  validateCustomForm();
});
function getVisibleQuestions() { return QUESTIONS; }
function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function categoryIcon(cat) {
  const common = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  const icons = {
    Govern:`<svg ${common}><path d="M12 3l8 4v5c0 4.5-3.1 7.6-8 9-4.9-1.4-8-4.5-8-9V7l8-4Z"/><path d="M9 12l2 2 4-5"/></svg>`,
    Identify:`<svg ${common}><circle cx="11" cy="11" r="6"/><path d="M16 16l4 4"/></svg>`,
    Protect:`<svg ${common}><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><path d="M12 14v2"/></svg>`,
    Detect:`<svg ${common}><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>`,
    Respond:`<svg ${common}><path d="M12 3v6"/><path d="M12 15v6"/><path d="M3 12h6"/><path d="M15 12h6"/><circle cx="12" cy="12" r="3"/></svg>`,
    Recover:`<svg ${common}><path d="M3 12a9 9 0 0 1 15-6.7"/><path d="M18 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7"/><path d="M6 21v-5h5"/></svg>`
  };
  return icons[cat] || icons.Govern;
}

function trackAssessmentEvent(eventName, details={}) {
  // GA4/GTM may listen for these event names when integrated into WordPress.
  // No network request or CRM submission happens in this standalone preview.
  if (Array.isArray(window.dataLayer)) window.dataLayer.push({event:eventName,...details});
}
function stageQuestions(index=state.stage) {
  return getVisibleQuestions().slice(index * 4, (index + 1) * 4);
}
function renderTable() {
  state.stage = Math.max(0, Math.min(2, Number(state.stage)||0));
  const stage = STAGES[state.stage];
  const current = stageQuestions();
  document.getElementById('stage-description').textContent = stage.subtitle;
  const steps = document.getElementById('deck-steps');
  steps.innerHTML = STAGES.map((s,i)=>{
    const done = stageQuestions(i).every(q=>Boolean(state.answers[q.id]));
    const stateClass = i===state.stage ? 'active' : (done ? 'done' : '');
    const accessible = i<=state.stage || STAGES.slice(0,i).every((_,j)=>stageQuestions(j).every(q=>state.answers[q.id]));
    const count = stageQuestions(i).filter(q=>Boolean(state.answers[q.id])).length;
    return `<button type="button" class="deck-step ${stateClass}" onclick="goToStage(${i})" ${accessible?'':'disabled'} ${i===state.stage?'aria-current="step"':''} aria-label="${escapeHtml(s.label)}: ${count} of 4 answered"><span class="deck-step-name">${escapeHtml(s.label)}</span><span class="deck-step-count">${count}/4</span></button>`;
  }).join('');
  const cards = document.getElementById('qcards');
  cards.innerHTML = current.map((q,i)=>{
    const answered = state.answers[q.id];
    const number = state.stage*4+i+1;
    return `<article class="flip-card ${answered?'answered':''}" id="card-${q.id}" aria-label="Question ${number} of 12">
      <div class="flip-card-inner">
        <div class="flip-face flip-front" id="front-${q.id}">
          <div class="flip-kicker"><span class="flip-num">${String(number).padStart(2,'0')}</span><span class="flip-category">${escapeHtml(q.category)}</span><span class="flip-answered" aria-label="Answered">${answered?'✓ Answered':''}</span></div>
          <h3><span class="flip-question-full">${escapeHtml(q.item)}</span><span class="flip-question-short">${escapeHtml(MOBILE_SHORT_QUESTIONS[q.id]||q.item)}</span></h3>
          <fieldset class="answer-grid"><legend class="sr-only">Answer question ${number}</legend>${ANSWER_KEYS.map((key,k)=>`<div class="card-answer ${key}"><input type="radio" name="${q.id}" id="${q.id}-${key}" value="${key}" ${answered===key?'checked':''} onchange="answerQuestion('${q.id}','${key}')"><label for="${q.id}-${key}"><span>${ANSWER_LABELS[k]}</span></label></div>`).join('')}</fieldset>
          <button type="button" class="flip-help" onclick="toggleExplain('${q.id}',this)" aria-label="Why question ${number} matters" aria-expanded="false">ⓘ Why it matters <span aria-hidden="true">↗</span></button>
        </div>
        <div class="flip-face flip-back" id="back-${q.id}" inert aria-hidden="true">
          <div class="flip-kicker"><span class="flip-num">${String(number).padStart(2,'0')}</span><span class="flip-category">${escapeHtml(q.category)}</span></div>
          <div class="flip-original-label">Original question</div><p class="flip-original">${escapeHtml(q.item)}</p>
          <h3 class="flip-detail-title">Why this matters</h3><p class="flip-explanation">${escapeHtml(q.explanation)}</p>
          <button type="button" class="flip-return" onclick="toggleExplain('${q.id}',this)">← Back to question</button>
        </div>
      </div>
    </article>`;
  }).join('');
  renderDesktopMatrix();
  updateProgress();
}

function renderDesktopMatrix() {
  const stageQ=stageQuestions();
  const responseHeadings=['Yes','Partially','No','Not sure'];
  const html=stageQ.map((q,i)=>{
    const number=state.stage*4+i+1;
    const question=MOBILE_SHORT_QUESTIONS[q.id]||q.item;
    const choices=ANSWER_KEYS.map((key,k)=>{
      const checked=state.answers[q.id]===key;
      return '<td class="matrix-answer-cell '+(checked?'matrix-chosen':'')+'"><label class="matrix-choice" title="'+escapeHtml(responseHeadings[k])+'"><input type="radio" name="matrix-'+q.id+'" value="'+key+'" id="matrix-'+q.id+'-'+key+'" aria-label="'+escapeHtml(responseHeadings[k])+' — '+escapeHtml(question)+'" '+(checked?'checked ':'')+'onchange="answerQuestion(\''+q.id+'\',\''+key+'\')"></label></td>';
    }).join('');
    return '<tr class="matrix-question-row" data-question="'+q.id+'"><th scope="row"><div class="matrix-question-copy"><span class="matrix-number">'+String(number).padStart(2,'0')+'</span><div class="matrix-copy-body"><span class="matrix-question-text">'+escapeHtml(question)+'</span><div class="matrix-question-meta"><span class="matrix-function">'+escapeHtml(q.category)+'</span><button type="button" class="matrix-why" aria-controls="matrix-info-'+q.id+'" aria-expanded="false" onclick="toggleMatrixInfo(\''+q.id+'\',this)">Why it matters</button></div></div></div></th>'+choices+'</tr>'+
      '<tr id="matrix-info-'+q.id+'" class="matrix-detail-row" hidden><td colspan="5"><div class="matrix-detail-panel"><p><strong>Original question: </strong>'+escapeHtml(q.item)+'</p><p><strong>Why it matters: </strong>'+escapeHtml(q.explanation)+'</p></div></td></tr>';
  }).join('');
  document.getElementById('desktop-question-matrix').innerHTML =
    '<div class="matrix-frame"><table class="matrix-question-table"><caption class="sr-only">'+escapeHtml(STAGES[state.stage].label)+' stage assessment questions and responses</caption><colgroup><col class="matrix-col-question">'+Array.from({length:4},()=>'<col class="matrix-col-choice">').join('')+'</colgroup><thead><tr><th scope="col">Question</th>'+responseHeadings.map(x=>'<th scope="col">'+x+'</th>').join('')+'</tr></thead><tbody>'+html+'</tbody></table></div><p class="matrix-access-note">Select one answer per row. Use “Why it matters” to see the full question and explanation.</p>';
}
function toggleMatrixInfo(qid, button) {
  const panel=document.getElementById('matrix-info-'+qid);
  if(!panel)return;
  panel.hidden=!panel.hidden;
  button.setAttribute('aria-expanded',String(!panel.hidden));
  button.textContent=panel.hidden?'Why it matters':'Hide explanation';
}
function syncAnswerControls(qid,key) {
  document.querySelectorAll('#qcards input[name="'+qid+'"], #desktop-question-matrix input[name="matrix-'+qid+'"]')
    .forEach(input=>{input.checked=input.value===key;});
  const row=document.querySelector('#desktop-question-matrix tr[data-question="'+qid+'"]');
  if(row)row.querySelectorAll('.matrix-answer-cell').forEach(cell=>cell.classList.toggle('matrix-chosen',!!cell.querySelector('input:checked')));
}

function syncMobileQuestion() {
  const cards=[...document.querySelectorAll('#qcards .flip-card')];
  if (!cards.length) return;
  mobileCardIndex=Math.min(3,Math.max(0,mobileCardIndex));
  cards.forEach((card,i)=>card.classList.toggle('mobile-current',i===mobileCardIndex));
  const stageQ=stageQuestions();
  const active=stageQ[mobileCardIndex];
  const pips=document.getElementById('mobile-pips');
  if (pips) {
    pips.setAttribute('aria-label',`Question ${mobileCardIndex+1} of 4`);
    pips.innerHTML=stageQ.map((q,i)=>`<span class="mobile-pip ${state.answers[q.id]?'done':''} ${i===mobileCardIndex?'current':''}" aria-hidden="true"></span>`).join('');
  }
  const previous=document.getElementById('btn-mobile-prev');
  const next=document.getElementById('btn-mobile-next');
  if (previous) previous.disabled=mobileCardIndex===0;
  if (next) {
    const last=mobileCardIndex===3;
    next.disabled=!state.answers[active.id] || (last && stageQ.some(q=>!state.answers[q.id]));
    next.textContent=last ? (state.stage===2?'See my results →':`Continue to ${STAGES[state.stage+1].label} →`) : 'Next question →';
  }
}
function moveMobileQuestion(direction) {
  if (direction<0) {
    if(mobileCardIndex>0) mobileCardIndex--;
  } else {
    const active=stageQuestions()[mobileCardIndex];
    if(!active || !state.answers[active.id]) return;
    if(mobileCardIndex<3) mobileCardIndex++;
    else if(stageQuestions().every(q=>state.answers[q.id])) {
      if(state.stage===2) { calculateAndShow(); return; }
      stageNext(); return;
    }
  }
  syncMobileQuestion();
  const heading=document.getElementById('deck-steps');
  if(heading && window.matchMedia('(max-width:680px)').matches) heading.scrollIntoView({block:'start',behavior:'smooth'});
}
function toggleExplain(qid, btn) {
  const card = document.getElementById('card-' + qid);
  if (!card) return;
  const isFlipped = card.classList.toggle('flipped');
  const front = document.getElementById('front-' + qid), back = document.getElementById('back-' + qid);
  front.inert = isFlipped; back.inert = !isFlipped;
  front.setAttribute('aria-hidden',String(isFlipped));
  back.setAttribute('aria-hidden',String(!isFlipped));
  if (btn && btn.hasAttribute('aria-expanded')) btn.setAttribute('aria-expanded',String(isFlipped));
  // Focus moves after the CSS transition so keyboard navigation stays on the visible face.
  setTimeout(()=>{const dest=isFlipped ? back.querySelector('.flip-return') : front.querySelector('.flip-help'); if(dest) dest.focus({preventScroll:true});},240);
}
function goToStage(index) {
  if (index===state.stage || index<0 || index>2) return;
  if (index>state.stage && STAGES.slice(0,index).some((_,i)=>stageQuestions(i).some(q=>!state.answers[q.id]))) return;
  state.stage = index;
  mobileCardIndex=0;
  renderTable();
  document.getElementById('assess-section').scrollIntoView({behavior:'smooth',block:'start'});
  trackAssessmentEvent('assessment_stage_view',{stage:index+1});
}
function stageBack() { goToStage(state.stage-1); }
function stageNext() {
  if (state.stage>=2 || stageQuestions().some(q=>!state.answers[q.id])) return;
  trackAssessmentEvent('assessment_stage_complete',{stage:state.stage+1});
  goToStage(state.stage+1);
}
function setMode(mode) { /* Quick mode only; full assessment remains a separate product. */ }
function answerQuestion(qid,key) {
  if (!ANSWER_KEYS.includes(key) || !getVisibleQuestions().some(q=>q.id===qid)) return;
  const first=!state.answers[qid];
  state.answers[qid] = key;
  syncAnswerControls(qid,key);
  const card=document.getElementById('card-'+qid);
  if (card) {
    card.classList.add('answered');
    const badge=card.querySelector('.flip-answered');
    if(badge) badge.textContent='✓ Answered';
  }
  if(first && Object.values(state.answers).filter(Boolean).length===1) trackAssessmentEvent('assessment_start',{mode:'quick'});
  trackAssessmentEvent('assessment_answer_selected',{question_id:qid,stage:state.stage+1});
  updateProgress();
}
function resetAnswers() {
  if (Object.keys(state.answers).length === 0) return;
  if (!confirm('Clear all answers and start over?')) return;
  state.answers = {}; state.stage=0; mobileCardIndex=0;
  renderTable();
  document.getElementById('results-section').classList.remove('show');
}
function redoAssessment() {
  if (Object.keys(state.answers).length && !confirm('Clear this assessment and start again?')) return;
  state.answers = {}; state.stage=0; mobileCardIndex=0; state.isShared=false;
  if (window.location.hash) history.pushState('',document.title,window.location.pathname+window.location.search);
  document.getElementById('results-section').classList.remove('show');
  document.getElementById('shared-banner').classList.remove('show');
  renderTable();
  document.getElementById('assess-section').scrollIntoView({behavior:'smooth',block:'start'});
}
function updateProgress() {
  const visible=getVisibleQuestions(), total=visible.length, answered=visible.filter(q=>state.answers[q.id]).length;
  const pct=answered / total * 100;
  document.getElementById('progress-count').textContent=answered;
  document.getElementById('progress-total').textContent=total;
  document.getElementById('tc-answered').textContent=answered;
  document.getElementById('tc-total').textContent=total;
  document.getElementById('progbar-fill').style.width=pct+'%';
  const ready=answered===total;
  document.getElementById('btn-calc').disabled=!ready;
  document.getElementById('btn-calc-bottom').disabled=!ready;
  const completedHere=stageQuestions().filter(q=>state.answers[q.id]).length;
  // Stage progress is shown once, inside each tab.
  document.getElementById('btn-stage-back').disabled=state.stage===0;
  const next=document.getElementById('btn-stage-next'), finish=document.getElementById('btn-calc-bottom');
  next.hidden=state.stage===2; finish.hidden=state.stage!==2;
  next.disabled=completedHere!==4;
  if(state.stage<2) next.textContent=state.stage===0?'Next: Protect →':'Next: Respond →';
  const remainHere=4-completedHere;
  document.getElementById('ab-status-text').textContent=remainHere>0 ? `${remainHere} question${remainHere===1?'':'s'} remaining in this stage` : (state.stage===2 ? 'All 12 answered. Your results are ready.' : 'Stage complete. Continue when ready.');
  if(ready) document.getElementById('results-section').classList.remove('show');
  const steps=document.querySelectorAll('.deck-step');
  steps.forEach((step,i)=>{
    const done=stageQuestions(i).every(q=>!!state.answers[q.id]);
    step.classList.toggle('done',done);
    const count = stageQuestions(i).filter(q=>!!state.answers[q.id]).length;
    step.querySelector('.deck-step-count').textContent=`${count}/4`;
    step.setAttribute('aria-label',`${STAGES[i].label}: ${count} of 4 answered`);
    step.disabled = i>state.stage && STAGES.slice(0,i).some((_,j)=>stageQuestions(j).some(q=>!state.answers[q.id]));
  });
  syncMobileQuestion();
}
function calculateScore() {
  const byCategory = {};
  getVisibleQuestions().forEach(q => {
    const ans = state.answers[q.id];
    if (!ans) return;
    const val = ANSWER_VALUES[ans];
    if (val === null) return;
    if (!byCategory[q.category]) byCategory[q.category] = { w:0, s:0 };
    byCategory[q.category].w += q.weight;
    byCategory[q.category].s += q.weight * val;
  });
  const catScores = {};
  Object.keys(byCategory).forEach(c => catScores[c] = byCategory[c].w ? Math.round((byCategory[c].s / byCategory[c].w) * 100) : 0);
  let sum = 0, count = 0;
  Object.keys(catScores).forEach(c => { sum += catScores[c]; count++; });
  return { overall: count ? Math.round(sum / count) : 0, catScores };
}
function getTier(score) { return TIERS.find(t => score >= t.min && score <= t.max) || TIERS[0]; }
function getWeakestCategory(catScores) {
  let weakest = null;
  Object.entries(catScores).forEach(([cat,score]) => { if (!weakest || score < weakest.score) weakest = {cat,score}; });
  return weakest;
}
function getTopGaps() {
  return getVisibleQuestions().filter(q => ['no','partial','dontknow'].includes(state.answers[q.id])).sort((a,b) => {
    const pa = ['no','dontknow'].includes(state.answers[a.id]) ? 1 : .5;
    const pb = ['no','dontknow'].includes(state.answers[b.id]) ? 1 : .5;
    return (b.weight * pb) - (a.weight * pa);
  }).slice(0,3);
}
function calculateAndShow() {
  if (getVisibleQuestions().some(q=>!state.answers[q.id])) return;
  trackAssessmentEvent('assessment_completed',{mode:'quick',question_count:12});
  renderResults();
  document.getElementById('results-section').classList.add('show');
  setTimeout(() => document.getElementById('results-section').scrollIntoView({ behavior:'smooth', block:'start' }), 80);
}
function renderResults() {
  const { overall, catScores } = calculateScore();
  const tier = getTier(overall);
  const weakest = getWeakestCategory(catScores);
  const gaps = getTopGaps();
  document.getElementById('score-val').textContent = overall;
  document.querySelector('.executive-dial').setAttribute('aria-label', `Readiness score ${overall} out of 100, ${tier.name}`);
  const circ = 2 * Math.PI * 52;
  const offset = circ - (overall / 100) * circ;
  const fg = document.getElementById('sc-fg');
  fg.setAttribute('stroke', tier.color);
  fg.style.strokeDashoffset = circ;
  setTimeout(() => { fg.style.strokeDashoffset = offset; }, 100);
  document.getElementById('tier-name').textContent = tier.name;
  document.getElementById('tier-text').textContent = tier.text;
  document.getElementById('score-meaning').innerHTML = buildScoreMeaning(overall, tier, weakest);
  document.getElementById('fail-first-text').innerHTML = buildFailFirstText(weakest);
  document.getElementById('escalation-text').innerHTML = buildEscalationText(weakest, gaps);
  document.getElementById('conversation-text').innerHTML = buildOnPageConversation(overall, tier, weakest);
  document.getElementById('validation-text').innerHTML = weakest ? CATEGORY_META[weakest.cat].first : 'Review evidence, ownership, and test history before treating the score as settled.';
  renderWall('wall-viz', catScores);
  const cap = document.getElementById('wall-caption');
  if (weakest) cap.innerHTML = `Right now the wall is set by <b style="color:${CATEGORY_META[weakest.cat].color}">${weakest.cat}</b> at <b>${weakest.score}/100</b>. Start by validating that function before assuming the higher-scoring areas will carry the response.`;
  renderCategoryCards(catScores);
  renderGaps();
  renderAnswerLogOnPage();
  renderPresentationGuidance(overall, tier, weakest, gaps);
}
function buildOnPageConversation(overall, tier, weakest) {
  if (!weakest) return 'The immediate next step is to review the scoring assumptions and confirm which controls are documented, operating, and tested.';
  return `The useful internal question is not whether the score is perfect. It is whether the organization would be comfortable defending its current <strong>${weakest.cat}</strong> readiness if an incident happened this quarter. Start with evidence, ownership, and the first validation action.`;
}
function buildScoreMeaning(overall, tier, weakest) {
  const weakPart = weakest ? ` The lowest visible function is <strong>${weakest.cat}</strong>, which means the organization should not treat the stronger categories as proof of full readiness.` : '';
  return `A score of <strong>${overall}/100</strong> places the organization in the <strong>${tier.name}</strong> range. This is a screening result, not an audit finding. It shows where the current answers suggest the organization has operating strengths, partial controls, and evidence gaps.${weakPart}`;
}
function buildFailFirstText(weakest) {
  if (!weakest) return 'No single function was available as the weakest category. Review all answers and confirm the score with evidence.';
  return `The first place to validate is <strong>${weakest.cat}</strong> at <strong>${weakest.score}/100</strong>. In an incident, weak readiness rarely fails as an abstract score. It fails through unclear ownership, missing evidence, delayed decisions, untested procedures, or tools that do not operate the way people assume.`;
}
function buildEscalationText(weakest, gaps) {
  const firstGap = gaps && gaps[0] ? gaps[0].item : 'the lowest-scoring control area';
  const cat = weakest ? weakest.cat : 'the weakest readiness area';
  return `Start with a calm internal review: “This assessment suggests we should validate <strong>${cat}</strong> readiness, beginning with <strong>${escapeHtml(firstGap)}</strong>.” That keeps the conversation practical rather than alarmist and gives leadership a clear first decision point.`;
}
function buildSnapshotActions(gaps) {
  if (!gaps || gaps.length === 0) {
    return `<h4>First things to address</h4><div class="snapshot-action-list"><div class="snapshot-action" style="--action-color:var(--green);"><div class="num">✓</div><div><div class="meta">No immediate gaps selected</div><div class="topic">Review evidence and keep testing assumptions.</div><div class="fix">A strong self-screen still needs periodic validation through tabletop exercises, restore testing, and outside review where appropriate.</div></div></div></div>`;
  }
  return `<h4>First things to address</h4><div class="snapshot-action-list">${gaps.slice(0,3).map((g,i)=>{
    const meta = CATEGORY_META[g.category];
    return `<div class="snapshot-action" style="--action-color:${meta.color};"><div class="num">${i+1}</div><div><div class="meta">${categoryIcon(g.category)}${escapeHtml(g.category)}</div><div class="topic">${escapeHtml(g.item)}</div><div class="fix">${escapeHtml(g.remediation || meta.first)}</div></div></div>`;
  }).join('')}</div>`;
}
function firstConversation(cat) {
  return {
    Govern:'Who owns the program and how is risk accepted?',
    Identify:'Do we know what assets and data are exposed?',
    Protect:'Which preventive controls have exceptions?',
    Detect:'Who sees alerts and how quickly are they handled?',
    Respond:'Who does what when an incident starts?',
    Recover:'Can we restore the right systems in the right order?'
  }[cat] || 'Validate evidence and ownership';
}
function renderWall(containerId, catScores) {
  const el = document.getElementById(containerId);
  const weakest = getWeakestCategory(catScores);
  el.innerHTML = CATEGORY_ORDER.filter(c => catScores[c] !== undefined).map(cat => {
    const s = catScores[cat];
    const meta = CATEGORY_META[cat];
    const isWeakest = weakest && weakest.cat === cat && weakest.score < 100;
    return `<div class="wall-col ${isWeakest?'weakest':''}"><div class="plank" style="height:0%;background:${meta.color};" data-target="${s}"><div class="plank-score">${s}</div></div><div class="wall-label">${cat}</div></div>`;
  }).join('');
  setTimeout(() => el.querySelectorAll('.plank').forEach(p => { p.style.height = Math.max(4, Number(p.dataset.target)) + '%'; }), 100);
}
function renderCategoryCards(catScores) {
  document.getElementById('cat-cards').innerHTML = CATEGORY_ORDER.filter(c => catScores[c] !== undefined).map(cat => {
    const meta = CATEGORY_META[cat];
    return `<div class="cat-card" style="--cat-color:${meta.color};--cat-soft:${meta.soft};"><div class="cat-top"><div class="cat-title-wrap"><span class="cat-icon" aria-hidden="true">${categoryIcon(cat)}</span><div class="cat-title">${cat}</div></div><div class="cat-score">${catScores[cat]}</div></div><p>${meta.blurb}</p></div>`;
  }).join('');
}
function renderGaps() {
  const gaps = getTopGaps();
  const card = document.getElementById('gaps-card');
  if (!gaps.length) { card.classList.add('hide'); return; }
  card.classList.remove('hide');
  document.getElementById('gaps-list').innerHTML = gaps.map((g,i) => {
    const meta = CATEGORY_META[g.category];
    return `<div class="gap-item" style="--gap-color:${meta.color};--gap-soft:${meta.soft};"><div class="gap-num">${String(i+1).padStart(2,'0')}</div><div><span class="gap-cat">${categoryIcon(g.category)}${g.category}</span><div class="gap-q">${escapeHtml(g.item)}</div><div class="gap-fix">${escapeHtml(g.remediation || meta.first)}</div></div></div>`;
  }).join('');
}
function renderAnswerLogOnPage() {
  const answerLabelMap = { yes:'Yes', partial:'Partial', no:'No', dontknow:"Don't know", na:'N/A' };
  const answerColorMap = { yes:'#2d6a4f', partial:'#c08418', no:'#9a2820', dontknow:'#334155', na:'#64748b' };
  const answerBgMap = { yes:'#d8e8df', partial:'#fcefd1', no:'#f3dad6', dontknow:'#f1f5f9', na:'#f8fafc' };
  const rows = getVisibleQuestions().map(q => {
    const meta = CATEGORY_META[q.category];
    const ans = state.answers[q.id] || '';
    const label = answerLabelMap[ans] || '—';
    return `<tr><td><span class="log-category" style="--log-color:${meta.color};--log-soft:${meta.soft};">${categoryIcon(q.category)}${q.category}</span></td><td>${escapeHtml(q.item)}</td><td><span class="answer-pill" style="--ans-color:${answerColorMap[ans] || '#64748b'};--ans-bg:${answerBgMap[ans] || '#f8fafc'};">${label}</span></td></tr>`;
  }).join('');
  document.getElementById('answer-log-table').innerHTML = `<thead><tr><th>Function</th><th>Question</th><th>Answer</th></tr></thead><tbody>${rows}</tbody>`;
}
function renderPresentationGuidance(overall, tier, weakest, gaps) {
  const weak = weakest ? weakest.cat : 'the lowest-scoring readiness area';
  const top = gaps && gaps.length ? gaps[0].item : 'the first incomplete or uncertain control';
  document.getElementById('presentation-intro').innerHTML = `A useful internal conversation does not start with fear. It starts with evidence. The practical message is that the current screen places the organization at <strong>${overall}/100</strong> in the <strong>${tier.name}</strong> range, with <strong>${weak}</strong> as the first area to validate.`;
  document.getElementById('presentation-grid').innerHTML = [
    { h:'Suggested opening', p:`“I completed a structured incident-readiness screen. It is not an audit, but it gives us a clearer starting point for reviewing ${weak} readiness and the controls behind it.”` },
    { h:'First meeting agenda', p:'', list:['Confirm whether the answers reflect documented evidence or assumptions.','Review the three priority gaps above.','Assign an owner for the first validation action.','Decide whether outside review is needed before budget, insurance, audit, or board discussion.'] },
    { h:'First issue to validate', p:`Begin with <strong>${escapeHtml(top)}</strong>. Ask who owns it, what evidence exists, when it was last tested, and what would happen if the organization had to rely on it this quarter.` }
  ].map(x => `<div class="present-card"><h4>${x.h}</h4>${x.p ? `<p>${x.p}</p>` : ''}${x.list ? `<ul>${x.list.map(i=>`<li>${i}</li>`).join('')}</ul>` : ''}</div>`).join('');
}
function scrollToCustomize() { selectCustomizeTab('role'); document.getElementById('customize-card').scrollIntoView({ behavior:'smooth', block:'start' }); }
function selectCustomizeTab(section, focusTab=false) {
  const names=['role','org','team','finish'];
  if(!names.includes(section)) return;
  for(const name of names){
    const tab=document.getElementById('ctx-tab-'+name), panel=document.getElementById('ctx-panel-'+name);
    const active=name===section;
    if(!tab||!panel) continue;
    tab.classList.toggle('active',active);
    tab.setAttribute('aria-selected',active?'true':'false');
    tab.tabIndex=active?0:-1;
    panel.hidden=!active;
  }
  if(section==='finish') renderCustomizeReview();
  if(focusTab) document.getElementById('ctx-tab-'+section)?.focus({preventScroll:true});
}
function handleCustomizeTabKey(event){
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
  const names=['role','org','team','finish'];
  const current=names.findIndex(n=>document.getElementById('ctx-tab-'+n).getAttribute('aria-selected')==='true');
  const next=event.key==='Home'?0:event.key==='End'?names.length-1:(current+(event.key==='ArrowRight'?1:names.length-1))%names.length;
  event.preventDefault(); selectCustomizeTab(names[next],true);
}
function firstIncompleteCustomizeSection(){
  const name=document.getElementById('f-fullname').value.trim();
  const email=document.getElementById('f-email').value.trim();
  const role=document.getElementById('f-role').value;
  if(!name || !emailValid(email) || !role) return 'role';
  const industry=document.getElementById('f-industry').value;
  const other=document.getElementById('dyn-other_industry');
  if(!document.getElementById('f-company').value.trim()||!industry||(industry==='Other'&&(!other||!other.value.trim()))) return 'org';
  if(!getSelectedAudiences().length) return 'team';
  return null;
}
function requestReportDownload(){
  if(validateCustomForm()) return downloadCustomReport();
  const section=firstIncompleteCustomizeSection();
  if(section){
    selectCustomizeTab(section);
    document.getElementById('form-status').textContent='Complete the missing information in '+({role:'Your Role',org:'Your Organization',team:'Your Team'}[section]||'this section')+' before downloading.';
  } else {
    selectCustomizeTab('finish');
    document.getElementById('form-status').textContent='Please acknowledge the privacy notice to download your brief.';
  }
  document.getElementById('customize-card').scrollIntoView({behavior:'smooth',block:'start'});
}
function toggleAudienceAll(el) {
  document.querySelectorAll('input[name="audience"]').forEach(cb => cb.checked = el.checked);
  validateCustomForm();
}
function updateIndustryFields() {
  const industry = document.getElementById('f-industry').value;
  const holder = document.getElementById('industry-fields');
  const fields = INDUSTRY_FIELDS[industry] || [];
  if (!fields.length) { holder.innerHTML = ''; return; }
  holder.innerHTML = `<div class="dynamic-box"><h4>${industry} details</h4><div class="form-grid">${fields.map(f => renderDynamicField(f)).join('')}</div></div>`;
  fields.forEach(f => {
    const el = document.getElementById('dyn-' + f.id);
    if (el) el.addEventListener('change', () => { updateConditionalVisibility(); validateCustomForm(); });
    if (el) el.addEventListener('input', validateCustomForm);
  });
  updateConditionalVisibility();
}
function renderDynamicField(f) {
  const cond = f.showWhen ? ` data-show-field="${f.showWhen.field}" data-show-value="${f.showWhen.value}"` : '';
  const common = `class="field dynamic-field"${cond}`;
  if (f.type === 'select') {
    return `<div ${common}><label for="dyn-${f.id}">${f.label}</label><select id="dyn-${f.id}"><option value="">Select</option>${f.options.map(o => `<option>${escapeHtml(o)}</option>`).join('')}</select></div>`;
  }
  return `<div ${common}><label for="dyn-${f.id}">${f.label}</label><input type="text" id="dyn-${f.id}" placeholder="Enter ${escapeHtml(f.label.toLowerCase())}"></div>`;
}
function updateConditionalVisibility() {
  document.querySelectorAll('.dynamic-field[data-show-field]').forEach(box => {
    const field = box.getAttribute('data-show-field');
    const value = box.getAttribute('data-show-value');
    const controller = document.getElementById('dyn-' + field);
    const show = controller && controller.value === value;
    box.classList.toggle('hide', !show);
  });
}
function renderCustomizeReview(){
  const el=document.getElementById('ctx-review');
  if(!el)return;
  const p=getProfile();
  const entries=[
    ['Your role',p.role||'Add your role','role'],
    ['Organization',p.company||'Add organization','org'],
    ['Decision-makers',p.audiences.length?p.audiences.length+' selected':'Select at least one','team']
  ];
  el.innerHTML=entries.map(([label,value,target])=>'<div class="review-item '+(value.startsWith('Add ')||value.startsWith('Select ')?'is-missing':'')+'"><strong>'+escapeHtml(label)+'</strong><span>'+escapeHtml(value)+'</span></div>').join('');
}
function captureConsentTime() {
  const now = new Date();
  state.consent = { utc: now.toISOString(), local: now.toString(), timezoneOffsetMinutes: now.getTimezoneOffset(), privacyNoticeVersion: CONFIG.privacyNoticeVersion };
}
function getSelectedAudiences() { return [...document.querySelectorAll('input[name="audience"]:checked')].map(x => x.value); }
function emailValid(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function getProfile() {
  const industry = document.getElementById('f-industry').value;
  const details = {};
  (INDUSTRY_FIELDS[industry] || []).forEach(f => {
    const box = document.getElementById('dyn-' + f.id);
    if (box && !box.closest('.dynamic-field')?.classList.contains('hide')) details[f.id] = box.value;
  });
  return {
    fullName: document.getElementById('f-fullname').value.trim(),
    email: document.getElementById('f-email').value.trim(),
    company: document.getElementById('f-company').value.trim(),
    role: document.getElementById('f-role').value,
    audiences: getSelectedAudiences(),
    industry,
    trigger: document.getElementById('f-trigger').value,
    details,
    consents: {
      analystFollowup: document.getElementById('c-followup').checked,
      securityAndPresentationGuidance: document.getElementById('c-guidance').checked,
      privacyAcknowledgement: document.getElementById('c-privacy').checked,
      timestamp: state.consent || null
    }
  };
}
function validateCustomForm() {
  const p = getProfile();
  let valid = !!(p.fullName && emailValid(p.email) && p.company && p.role && p.audiences.length && p.industry && p.consents.privacyAcknowledgement);
  if (p.industry === 'Other' && !p.details.other_industry) valid = false;
  const msg = valid ? 'Ready—download your tailored decision brief.' : 'Complete your name, work email, role, organization, industry, and intended reviewers; then acknowledge the privacy notice.';
  document.getElementById('form-status').textContent = msg;
  document.getElementById('btn-download-form').disabled = !valid;
  document.getElementById('btn-download-cta').setAttribute('aria-description', valid ? 'Download your customized report' : 'Complete report details to download');
  const allAud = [...document.querySelectorAll('input[name="audience"]')];
  const selectAll = document.getElementById('aud-select-all');
  if (selectAll) selectAll.checked = allAud.length > 0 && allAud.every(cb => cb.checked);
  if(document.getElementById('ctx-tab-finish')?.getAttribute('aria-selected')==='true') renderCustomizeReview();
  return valid;
}
function downloadCustomReport() {
  if (!validateCustomForm()) { scrollToCustomize(); return; }
  if (!state.consent) captureConsentTime();
  const profile = getProfile();
  downloadPDF(profile);
}
function buildLeadPayload(profile) {
  const { overall, catScores } = calculateScore();
  const weakest = getWeakestCategory(catScores);
  const gaps = getTopGaps();
  return { profile, score: overall, tier: getTier(overall).name, weakestCategory: weakest, topGaps: gaps.map(g => ({ category:g.category, question:g.item, answer:state.answers[g.id] })), answers: state.answers, mode: state.mode, generatedAt: new Date().toISOString() };
}

function restoreShortProfile(profile={}) {
  const values = {
    'f-fullname': profile.fullName,
    'f-email': profile.email,
    'f-company': profile.company,
    'f-role': profile.role,
    'f-industry': profile.industry,
    'f-trigger': profile.trigger
  };
  Object.entries(values).forEach(([id,value]) => {
    const el = document.getElementById(id);
    if (el && value) el.value = value;
  });
  updateIndustryFields();
  Object.entries(profile.details || {}).forEach(([id,value]) => {
    const el = document.getElementById('dyn-' + id);
    if (el) el.value = value;
  });
  const audiences = new Set(profile.audiences || []);
  document.querySelectorAll('input[name="audience"]').forEach(el => { el.checked = audiences.has(el.value); });
  const consents = profile.consents || {};
  const followup = document.getElementById('c-followup');
  const guidance = document.getElementById('c-guidance');
  const privacy = document.getElementById('c-privacy');
  if (followup) followup.checked = !!consents.analystFollowup;
  if (guidance) guidance.checked = !!consents.securityAndPresentationGuidance;
  if (privacy) privacy.checked = !!consents.privacyAcknowledgement;
  state.consent = consents.timestamp || null;
  updateConditionalVisibility();
}

async function iraShortRequest(action, data={}) {
  const payload = new URLSearchParams({ action, nonce: window.IRA_SHORT_DATA?.nonce || '', ...data });
  const response = await fetch(window.IRA_SHORT_DATA.ajax_url, { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}, body:payload.toString(), credentials:'same-origin' });
  return response.json();
}

async function submitShortAssessment(profile) {
  const report = { ...buildLeadPayload(profile), assessment_type:'short', assessment_version:2 };
  const response = await iraShortRequest('ira_submit', { submission:JSON.stringify({ source:'final_report', report, customization:profile }) });
  if (!response?.success) throw new Error('Could not save the assessment. Please try again.');
  return response.data;
}

function addShortSaveButton() {
  if (document.getElementById('ira-short-save')) return;
  const bar = document.createElement('div');
  bar.className = 'ira-short-edit-actions';
  bar.innerHTML = '<a class="btn btn-ghost" href="' + escapeHtml(window.IRA_SHORT_BOOT.reportUrl || '#') + '">Cancel</a><button class="btn btn-primary" id="ira-short-save" type="button">Save revision</button>';
  document.querySelector('#assess-section .assess-block')?.prepend(bar);
  document.getElementById('ira-short-save')?.addEventListener('click', saveShortRevision);
}

async function saveShortRevision() {
  const button = document.getElementById('ira-short-save');
  if (!button) return;
  button.disabled = true;
  button.textContent = 'Saving…';
  try {
    const profile = getProfile();
    const report = { ...buildLeadPayload(profile), assessment_type:'short', assessment_version:2 };
    const response = await iraShortRequest('ira_save_revision', {
      id:String(window.IRA_SHORT_BOOT.id || 0),
      edit_token:String(window.IRA_SHORT_BOOT.editToken || ''),
      revision:JSON.stringify({ source:'revision', report, customization:profile })
    });
    if (!response?.success) throw new Error('Could not save the revision. Please try again.');
    window.location.href = response.data.view_url;
  } catch (error) {
    alert(error.message || 'Could not save the revision.');
    button.disabled = false;
    button.textContent = 'Save revision';
  }
}

window.downloadCustomReport = async function() {
  if (!validateCustomForm()) { scrollToCustomize(); return; }
  if (!state.consent) captureConsentTime();
  const profile = getProfile();
  const button = document.getElementById('btn-download-form');
  if (button) { button.disabled = true; button.textContent = 'Saving…'; }
  try {
    const saved = await submitShortAssessment(profile);
    downloadPDF(profile);
    if (saved?.view_url) setTimeout(() => { window.location.href = saved.view_url; }, 2500);
  } catch (error) {
    alert(error.message || 'Could not save the assessment. Please try again.');
    if (button) { button.disabled = false; button.textContent = 'Download report'; }
  }
};
function openShare() {
  const payload = { mode:state.mode, answers:state.answers };
  const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(payload));
  const url = `${CONFIG.shareBaseUrl}#${compressed}`;
  navigator.clipboard.writeText(url).then(() => alert('Share link copied.')).catch(() => prompt('Copy this share link:', url));
}
function resetAll() {
  if (window.location.hash) history.pushState('', document.title, window.location.pathname + window.location.search);
  state = { mode:'quick', answers:{}, stage:0, isShared:false, consent:null };
  document.getElementById('shared-banner').classList.remove('show');
  
  renderTable();
  document.getElementById('results-section').classList.remove('show');
  window.scrollTo({ top:0, behavior:'smooth' });
}
function pdfPageBackground(currentPage, pageSize) {
  const canvas = [{ type:'rect', x:0, y:0, w:5, h:pageSize.height, color:'#002247' }];
  if (currentPage > 1) {
    canvas.push({ type:'line', x1:54, y1:40, x2:pageSize.width-54, y2:40, lineWidth:.35, lineColor:'#d7dee8' });
    const colors = CATEGORY_ORDER.map(c => CATEGORY_META[c].color);
    const w = 13, gap = 3;
    colors.forEach((color,i) => canvas.push({ type:'rect', x:pageSize.width-54-(colors.length-i)*(w+gap), y:30, w, h:3, color }));
  } else {
    canvas.push({ type:'rect', x:0, y:0, w:pageSize.width, h:7, color:'#002247' });
    canvas.push({ type:'rect', x:0, y:7, w:pageSize.width, h:2, color:'#1c6db3' });
  }
  return { canvas };
}
function svgIconPdf(cat, color) {
  const stroke = color || '#002247';
  const paths = {
    Govern:`<path d="M12 3l8 4v5c0 4.5-3.1 7.6-8 9-4.9-1.4-8-4.5-8-9V7l8-4Z"/><path d="M9 12l2 2 4-5"/>`,
    Identify:`<circle cx="11" cy="11" r="6"/><path d="M16 16l4 4"/>`,
    Protect:`<rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><path d="M12 14v2"/>`,
    Detect:`<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>`,
    Respond:`<path d="M12 3v6"/><path d="M12 15v6"/><path d="M3 12h6"/><path d="M15 12h6"/><circle cx="12" cy="12" r="3"/>`,
    Recover:`<path d="M3 12a9 9 0 0 1 15-6.7"/><path d="M18 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7"/><path d="M6 21v-5h5"/>`
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[cat] || paths.Govern}</svg>`;
}

function categoryBadgePdf(cat, color) {
  const stroke = color || '#002247';
  const paths = {
    Govern:`<path d="M12 3l8 4v5c0 4.5-3.1 7.6-8 9-4.9-1.4-8-4.5-8-9V7l8-4Z"/><path d="M9 12l2 2 4-5"/>`,
    Identify:`<circle cx="11" cy="11" r="6"/><path d="M16 16l4 4"/>`,
    Protect:`<rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><path d="M12 14v2"/>`,
    Detect:`<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>`,
    Respond:`<path d="M12 3v6"/><path d="M12 15v6"/><path d="M3 12h6"/><path d="M15 12h6"/><circle cx="12" cy="12" r="3"/>`,
    Recover:`<path d="M3 12a9 9 0 0 1 15-6.7"/><path d="M18 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7"/><path d="M6 21v-5h5"/>`
  };
  const label = String(cat || '').toUpperCase();
  const safeLabel = label.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 86 34">
    <g transform="translate(33,3)" fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <svg x="0" y="0" width="20" height="20" viewBox="0 0 24 24">${paths[cat] || paths.Govern}</svg>
    </g>
    <text x="43" y="31" text-anchor="middle" font-family="Helvetica" font-size="8.5" font-weight="700" letter-spacing="0.55" fill="#0f172a">${safeLabel}</text>
  </svg>`;
}

function svgScoreCircle(score, color) {
  const r = 52, circ = 2 * Math.PI * r, offset = circ - (score / 100) * circ;
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="60" r="${r}" fill="none" stroke="#e2e8f0" stroke-width="10"/><circle cx="60" cy="60" r="${r}" fill="none" stroke="${color}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${circ.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}" transform="rotate(-90 60 60)"/><text x="60" y="68" text-anchor="middle" font-family="Helvetica" font-size="32" font-weight="700" fill="#002247">${score}</text><text x="60" y="84" text-anchor="middle" font-family="Helvetica" font-size="6" letter-spacing="1" fill="#64748b">OUT OF 100</text></svg>`;
}
function svgWall(catScores) {
  const cats = CATEGORY_ORDER.filter(c => catScores[c] !== undefined);
  const W=430,H=180,baseY=138,maxH=104,gap=10,plankW=(W-gap*(cats.length-1))/cats.length;
  const weakest = getWeakestCategory(catScores);
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">`;
  svg += `<line x1="0" y1="${baseY+1}" x2="${W}" y2="${baseY+1}" stroke="#cbd5e1" stroke-width="1"/>`;
  cats.forEach((cat,i) => {
    const s = catScores[cat];
    const h = Math.max(4, (s/100)*maxH);
    const x = i*(plankW+gap), y = baseY-h;
    const meta = CATEGORY_META[cat];
    const isWeak = weakest && weakest.cat === cat && weakest.score < 100;
    svg += `<rect x="${x}" y="${y}" width="${plankW}" height="${h}" rx="3" fill="${meta.color}"/>`;
    svg += `<rect x="${x}" y="${baseY-3}" width="${plankW}" height="3" fill="#000" fill-opacity=".16"/>`;
    let scoreY = y - 5;
    let scoreFill = '#0f172a';
    if (isWeak) {
      svg += `<rect x="${x-3}" y="${y-3}" width="${plankW+6}" height="${h+6}" rx="4" fill="none" stroke="#9a2820" stroke-width="1.5" stroke-dasharray="4 3"/>`;
      const badgeW = 52;
      const badgeH = 12;
      const badgeX = x + plankW / 2 - badgeW / 2;
      const badgeY = Math.max(4, y - 24);
      svg += `<rect x="${badgeX}" y="${badgeY}" width="${badgeW}" height="${badgeH}" rx="3" fill="#f3dad6"/>`;
      svg += `<text x="${x+plankW/2}" y="${badgeY+8.5}" text-anchor="middle" font-family="Helvetica" font-size="6.5" font-weight="700" letter-spacing="1" fill="#9a2820">WEAKEST</text>`;
      if (scoreY < badgeY + badgeH + 8) {
        scoreY = Math.min(baseY - 5, y + 13);
        scoreFill = '#ffffff';
      }
    }
    svg += `<text x="${x+plankW/2}" y="${scoreY}" text-anchor="middle" font-family="Helvetica" font-size="11" font-weight="700" fill="${scoreFill}">${s}</text>`;
    svg += `<text x="${x+plankW/2}" y="${baseY+17}" text-anchor="middle" font-family="Helvetica" font-size="8" letter-spacing=".5" fill="#64748b">${cat.toUpperCase()}</text>`;
  });
  svg += `</svg>`;
  return svg;
}
function downloadPDF(profile) {
  const { overall, catScores } = calculateScore();
  const tier = getTier(overall);
  const weakest = getWeakestCategory(catScores);
  const gaps = getTopGaps();
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
  const content = [];
  content.push(...coverPage(profile, dateStr));
  content.push(...executiveSummaryPage(overall, tier, weakest, catScores, gaps));
  content.push(...sixSectionsPage(catScores));
  content.push(...answerLogPage());
  content.push(...presentationPage(profile, overall, tier, weakest, gaps));
  const doc = {
    pageSize:'LETTER',
    pageMargins:[54,56,54,56],
    defaultStyle:{ font:'Roboto', fontSize:10, color:'#0f172a', lineHeight:1.35 },
    background:(currentPage,pageSize)=>pdfPageBackground(currentPage, pageSize),
    footer:(currentPage,pageCount)=> currentPage === 1 ? null : ({
      margin:[54,16,54,0],
      columns:[
        { text:[
          { text:'Vancord', link:'https://www.vancord.com/?utm_source=incident-response-asessment-pdf', decoration:'underline' },
          { text:' - Securing Organizations since 2005' }
        ], style:'foot', width:'*' },
        { text:`Page ${currentPage} of ${pageCount}`, style:'foot', alignment:'right', width:'auto' }
      ]
    }),
    content,
    styles: pdfStyles()
  };
  const safe = (profile.company || profile.fullName || 'Report').replace(/[^a-z0-9]+/gi,'').slice(0,50) || 'Report';
  pdfMake.createPdf(doc).download(`Vancord-IRA-Customized-${safe}.pdf`);
}
function coverPage(profile, dateStr) {
  const orgName = profile.company || 'Incident Readiness Assessment';
  const detailLines = [
    ['Prepared by', profile.fullName || 'Not specified'],
    ['Role', profile.role || 'Not specified'],
    ['Industry', profile.industry || 'Not specified'],
    ['Production date', dateStr]
  ];
  return [
    { margin:[0,34,0,28], table:{ widths:['*'], body:[[ { stack:[
      { text:'INCIDENT READINESS ASSESSMENT', style:'coverKicker', margin:[0,0,0,8] },
      { text:orgName, style:'coverTitle', margin:[0,0,0,10] },
      { text:'A structured readiness report mapped to the six NIST Cybersecurity Framework functions.', style:'coverSub', margin:[0,0,0,18] },
      { canvas:[{ type:'line', x1:0, y1:0, x2:420, y2:0, lineWidth:1.2, lineColor:'#1c6db3' }], margin:[0,0,0,14] },
      { text:'Powered by Vancord Incident Readiness Assessment Tool', style:'powered' }
    ], fillColor:'#002247', margin:[24,28,24,28], border:[false,false,false,false] } ]] }, layout:'noBorders' },
    { table:{ widths:['*','*'], body:[[ 
      { stack:[{ text:'REPORT DETAILS', style:'coverMetaHead', margin:[0,0,0,8] }, ...detailLines.map(([k,v]) => ({ text:[{ text:k.toUpperCase() + '  ', style:'kvLabel' },{ text:v, style:'kvValue' }], margin:[0,0,0,6] }))], fillColor:'#f8fafc', margin:[16,14,16,14], border:[false,false,false,false] },
      { stack:[{ text:'METHODOLOGY', style:'coverMetaHead', margin:[0,0,0,8] },{ text:'Weighted self-screening across Govern, Identify, Protect, Detect, Respond, and Recover. The report supports internal readiness discussion and evidence review. It is not an audit, certification, penetration test, legal opinion, or guarantee of security posture.', style:'coverMeta' }], fillColor:'#f1f5f9', margin:[16,14,16,14], border:[false,false,false,false] }
    ]] }, layout:'noBorders', margin:[0,0,0,24] },
    { table:{ widths:CATEGORY_ORDER.map(() => '*'), body:[[ ...CATEGORY_ORDER.map(cat => ({ text:cat.toUpperCase(), style:'coverStripLabel', color:'#ffffff', fillColor:CATEGORY_META[cat].color, alignment:'center', margin:[0,5,0,5], border:[false,false,false,false] })) ]] }, layout:'noBorders', margin:[0,14,0,0], pageBreak:'after' }
  ];
}
function executiveSummaryPage(overall, tier, weakest, catScores, gaps) {
  const topRows = (gaps.length ? gaps.slice(0,3) : []).map((g,i) => {
    const meta = CATEGORY_META[g.category];
    return [
      { text:String(i+1).padStart(2,'0'), style:'gapRank', color:meta.color, fillColor:meta.soft },
      { columns:[{ svg:svgIconPdf(g.category, meta.color), fit:[10,10], width:12, margin:[0,1,3,0] },{ text:g.category.toUpperCase(), style:'gapCatPdf', color:meta.color, width:'*' }], fillColor:meta.soft },
      { text:g.item, style:'gapQPdf', fillColor:meta.soft }
    ];
  });
  if (!topRows.length) topRows.push([{ text:'—', style:'gapRank' },{ text:'No gap', style:'gapCatPdf' },{ text:'No negative or partial answers were selected in this assessment mode.', style:'gapQPdf' }]);
  const weakText = weakest ? `${weakest.cat} · ${weakest.score}/100` : 'Not available';
  const firstAction = weakest ? firstConversation(weakest.cat) : 'Validate the scoring evidence';
  return [
    { text:'1. Readiness Intelligence Brief', style:'sectionTitle', margin:[0,0,0,5] },
    { text:'This brief separates the readiness score from the readiness map. The score gives an orientation point. The map shows which function should be validated first.', style:'bodySmall', margin:[0,0,0,12] },
    { table:{ widths:[160,'*'], body:[[ 
      { stack:[
        { text:'1.1 Readiness Score', style:'subhead', margin:[0,0,0,6] },
        { svg:svgScoreCircle(overall, tier.color), fit:[104,104], alignment:'center' },
        { text:`${overall}/100`, style:'scoreNote', color:tier.color, alignment:'center', margin:[0,6,0,0] },
        { text:'Readiness tier', style:'boxLabel', alignment:'center', margin:[0,10,0,3] },
        { text:tier.name, style:'boxMain', color:tier.color, alignment:'center' },
        { text:'A weighted orientation score. Validate it against evidence before using it as a decision basis.', style:'smallMuted', alignment:'center', margin:[6,7,6,0] }
      ], fillColor:'#f8fafc', border:[true,true,true,true], margin:[12,12,12,12] },
      { stack:[
        { text:'1.2 Readiness Map', style:'subhead', margin:[0,0,0,6] },
        { svg:svgWall(catScores), fit:[304,128], alignment:'center' },
        { columns:[
          { width:'*', stack:[{ text:'Weakest function', style:'boxLabel' },{ text:weakText, style:'boxMain', color: weakest ? CATEGORY_META[weakest.cat].color : '#64748b' },{ text:'The lowest function is the first place to validate under pressure.', style:'smallMuted', margin:[0,4,0,0] }] },
          { width:'*', stack:[{ text:'First validation question', style:'boxLabel' },{ text:firstAction, style:'bodySmallBold', color:'#0f172a' },{ text:'Use this as the opening question for internal review.', style:'smallMuted', margin:[0,4,0,0] }] }
        ], columnGap:10, margin:[0,8,0,0] }
      ], fillColor:'#ffffff', border:[true,true,true,true], margin:[12,12,12,12] }
    ]] }, layout:{ hLineWidth:()=>.6, vLineWidth:()=>.6, hLineColor:()=>'#d7dee8', vLineColor:()=>'#d7dee8' }, margin:[0,0,0,14] },
    { text:'1.3 Top Areas to Review First', style:'subhead', margin:[0,2,0,8] },
    { table:{ widths:[26,74,'*'], body:[[ { text:'#', style:'tableHead' },{ text:'Function', style:'tableHead' },{ text:'Question to validate', style:'tableHead' } ], ...topRows] }, layout:{ hLineWidth:(i)=>i===1?1:.35, vLineWidth:()=>0, hLineColor:(i)=>i===1?'#002247':'#e2e8f0', paddingTop:()=>6, paddingBottom:()=>6, paddingLeft:()=>6, paddingRight:()=>6 }, pageBreak:'after' }
  ];
}
function snapshotCell(label, main, sub, color, fill) {
  return { stack:[{ text:label.toUpperCase(), style:'boxLabel' },{ text:main, style:'boxMain', color },{ text:sub, style:'smallMuted', margin:[0,4,0,0] }], fillColor:fill || '#f8fafc', margin:[12,12,12,12], border:[false,false,false,false] };
}
function diagnosticPrescription(cat, score) {
  const meta = CATEGORY_META[cat];
  let signal;
  if (score <= 40) signal = 'Diagnostic signal: this function may depend on informal practice, incomplete evidence, or untested assumptions.';
  else if (score <= 65) signal = 'Diagnostic signal: core elements appear present, but operating consistency, evidence, or ownership may still be uneven.';
  else if (score <= 85) signal = 'Diagnostic signal: this function appears comparatively disciplined; the priority is validation, testing, and exception review.';
  else signal = 'Diagnostic signal: this function appears strong in this self-screen; maintain through evidence review, periodic testing, and leadership visibility.';
  return `${signal} Prescriptive move: ${meta.first}`;
}
function sixSectionsPage(catScores) {
  const body = [[
    { text:'', style:'tableHead' },
    { text:'Function', style:'tableHead' },
    { text:'Score', style:'tableHead', alignment:'center' },
    { text:'Diagnostic / prescriptive reading', style:'tableHead' }
  ]];
  CATEGORY_ORDER.filter(c => catScores[c] !== undefined).forEach(cat => {
    const meta = CATEGORY_META[cat];
    const score = catScores[cat];
    body.push([
      { svg:svgIconPdf(cat, meta.color), fit:[16,16], fillColor:meta.soft, alignment:'center', margin:[0,7,0,0] },
      { text:cat.toUpperCase(), style:'catNameTight', color:meta.color, fillColor:meta.soft, alignment:'center', margin:[0,9,0,0] },
      { text:String(score), style:'scoreTight', color:meta.color, alignment:'center', fillColor:meta.soft, margin:[0,8,0,0] },
      { text:diagnosticPrescription(cat, score), style:'diagText', fillColor:meta.soft }
    ]);
  });
  return [
    { text:'2. Six-Function Scoring Dashboard', style:'sectionTitleCompact', margin:[0,0,0,5] },
    { text:'2.1 Function Map', style:'subhead', margin:[0,0,0,4] },
    { text:'The wall gives the visual map. The table translates each function into a diagnostic signal and first validation action.', style:'bodySmall', margin:[0,0,0,7] },
    { svg:svgWall(catScores), fit:[480,132], alignment:'center', margin:[0,0,0,8] },
    { text:'2.2 Diagnostic and Prescriptive Reading', style:'subhead', margin:[0,0,0,6] },
    { table:{ widths:[24,48,30,'*'], body, dontBreakRows:true }, layout:{ hLineWidth:(i)=>i===1?1:.25, vLineWidth:()=>0, hLineColor:(i)=>i===1?'#002247':'#d7dee8', paddingTop:()=>5, paddingBottom:()=>5, paddingLeft:()=>5, paddingRight:()=>5 }, pageBreak:'after' }
  ];
}
function answerLogPage() {
  const visible = getVisibleQuestions();
  const answerLabelMap = { yes:'Yes', partial:'Partial', no:'No', dontknow:"Don't know", na:'N/A' };
  const answerColorMap = { yes:'#2d6a4f', partial:'#c08418', no:'#9a2820', dontknow:'#64748b', na:'#94a3b8' };
  const rows = [[{ text:'Category', style:'tableHead' },{ text:'Question', style:'tableHead' },{ text:'Answer', style:'tableHead', alignment:'right' }]];

  CATEGORY_ORDER.forEach(cat => {
    const qs = visible.filter(q => q.category === cat);
    if (!qs.length) return;
    const meta = CATEGORY_META[cat];

    // Keep the visual grouping, but do not place the category label inside the SVG.
    // pdfMake can clip SVG text in row-spanned cells, which is what caused
    // Protect/Detect labels to disappear in some generated reports. The icon is
    // SVG, while the category name is now ordinary pdfMake text for reliable output.
    const categoryCell = {
      stack: [
        { svg: svgIconPdf(cat, meta.color), fit:[15,15], alignment:'center', margin:[0,0,0,4] },
        { text: cat.toUpperCase(), style:'answerLogCategoryLabel', color:'#0f172a', alignment:'center', noWrap:false }
      ],
      fillColor: meta.soft,
      rowSpan: qs.length,
      alignment: 'center',
      margin: [3, Math.max(5, Math.min(18, (qs.length - 1) * 6)), 3, 0]
    };

    qs.forEach((q,i) => {
      const ans = state.answers[q.id];
      rows.push([
        i === 0 ? categoryCell : { text:'', fillColor:meta.soft },
        { text:q.item, style:'qaQ' },
        { text:ans ? answerLabelMap[ans] : '—', style:'qaAns', color:ans ? answerColorMap[ans] : '#94a3b8', alignment:'right' }
      ]);
    });
  });
  return [
    { text:'3. Answer Log', style:'sectionTitle', margin:[0,0,0,8] },
    { text:'3.1 Response Evidence Trail', style:'subhead', margin:[0,0,0,6] },
    { text:'Every answer used to calculate the score is listed below. Category cells are merged and color-coded so the evidence trail matches the score dashboard.', style:'body', margin:[0,0,0,14] },
    { table:{ widths:[98,'*',54], body:rows, dontBreakRows:true }, layout:{ hLineWidth:(i)=>i===1?1:.3, vLineWidth:()=>0, hLineColor:(i)=>i===1?'#002247':'#e2e8f0', paddingTop:()=>6, paddingBottom:()=>6, paddingLeft:()=>6, paddingRight:()=>6 }, pageBreak:'after' }
  ];
}
function consentBlock(profile) {
  const c = profile.consents || {};
  const ts = c.timestamp || state.consent || { utc:'Not captured', local:'Not captured', privacyNoticeVersion:CONFIG.privacyNoticeVersion };
  const detailRows = [
    ['Submission time (UTC)', ts.utc],
    ['Submission time (local)', ts.local],
    ['Analyst follow-up requested', c.analystFollowup ? 'Yes' : 'No'],
    ['Security and presentation guidance requested', c.securityAndPresentationGuidance ? 'Yes' : 'No'],
    ['Privacy acknowledgement', c.privacyAcknowledgement ? 'Yes' : 'No']
  ];
  const pairRows = [];
  for (let i = 0; i < detailRows.length; i += 2) {
    const left = detailRows[i];
    const right = detailRows[i + 1] || ['', ''];
    pairRows.push([
      { stack:[{ text:left[0], style:'consentLabel' },{ text:left[1], style:'consentValue', margin:[0,2,0,0] }], fillColor:'#f8fafc', margin:[8,7,8,7] },
      { stack:[{ text:right[0], style:'consentLabel' },{ text:right[1], style:'consentValue', margin:[0,2,0,0] }], fillColor:'#f8fafc', margin:[8,7,8,7] }
    ]);
  }
  return [
    { text:'5.1 Communication Consents and Requests', style:'subhead', margin:[0,14,0,6] },
    { text:'Recorded communication selections and submission timestamps for this customized report.', style:'smallMuted', margin:[0,0,0,7] },
    { table:{ widths:['*','*'], body:pairRows }, layout:{ hLineWidth:()=>.35, vLineWidth:()=>.35, hLineColor:()=>'#d7dee8', vLineColor:()=>'#d7dee8', paddingTop:()=>0, paddingBottom:()=>0, paddingLeft:()=>0, paddingRight:()=>0 }, margin:[0,0,0,24] }
  ];
}
function presentationPage(profile, overall, tier, weakest, gaps) {
  const selected = (profile.audiences && profile.audiences.length) ? profile.audiences : ['Manager'];
  const blocks = [];
  blocks.push({ text:'4. How to Present This Report', style:'sectionTitle', margin:[0,0,0,8] });
  blocks.push({ text:`This section is tailored to the perspectives selected in the form: ${selected.join(', ')}. Use it to move the conversation from a raw score to a responsible discussion about evidence, ownership, and next action.`, style:'body', margin:[0,0,0,12] });
  blocks.push({ text:'4.1 Suggested Internal Framing', style:'subhead', margin:[0,0,0,7] });
  blocks.push({ text:`The assessment places ${profile.company || 'the organization'} in the ${tier.name} tier at ${overall}/100. The first function to validate is ${weakest ? weakest.cat : 'the lowest-scoring function'}. The immediate question is whether the current controls, plans, and owners would hold up during a real incident, audit, insurance renewal, or executive review.`, style:'body', margin:[0,0,0,12] });
  blocks.push({ text:'4.2 Perspective-Specific Framing', style:'subhead', margin:[0,2,0,7] });
  blocks.push({ table:{ widths:[112,'*','*','*'], body:audiencePresentationRows(selected, weakest, gaps) }, layout:{ hLineWidth:(i)=>i===1?1:.25, vLineWidth:()=>0, hLineColor:(i)=>i===1?'#002247':'#e2e8f0', paddingTop:()=>5, paddingBottom:()=>5, paddingLeft:()=>5, paddingRight:()=>5 }, margin:[0,0,0,12] });
  blocks.push({ text:'4.3 Suggested Meeting Agenda', style:'subhead', margin:[0,2,0,7] });
  blocks.push({ ol: buildAgenda(selected, weakest), style:'body', margin:[0,0,0,12] });
  blocks.push({ text:'4.4 Suggested Email Copy', style:'subhead', margin:[0,2,0,7] });
  blocks.push({ table:{ widths:['*'], body:[[ { text: buildSuggestedEmail(profile, overall, tier, weakest, gaps), style:'emailBox', fillColor:'#f8fafc', margin:[10,10,10,10] } ]] }, layout:'noBorders', margin:[0,0,0,16] });
  blocks.push({ text:'5. Communication and Contact Details', style:'sectionTitleCompact', margin:[0,6,0,8] });
  blocks.push(...consentBlock(profile));
  blocks.push(...contactBlock());
  return blocks;
}
function audiencePresentationRows(audiences, weakest, gaps) {
  const rows = [[
    { text:'Perspective', style:'tableHead' },
    { text:'What to emphasize', style:'tableHead' },
    { text:'Question to ask', style:'tableHead' },
    { text:'Avoid framing it as', style:'tableHead' }
  ]];
  audiences.forEach(a => {
    const g = audienceGuidanceObject(a, weakest, gaps);
    rows.push([{ text:a, style:'audienceCell' },{ text:g.emphasize, style:'bodyTiny' },{ text:g.question, style:'bodyTiny' },{ text:g.avoid, style:'bodyTiny' }]);
  });
  return rows;
}
function audienceGuidanceObject(a, weakest, gaps) {
  const cat = weakest ? weakest.cat : 'the lowest-scoring function';
  const topGap = gaps[0] ? gaps[0].item : 'the first readiness gap';
  const map = {
    'Manager': { emphasize:`This is an initial readiness screen that identifies ${cat} as the first area to validate.`, question:`Which findings are accurate, who owns them, and what can be confirmed this month?`, avoid:'A completed audit or proof that the program is failing.' },
    'IT and Security Leadership': { emphasize:`Control evidence, ownership, testing cadence, and the specific gap: ${topGap}.`, question:`Can we prove the control exists, operates, and is reviewed?`, avoid:'A generic tool score detached from evidence.' },
    'Executive Leadership': { emphasize:'Operational continuity, risk acceptance, budget ownership, and the leadership decision needed.', question:`Would we be comfortable with the current state of ${cat} during an incident this quarter?`, avoid:'A purely technical cleanup list.' },
    'Finance, Risk, Legal, and Insurance': { emphasize:'Financial exposure, insurability, legal defensibility, breach notification, and documentation.', question:'Do our current controls and records support a defensible risk position?', avoid:'An IT-only concern with no financial or legal implications.' },
    'Board or Trustees': { emphasize:'Oversight, ownership, tested plans, accepted risk, and reporting cadence.', question:'Who owns readiness, what has been tested, and when will progress be reported?', avoid:'A request for the board to manage technical controls.' }
  };
  return map[a] || { emphasize:`What ${a} needs to know about ${cat}.`, question:'What decision or validation does this audience need?', avoid:'A vague security concern without an owner or next step.' };
}
function buildAgenda(audiences, weakest) {
  const cat = weakest ? weakest.cat : 'the lowest-scoring function';
  const agenda = [
    `Confirm whether the score and ${cat} finding match internal evidence.`,
    'Identify the internal owner for each of the top three review areas.',
    'Decide which item can be validated or corrected within 30 days.'
  ];
  if (audiences.includes('Executive Leadership')) agenda.push('Clarify whether the issue requires budget, outside validation, or formal risk acceptance.');
  if (audiences.includes('Finance, Risk, Legal, and Insurance')) agenda.push('Confirm whether any insurance, contractual, legal, or notification concerns are implicated.');
  if (audiences.includes('Board or Trustees')) agenda.push('Prepare a short oversight update: owner, risk, action, and next reporting date.');
  return agenda;
}
function audienceGuidance(a, weakest) {
  return audienceGuidanceObject(a, weakest, []).emphasize;
}
function buildSuggestedEmail(profile, overall, tier, weakest, gaps) {
  const topGap = gaps[0] ? gaps[0].item : 'the lowest-scoring readiness area';
  const audiences = profile.audiences && profile.audiences.length ? profile.audiences.join(', ') : 'the appropriate internal stakeholders';
  const trigger = profile.trigger ? ` The review context selected was: ${profile.trigger}.` : '';
  return `Subject: Initial incident readiness screen for review\n\nHi [Name],\n\nI completed a structured incident readiness self-assessment for ${profile.company || 'our organization'} to get an initial view of readiness across Govern, Identify, Protect, Detect, Respond, and Recover.${trigger}\n\nThis is not an audit or final diagnosis, but it gives us a useful starting point for ${audiences}. The current result is ${overall}/100, in the ${tier.name} tier. The area that appears to need first validation is ${weakest ? weakest.cat : 'the lowest-scoring function'}. One specific item to review is: ${topGap}.\n\nMy recommendation is that we review the attached report, confirm which findings are accurate, identify ownership for the first few items, and decide whether we need outside validation or a short analyst walkthrough.\n\nThe useful question is not whether the score is perfect. The useful question is whether we would be comfortable with our current readiness if an incident happened this quarter.\n\nBest,\n${profile.fullName || '[Your Name]'}`;
}
function contactBlock() {
  return [
    { text:'5.2 Connect with Vancord', style:'subhead', margin:[0,16,0,10] },
    { text:'When you want a second set of eyes on this report, or when something has already gone wrong, this is how to reach Vancord.', style:'body', margin:[0,0,0,18] },
    { table:{ widths:['*','*','*'], body:[[ { stack:[{ text:'OFFICES', style:'ctcLabel' },{ text:'500 Boston Post Rd\nMilford, CT 06460', style:'ctcVal', margin:[0,6,0,0] },{ text:'180 Glastonbury Blvd, Suite 107\nGlastonbury, CT 06033', style:'ctcVal', margin:[0,10,0,0] }], border:[false,false,false,false] },{ stack:[{ text:'CONTACT', style:'ctcLabel' },{ text:'sales@vancord.com', style:'ctcLink', link:'mailto:sales@vancord.com', margin:[0,6,0,0] },{ text:'203.874.9607', style:'ctcVal', margin:[0,4,0,0] },{ text:'1-855-VANCORD', style:'ctcVal', margin:[0,4,0,0] },{ text:'vancord.com', style:'ctcLink', link:'https://www.vancord.com/?utm_source=incident-response-asessment-pdf', margin:[0,10,0,0] }], border:[false,false,false,false] },{ stack:[{ text:'24/7 SECURITY OPERATIONS', style:'ctcLabel', color:'#c08418' },{ text:'In an active incident?', style:'ctcVal', margin:[0,6,0,0] },{ text:'1-855-VANCORD', style:'ctcEmergency', margin:[0,4,0,0] },{ text:'855-512-4817', style:'ctcValSm', margin:[0,2,0,0] }], border:[false,false,false,false] } ]] }, layout:'noBorders', margin:[0,0,0,22] }
  ];
}
function pdfStyles() {
  return {
    coverBrand:{ fontSize:28, bold:true, color:'#002247', characterSpacing:2 },
    coverKicker:{ fontSize:10, bold:true, color:'#cfd8e3', characterSpacing:1.8 },
    coverTitle:{ fontSize:32, bold:true, color:'#ffffff', lineHeight:1.1 },
    coverSub:{ fontSize:12, color:'#d9e5f2', lineHeight:1.5 },
    coverMetaHead:{ fontSize:10, bold:true, color:'#002247', characterSpacing:.9 },
    coverMeta:{ fontSize:9, color:'#475569', lineHeight:1.45 },
    coverStripLabel:{ fontSize:7, bold:true, characterSpacing:.55 },
    powered:{ fontSize:10, bold:true, color:'#ffffff', characterSpacing:.6 },
    sectionTitle:{ fontSize:24, bold:true, color:'#002247' },
    sectionTitleCompact:{ fontSize:20, bold:true, color:'#002247' },
    subhead:{ fontSize:12.5, bold:true, color:'#002247' },
    h1:{ fontSize:28, bold:true, color:'#002247' },
    h1Compact:{ fontSize:22, bold:true, color:'#002247' },
    h2:{ fontSize:15, bold:true, color:'#002247' },
    h3:{ fontSize:12, bold:true, color:'#002247' },
    body:{ fontSize:10, color:'#475569', lineHeight:1.5 },
    bodySmall:{ fontSize:9, color:'#475569', lineHeight:1.45 },
    bodyTiny:{ fontSize:8.2, color:'#475569', lineHeight:1.35 },
    diagText:{ fontSize:8.5, color:'#334155', lineHeight:1.38 },
    bodySmallBold:{ fontSize:9, color:'#334155', bold:true, lineHeight:1.45 },
    smallMuted:{ fontSize:8.5, color:'#64748b', lineHeight:1.4 },
    plotLabel:{ fontSize:8, bold:true, color:'#64748b', characterSpacing:1.4 },
    boxLabel:{ fontSize:8, bold:true, color:'#64748b', characterSpacing:1.1 },
    boxMain:{ fontSize:14, bold:true },
    scoreNote:{ fontSize:10, bold:true },
    kvLabel:{ fontSize:8, bold:true, color:'#64748b', characterSpacing:1.1 },
    kvValue:{ fontSize:9.5, bold:true, color:'#0f172a' },
    tableHead:{ fontSize:8, bold:true, color:'#64748b', characterSpacing:.8 },
    catName:{ fontSize:9, bold:true, characterSpacing:.7 },
    catNameTight:{ fontSize:7.8, bold:true, characterSpacing:.35 },
    catVertical:{ fontSize:8, bold:true, characterSpacing:.8, color:'#0f172a' },
    answerLogCategoryLabel:{ fontSize:8.2, bold:true, color:'#0f172a', characterSpacing:.15, lineHeight:1.05 },
    scoreLarge:{ fontSize:15, bold:true },
    scoreTight:{ fontSize:13, bold:true },
    qaQ:{ fontSize:8.8, color:'#0f172a', lineHeight:1.35 },
    qaAns:{ fontSize:9, bold:true },
    gapRank:{ fontSize:10, bold:true },
    gapCatPdf:{ fontSize:8, bold:true, characterSpacing:.4 },
    gapQPdf:{ fontSize:8.5, color:'#334155', lineHeight:1.35 },
    audienceCell:{ fontSize:8.2, bold:true, color:'#002247' },
    consentLabel:{ fontSize:7.8, bold:true, color:'#64748b', characterSpacing:.5 },
    consentValue:{ fontSize:8.2, color:'#0f172a' },
    emailBox:{ fontSize:9, color:'#0f172a', lineHeight:1.45 },
    foot:{ fontSize:8, color:'#94a3b8' },
    ctcLabel:{ fontSize:9, bold:true, color:'#002247', characterSpacing:1.2 },
    ctcVal:{ fontSize:10, color:'#0f172a', lineHeight:1.5 },
    ctcValSm:{ fontSize:9, color:'#64748b' },
    ctcLink:{ fontSize:10, color:'#1c6db3', decoration:'underline' },
    ctcEmergency:{ fontSize:16, bold:true, color:'#002247' }
  };
}
