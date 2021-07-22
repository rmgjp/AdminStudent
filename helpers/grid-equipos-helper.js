let tableTemas = $('#tableTemas');
let tableAlumnos = $('#tableAlumnos');
let tablaDatos;


$(function cargarDatos() {
    let listaTemas = document.getElementById("valorTablaTemas").value;
    listaTemas = JSON.parse(listaTemas);
    console.log(listaTemas);

    let rowsTemas = [];
    for (let dato = 0; dato < listaTemas.length; dato++) {
        rowsTemas.push(listaTemas[dato]);
    }
    tableTemas.bootstrapTable('load', rowsTemas);

    let listaAlumnos = document.getElementById("valorTablaAlumnos").value;
    listaAlumnos = JSON.parse(listaAlumnos);
    console.log(listaAlumnos);

    let rowsAlumnos = [];
    for (let dato = 0; dato < listaAlumnos.length; dato++) {
        rowsAlumnos.push(listaAlumnos[dato]);
    }
    tableAlumnos.bootstrapTable('load', rowsAlumnos);

})