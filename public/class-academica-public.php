<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       http://example.com
 * @since      0.1
 *
 * @package    Academica
 * @subpackage Academica/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Academica
 * @subpackage Academica/public
 * @author     Your Name <email@example.com>
 */
class Academica_Public {

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
	 * @param      string    $academica       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $academica, $version ) {

		$this->academica = $academica;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    0.1
	 */
	public function enqueue_styles() {

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

		wp_enqueue_style( $this->academica, plugin_dir_url( __FILE__ ) . 'css/academica-public.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
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

		wp_enqueue_script( $this->academica, plugin_dir_url( __FILE__ ) . 'js/academica-public.js', array( 'jquery' ), $this->version, false );

	}

	public function get_seguimiento_global_grupo($trimestre, $grupo, $detalle) {

		$params = array(
			'trimestre' => $trimestre,
			'grupo' => $grupo,
			'detalle' => $detalle
		);
		
		$query = http_build_query($params);

		$url = 'http://academica.dlimon.net/historial_academico/seguimiento_global_grupo' . $query;

		$response = wp_remote_get($url);
	
		if (is_wp_error($response)) {
			return false;
		}
	
		$body = wp_remote_retrieve_body($response);
		$data = json_decode($body);
	
		return $data;
	}

	public function render_seguimiento_global_grupo() {

		$trimestre = $_GET['trimestre'];
		$grupo = $_GET['grupo'];
		$detalle = $_GET['detalle'];

		$data = $this->get_seguimiento_global_grupo($trimestre, $grupo, $detalle);
	
		if (!$data) {
			echo 'No se pudo obtener los datos de la API.';
			return;
		}
	
		echo print_r($data);
	}

	public function seguimiento_global_grupo() {
		include 'partials/academica-public-seguimiento-global-grupo.php';
	}

	public function seguimiento_recuperacion_grupo() {
		include 'partials/academica-public-seguimiento-recuperacion-grupo.php';
	}

	public function asignacion_docente() {
		include 'partials/academica-public-asignacion-docente.php';
	}

	public function asignacion_docente_recuperacion() {
		include 'partials/academica-public-asignacion-docente-recuperacion.php';
	}

	public function evaluacion_componente_global() {
		include 'partials/academica-public-evaluacion-componente-global.php';
	}

	public function evaluacion_componente_recuperacion() {
		include 'partials/academica-public-evaluacion-componente-recuperacion.php';
	}

	public function coord_alta_grupos_global() {
		include 'partials/academica-public-coord-alta-grupos-global.php';
	}

}
