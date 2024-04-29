<link rel="stylesheet" href="<?php echo plugins_url('/css/academica-public.css', dirname(__FILE__)); ?>">

<?php

/**
 * UI para Coordinación: Alta de grupos global
 *
 * @link       https://dlimon.net/
 * @since      0.1
 *
 * @package    Academica
 * @subpackage Academica/public/partials
 */


require_once("wp-load.php");

$current_user = wp_get_current_user();


if ($current_user->ID != 0 && $current_user->roles[0] == 'administrator') {
    // El usuario está logueado
    $user_id = $current_user->ID;
    $user_login = $current_user->user_login;
    $user_email = $current_user->user_email;
    //$user_email = 'rchavez@correo.xoc.uam.mx';
    $user_roles = $current_user->roles;
    $user_role = !empty($user_roles) ? $user_roles[0] : 'Sin Rol';
} else {
    // redirect to homepage
    wp_redirect(home_url());
}
?>

<h2>Asignación de Grupos - Global</h2>

<div class="evaluacion-componente-head">
<div class="table-2">
    <form class="search-form-2" id="asignacion-form">       
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
                            <option value="24i">24 Invierno</option>
                        </select>
                    </td>
                    <td>
                        <select id="modulo" name="modulo">}
                            <option value="">Módulo</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                        </select>
                    </td>
                    <td>
                        <select id="grupo" name="grupo">
                            <option value="">Grupo</option>
                            <option value="23o">SD01E</option>
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
            <tbody>

            <tr>
                <td>Teoría</td>
                <td><input type="text" name="teoria" placeholder="Número económico" style="width: 100%!important; padding: 2px!important;"></td>
                <td><input type="radio" name ="coordinacion" value="teoria"></td>
            </tr>

            <tr>
                <td>Matemáticas</td>
                <td><input type="text" name="matematicas" placeholder="Número económico" style="width: 100%!important; padding: 2px!important;"></td>
                <td><input type="radio" name ="coordinacion" value="matematicas"></td>
            </tr>

            <tr>
                <td>Taller</td>
                <td><input type="text" name="taller" placeholder="Número económico" style="width: 100%!important; padding: 2px!important;"></td>
                <td><input type="radio" name ="coordinacion" value="taller"></td>
            </tr>   
            
            <tr>
                <td>Investigación</td>
                <td><input type="text" name="investigacion" placeholder="Número económico" style="width: 100%!important; padding: 2px!important;"></td>
                <td><input type="radio" name ="coordinacion" value="investigacion"></td>
            </tr> 
            </tbody>
        </table>

        
        <input type="submit" value="Siguiente">
    </form>
</div>

<script src="<?php echo plugins_url('/js/academica-coord-asignacion-grupos-global.js', dirname(__FILE__)); ?>"></script>