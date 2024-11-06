<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    check_admin_referer('academica_api_config_nonce');

    // Guardar los valores de configuración en wp_options
    update_option('academica_api_url', sanitize_text_field($_POST['academica_api_url']));
    update_option('academica_api_key', sanitize_text_field($_POST['academica_api_key']));
    update_option('academica_coordinador', sanitize_email($_POST['academica_coordinador']));

    // Imprimir JavaScript para redirigir después de procesar el formulario
    echo '<script type="text/javascript">
        window.location.href = "' . esc_url(admin_url('admin.php?page=academica')) . '";
    </script>';
    exit();
}

$api_url = get_option('academica_api_url', '');
$api_key = get_option('academica_api_key', '');
$academica_coordinador = get_option('academica_coordinador', '');

?>
<div class="header-container">
    <img src="https://economia.xoc.uam.mx/archivos/loading-screen-axolotl.png" alt="Logo Académica UAM" class="logo">
    <h1 class="title">Configuración de API</h1>
</div>
<form method="POST" class="api-form">
    <p>Configuración de API.</p>
    <?php wp_nonce_field('academica_api_config_nonce'); ?>
    
    <label for="api_url">API URL:</label>
    <input type="text" id="academica_api_url" name="academica_api_url" value="<?php echo esc_attr($api_url); ?>" required>
    <br>
    
    <label for="api_key">API Key:</label>
    <input type="password" id="academica_api_key" name="academica_api_key" value="<?php echo esc_attr($api_key); ?>" required>
    <br>
    
    <label for="coordinator_email">Email de Coordinación:</label>
    <input type="email" id="academica_coordinador" name="academica_coordinador" value="<?php echo esc_attr($academica_coordinador); ?>" required>
    <br><br>
    
    <input type="submit" value="Actualizar">
</form>
