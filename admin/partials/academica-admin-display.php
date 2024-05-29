<?php

/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       http://example.com
 * @since      0.1
 *
 * @package    Academica
 * @subpackage Academica/admin/partials
 */

echo "<h1>Academica UAM - Administración de Sistema Académico</h1>";
?>

<div class="wrap">
    <h2>Configuración de API</h2>
    <form method="post">
        <table class="form-table">
            <tr valign="top">
                <th scope="row">URL de la API</th>
                <td><input type="text" name="api_url" value="<?php echo get_option('api_url'); ?>" /></td>
            </tr>
            <tr valign="top">
                <th scope="row">API Key</th>
                <td><input type="text" name="api_user" value="<?php echo get_option('api_user'); ?>" /></td>
            </tr>

        </table>
        <input type="submit" name="submit" id="submit" class="button button-primary" value="Guardar cambios">


