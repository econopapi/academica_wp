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
					'post_title'    => 'Académica UAM',
					'post_content'  => '[portada]',
					'post_status'   => 'publish',
					'post_author'   => $user_id,
					'post_type'     => 'page',
					'post_name'          => 'academica',
				),
				array(
					'post_title'    => 'Evaluación',
					'post_content'  => '[evaluacion_grupo]',
					'post_status'   => 'publish',
					'post_author'   => $user_id,
					'post_type'     => 'page',
					'post_name'          => 'academica/evaluacion',
				),
				array(
					'post_title'    => 'Programación docente',
					'post_content'  => '[asignacion_docente]',
					'post_status'   => 'publish',
					'post_author'   => $user_id,
					'post_type'     => 'page',
					'post_name'          => 'academica/docentes/programacion',
				),
				array(
					'post_title'    => 'Evaluación Componente Global',
					'post_content'  => '[evaluacion_componente_global]',
					'post_status'   => 'publish',
					'post_author'   => $user_id,
					'post_type'     => 'page',
					'post_name'          => 'academica/docentes/evaluacion-componente-global',
				),
				array(
					'post_title'    => 'Evaluación Componente Recuperación',
					'post_content'  => '[evaluacion_componente_recuperacion]',
					'post_status'   => 'publish',
					'post_author'   => $user_id,
					'post_type'     => 'page',
					'post_name'          => 'academica/docentes/evaluacion-componente-recuperacion',
				),

				
			);

			// Loop through the page data and insert each page
			foreach ($pages as $page) {
				wp_insert_post($page);
			}
		}	
	}
}
