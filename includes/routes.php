<?php

if (!defined('ABSPATH')) {
	exit;
}

define( 'VANCORD_IRA_SUBMISSIONS_SLUG', 'ira/submissions' );

add_action('init', 'ira_register_routes');

function ira_register_routes() {

	// Existing assessment
	add_rewrite_rule(
		'^vancord-ira/?$',
		'index.php?ira_page=assessment',
		'top'
	);

	// New assessment
	add_rewrite_rule(
		'^assessment/?$',
		'index.php?ira_page=assessment-short',
		'top'
	);

	add_rewrite_rule(
		'^ira/report/([^/]*)/?',
		'index.php?ira_report=$matches[1]',
		'top'
	);

	add_rewrite_rule(
		'^ira/edit/([^/]*)/?',
		'index.php?ira_edit=$matches[1]',
		'top'
	);

	add_rewrite_rule(
		'^' . VANCORD_IRA_SUBMISSIONS_SLUG . '/?$',
		'index.php?ira_submissions=1',
		'top'
	);
}

add_filter('query_vars', function ($vars) {

	return array_merge($vars, [
		'ira_page',
		'ira_report',
		'ira_edit',
		'ira_submissions'
	]);

});

add_action('template_redirect', 'ira_template_router');

function ira_template_router() {

	$page = get_query_var('ira_page');

	if ($page) {
		if ( $page === 'assessment-short' ) {
			wp_enqueue_style('ira-short-style');
			wp_enqueue_script('ira-short-script');
		} else {
			wp_enqueue_style('ira-style');
			wp_enqueue_script('ira-script');
		}

		get_template_part(
			'header',
			'minimal'
		);

		include IRA_PATH . 'templates/assessment-form.php';

		get_template_part(
			'footer',
			'minimal'
		);

		exit;
	}

	$map = [

		'ira_report'      => 'report-view.php',
		'ira_edit'        => 'report-edit.php',
		'ira_submissions' => 'admin-submissions.php'

	];

	foreach ($map as $query => $template) {

		if (get_query_var($query)) {

			// Protect admin-only pages
			if ( in_array( $query, [ 'ira_edit', 'ira_submissions' ], true ) ) {

				if ( ! is_user_logged_in() ) {
					auth_redirect();
				}

				if ( ! current_user_can( 'edit_pages' ) ) {
					wp_die(
						'You do not have permission to access this page.',
						'Access Denied',
						[ 'response' => 403 ]
					);
				}

			}

			include IRA_PATH . 'templates/' . $template;
			exit;

		}
	}
}
