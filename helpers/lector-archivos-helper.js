const fs = require('fs');
const path = require('path');
const ConversorToJSON = require('html-table-to-json');

function leerArchivo(file) {
    var txtFile = path.join(__dirname, '../public/doc/' + file);
    fs.readFile(txtFile, "utf-8", (err, data) => {
        if (err) {
            throw err;
        } else {
            var palabras = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'No', 'CF', 'ST'];
            var jsonTables = ConversorToJSON.parse(data);
            var table = jsonTables.results;

            for(dato in table){

                console.log("Dato: \n" + {dato});
            }
            //console.log(table);
        }
    })
}


/*

    var keyToDelete = "key1";
    var myObj = {"test": {"key1": "value", "key2": "value"}}
    delete myObj[keyToDelete];

 *
 *   let value="test";
 let myjsonobj = {
          "employeeid": "160915848",
          "firstName": "tet",
          "lastName": "test",
          "email": "test@email.com",
          "country": "Brasil",
          "currentIndustry": "aaaaaaaaaaaaa",
          "otherIndustry": "aaaaaaaaaaaaa",
          "currentOrganization": "test",
          "salary": "1234567"
    }
 Object.keys(myjsonobj).forEach(function(key){
      if (myjsonobj[key] === value) {
        delete myjsonobj[key];
      }
    });
 console.log(myjsonobj);
 *
 * @type {{leerArchivo: leerArchivo}}
 */
module.exports = {
    leerArchivo
}