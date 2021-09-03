let table = $('#table');
let tablaDatos;
let i = 0;

$(function cargarDatos() {
    var lista = document.getElementById("valorTabla").value;
    lista = JSON.parse(lista);

    if (lista){
        var rows = [];
        for (let dato = 0; dato < lista.length; dato++) {
            rows.push(lista[dato]);
        }
        table.bootstrapTable('load', rows);
        i = lista.length;
        tablaDatos = table.bootstrapTable('getData');
        document.getElementById("valorTabla").value = JSON.stringify(tablaDatos);
    }
})

table.on('editable-save.bs.table', function (e, field, row, oldValue, $el) {
    tablaDatos = table.bootstrapTable('getData');
    document.getElementById("valorTabla").value = JSON.stringify(tablaDatos)
    let $next = $(this).closest('tr').next().find('.editable');
    setTimeout(function() {
        $next.editable('show');
    }, );
    console.log($next);
})









