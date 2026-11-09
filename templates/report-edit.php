<?php

if (!defined('ABSPATH')) {
	exit;
}

if (!defined('LSCACHE_NO_CACHE')) {
	define('LSCACHE_NO_CACHE', true);
}

global $wpdb;

$token = get_query_var( 'ira_edit' );

$submission = $wpdb->get_row(

	$wpdb->prepare(

		"
		SELECT *
		FROM {$wpdb->prefix}" . IRA_TABLE_SUBMISSIONS . "
		WHERE edit_token=%s
		",

		$token

	),

	ARRAY_A

);

if ( !$submission ) {
	wp_die( 'Invalid edit link.' );
}

$data = json_decode( $submission[ 'report_json' ], true );

$assessment_type = $submission['assessment_type'] ?? 'full';
$saved_report = $data['report'] ?? [];
$is_short_v2 = $assessment_type === 'short' && (int) ( $saved_report['assessment_version'] ?? 0 ) === 2;

$revision = absint( $_GET[ 'revision' ] ?? 0 );

if ( $revision ) {

	$row = $wpdb->get_row(

		$wpdb->prepare(

			"
			SELECT revision_json
			FROM {$wpdb->prefix}" . IRA_TABLE_REVISIONS . "
			WHERE id=%d
			",

			$revision

		),

		ARRAY_A

	);

	if ( $row ) {

		$revision_data = json_decode( $row[ 'revision_json' ], true );

		if ( isset( $revision_data[ 'report_json' ] ) ) {

			$data = json_decode(

				$revision_data[ 'report_json' ],

				true

			);

		} else {

			$data = $revision_data;

		}

	}

}

$revisions = $wpdb->get_results(

	$wpdb->prepare(

		"
		SELECT id,created_at
		FROM {$wpdb->prefix}" . IRA_TABLE_REVISIONS . "
		WHERE submission_id=%d
		ORDER BY id DESC
		",

		$submission[ 'id' ]

	),

	ARRAY_A

);

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
	<script>window.IRA_SHORT_BOOT = <?php echo wp_json_encode( [
		'kind' => 'edit',
		'data' => $data,
		'id' => (int) $submission['id'],
		'editToken' => $submission['edit_token'],
		'reportUrl' => home_url( '/ira/report/' . $submission['public_token'] ),
	] ); ?>;</script>
	<?php
	get_template_part( 'footer', 'minimal' );
	exit;
}

wp_enqueue_style('ira-style');
wp_enqueue_script('ira-script');

get_template_part( 'header', 'minimal' );

?>

<script>

window.iraConfig = <?php echo wp_json_encode([
	'assessment' => $assessment_type
]); ?>;

window.IRA_QUESTIONS = <?php echo wp_json_encode($questions); ?>;

</script>

<script>

window.IRA_EDIT_MODE = true;

window.IRA_EDIT_ID =
<?php echo (int) $submission[ 'id' ]; ?>;

window.IRA_ASSESSMENT =
<?php echo wp_json_encode($assessment_type); ?>;

window.IRA_EDIT_DATA =
<?php echo wp_json_encode( $data ); ?>;

window.IRA_REVISIONS =
<?php echo wp_json_encode( $revisions ); ?>;

</script>

<?php

$is_short = ($assessment_type === 'short');

include IRA_PATH . 'templates/edit-html.php';

get_template_part( 'footer', 'minimal' );
