<?php
/**
 * Clase que maneja las actualizaciones del plugin Académica
 *
 * @link       https://academica.dlimon.net
 * @since      2.0.1
 *
 * @package    Academica
 * @subpackage Academica/includes
 */

class Academica_Updater {
    private $plugin_slug;
    private $version;
    private $update_server;
    private $plugin_name;

    /**
     * Inicializa la clase y define sus propiedades
     *
     * @since    2.0.1
     */
    public function __construct() {
        $this->plugin_name = 'academica';
        $this->plugin_slug = plugin_basename(ACADEMICA_PLUGIN_FILE);
        $this->version = ACADEMICA_VERSION;
        $this->update_server = 'https://academica.dlimon.net/plugin/'; // Ajusta esta URL a tu servidor

        // Hooks para el sistema de actualización
        add_filter('pre_set_site_transient_update_plugins', array($this, 'check_update'));
        add_filter('plugins_api', array($this, 'plugin_info'), 10, 3);
        add_action('upgrader_process_complete', array($this, 'after_update'), 10, 2);
    }

    /**
     * Verifica si hay actualizaciones disponibles
     *
     * @since    2.0.1
     * @param    object    $transient    Objeto transient de WordPress
     * @return   object    Objeto transient modificado
     */
    public function check_update($transient) {
        if (empty($transient->checked)) {
            return $transient;
        }

        $remote_version = $this->get_remote_version();
        if ($remote_version && version_compare($this->version, $remote_version, '<')) {
            $plugin_info = $this->get_remote_info();
            
            $obj = new stdClass();
            $obj->slug = $this->plugin_name;
            $obj->plugin = $this->plugin_slug;
            $obj->new_version = $remote_version;
            $obj->url = $plugin_info->homepage;
            $obj->package = $plugin_info->download_url;
            $obj->tested = $plugin_info->tested;
            $obj->requires = $plugin_info->requires;
            
            $transient->response[$this->plugin_slug] = $obj;
        }

        return $transient;
    }

    /**
     * Obtiene la información del plugin para la pantalla de detalles
     *
     * @since    2.0.1
     * @param    false|object|array    $result
     * @param    string               $action
     * @param    object               $args
     * @return   false|object
     */
    public function plugin_info($result, $action, $args) {
        if ($action !== 'plugin_information') {
            return $result;
        }

        if ($args->slug !== $this->plugin_name) {
            return $result;
        }

        $remote_info = $this->get_remote_info();
        if ($remote_info) {
            return $remote_info;
        }

        return $result;
    }

    /**
     * Obtiene la versión remota del plugin
     *
     * @since    2.0.1
     * @return   string|bool    Versión del plugin o false en caso de error
     */
    private function get_remote_version() {
        $request = wp_remote_get($this->update_server . 'version.json');
        
        if (!is_wp_error($request) && wp_remote_retrieve_response_code($request) === 200) {
            $response = json_decode(wp_remote_retrieve_body($request));
            if (isset($response->version)) {
                return $response->version;
            }
        }
        
        return false;
    }

    /**
     * Obtiene la información remota del plugin
     *
     * @since    2.0.1
     * @return   object|bool    Información del plugin o false en caso de error
     */
    private function get_remote_info() {
        $request = wp_remote_get($this->update_server . 'info.json');
        
        if (!is_wp_error($request) && wp_remote_retrieve_response_code($request) === 200) {
            return json_decode(wp_remote_retrieve_body($request));
        }
        
        return false;
    }

    /**
     * Acciones a realizar después de una actualización
     *
     * @since    2.0.1
     * @param    object    $upgrader_object    Objeto WordPress Upgrader
     * @param    array     $options            Opciones de actualización
     */
    public function after_update($upgrader_object, $options) {
        if ($options['action'] === 'update' && $options['type'] === 'plugin') {
            // Limpiar cualquier caché después de la actualización
            delete_site_transient('update_plugins');
            wp_cache_flush();
        }
    }
}