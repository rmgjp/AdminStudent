var table = $('#table')
var tablaDatos;
var i = 0;

//Método para añadir datos a la tabla.
$('#add').on('click', function () {
    //Se obtienen los datos de las cajas de texto y se agregan a la tabla.
    if(document.getElementById("nombreBox").value){
        var tipoActividad;


        table.bootstrapTable('insertRow',{
            index: i,
            row:{
                nombreCol:  document.getElementById("nombreBox").value,
                valorCol:  document.getElementById('valorBox').value,
                tipoCol: document.getElementById('tipoBox').value,
                descripcionCol: document.getElementById('descripcionBox').value,
            }
        })
        //Se limpian las cajas de texto
        document.getElementById("nombreBox").value = "";
        document.getElementById("valorBox").value = 1;
        document.getElementById("tipoBox").value = 'Investigación';
        document.getElementById('descripcionBox').value ="";
        //Se obtienen los datos de la tabla.
        tablaDatos = table.bootstrapTable('getData');
        //Se convierten los datos de la tabla a JSON.
        document.getElementById("valorTabla").value = JSON.stringify(tablaDatos);
        i = i + 1
        console.log(tablaDatos);
    }
})
//Método para eliminar el elemento(s) seleccionado(s)
$('#remove').on('click', function () {
    //Obtenemos las selecciones que se encuentran en la tabla
    var claves = $.map(table.bootstrapTable('getSelections'), function (row){
        return row.nombreCol
    })
    //se llama al metodo de eliminar de la tabla de bootstrap
    table.bootstrapTable('remove',{
        //Se declara de que campo se obtendran los datos
        field: 'nombreCol',
        //Se leen valores seleccionados
        values: claves
    })
    tablaDatos = table.bootstrapTable('getData');
    document.getElementById("valorTabla").value = JSON.stringify(tablaDatos);
    i = i - 1
    console.log(tablaDatos);
})

input.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        table.bootstrapTable('insertRow',{
            index:i,
            row:{
                nombreCol:  document.getElementById("nombreBox").value,
                valorCol: document.getElementById('valorBox').value,
                tipoCol: document.getElementById("tipoBox").value,
            }
        })
        document.getElementById("nombreBox").value = "";
        document.getElementById("valorBox").value = "";
        document.getElementById("tipoBox").value = "";
    }
    i = i + 1
});