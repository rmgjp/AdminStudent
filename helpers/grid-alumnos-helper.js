var table = $('#table')
var tablaDatos;
var i = 0;

$('#add').on('click', function () {
    table.bootstrapTable('insertRow',{
        index: i,
        row:{
            clave:  document.getElementById("ClaveBox").value,
            nombre: document.getElementById('NombreBox').value,
            apellidos: document.getElementById("ApellidoBox").value,
        }
    })
    document.getElementById("ClaveBox").value = "";
    document.getElementById("NombreBox").value = "";
    document.getElementById("ApellidoBox").value = "";
    tablaDatos = table.bootstrapTable('getData');
    document.getElementById("valorTabla").value = JSON.stringify(tablaDatos);
    i = i + 1
    console.log(tablaDatos);
})

$('#remove').on('click', function () {
    var claves = $.map(table.bootstrapTable('getSelections'), function (row){
        return row.clave
    })
    table.bootstrapTable('remove',{
        field: 'clave',
        values: claves
    })
    tablaDatos = table.bootstrapTable('getData');
    document.getElementById("valorTabla").value = JSON.stringify(tablaDatos);
    i = i - 1
})

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        table.bootstrapTable('insertRow',{
            index:i,
            row:{
                clave:  document.getElementById("ClaveBox").value,
                nombre: document.getElementById('NombreBox').value,
                apellidos: document.getElementById("ApellidoBox").value,
            }
        })
        document.getElementById("ClaveBox").value = "";
        document.getElementById("NombreBox").value = "";
        document.getElementById("ApellidoBox").value = "";
    }
    i = i + 1
});