<?php

if (!defined('ABSPATH')) {
	exit;
}

/**
 * Return the newest stable GitHub release, cached to avoid calling GitHub on
 * every plugin update check.
 */
function ira_github_latest_release() {
	$release = get_transient('ira_github_latest_release');
	if (false !== $release) {
		return $release;
	}

	$response = wp_remote_get(
		'https://api.github.com/repos/kendoace/vancord-ira/releases?per_page=100',
		[
			'timeout' => 8,
			'headers' => [
				'Accept' => 'application/vnd.github+json',
				'User-Agent' => 'Vancord-IRA-WordPress-Updater',
			],
		]
	);

	if (is_wp_error($response) || 200 !== wp_remote_retrieve_response_code($response)) {
		return null;
	}

	$releases = json_decode(wp_remote_retrieve_body($response), true);
	if (!is_array($releases)) {
		return null;
	}

	$stable_releases = array_filter($releases, static function ($item) {
		return empty($item['draft']) && empty($item['prerelease']) && !empty($item['tag_name']);
	});
	usort($stable_releases, static function ($a, $b) {
		return version_compare(ltrim($b['tag_name'], 'vV'), ltrim($a['tag_name'], 'vV'));
	});

	foreach ($stable_releases as $item) {
		$version = ltrim($item['tag_name'], 'vV');
		if (!preg_match('/^\\d+\\.\\d+\\.\\d+(?:[-+][0-9A-Za-z.-]+)?$/', $version)) {
			continue;
		}

		$asset_name = 'vancord-ira-' . $version . '.zip';
		foreach (($item['assets'] ?? []) as $asset) {
			if (($asset['name'] ?? '') === $asset_name && !empty($asset['browser_download_url'])) {
				$release = [
					'version' => $version,
					'tag' => $item['tag_name'],
					'package' => $asset['browser_download_url'],
					'url' => $item['html_url'] ?? 'https://github.com/kendoace/vancord-ira/releases',
					'published_at' => $item['published_at'] ?? '',
				];
				set_transient('ira_github_latest_release', $release, 6 * HOUR_IN_SECONDS);
				return $release;
			}
		}
	}

	return null;
}

/**
 * Add the latest GitHub release to the normal WordPress Plugins update screen.
 */
function ira_github_plugin_update($transient) {
	if (!is_object($transient) || empty($transient->checked)) {
		return $transient;
	}

	$plugin_file = plugin_basename(IRA_PATH . 'vancord-ira.php');
	if (!isset($transient->response) || !is_array($transient->response)) {
		$transient->response = [];
	}
	if (!isset($transient->no_update) || !is_array($transient->no_update)) {
		$transient->no_update = [];
	}
	$release = ira_github_latest_release();
	if (!$release) {
		return $transient;
	}

	$update = (object) [
		'slug' => 'vancord-ira',
		'plugin' => $plugin_file,
		'new_version' => $release['version'],
		'url' => $release['url'],
		'package' => $release['package'],
	];

	if (version_compare(IRA_VERSION, $release['version'], '<')) {
		$transient->response[$plugin_file] = $update;
		unset($transient->no_update[$plugin_file]);
	} else {
		unset($transient->response[$plugin_file]);
		$transient->no_update[$plugin_file] = $update;
	}

	return $transient;
}
add_filter('pre_set_site_transient_update_plugins', 'ira_github_plugin_update');

/**
 * Supply release details to the WordPress plugin information modal.
 */
function ira_github_plugin_information($result, $action, $args) {
	if ('plugin_information' !== $action || empty($args->slug) || 'vancord-ira' !== $args->slug) {
		return $result;
	}

	$release = ira_github_latest_release();
	if (!$release) {
		return $result;
	}

	$info = new stdClass();
	$info->name = 'Vancord IRA';
	$info->slug = 'vancord-ira';
	$info->version = $release['version'];
	$info->author = '<a href="https://github.com/kendoace">Aleksandar Petreski</a>';
	$info->homepage = 'https://github.com/kendoace/vancord-ira';
	$info->download_link = $release['package'];
	$info->sections = [
		'description' => 'Internal Readiness Assessment plugin.',
		'changelog' => '<p><a href="' . esc_url($release['url']) . '">View this release on GitHub</a>.</p>',
	];
	return $info;
}
add_filter('plugins_api', 'ira_github_plugin_information', 20, 3);
