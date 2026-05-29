// ====== 1. CONFIGURACIÓN INICIAL Y SELECCIÓN DEL DOM (TASK 1) ======
const API_URL = "http://localhost:3004/products"; // Asegúrate de usar el puerto de tu json-server
const btn_save = document.getElementById("btn-save");
const items_list = document.getElementById("items-list");
const btn_fetch_get = document.getElementById("btn-fetch-get");
const btn_api_sync = document.getElementById("btn-api-sync");
const main_form = document.getElementById("main-form");
const message_container = document.getElementById("message-container");

// TASK 4: Arreglo global con persistencia de respaldo local
let itemesArray = JSON.parse(localStorage.getItem("itemsArray")) || [];
let IDxx;

// Lógica de control para que los IDs no se repitan al recargar la página
if (itemesArray.length > 0) {
    IDxx = itemesArray[itemesArray.length - 1].id + 1;
} else {
    IDxx = 1;
}

// ====== 2. FORMULARIO: CAPTURA, VALIDACIÓN Y ENVÍO (TASK 2 Y 5) ======
main_form.addEventListener("submit", function (e) {
    e.preventDefault();
    const item_name = document.getElementById("item-name");
    const item_value = document.getElementById("item-value");
    const name_clean = item_name.value.trim();
    const value_clean = item_value.value.trim();
    
    if (name_clean === "" || value_clean === "") {
        alert("ingrese un dato");
        return;
    } else {
        alert("Dato guardado");
        const new_product = {
            id: IDxx,
            name: name_clean,
            value: value_clean
        };
        
        // Guardado Local
        itemesArray.push(new_product);
        render_items();
        localStorage.setItem("itemsArray", JSON.stringify(itemesArray));
        
        // Sincronización API (POST)
        guardarEnServidor(new_product);
    }
    IDxx++;
    item_name.value = "";
    item_value.value = "";
    item_name.focus();
});

// ====== 3. DOM: RENDERIZADO DINÁMICO DE ELEMENTOS (TASK 3) ======
function render_items() {
    items_list.innerHTML = ""; // Limpieza de seguridad

    itemesArray.forEach((new_product) => {
        const li = document.createElement("li");
        const span = document.createElement("span");
        const button_delete = document.createElement("button");
        const button_edit = document.createElement("button");

        span.textContent = new_product.name + " $" + new_product.value + " ";
        
        button_delete.textContent = "eliminar";
        button_delete.dataset.id = new_product.id;

        button_edit.textContent = "editar";
        button_edit.dataset.id = new_product.id;

        li.appendChild(span);
        li.appendChild(button_delete);
        li.appendChild(button_edit);
        items_list.appendChild(li);
    });
}

// ====== 4. DOM: DELEGACIÓN DE EVENTOS (ELIMINAR Y EDITAR) (TASK 3 Y 5) ======
items_list.addEventListener("click", function (e) {
    
    // CASO A: ELIMINAR (DELETE)
    if (e.target.textContent === "eliminar") {
        const idParaEliminar = Number(e.target.dataset.id);

        itemesArray = itemesArray.filter(producto => producto.id !== idParaEliminar);
        localStorage.setItem("itemsArray", JSON.stringify(itemesArray));
        render_items();
        
        eliminarEnServidor(idParaEliminar);
    } 
    
    // CASO B: EDITAR (PUT)
    else if (e.target.textContent === "editar") {
        const idParaEditar = Number(e.target.dataset.id);
        
        // Buscar datos viejos para mostrarlos en el prompt
        const productoActual = itemesArray.find(p => p.id === idParaEditar);
        
        const nuevoNombre = prompt("Nuevo nombre del producto:", productoActual.name);
        const nuevoValor = prompt("Nuevo valor del producto:", productoActual.value);
        
        if (nuevoNombre && nuevoValor) {
            const productoEditado = {
                id: idParaEditar,
                name: nuevoNombre.trim(),
                value: nuevoValor.trim()
            };
            
            // Reemplazar el producto en el arreglo local
            itemesArray = itemesArray.map(p => p.id === idParaEditar ? productoEditado : p);
            localStorage.setItem("itemsArray", JSON.stringify(itemesArray));
            render_items();
            
            actualizarEnServidor(idParaEditar, productoEditado);
        }
    }
});

// ====== 5. CONSUMO DE API: FUNCIONES ASÍNCRONAS CRUD (TASK 5) ======

// POST - Crear producto en el servidor
async function guardarEnServidor(nuevoProducto) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoProducto)
        });
        if (!response.ok) throw new Error("Error al guardar en el servidor");
        console.log("Sincronizado con éxito en la API (POST)");
    } catch (error) {
        console.error("Fallo el POST:", error);
    }
}

// GET - Leer productos al arrancar la página
async function cargarDesdeServidor() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al obtener datos");
        
        const datosServidor = await response.json();
        
        itemesArray = datosServidor;
        localStorage.setItem("itemsArray", JSON.stringify(itemesArray));
        
        // Re-ajustar contador de IDs con los datos frescos del servidor
        if (itemesArray.length > 0) {
            IDxx = itemesArray[itemesArray.length - 1].id + 1;
        }
        
        render_items();
        console.log("Datos cargados desde la API con éxito (GET)");
    } catch (error) {
        console.error("Fallo el GET, usando respaldo de Local Storage:", error);
        render_items();
    }
}

// DELETE - Eliminar producto del servidor por ID
async function eliminarEnServidor(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Error al eliminar en el servidor");
        console.log(`Producto con ID ${id} eliminado de la API (DELETE)`);
    } catch (error) {
        console.error("Fallo el DELETE:", error);
    }
}

// PUT - Actualizar producto completo en el servidor por ID
async function actualizarEnServidor(id, productoEditado) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productoEditado)
        });
        if (!response.ok) throw new Error("Error al actualizar en el servidor");
        console.log(`Producto con ID ${id} actualizado en la API (PUT)`);
    } catch (error) {
        console.error("Fallo el PUT:", error);
    }
}

// ====== 6. ARRANQUE DE LA APLICACIÓN ======
// Arranca la app trayendo la información de la base de datos externa
cargarDesdeServidor();