<h2>New Assessment - <?php echo esc_html($assessment_label); ?></h2>

<p>Name:
	<strong><?php echo esc_html( $data[ 'customization' ][ 'fullName' ] ?? '' ); ?></strong>
</p>

<p>
	Company:
	<strong><?php echo esc_html( $data[ 'customization' ][ 'company' ] ?? '' ); ?></strong>
</p>

<p>
	Score:
	<strong><?php echo esc_html( $data[ 'report' ][ 'score' ] ?? '' ); ?></strong>
</p>

<p>
	Tier:
	<strong><?php echo esc_html( $data[ 'report' ][ 'tier' ] ?? '' ); ?></strong>
</p>

<p>
	<a href="<?php echo esc_url( $view ); ?>">
		View Report
	</a>
</p>

<p>
	<a href="<?php echo esc_url( $edit ); ?>">
		Edit Assessment
	</a>
</p>