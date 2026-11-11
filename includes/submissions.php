<?php

if (!defined('ABSPATH')) {
	exit;
}

if (!defined('LSCACHE_NO_CACHE')) {
	define('LSCACHE_NO_CACHE', true);
}

add_action('wp_ajax_nopriv_ira_submit','ira_submit');
add_action('wp_ajax_ira_submit','ira_submit');
add_action('wp_ajax_ira_save_revision','ira_save_revision');

function ira_get_submission($id){

	global $wpdb;

	return $wpdb->get_row(

		$wpdb->prepare(

			"
			SELECT *
			FROM {$wpdb->prefix}" . IRA_TABLE_SUBMISSIONS . "
			WHERE id=%d
			",

			$id

		),

		ARRAY_A

	);

}

function ira_submit(){

	check_ajax_referer(
		'ira_submit',
		'nonce'
	);

	global $wpdb;

	$payload = json_decode(
		stripslashes($_POST['submission']),
		true
	);

	if (empty($payload)) {
		wp_send_json_error();
	}

	$assessment_type = sanitize_key(
		$payload['report']['assessment_type'] ?? 'assessment'
	);

	$now = current_time('mysql');

	$wpdb->insert(

		$wpdb->prefix . IRA_TABLE_SUBMISSIONS,

		[

			'assessment_type' => $assessment_type,

			'status' => 'submitted',

			'report_json' => wp_json_encode($payload),

			'created_at' => $now,

			'updated_at' => $now

		]

	);

	$id = $wpdb->insert_id;

	$tokens = ira_generate_submission_tokens($id);

	$submission = ira_get_submission($id);

	ira_send_submission_email($submission);

	wp_send_json_success([

		'id' => $id,

		'view_url' => home_url(
			'/ira/report/' . $tokens['public']
		),

		'edit_url' => home_url(
			'/ira/edit/' . $tokens['edit']
		)

	]);

}

function ira_save_revision(){

	check_ajax_referer(
		'ira_submit',
		'nonce'
	);

	global $wpdb;

	if ( ! current_user_can( 'edit_pages' ) ) {
		wp_send_json_error( [ 'message' => 'You do not have permission to edit assessments.' ], 403 );
	}

	$id = absint(
		$_POST['id'] ?? 0
	);


	$revision = json_decode(

		stripslashes(
			$_POST['revision'] ?? ''
		),

		true

	);


	if(empty($revision)){

		wp_send_json_error();

	}


	$current = ira_get_submission(
		$id
	);


	if(!$current){

		wp_send_json_error();

	}


	$wpdb->insert(

		$wpdb->prefix . IRA_TABLE_REVISIONS,

		[

			'submission_id' => $id,

			'revision_json' =>
			$current['report_json'],

			'created_at' =>
			current_time('mysql')

		]

	);


	$wpdb->update(

		$wpdb->prefix . IRA_TABLE_SUBMISSIONS,

		[

			'report_json' =>
			wp_json_encode(
				$revision
			),

			'updated_at' =>
			current_time('mysql')

		],

		[

			'id' => $id

		]

	);


	wp_send_json_success([

		'view_url' =>

		home_url(

			'/ira/report/' .
			$current['public_token']

		)

	]);

}
