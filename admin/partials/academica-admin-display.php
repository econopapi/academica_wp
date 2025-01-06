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

// Obtener la URL de la API desde la configuración
$api_url = get_option('academica_api_url');
$api_key = get_option('academica_api_key');
$args = [
    'headers' => [
        'X-ACADEMICA-API-KEY' => $api_key
    ]];

// Hacer la solicitud GET a la API
$response = wp_remote_get($api_url, $args);

// Verificar si la solicitud fue exitosa
if (is_wp_error($response)) {
    echo 'Error al obtener los datos del sistema académico.';
} else {
    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);

    // Verificar si la respuesta tiene éxito
    if ($data['status'] == 'success' && $data['code'] == 200) {
        $payload = $data['payload'];
        $system_data = $payload['system_data'];
    } else {
        $payload = null;
    }
}
?>
<div class="header-container">
    <img src="https://economia.xoc.uam.mx/archivos/loading-screen-axolotl.png" alt="Logo Académica UAM" class="logo">
    <h1 class="title">Académica UAM</h1>
</div>


<p>Sistema Académico para el Sistema Modular de la UAM Xochimilco.</p>
<p>Consulte la <a href="https://academica.dlimon.net" target="_blank">📚Documentación del proyecto</a> para aprender su correcto uso.</p>


<?php if (is_null($payload)) : ?>
    <p><strong>⚠️ Error de conexión con Sistema Académico.</strong></p>
    <button onclick="window.location.href='admin.php?page=academica_api_config'">Configurar API</button>
<?php endif; ?>


<table class="table-2" style="width:40%!important;">
<h2>Estado del Sistema</h2>
    <tr>
        <th>🤖 Estado del Sistema</th>
        <td>
            <?php 
            if (isset($payload['system_status']) && $payload['system_status'] === 'online') {
                echo '<span style="color: green;">&#x1F7E2; Online</span>';
            } else {
                echo '<span style="color: red;">&#x1F534; Desconectado</span>';
            }
            ?>
        </td>
    </tr>
    <tr>
        <th>💾 Estado de Base de Datos</th>
        <td>
            <?php 
            if (isset($payload['database_status']) && $payload['database_status'] === 'online') {
                echo '<span style="color: green;">&#x1F7E2; Online</span>';
            } else {
                echo '<span style="color: red;">&#x1F534; Desconectado</span>';
            }
            ?>
        </td>
    </tr>
    <tr>
        <th>🔗 API URL</th>
        <td><strong><?php echo str_replace(array('http://', 'https://'), '', $api_url); ?></td></strong>
    </tr>
    <tr>
        <th>🇻 Versión de API</th>
        <td><?php echo isset($payload['api_version']) ? esc_html($payload['api_version']) : ''; ?></td>
    </tr>
</table>

<?php if (!is_null($payload)) : ?>
<table class="table-2" style="width:40%!important;">
<h2>Información del Sistema</h2>
    <tr>
        <th>🎓 Coordinación</th>
        <td><?php echo isset($system_data['coordinacion']) ? esc_html($system_data['coordinacion']) : ''; ?></td>
    </tr>
    <tr>
        <th>📅 Trimestre Actual</th>
        <td><?php echo isset($system_data['trimestre_actual']) ? strtoupper(esc_html($system_data['trimestre_actual'])) : ''; ?></td>
    </tr>
    <tr>
        <th>🏛️ División</th>
        <td><?php echo isset($system_data['division']) ? esc_html($system_data['division']) : ''; ?></td>
    </tr>
    <tr>
        <th>📚 Plan de Estudios</th>
        <td><?php echo isset($system_data['plan_estudios']) ? esc_html($system_data['plan_estudios']) : ''; ?></td>
    </tr>
</table>

<?php endif; ?>


<!-- Sección del Autor -->
<div class="author-section">
    <h2>Autor</h2>
    <div class="author-info">
        <a href="https://dlimon.net" target="_blank">
        <img src="https://dlimon.net/wp-content/uploads/2024/08/dmlm_info.png" alt="Daniel Limón" class="author-icon">
        <div class="author-details">
            <p>💎 Daniel Limón</p>
            <p> 💌 <a href="mailto:dani@dlimon.net">dani@dlimon.net</a></p>
        </div>
    </div>
</div>

