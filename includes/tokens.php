<?php

if (!defined('ABSPATH')) {
	exit;
}

function ira_generate_token() {

	return wp_generate_password(
		48,
		false,
		false
	);

}

function ira_generate_submission_tokens( $submission_id ) {

	global $wpdb;

	$public = ira_generate_token();

	$edit = ira_generate_token();

	$wpdb->update(

		$wpdb->prefix . IRA_TABLE_SUBMISSIONS,

		[

			'public_token' => $public,

			'edit_token' => $edit

		],

		[

			'id' => $submission_id

		]

	);

	return [

		'public' => $public,

		'edit' => $edit

	];

}