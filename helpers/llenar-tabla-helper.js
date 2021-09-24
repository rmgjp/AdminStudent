let table = $('#table');
let tablaDatos;
let i = 0;

$(function cargarDatos() {
    var lista = document.getElementById("valorTabla").value;
    lista = JSON.parse(lista);
    table.bootstrapTable('load', lista);
    tablaDatos = table.bootstrapTable('getData');
    document.getElementById("valorTabla").value = JSON.stringify(tablaDatos);

});
table.on('editable-save.bs.table', function (e, field, row, oldValue, $el) {
    tablaDatos = table.bootstrapTable('getData');
    document.getElementById("valorTabla").value = JSON.stringify(tablaDatos)
})





