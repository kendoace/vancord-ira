<?php

if (!defined('ABSPATH')) {
	exit;
}

global $wpdb;

$search = sanitize_text_field( $_GET[ 's' ] ?? '' );

$where = '';

if ( $search ) {

	$where = $wpdb->prepare(

		"WHERE s.report_json LIKE %s",

		'%' . $wpdb->esc_like( $search ) . '%'

	);

}

$rows = $wpdb->get_results(

	"
	SELECT
		s.*,
		(
			SELECT COUNT(*)
			FROM {$wpdb->prefix}" . IRA_TABLE_REVISIONS . "
			WHERE submission_id=s.id
		)
		as revisions
	FROM {$wpdb->prefix}" . IRA_TABLE_SUBMISSIONS . " s
	{$where}
	ORDER BY id DESC
	",

	ARRAY_A

);

wp_enqueue_style( 'ira-style' );
wp_enqueue_script( 'ira-script' );

get_template_part( 'header', 'minimal' );

?>

<div class="ira-admin">

	<h1>Assessments</h1>

	<form>

		<input
			type="text"
			name="s"
			placeholder="Search..."
			value="<?php echo esc_attr( $search ); ?>">

		<button>Search</button>

	</form>

	<table>

		<thead>

			<tr>
				<th>ID</th>
				<th>Assessment</th>
				<th>Name</th>
				<th>Company</th>
				<th>Score</th>
				<th>Tier</th>
				<th>Revisions</th>
				<th>Actions</th>
			</tr>

		</thead>

		<tbody>

		<?php foreach ( $rows as $row ) :

			$data = json_decode( $row['report_json'] ?? '', true ) ?: [];
			$assessment_type = $row['assessment_type'] ?? 'assessment';
			$mode = $data['report']['mode'] ?? 'quick';

			if ($assessment_type === 'short') {
			    $assessment_label = !empty( $data['report']['assessment_version'] ) ? '12-Question Assessment' : 'Legacy Short Assessment';
			} else {
			    $assessment_label =
			        $mode === 'deep'
			            ? 'Full Assessment'
			            : 'Quick Read';
			}
			$tier = strtolower( $data[ 'report' ][ 'tier' ] ?? '' );

		?>

			<tr>

				<td><?php echo (int) $row[ 'id' ]; ?></td>

				<td><?php echo esc_html($assessment_label); ?></td>

				<td><?php echo esc_html( $data[ 'customization' ][ 'fullName' ] ?? '' ); ?></td>

				<td><?php echo esc_html( $data[ 'customization' ][ 'company' ] ?? '' ); ?></td>

				<td><?php echo esc_html( $data[ 'report' ][ 'score' ] ?? '' ); ?></td>

				<td>

					<span class="ira-tier ira-tier-<?php echo esc_attr( $tier ); ?>">

						<?php echo esc_html( $data[ 'report' ][ 'tier' ] ?? '' ); ?>

					</span>

				</td>

				<td>

					<span class="ira-revisions">

						<?php echo (int) $row[ 'revisions' ]; ?>

					</span>

				</td>

				<td>

					<a target="_blank" href="<?php echo esc_url( home_url( '/ira/report/' . $row[ 'public_token' ] ) ); ?>">
						View
					</a>

					|

					<a target="_blank" href="<?php echo esc_url( home_url( '/ira/edit/' . $row[ 'edit_token' ] ) ); ?>">
						Edit
					</a>

					|

					<button
						type="button"
						class="ira-copy"
						data-url="<?php echo esc_attr( home_url( '/ira/edit/' . $row[ 'edit_token' ] ) ); ?>">

						Copy Edit

					</button>

				</td>

			</tr>

		<?php endforeach; ?>

		</tbody>

	</table>

</div>

<script>

document.querySelectorAll('.ira-copy').forEach(btn=>{

	btn.addEventListener(

		'click',

		async()=>{

			try{

				await navigator.clipboard.writeText(

					btn.dataset.url

				);

				btn.innerHTML='Copied';

				setTimeout(()=>{

					btn.innerHTML='Copy Edit';

				},1200);

			}
			catch(e){

				alert(

					btn.dataset.url

				);

			}

		}

	);

});

</script>

<?php get_template_part( 'footer', 'minimal' ); ?>
