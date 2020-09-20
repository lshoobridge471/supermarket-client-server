// Importamos librerías.
const express = require('express'); // Express, para levantar el servidor.
const fetch = require('node-fetch'); // Fetch, para hacer consultas ajax.
// Generamos la app.
const app = express()
// Indicamos el puerto donde se abrirá el servidor.
const port = process.env.PORT || 8001;

const _DATA_URL = process.env._DATA_URL || 'http://localhost:8000'; // URL de autenticacion.
const _DATA_TOKEN = process.env._DATA_TOKEN || undefined;

// Armamos el manejador para la URL esperada.
app.get('/get', async (request, response) => {
	// Respuesta por defecto.
	let ret = { 'status': 'ERR', 'data': {}, 'msg': 'Ocurrió un error al procesar los datos.' };
	// Nos fijamos que el método sea GET.
	if(request.method === 'GET') {
		// Obtenemos los productos.
		let products_in_memory = app.get('products') || {};
		try {
			// Si se obtuvo la key products
			if(request.query['products']) {
				// Debería venir como strings separados por comas
				// Ej: 77912312341,53478734814,29349823748
				const query_products = request.query['products'].split(','); // Obtenemos un array con los códigos de los productos.
				// Si se obtuvieron productos.
				if(query_products.length) {
					// Filtramos el array de productos que tenemos que traer del servidor,
					// nos fijamos si lo tenemos almacenado o si debemos traerlo.
					const products_get = query_products.filter((value) => !products_in_memory.hasOwnProperty(value));
					// Si hay productos que traer
					if(products_get.length) {
						try {
							// Armamos la URL a llamar para pedir datos de los productos.
							const url = `${_DATA_URL}/get_products?upc_list=${products_get.join(',')}`;
							// Datos que vamos a enviar.
							let data = {
								'method': 'GET',
								'headers': {}
							};
							// Si se especifica un token.
							if(_DATA_TOKEN !== undefined) {
								data['headers']['Authentication'] = _DATA_TOKEN
							}
							// Ejecutamos la llamada al servidor para traer los productos que necesitamos.
							await fetch(url, data)
							.then(res => res.json())
							.then(response => {
								// Si la respuesta fue OK
								if(response.status === 'OK') {
									// Si de recibieron productos.
									if(Object.keys(response.data).length) {
										// Almacenamos los productos en la variable de productos en memoria.
										products_in_memory = Object.assign(products_in_memory, response.data);
										// Y luego los guardamos en memoria..
										app.set('products', products_in_memory);
									}
								} else {
									throw new Error(response.msg);
								}
							})
							.catch((error) => { throw new Error(error) });
						} catch(err) {
							console.error('* Fetch error: '+err);
						}
					}
					// Recorremos los productos que solicitó.
					query_products.forEach(item => {
						try {
							// Lo añadimos al objeto de datos.
							ret['data'][item] = products_in_memory[item];
						} catch(err) { }
					});
					// Devolvemos los datos OK
					ret['msg'] = 'Los productos se obtuvieron con éxito.'
					ret['status'] = 'OK'
				} else {
					ret['msg'] = 'No se especificaron productos.';
				}
			} else {
				res['msg'] = 'Debe especificar los productos que desea obtener.'
			}
		} catch(err) {
			console.error('* Error al procesar los datos: '+err);
			ret['msg'] = 'Error al procesar los datos.';
		}
	} else {
		ret['msg'] = 'Método no permitido.'
	}
	// Devolvemos la respuesta.
	response.json(ret)
})

// Iniciamos el servidor en el puerto indicado.
app.listen(port, () => {
	console.log(`Starting client-server at http://localhost:${port}`);
	// Mostramos los datos.
	console.log('_DATA_URL: '+_DATA_URL);
	if(_DATA_TOKEN) {
		console.log('_DATA_TOKEN: '+_DATA_TOKEN);
	}
})