<?php

/**
 * Interfaz para gestionar grupos en evaluación global y de
 * recuperación para el trimestre actual.
 *
 * @link       http://academica.dlimon.net/docs/devs
 * @since      0.1
 *
 * @package    academica_wp
 * @subpackage academica_wp/admin/partials
 */

if(isset($_GET['tipo'])){
    $tipo = $_GET['tipo'];
    if ($tipo === 'recuperacion'){
        $tipo_evaluacion = 'recuperacion';
    } else {
        $tipo_evaluacion = 'global';
    }
}else{
    $tipo_evaluacion = 'global';
}?>
<script>var tipoEvaluacion = "<?php echo $tipo_evaluacion; ?>"</script>
<div class="header-container">
    <img src="https://economia.xoc.uam.mx/archivos/loading-screen-axolotl.png" alt="Logo Académica UAM" class="logo">
    <h1 class="title">Evaluaciones</h1>
</div>

<p>Gestión de grupos para evaluaciones globales y de recuperación en el trimestre actual. <a href="https://academica.dlimon.net/docs/coordinaciones/alta-de-evaluacion/" target="_blank">📚 Ver tutorial</a></p>
<div id="trimestreActual"></div>
<!-- Pantalla de carga -->
<div id="loading-screen" style="display:block">
    <div class="loading-content">
        <img src="https://economia.xoc.uam.mx/archivos/loading-screen-axolotl.png" alt="Cargando" class="loading-image">
        <div class="loader"></div>
    </div>
</div>

<div class="buttonGroup">
    <div class="toggle-container" id="toggleButton">
        <div class="toggle-option selected" data-value="global">Global</div>
        <div class="toggle-option" data-value="recuperacion">Recuperación</div>
    </div>
    <button id="addGrupoBtn">Registrar evaluación</button>
    <button id="catalogoGruposBtn">Configuración de grupos</button>
</div>


<h2>Evaluaciones registradas</h2>
<table class="table-2" style="margin:0!important;">
    <thead>
        <tr>
            <th>ID</th>
            <th>Trimestre</th>
            <th>Grupo</th>
            <th>Módulo</th>
            <th>Acciones</th>
        </tr>
    </thead>
    <tbody id="gruposTableBody">
        <!-- Grupos se agregarán aquí -->
    </tbody>
</table>

<div id="popupGrupoDetalle" class="popup">
    <div class="popup-content">
        <span class="closeBtn closeGruposDetalle">&times;</span>
        
        <div class="table-2" id="grupoInfoGeneral">
            <!-- Contenido de Información General -->
        </div>
        <div class="table-2" id="grupoInfoDocentes">
            <!-- Contenido de Información de Docentes -->
        </div>
        
        <div class="table-2" id="grupoInfoAlumnos">
            <!-- Contenido de Información de Alumnos -->
        </div>
    </div>
</div>

<div id="popupEvaluacionAusencia" class="popup">
    <div class="popup-content">
        <span class="closeBtn closeEvaluacionAusencia">&times;</span>
        <h3>Evaluacíon por ausencia</h3>
        <p>La coordinación puede evaluar componentes por ausencia del docente asignado, así como finalizar una evaluación completa, en nombre del coordinador/a de módulo.</p>
        
        <div class="table-2" id="evaluacionAusenciaComponentes">
            <!--Mostrar componentes del módulo-->
        </div>
        
        <div id="estatusEvaluacion">
            <!-- Botón para finalizar evaluación-->
        </div>
    </div>
</div>

<div class="popup" id="popupCatalogoGrupos">
    <div class="popup-content">
        <span class="closeBtn closeCatalogoGrupos">&times;</span>
        <h2>Catálogo de Grupos</h2>
        <form class="search-form-2" id="catalogoGruposForm">
        <div style="display: flex; align-items: center;">
            <div id="selectModuloDiv">

                <select name="moduloCatalogoSelect" id="moduloCatalogoSelect">
                    <option value="">Módulo</option>
                </select>

            </div>
            <div id="inputGrupoCatalogoDiv">
                <input type="text" id="grupoCatalogo" name="grupoCatalogo" placeholder="Grupo">                
            </div>
            <div id="buttonGrupoCatalogoDiv">
                <button id="registarGrupoCatalogo" type="button">Registrar grupo</button>
            </div>
            <div>
                <p>Use esta interfaz para gestionar y mapear los grupos que cada módulo puede tener y su respectiva nomenclatura. Se sugiere registrar más grupos para tener holgura al momento de dar de alta seguimientos.</p>
            </div>

        </div>
        </form>        
        <div class="table-2" id="catalogoGruposTable">
            <!-- Aquí se mostrarán los grupos por módulo obtenidos de la API -->
        </div>
    </div>
</div>

<div id="popupAltaGrupo" class="popup" style="display:none;">
    <div class="popup-content">
        <span class="closeBtn closeAltaGruposBtn">&times;</span>
        <div class="table-2">
            <form class="search-form-2" id="asignacion-form" enctype="multipart/form-data">       
                <table class="table-1">     
                    
                    <thead>
                        <tr>
                            <th>Trimestre</th>
                            <th>Módulo</th>
                            <th>Grupo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <select id="trimestre" name="trimestre" disabled>
                                    <option value="">Trimestre</option>
                                </select>
                            </td>
                            <td>
                                <select id="modulo" name="modulo">}
                                    <option value="">Módulo</option>
                                </select>
                            </td>
                            <td>
                                <select id="grupo" name="grupo">
                                    <option value="">Grupo</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <table class="table-1">     
                    
                    <thead>
                        <tr>
                            <th>Componente</th>
                            <th>Docente</th>
                            <th>Coordinación</th>
                        </tr>
                    </thead>
                    <tbody id="componentes-tbody">
                    </tbody>
                </table>

                <table class="table-2">
                    <thead>
                        <tr>
                            <th>
                                Lista de alumnado
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="center-content">
                                <label>El archivo XLSX debe contener únicamente tres columnas con los siguientes encabezados: <strong>número_lista, matricula, nombre_alumno</strong></label>
                                <a href="https://economia.xoc.uam.mx/archivos/grupo_global_muestra.xlsx"><strong>[Descargar plantilla XLSX de ejemplo]</strong></a>                
                            </td>
                        </tr>
                        <tr>
                            <td class="center-content">
                                <input type="file" id="excel_file" name="excel_file" accept=".xlsx">
                            </td>
                        </tr>
                    </tbody>
                </table>


                
                <input type="submit" value="Registrar grupo">
            </form>
        </div>
    </div>

</div>



<script src="https://unpkg.com/xlsx/dist/xlsx.full.min.js"></script>
<script src="<?php echo plugins_url('/js/academica-admin-alta-grupos-global.js', dirname(__FILE__)); ?>"></script>


