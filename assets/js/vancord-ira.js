const CONFIG = {
  bookCallUrl: 'https://www.vancord.com/contact-us/',
  shareBaseUrl: window.location.href.split('#')[0].split('?')[0],
  privacyNoticeUrl: 'https://www.vancord.com/privacy-policy/',
  crmEnabled: false,
  privacyNoticeVersion: '2026-05-19'
};
const QUESTIONS = window.IRA_QUESTIONS || [];

const iraConfig = window.iraConfig || {
    assessment: 'assessment'
};

const CATEGORY_ORDER = [...new Set(QUESTIONS.map(q => q.category))];
const ANSWER_KEYS = ['yes','partial','no','dontknow','na'];
const ANSWER_LABELS = ['Yes','Partial','No',"Don't know",'N/A'];
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
let state = { mode:'deep', answers:{}, isShared:false, consent:null, validationAttempted:false };
window.addEventListener('DOMContentLoaded', () => {

  if (window.location.hash && window.location.hash.length > 5) {

    try {

      const decoded = LZString.decompressFromEncodedURIComponent(
        window.location.hash.substring(1)
      );

      const shared = JSON.parse(decoded);

      if (shared.answers) {

        // Only restore mode for the full assessment
        if (
          iraConfig.assessment !== 'assessment-short' &&
          shared.mode
        ) {

          state.mode = shared.mode;

          document.querySelectorAll('.mode-tab').forEach(t =>
            t.classList.toggle(
              'active',
              t.dataset.mode === state.mode
            )
          );

        }

        state.answers = shared.answers;
        state.isShared = true;

        renderTable();
        renderResults();

        document.getElementById('shared-banner').classList.add('show');
        document.getElementById('results-section').classList.add('show');

        return;

      }

    } catch (e) {

      console.warn('Could not parse shared URL', e);

    }

  }

  renderTable();

  validateCustomForm();

});
function getVisibleQuestions() {

    // Short assessment always shows all questions
    if (iraConfig.assessment === 'assessment-short') {
        return QUESTIONS;
    }

    // Original assessment
    return QUESTIONS.filter(q => state.mode === 'deep' || q.quick);

}
function getVisibleCategoryOrder() {
  const seen = [];
  getVisibleQuestions().forEach(q => {
    if (!seen.includes(q.category)) seen.push(q.category);
  });
  return seen;
}
function questionNumber(qOrId) {
  const id = typeof qOrId === 'string' ? qOrId : qOrId?.id;
  const idx = getVisibleQuestions().findIndex(q => q.id === id);
  return idx >= 0 ? idx + 1 : null;
}
function questionLabel(qOrId) {
  const n = questionNumber(qOrId);
  return n ? `Q${n}` : '';
}
function numberedQuestionHtml(q) {
  const label = questionLabel(q);
  const prefix = label ? `<span class="log-q-number">${label}</span>` : '';
  return `${prefix}${escapeHtml(q.item)}`;
}
function numberedQuestionText(q) {
  const label = questionLabel(q);
  return `${label ? label + '. ' : ''}${q.item}`;
}
function numberedQuestionPdf(q, textStyle) {
  const label = questionLabel(q);
  if (!label) return { text:q.item, style:textStyle };
  return { text:[{ text:label + '. ', style:'questionNoPdf' }, { text:q.item, style:textStyle }], style:textStyle };
}
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
function renderTable() {

  const tbody =
  document.getElementById(
    'qtable-body'
  );

  if(
    !tbody
  ){
    return;
  }

  const visible = getVisibleQuestions();

  const byCat = {};

  visible.forEach(q=>{
    (byCat[q.category]=byCat[q.category]||[]).push(q);
  });

  let html='';

  getVisibleCategoryOrder().forEach(cat=>{

    const arr=byCat[cat];

    if(!arr){
      return;
    }

    const meta=CATEGORY_META[cat];

    html += `<tr class="cat-divider"><td colspan="6" class="${meta.css}"><div class="cat-name" style="color:${meta.color}"><span class="cat-icon-small">${categoryIcon(cat)}</span>${cat}<span class="cat-count">${arr.length} questions</span></div></td></tr>`;

    arr.forEach(q=>{

      const ans=state.answers[q.id];

      html += `<tr class="qrow ${ans?'answered':''}" id="row-${q.id}"><td class="q-cell"><div class="q-line"><div class="q-text"><span class="q-number">${questionLabel(q)}</span><span class="q-text-main">${escapeHtml(q.item)}</span></div><button type="button" class="info-btn" title="Question explanation" aria-label="Question explanation for: ${escapeHtml(q.item)}" onclick="toggleExplain('${q.id}', this)">?</button></div><div class="q-explain-box" id="exp-${q.id}">${escapeHtml(q.explanation)}</div><textarea class="ira-note" data-note="${q.id}" placeholder="Comments / Notes (optional)"></textarea></td>${ANSWER_KEYS.map((key,i)=>`<td class="answer-cell ${key}" data-label="${ANSWER_LABELS[i]}"><input type="radio" name="${q.id}" id="${q.id}-${key}" value="${key}" ${ans===key?'checked':''} onchange="answerQuestion('${q.id}','${key}')"><label for="${q.id}-${key}"><span class="check">✓</span></label></td>`).join('')}</tr>`;

    });

  });

  tbody.innerHTML = html;

  updateProgress();

}
function toggleExplain(qid, btn) {
  const box = document.getElementById('exp-' + qid);
  box.classList.toggle('open');
  btn.classList.toggle('active', box.classList.contains('open'));
}
function setMode(mode) {

  // Short assessment has no Quick / Deep switch
  if (iraConfig.assessment === 'assessment-short') {
    return;
  }

  if (state.mode === mode) return;

  state.mode = mode;

  document.querySelectorAll('.mode-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.mode === mode)
  );

  const help = document.getElementById('ira-assessment-note');

  if (help) {
    help.style.display = mode === 'deep' ? 'block' : 'none';
  }

  renderTable();

  document.getElementById('results-section').classList.remove('show');

}
function answerQuestion(qid, key) {
  state.answers[qid] = key;
  const row = document.getElementById('row-' + qid);
  if (row) row.classList.add('answered');
  updateProgress();
}
function resetAnswers() {
  if (Object.keys(state.answers).length === 0) return;
  if (!confirm('Clear all answers and start over?')) return;
  state.answers = {};
  renderTable();
  document.getElementById('results-section').classList.remove('show');
}
function redoAssessment() {
  if (Object.keys(state.answers).length && !confirm('Clear this assessment and start again?')) return;
  state.answers = {};
  state.isShared = false;
  if (window.location.hash) history.pushState('', document.title, window.location.pathname + window.location.search);
  document.getElementById('results-section').classList.remove('show');
  document.getElementById('shared-banner').classList.remove('show');
  renderTable();
  document.getElementById('assess-section').scrollIntoView({ behavior:'smooth', block:'start' });
}
function updateProgress() {

  const visible = getVisibleQuestions();

  const total = visible.length;

  const answered = visible.filter( q => state.answers[q.id] ).length;

  const pct = total ? answered / total * 100 : 0;

  const progressCount = document.getElementById('progress-count');

  if (progressCount) {
    progressCount.textContent = answered;
  }

  const progressTotal = document.getElementById('progress-total');

  if (progressTotal) {
    progressTotal.textContent = total;
  }

  const tcAnswered = document.getElementById('tc-answered');

  if (tcAnswered) {
    tcAnswered.textContent = answered;
  }

  const tcTotal = document.getElementById('tc-total');

  if (tcTotal) {
    tcTotal.textContent = total;
  }

  const progressBar = document.getElementById('progbar-fill');

  if (progressBar) {
    progressBar.style.width = pct + '%';
  }

  const ready = answered === total;

  const btnCalc = document.getElementById('btn-calc');

  if (btnCalc) {
    btnCalc.disabled = !ready;
  }

  const btnCalcBottom = document.getElementById('btn-calc-bottom');

  if (btnCalcBottom) {
    btnCalcBottom.disabled = !ready;
  }

  const remaining = total - answered;

  const status = document.getElementById('ab-status-text');

  if (status) {

    status.innerHTML =
      ready
        ? `Ready. All ${total} questions answered.`
        : `${remaining} more answer${remaining === 1 ? '' : 's'} needed to see your results (${answered}/${total}).`;

  }

}

function calculateScore() {
  const byCategory = {};
  getVisibleQuestions().forEach(q => {
    const row = state.answers[q.id];
    const ans = typeof row === 'object' ? row.answer : row;
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

  const maxGaps =
    iraConfig.assessment === 'assessment-short'
      ? 2
      : 3;

  return getVisibleQuestions()

    .filter(q => {

      const ans =
        typeof state.answers[q.id] === 'object'
          ? state.answers[q.id].answer
          : state.answers[q.id];

      return ['no','partial','dontknow'].includes(ans);

    })

    .sort((a,b) => {

      const ansA =
        typeof state.answers[a.id] === 'object'
          ? state.answers[a.id].answer
          : state.answers[a.id];

      const ansB =
        typeof state.answers[b.id] === 'object'
          ? state.answers[b.id].answer
          : state.answers[b.id];

      const pa = ['no','dontknow'].includes(ansA) ? 1 : .5;
      const pb = ['no','dontknow'].includes(ansB) ? 1 : .5;

      return (b.weight * pb) - (a.weight * pa);

    })

    .slice(0, maxGaps);

}
function calculateAndShow() {
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
  const circ = 2 * Math.PI * 52;
  const offset = circ - (overall / 100) * circ;
  const fg = document.getElementById('sc-fg');
  fg.setAttribute('stroke', tier.color);
  fg.style.strokeDashoffset = circ;
  setTimeout(() => { fg.style.strokeDashoffset = offset; }, 100);
  document.getElementById('tier-chip').textContent = `${tier.name} · ${overall}/100`;
  document.getElementById('tier-chip').style.color = tier.color;
  document.getElementById('tier-chip').style.background = tier.soft;
  document.getElementById('tier-name').textContent = tier.name;
  document.getElementById('tier-text').textContent = tier.text;
  document.getElementById('score-explain').innerHTML = buildScoreMeaning(overall, tier, weakest) + ' Self-assessments can overstate or understate readiness, so treat the number as a structured prompt for evidence review.';
  document.getElementById('score-meaning').innerHTML = buildScoreMeaning(overall, tier, weakest);
  document.getElementById('fail-first-text').innerHTML = buildFailFirstText(weakest);
  document.getElementById('escalation-text').innerHTML = buildEscalationText(weakest, gaps);
  document.getElementById('conversation-text').innerHTML = buildOnPageConversation(overall, tier, weakest);
  document.getElementById('validation-text').innerHTML = weakest ? CATEGORY_META[weakest.cat].first : 'Review evidence, ownership, and test history before treating the score as settled.';
  document.getElementById('insight-grid').innerHTML = [
    {k:'Weakest function', v: weakest ? `${weakest.cat} · ${weakest.score}/100` : '—'},
    {k:'First conversation', v: weakest ? firstConversation(weakest.cat) : 'Validate the results'},
    {k:'Next validation', v: weakest ? CATEGORY_META[weakest.cat].first : 'Review evidence'}
  ].map(x => `<div class="insight"><div class="k">${x.k}</div><div class="v">${x.v}</div></div>`).join('');
  document.getElementById('snapshot-actions').innerHTML = buildSnapshotActions(gaps);
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
  const firstGap = gaps && gaps[0] ? numberedQuestionText(gaps[0]) : 'the lowest-scoring control area';
  const cat = weakest ? weakest.cat : 'the weakest readiness area';
  return `Start with a calm internal review: “This assessment suggests we should validate <strong>${cat}</strong> readiness, beginning with <strong>${escapeHtml(firstGap)}</strong>.” That keeps the conversation practical rather than alarmist and gives leadership a clear first decision point.`;
}
function buildSnapshotActions(gaps) {
  if (!gaps || gaps.length === 0) {
    return `<h4>First things to address</h4><div class="snapshot-action-list"><div class="snapshot-action" style="--action-color:var(--green);"><div class="num">✓</div><div><div class="meta">No immediate gaps selected</div><div class="topic">Review evidence and keep testing assumptions.</div><div class="fix">A strong self-screen still needs periodic validation through tabletop exercises, restore testing, and outside review where appropriate.</div></div></div></div>`;
  }
  return `<h4>First things to address</h4><div class="snapshot-action-list">${gaps.slice(0,3).map((g,i)=>{
    const meta = CATEGORY_META[g.category];
    return `<div class="snapshot-action" style="--action-color:${meta.color};"><div class="num">${i+1}</div><div><div class="meta">${categoryIcon(g.category)}${escapeHtml(g.category)}</div><div class="topic">${numberedQuestionHtml(g)}</div><div class="fix">${escapeHtml(g.remediation || meta.first)}</div></div></div>`;
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

  document.getElementById('cat-cards').innerHTML =
    getVisibleCategoryOrder()
      .filter(c => catScores[c] !== undefined)
      .map(cat => {

        const meta = CATEGORY_META[cat];

        return `<div class="cat-card"
          style="--cat-color:${meta.color};--cat-soft:${meta.soft};">

          <div class="cat-top">

            <div class="cat-title-wrap">
              <span class="cat-icon">${categoryIcon(cat)}</span>
              <div class="cat-title">${cat}</div>
            </div>

            <div class="cat-score">${catScores[cat]}</div>

          </div>

          <p>${meta.blurb}</p>

        </div>`;

      })
      .join('');

}
function renderGaps() {
  const gaps = getTopGaps();

  const card =
  document.getElementById(
    'gaps-card'
  );

  const list =
  document.getElementById(
    'gaps-list'
  );

  if(
    !card
    ||
    !list
  ){
    return;
  }

  if(
    !gaps.length
  ){
    card.classList.add(
      'hide'
    );
    return;
  }

  card.classList.remove(
    'hide'
  );

  list.innerHTML = gaps.map((g,i)=>{
    const meta = CATEGORY_META[g.category];

    return `<div class="gap-item" style="--gap-color:${meta.color};--gap-soft:${meta.soft};"><div class="gap-num">${String(i+1).padStart(2,'0')}</div><div><span class="gap-cat">${categoryIcon(g.category)}${g.category}</span><div class="gap-q">${numberedQuestionHtml(g)}</div><div class="gap-fix">${escapeHtml(g.remediation || meta.first)}</div></div></div>`;

  }).join('');
}
function renderAnswerLogOnPage() {
  const answerLabelMap = { yes:'Yes', partial:'Partial', no:'No', dontknow:"Don't know", na:'N/A' };
  const answerColorMap = { yes:'#2d6a4f', partial:'#c08418', no:'#9a2820', dontknow:'#334155', na:'#64748b' };
  const answerBgMap = { yes:'#d8e8df', partial:'#fcefd1', no:'#f3dad6', dontknow:'#f1f5f9', na:'#f8fafc' };

  const rows = getVisibleQuestions().map(q => {

    const meta = CATEGORY_META[q.category];

    const row =
    state.answers[q.id];

    const ans =
    typeof row === 'object'
    ?
    row?.answer
    :
    row;

    const note =
    typeof row === 'object'

    ?

    row?.note

    :

    document
    .querySelector(
      `[data-note="${q.id}"]`
    )
    ?.value

    ||

    '';

    const label =
    answerLabelMap[ans]
    ||
    '—';

    return `<tr><td><span class="log-category" style="--log-color:${meta.color};--log-soft:${meta.soft};">${categoryIcon(q.category)}${q.category}</span></td><td>${numberedQuestionHtml(q)}</td><td><span class="answer-pill" style="--ans-color:${answerColorMap[ans] || '#64748b'};--ans-bg:${answerBgMap[ans] || '#f8fafc'};">${label}</span></td><td>${escapeHtml(note || '—')}</td></tr>`;

  }).join('');

  document.getElementById('answer-log-table').innerHTML =
  `<thead><tr><th>Function</th><th>Question</th><th>Answer</th><th>Comments / Notes</th></tr></thead><tbody>${rows}</tbody>`;
}
function renderPresentationGuidance(overall, tier, weakest, gaps) {
  const weak = weakest ? weakest.cat : 'the lowest-scoring readiness area';
  const top = gaps && gaps.length ? numberedQuestionText(gaps[0]) : 'the first incomplete or uncertain control';
  document.getElementById('presentation-intro').innerHTML = `A useful internal conversation does not start with fear. It starts with evidence. The practical message is that the current screen places the organization at <strong>${overall}/100</strong> in the <strong>${tier.name}</strong> range, with <strong>${weak}</strong> as the first area to validate.`;
  document.getElementById('presentation-grid').innerHTML = [
    { h:'Suggested opening', p:`“I completed a structured incident-readiness screen. It is not an audit, but it gives us a clearer starting point for reviewing ${weak} readiness and the controls behind it.”` },
    { h:'First meeting agenda', p:'', list:['Confirm whether the answers reflect documented evidence or assumptions.','Review the priority gaps identified above.','Assign an owner for the first validation action.','Decide whether outside review is needed before budget, insurance, audit, or board discussion.'] },
    { h:'First issue to validate', p:`Begin with <strong>${escapeHtml(top)}</strong>. Ask who owns it, what evidence exists, when it was last tested, and what would happen if the organization had to rely on it this quarter.` }
  ].map(x => `<div class="present-card"><h4>${x.h}</h4>${x.p ? `<p>${x.p}</p>` : ''}${x.list ? `<ul>${x.list.map(i=>`<li>${i}</li>`).join('')}</ul>` : ''}</div>`).join('');
}
function scrollToCustomize() { document.getElementById('customize-card').scrollIntoView({ behavior:'smooth', block:'start' }); }
function toggleAudienceAll(el) {
  document.querySelectorAll('input[name="audience"]').forEach(cb => cb.checked = el.checked);
  validateCustomForm();
}
function updateIndustryFields() {
  const field = document.getElementById('f-industry');

  if(
    !field
  ){
    return;
  }

  const industry = field.value;

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
  const req = '<span class="required-mark">*</span>';
  if (f.type === 'select') {
    return `<div ${common}><label for="dyn-${f.id}">${f.label} ${req}</label><select id="dyn-${f.id}" aria-describedby="err-dyn-${f.id}"><option value="">Select</option>${f.options.map(o => `<option>${escapeHtml(o)}</option>`).join('')}</select><div class="field-error" id="err-dyn-${f.id}" aria-live="polite"></div></div>`;
  }
  return `<div ${common}><label for="dyn-${f.id}">${f.label} ${req}</label><input type="text" id="dyn-${f.id}" placeholder="Enter ${escapeHtml(f.label.toLowerCase())}" aria-describedby="err-dyn-${f.id}"><div class="field-error" id="err-dyn-${f.id}" aria-live="polite"></div></div>`;
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
function captureConsentTime() {
  const now = new Date();
  state.consent = { utc: now.toISOString(), local: now.toString(), timezoneOffsetMinutes: now.getTimezoneOffset(), privacyNoticeVersion: CONFIG.privacyNoticeVersion };
}
function getSelectedAudiences() { return [...document.querySelectorAll('input[name="audience"]:checked')].map(x => x.value); }

const BLOCKED_EMAIL_DOMAINS = [
    'gmail.com','googlemail.com',
    'yahoo.com','ymail.com','rocketmail.com',
    'hotmail.com','outlook.com','live.com','msn.com',
    'aol.com','aim.com',
    'icloud.com','me.com','mac.com',
    'protonmail.com','pm.me',
    'tutanota.com','tutamail.com',
    'startmail.com','hushmail.com',
    'fastmail.com','runbox.com',
    'countermail.com',
    'mailfence.com','kolabnow.com',
    'posteo.de','disroot.org',
    'gmx.com','gmx.de','gmx.net','gmx.at','gmx.ch',
    'yandex.com','yandex.ru',
    'mail.ru',
    'zoho.com',
    'laposte.net',
    'orange.fr',
    'free.fr',
    'libero.it','virgilio.it',
    'tin.it','tiscali.it',
    'rediffmail.com',
    'indiatimes.com',
    'sify.com',
    'bol.com.br',
    '163.com','126.com',
    'qq.com','yeah.net',
    'tempmail.com',
    'guerrillamail.com','guerrillamail.info',
    '10minutemail.com',
    'mailinator.com',
    'trashmail.com',
    'fakeinbox.com',
    'throwawaymail.com',
    'getnada.com',
    'yopmail.com',
    'sharklasers.com',
    'maildrop.cc',
    'moakt.com'
];

function isCompanyEmail(email) {

    const domain = email.toLowerCase().split('@').pop();

    if (domain.endsWith('.gov') || domain.endsWith('.edu')) {
        return true;
    }

    return !BLOCKED_EMAIL_DOMAINS.includes(domain);

}

function emailValid(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function getProfile() {

  return {

    fullName:
    document.getElementById(
      'f-fullname'
    )
    ?.value
    .trim()

    ||

    '',

    email:
    document.getElementById(
      'f-email'
    )
    ?.value
    .trim()

    ||

    '',

    company:
    document.getElementById(
      'f-company'
    )
    ?.value
    .trim()

    ||

    '',

    role:
    document.getElementById(
      'f-role'
    )
    ?.value

    ||

    '',

    audiences:[],
    industry:'',
    trigger:'',
    details:{},

    consents:{

      analystFollowup:
      document.getElementById(
        'c-followup'
      )
      ?.checked

      ||

      false,

      securityAndPresentationGuidance:
      document.getElementById(
        'c-guidance'
      )
      ?.checked

      ||

      false,

      privacyAcknowledgement:
      document.getElementById(
        'c-privacy'
      )
      ?.checked

      ||

      false,

      timestamp:
      state.consent

      ||

      null

    }

  };

}

document.getElementById( 'ira-assessment-note' )?.style.setProperty( 'display', state.mode === 'deep' ? 'block' : 'none' );

function setFieldError(fieldId, errorId, message, showErrors) {
  const field = document.getElementById(fieldId);
  const holder = field ? field.closest('.field') : null;
  const err = document.getElementById(errorId);
  const shouldShow = !!message && showErrors;
  if (holder) holder.classList.toggle('invalid', shouldShow);
  if (field) field.setAttribute('aria-invalid', shouldShow ? 'true' : 'false');
  if (err) {
    err.textContent = shouldShow ? message : '';
    err.classList.toggle('show', shouldShow);
  }
}
function setGroupError(containerId, errorId, message, showErrors) {
  const container = document.getElementById(containerId);
  const err = document.getElementById(errorId);
  const shouldShow = !!message && showErrors;
  if (container) container.classList.toggle('invalid', shouldShow);
  if (err) {
    err.textContent = shouldShow ? message : '';
    err.classList.toggle('show', shouldShow);
  }
}
function visibleDynamicFields() {
  return [...document.querySelectorAll('.dynamic-field')].filter(box => !box.classList.contains('hide'));
}
function validateCustomForm(options = {}) {
  const showErrors = !!(options.showErrors || state.validationAttempted);
  const p = getProfile();
  const errors = [];
  const fullNameError = p.fullName ? '' : 'Please enter your full name.';
  const emailError =
    !p.email
        ? 'Please enter your work email address.'
        : !emailValid(p.email)
            ? 'Please verify the Email field is properly filled.'
            : !isCompanyEmail(p.email)
                ? 'Please use a company or professional email address.'
                : '';
  const companyError = p.company ? '' : 'Please enter the organization name.';
  const roleError = p.role ? '' : 'Please select your role in the organization.';
  const audienceError = '';
  const industryError = '';
  const triggerError = '';
  // const audienceError = p.audiences.length ? '' : 'Please select at least one perspective for the report to address.';
  // const industryError = p.industry ? '' : 'Please select an industry.';
  // const triggerError = p.trigger ? '' : 'Please select what prompted this review.';
  const privacyError = p.consents.privacyAcknowledgement ? '' : 'Please accept the Privacy Policy acknowledgement before downloading the report.';

  [fullNameError, emailError, companyError, roleError, audienceError, industryError, triggerError, privacyError].forEach(e => { if (e) errors.push(e); });

  setFieldError('f-fullname', 'err-fullname', fullNameError, showErrors);
  setFieldError('f-email', 'err-email', emailError, showErrors);
  setFieldError('f-company', 'err-company', companyError, showErrors);
  setFieldError('f-role', 'err-role', roleError, showErrors);
  // setGroupError('audience-checks', 'err-audience', audienceError, showErrors);
  // setFieldError('f-industry', 'err-industry', industryError, showErrors);
  // setFieldError('f-trigger', 'err-trigger', triggerError, showErrors);
  setGroupError('consent-checks', 'err-privacy', privacyError, showErrors);


  visibleDynamicFields().forEach(box => {
    const input = box.querySelector('input, select, textarea');
    const labelEl = box.querySelector('label');
    if (!input) return;
    const label = labelEl ? labelEl.textContent.replace('*','').trim() : 'this field';
    const dynError = input.value.trim() ? '' : `Please complete the ${label} field.`;
    if (dynError) errors.push(dynError);
    setFieldError(input.id, `err-${input.id}`, dynError, showErrors);
  });

  const valid = errors.length === 0;

  const status = document.getElementById( 'form-status' );

  if( status ){
    status.classList.toggle( 'error', showErrors && !valid );

    status.classList.toggle( 'ready', valid );
    if( valid ){
      status.textContent = 'Ready. The customized report can now be generated.';
    } else{
      status.textContent = 'Complete the required fields marked with * before downloading the customized PDF.';
    }

  }
  const downloadForm = document.getElementById( 'btn-download-form' );

  if( downloadForm ){
    downloadForm.disabled = false;
  }

  const downloadCta = document.getElementById( 'btn-download-cta' );

  if( downloadCta ){
    downloadCta.disabled = false;
  }
  const allAud = [...document.querySelectorAll('input[name="audience"]')];
  const selectAll = document.getElementById('aud-select-all');
  if (selectAll) selectAll.checked = allAud.length > 0 && allAud.every(cb => cb.checked);
  return valid;
}
function focusFirstInvalidField() {
  const first = document.querySelector('.field.invalid input, .field.invalid select, .field.invalid textarea, .checkbox-grid.invalid input');
  if (first) {
    first.focus({ preventScroll:true });
  }
}
async function downloadCustomReport() {
  state.validationAttempted = true;
  if (!validateCustomForm({ showErrors:true })) { scrollToCustomize(); setTimeout(focusFirstInvalidField, 350); return; }
  if (!state.consent) captureConsentTime();
  const profile = getProfile();
  await submitIRAHubSpot(profile);
  const payload = buildLeadPayload(profile);
  if (CONFIG.crmEnabled) {
    console.log('[CRM ENABLED PLACEHOLDER] Submit payload here:', payload);
  } else {
    console.log('[STANDALONE MODE] Report payload prepared:', payload);
  }
  downloadPDF(profile);
}

async function submitIRAHubSpot(profile) {

  const path = window.location.pathname;

  let iraType = 'IRA Assessment';

  if (path.includes('/assessment')) {
    iraType = 'MDR Assessment';
  }


  const nameParts = profile.fullName
    .trim()
    .split(/\s+/);


  const firstname = nameParts.shift() || '';
  const lastname = nameParts.join(' ') || '';


  const response = await fetch(
    'https://api.hsforms.com/submissions/v3/integration/submit/240153/be61ffd2-8f1a-4ee0-9524-e7ff2ab9666b',
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({

        fields: [

          {
            name: 'firstname',
            value: firstname
          },

          {
            name: 'lastname',
            value: lastname
          },

          {
            name: 'email',
            value: profile.email
          },

          {
            name: 'company',
            value: profile.company
          },

          {
            name: 'jobtitle',
            value: profile.role
          },

          {
            name: 'embed_title',
            value: iraType
          },

          {
            name: 'hs_lead_status',
            value: 'NEW'
          }

        ]

      })
    }
  );


  if (!response.ok) {

    console.error(
      'HubSpot submission failed:',
      response.status
    );

    return false;
  }


  console.log(
    'HubSpot IRA submission successful:',
    iraType
  );


  return true;

}

function buildLeadPayload(profile) {

  const { overall, catScores } = calculateScore();

  const weakest = getWeakestCategory(catScores);

  const gaps = getTopGaps();

  const answers = {};

  Object.entries(state.answers).forEach(([id,val])=>{

    answers[id] = {

      answer: val,

      note:

        document

        .querySelector(

          `[data-note="${id}"]`

        )

        ?.value

        ||

        ''

    };

  });

  return {

    profile,

    score: overall,
    catScores,

    tier: getTier(overall).name,

    weakestCategory: weakest,

    topGaps:

      gaps.map(

      g=>({

        category: g.category,

        question: g.item,

        answer: answers[g.id]?.answer || '',

        note: answers[g.id]?.note || ''

      })

    ),

    answers,

    mode: state.mode,

    assessment_type:
        iraConfig.assessment === 'assessment-short'
            ? 'short'
            : 'full',

    generatedAt: new Date().toISOString()

  };

}
function openShare() {
  const payload = { mode:state.mode, answers:state.answers };
  const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(payload));
  const url = `${CONFIG.shareBaseUrl}#${compressed}`;
  navigator.clipboard.writeText(url).then(() => alert('Share link copied.')).catch(() => prompt('Copy this share link:', url));
}
function resetAll() {
  if (window.location.hash) history.pushState('', document.title, window.location.pathname + window.location.search);
  state = { mode:'deep', answers:{}, isShared:false, consent:null, validationAttempted:false };
  document.getElementById('shared-banner').classList.remove('show');
  document.querySelectorAll('.mode-tab').forEach(t => t.classList.toggle('active', t.dataset.mode === 'deep'));
  renderTable();
  document.getElementById('results-section').classList.remove('show');
  window.scrollTo({ top:0, behavior:'smooth' });
}
function pdfPageBackground(currentPage, pageSize) {
  const canvas = [
    { type:'rect', x:0, y:0, w:5, h:pageSize.height, color:'#002247' },
    { type:'rect', x:5, y:0, w:1.4, h:pageSize.height, color:'#1c6db3' }
  ];
  if (currentPage > 1) {
    // Minimal corporate page furniture: left rail, fine header/footer rules,
    // a function color index, and a quiet right-side guide line. Decorative
    // corner blocks are intentionally omitted to keep the design language tight.
    canvas.push({ type:'line', x1:54, y1:40, x2:pageSize.width-54, y2:40, lineWidth:.35, lineColor:'#d7dee8' });
    canvas.push({ type:'line', x1:pageSize.width-38, y1:78, x2:pageSize.width-38, y2:pageSize.height-88, lineWidth:.45, lineColor:'#e8eef5' });
    canvas.push({ type:'line', x1:54, y1:pageSize.height-42, x2:pageSize.width-54, y2:pageSize.height-42, lineWidth:.25, lineColor:'#e8eef5' });
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
  const W = cats.length <= 3 ? 330 : 430;
  const H = 180;
  const baseY = 138;
  const maxH = 104;
  const gap = 10;
  const plankW = (W - gap * (cats.length - 1)) / cats.length;
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

const ICON_USER = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
<circle cx="12" cy="8" r="4"
stroke="#1c6db3"
stroke-width="2"
fill="none"/>
<path d="M5 20c1-4 5-6 7-6s6 2 7 6"
stroke="#1c6db3"
stroke-width="2"
fill="none"/>
</svg>`;

const ICON_BUILDING = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
<rect x="6" y="3" width="12" height="18"
stroke="#2d6a4f"
stroke-width="2"
fill="none"/>
<path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2"
stroke="#2d6a4f"
stroke-width="2"/>
</svg>`;

const ICON_SHIELD = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
<path
d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"
stroke="#1c6db3"
stroke-width="2"
fill="none"/>
</svg>`;

const ICON_CALENDAR = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
<rect
x="3"
y="5"
width="18"
height="16"
rx="2"
stroke="#7c3aed"
stroke-width="2"
fill="none"/>
<path d="M3 9h18M8 3v4M16 3v4"
stroke="#7c3aed"
stroke-width="2"/>
</svg>`;

function coverPage(profile, dateStr) {

    const orgName = profile.company || 'Organization';

    return [

        /*
        ==================================================
        HERO
        ==================================================
        */

        {
            margin:[0,12,0,20],
            table:{
                widths:['*'],
                body:[[
                    {
                        stack:[

                            {
                                text:'VANCORD - INCIDENT READINESS ASSESSMENT',
                                style:'coverKicker',
                                margin:[0,10,0,10]
                            },

                            {
                                text:orgName,
                                style:'coverTitle',
                                margin:[0,0,0,12]
                            },

                            {
                                canvas:[
                                    {
                                        type:'line',
                                        x1:0,
                                        y1:0,
                                        x2:420,
                                        y2:0,
                                        lineColor:'#2b86d1',
                                        lineWidth:1.4
                                    }
                                ],
                                margin:[0,0,0,16]
                            },

                            {
                                text:'A structured readiness report mapped to the six NIST Cybersecurity Framework functions.',
                                style:'coverSub',
                                margin:[0,0,0,5]
                            },

                        ],
                        fillColor:'#002247',
                        margin:[30,28,30,28],
                        border:[false,false,false,false]
                    }
                ]]
            },
            layout:'noBorders'
        },

        /*
        ==================================================
        FOUR INFO BOXES
        ==================================================
        */

        {
            table:{
                widths:['*','*'],
                body:[
                  [
                    infoCard(
                      'Prepared By',
                      profile.fullName || 'Not specified',
                      ICON_USER,
                      '#eaf2fd'
                    ),
                    infoCard(
                      'Prepared For',
                      orgName || 'Not specified',
                      ICON_BUILDING,
                      '#eef8f4'
                    ),
                  ],
                  [
                    infoCard(
                      'Role',
                      profile.role || 'Not specified',
                      ICON_SHIELD,
                      '#eef5ff'
                    ),
                    infoCard(
                      'Assessment Date',
                      dateStr,
                      ICON_CALENDAR,
                      '#f4efff'
                    )
                  ]
                ]
            },
            layout:{
                hLineColor:()=>'#d7dee8',
                vLineColor:()=>'#d7dee8',
                hLineWidth:()=>1,
                vLineWidth:()=>1
            },
            margin:[0,0,0,22]
        },

        /*
        ==================================================
        DOMAINS TITLE
        ==================================================
        */

        {
            columns:[
                {
                    canvas:[
                        {
                            type:'line',
                            x1:0,
                            y1:6,
                            x2:170,
                            y2:6,
                            lineColor:'#d7dee8'
                        }
                    ],
                    width:'*'
                },
                {
                    text:'ASSESSMENT DOMAINS',
                    style:'coverMetaHead',
                    alignment:'center',
                    width:'auto',
                    margin:[12,15,12,10]
                },
                {
                    canvas:[
                        {
                            type:'line',
                            x1:0,
                            y1:6,
                            x2:170,
                            y2:6,
                            lineColor:'#d7dee8'
                        }
                    ],
                    width:'*'
                }
            ],
            margin:[0,0,0,0]
        },

        /*
        ==================================================
        COLORED DOMAIN BOXES
        ==================================================
        */

        {
            table:{
                widths:CATEGORY_ORDER.map(()=>'*'),
                body:[
                    CATEGORY_ORDER.map(cat=>({
                        stack:[
                            {
                                text:cat,
                                fontSize:10,
                                bold:true,
                                color:'#ffffff',
                                alignment:'center',
                                margin:[0,18,0,18]
                            }
                        ],
                        fillColor:CATEGORY_META[cat].color,
                        border:[false,false,false,false]
                    }))
                ]
            },
            layout:'noBorders',
            margin:[0,0,0,10]
        },

        /*
        ==================================================
        DESCRIPTION
        ==================================================
        */

        {
            text:"This assessment evaluates your organization's readiness across the six NIST Cybersecurity Framework functions.",
            alignment:'center',
            color:'#64748b',
            fontSize:12,
            margin:[30,15,30,15]
        },

        /*
        ==================================================
        FOOTER
        ==================================================
        */

        {
            canvas:[
                {
                    type:'line',
                    x1:0,
                    y1:0,
                    x2:500,
                    y2:0,
                    lineColor:'#d7dee8'
                }
            ],
            margin:[0,0,0,14]
        },
        {
            text:'VANCORD',
            fontSize:22,
            bold:true,
            color:'#002247',
            alignment:'center'
        },
        {
            text:'Securing Organizations Since 2005',
            fontSize:10,
            color:'#1c6db3',
            alignment:'center',
            margin:[0,4,0,0],
            pageBreak:'after'
        }

    ];

}

function infoCard(title, value, iconSvg, iconBg = '#eef4fb') {

    return {

        table: {
            widths: [42, '*'],
            body: [[

                {
                    table: {
                        widths: ['*'],
                        body: [[
                            {
                                svg: iconSvg,
                                fit: [18,18],
                                alignment: 'center',
                                margin: [10,10,10,10],
                                fillColor: iconBg,
                                border: [false,false,false,false]
                            }
                        ]]
                    },
                    layout:'noBorders',
                    fillColor:iconBg,
                    border:[false,false,false,false]
                },

                {
                    stack:[

                        {
                            text:title.toUpperCase(),
                            fontSize:8,
                            bold:true,
                            color:'#64748b',
                            margin:[0,3,0,6]
                        },

                        {
                            text:value,
                            fontSize:13,
                            bold:true,
                            color:'#0f172a'
                        }

                    ],
                    margin:[10,8,10,8],
                    border:[false,false,false,false]
                }

            ]]
        },

        layout:'noBorders',

        fillColor:'#f8fafc'

    };

}

function infoBox(title, value) {
    return {
        stack: [
            {
                text: title.toUpperCase(),
                color: '#1c4b8f',
                bold: true,
                fontSize: 10,
                margin: [0, 0, 0, 8]
            },
            {
                text: value,
                fontSize: 15,
                bold: true,
                color: '#0f172a'
            }
        ],
        fillColor: '#ffffff',
        margin: [18, 18, 18, 18]
    };
}

function executiveSummaryPage(overall, tier, weakest, catScores, gaps) {
  const topRows = (gaps.length ? gaps.slice(0,3) : []).map((g,i) => {
    const meta = CATEGORY_META[g.category];
    return [
      { text:String(i+1).padStart(2,'0'), style:'gapRank', color:meta.color, fillColor:meta.soft },
      { columns:[{ svg:svgIconPdf(g.category, meta.color), fit:[10,10], width:12, margin:[0,1,3,0] },{ text:g.category.toUpperCase(), style:'gapCatPdf', color:meta.color, width:'*' }], fillColor:meta.soft },
      Object.assign(numberedQuestionPdf(g, 'gapQPdf'), { fillColor:meta.soft })
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
    { text:'2. Assessment Domain Dashboard', style:'sectionTitleCompact', margin:[0,0,0,5] },
    { text:'2.1 Readiness Map', style:'subhead', margin:[0,0,0,4] },
    { text:'The readiness map summarizes each assessment domain. The table translates every domain into a diagnostic signal and recommended validation action.', style:'bodySmall', margin:[0,0,0,7] },
    { svg:svgWall(catScores), fit:[480,132], alignment:'center', margin:[0,0,0,8] },
    { text:'2.2 Assessment Domain Analysis', style:'subhead', margin:[0,0,0,6] },
    { table:{ widths:[24,48,30,'*'], body, dontBreakRows:true }, layout:{ hLineWidth:(i)=>i===1?1:.25, vLineWidth:()=>0, hLineColor:(i)=>i===1?'#002247':'#d7dee8', paddingTop:()=>5, paddingBottom:()=>5, paddingLeft:()=>5, paddingRight:()=>5 }, pageBreak:'after' }
  ];
}
function answerLogPage() {
  const visible = getVisibleQuestions();
  const answerLabelMap = { yes:'Yes', partial:'Partial', no:'No', dontknow:"Don't know", na:'N/A' };
  const answerColorMap = { yes:'#2d6a4f', partial:'#c08418', no:'#9a2820', dontknow:'#64748b', na:'#94a3b8' };
  const blocks = [
    { text:'3. Answer Log', style:'sectionTitle', margin:[0,0,0,8] },
    { text:'3.1 Response Evidence Trail', style:'subhead', margin:[0,0,0,6] },
    { text:'Every answer used to calculate the score is listed below. Each assessment domain is grouped in a left-side category band so the question column keeps more room for longer assessment items.', style:'body', margin:[0,0,0,14] },
    answerLogHeaderTable()
  ];

  getVisibleCategoryOrder().forEach(cat => {
    const qs = visible.filter(q => q.category === cat);
    if (!qs.length) return;
    const chunks = answerLogChunks(qs, 9);
    chunks.forEach((chunk, idx) => {
      blocks.push(answerLogGroupBlock(cat, chunk, answerLabelMap, answerColorMap, idx > 0));
    });
  });

  blocks.push({ text:'', pageBreak:'after', margin:[0,0,0,0] });
  return blocks;
}

function answerLogHeaderTable() {
  return {
    table:{
      widths:[52,'*',80,180],
      body:[[
        { text:'Function', style:'tableHead', alignment:'center' },
        { text:'Question', style:'tableHead' },
        { text:'Answer', style:'tableHead', alignment:'center' },
        { text:'Comments / Notes', style:'tableHead', alignment:'left' }
      ]]
    },
    layout:{
      hLineWidth:(i)=>i===1?1:.3,
      vLineWidth:()=>0,
      hLineColor:(i)=>i===1?'#002247':'#e2e8f0',
      paddingTop:()=>5,
      paddingBottom:()=>5,
      paddingLeft:()=>5,
      paddingRight:()=>5
    }
  };
}

function answerLogChunks(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

function answerLogGroupBlock(cat, qs, answerLabelMap, answerColorMap, isContinuation) {
  const meta = CATEGORY_META[cat];
  const label = isContinuation ? `${cat.toUpperCase()} CONT.` : cat.toUpperCase();

  const nestedRows = qs.map(q => {
    const row = state.answers[q.id];

    const ans = typeof row === 'object' ? row.answer : row;

    const note =
    typeof row === 'object'

    ?

    row.note

    :

    document
    .querySelector(
      `[data-note="${q.id}"]`
    )
    ?.value

    ||

    '';

    return [
      numberedQuestionPdf(q, 'qaQ'),
      {
        stack:[
          {
            text:ans ? answerLabelMap[ans].toUpperCase() : '—',
            color:ans ? answerColorMap[ans] : '#64748b',
            bold:true,
            fontSize:7,
            alignment:'center',
            margin:[2,2,2,2]
          }
        ],
        border:[
          true,
          true,
          true,
          true
        ],
        borderColor:[
          ans ? answerColorMap[ans] : '#cbd5e1',
          ans ? answerColorMap[ans] : '#cbd5e1',
          ans ? answerColorMap[ans] : '#cbd5e1',
          ans ? answerColorMap[ans] : '#cbd5e1'
        ],
        fillColor:
          ans === 'yes'
          ? '#d8e8df'
          :
          ans === 'partial'
          ? '#fcefd1'
          :
          ans === 'no'
          ? '#f3dad6'
          :
          ans === 'dontknow'
          ? '#f1f5f9'
          :
          '#f8fafc',
        margin:[2,2,2,2],
        alignment:'center'
      },
      { text:note || '—', style:'qaNote' }
    ];
  });

  return {
    table:{
      widths:[52,'*',80,180],
      body:[[
        {
          stack:[
            { svg:svgIconPdf(cat, meta.color), fit:[15,15], alignment:'center', margin:[0,0,0,3] },
            { text:label, style:'answerLogCategoryMerged', color:meta.color, alignment:'center', noWrap:false }
          ],
          fillColor:meta.soft,
          alignment:'center',
          margin:[1, answerLogCategoryCenterMargin(qs.length), 1, 0]
        },
        {
          colSpan:3,
          table:{ widths:['*',80,180], body:nestedRows },
          layout:{
            hLineWidth:(i,node)=> i===0 ? 0 : .3,
            vLineWidth:()=>0,
            hLineColor:()=>'#e2e8f0',
            paddingTop:()=>5,
            paddingBottom:()=>5,
            paddingLeft:()=>5,
            paddingRight:()=>5
          },
          margin:[0,0,0,0]
        },
        {},
        {}
      ]]
    },
    layout:{
      hLineWidth:()=>0,
      vLineWidth:()=>0,
      paddingTop:()=>0,
      paddingBottom:()=>0,
      paddingLeft:()=>0,
      paddingRight:()=>0
    },
    margin:[0,0,0,0]
  };
}

function answerLogCategoryCenterMargin(rowCount) {
  // The Answer Log no longer uses pdfMake rowSpan for the category cell.
  // Instead, each category is a single left-side cell beside a nested question table.
  // This gives the icon and label the full group height, avoiding the clipping
  // that occurred when SVG content was placed inside row-spanned cells.
  const estimatedRowHeight = 31;
  const estimatedIconLabelStackHeight = 28;
  const estimatedGroupHeight = Math.max(estimatedRowHeight, rowCount * estimatedRowHeight);
  return Math.max(2, Math.round((estimatedGroupHeight - estimatedIconLabelStackHeight) / 2));
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
  blocks.push({ text:'4. How to Present This Report', style:'sectionTitle', margin:[0,0,0,5] });
  blocks.push({ text:`This section is tailored to the perspectives selected in the form: ${selected.join(', ')}. Use it to move the conversation from a raw score to a responsible discussion about evidence, ownership, and next action.`, style:'body', margin:[0,0,0,12] });
  blocks.push({ text:'4.1 Suggested Internal Framing', style:'subhead', margin:[0,0,0,4] });
  blocks.push({ text:`The assessment places ${profile.company || 'the organization'} in the ${tier.name} tier at ${overall}/100. The first function to validate is ${weakest ? weakest.cat : 'the lowest-scoring function'}. The immediate question is whether the current controls, plans, and owners would hold up during a real incident, audit, insurance renewal, or executive review.`, style:'body', margin:[0,0,0,12] });
  blocks.push({ text:'4.2 Perspective-Specific Framing', style:'subhead', margin:[0,2,0,4] });
  blocks.push({ table:{ widths:[112,'*','*','*'], body:audiencePresentationRows(selected, weakest, gaps) }, layout:{ hLineWidth:(i)=>i===1?1:.25, vLineWidth:()=>0, hLineColor:(i)=>i===1?'#002247':'#e2e8f0', paddingTop:()=>5, paddingBottom:()=>5, paddingLeft:()=>5, paddingRight:()=>5 }, margin:[0,0,0,12] });
  blocks.push({ text:'4.3 Suggested Meeting Agenda', style:'subhead', margin:[0,2,0,4] });
  blocks.push({ ol: buildAgenda(selected, weakest), style:'body', margin:[0,0,0,12] });
  blocks.push({ text:'4.4 Suggested Email Copy', style:'subhead', margin:[0,2,0,5] });
  blocks.push({ table:{ widths:['*'], body:[[ { text: buildSuggestedEmail(profile, overall, tier, weakest, gaps), style:'emailBox', fillColor:'#f8fafc', margin:[10,10,10,10] } ]] }, layout:'noBorders', margin:[0,0,0,16] });
  blocks.push({ text:'', pageBreak:'after', margin:[0,0,0,0] });
  blocks.push({ text:'5. Communication and Contact Details', style:'sectionTitle', margin:[0,6,0,8] });
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
  const topGap = gaps[0] ? numberedQuestionText(gaps[0]) : 'the first readiness gap';
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
  const topGap = gaps[0] ? numberedQuestionText(gaps[0]) : 'the lowest-scoring readiness area';
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
    coverSub:{ fontSize:11, color:'#d9e5f2', lineHeight:1.2 },
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
    body:{ fontSize:10, color:'#475569', lineHeight:1.05 },
    bodySmall:{ fontSize:9, color:'#475569', lineHeight:1.15 },
    bodyTiny:{ fontSize:8.2, color:'#475569', lineHeight:1.05 },
    diagText:{ fontSize:8.5, color:'#334155', lineHeight:1.38 },
    bodySmallBold:{ fontSize:9, color:'#334155', bold:true, lineHeight:1.05 },
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
    answerLogCategoryCompact:{ fontSize:6.7, bold:true, color:'#0f172a', characterSpacing:.05, lineHeight:1.0 },
    answerLogCategoryMerged:{ fontSize:6.9, bold:true, color:'#0f172a', characterSpacing:.02, lineHeight:1.02 },
    scoreLarge:{ fontSize:15, bold:true },
    scoreTight:{ fontSize:13, bold:true },
    qaQ:{ fontSize:8.8, color:'#0f172a', lineHeight:1.35 },
    questionNoPdf:{ fontSize:8.3, bold:true, color:'#1c6db3' },
    qaAns:{ fontSize:9, bold:true },
    gapRank:{ fontSize:10, bold:true },
    gapCatPdf:{ fontSize:8, bold:true, characterSpacing:.4 },
    gapQPdf:{ fontSize:8.5, color:'#334155', lineHeight:1.35 },
    audienceCell:{ fontSize:8.2, bold:true, color:'#002247' },
    consentLabel:{ fontSize:7.8, bold:true, color:'#64748b', characterSpacing:.5 },
    consentValue:{ fontSize:8.2, color:'#0f172a' },
    emailBox:{ fontSize:9, color:'#0f172a', lineHeight:1.15 },
    foot:{ fontSize:8, color:'#94a3b8' },
    ctcLabel:{ fontSize:9, bold:true, color:'#002247', characterSpacing:1.2 },
    ctcVal:{ fontSize:10, color:'#0f172a', lineHeight:1.5 },
    ctcValSm:{ fontSize:9, color:'#64748b' },
    ctcLink:{ fontSize:10, color:'#1c6db3', decoration:'underline' },
    ctcEmergency:{ fontSize:16, bold:true, color:'#002247' },
    qaNote:{ fontSize:8, color:'#334155' },
  };
}

window.addEventListener('load',()=>{

  let attempts=0;

  const wait=setInterval(()=>{

    if(typeof window.downloadCustomReport==='function'){
      clearInterval(wait);
      iraHookReportSubmit();
      return;
    }

    if(++attempts>20){
      clearInterval(wait);
    }

  },500);

});

function showLoader(){

  const loader=
  document.getElementById(
    'ira-loader'
  );

  if(
    loader
  ){

    loader.classList.remove(
      'hidden'
    );

  }

}

function hideLoader(){

  const loader=
  document.getElementById(
    'ira-loader'
  );

  if(
    loader
  ){

    loader.classList.add(
      'hidden'
    );

  }

}

async function iraRequest( action, data={} ){

  const body = new FormData();

  body.append('action', action);
  body.append('nonce', IRA_DATA.nonce);

  Object.entries(data).forEach(([k,v])=>{

    body.append(
      k,
      typeof v === 'object'
        ? JSON.stringify(v)
        : v
    );

  });

  const request = await fetch(
    IRA_DATA.ajax_url,
    {
      method:'POST',
      body
    }
  );

  if(!request.ok){
    throw new Error(
      `IRA AJAX failed: ${request.status}`
    );
  }

  return request.json();

}

function redirect(url){

  if(url){
    window.location.href=url;
  }

}

function set(
  id,
  value=''
){

  const field=
  document.getElementById(id);

  if(!field){
    return;
  }

  field.value=value;

  field.dispatchEvent(

    new Event(
      'change',
      {
        bubbles:true
      }
    )

  );

}

function iraHookReportSubmit() {

  if(
    typeof window.downloadCustomReport!=='function'
  ){
    return;
  }

  const original=
  window.downloadCustomReport;

  window.downloadCustomReport=
  async function(){

    state.validationAttempted=true;

    if(typeof validateCustomForm==='function' && !validateCustomForm({ showErrors:true })) {

      scrollToCustomize?.();

      setTimeout(()=>{
          focusFirstInvalidField?.();
        }, 350
      );
      return;
    }

    try{

      const profile=
      getProfile();

      const response=

      await iraRequest( 'ira_submit', {

          submission:{

            source:
            'final_report',

            report:
            buildLeadPayload(
              profile
            ),

            customization:
            profile

          }

        }

      );

      const result=

      await original.apply(
        this,
        arguments
      );

      if(
        response?.success
      ){

        setTimeout(

          ()=>redirect(

            response
            .data
            .view_url

          ),

          2500

        );

      }

      return result;

    }
    catch(e){

      console.error(
        e
      );

      return original.apply(
        this,
        arguments
      );

    }

  };

}

async function saveRevision(){

  try{

    const existing =

      window
      .IRA_EDIT_DATA
      ?.customization

      ||

      window
      .IRA_EDIT_DATA
      ?.report
      ?.profile

      ||

      {};

    let profile = {
      ...existing
    };


    if(
      typeof getProfile === 'function'
    ){

      try{

        const fresh = getProfile();

        if(
          fresh &&
          Object
          .values(fresh)
          .some(v => v !== '')
        ){

          profile = {
            ...profile,
            ...fresh
          };

        }

      }
      catch(e){
        // Ignore optional profile refresh errors
      }

    }

    const response = await iraRequest(

      'ira_save_revision',

      {

        id: IRA_EDIT_ID,

        revision:{

          source:'revision',

          report:
          buildLeadPayload(
            profile
          ),

          customization:
          profile

        }

      }

    );


    if(response?.success){

      redirect(
        response.data.view_url
      );

    }
    else{

      console.error(
        'Revision save failed:',
        response
      );

    }


  }
  catch(e){

    console.error(
      'Save revision error:',
      e
    );

  }

}

function renderRevisionHistory(){

  if(
    !window
    .IRA_REVISIONS
    ?.length
  ){
    return;
  }

  if(
    document.querySelector(
      '.ira-revisions'
    )
  ){
    return;
  }

  const wrap=
  document.createElement(
    'div'
  );

  wrap.className=
  'ira-revisions';

  wrap.innerHTML=
  '<strong>Revision History</strong>';

  [...window.IRA_REVISIONS]

  .reverse()

  .forEach(

  (rev,index)=>{

    const a=
    document.createElement(
      'a'
    );

    const url=
    new URL(
      window.location
    );

    url.searchParams.set(
      'revision',
      rev.id
    );

    a.href=url;

    a.className=
    'ira-revision';

    a.dataset.id=
    rev.id;

    a.innerHTML=

      'Revision '

      +

      (
        index+1
      )

      +

      '<small>'

      +

      new Date(
        rev.created_at
      )
      .toLocaleString()

      +

      '</small>';

    wrap.appendChild(a);

  });

  document
  .querySelector(
    '.topbar'
  )
  ?.insertAdjacentElement(
    'afterend',
    wrap
  );

}

function restoreMode(){

  const mode=

  window
  .IRA_EDIT_DATA
  ?.report
  ?.mode

  ||

  'deep';

  const button=

  document.querySelector(

  `.mode-tab[data-mode="${mode}"]`

  );

  if(
    button
  ){
    button.click();
    return;
  }

  if(
    typeof setMode==='function'
  ){
    setMode(mode);
  }

}

function restoreAnswers(){

  Object.entries(

    window
    .IRA_EDIT_DATA
    ?.report
    ?.answers

    ||

    {}

  )

  .forEach(

  ([id,val])=>{

    const answer =
    typeof val === 'object'
    ? val.answer
    : val;

    const note =
    typeof val === 'object'
    ? val.note
    : '';

    document
    .querySelector(

      `input[name="${id}"][value="${answer}"]`

    )

    ?.click();

    const noteField =
    document.querySelector( `[data-note="${id}"]` );

    if(
      noteField
    ){

      noteField.value =
      note;

    }

  });

}

function restoreConsents(consents={}){

  Object.entries(consents)

  .forEach(

  ([id,val])=>{

    const field=
    document.getElementById(
      id
    );

    if(field){
      field.checked=
      !!val;
    }

  });

}

function restoreAudience(
  profile
){

  if(
    !profile
    ?.audiences
    ?.length
  ){
    return;
  }

  const all=
  document.getElementById(
    'aud-select-all'
  );

  if(
    all
    &&
    profile
    .audiences
    .length
    >=
    5
  ){

    all.checked=true;

    all.dispatchEvent(
      new Event(
        'change'
      )
    );

    return;

  }

  document

  .querySelectorAll(
    'input[type=checkbox]'
  )

  .forEach(

  cb=>{

    if(
      profile
      .audiences
      .includes(
        cb.value
      )
    ){
      cb.checked=true;
    }

  });

}

async function restoreDetails(
  profile
){

  if(
    !profile
    ?.details
  ){
    return;
  }

  const details=
  profile
  .details;

  let attempts=0;

  const wait=

  setInterval(

    ()=>{

      const ready=

      Object
      .keys(
        details
      )

      .every(

      key=>

      document
      .getElementById(

        'f-'+
        key

      )

      );

      if(
        ready
      ){

        clearInterval(
          wait
        );

        Object
        .entries(
          details
        )

        .forEach(

        ([key,val])=>{

          const field=

          document
          .getElementById(

            'f-'+
            key

          );

          if(
            field
          ){

            field.value=
            val;

            field.dispatchEvent(

              new Event(

                'change',

                {

                  bubbles:true

                }

              )

            );

          }

        });

      }

      if(
        ++attempts
        >
        20
      ){

        clearInterval(
          wait
        );

      }

    },

    300

  );

}

function waitFor(
  selector,
  timeout=5000
){

  return new Promise(resolve=>{

    const started=
    Date.now();

    const timer=

    setInterval(()=>{

      const found=

      document
      .querySelector(
        selector
      );

      if(found){

        clearInterval(
          timer
        );

        resolve(
          found
        );

      }

      if(
        Date.now()
        -
        started
        >
        timeout
      ){

        clearInterval(
          timer
        );

        resolve(
          null
        );

      }

    },150);

  });

}

async function restoreCustomization(){

  const p=

  window
  .IRA_EDIT_DATA
  ?.customization

  ||

  {};

  set('f-fullname',p.fullName);
  set('f-email',p.email);
  set('f-company',p.company);
  set('f-role',p.role);
  // set('f-industry',p.industry);

  // document
  // .getElementById(
  //   'f-industry'
  // )
  // ?.dispatchEvent(
  //   new Event(
  //     'change'
  //   )
  // );

  // await waitFor(
  //   '#industry-fields select,#industry-fields input'
  // );

  Object.entries(
    p.details||{}
  )

  .forEach(

  ([key,val])=>{

    const field=

    document
    .getElementById(
      'dyn-'+key
    );

    if(field){

      field.value=val;

      field.dispatchEvent(

        new Event(
          'change',
          {
            bubbles:true
          }
        )

      );

    }

  });

  set(
    'f-trigger',
    p.trigger
  );

  restoreAudience(p);

  restoreConsents(
    p.consents
  );

}

function replaceDownload(){

  const btn=

  document.getElementById(
    'btn-download-form'
  )

  ||

  document.getElementById(
    'btn-download-cta'
  );

  if(
    !btn
  ){
    return;
  }

  btn.innerHTML=
  'Save Revision';

  btn.onclick=
  async e=>{

    e.preventDefault();

    await saveRevision();

  };

}

window.addEventListener(

'load',

()=>{

  if(

    window.CONFIG

    &&

    IRA_DATA
    ?.share_url

  ){

    CONFIG.shareBaseUrl=
    IRA_DATA
    .share_url;

  }

});