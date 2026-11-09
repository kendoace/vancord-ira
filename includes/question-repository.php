<?php

if (!defined('ABSPATH')) {
	exit;
}

/**
 * Returns the questions for the current assessment.
 *
 * assessment         -> questions.json
 * assessment-short   -> questions-short.json
 */
function ira_get_questions() {

	static $cache = [];

	$page = get_query_var('ira_page');

	$file = ($page === 'assessment-short')
		? IRA_PATH . 'config/questions-short.json'
		: IRA_PATH . 'config/questions.json';

	if (isset($cache[$file])) {
		return $cache[$file];
	}

	if (!file_exists($file)) {
		$cache[$file] = [];
		return $cache[$file];
	}

	$content = file_get_contents($file);

	$questions = json_decode($content, true);

	$cache[$file] = is_array($questions)
		? $questions
		: [];

	return $cache[$file];

}