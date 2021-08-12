let tableTemas = $('#tableTemas');
let tableAlumnos = $('#tableAlumnos');

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

});

tableTemas.on('check.bs.table', function (e, row) {
    document.getElementById('listaTemas').value = JSON.stringify(tableTemas.bootstrapTable('getSelections'));
});

tableTemas.on('uncheck.bs.table', function (e, row) {
    document.getElementById('listaTemas').value = JSON.stringify(tableTemas.bootstrapTable('getSelections'));
});
tableTemas.on('check-all.bs.table', function (e, row) {
    document.getElementById('listaTemas').value = JSON.stringify(table.bootstrapTable('getSelections'));
});
tableTemas.on('uncheck-all.bs.table', function (e, row) {
    document.getElementById('listaTemas').value = JSON.stringify(table.bootstrapTable('getSelections'));
});
tableAlumnos.on('check.bs.table', function (e, row) {
    document.getElementById('listaAlumnos').value = JSON.stringify(tableAlumnos.bootstrapTable('getSelections'));
});

tableAlumnos.on('uncheck.bs.table', function (e, row) {
    document.getElementById('listaAlumnos').value = JSON.stringify(tableAlumnos.bootstrapTable('getSelections'));
});
tableAlumnos.on('check-all.bs.table', function (e, row) {
    document.getElementById('listaAlumnos').value = JSON.stringify(table.bootstrapTable('getSelections'));
});
tableAlumnos.on('uncheck-all.bs.table', function (e, row) {
    document.getElementById('listaAlumnos').value = JSON.stringify(table.bootstrapTable('getSelections'));
});
