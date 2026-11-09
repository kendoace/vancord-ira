<?php

if (!defined('ABSPATH')) {
	exit;
}

function ira_create_tables() {

	global $wpdb;

	require_once ABSPATH . 'wp-admin/includes/upgrade.php';

	$charset = $wpdb->get_charset_collate();

	$submissions = "CREATE TABLE {$wpdb->prefix}" . IRA_TABLE_SUBMISSIONS . " (
		id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,

		assessment_type VARCHAR(20) NOT NULL DEFAULT 'full',

		public_token VARCHAR(128),
		edit_token VARCHAR(128),

		score DECIMAL(6,2),

		report_json LONGTEXT,

		status VARCHAR(50),

		created_at DATETIME NOT NULL,
		updated_at DATETIME NOT NULL,

		KEY assessment_type (assessment_type),
		KEY public_token (public_token),
		KEY edit_token (edit_token),

		PRIMARY KEY (id)

	) {$charset};";

	$answers = "CREATE TABLE {$wpdb->prefix}" . IRA_TABLE_ANSWERS . " (

		id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,

		submission_id BIGINT UNSIGNED,

		KEY submission_id (submission_id),

		question_id VARCHAR(100),

		answer TEXT,

		note LONGTEXT,

		created_at DATETIME NOT NULL,

		PRIMARY KEY (id)

	) {$charset};";

	$revisions = "CREATE TABLE {$wpdb->prefix}" . IRA_TABLE_REVISIONS . " (

		id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,

		submission_id BIGINT UNSIGNED,

		KEY submission_id (submission_id),

		revision_json LONGTEXT,

		revision_note TEXT,

		created_at DATETIME NOT NULL,

		PRIMARY KEY (id)

	) {$charset};";

	dbDelta($submissions);
	dbDelta($answers);
	dbDelta($revisions);

}