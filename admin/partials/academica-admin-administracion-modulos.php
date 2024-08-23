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

<!-- Pantalla de carga -->
<div id="loading-screen" style="display:none">
    <div class="loading-content">
        <img src="https://economia.xoc.uam.mx/archivos/loading-screen-axolotl.png" alt="Cargando" class="loading-image">
        <div class="loader"></div>
    </div>
</div>

<!-- Popup Mapeo Componentes-->
<div id="popupForm" class="popup" style="display:none;">
    <div class="popup-content">
        <span class="closeBtn">&times;</span>
        <h2>Componentes del Módulo</h2>
        <form id="componentesForm">
            <div id="componentesContainer" style="display: flex; justify-content: space-between;">
                <div id="componentesList" style="flex: 1; margin-right: 10px;border: 1px solid #ccc; border-radius: 10px; padding: 5px;">
                    <table>
                        <h3>Mapeo y ponderación de componentes</h3>
                        <p>Composición y ponderaciones actuales del módulo</p>
                        <thead>
                            <tr>
                                <th>Componente</th>
                                <th>Ponderación (0/100)</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody id="componentesListBody">
                            <!-- Componentes agregados se agregarán aquí -->
                        </tbody>
                    </table>
                </div>
                <div id="catalogoComponentes" style="flex: 1; margin-left: 10px;border: 1px solid #ccc; border-radius: 10px; padding: 5px;">
                    <h3>Catálogo de Componentes</h3>
                    <p>Componentes disponibles para mapear en el módulo. Evite repetir componentes en el mismo módulo.</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Componente</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody id="catalogoComponentesBody">
                            <!-- Componentes disponibles se agregarán aquí -->
                        </tbody>
                    </table>
                </div>
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
        <h2>Módulos registrados</h3>
        <div id="modulosList">
            <!-- Lista de módulos se agregará aquí -->
        </div>
    </div>
</div>

<!-- Popup Registrar Componente -->
<div id="popupRegistrarComponente" class="popup" style="display:none;">
    <div class="popup-content">
        <span class="closeBtn">&times;</span>
        <h2>Registrar Componente</h2>
        <form id="registrarComponenteForm">
            <label for="nombreComponente">Clave componente:</label>
            <input type="text" id="nombreComponente" name="nombreComponente" placeholder="metodos-cuantitativos" required>
            <label for="nombreExtensoComponente">Nombre extenso</label>
            <input type="text" id="nombreExtensoComponente" name="nombreExtensoComponente" placeholder="Métodos cuantitativos" required>
            <button type="submit" id="addComponenteBtn">Registrar</button>
        </form>
        <h3>Componentes Registrados</h3>
        <div id="componentesList2">
            <!-- Lista de componentes se agregará aquí -->
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