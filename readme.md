
### Descripción
Esta es una aplicación Frontend desarrollada con HTMl y JavaScript


### Proceso de inicio (LOCAL)
* En primer lugar si deseamos iniciar la aplicación de forma local, debemos instalar [XAMPP](https://www.apachefriends.org/es/index.html/)(u otra aplicación), que nos permita levantar un servidor  web local, una vez instalada, abriremos la aplicación e inicializaremos los servicios de ```apache```, de esta forma se creará un servidor local en la dirección ```http://localhost```.
* Para poder visualizar nuestra aplicación en el servidor web local levantado en el paso anterior, debemos mover nuestra carpeta de frontend a la carpeta htdocs del programa XAMPP.
* Luego de esto,  nos dirigimos al directorio donde tenemos todo nuestro backend, abrimos una terminal  y ejecutamos el comando ```(npm start)```, de esta forma NodeJS levantará el servidor en el puerto ```:3001```,(configurado para este proyecto en particular).
* Una vez realizado esto, desde nuestra aplicación Xampp en el servicio Apache, seleccionaremos la opción admin, esto abrira un buscador web que ejecutará la aplicación desde su archivo ```index.html``` del directorio del frontend.
  

### Estructura del codigo
* El archivo ```index.php``` es nuestro archivo principal y es de donde se ejecutará nuestra aplicación, tiene un llamado al archivo ```index.html``` quier cargará todos los aspectos visuales e importará las diferentes funcionalidades que nuestra aplicación web tiene.
* El archivo ```app.js``` desarrollado en ```Vainilla JavaScript```, contiene toda la logica de programación que hace funcionar la aplicación web, entre ellas:
   - XMLHttpRequest para peticiones a BD
   - Carga de producto
   - Input de Buscador de producto
   - Despliege de categorías de productos
   - Creación de carrito de comprar
* La carpeta ```/image```, cotiene las distintas imagenes que son utilizadas y cargadas en el DOM.
* La carpeta ```/css```, contiene el archivo de stilos personalizados que fueron declarados.  


