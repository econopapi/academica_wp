<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              http://dlimon.net/
 * @since             0.1
 * @package           Academica
 *
 * @wordpress-plugin
 * Plugin Name:       Académica
 * Plugin URI:        http://dlimon.net
 * Description:       Integración de de Académica (gestor académico) con WordPress
 * Version:           2.0
 * Author:            Daniel Limón
 * Author URI:        http://dlimon.net/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       academica_wp
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'ACADEMICA_VERSION', '0.1' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-plugin-name-activator.php
 */
function activate_academica() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-academica-activator.php';
	Academica_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-plugin-name-deactivator.php
 */
function deactivate_academica() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-academica-deactivator.php';
	Academica_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_academica' );
register_deactivation_hook( __FILE__, 'deactivate_academica' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-academica.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    0.1
 */
function run_academica() {

	$plugin = new Academica();
	$plugin->run();

	add_action('wp_login', array($plugin, 'after_login_redirect'), 10, 2);
	add_action('wp_logout', array($plugin, 'after_logout_cookies'));
	add_action('init', array($plugin, 'hide_admin_bar'));
	add_action('admin_bar_menu', array($plugin, 'academica_topbar_btn'), 1);
	add_filter('wp_nav_menu_items', array($plugin, 'academica_login_menu'), 10, 2);

	$academica_public = new Academica_Public('academica', '0.1');
	add_shortcode( 'portada', array( $academica_public, 'portada'));
	add_shortcode( 'evaluacion_grupo', array( $academica_public, 'evaluacion_grupo' ) );
	add_shortcode( 'seguimiento_recuperacion_grupo', array( $academica_public, 'seguimiento_recuperacion_grupo' ) );
	add_shortcode( 'asignacion_docente', array( $academica_public, 'asignacion_docente' ) );
	add_shortcode( 'asignacion_docente_recuperacion', array( $academica_public, 'asignacion_docente_recuperacion' ) );
	add_shortcode( 'evaluacion_componente_global', array( $academica_public, 'evaluacion_componente_global' ) );
	add_shortcode( 'evaluacion_componente_recuperacion', array( $academica_public, 'evaluacion_componente_recuperacion' ) );
	add_shortcode( 'coord_alta_grupos_global', array( $academica_public, 'coord_alta_grupos_global' ));


	$academica_admin = new Academica_Admin('academica', '0.1');
	add_action('admin_menu', array($academica_admin, 'admin_menu'));
	add_action('admin_menu', array($academica_admin, 'hide_dashboard_menus'), 999);
}
run_academica();