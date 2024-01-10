<?php

/**
 * Fired during plugin deactivation
 *
 * @link       http://example.com
 * @since      0.1
 *
 * @package    Plugin_Name
 * @subpackage Plugin_Name/includes
 */

/**
 * Fired during plugin deactivation.
 *
 * This class defines all code necessary to run during the plugin's deactivation.
 *
 * @since      0.1
 * @package    Academica
 * @subpackage Academica/includes
 * @author     Daniel Limón (dlimon.net)
 */
class Academica_Deactivator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    0.1
	 */
	public static function deactivate() {

	    // Get Academica Manager user
		$user = get_user_by('login', 'academica_manager');

		// Check if the user exists
		if ($user) {
			// Get the pages created by the user
			$pages = get_pages(array(
				'author' => $user->ID,
			));

			// Loop through the pages and print all data for debugging
			foreach ($pages as $page) {
				// Check if the slug starts with 'academica'
				if (strpos($page->post_name, 'academica') === 0) {
					error_log(print_r($page, true));
					// wp_delete_post($page->ID, true);
				}
			}
	
			// Delete the user
			wp_delete_user($user->ID);
		}
	}
}
