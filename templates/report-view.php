<?php

if (!defined('ABSPATH')) {
	exit;
}

if (!defined('LSCACHE_NO_CACHE')) {
	define('LSCACHE_NO_CACHE', true);
}

global $wpdb;

$token = get_query_var('ira_report');

$submission = $wpdb->get_row(

	$wpdb->prepare(

		"
		SELECT *
		FROM {$wpdb->prefix}" . IRA_TABLE_SUBMISSIONS . "
		WHERE public_token=%s
		",

		$token

	),

	ARRAY_A

);

if(!$submission){
	wp_die('Report not found');
}

$data = json_decode($submission['report_json'], true) ?: [];
$report = $data['report'] ?? [];
$assessment_type = $submission['assessment_type'] ?? 'assessment';
$is_short_v2 = $assessment_type === 'short' && (int) ( $report['assessment_version'] ?? 0 ) === 2;
$profile = $data['customization'] ?? [];

$question_file = $assessment_type === 'short'
	? IRA_PATH . ( $is_short_v2 ? 'config/questions-short.json' : 'config/questions-short-legacy.json' )
	: IRA_PATH . 'config/questions.json';

$questions = [];

if (file_exists($question_file)) {
	$questions = json_decode(file_get_contents($question_file), true) ?: [];
}

if ( $is_short_v2 ) {
	wp_enqueue_style( 'ira-short-style' );
	wp_enqueue_script( 'ira-short-script' );
	get_template_part( 'header', 'minimal' );
	include IRA_PATH . 'templates/html-shell-short.php';
	?>
	<script>window.IRA_SHORT_BOOT = <?php echo wp_json_encode( [ 'kind' => 'view', 'data' => $data ] ); ?>;</script>
	<?php
	get_template_part( 'footer', 'minimal' );
	exit;
}

wp_enqueue_style('ira-style');
wp_enqueue_script('ira-script');

get_template_part('header', 'minimal');

?>

<div class="body" style="background:#f6f8fb;">
	<div class="main">
		<div class="topbar">
			<div class="topbar-inner">
				<div class="brand">
					<a href="https://www.vancord.com" target="_blank" rel="noopener">
						<img src="https://www.vancord.com/wp-content/uploads/2025/06/vancord_horiz-logo-dkback.png" alt="Vancord" class="brand-logo" onerror="this.style.display='none';this.nextElementSibling.style.display='inline';">
						<span class="brand-logo-fallback">VANCORD</span>
					</a>
					<span class="brand-tag">Incident Readiness Assessment</span>
				</div>
			</div>
		</div>

		<div class="shell container">
			<div class="ira-report-container">

	<div class="ira-header">
		<h1>Internal Readiness Assessment</h1>
		<p><?php echo esc_html( $profile[ 'fullName' ] ?? '' ); ?> - <?php echo esc_html( $profile[ 'role' ] ?? '' ); ?> at <?php echo esc_html( $profile[ 'company' ] ?? '' ); ?> </p>
	</div>

	<?php include IRA_PATH . 'templates/results-section.php'; ?>

	<script>

	window.iraConfig = <?php echo wp_json_encode([
		'assessment' => $assessment_type
	]); ?>;

	window.IRA_QUESTIONS = <?php echo wp_json_encode($questions); ?>;

	</script>

	<script>

window.IRA_REPORT =

<?php
echo wp_json_encode(
	$report
);
?>;

document.addEventListener(

	'DOMContentLoaded',

	()=>{

		document
		.getElementById(
			'results-section'
		)
		?.classList
		.add(
			'show'
		);

		const overall =

		Number(

			window
			.IRA_REPORT
			.score

			||

			0

		);

		const tier =

		getTier(
			overall
		);

		const weakest =

		window
		.IRA_REPORT
		.weakestCategory

		||

		null;

		window.state =

window.state

||

{};

state.answers =
window.IRA_REPORT.answers
||
{};

const scoreData = {

	catScores:

	window
	.IRA_REPORT
	.catScores

	||

	calculateScore()
	.catScores

};

const gaps = window.IRA_REPORT.topGaps || getTopGaps();

		document
		.getElementById(
			'score-val'
		)
		.textContent =
		overall;

		const circ =
		2
		*
		Math.PI
		*
		52;

		const offset =

		circ

		-

		(
			overall
			/
			100
		)

		*
		circ;

		const fg =
		document.getElementById(
			'sc-fg'
		);

		if(
			fg
		){

			fg.setAttribute(
				'stroke',
				tier.color
			);

			fg.style.strokeDashoffset =
			offset;

		}

		document
		.getElementById(
			'tier-chip'
		)
		.textContent =

		`${tier.name} · ${overall}/100`;

		document
		.getElementById(
			'tier-chip'
		)
		.style.color =
		tier.color;

		document
		.getElementById(
			'tier-chip'
		)
		.style.background =
		tier.soft;

		document
		.getElementById(
			'tier-name'
		)
		.textContent =
		tier.name;

		document
		.getElementById(
			'tier-text'
		)
		.textContent =
		tier.text;

		document
		.getElementById(
			'score-explain'
		)
		.innerHTML =

		buildScoreMeaning(

			overall,

			tier,

			weakest

		)

		+

		' Self-assessments can overstate or understate readiness, so treat the number as a structured prompt for evidence review.';

		document
		.getElementById(
			'score-meaning'
		)
		.innerHTML =

		buildScoreMeaning(

			overall,

			tier,

			weakest

		);

		document
		.getElementById(
			'fail-first-text'
		)
		.innerHTML =

		buildFailFirstText(
			weakest
		);

		document
		.getElementById(
			'escalation-text'
		)
		.innerHTML =

		buildEscalationText(

			weakest,

			gaps

		);

		document
		.getElementById(
			'conversation-text'
		)
		.innerHTML =

		buildOnPageConversation(

			overall,

			tier,

			weakest

		);

		document
		.getElementById(
			'validation-text'
		)
		.innerHTML =

		weakest

		?

		CATEGORY_META[
			weakest.cat
		]
		.first

		:

		'Review evidence before treating the score as settled.';

		document
		.getElementById(
			'insight-grid'
		)
		.innerHTML =

		[

			{

				k:
				'Weakest function',

				v:

				weakest

				?

				`${weakest.cat} · ${weakest.score}/100`

				:

				'—'

			},

			{

				k:
				'First conversation',

				v:

				weakest

				?

				firstConversation(
					weakest.cat
				)

				:

				'Validate results'

			},

			{

				k:
				'Next validation',

				v:

				weakest

				?

				CATEGORY_META[
					weakest.cat
				]
				.first

				:

				'Review evidence'

			}

		]

		.map(

			x=>

			`<div class="insight"><div class="k">${x.k}</div><div class="v">${x.v}</div></div>`

		)

		.join(
			''
		);

		if(
	typeof buildSnapshotActions === 'function'
){

	document
	.getElementById(
		'snapshot-actions'
	)
	.innerHTML =

	buildSnapshotActions(
		gaps
	);

}

if(
	typeof renderWall === 'function'
){

	renderWall(

		'wall-viz',

		scoreData
		.catScores

	);

}



if(

	document
	.getElementById(
		'wall-caption'
	)

){

	document
	.getElementById(
		'wall-caption'
	)
	.innerHTML =

	weakest

	?

	`Right now the wall is set by <b style="color:${CATEGORY_META[ weakest.cat ].color}">${weakest.cat}</b> at <b>${weakest.score}/100</b>. Start by validating that function before assuming the higher-scoring areas will carry the response.`

	:

	'Review evidence before treating the score as settled.';

}


if(
	typeof renderAnswerLogOnPage === 'function'
){

	window.state =

	window.state

	||

	{};

	state.mode =
	window.IRA_REPORT.mode
	||
	'quick';

	renderAnswerLogOnPage();
	renderGaps();

}

	}

);

</script>
	<div class="ira-card" style="background:#fff;">
		<h2>Recommended Next Steps</h2>

		<ul>
			<li>Review the identified gaps with internal stakeholders.</li>
			<li>Validate whether documented processes match actual operational readiness.</li>
			<li>Prioritize one or two actions that would improve readiness in the next quarter.</li>
			<li>Engage Vancord if you would like support reviewing or interpreting the assessment results.</li>
		</ul>
	</div>

	<div class="ira-card" style="background:#0b1730;color:#fff;text-align:center;">
		<h2 style="color:#fff;">Want to review the results together?</h2>
		<p>Vancord can walk through the assessment findings, discuss priorities, and help translate the results into practical next steps.</p>
		<a href="mailto:sales@vancord.com?subject=Incident%20Readiness%20Assessment%20Review" style="display:inline-block;margin-top:12px;padding:14px 24px;background:#ffd47a;color:#111;text-decoration:none;border-radius:8px;font-weight:700;">Schedule a Review</a>
	</div>

</div>
		</div>

		<div class="trust-foot">
			<div class="tf-inner">
				<div class="tf-top">

					<div class="tf-col">
						<div class="tf-brand">VANCORD</div>
						<p>Trusted IT and cybersecurity partner for New England organizations since 2005.</p>
					</div>

					<div class="tf-col">
						<h4>Offices</h4>
						<p><a href="https://maps.app.goo.gl/CMw9tukePWao8K917" target="_blank" rel="noopener">500 Boston Post Rd<br> Milford, CT 06460</a></p>
						<p style="margin-top:10px;"><a href="https://maps.app.goo.gl/amCbWiYCNRkeaQyt6" target="_blank" rel="noopener">180 Glastonbury Blvd, Suite 107<br>Glastonbury, CT 06033</a></p>
			        </div>

					<div class="tf-col">
						<h4>Contact</h4>
						<p><a href="mailto:sales@vancord.com">sales@vancord.com</a></p>
						<p><a href="tel:2038749607">203.874.9607</a></p>
						<p><a href="tel:8555124817">1-855-VANCORD</a></p>
					</div>

					<div class="tf-col">
						<h4>24/7 Security Operations</h4>
						<p>In an active incident?</p>
						<p><a href="tel:8555124817" style="font-weight:800;color:#ffd47a;">1-855-VANCORD</a></p>
						<p style="font-size:11px;color:rgba(255,255,255,.55);">855-512-4817</p>
					</div>

				</div>

				<div class="tf-bottom">
					<div class="tf-meta">© <?php echo date('Y'); ?> Vancord · All rights reserved</div>
					<div class="tf-meta">Built on the NIST Cybersecurity Framework</div>
				</div>

			</div>
		</div>
	</div>
</div>

<?php get_template_part('footer','minimal'); ?>
