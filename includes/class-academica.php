<?php

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       http://example.com
 * @since      0.1
 *
 * @package    Academica
 * @subpackage Academica/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      0.1
 * @package    Academica
 * @subpackage Academica/includes
 * @author     Daniel Limon
 */
class Academica {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    0.1
	 * @access   protected
	 * @var      Academica_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    0.1
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $academica;

	/**
	 * The current version of the plugin.
	 *
	 * @since    0.1
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    0.1
	 */
	public function __construct() {
		if ( defined( 'ACADEMICA_VERSION' ) ) {
			$this->version = ACADEMICA_VERSION;
		} else {
			$this->version = '0.1';
		}
		$this->academica = 'academica';

		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();

	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Plugin_Name_Loader. Orchestrates the hooks of the plugin.
	 * - Plugin_Name_i18n. Defines internationalization functionality.
	 * - Plugin_Name_Admin. Defines all hooks for the admin area.
	 * - Plugin_Name_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    0.1
	 * @access   private
	 */
	private function load_dependencies() {

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-academica-loader.php';

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-academica-i18n.php';

		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-academica-admin.php';

		/**
		 * The class responsible for defining all actions that occur in the public-facing
		 * side of the site.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-academica-public.php';

		$this->loader = new Academica_Loader();

	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Plugin_Name_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    0.1
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new Academica_i18n();

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );

	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    0.1
	 * @access   private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new Academica_Admin( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );

	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    0.1
	 * @access   private
	 */
	private function define_public_hooks() {
		$plugin_public = new Academica_Public( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );
	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    0.1
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     0.1
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->academica;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     0.1
	 * @return    Academica_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     0.1
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

	public function after_login_redirect($user_login, $user) {

		// Verifica si el correo pertenece a @correo.xoc.uam.mx
		if (strpos($user->user_email, '@correo.xoc.uam.mx') !== false && !in_array('administrator', $user->roles)) {
			wp_redirect(home_url('academica-docentes-asignacion-recuperacion/'));
			exit;
		} 
		// Verifica si el usuario tiene el rol de administrador
		else if (in_array('administrator', $user->roles)) {
			wp_redirect(admin_url('admin.php?page=academica'));
			exit;
		} 
		// Redirige a la página de inicio si no cumple con las anteriores
		else {
			wp_redirect(home_url());
			exit;
		}
	}
	
	

	public function hide_admin_bar() {
		if (!current_user_can('administrator') && !is_admin()) {
			add_filter('show_admin_bar', '__return_false');
		}
	}

	public function academica_login_menu($items, $args) {
    
		if (is_user_logged_in()) {
			// Si está logueado, añade un enlace de logout
			$items .= '<li class="login-logout-container"><a style="color: white;" href="' . wp_logout_url(home_url()) . '" class="firmar-button">Salir</a></li>';
		} else {
			// Si no está logueado, añade un enlace de login
			$items .= '<li class="login-logout-container"><a style="color:white;" href="' . wp_login_url() . '" class="firmar-button">Acceder</a></li>';
		}
		return $items;
	}

	public function academica_topbar_btn($wp_admin_bar) {
		$args = array(
			'id' => 'academica-topbar-btn',
			'title' => 'UAM - Sistema Académico',
			'href' => admin_url('admin.php?page=academica'),
			'meta' => array(
				'class' => 'academica-topbar-btn',
				'target' => '_blank',
				'title' => 'Administar Sistema Académico',
			));

		$wp_admin_bar->add_node($args);
	}

	public function after_logout_cookies() {
		// Obtener todos los cookies del sitio
		$cookies = $_COOKIE;
	
		// Borrar cada cookie
		foreach ($cookies as $cookie_name => $cookie_value) {
			// Setear el tiempo de expiración de la cookie a un tiempo pasado para eliminarla
			setcookie($cookie_name, '', time() - 3600, '/');
		}

		// Redirigir al usuario a la página de inicio
		wp_redirect(home_url());
		exit();
	}
}
