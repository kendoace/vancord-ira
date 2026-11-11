<?php

if (!defined('ABSPATH')) {
	exit;
}

function ira_activate_plugin() {

	ira_create_tables();

	flush_rewrite_rules();

}