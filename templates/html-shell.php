<?php
$is_short = get_query_var('ira_page') === 'assessment-short';

$questions = ira_get_questions();
$quick_count = count(array_filter($questions, function ($q) {
  return !empty($q['quick']);
}));
$full_count = count($questions); ?>

<script>
window.iraConfig = {
    assessment: '<?php echo $is_short ? 'assessment-short' : 'assessment'; ?>'
};

window.IRA_QUESTIONS = <?php echo wp_json_encode($questions); ?>;
</script>

<body>
  <div class="page-content">

  <?php if (!$is_short) { ?>

    <!-- HEADER -->
    <header role="banner" class="site">
        <div class="new-container new-row">
            <a href="#top" class="logo">
                <img src="https://www.vancord.com/wp-content/uploads/2022/03/vancord-logo.svg" alt="Vancord" class="site-logo">
            </a>
            <a href="#assessment" class="btn btn-accent">Start the Full Assessment</a>
        </div>
    </header>

    <section id="top" class="hero has-overlay has-overlay-image pt-6 pb-6" style="background-color: rgb(4,52,90);">
      <img class="hero-bg" src="https://www.vancord.com/wp-content/uploads/2026/08/vancord-ira-page-hero-section-v2.jpg" alt="vancord ira page hero section bg" width="1920" height="1080" fetchpriority="high" loading="eager" decoding="async">
      <div class="absolute-hero"></div>
      <div class="wrapper">
        <div class="container">
          <div class="align-center">
            <div class="above-title mb-3 animated fade-in"><div class="above-title-inner">Free Incident Readiness Assessment. Aligned to the NIST Cybersecurity Framework.</div></div>
            <h1 class="page-title pb-3 animated fade-in">Every organization thinks it's ready for an incident. <span style="color: #9ce311"><br>Most have never actually checked.</span></h1>
            <div class="description pb-5 animated fade-in">
              <p>
                <i>Find out where your organization really stands across all six NIST CSF categories , before an incident answers the question for you. It is free, it takes minutes, and no email is required to see your score.</i>
              </p>
            </div>
            <div class="hero-button pb-2 animated fade-in">
              <a href="#assessment" data-location="hero" class="default">Start the Full Assessment</a>
              <a class="default btn-white assessment-cta" data-location="hero" href="#contact-form">Book a 30-Minute Call</a>
            </div>
                        
            <div class="bellow-button animated fade-in">
              <small style="font-weight: 300"><i>No software to install. No email required to see your score. No obligation. We don’t require you to provide contact information, but are happy to answer questions you have once you’ve reviewed your report.</i></small>
            </div>
                                                
          </div>

        </div>
      </div>
    </section>

    <section id="flip-boxes" class="content-flipboxes" style="background-repeat: no-repeat; background-size: cover; ">
      <div class="wrapper pt-6 pb-6">
        <div class="container">
          <p class="align-center small-title has-light-blue-color animated fade-in">What it measures</p>
          <h2 class="align-center bottom-image has-primary-color animated fade-in">Readiness is not one thing. It is six.</h2>
          <div class="description animated fade-in pb-4">
            <p style="text-align: center;font-size: 20px;line-height: 1.6;font-style: normal">A weakness in any one function is where an incident finds room to grow. The assessment scores each one, so you see not just whether you are ready, but where you are not.</p>
          </div>
          <div class="flipbox-grid flipbox-grid-3 animated fade-in">
            <div class="flipbox-item">
              <div class="flipbox-item-inner">
                <div class="flipbox-item-front">
                  <div class="flipbox-item-icon">
                    <img src="https://www.vancord.com/wp-content/uploads/2026/08/govern-icon.png" alt="govern icon">
                  </div>
                  <h4 class="flipbox-item-title">Govern</h4>
                </div>
                <div class="flipbox-item-back">
                  <div class="flipbox-item-excerpt">Policies, ownership, and accountability. A tested incident response plan, defined roles, and the compliance obligations that apply to you.</div>
                </div>
              </div>
            </div>
            <div class="flipbox-item">
              <div class="flipbox-item-inner">
                  <div class="flipbox-item-front">
                      <div class="flipbox-item-icon"><img src="https://www.vancord.com/wp-content/uploads/2026/08/identify-icon.png" alt="identify icon"></div>
                      <h4 class="flipbox-item-title">Identify</h4>
                  </div>
                  <div class="flipbox-item-back">
                      <div class="flipbox-item-excerpt">Knowing what you protect. Asset inventory, data flows, third-party risk, and independent penetration testing.</div>
                  </div>
              </div>
            </div>
            <div class="flipbox-item">
                <div class="flipbox-item-inner">
                    <div class="flipbox-item-front">
                        <div class="flipbox-item-icon"><img src="https://www.vancord.com/wp-content/uploads/2026/08/Protect-icon.png" alt="Protect icon"></div>
                        <h4 class="flipbox-item-title">Protect</h4>
                    </div>
                    <div class="flipbox-item-back">
                        <div class="flipbox-item-excerpt">The safeguards that keep incidents from starting. MFA, EDR or MDR, training, encryption, segmentation, and isolated backups.</div>
                    </div>
                </div>
            </div>
            <div class="flipbox-item">
                <div class="flipbox-item-inner">
                    <div class="flipbox-item-front">
                        <div class="flipbox-item-icon"><img src="https://www.vancord.com/wp-content/uploads/2026/08/Detect-icon.png" alt="Detect icon"></div>
                        <h4 class="flipbox-item-title">Detect</h4>
                    </div>
                    <div class="flipbox-item-back">
                        <div class="flipbox-item-excerpt">Whether you would see it. Centralized logging and SIEM, vulnerability scanning, and privileged-account monitoring.</div>
                    </div>
                </div>
            </div>
            <div class="flipbox-item">
                <div class="flipbox-item-inner">
                    <div class="flipbox-item-front">
                        <div class="flipbox-item-icon"><img src="https://www.vancord.com/wp-content/uploads/2026/08/Respond-icon.png" alt="Respond icon"></div>
                        <h4 class="flipbox-item-title">Respond</h4>
                    </div>
                    <div class="flipbox-item-back">
                        <div class="flipbox-item-excerpt">Whether you can act under pressure. Tabletop exercises with assigned roles, and a clear communication protocol.</div>
                    </div>
                </div>
            </div>
            <div class="flipbox-item">
                <div class="flipbox-item-inner">
                    <div class="flipbox-item-front">
                        <div class="flipbox-item-icon"><img src="https://www.vancord.com/wp-content/uploads/2026/08/Recover-icon.png" alt="Recover icon"></div>
                        <h4 class="flipbox-item-title">Recover</h4>
                    </div>
                    <div class="flipbox-item-back">
                        <div class="flipbox-item-excerpt">Whether you can get back up. Tested and offsite backups, cyber liability coverage, and access to counsel.</div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="stage-footer">
      <p>You see not just whether you are ready, but exactly where you are not.</p>
    </div>

    <section class="text-image pt-5 pb-5">
        <div class="wrapper">
            <div class="container">
                <div class="row">
                  <div class="col-lg-6 vertical-align">
                    <div class="animated slide-in-left">
                      <p class="small-title has-light-blue-color animated fade-in">What you get</p>
                      <div class="description" style="font-size: 18px;">
                        <h2><span style="color: #04345a">You walk away with something usable.</span></h2>
                        <p>This is not a quiz that thanks you and disappears.</p>
                      </div>
                      <ul class="key-list mt-4">
                        <li><div class="key-icon"><img src="https://www.vancord.com/wp-content/uploads/2025/05/checkmark-fill-icon.png" alt="checkmark fill icon"></div><div class="key-content"><p><strong>Your readiness score, immediately.</strong> Rated across all six functions, on screen, the moment you finish.</p>
                        </div></li>
                        <li><div class="key-icon"><img src="https://www.vancord.com/wp-content/uploads/2025/05/checkmark-fill-icon.png" alt="checkmark fill icon"></div><div class="key-content"><p><strong>A report for internal review.</strong> Add your role and industry and download a customized PDF for leadership, a board, an auditor, or an insurer.</p>
                        </div></li>
                        <li><div class="key-icon"><img src="https://www.vancord.com/wp-content/uploads/2025/05/checkmark-fill-icon.png" alt="checkmark fill icon"></div><div class="key-content"><p><strong>Clear next steps.</strong> The report moves your team from vague concern to a specific conversation about ownership, priorities, and what to do next.</p>
                        </div></li>
                        <li><div class="key-icon"><img src="https://www.vancord.com/wp-content/uploads/2025/05/checkmark-fill-icon.png" alt="checkmark fill icon"></div><div class="key-content"><p><strong>Optional guided walkthrough.</strong> Prefer not to go it alone? A Vancord analyst can complete the full assessment with you, answer questions, and help interpret the results. No obligation.</p>
                        </div></li>
                      </ul>
                      <a href="#assessment" class="default mt-4">Start the Full Assessment</a>
                    </div>

                  </div>
                  <div class="col-lg-6 vertical-align">
                      <div class="animated slide-in-right">
                          <div class="image-full mt-lg-0 mt-4"><img src="https://www.vancord.com/wp-content/uploads/2026/08/what-you-get-vancord-ira-report-3d-view.png" alt="what you get - vancord ira report 3d view"></div>
                      </div>
                  </div>
                </div>
            </div>
        </div>
    </section>

    <section id="contact-form" class="text-image pt-6 pb-6 wrapper">
      <div class="container">
        <div class="form-content pb-4 animated fade-in" style="font-size: 18px;">
          <h2 class="align-center bottom-image-accent has-white-color mb-4">Rather Have Someone Walk It Through With You?</h2>
          <h4 style="text-align: center;margin-bottom: 3rem"><em><span style="color: var(--white)">The full assessment is 60 questions and about fifteen minutes. If you'd rather not do it alone, or would rather skip it and just talk, book 30 minutes with Jason Pufahl, Vancord's VP of Security. He can walk the assessment with you, or talk through your incident readiness directly. No demo, no system access, no obligation.</span></em></h4>
          <div class="meetings-iframe-container" data-src="https://meetings.hubspot.com/jpufahl/mdr-discussion?embed=true"><iframe src="https://meetings.hubspot.com/jpufahl/mdr-discussion?embed=true&amp;parentHubspotUtk=caea63670dfe9afa49544f1f19a72d04&amp;parentPageUrl=https://www.vancord.com/vantage-mdr-offer/" width="100%" data-hs-ignore="true" style="min-width: 312px; min-height: 615px; height: 715px; border-width: medium; border-style: none; border-color: currentcolor; border-image: none;"></iframe></div>
        </div>
      </div>
    </section>
    <style type="text/css">
      section#contact-form {
        position: relative;
        overflow: hidden;
        background-repeat: no-repeat;
        background-image: url(https://www.vancord.com/wp-content/uploads/2025/05/line-pattern-right-1.svg);
        background-position: right bottom;
        background-size: auto;
      }
      section#contact-form:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-image: linear-gradient(45deg, rgb(10, 24, 51) 0%, rgb(17, 54, 88) 100%);
        border-radius: 30px;
        z-index: -1;
      }
    </style>

    <section id="blurb" class="content-blurb" style="background-color: #fafbfe;">
      <div class="wrapper pt-6 pb-6">
        <div class="container">
          <p class="align-center small-title has-primary-color animated fade-in">Why Vancord</p>
          <h2 class="align-center has-primary-color animated fade-in">Built by a team that has been doing this for twenty years.</h2>
          <div class="description animated fade-in pb-4">
            <p style="text-align: center">The assessment is grounded in the same incident response and security operations work Vancord has run for New England organizations since 2005. The people who read your results are the people who respond when something actually happens.</p>
          </div>
          <div class="blurb-grid blurb-grid-4 animated fade-in">

            <div class="blurb-item">
              <div class="blurb-item-content align-center">
                <img src="https://www.vancord.com/wp-content/uploads/2026/08/cmmc-registered-practitioner-organization-icon-1.png" alt="cmmc registered practitioner organization icon">
                <h4 class="blurb-title mt-3 mb-3">CMMC Registered Practitioner Organization</h4>
                <div class="blurb-description">Credentialed for NIST 800-171 monitoring and incident response controls.</div>
              </div>
            </div>
            
            <div class="blurb-item">
              <div class="blurb-item-content align-center">
                <img src="https://www.vancord.com/wp-content/uploads/2026/08/msp-501-honoree-icon-1.png" alt="msp 501 honoree icon">
                <h4 class="blurb-title mt-3 mb-3">MSP 501 Honoree</h4>
                <div class="blurb-description">Recognized among the top managed service providers globally.</div>
              </div>
            </div>

            
            <div class="blurb-item">
              <div class="blurb-item-content align-center">
                <img src="https://www.vancord.com/wp-content/uploads/2026/08/20-years-in-new-england-icon.png" alt="20 years in new england icon">
                <h4 class="blurb-title mt-3 mb-3">20+ Years in New England</h4>
                <div class="blurb-description">Same founding clients. Same founding engineers. Local accountability.</div>
              </div>
            </div>

            
            <div class="blurb-item">
              <div class="blurb-item-content align-center">
                <img src="https://www.vancord.com/wp-content/uploads/2026/08/cybersound-podcast-icon-1.png" alt="cybersound podcast icon">
                <h4 class="blurb-title mt-3 mb-3">CyberSound Podcast</h4>
                <div class="blurb-description">Vancord's ongoing public work on security operations and incident response.</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>

    <section class="rounded-border">
      <img class="rounded-border-bg" src="https://www.vancord.com/wp-content/uploads/2026/08/vancord-ira-page-cta-section-v2.jpg" alt="vancord ira page cta section">
      <div class="wrapper">
        <div class="container">
          <div class="rounded-border-wrapper has-overlay align-center pt-5 pb-5">
            <div class="rounded-border-content">
              <h2 class="page-title has-accent-color pb-3 animated fade-in"> Find out how ready you are before something forces the answer.</h2>
              <div class="description pb-5 animated fade-in">Start with the free assessment. See your readiness score across all six NIST functions in minutes, no email required to see it, and get a report you can act on.</div>
              <div class="top-rounded-bot-border-button pb-2 animated fade-in">
                <a href="#assessment" class="default">Start the Full Assessment</a>
              </div>
              <div class="has-white-color description animated fade-in">Short on time? <a href="/assessment" target="_blank" class="has-white-color"><strong style="text-decoration: underline;">Take the 2-minute Quick Read.</strong></a></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="faq" class="faq-section pt-5 pb-5" style="position: relative; background-color: #fafbfe;">
      <div class="wrapper">
        <div class="container">
          <div class="align-center animated fade-in pb-4">
            <h2 class="has-primary-color">Questions people ask before starting</h2>
          </div>
          <ul class="faq-list animated fade-in">

            <li class="faq-item">
              <button class="faq-question" aria-expanded="false">Is the assessment really free?<i class="fa-solid fa-angle-down"></i></button>
              <div class="faq-answer">Yes. It is free and self-service. You answer the questions in your browser and see your readiness score right away. No demo, no slideware, no high-pressure follow-up.</div>
            </li>
            
            <li class="faq-item">
              <button class="faq-question" aria-expanded="false">What is the difference between the Quick Read and the Full Assessment?<i class="fa-solid fa-angle-down"></i></button>
              <div class="faq-answer">The Quick Read is 12 questions, about two minutes, and gives you a fast gut-check across the six functions. The Full Assessment is 60 questions, about fifteen minutes, and produces a detailed report you can act on. Most teams that want something usable choose the full version.</div>
            </li>
            
            <li class="faq-item">
              <button class="faq-question" aria-expanded="false">Do I need to install anything or give you access to our systems?<i class="fa-solid fa-angle-down"></i></button>
              <div class="faq-answer">No. It is a self-reported questionnaire, not a technical audit. Nothing is installed, no agents, no system access, and no NDA required.</div>
            </li>
            
            <li class="faq-item">
              <button class="faq-question" aria-expanded="false">Do I have to provide my email?<i class="fa-solid fa-angle-down"></i></button>
              <div class="faq-answer">No email is required to see your basic readiness score. If you would like the customized PDF report, we ask for delivery details so we can send it to you.</div>
            </li>
            
            <li class="faq-item">
              <button class="faq-question" aria-expanded="false">What framework is this based on?<i class="fa-solid fa-angle-down"></i></button>
              <div class="faq-answer">The NIST Cybersecurity Framework and its six functions: Govern, Identify, Protect, Detect, Respond, and Recover. It is the same structure your auditors, insurers, and regulators already use.</div>
            </li>
            
            <li class="faq-item">
              <button class="faq-question" aria-expanded="false">Will I get a report I can share with leadership?<i class="fa-solid fa-angle-down"></i></button>
              <div class="faq-answer">Yes. The full assessment produces a customized PDF, written in plain language, built for leadership, board, audit, and insurance review.</div>
            </li>
            
            <li class="faq-item">
              <button class="faq-question" aria-expanded="false">Can someone from Vancord help me complete it?<i class="fa-solid fa-angle-down"></i></button>
              <div class="faq-answer">Yes. On the full assessment, a Vancord analyst can walk through the questions with you, answer anything unclear, and help interpret your results. It is optional, with no obligation to go further.</div>
            </li>

          </ul>
        </div>
      </div>
    </section>

    <section id="self_screening">
      <div class="wrapper pt-5 pb-5">
        <div class="container">
          <p class="align-center small-title has-secondary-color animated fade-in">Self-screening across the six NIST CSF functions</p>
          <h2 class="align-center animated fade-in">How ready are you the day something goes wrong?</h2>
          <div class="description animated fade-in">
            <p style="text-align: center">Screen your incident readiness across the six NIST CSF functions: <strong>Govern, Identify, Protect, Detect, Respond,</strong> and <strong>Recover</strong>. See your score in minutes, then add your role and industry for a report you can take to your team.</p>
          </div>
        </div>
      </div>
    </section>

  <?php } else { ?>

    <div class="topbar">
      <div class="container">
        <div class="topbar-inner">
          <div class="brand">
            <a href="https://www.vancord.com" target="_blank" rel="noopener">
              <img src="https://www.vancord.com/wp-content/uploads/2025/06/vancord_horiz-logo-dkback.png" alt="Vancord" class="brand-logo" onerror="this.style.display='none';this.nextElementSibling.style.display='inline';">
              <span class="brand-logo-fallback">VANCORD</span>
            </a>
            <span class="brand-tag">Incident Readiness Short Assessment</span>
          </div>
          <div class="topbar-counter"><b id="tc-answered">0</b>/<span id="tc-total"><?php echo $quick_count; ?></span> answered</div>
        </div>
      </div>
    </div>

    <section class="vc-assessment-intro" aria-labelledby="vc-assessment-title">
      <p class="vc-assessment-intro__eyebrow">12-Question Cybersecurity Self-Assessment</p>

      <h1 id="vc-assessment-title">How Ready Is Your IT Team for a Security Incident?</h1>

      <p class="vc-assessment-intro__lead">
        Small IT teams have to keep systems running, support users, and manage an ongoing stream of security threats. This 12-question self-assessment draws on selected areas of the NIST Cybersecurity Framework (CSF) 2.0 to give you a short overview of where your security coverage appears strong and where ownership, detection, response, or recovery may need a closer look.
      </p>

      <div class="vc-nist-context">
        <figure class="vc-nist-context__figure">
          <img src="/wp-content/uploads/2026/09/nist-csf-2-six-functions-cybersecurity-framework.jpg"
            alt="NIST Cybersecurity Framework 2.0 Six Functions: Govern, Identify, Protect, Detect, Respond, and Recover"
            loading="lazy"
          >
          <figcaption class="vc-nist-context__credit">NIST Cybersecurity Framework (CSF) 2.0 - Graphic courtesy of NIST</figcaption>
        </figure>

        <div class="vc-nist-context__content">
          <h2>A short overview, not a detailed assessment.</h2>
          <p>
            This self-assessment touches selected areas of the NIST CSF 2.0 to help surface issues worth a closer look. It is not a full NIST assessment or audit.
          </p>
          <p class="vc-nist-context__scope">
            Use your score as a starting point for deciding where a deeper review may be useful.
          </p>
        </div>
      </div>

      <div class="vc-assessment-result">
        <div class="vc-assessment-result__visual">
          <div class="vc-benefit-card">
            <img src="/wp-content/uploads/2026/09/cybersecurity-readiness-score-gauge.jpg" width="480" height="480" alt="Cybersecurity readiness score gauge" loading="lazy">
            <div class="vc-benefit-card__label">Readiness score</div>
          </div>

          <div class="vc-benefit-card">
            <img src="/wp-content/uploads/2026/09/cybersecurity-self-assessment-pdf-summary.jpg" width="480" height="480" alt="Cybersecurity self-assessment PDF summary" loading="lazy">
            <div class="vc-benefit-card__label">PDF summary</div>
          </div>
        </div>

        <div class="vc-assessment-result__content">
          <p class="vc-assessment-result__title">What you get</p>
          <p class="vc-assessment-result__copy">
            <strong>See your basic readiness score right away, with no email required.</strong>
            If you want a closer look afterward, you can set up a free-of-charge consultation with a Vancord security engineer to review the results and walk through the full Vancord assessment.
            <span class="vc-assessment-result__note">You can also request a customized PDF summary after completing the self-assessment.</span>
          </p>
        </div>
      </div>
    </section>

    <style>
    body {
      margin: 0;
      background: #ffffff;
      font-family: Mundial, Arial, sans-serif;
      color: #4c5864;
    }

    .vc-assessment-intro {
      --vc-navy: #082f55;
      --vc-text: #4c5864;
      --vc-cyan: #267aa3;
      --vc-light: #f6f8fa;
      --vc-border: #dfe5ea;
      --vc-white: #ffffff;
      --vc-soft: #eef4f7;

      max-width: 1200px;
      margin: 0 auto;
      padding: 58px 3% 34px;
      color: var(--vc-text);
      font-family: Mundial, Arial, sans-serif;
    }

    .vc-assessment-intro * {
      box-sizing: border-box;
    }

    .vc-assessment-intro__eyebrow {
      margin: 0 0 18px;
      color: var(--vc-cyan);
      font-family: "T26 Carbon", "Courier New", monospace;
      font-size: 15px;
      line-height: 1.45;
      font-weight: 500;
      letter-spacing: .22em;
      text-transform: uppercase;
    }

    .vc-assessment-intro h1 {
      max-width: 850px;
      margin: 0 0 18px;
      color: var(--vc-navy);
      font-family: "Commuters Sans", Mundial, Arial, sans-serif;
      font-size: 50px;
      line-height: 1.07;
      font-weight: 700;
    }

    .vc-assessment-intro__lead {
      max-width: 920px;
      margin: 0;
      font-size: 20px;
      line-height: 1.55;
    }

    .vc-nist-context {
      display: grid;
      grid-template-columns: 230px minmax(0, 1fr);
      gap: 30px;
      align-items: center;
      margin: 30px 0 20px;
      padding: 24px 28px;
      border: 1px solid var(--vc-border);
      border-radius: 20px;
      background: var(--vc-white);
    }

    .vc-nist-context__figure {
      margin: 0;
      text-align: center;
    }

    .vc-nist-context__figure img {
      display: block;
      width: 100%;
      max-width: 220px;
      height: auto;
      margin: 0 auto;
    }

    .vc-nist-context__credit {
      margin: 8px 0 0;
      color: #75808a;
      font-size: 11px;
      line-height: 1.4;
    }

    .vc-nist-context__content h2 {
      margin: 0 0 10px;
      color: var(--vc-navy);
      font-size: 22px;
      line-height: 1.3;
      font-weight: 600;
    }

    .vc-nist-context__content p {
      margin: 0;
      font-size: 16px;
      line-height: 1.6;
    }

    .vc-nist-context__content p + p {
      margin-top: 10px;
    }

    .vc-nist-context__scope {
      color: #5d6975;
    }

    .vc-assessment-result {
      display: grid;
      grid-template-columns: 240px minmax(0, 1fr);
      gap: 24px;
      align-items: center;
      margin-top: 18px;
      padding: 22px 24px;
      border-radius: 20px;
      background: var(--vc-light);
    }

    .vc-assessment-result__visual {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }

    .vc-benefit-card {
      padding: 16px 12px 14px;
      border: 1px solid var(--vc-border);
      border-radius: 16px;
      background: var(--vc-white);
      text-align: center;
    }

    .vc-benefit-card img {
      display: block;
      width: 86px;
      height: 86px;
      margin: 0 auto 10px;
      object-fit: cover;
      border-radius: 12px;
    }

    .vc-benefit-card__label {
      color: var(--vc-navy);
      font-size: 13px;
      line-height: 1.4;
      font-weight: 600;
    }

    .vc-assessment-result__content {
      min-width: 0;
    }

    .vc-assessment-result__title {
      margin: 0 0 8px;
      color: var(--vc-navy);
      font-size: 20px;
      line-height: 1.3;
      font-weight: 600;
    }

    .vc-assessment-result__copy {
      margin: 0;
      font-size: 16px;
      line-height: 1.65;
    }

    .vc-assessment-result__copy strong {
      color: var(--vc-navy);
      font-weight: 600;
    }

    .vc-assessment-result__note {
      display: block;
      margin-top: 8px;
      color: #5d6975;
      font-size: 14px;
      line-height: 1.55;
    }

    @media (max-width: 767px) {
      .vc-assessment-intro {
        padding: 40px 24px 26px;
      }

      .vc-assessment-intro__eyebrow {
        margin-bottom: 15px;
        font-size: 13px;
        letter-spacing: .17em;
      }

      .vc-assessment-intro h1 {
        margin-bottom: 16px;
        font-size: 38px;
        line-height: 1.08;
      }

      .vc-assessment-intro__lead {
        font-size: 18px;
        line-height: 1.55;
      }

      .vc-nist-context {
        grid-template-columns: 1fr;
        gap: 16px;
        margin-top: 26px;
        padding: 20px;
      }

      .vc-nist-context__figure img {
        max-width: 205px;
      }

      .vc-nist-context__content h2 {
        font-size: 20px;
      }

      .vc-assessment-result {
        grid-template-columns: 1fr;
        gap: 18px;
        padding: 19px 20px;
      }

      .vc-assessment-result__visual {
        max-width: 280px;
        margin: 0 auto;
      }
    }
  </style>

    <!-- <section class="ira-header">
      <div class="container">
        <div class="hero-grid">
          <div>
            <div class="eyebrow">Self-screening across three critical security domains</div>
            <h1>How prepared is your organization?</h1>
            <p class="lede">Use this quick assessment to evaluate your organization's readiness across three critical cybersecurity domains. Complete the questionnaire to receive your readiness score and downloadable report.</p>
          </div>
          <aside class="hero-panel">
            <h3>What this tool gives you</h3>
            <p>A fast, structured readiness screen that helps teams move from vague concern to a clearer conversation about ownership, priorities, and next actions.</p>
            <ul>
              <li>No email required to see the basic score.</li>
              <li>Customized PDF requires report-delivery consent.</li>
            </ul>
          </aside>
        </div>
      </div>
    </section> -->
  <?php } ?>

    <div class="shell container" id="assessment">
      
      <?php if (!$is_short): ?>
        <!-- <section id="mode-section">
          <div class="mode-tabs" role="tablist" aria-label="Assessment mode">
            <button class="mode-tab active" data-mode="quick" onclick="setMode('quick')">Quick read <span class="mt-count"><?php// echo $quick_count; ?> Q</span></button>
            <button class="mode-tab" data-mode="deep" onclick="setMode('deep')">Full assessment <span class="mt-count"><?php// echo $full_count; ?> Q</span></button>
          </div>
        </section> -->
        <section id="ira-assessment-note">
          <div class="ira-assessment-note">
            <div class="ira-assessment-note-icon"><img src="https://www.vancord.com/wp-content/uploads/2026/08/info-icon.png" alt="info icon"></div>
            <div>
              <strong class="description">Need help completing the full assessment?</strong>
              <p>The <?php echo $full_count; ?>-question assessment is intended to provide a more detailed incident readiness snapshot. If you'd prefer guidance, the Vancord team can walk through the assessment with you, answer questions, and help interpret the results together.</p>
            </div>
          </div>
        </section>
      <?php endif; ?>

      <section id="assess-section">
        <div class="assess-block">
          <div class="assess-toolbar">
            <div class="toolbar-progress">
              <span><b id="progress-count">0</b> of <span id="progress-total"><?php echo $quick_count; ?></span> answered</span>
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
          <div class="tf-col">
            <img src="https://www.vancord.com/wp-content/uploads/2022/03/vancord-logo.svg" alt="Vancord" class="site-logo">
            <p>Trusted IT and cybersecurity partner for New England organizations since 2005.</p></div>
          <div class="tf-col">
            <h4>Offices</h4>
            <p><a href="https://maps.app.goo.gl/CMw9tukePWao8K917" target="_blank" rel="noopener">500 Boston Post Rd<br> Milford, CT 06460</a></p>
            <p style="margin-top:10px;"><a href="https://maps.app.goo.gl/amCbWiYCNRkeaQyt6" target="_blank" rel="noopener">180 Glastonbury Blvd, Suite 107<br>Glastonbury, CT 06033</a></p>
          </div>
          <div class="tf-col"><h4>Contact</h4><p><a href="mailto:sales@vancord.com">sales@vancord.com</a></p><p><a href="tel:2038749607">203.874.9607</a></p><p><a href="tel:8555124817">1-855-VANCORD</a></p></div>
          <div class="tf-col"><h4>24/7 Security Operations</h4><p>In an active incident?</p><p><a href="tel:8555124817" style="font-weight:800;color:var(--accent);">1-855-VANCORD</a></p><p><a href="tel:8555124817">855-512-4817</a></p></div>
        </div>
        <div class="tf-bottom">
          <div class="tf-meta">
            Copyright © <?php echo date('Y'); ?> Vancord all rights reserved |&nbsp;<a href="/terms-conditions/" target="_blank">Terms</a>&nbsp;|&nbsp;<a href="/privacy-policy/" target="_blank">Privacy</a>
          </div>
          <div class="tf-meta">Built on the NIST Cybersecurity Framework</div></div>
      </div>
    </div>
  </div>

  <?php
  $questions = ira_get_questions();
  ?>

  <script>
    window.IRA_QUESTIONS = <?php echo wp_json_encode($questions); ?>;
  </script>
  <script type="text/javascript">
  jQuery(document).ready(function ($) {
      $('.faq-question').on('click', function () {
          $(this).toggleClass('expanded');
          var $item = $(this).closest('.faq-item');
          var $answer = $item.find('.faq-answer');

          $item.toggleClass('open');
          $answer.slideToggle(200);
      });
  });
  </script>
  <script type="text/javascript" src="https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"></script>
</body>