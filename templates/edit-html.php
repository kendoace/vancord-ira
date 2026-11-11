<?php
$questions = ira_get_questions();
$quick_count = count(array_filter($questions, function ($q) {
  return !empty($q['quick']);
}));
$full_count = count($questions); ?>

<body>
  <div id="ira-loader" >
    <div class="ira-loader-inner" >
      <div class="ira-spinner"></div>
      <div>Loading assessment…</div>
    </div>
  </div>
  <div class="topbar">
    <div class="topbar-inner">
      <div class="brand">
        <a href="https://www.vancord.com" target="_blank" rel="noopener">
          <img src="https://www.vancord.com/wp-content/uploads/2025/06/vancord_horiz-logo-dkback.png" alt="Vancord" class="brand-logo" onerror="this.style.display='none';this.nextElementSibling.style.display='inline';">
          <span class="brand-logo-fallback">VANCORD</span>
        </a>
        <span class="brand-tag">
          <?php echo $is_short
            ? 'Incident Readiness Short Assessment'
            : 'Incident Readiness Assessment'; ?>
        </span>
      </div>
      <div class="topbar-counter"><b id="tc-answered">0</b>/<span id="tc-total"><?php echo $quick_count; ?></span> answered</div>
    </div>
  </div>
  <div class="shell container">
    <section class="ira-header">
      <div>
        <h1>Edit IRA</h1>
        <p class="lede">Review and edit the responses below</p>
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
            <button class="btn btn-primary" id="btn-calc" onclick="calculateAndShow()" disabled>See my results</button>
          </div>
        </div>
        <div class="answer-instructions" role="note" aria-label="How to answer the questionnaire">
          <span class="mark">✓</span>
          <div><strong>Select one answer per row.</strong> The empty square shows where to click or tab. A selected answer turns into a colored checkmark. Use the <strong>?</strong> icon beside a question when you need a short explanation.</div>
        </div>
        <table class="qtable" aria-describedby="ab-status-text">
          <caption class="sr-only">Incident readiness questionnaire. Select one answer per question row.</caption>
          <thead>
            <tr>
              <th>Question</th>
              <th class="col-ans">Yes</th>
              <th class="col-ans">Partial</th>
              <th class="col-ans">No</th>
              <th class="col-ans">Don't know</th>
              <th class="col-ans">N/A</th>
            </tr>
          </thead>
          <tbody id="qtable-body"></tbody>
        </table>
      </div>
      <div class="action-bar">
        <div class="ab-status"><span id="ab-status-text">Answer every question to see your readiness score.</span></div>
        <button class="btn btn-primary btn-large" id="btn-calc-bottom" onclick="calculateAndShow()" disabled>See my results</button>
      </div>
    </section>
    <section id="results-section">
      <div class="shared-banner" id="shared-banner">You are viewing a shared assessment result. <a href="#" onclick="resetAll();return false;">Take your own assessment →</a></div>
      <div class="results-head">
        <div>
          <div class="eyebrow">Your readiness score</div>
          <h2>Readiness Intelligence Brief</h2>
          <p id="results-intro">Use this as a conversation starter: it shows where readiness appears strongest, where it may fail first, and what to validate before this becomes an executive, insurance, legal, or operational problem.</p>
        </div>
      </div>
      <div class="report-grid">
        <div class="card score-card">
          <div class="score-circle">
            <svg viewBox="0 0 120 120"><circle class="sc-bg" cx="60" cy="60" r="52"></circle><circle class="sc-fg" id="sc-fg" cx="60" cy="60" r="52" stroke-dasharray="326.7" stroke-dashoffset="326.7"></circle></svg>
            <div class="score-num"><span class="sn-val" id="score-val">—</span><span class="sn-sub">out of 100</span></div>
          </div>
          <div class="tier-chip" id="tier-chip">—</div>
          <p class="score-explain" id="score-explain">This readiness score is a screening result, not an audit finding. It summarizes the current answers and should be validated against evidence.</p>
        </div>
        <div class="card snapshot">
          <h3>Executive snapshot</h3>
          <div class="tier-name" id="tier-name">—</div>
          <p id="tier-text">—</p>
          <div class="snapshot-copy-grid">
            <div class="snapshot-copy-card"><h4>What this score suggests</h4><p id="score-meaning">—</p></div>
            <div class="snapshot-copy-card"><h4>Where readiness may fail first</h4><p id="fail-first-text">—</p></div>
            <div class="snapshot-copy-card"><h4>How to start the internal conversation</h4><p id="escalation-text">—</p></div>
          </div>
          <div class="snapshot-panels">
            <div class="snapshot-panel"><h4>Conversation starter</h4><p id="conversation-text">—</p></div>
            <div class="snapshot-panel"><h4>First validation action</h4><p id="validation-text">—</p></div>
          </div>
          <div class="insight-grid" id="insight-grid"></div>
          <div class="snapshot-actions" id="snapshot-actions"></div>
        </div>
      </div>
      <div class="card wall-card">
        <div class="wall-head"><h3>Defense wall snapshot</h3><div class="wall-sub">Weakest-function prioritization</div></div>
        <p class="wall-lede">The wall is a prioritization heuristic. In incident readiness, the weakest operational function often determines where the response will break first. Use it to decide what to validate first, not as a mathematical proof of total risk.</p>
        <div class="wall-viz" id="wall-viz"></div>
        <p class="wall-caption" id="wall-caption">—</p>
      </div>
      <div class="card category-dashboard">
        <h3>Category dashboard</h3>
        <p class="method-note">These six functions follow the NIST Cybersecurity Framework structure. Use this dashboard to read each score as a diagnostic signal and as a prompt for the first validation conversation.</p>
        <div class="cat-cards" id="cat-cards"></div>
      </div>
      <div class="card gaps-card" id="gaps-card"><h3>Three areas to look at first</h3><div id="gaps-list"></div></div>
      <div class="card answer-log-card">
        <h3>Your answer log</h3>
        <p class="section-intro">This table shows every answer used to produce the score. It is intentionally kept in the on-page report so a reviewer can see the evidence trail before downloading or customizing anything.</p>
        <div class="table-scroll"><table class="answer-log-table" id="answer-log-table" aria-label="Assessment answer log"></table></div>
      </div>
      <div class="card presentation-guide-card">
        <h3>How to use this result internally</h3>
        <p class="section-intro" id="presentation-intro">Use the result as a disciplined way to begin a readiness conversation, not as a final audit conclusion.</p>
        <div class="present-grid" id="presentation-grid"></div>
      </div>
      <div class="report-options" id="report-options">
        <div class="options-head">
          <h3>Report options</h3>
          <p>The full on-page report is above. Use the options below only after you have reviewed the score, the weakest-function wall, the category explanations, the first three priorities, and the answer log. Complete your name, work email, organization name, and role to personalize the downloadable PDF report.</p>
        </div>
      <div class="cta-grid">
        <button class="cta-btn primary" onclick="scrollToCustomize()"><span class="ct-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></span><span class="ct-title">Review your information</span><span class="ct-desc">Complete contact details before generating your report.</span></button>
        <!-- <button class="cta-btn" id="btn-download-cta" onclick="downloadCustomReport()"><span class="ct-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg></span><span class="ct-title">Download report</span><span class="ct-desc">Checks required fields before generating.</span></button> -->
        <button class="cta-btn" onclick="openShare()"><span class="ct-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></span><span class="ct-title">Copy share link</span><span class="ct-desc">Share the basic result with a colleague.</span></button>
        <button class="cta-btn" onclick="redoAssessment()"><span class="ct-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15.5-6.2"/><path d="M18.5 3.8V8h-4.2"/><path d="M21 12a9 9 0 0 1-15.5 6.2"/><path d="M5.5 20.2V16h4.2"/></svg></span><span class="ct-title">Redo assessment</span><span class="ct-desc">Clear answers and start again.</span></button>
      </div>
      <div class="card form-card" id="customize-card">
        <h3>Before downloading your report</h3>
        <p class="intro">Provide your contact details so we can generate and deliver your assessment report.</p>
        <div class="form-grid">
          <div class="field"><label for="f-fullname">Full Name <span class="required-mark">*</span></label><input type="text" id="f-fullname" placeholder="Your full name" oninput="validateCustomForm()" aria-describedby="err-fullname"><div class="field-error" id="err-fullname" aria-live="polite"></div></div>
          <div class="field"><label for="f-email">Work Email <span class="required-mark">*</span></label><input type="email" id="f-email" placeholder="name@organization.com" oninput="validateCustomForm()" aria-describedby="err-email"><div class="field-error" id="err-email" aria-live="polite"></div></div>
          <div class="field"><label for="f-company">Organization Name <span class="required-mark">*</span></label><input type="text" id="f-company" placeholder="Organization or company" oninput="validateCustomForm()" aria-describedby="err-company"><div class="field-error" id="err-company" aria-live="polite"></div></div>
          <div class="field"><label for="f-role">Your Role in the Organization <span class="required-mark">*</span></label><select id="f-role" onchange="validateCustomForm()" aria-describedby="err-role"><option value="">Select your role</option><option value="Technical Contributor">Technical Contributor</option><option value="IT or Security Manager">IT or Security Manager</option><option value="Director or Department Head">Director or Department Head</option><option value="CISO or vCISO">CISO or vCISO</option><option value="Operations Leader">Operations Leader</option><option value="Finance, Risk, Legal, or Compliance">Finance, Risk, Legal, or Compliance</option><option value="Executive Leader">Executive Leader</option><option value="Board or Trustee Member">Board or Trustee Member</option><option value="External Advisor or Consultant">External Advisor or Consultant</option><option value="Other">Other</option></select><div class="field-error" id="err-role" aria-live="polite"></div></div>
        </div>
        <div class="consent-box">
          <h4>Communication Consents and Requests</h4>
          <p class="consent-sub">Select the communication options that apply. Privacy acknowledgement is required before the PDF can be generated. The other communication options are optional.</p>
          <div class="checkbox-grid" id="consent-checks" aria-describedby="err-privacy">
            <label class="check-tile"><input type="checkbox" id="c-followup" onchange="captureConsentTime();validateCustomForm()"><span><strong>Request analyst follow-up.</strong><br>I would like a Vancord analyst to contact me about these results.</span></label>
            <label class="check-tile"><input type="checkbox" id="c-guidance" onchange="captureConsentTime();validateCustomForm()"><span><strong>Send security and presentation guidance.</strong><br>Send me occasional incident readiness guidance, cybersecurity guidance, and practical advice on how to present this report inside my organization. I can unsubscribe at any time.</span></label>
            <label class="check-tile"><input type="checkbox" id="c-privacy" onchange="captureConsentTime();validateCustomForm()" aria-describedby="err-privacy"><span><strong>Privacy Policy acceptance.</strong><br>I confirm that I have read and understood Vancord's privacy notice.</span></label>
          </div>
          <div class="field-error" id="err-privacy" aria-live="polite"></div>
          <div class="form-actions">
            <p class="form-note" id="form-status">Complete the required fields marked with * before downloading your report.</p>
            <button class="btn btn-blue btn-large" id="btn-download-form" onclick="downloadCustomReport()">Download Report</button>
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
        <div class="tf-col">
          <h4>Offices</h4>
          <p><a href="https://maps.app.goo.gl/CMw9tukePWao8K917" target="_blank" rel="noopener">500 Boston Post Rd<br> Milford, CT 06460</a></p>
          <p style="margin-top:10px;"><a href="https://maps.app.goo.gl/amCbWiYCNRkeaQyt6" target="_blank" rel="noopener">180 Glastonbury Blvd, Suite 107<br>Glastonbury, CT 06033</a></p>
        </div>
        <div class="tf-col"><h4>Contact</h4><p><a href="mailto:sales@vancord.com">sales@vancord.com</a></p><p><a href="tel:2038749607">203.874.9607</a></p><p><a href="tel:8555124817">1-855-VANCORD</a></p></div>
        <div class="tf-col"><h4>24/7 Security Operations</h4><p>In an active incident?</p><p><a href="tel:8555124817" style="font-weight:800;color:#ffd47a;">1-855-VANCORD</a></p><p style="font-size:11px;color:rgba(255,255,255,.55);">855-512-4817</p></div>
      </div>
      <div class="tf-bottom"><div class="tf-meta">© <?php echo date('Y'); ?> Vancord · All rights reserved</div><div class="tf-meta">Built on the NIST Cybersecurity Framework</div></div>
    </div>
  </div>
</body>
<style>
#btn-download-form {
  background: var(--vc-blue);
  color: white;
  padding: 11px 20px;
  border-radius: 7px;
}
#btn-download-form:hover {
  background: var(--vc-blue-dark);
}
</style>
<script>

window.addEventListener(

'load',

()=>{

  if(
    !window.IRA_EDIT_MODE
  ){
    return;
  }

  showLoader();

  setTimeout(

    ()=>{

      if(
        typeof restoreMode==='function'
      ){
        restoreMode();
      }

      setTimeout(

        ()=>{

          if(
            typeof restoreAnswers==='function'
          ){
            restoreAnswers();
          }

          if(
            typeof calculateAndShow==='function'
          ){

            const oldScroll=
            Element
            .prototype
            .scrollIntoView;

            Element
            .prototype
            .scrollIntoView=
            function(){};

            calculateAndShow();

            setTimeout(

              ()=>{

                Element
                .prototype
                .scrollIntoView=
                oldScroll;

              },

              500

            );

          }

        },

        400

      );

      setTimeout(

        async()=>{

          if(
            typeof restoreCustomization==='function'
          ){
            await restoreCustomization();
          }

          if(
            typeof replaceDownload==='function'
          ){
            replaceDownload();
          }

          if(
            typeof renderRevisionHistory==='function'
          ){
            renderRevisionHistory();
          }

          hideLoader();

        },

        800

      );

    },

    300

  );

});

</script>