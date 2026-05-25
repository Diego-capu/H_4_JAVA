const item_name = document.getElementById("item-name");
const item_value = document.getElementById("item-value");
const btn_save = document.getElementById("btn-save");
const items_list = document.getElementById("items-list");
const btn_fetch_get = document.getElementById("btn-fetch-get");
const btn_api_sync = document.getElementById("btn-api-sync");
const main_form = document.getElementById("main-form");
const message_container = document.getElementById("message-container");

let itemesArray = []

main_form.addEventListener("submit", function(e) {
    e.preventDefault();
    const textclean = item_name.value.trim(); 
    const textclean2 = item_value.value.trim();
    if (textclean === "" ||  textclean2 === ""){
        alert("ingrese un dato")
        return;
    }else{
        alert("Dato guardado")
    }
    console.log(textclean)
    console.log(textclean2)
});
