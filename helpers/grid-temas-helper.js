var table = $('#table')
var tablaDatos;
var i = 0;

$(function cargarDatos() {
    var lista = document.getElementById("valorTabla").value;
    lista = JSON.parse(lista);

    if (lista) {
        console.log("Lista encontrada.")
        var rows = [];
        table.bootstrapTable('load', lista);
        i = lista.length;
        tablaDatos = table.bootstrapTable('getData');
        console.log(tablaDatos);
        document.getElementById("valorTabla").value = JSON.stringify(tablaDatos);
        document.getElementById("numerotema").value = i + 1;
    }
})

$('#table').on('editable-save.bs.table', function (e, field, row, oldValue, $el) {
    tablaDatos = table.bootstrapTable('getData');
    document.getElementById("valorTabla").value = JSON.stringify(tablaDatos);
})


$('#add').on('click', function () {
    if (document.getElementById('numerotema').value && document.getElementById('nombre').value) {

        table.bootstrapTable('append', {
            numerotema: document.getElementById('numerotema').value,
            nombre: document.getElementById('nombre').value,
        });

        document.getElementById("nombre").value = "";
        tablaDatos = table.bootstrapTable('getData');
        document.getElementById("valorTabla").value = JSON.stringify(tablaDatos);
    }
})

$('#remove').on('click', function () {
    var claves = $.map(table.bootstrapTable('getSelections'), function (row) {
        return row.numerotema
    })
    table.bootstrapTable('remove', {
        field: 'numerotema',
        values: claves
    })
    tablaDatos = table.bootstrapTable('getData');
    document.getElementById("valorTabla").value = JSON.stringify(tablaDatos);
})