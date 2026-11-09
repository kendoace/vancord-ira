<?php

if (!defined('ABSPATH')) {
	exit;
}

?>

<div class="ira-wrapper">
	<?php
	if ( get_query_var( 'ira_page' ) === 'assessment-short' ) {
		include IRA_PATH . 'templates/html-shell-short.php';
	} else {
		include IRA_PATH . 'templates/html-shell.php';
	}
	?>
</div>
