<?php

// Obtener la URL de la API desde la configuración
$api_url = get_option('academica_api_url');
$api_key = get_option('academica_api_key');
$args = [
    'headers' => [
        'X-ACADEMICA-API-KEY' => $api_key
    ]
];

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

<!-- Verificar si hay conexión con el sistema -->
<?php if (is_null($payload)) : ?>
    <p><strong>⚠️ Error de conexión con el Sistema Académico.</strong></p>
<?php else : ?>
<div class="centered-container">
<div class="header-container">
    <img src="https://economia.xoc.uam.mx/archivos/loading-screen-axolotl.png" alt="Logo Académica UAM" class="logo">
    <h1 class="title">Sistema académico</h1>
    </div>
    <p>Seleccione el tipo de evaluación que desea administrar:</p>
    <!-- Sección de acceso a tipos de evaluaciones -->
    <div class="evaluation-access">
        <button class="portada-button" onclick="window.location.href='/academica-docentes-programacion/'">Evaluación Global</button>
        <button lcass="protada-button" onclick="window.location.href='/academica-docentes-programacion/?tipo=recuperacion'">Evaluación de Recuperación</button>
    </div>

    <!-- Tabla con el trimestre actual y otros datos -->
    <table class="table-2" style="margin-top: 20px; width:45%!important;">
        <tr>
            <th>📅 Trimestre Actual</th>
            <td><?php echo isset($system_data['trimestre_actual']) ? strtoupper(esc_html($system_data['trimestre_actual'])) : ''; ?></td>
        </tr>
        <tr>
            <th>🎓 Coordinación</th>
            <td><?php echo isset($system_data['coordinacion']) ? esc_html($system_data['coordinacion']) : ''; ?></td>
        </tr>
        <tr>
            <th>🏛️ División</th>
            <td><?php echo isset($system_data['division']) ? esc_html($system_data['division']) : ''; ?></td>
        </tr>
        <tr>
            <th>📚 Plan de Estudios</th>
            <td><?php echo isset($system_data['plan_estudios']) ? esc_html($system_data['plan_estudios']) : ''; ?></td>
        </tr>
    </table><br>

    <a href="https://academica.dlimon.net/docs/docentes" target="_blank">📚 Guía de uso para docentes</a>
</div>

<?php endif; ?>
