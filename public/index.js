const socket = io();
const productNameInput = document.getElementById('name');
const productPriceInput = document.getElementById('price');
const productUrlInput = document.getElementById('url');
const sendProductButton = document.getElementById('addProduct');

const autorSchema = new normalizr.schema.Entity('autor');
const mensajeSchema = new normalizr.schema.Entity('mensaje', {
    autor: autorSchema,
});


function addListener(socket){
    sendProductButton.addEventListener('click', () =>{
        const nuevoProducto = {
            title: productNameInput.value,
            price: productPriceInput.value,
            url: productUrlInput.value
        }
        socket.emit('nuevo producto', nuevoProducto);
        console.log(nuevoProducto);
    });
}

const uid = function(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

const contenedor_productos = document.getElementById('productContainer');
const contenedor_mensajes = document.getElementById('messageContainer');

const form_mensajes = document.getElementById('formMensajes');
const fm = form_mensajes;
const i = (Math.floor(Math.random() * 10));
const nombres = ["juanito", "susanita", "jhonlennon", "donaldtrump", "juanita", "marcos", "vladimir", "karlmarx", "reltih","persona45"];
const apellidos = ["perez", "suarez", "rodriguez", "Ali", "Cebolla", "Juarez", "Marquez", "Capeletti", "apellido1", "apellido2"];
fm[5].value = `imagenRandom${i}.jpg`;
fm[3].value = (Math.floor(Math.random() * 40))+12;
fm[0].value = nombres[i]+"@gmail.com";
fm[2].value = apellidos[i];
fm[1].value = nombres[i];
const enviar_mensaje = document.getElementById('sendMessageButton');


class Mensaje{
    constructor(mail, nombre, apellido, edad, alias, imagen, texto){
        this.autor = {
            alias : alias.value,
            nombre : nombre.value,
            apellido : apellido.value,
            id : mail.value,
            edad : edad.value,
            imagen : imagen.value,
        }
        this.mensaje = texto.value;
        const date = new Date();
        const dia = date.getDay();
        const mes = date.getMonth();
        const year = date.getFullYear();
        const hora = date.getHours();
        const minutos = date.getMinutes();
        this.fecha = `${dia}-${mes}-${year}, ${hora}:${minutos}`;
        this.id = uid();
    }
}


async function main(){
    const socket = io();

    const response = await fetch('main.hbs')
    const textResponse = await response.text();
    const hbsTemplate = Handlebars.compile(textResponse);
    addListener(socket);



    socket.on('productos', (productos)=>{
       // console.log({productos});
        //const productosHtml = hbsTemplate({productos});
        //contenedor_productos.innerHTML = productosHtml;
    })

    enviar_mensaje.addEventListener('click', () =>{
        const nuevoMensaje = new Mensaje(...fm);
        socket.emit('nuevo mensaje', nuevoMensaje);
    });

    const mensajesResponse = await fetch('mensajes.hbs');
    const mensajeText = await mensajesResponse.text();
    const mensajeTemplate = Handlebars.compile(mensajeText);

    socket.on('mensajes', (mensajes) =>{
        const denormalizado = normalizr.denormalize(mensajes.result, [ mensajeSchema ], mensajes.entities);
        let objects = []
        for(let i = 0; i < denormalizado.length; i++){
            objects.push(denormalizado[i]._doc);
        }
        const mensajesHtml = mensajeTemplate({objects});
        contenedor_mensajes.innerHTML = mensajesHtml;

        const sizeNorm = (JSON.stringify(mensajes).length);
        const sizeDenorm = (JSON.stringify(objects).length);

        const porcentaje = document.getElementById("porcentaje");
        porcentaje.innerHTML = `Porcetaje de comprimido: ${Math.floor(100 - sizeDenorm/sizeNorm *100)}%`;
    })




    socket.emit('cargarMensajes');

    const products = await fetch('/api/productos-test');
    const productsText =await products.text();
    const productos = JSON.parse(productsText);
    const html = hbsTemplate({productos});
    contenedor_productos.innerHTML = html;
}


main();