# Supermarket-HTTP-Client-Server

Cliente-Servidor WEB para obtener datos sobre productos de un supermercado.
Creado por Lucas Shoobridge.
Fecha: 2020-09-20

## Pasos a seguir para iniciar:
- Instalar dependencias con el comando: npm i
- Para ejecutar: node app.js
Esto iniciará un servidor HTTP en el puerto 8001 y como DATA_SERVER (supermercado) http://localhost:8080
- Ejecutar con datos parametrizables:
    - PORT: PUERTO donde queremos que escuche
    - _DATA_URL: URL del servidor de datos (supermercado).
    - _DATA_TOKEN: token de autenticación (si es que el supermercado lo requiere).

- Ejemplo del comando parametrizable:
PORT=9001 _DATA_URL=http://localhost:8000 _DATA_TOKEN=390f8888hga135g776h38590b89 node app.js

Con eso se iniciará el servidor en IP/puerto indicados.

## Para realizar llamadas y obtener datos:
Para realizar llamadas y obtener datos de productos, debemos llamar al path: /get indicándole el query_param products.
Nota: se pueden pasar muchos UPC separados por comas ','.

Ejemplo de llamadas:
- Simple: http://localhost:8001/get?products=77912312341
- Múltiple: http://localhost:8001/get?products=77912312341,53478734814,29349823748

Nota: No hay límite de UPC's a pasarle.

Ejemplo de respuesta:

```{"status":"OK","data":{"7793100111556":{"category":"Dentífricos","price_purchase":57.93,"price_wholesale":49.2405,"upc":"7793100111556","price_sale":77.85,"name":"Crema dental Colgate original x 70 grs"},"7792180001665":{"category":"Aceite","price_purchase":143.01,"price_wholesale":121.5585,"upc":"7792180001665","price_sale":180.3,"name":"Aceite de girasol Cañuelas x 1,5 lts"}},"msg":"Los productos se obtuvieron con éxito."}```

## Datos relevantes:

El servidor almacena los datos de los productos en memoria.
La primera vez que se solicita un producto, éste hace una llamada al servidor de datos (supermercado) solicitando los datos. La segunda vez que lo solicita, ya no hará falta, porque ya lo va a tener almacenado en memoria.

Una vez que el servidor se cierra, estos datos se pierden, y debera volver a solicitarlos la primera vez que se solicita uno o muchos productos.

Nota importante: si no logra encontrar los datos en el servidor de datos (supermercado), va a intentarlo cada vez que sea necesario hasta que el mismo lo brinde.