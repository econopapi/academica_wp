<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       http://example.com
 * @since      0.1
 *
 * @package    Academica
 * @subpackage Academica/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Academica
 * @subpackage Academica/admin
 * @author     Your Name <email@example.com>
 */
class Academica_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    0.1
	 * @access   private
	 * @var      string    $academica    The ID of this plugin.
	 */
	private $academica;

	/**
	 * The version of this plugin.
	 *
	 * @since    0.1
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    0.1
	 * @param      string    $academica       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $academica, $version ) {

		$this->academica = $academica;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    0.1
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in academica_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Academica_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->academica, plugin_dir_url( __FILE__ ) . 'css/academica-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    0.1
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Academica_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Academica_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->academica, plugin_dir_url( __FILE__ ) . 'js/academica-admin.js', array( 'jquery' ), $this->version, false );



	}

	public function admin_menu() {
		add_menu_page('Académica',
						'Académica UAM',
						'manage_options',
						'academica',
						array($this, 'academica_admin_page'),
						'dashicons-welcome-learn-more',
						1);

		add_submenu_page('academica',
						'Academica UAM - Administración de Trimestre',
						'Administración de Trimestre',
						'manage_options',
						'academica_trimestre',
						array($this, 'academica_admin_trimestre_page'));

		add_submenu_page('academica',
						'Academica UAM - Alta de Grupos (Evaluación Global)',
						'Alta de Grupos (Evaluación Global)',
						'manage_options',
						'academica_grupos_global',
						array($this, 'academica_admin_alta_grupos_global_page'));

		add_submenu_page('academica',
						'Academica UAM - Alta de Grupos (Evaluación de Recuperación)',
						'Alta de Grupos (Evaluación de Recuperación)',
						'manage_options',
						'academica_grupos_recuperacion',
						array($this, 'academica_admin_alta_grupos_recuperacion_page'));

		add_submenu_page('academica',
						'Academica UAM - Administración de Docentes',
						'Administración de Docentes',
						'manage_options',
						'academica_docentes',
						array($this, 'academica_admin_docentes_page'));


		//add_submenu_page('academica', 'Academica Settings', 'Settings', 'manage_options', 'academica_settings', array($this, 'academica_settings_page'));
	}

	public function academica_admin_page() {
		include 'partials/academica-admin-display.php';
	}

	public function academica_admin_docentes_page() {
		include 'partials/academica-admin-docentes.php';
	}

	public function academica_admin_trimestre_page() {
		include 'partials/academica-admin-trimestre.php';
	}

	public function academica_admin_alta_grupos_global_page() {
		include 'partials/academica-admin-alta-grupos-global.php';
	}

	public function academica_admin_alta_grupos_recuperacion_page() {
		include 'partials/academica-admin-alta-grupos-recuperacion.php';
	}

}
