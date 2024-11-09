/**
@NApiVersion 2.0
@NScriptType UserEventScript
@NModuleScope SameAccount
@Author Kevin Jesus Gonzalez MArtinez
*/
/** (23 - Nov -2022)*/

define(['N/record', 'N/runtime', 'N/currentRecord', 'N/ui/serverWidget', 'N/ui/dialog', 'N/email'], function (record, runtime, currentRecord, serverWidget, dialog, email) {
    var exports = {};
    var idTraslado;

    function beforeLoad(context) {
        try {
            context.form.getField({ id: 'custbody35' }).isMandatory = true;
        } catch (e) {
        }
    }

    /** Nuevas funcionalidades 08/09/2024 */
    /** Mandar correo electrónico a los almacenistas cuando aprueben la orden de traslado. */
    function afterSubmit(context) {
        var newRecord = context.newRecord;
        var oldRecord = context.oldRecord;

        var oldStatus = oldRecord ? oldRecord.getValue({ fieldId: 'status' }) : '';
        var newStatus = newRecord.getValue({ fieldId: 'status' });
        log.error("oldStatus", oldStatus);
        log.error("newStatus", newStatus);

        var formId = newRecord.getValue({ fieldId: 'customform' }); //Formulario
        log.error("formId", formId);
        if (formId == 105) {
            var idSubsidiaria = newRecord.getValue({ fieldId: 'subsidiary' });
            var idLocationOrig = newRecord.getValue({ fieldId: 'location' });
            var idLocationDest = newRecord.getValue({ fieldId: 'transferlocation' });
            var usuarios = runtime.getCurrentUser();
            log.error("idSubsidiaria", idSubsidiaria);
            log.error("idLocationOrig", idLocationOrig);
            log.error("idLocationDest", idLocationDest);
            log.error("usuarios.id", usuarios.id);
            log.error("usuarios.name", usuarios.name);
            log.error("usuarios.role", usuarios.role);

            /* ************************************************************************************************************* */
            // | Usuarios.role         | usuarios.id & usuarios.name |   Sucursal    |  Correo electrónico          |
            // |-----------------------|-----------------------------|---------------|------------------------------|
            // | id = Almacenista      | id  = usuario1              |id = sucursal1 |usuario1@ferrepacifico.com.mx |
            // | id = Almacenista      | id  = usuario2              |id = sucursal2 |usuario2@ferrepacifico.com.mx |
            // | id = Almacenista      | id  = usuario3              |id = sucursal3 |usuario3@ferrepacifico.com.mx |
            // | id = Almacenista      | id  = usuario4              |id = sucursal4 |usuario4@ferrepacifico.com.mx |
            // | id = Almacenista      | id  = usuario5              |id = sucursal5 |usuario5@ferrepacifico.com.mx |
            // | id = Almacenista      | id  = usuario6              |id = sucursal6 |usuario6@ferrepacifico.com.mx |
            // | id = Almacenista      | id  = usuario7              |id = sucursal7 |usuario7@ferrepacifico.com.mx |
            /* ************************************************************************************************************* */

            var locationMapping = {// Localización de correos mediante las ubicaciones establecidas
                '23': { // sucursal5
                    '1': ['usuario5@ferrepacifico.com.mx', 'usuario4@ferrepacifico.com.mx'], // sucursal4
                    '2': ['usuario5@ferrepacifico.com.mx', 'usuario6@ferrepacifico.com.mx'], // sucursal6
                    '3': ['usuario5@ferrepacifico.com.mx', 'usuario3@ferrepacifico.com.mx'], // sucursal3
                    '4': ['usuario5@ferrepacifico.com.mx', 'usuario7@ferrepacifico.com.mx'], // sucursal7
                    '5': ['usuario5@ferrepacifico.com.mx', 'usuario2@ferrepacifico.com.mx'], // sucursal2
                    '6': ['usuario5@ferrepacifico.com.mx', 'usuario1@ferrepacifico.com.mx'] // sucursal1
                },
                '6': { // sucursal1
                    '1': ['usuario1@ferrepacifico.com.mx', 'usuario4@ferrepacifico.com.mx'], // sucursal4
                    '2': ['usuario1@ferrepacifico.com.mx', 'usuario6@ferrepacifico.com.mx'], // sucursal6
                    '3': ['usuario1@ferrepacifico.com.mx', 'usuario3@ferrepacifico.com.mx'], // sucursal3
                    '4': ['usuario1@ferrepacifico.com.mx', 'usuario7@ferrepacifico.com.mx'], // sucursal7
                    '5': ['usuario1@ferrepacifico.com.mx', 'usuario2@ferrepacifico.com.mx'], // sucursal2
                    '23': ['usuario1@ferrepacifico.com.mx', 'usuario5@ferrepacifico.com.mx'] // sucursal5
                },
                '5': { // sucursal2
                    '1': ['usuario2@ferrepacifico.com.mx', 'usuario4@ferrepacifico.com.mx'], // sucursal4
                    '2': ['usuario2@ferrepacifico.com.mx', 'usuario6@ferrepacifico.com.mx'], // sucursal6
                    '3': ['usuario2@ferrepacifico.com.mx', 'usuario3@ferrepacifico.com.mx'], // sucursal3
                    '4': ['usuario2@ferrepacifico.com.mx', 'usuario7@ferrepacifico.com.mx'], // sucursal7
                    '6': ['usuario2@ferrepacifico.com.mx', 'usuario1@ferrepacifico.com.mx'], // sucursal1
                    '23': ['usuario2@ferrepacifico.com.mx', 'usuario5@ferrepacifico.com.mx'] // sucursal5
                },
                '4': { // sucursal7
                    '1': ['usuario7@ferrepacifico.com.mx', 'usuario4@ferrepacifico.com.mx'], // sucursal4
                    '2': ['usuario7@ferrepacifico.com.mx', 'usuario6@ferrepacifico.com.mx'], // sucursal6
                    '3': ['usuario7@ferrepacifico.com.mx', 'usuario3@ferrepacifico.com.mx'], // sucursal3
                    '5': ['usuario7@ferrepacifico.com.mx', 'usuario2@ferrepacifico.com.mx'], // sucursal2
                    '6': ['usuario7@ferrepacifico.com.mx', 'usuario1@ferrepacifico.com.mx'], // sucursal1
                    '23': ['usuario7@ferrepacifico.com.mx', 'usuario5@ferrepacifico.com.mx'] // sucursal5
                },
                '3': { // sucursal3
                    '1': ['usuario3@ferrepacifico.com.mx', 'usuario4@ferrepacifico.com.mx'], // sucursal4
                    '2': ['usuario3@ferrepacifico.com.mx', 'usuario6@ferrepacifico.com.mx'], // sucursal6
                    '4': ['usuario3@ferrepacifico.com.mx', 'usuario7@ferrepacifico.com.mx'], // sucursal7
                    '5': ['usuario3@ferrepacifico.com.mx', 'usuario2@ferrepacifico.com.mx'], // sucursal2
                    '6': ['usuario3@ferrepacifico.com.mx', 'usuario1@ferrepacifico.com.mx'], // sucursal1
                    '23': ['usuario3@ferrepacifico.com.mx', 'usuario5@ferrepacifico.com.mx'] // sucursal5
                },
                '2': { // sucursal6
                    '1': ['usuario6@ferrepacifico.com.mx', 'usuario4@ferrepacifico.com.mx'], // sucursal4
                    '3': ['usuario6@ferrepacifico.com.mx', 'usuario3@ferrepacifico.com.mx'], // sucursal3
                    '4': ['usuario6@ferrepacifico.com.mx', 'usuario7@ferrepacifico.com.mx'], // sucursal7
                    '5': ['usuario6@ferrepacifico.com.mx', 'usuario2@ferrepacifico.com.mx'], // sucursal2
                    '6': ['usuario6@ferrepacifico.com.mx', 'usuario1@ferrepacifico.com.mx'], // sucursal1
                    '23': ['usuario6@ferrepacifico.com.mx', 'usuario5@ferrepacifico.com.mx'] // sucursal5
                },
                '1': { // sucursal4
                    '2': ['usuario4@ferrepacifico.com.mx', 'usuario6@ferrepacifico.com.mx'], // sucursal6
                    '3': ['usuario4@ferrepacifico.com.mx', 'usuario3@ferrepacifico.com.mx'], // sucursal3
                    '4': ['usuario4@ferrepacifico.com.mx', 'usuario7@ferrepacifico.com.mx'], // sucursal7
                    '5': ['usuario4@ferrepacifico.com.mx', 'usuario2@ferrepacifico.com.mx'], // sucursal2
                    '6': ['usuario4@ferrepacifico.com.mx', 'usuario1@ferrepacifico.com.mx'], // sucursal1
                    '23': ['usuario4@ferrepacifico.com.mx', 'usuario5@ferrepacifico.com.mx'] // sucursal5
                }
            };

            log.error("locationMapping", locationMapping);

            var locationOrigStr = String(idLocationOrig);
            var locationDestStr = String(idLocationDest);

            log.error("locationOrigStr: ", locationOrigStr);
            log.error("locationDestStr: ", locationDestStr);

            if (locationMapping[idLocationOrig] && locationMapping[idLocationOrig][idLocationDest]) {//comp
                var recipientEmails = locationMapping[idLocationOrig][idLocationDest];
                log.error("recipientEmails", recipientEmails);
                if (idSubsidiaria == 2) {
                    if (newStatus == 'B') {
                        log.debug('Orden de Traslado Aprobada', 'La orden de traslado con ID ' + newRecord.id + ' ha sido aprobada. ');

                        var transferOrderId = newRecord.id;
                        var tranid = newRecord.getValue({ fieldId: 'tranid' });

                        //var accountId = runtime.accountId;  //Esta variable funcionará en productivo en sandbox no porque en vez de poner un '-' pone un '_' y no puede entrar por ende, solo para Sandbox se   tendrá que comentar, pero en productivo tiene que habilitarse.
                        var accountId = 'numero-sb2'; //Esta variable solo sirve en Sandbox.
                        var orderUrl = 'https://' + accountId + '.app.netsuite.com/app/accounting/transactions/trnfrord.nl?id=' + transferOrderId;

                        //Formularemos el cuerpo del correo electrónico
                        var subject = 'Orden de Traslado Aprobada';
                        var body = 'La orden de traslado con número de documento <b>' + tranid + '</b> ha sido aprobada y está  lista para su cumplimiento. ';
                        body += '<br><br>Puedes acceder a la orden de traslado haciendo clic en el siguiente enlace: <a href="' + orderUrl + '" target="_blank">Ver Orden de Traslado</a><br><br>';
                        try {
                            email.send({
                                author: runtime.getCurrentUser().id,
                                recipients: recipientEmails,
                                subject: subject,
                                body: body
                            });

                            log.debug('Correo Enviado', 'Correo enviado con éxito a ' + recipientEmails.join(', '));
                        } catch (e) {
                            log.error('Error al enviar correo', 'Hubo un error al intentar enviar el correo: ' + e.message);
                        }
                    } else {
                        log.error("No esta en aprobación Pendiente");
                    }
                }
            } else {
                log.debug('Combinación de ubicaciones no encontrada', 'No se encontró una combinación válida de ubicación origen y destino. locationOrig: ' + locationOrigStr + ' , locationDest: ' + locationDestStr);
            }
        } else {
            log.debug('Formulario Incorrecto', 'El formulario no es el correcto. No se enviará el correo.');
        }


    }

    function beforeSubmit(context) {
        var newRecord = context.newRecord;
        var idSubsidiaria = newRecord.getValue({ fieldId: 'subsidiary' });
        var idLocationOrig = newRecord.getValue({ fieldId: 'location' });
        var idLocationDest = newRecord.getValue({ fieldId: 'transferlocation' });
        var usuarios = runtime.getCurrentUser();

        if (usuarios.id == 3669) {

            var orderstatus = newRecord.getValue({ fieldId: 'orderstatus' });
            log.debug("orderstatus", orderstatus);
            newRecord.setValue({
                fieldId: 'orderstatus',
                value: 'B'
            });
            var locationMapping = {// Localización de correos mediante las ubicaciones establecidas
                '23': { // sucursal5
                    '1': ['usuario5@ferrepacifico.com.mx', 'usuario4@ferrepacifico.com.mx'], // sucursal4
                    '2': ['usuario5@ferrepacifico.com.mx', 'usuario6@ferrepacifico.com.mx'], // sucursal6
                    '3': ['usuario5@ferrepacifico.com.mx', 'usuario3@ferrepacifico.com.mx'], // sucursal3
                    '4': ['usuario5@ferrepacifico.com.mx', 'usuario7@ferrepacifico.com.mx'], // sucursal7
                    '5': ['usuario5@ferrepacifico.com.mx', 'usuario2@ferrepacifico.com.mx'], // sucursal2
                    '6': ['usuario5@ferrepacifico.com.mx', 'usuario1@ferrepacifico.com.mx'] // sucursal1
                },
                '6': { // sucursal1
                    '1': ['usuario1@ferrepacifico.com.mx', 'usuario4@ferrepacifico.com.mx'], // sucursal4
                    '2': ['usuario1@ferrepacifico.com.mx', 'usuario6@ferrepacifico.com.mx'], // sucursal6
                    '3': ['usuario1@ferrepacifico.com.mx', 'usuario3@ferrepacifico.com.mx'], // sucursal3
                    '4': ['usuario1@ferrepacifico.com.mx', 'usuario7@ferrepacifico.com.mx'], // sucursal7
                    '5': ['usuario1@ferrepacifico.com.mx', 'usuario2@ferrepacifico.com.mx'], // sucursal2
                    '23': ['usuario1@ferrepacifico.com.mx', 'usuario5@ferrepacifico.com.mx'] // sucursal5
                },
                '5': { // sucursal2
                    '1': ['usuario2@ferrepacifico.com.mx', 'usuario4@ferrepacifico.com.mx'], // sucursal4
                    '2': ['usuario2@ferrepacifico.com.mx', 'usuario6@ferrepacifico.com.mx'], // sucursal6
                    '3': ['usuario2@ferrepacifico.com.mx', 'usuario3@ferrepacifico.com.mx'], // sucursal3
                    '4': ['usuario2@ferrepacifico.com.mx', 'usuario7@ferrepacifico.com.mx'], // sucursal7
                    '6': ['usuario2@ferrepacifico.com.mx', 'usuario1@ferrepacifico.com.mx'], // sucursal1
                    '23': ['usuario2@ferrepacifico.com.mx', 'usuario5@ferrepacifico.com.mx'] // sucursal5
                },
                '4': { // sucursal7
                    '1': ['usuario7@ferrepacifico.com.mx', 'usuario4@ferrepacifico.com.mx'], // sucursal4
                    '2': ['usuario7@ferrepacifico.com.mx', 'usuario6@ferrepacifico.com.mx'], // sucursal6
                    '3': ['usuario7@ferrepacifico.com.mx', 'usuario3@ferrepacifico.com.mx'], // sucursal3
                    '5': ['usuario7@ferrepacifico.com.mx', 'usuario2@ferrepacifico.com.mx'], // sucursal2
                    '6': ['usuario7@ferrepacifico.com.mx', 'usuario1@ferrepacifico.com.mx'], // sucursal1
                    '23': ['usuario7@ferrepacifico.com.mx', 'usuario5@ferrepacifico.com.mx'] // sucursal5
                },
                '3': { // sucursal3
                    '1': ['usuario3@ferrepacifico.com.mx', 'usuario4@ferrepacifico.com.mx'], // sucursal4
                    '2': ['usuario3@ferrepacifico.com.mx', 'usuario6@ferrepacifico.com.mx'], // sucursal6
                    '4': ['usuario3@ferrepacifico.com.mx', 'usuario7@ferrepacifico.com.mx'], // sucursal7
                    '5': ['usuario3@ferrepacifico.com.mx', 'usuario2@ferrepacifico.com.mx'], // sucursal2
                    '6': ['usuario3@ferrepacifico.com.mx', 'usuario1@ferrepacifico.com.mx'], // sucursal1
                    '23': ['usuario3@ferrepacifico.com.mx', 'usuario5@ferrepacifico.com.mx'] // sucursal5
                },
                '2': { // sucursal6
                    '1': ['usuario6@ferrepacifico.com.mx', 'usuario4@ferrepacifico.com.mx'], // sucursal4
                    '3': ['usuario6@ferrepacifico.com.mx', 'usuario3@ferrepacifico.com.mx'], // sucursal3
                    '4': ['usuario6@ferrepacifico.com.mx', 'usuario7@ferrepacifico.com.mx'], // sucursal7
                    '5': ['usuario6@ferrepacifico.com.mx', 'usuario2@ferrepacifico.com.mx'], // sucursal2
                    '6': ['usuario6@ferrepacifico.com.mx', 'usuario1@ferrepacifico.com.mx'], // sucursal1
                    '23': ['usuario6@ferrepacifico.com.mx', 'usuario5@ferrepacifico.com.mx'] // sucursal5
                },
                '1': { // sucursal4
                    '2': ['usuario4@ferrepacifico.com.mx', 'usuario6@ferrepacifico.com.mx'], // sucursal6
                    '3': ['usuario4@ferrepacifico.com.mx', 'usuario3@ferrepacifico.com.mx'], // sucursal3
                    '4': ['usuario4@ferrepacifico.com.mx', 'usuario7@ferrepacifico.com.mx'], // sucursal7
                    '5': ['usuario4@ferrepacifico.com.mx', 'usuario2@ferrepacifico.com.mx'], // sucursal2
                    '6': ['usuario4@ferrepacifico.com.mx', 'usuario1@ferrepacifico.com.mx'], // sucursal1
                    '23': ['usuario4@ferrepacifico.com.mx', 'usuario5@ferrepacifico.com.mx'] // sucursal5
                }
            };

            log.error("locationMapping", locationMapping);

            var locationOrigStr = String(idLocationOrig);
            var locationDestStr = String(idLocationDest);

            log.error("locationOrigStr: ", locationOrigStr);
            log.error("locationDestStr: ", locationDestStr);

            if (locationMapping[idLocationOrig] && locationMapping[idLocationOrig][idLocationDest]) {//comp
                var recipientEmails = locationMapping[idLocationOrig][idLocationDest];
                log.error("recipientEmails", recipientEmails);
                if (idSubsidiaria == 2) {
                    if (orderstatus == 'A') {
                        log.debug('Orden de Traslado Aprobada', 'La orden de traslado con ID ' + newRecord.id + ' ha sido aprobada. ');

                        var transferOrderId = newRecord.id;
                        var tranid = newRecord.getValue({ fieldId: 'tranid' });

                        var accountId = runtime.accountId;  //Esta variable funcionará en productivo en sandbox no porque en vez de poner un '-' pone un '_' y no puede entrar por ende, solo para Sandbox se   tendrá que comentar, pero en productivo tiene que habilitarse.
                        //var accountId = '5017898-sb2'; //Esta variable solo sirve en Sandbox.
                        var orderUrl = 'https://' + accountId + '.app.netsuite.com/app/accounting/transactions/trnfrord.nl?id=' + transferOrderId;

                        //Formularemos el cuerpo del correo electrónico
                        var subject = 'Orden de Traslado Aprobada';
                        var body = 'La orden de traslado con número de documento <b>' + tranid + '</b> ha sido aprobada y está  lista para su cumplimiento. ';
                        body += '<br><br>Puedes acceder a la orden de traslado haciendo clic en el siguiente enlace: <a href="' + orderUrl + '" target="_blank">Ver Orden de Traslado</a><br><br>';
                        try {
                            email.send({
                                author: runtime.getCurrentUser().id,
                                recipients: recipientEmails,
                                subject: subject,
                                body: body
                            });

                            log.debug('Correo Enviado', 'Correo enviado con éxito a ' + recipientEmails.join(', '));
                        } catch (e) {
                            log.error('Error al enviar correo', 'Hubo un error al intentar enviar el correo: ' + e.message);
                        }
                    } else {
                        log.error("No esta en aprobación Pendiente");
                    }
                }
            } else {
                log.debug('Combinación de ubicaciones no encontrada', 'No se encontró una combinación válida de ubicación origen y destino. locationOrig: ' + locationOrigStr + ' , locationDest: ' + locationDestStr);
            }

            log.debug('Orden de Traslado Aprobada', 'La orden de traslado con ID ' + newRecord.id + ' ha sido aprobada automáticamente por el usuario con ID ' + usuarios.id);


        } else {
            log.debug('Usuario No Autorizado', 'El usuario con ID ' + usuarios.id + ' no tiene permisos para aprobar la orden de traslado automáticamente.');
        }
    }


    exports.beforeLoad = beforeLoad;
    exports.afterSubmit = afterSubmit;
    exports.beforeSubmit = beforeSubmit;
    return exports;
});
