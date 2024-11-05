/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(['N/record', 'N/ui/message', 'N/ui/dialog', 'N/currentRecord'], function (record, message, dialog, currentRecord) {
    function pageInit() {
        console.log("Hola mundo");
    }
    // clientScript
    function crearOrdenTraspaso() {
        try {
            var datosOrden = {// Todos los datos presentados donde ven el dato númerico pueden hacer el cambio con las variables que tengan dentro de su suitelet.
                subsidiary: 2,
                fromlocation: 5,
                tolocation: 23,
                motivoTraspaso: 5,
                item: [
                    {
                        item: 14315,
                        quantity: 70
                    }
                ]
            };

            var itemRecord = record.load({
                type: record.Type.INVENTORY_ITEM,
                id: datosOrden.item[0].item
            });// recalcar que estamos usando el artículo correcto y que en verdad existe.
            console.log("Artículo cargado: ", itemRecord);

            var ordenTraspaso = record.create({
                type: record.Type.TRANSFER_ORDER,
                isDynamic: false  //En este ejemplo usaremos las funcionalidades Dynamic = false
            });

            console.log("ordenTraspaso: ", ordenTraspaso);

            for (var i = 0; i < datosOrden.item.length; i++) { // En este caso si usamos las varables como le comente en el primer comentario, hace un ciclo solo en artículos para que te den todos los artículos dentro de esa orden de traslado, pueden anexar más campos si es necesario.
                ordenTraspaso.insertLine({ // insertLine solamente funciona en False
                    sublistId: 'item',
                    line: i
                });

                ordenTraspaso.setSublistValue({ //Solo funciona en False si llegamos a poner "true", tienen que usar: "selectNewLine"
                    sublistId: 'item',
                    fieldId: 'item',
                    line: i,
                    value: datosOrden.item[i].item
                });
                console.log("Estableciendo artículo:", datosOrden.item[i].item);

                ordenTraspaso.setSublistValue({ //Solo funciona en False si llegamos a poner true, tienen que usar: "setCurrentSublistValue"
                    sublistId: 'item',
                    fieldId: 'quantity',
                    line: i,
                    value: datosOrden.item[i].quantity
                });
                console.log("Estableciendo cantidad:", datosOrden.item[i].quantity);
            }

            ordenTraspaso.setValue({
                fieldId: 'location',
                value: datosOrden.fromlocation
            });
            console.log("Ubicación de origen:", datosOrden.fromlocation);

            ordenTraspaso.setValue({
                fieldId: 'transferlocation',
                value: datosOrden.tolocation
            });
            console.log("Ubicación de destino:", datosOrden.tolocation);

            ordenTraspaso.setValue({
                fieldId: 'subsidiary',
                value: datosOrden.subsidiary
            });
            console.log("Subsidiaria:", datosOrden.subsidiary);

            ordenTraspaso.setValue({
                fieldId: 'custbody35',
                value: datosOrden.motivoTraspaso
            });
            console.log("Motivos de traspaso de mercancía:", datosOrden.motivoTraspaso);

            var idOrden = ordenTraspaso.save(); // guardamos el dato
            alert('Orden de traspaso creada con ID: ' + idOrden);

        } catch (e) {
            console.error('Error al crear la orden de traspaso:', e);
            alert('Error al crear la orden de traspaso: ' + e.message);
        }
    }

    return {
        pageInit: pageInit,
        crearOrdenTraspaso: crearOrdenTraspaso
    };
});
