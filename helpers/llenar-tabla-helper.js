let table = $('#table');
let tablaDatos;
let i = 0;
var selectedIndex;


$(function cargarDatos(){
    var lista = document.getElementById("valorTabla").value;
    lista = JSON.parse(lista);

    if(lista){
        console.log("Lista encontrada.")
        var rows= [];
        for(let dato = 0; dato < lista.length; dato++){
            rows.push(lista[dato]);
        }
        table.bootstrapTable('load', rows);
        i = lista.length;
        tablaDatos = table.bootstrapTable('getData');
        console.log(tablaDatos);
        document.getElementById("valorTabla").value = JSON.stringify(tablaDatos);
    }
})

$('#table').on('editable-save.bs.table', function(e, field, row, oldValue, $el){
    tablaDatos = table.bootstrapTable('getData');
    document.getElementById("valorTabla").value = JSON.stringify(tablaDatos);

})


$(function(){
    $('#table .editable').on('hidden', function(e, reason){

        if(reason === 'save' || reason === 'nochange') {
            var $next = $(this).closest('tr').next().find('.editable');
            console.log($next);
            if(true) {
                setTimeout(function() {
                    $next.editable('show');
                }, 300);
            } else {
                $next.focus();
            }
        }
    });
})


