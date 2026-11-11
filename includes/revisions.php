<?php

if (!defined('ABSPATH')) {
	exit;
}

function ira_create_revision( $submission_id ) {

	global $wpdb;

	$submission = $wpdb->get_row(

		$wpdb->prepare(

			"
			SELECT *
			FROM {$wpdb->prefix}" . IRA_TABLE_SUBMISSIONS . "
			WHERE id=%d
			",

			$submission_id

		),

		ARRAY_A

	);

	$wpdb->insert(

		$wpdb->prefix . IRA_TABLE_REVISIONS,

		[

			'submission_id' => $submission_id,

			'revision_json' => wp_json_encode( $submission ),

			'created_at' => current_time( 'mysql' )

		]

	);

}