const Knex = require('knex');



const knex = Knex({
    client: 'sqlite3',
    connection: {
        filename: './db/productos.db'
    },
    useNullAsDefault: true
});

class Container{
    constructor(){
        (async function(){
            await knex.schema.dropTableIfExists('productos');
            await knex.schema.createTable('productos', tbl=> {
                tbl.increments('id');
                tbl.string('title');
                tbl.string('price');
                tbl.string('url');
            }).then( () =>{
                console.log('Tabla creada.')
            }).catch( (err) => {console.log(err)});
        })();
    }

    async guardar_producto(producto){
        await knex('productos').insert(producto);
    }
    async cargar_productos(){
        return await knex.from('productos').select('*');
    }
}



module.exports = {container: Container};