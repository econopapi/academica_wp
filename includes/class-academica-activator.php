<?php

/**
 * Fired during plugin activation
 *
 * @link       http://dliimon.net
 * @since      0.1
 *
 * @package    Academica
 * @subpackage Academica/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      0.1
 * @package    Academica
 * @subpackage Academica/includes
 * @author     Daniel Limón (dlimon.net)
 */
class Academica_Activator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description
	 *
	 * @since    0.1
	 */
	public static function activate() {
		// Academica Manager User
		$user_data = array(
			'user_login' => 'academica_manager',
			'user_pass'  => wp_generate_password(), // Generate a random password
			'role'       => 'editor', // Set the role to 'editor' or any other role you want
		);

		// Insert the user
		$user_id = wp_insert_user($user_data);

		// Check if the user was created successfully
		if (!is_wp_error($user_id)) {
			// Page data
			$pages = array(
				array(
					'post_title'    => 'Seguimiento Global',
					'post_content'  => '[seguimiento_global_grupo]',
					'post_status'   => 'publish',
					'post_author'   => $user_id,
					'post_type'     => 'page',
					'slug'          => 'academica-page-1-test',
				),
				array(
					'post_title'    => 'Academica Page 2',
					'post_content'  => 'This is Academica page 2.',
					'post_status'   => 'publish',
					'post_author'   => $user_id,
					'post_type'     => 'page',
					'slug'          => 'academica-page-2-test',
				),
				// Add more pages as needed
			);

			// Loop through the page data and insert each page
			foreach ($pages as $page) {
				wp_insert_post($page);
			}
		}	
	}
}
