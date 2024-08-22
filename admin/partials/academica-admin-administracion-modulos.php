<?php 

echo "<h1>Académica UAM - Administración de Módulos</h1>";

/*
Endpoints a consultar:

https://academica.dlimon.net/componentes

https://academica.dlimon.net/modulos

*/

// Fetch data from /modulos endpoint
$api_url = get_option('academica_api_url');
$modulos_json = file_get_contents($api_url . '/modulos');
$modulos_data = json_decode($modulos_json, true);

// Check if the data was fetched successfully
if ($modulos_data['status'] == 200) {
    $modulos = $modulos_data['data'];
} else {
    echo "<p>Error fetching modules data.</p>";
    $modulos = [];
}

?>

<!-- Popup Mapeo Componentes-->
<div id="popupForm" class="popup" style="display:none;">
    <div class="popup-content">
        <span class="closeBtn">&times;</span>
        <h2>Componentes del Módulo</h2>
        <form id="componentesForm">
            <div id="componentesList">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre del Componente</th>
                            <th>Ponderación</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody id="componentesListBody">
                        <!-- Componentes agregados se agregarán aquí -->
                    </tbody>
                </table>
            </div>
            <h3>Agregar Componentes</h3>
            <div id="catalogoComponentes">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre del Componente</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody id="catalogoComponentesBody">
                        <!-- Componentes disponibles se agregarán aquí -->
                    </tbody>
                </table>
            </div>
            <button type="button" id="saveChangesBtn">Guardar Cambios</button>
        </form>
    </div>
</div>


<!-- Popup Registrar Módulo -->
<div id="popupRegistrarModulo" class="popup" style="display:none;">
    <div class="popup-content">
        <span class="closeBtn">&times;</span>
        <h2>Registrar Módulo</h2>
        <form id="registrarModuloForm">
            <label for="claveUea">Clave UEA:</label>
            <input type="text" id="claveUea" name="claveUea" required>
            <label for="nombreUea">Nombre UEA:</label>
            <input type="text" id="nombreUea" name="nombreUea" required>
            <label for="modulo">Módulo:</label>
            <input type="text" id="modulo" name="modulo" required>
            <button type="button" id="addModuloBtn">Agregar Módulo</button>
        </form>
        <h3>Eliminar Módulo</h3>
        <div id="modulosList">
            <!-- Lista de módulos se agregará aquí -->
        </div>
    </div>
</div>

<h2>Lista de Módulos</h2>

<div style="text-align: center;">
    <button id="registrarModuloBtn">Registrar Módulo</button>
    <button id="registrarComponenteBtn">Registrar Componente</button>
</div>

<table class="table-2">


    <thead>
        <tr>
            <th>Clave UEA</th>
            <th>Nombre UEA</th>
            <th>Módulo</th>
            <th>Componentes</th>
        </tr>
    </thead>
    <tbody>
        <?php foreach ($modulos as $modulo): ?>
            <tr>
                <td><?php echo htmlspecialchars($modulo['clave_uea']); ?></td>
                <td><?php echo htmlspecialchars($modulo['nombre_uea']); ?></td>
                <td><?php echo htmlspecialchars($modulo['modulo']); ?></td>
                <td><button class="componentesBtn" data-modulo-id="<?php echo htmlspecialchars($modulo['clave_uea']); ?>">Componentes</button></td>
            </tr>
        <?php endforeach; ?>
    </tbody>
</table>

<script src="<?php echo plugins_url('/js/academica-admin-modulos.js', dirname(__FILE__)); ?>"></script>