<?php

echo "<h1>Academica UAM - Configuración de API</h1>";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    check_admin_referer('academica_api_config_nonce');

    update_option('academica_api_url', sanitize_text_field($_POST['academica_api_url']));
    update_option('academica_api_key', sanitize_text_field($_POST['academica_api_key']));
}

$api_url = get_option('academica_api_url', '');
$api_key = get_option('academica_api_key', '');

?>

<form method="POST" class="api-form">
    <p>Configuración de API.</p>
    <?php wp_nonce_field('academica_api_config_nonce'); ?>
    <label for="api_url">URL de la API:</label>
    <input type="text" id="academica_api_url" name="academica_api_url" value="<?php echo esc_attr($api_url); ?>" required>
    <br>
    <label for="api_key">API Key:</label>
    <input type="password" id="academica_api_key" name="academica_api_key" value="<?php echo esc_attr($api_key); ?>" required>
    <br>
    <br>
    <input type="submit" value="Actualizar">
</form>