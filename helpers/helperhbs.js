/**
 * Helper para Handlebars, expande las posibilidades de comparación,
 * permite a Handlebars comparar las variables de los datos.
 */

module.exports = {
    ifeq: function(a, b, options){
        if (a === b) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    bar: function(){
        return "BAR!";
    }
}