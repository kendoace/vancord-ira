<div class="ira-short-app">
<div class="topbar">
  <div class="topbar-inner">
    <div class="brand">
      <a href="https://www.vancord.com" target="_blank" rel="noopener">
        <img src="https://www.vancord.com/wp-content/uploads/2025/06/vancord_horiz-logo-dkback.png" alt="Vancord" class="brand-logo" onerror="this.style.display='none';this.nextElementSibling.style.display='inline';">
        <span class="brand-logo-fallback">VANCORD</span>
      </a>
      <span class="brand-tag">Incident Readiness Assessment</span>
    </div>
    <div class="topbar-counter"><b id="tc-answered">0</b>/<span id="tc-total">12</span> answered</div>
  </div>
</div>
<div class="shell">
  <section class="hero">
    <div class="hero-grid">
      <div>
        <div class="eyebrow">Self-screening across the six NIST CSF functions</div>
        <h1>How Ready Is Your IT Team for a Security Incident?</h1>
        <p class="lede">Answer 12 questions in three short stages. Get a readiness snapshot immediately, with no email required.</p>
      </div>
      <aside class="hero-panel">
        <h3>What this tool gives you</h3>
        <p>A short screening tool based on selected areas of NIST CSF 2.0. Not a formal cybersecurity audit.</p>
        <ul>
          <li>No email required to see the basic score.</li>
          <li>You can request a customized PDF report afterward.</li>
          <li>Complete the assessment before deciding whether to request a report.</li>
        </ul>
      </aside>
    </div>
  </section>
  <section id="assess-section">
    <div class="assess-block">
      <div class="assess-toolbar">
        <div class="toolbar-progress">
          <span><b id="progress-count">0</b> of <span id="progress-total">12</span> answered</span>
          <div class="progbar"><div class="progbar-fill" id="progbar-fill"></div></div>
        </div>
        <div class="toolbar-actions">
          <button class="btn btn-ghost" onclick="resetAnswers()">Reset</button>
          <button class="btn btn-primary" id="btn-calc" onclick="calculateAndShow()" disabled hidden>See my results</button>
        </div>
      </div>

<div class="deck-steps" id="deck-steps" aria-label="Assessment stages"></div>
<div class="deck-intro">
  <p id="stage-description">Know your plans, assets, and exposure.</p>
  <div class="mobile-pips" id="mobile-pips" role="group" aria-label="Position within this stage"></div>
</div>
<div class="question-cards" id="qcards" aria-live="off"></div>
<div class="desktop-question-matrix" id="desktop-question-matrix" aria-live="polite"></div>
<p class="deck-hint">Choose the answer that best describes your organization today. Select <b>Why it matters</b> to turn over a card for context. There are no comment boxes.</p>
    </div>

  <div class="action-bar card-action-bar">
    <button type="button" class="btn btn-ghost" id="btn-stage-back" onclick="stageBack()" disabled>← Previous step</button>
    <div class="ab-status"><span id="ab-status-text" role="status" aria-live="polite">Answer four questions to continue.</span></div>
    <div class="stage-actions">
      <button type="button" class="btn btn-primary btn-large" id="btn-stage-next" onclick="stageNext()" disabled>Next step →</button>
      <button type="button" class="btn btn-primary btn-large" id="btn-calc-bottom" onclick="calculateAndShow()" disabled hidden>See my results →</button>
    </div>
    <div class="mobile-card-nav">
      <button type="button" class="btn btn-ghost" id="btn-mobile-prev" onclick="moveMobileQuestion(-1)" disabled>← Back</button>
      <button type="button" class="btn btn-primary" id="btn-mobile-next" onclick="moveMobileQuestion(1)" disabled>Next question →</button>
    </div>
    <button type="button" class="mobile-reset" onclick="resetAnswers()">Reset answers</button>
  </div>
</section>
  <section id="results-section">
    <div class="shared-banner" id="shared-banner">You are viewing a shared assessment result. <a href="#" onclick="resetAll();return false;">Take your own assessment →</a></div>

    <!-- 1. Integrated executive summary: readiness tier, circular score, explanation, and decision guidance. -->
    <article class="card executive-report" aria-labelledby="executive-heading">
      <header class="executive-report-head">
        <div class="eyebrow">Your incident readiness result</div>
        <h2 id="executive-heading">Executive Summary</h2>
      </header>
      <div class="executive-overview">
        <div class="executive-tier">
          <div class="executive-tier-label">Overall readiness</div>
          <div class="tier-name" id="tier-name">—</div>
          <p class="tier-description" id="tier-text">—</p>
        </div>
        <div class="executive-dial" aria-label="Overall readiness score out of 100">
          <div class="score-circle">
            <svg viewBox="0 0 120 120" aria-hidden="true"><circle class="sc-bg" cx="60" cy="60" r="52"></circle><circle class="sc-fg" id="sc-fg" cx="60" cy="60" r="52" stroke-dasharray="326.7" stroke-dashoffset="326.7"></circle></svg>
            <div class="score-num"><span class="sn-val" id="score-val">—</span><span class="sn-sub">out of 100</span></div>
          </div>
        </div>
      </div>
      <p class="screening-disclaimer">A screening result based on your answers, not a verified audit or a prediction of incident outcomes. Validate priorities with supporting evidence.</p>
      <div class="executive-narrative">
        <section class="executive-story" aria-labelledby="meaning-heading">
          <h3 id="meaning-heading">What this score means</h3>
          <p id="score-meaning">—</p>
        </section>
        <section class="executive-story" aria-labelledby="weak-link-heading">
          <h3 id="weak-link-heading">Which is the weakest link?</h3>
          <p id="fail-first-text">—</p>
        </section>
        <section class="executive-story" aria-labelledby="internal-support-heading">
          <h3 id="internal-support-heading">How to get internal support</h3>
          <p id="escalation-text">—</p>
          <div class="support-actions">
            <div class="support-tip"><h4>Conversation starter</h4><p id="conversation-text">—</p></div>
            <div class="support-tip"><h4>First validation step</h4><p id="validation-text">—</p></div>
          </div>
        </section>
      </div>
    </article>

    <!-- 2. Retain the existing six-plank visual. Function cards are available as details. -->
    <section class="card wall-card" aria-labelledby="defense-wall-heading">
      <div class="wall-head"><h3 id="defense-wall-heading">Your Organization’s IT Defense Wall</h3></div>
      <p class="wall-lede">Each plank represents one NIST CSF function. The shortest plank is a prompt for where to validate readiness first—not proof that an incident will fail there.</p>
      <div class="wall-viz" id="wall-viz"></div>
      <p class="wall-caption" id="wall-caption">—</p>
      <details class="report-disclosure category-dashboard">
        <summary>See the six-function score breakdown</summary>
        <p class="method-note">These six functions follow the NIST Cybersecurity Framework structure. Each score is a screening signal based on a limited set of answers, not a complete function-maturity assessment.</p>
        <div class="cat-cards" id="cat-cards"></div>
      </details>
    </section>

    <!-- 3. No repeat of priorities inside the executive summary. -->
    <section class="card gaps-card" id="gaps-card" aria-labelledby="gaps-heading">
      <h3 id="gaps-heading">Three Areas to Start First</h3>
      <div id="gaps-list"></div>
    </section>

    <!-- 4. Actionable internal-use guidance; raw answers available on demand. -->
    <section class="card presentation-guide-card" aria-labelledby="use-assessment-heading">
      <h3 id="use-assessment-heading">How to Best Use This Assessment</h3>
      <p class="section-intro" id="presentation-intro">Use the result as a disciplined way to begin a readiness conversation, not as a final audit conclusion.</p>
      <div class="present-grid" id="presentation-grid"></div>
      <details class="report-disclosure answer-log-card">
        <summary>Review your 12 assessment answers</summary>
        <p class="section-intro">These are the answers used to generate your score. Review the evidence trail before treating any recommendation as settled.</p>
        <div class="table-scroll"><table class="answer-log-table" id="answer-log-table" aria-label="Assessment answer log"></table></div>
      </details>
    </section>

    <!-- 5. Existing report and PDF customization functions remain below. -->
    <div class="report-options" id="report-options">
      <div class="options-head">
        <div class="report-kicker">Your next step</div>
        <h3>How to Get More From This Result</h3>
        <p class="report-lead">You found the weak spots. Now get the support to address them.</p>
        <p>Security gaps are easier to spot than to fix—especially when you need leadership buy-in. Tell us your role, your organization’s context, and who needs to support the decision. We’ll tailor a downloadable brief that explains the risks, priorities, and practical next steps, so you can make the case for better protection without carrying every security concern alone.</p>
        <button class="report-primary-cta" type="button" onclick="scrollToCustomize()">Build my internal case <span aria-hidden="true">→</span></button>
        <p class="report-qualifier">A useful starting point for a discussion—not a verified audit or a promise of risk-free operations.</p>
      </div>

      <div class="cta-grid" role="group" aria-label="Report actions">
        <button class="cta-btn" id="btn-download-cta" type="button" onclick="requestReportDownload()" aria-label="Download report; complete customization details first"><span class="ct-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg></span><span class="ct-title">Download</span></button>
        <button class="cta-btn" type="button" onclick="openShare()" aria-label="Copy a link to your assessment results"><span class="ct-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></span><span class="ct-title">Share</span></button>
        <button class="cta-btn" type="button" onclick="redoAssessment()" aria-label="Redo the assessment"><span class="ct-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15.5-6.2"/><path d="M18.5 3.8V8h-4.2"/><path d="M21 12a9 9 0 0 1-15.5 6.2"/><path d="M5.5 20.2V16h4.2"/></svg></span><span class="ct-title">Redo</span></button>
      </div>

      <div class="card form-card" id="customize-card">
        <div class="form-intro-head">
          <div>
            <div class="form-kicker">Make it useful beyond IT</div>
            <h3>Build a report your decision-makers can use</h3>
            <p class="intro">Four short steps. Tell us about your role, organization, and decision-makers, then review your preferences and get your tailored brief.</p>
          </div>
          <div class="form-mini-label">4 short sections</div>
        </div>
        <div class="customize-tabs" role="tablist" aria-label="Report customization sections" onkeydown="handleCustomizeTabKey(event)">
          <button type="button" class="customize-tab active" id="ctx-tab-role" role="tab" aria-label="Your Role" aria-controls="ctx-panel-role" aria-selected="true" tabindex="0" onclick="selectCustomizeTab('role')"><span class="tab-seq">01</span><span class="tab-long">Your Role</span><span class="tab-short">Role</span></button>
          <button type="button" class="customize-tab" id="ctx-tab-org" role="tab" aria-label="Your Organization" aria-controls="ctx-panel-org" aria-selected="false" tabindex="-1" onclick="selectCustomizeTab('org')"><span class="tab-seq">02</span><span class="tab-long">Your Organization</span><span class="tab-short">Organization</span></button>
          <button type="button" class="customize-tab" id="ctx-tab-team" role="tab" aria-label="Your Team" aria-controls="ctx-panel-team" aria-selected="false" tabindex="-1" onclick="selectCustomizeTab('team')"><span class="tab-seq">03</span><span class="tab-long">Your Team</span><span class="tab-short">Team</span></button>
          <button type="button" class="customize-tab" id="ctx-tab-finish" role="tab" aria-label="Get Your Report / Download" aria-controls="ctx-panel-finish" aria-selected="false" tabindex="-1" onclick="selectCustomizeTab('finish')"><span class="tab-seq">04</span><span class="tab-long">Get Your Report</span><span class="tab-short">Download</span></button>
        </div>
        <div class="context-panel" id="ctx-panel-role" role="tabpanel" aria-labelledby="ctx-tab-role" tabindex="0">
          <p class="panel-intro">First, who will be presenting this result?</p>
          <div class="form-grid">
            <div class="field"><label for="f-fullname">Your name <span class="req">*</span></label><input type="text" id="f-fullname" autocomplete="name" placeholder="Your full name" oninput="validateCustomForm()"></div>
            <div class="field"><label for="f-email">Work email <span class="req">*</span></label><input type="email" id="f-email" autocomplete="email" placeholder="name@organization.com" oninput="validateCustomForm()"></div>
            <div class="field full"><label for="f-role">Your role <span class="req">*</span></label><select id="f-role" onchange="validateCustomForm()"><option value="">Select your role</option><option value="Technical Contributor">Technical Contributor</option><option value="IT or Security Manager">IT or Security Manager</option><option value="Director or Department Head">Director or Department Head</option><option value="CISO or vCISO">CISO or vCISO</option><option value="Operations Leader">Operations Leader</option><option value="Finance, Risk, Legal, or Compliance">Finance, Risk, Legal, or Compliance</option><option value="Executive Leader">Executive Leader</option><option value="Board or Trustee Member">Board or Trustee Member</option><option value="External Advisor or Consultant">External Advisor or Consultant</option><option value="Other">Other</option></select></div>
          </div>
          <button type="button" class="panel-next" onclick="selectCustomizeTab('org',true)">Next: Your Organization <span aria-hidden="true">→</span></button>
        </div>
        <div class="context-panel" id="ctx-panel-org" role="tabpanel" aria-labelledby="ctx-tab-org" tabindex="0" hidden>
          <p class="panel-intro">A little context helps us avoid generic recommendations.</p>
          <div class="form-grid">
            <div class="field"><label for="f-company">Organization name <span class="req">*</span></label><input type="text" id="f-company" autocomplete="organization" placeholder="Organization or company" oninput="validateCustomForm()"></div>
            <div class="field"><label for="f-industry">Industry <span class="req">*</span></label><select id="f-industry" onchange="updateIndustryFields();validateCustomForm()"><option value="">Select industry</option><option value="Education">Education</option><option value="Manufacturing">Manufacturing</option><option value="Public Sector">Public Sector</option><option value="Healthcare">Healthcare</option><option value="Financial Services">Financial Services</option><option value="Nonprofit">Nonprofit</option><option value="Other">Other</option></select></div>
            <div class="field full"><label for="f-trigger">What prompted this review now? <span class="optional">(optional)</span></label><select id="f-trigger" onchange="validateCustomForm()"><option value="">Select the closest reason</option><option>General readiness review</option><option>Recent security incident or near miss</option><option>Insurance renewal or questionnaire</option><option>Audit, compliance, or customer requirement</option><option>Board or executive request</option><option>Budget planning</option><option>Vendor or service evaluation</option><option>Other</option></select></div>
            <div class="field full" id="industry-fields"></div>
          </div>
          <button type="button" class="panel-next" onclick="selectCustomizeTab('team',true)">Next: Your Team <span aria-hidden="true">→</span></button>
        </div>
        <div class="context-panel" id="ctx-panel-team" role="tabpanel" aria-labelledby="ctx-tab-team" tabindex="0" hidden>
          <p class="panel-intro">Who needs to be on your side to make security improvements happen?</p>
          <p class="panel-help">Choose the people who will review, approve, fund, or help implement the next step. We'll make their priorities easier to address in your PDF. <span class="req">*</span></p>
          <div class="checkbox-grid" id="audience-checks">
            <label class="check-tile"><input type="checkbox" name="audience" value="Manager" onchange="validateCustomForm()"><span>Direct manager or supervisor</span></label>
                  <label class="check-tile"><input type="checkbox" name="audience" value="IT and Security Leadership" onchange="validateCustomForm()"><span>IT and security leadership</span></label>
                  <label class="check-tile"><input type="checkbox" name="audience" value="Executive Leadership" onchange="validateCustomForm()"><span>Executive leadership</span></label>
                  <label class="check-tile"><input type="checkbox" name="audience" value="Finance, Risk, Legal, and Insurance" onchange="validateCustomForm()"><span>Finance, risk, legal, or insurance</span></label>
                  <label class="check-tile"><input type="checkbox" name="audience" value="Board or Trustees" onchange="validateCustomForm()"><span>Board or trustees</span></label>
            <label class="check-tile check-select-all"><input type="checkbox" id="aud-select-all" onchange="toggleAudienceAll(this)"><span>Select all perspectives</span></label>
          </div>
          <p class="team-footnote">The goal is a practical internal conversation—not a generic pitch for more tools.</p>
          <button type="button" class="panel-next" onclick="selectCustomizeTab('finish',true)">Next: Get Your Report <span aria-hidden="true">→</span></button>
        </div>

        <div class="context-panel" id="ctx-panel-finish" role="tabpanel" aria-labelledby="ctx-tab-finish" tabindex="0" hidden>
          <p class="panel-intro">You're ready to make your results easier to discuss internally.</p>
          <p class="panel-help">Review your choices below. We’ll use them to tailor the report to the people who need to understand your next steps.</p>
          <div class="report-review" id="ctx-review" aria-live="polite"></div>
          <div class="consent-box">
          <h4>Before you download</h4>
          <p class="consent-sub">Review <a href="https://www.vancord.com/privacy-policy/" target="_blank" rel="noopener">Vancord’s privacy notice</a> before continuing. Follow-up and marketing requests are separate and optional.</p>
          <div class="checkbox-grid consent-checks">
            <label class="check-tile"><input type="checkbox" id="c-privacy" onchange="captureConsentTime();validateCustomForm()"><span><strong>I have reviewed Vancord's privacy notice.</strong> <em>(required)</em></span></label>
            <label class="check-tile"><input type="checkbox" id="c-followup" onchange="captureConsentTime();validateCustomForm()"><span><strong>I'd like an analyst to contact me</strong> about these results.</span></label>
            <label class="check-tile"><input type="checkbox" id="c-guidance" onchange="captureConsentTime();validateCustomForm()"><span><strong>Send me occasional guidance</strong> on incident readiness and presenting the findings. I can unsubscribe at any time.</span></label>
          </div>
          <div class="form-actions">
            <p class="form-note" id="form-status" role="status" aria-live="polite">Confirm your details and privacy preferences to create your PDF.</p>
            <button class="btn btn-blue btn-large" type="button" id="btn-download-form" onclick="requestReportDownload()" disabled>Download my decision brief</button>
          </div>
          <p class="prototype-note">Prototype: PDF generation runs in your browser. This version does not submit your details to Vancord.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
<div class="trust-foot">
  <div class="tf-inner">
    <div class="tf-top">
      <div class="tf-col"><div class="tf-brand">VANCORD</div><p>Trusted IT and cybersecurity partner for New England organizations since 2005.</p></div>
      <div class="tf-col"><h4>Offices</h4><p>500 Boston Post Rd<br>Milford, CT 06460</p><p style="margin-top:10px;">180 Glastonbury Blvd, Suite 107<br>Glastonbury, CT 06033</p></div>
      <div class="tf-col"><h4>Contact</h4><p><a href="mailto:sales@vancord.com">sales@vancord.com</a></p><p><a href="tel:2038749607">203.874.9607</a></p><p><a href="tel:8555124817">1-855-VANCORD</a></p></div>
      <div class="tf-col"><h4>24/7 Security Operations</h4><p>In an active incident?</p><p><a href="tel:8555124817" style="font-weight:800;color:#ffd47a;">1-855-VANCORD</a></p><p style="font-size:11px;color:rgba(255,255,255,.55);">855-512-4817</p></div>
    </div>
    <div class="tf-bottom"><div class="tf-meta">© 2026 Vancord · All rights reserved</div><div class="tf-meta">Built on the NIST Cybersecurity Framework</div></div>
  </div>
</div>

</div>
