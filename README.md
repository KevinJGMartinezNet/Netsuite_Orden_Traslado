# Netsuite Orden Traslado 
Hola chicos y chicas.



Les mostrare una manera de como hacer una orden de traslado mediante un botón dentro de un proyecto de Suitelet y que llame directamente al ClientScript, tanto con las funcionalidades de isDynamic = true y is Dynamic = False, este ejemplo que les daré es con artículos que nosotros podemos poner, ya solamente el código lo acomodan con los nombres que hayan puesto en sus campos.



## *Suitelet*

- Lo único que se tiene que hacer es insertar el botón y en el functionname: poner el nombre donde lo vamos a llamar, incluyendo en anexar el form.clientScriptModulePath = './nombre_del_archivo.js' o si esta en otra carpeta, poner el nombre antes de la diagonal.



## *ClientScript*

- Aquí es donde hace la funcionalidad de crear una orden de traslado mediante el botón que hicimos dentro del Suitelet, les pasaré dos datos de la diferencia de Dynamic, ya que muchos cometen el error de poner funcionalidades de falso en true y viceversa. 



## La diferencias:

* isDynamic: true: más interactivo, flexible, permite trabajar con subregistros y campos dinámicamente (recomendado cuando se manipulan registros que requieren múltiples operaciones de entrada o modificación).

* isDynamic: false: más rígido y eficiente, sin la carga adicional de funcionalidad dinámica (recomendado cuando solo se necesita crear o modificar un registro con menos interactividad).


### KevinJGMartinezNet
