/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(['N/record', 'N/ui/message', 'N/ui/dialog', 'N/currentRecord'], function (record, message, dialog, currentRecord) {
    function pageInit() {
    }
    function crearOrdenTraspaso() {
        try {
            var datosOrden = {
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
            });
            console.log("Artículo cargado: ", itemRecord);

            var ordenTraspaso = record.create({
                type: record.Type.TRANSFER_ORDER,
                fromId: 105,
                isDynamic: true
            });

            console.log("ordenTraspaso: ", ordenTraspaso);

            for (var i = 0; i < datosOrden.item.length; i++) {
                ordenTraspaso.selectNewLine({ sublistId: 'item' });
                ordenTraspaso.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'item',
                    value: datosOrden.item[i].item
                });
                console.log("Estableciendo artículo:", datosOrden.item[i].item);

                ordenTraspaso.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                    value: datosOrden.item[i].quantity
                });
                console.log("Estableciendo cantidad:", datosOrden.item[i].quantity);

                ordenTraspaso.commitLine({ sublistId: 'item' });
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
            console.log("Motivos de traspaso de mercancia:", datosOrden.motivoTraspaso);

            var idOrden = ordenTraspaso.save();
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
