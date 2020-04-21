<?php
require_once("paths.php");
include(UTILS . "common.inc.php"); //carga el loadview

function handlerRouter() {
    // echo "HandleRouter CLient";
    if (!empty($_GET['module'])) {
        $URI_module = $_GET['module'];
    } else {
        // $URI_module = 'home';
        $URI_module = 'contact';
        /////PREGUNTAR
        // echo'<script>window.location.href = "./home/list_home/";</script>';
        /////PREGUNTAR
    }

    if (!empty($_GET['function'])) {
        $URI_function = $_GET['function'];
    } else {
        $URI_function = 'list_contact';
        // $URI_function = 'list_home';
    }
    handlerModule($URI_module, $URI_function);
}

function handlerModule($URI_module, $URI_function) {
    $modules = simplexml_load_file(CLIENT_SITE_PATH.'/resources/modules.xml');
    $exist = false;
    // echo "<br>";
    // print_r($modules);
    
    foreach ($modules->module as $module) {
        if (($URI_module === (String) $module->uri)) {
            $exist = true;

            $path = CLIENT_MODULES_PATH . $URI_module . "/controller/controller_" . $URI_module . ".class.php";
            if (file_exists($path)) {
                require_once($path);
                $controllerClass = "controller_" . $URI_module;
                $obj = new $controllerClass;
                // var_dump($obj);
            } else {
                // //die($URI_module . ' - Controlador no encontrado');
                // require_once(VIEW_PATH_INC . "header.php");
                // require_once(VIEW_PATH_INC . "menu.php");
                // require_once(VIEW_PATH_INC . "404.php");
                // require_once(VIEW_PATH_INC . "footer.html");
            }
            handlerfunction(((String) $module->name), $obj, $URI_function);
            break;
        }
    }
    if (!$exist) {
        // require_once(VIEW_PATH_INC . "header.php");
        // require_once(VIEW_PATH_INC . "menu.php");
        // require_once(VIEW_PATH_INC . "404.php");
        // require_once(VIEW_PATH_INC . "footer.html");
    }
}

function handlerfunction($module, $obj, $URI_function) {
    $functions = simplexml_load_file(CLIENT_MODULES_PATH . $module . "/resources/function.xml");
    $exist = false;
    // var_dump($functions);
    foreach ($functions->function as $function) {
        if (($URI_function === (String) $function->uri)) {
            $exist = true;
            $event = (String) $function->name;
            break;
        }
    }
    if (!$exist) {
        // require_once(VIEW_PATH_INC . "header.php");
        // require_once(VIEW_PATH_INC . "menu.php");
        // require_once(VIEW_PATH_INC . "404.php");
        // require_once(VIEW_PATH_INC . "footer.html");
    } else {
        call_user_func(array($obj, $event));
    }
}

handlerRouter();