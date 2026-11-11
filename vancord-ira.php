<?php
/**
 * Plugin Name: Vancord IRA
 * Description: Internal Readiness Assessment plugin.
 * Version: 2.0.0
 * Author: Aleksandar Petreski
 */

if (!defined('ABSPATH')) {
	exit;
}

/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
*/

define('IRA_VERSION','2.0.0');
define('IRA_PATH',plugin_dir_path(__FILE__));
define('IRA_URL',plugin_dir_url(__FILE__));

define('IRA_TABLE_SUBMISSIONS','ira_submissions');
define('IRA_TABLE_ANSWERS','ira_answers');
define('IRA_TABLE_REVISIONS','ira_revisions');

/*
|--------------------------------------------------------------------------
| Includes
|--------------------------------------------------------------------------
*/

foreach([

	'activator.php',
	'db.php',
	'routes.php',
	'question-repository.php',
	'submissions.php',
	'revisions.php',
	'tokens.php',
	'mailer.php'

] as $file){

	$path=
	IRA_PATH .
	'includes/' .
	$file;

	if(
		file_exists(
			$path
		)
	){
		require_once $path;
	}

}

/*
|--------------------------------------------------------------------------
| Activation
|--------------------------------------------------------------------------
*/

register_activation_hook(
	__FILE__,
	'ira_activate_plugin'
);

register_deactivation_hook(

	__FILE__,

	function(){

		flush_rewrite_rules();

	}

);

/*
|--------------------------------------------------------------------------
| Assets
|--------------------------------------------------------------------------
*/

add_action(
	'wp_enqueue_scripts',
	'ira_enqueue_assets'
);

function ira_enqueue_assets(){

	wp_register_style( 'ira-style', IRA_URL . 'assets/css/vancord-ira.css', [], IRA_VERSION );

	wp_register_script( 'ira-pdfmake', IRA_URL . 'assets/vendor/pdfmake/pdfmake.min.js', [], null, true );

	wp_register_script( 'ira-vfs', IRA_URL . 'assets/vendor/pdfmake/vfs_fonts.js', ['ira-pdfmake'], null, true );

	wp_register_script( 'ira-lzstring', IRA_URL . 'assets/vendor/lz-string/lz-string.min.js', [], null, true );

	wp_register_script( 'ira-script', IRA_URL . 'assets/js/vancord-ira.js', ['ira-vfs', 'ira-lzstring'], IRA_VERSION, true );

	wp_register_style( 'ira-short-style', IRA_URL . 'assets/css/vancord-ira-short.css', [], IRA_VERSION );
	wp_register_script( 'ira-short-script', IRA_URL . 'assets/js/vancord-ira-short.js', ['ira-vfs', 'ira-lzstring'], IRA_VERSION, true );

	wp_localize_script(

		'ira-script',

		'IRA_DATA',

		[

			'ajax_url'=>
			admin_url( 'admin-ajax.php' ),

			'nonce'=> wp_create_nonce( 'ira_submit' ),

			'share_url' => home_url( '/ira/' ),

		]

	);

	wp_localize_script(
		'ira-short-script',
		'IRA_SHORT_DATA',
		[
			'ajax_url' => admin_url( 'admin-ajax.php' ),
			'nonce' => wp_create_nonce( 'ira_submit' ),
			'share_url' => home_url( '/assessment/' ),
			'questions' => json_decode( file_get_contents( IRA_PATH . 'config/questions-short.json' ), true ) ?: [],
		]
	);

}

/*
|--------------------------------------------------------------------------
| Shortcode
|--------------------------------------------------------------------------
*/

add_shortcode(

	'vancord_ira_assessment',

	'ira_render_shortcode'

);

function ira_render_shortcode(){

	wp_enqueue_style(
		'ira-style'
	);

	wp_enqueue_script(
		'ira-script'
	);

	ob_start();

	include
	IRA_PATH .
	'templates/assessment-form.php';

	return
	ob_get_clean();

}

/*
|--------------------------------------------------------------------------
| Noindex
|--------------------------------------------------------------------------
*/

add_filter(

	'rank_math/frontend/robots',

	function(
		$robots
	){

		$path=

		parse_url(

			$_SERVER[
				'REQUEST_URI'
			],

			PHP_URL_PATH

		);

		if(

			strpos(

				$path,
				'/ira/'

			)

			===

			0

			||

			strpos(

				$path,
				'/vancord-ira'

			)

			===

			0

		){

			return [

				'noindex',
				'nofollow',
				'noarchive'

			];

		}

		return
		$robots;

	}

);

add_action( 'admin_bar_menu', 'vancord_ira_admin_bar_link', 100 );

function vancord_ira_admin_bar_link( $wp_admin_bar ) {

	if ( ! current_user_can( 'edit_pages' ) ) {
		return;
	}

	$wp_admin_bar->add_node( array(
		'id'    => 'vancord-ira-submissions',
		'title' => 'IRA Submissions',
		'href'  => home_url( '/' . VANCORD_IRA_SUBMISSIONS_SLUG . '/' ),
		'meta'  => array(
			'title'  => 'View IRA Submissions',
			'target' => '_blank',
		),
	) );
}
