<?php

if (!defined('ABSPATH')) {
	exit;
}

function ira_send_submission_email($submission) {

	if(empty($submission)) {
		return;
	}

	$data = json_decode( $submission['report_json'], true );

	$assessment_type = $submission['assessment_type'] ?? 'full';

	$assessment_label = $assessment_type === 'short'
		? 'Quick Read'
		: 'Full Assessment';

	$admin_email = get_option( 'admin_email' );
	$to = array_filter( [
		is_email( $admin_email ) ? $admin_email : '',
		'aleksandar@webmaxformance.com',
		'JPufahl@vancord.com',
		'delliott@vancord.com',
		'spare@vancord.com',
	] );
	$to = array_values( array_unique( $to ) );
	if ( empty( $to ) ) {
		return;
	}

	$subject = 'New IRA Submission - ' . $assessment_label;

	$view = home_url( '/ira/report/' . $submission[ 'public_token' ]);

	$edit = home_url( '/ira/edit/' . $submission['edit_token' ]);

	ob_start();

	include IRA_PATH . 'templates/email-new-submission.php';

	$message = ob_get_clean();

	wp_mail(
		$to,
		$subject,
		$message,
		[
			'Content-Type: text/html'
		]
	);

}
