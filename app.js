
const btn_save = document.getElementById("btn-save");
const items_list = document.getElementById("items-list");
const btn_fetch_get = document.getElementById("btn-fetch-get");
const btn_api_sync = document.getElementById("btn-api-sync");
const main_form = document.getElementById("main-form");
const message_container = document.getElementById("message-container");
let IDxx = 1
let itemesArray = []

main_form.addEventListener("submit", function (e) {
    e.preventDefault();
    const item_name = document.getElementById("item-name");
    const item_value = document.getElementById("item-value");
    const name_clean = item_name.value.trim();
    const value_clean = item_value.value.trim();
    if (name_clean === "" || value_clean === "") {
        alert("ingrese un dato")
        return;
    } else {
        alert("Dato guardado")
        const new_product = {
            id: IDxx,
            name: name_clean,
            value: value_clean
        };
        itemesArray.push(new_product)
        render_items();
        localStorage.setItem("itemsArray", JSON.stringify(itemesArray));
    }
    IDxx++;
    item_name.value = "";
    item_value.value = "";
    item_name.focus();
    console.log(name_clean)
    console.log(value_clean)
    console.log(itemesArray)
});

function render_items() {
    items_list.innerHTML = "";

    itemesArray.forEach((element, index) => {
        const li = document.createElement("li");
        const span = document.createElement("span");
        const button = document.createElement("button")
        span.textContent = element;
        button.textContent = "eliminar";
        li.appendChild(span);
        li.appendChild(button);
        items_list.appendChild(li);

    })


}
