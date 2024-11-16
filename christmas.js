//importar función 'initializeApp' de firebase que conectará la URL de la base de datos con el proyecto.
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
// importar funciones de firebase relacionadas a la base de datos: 'getDatabase' para acceder, 'ref' para crear referencias (ubicaciones), 'push' para agregar items a las referencias, 'onValue' para obtener items de las referencias.
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// Declarar el objeto -appSettings- para especificar la URL de la base de datos.
const appSettings = {
    databaseURL: "https://agregar-al-carrito-default-rtdb.firebaseio.com/"
}
// Declarar la variable 'const' -app- que conecta la URL de la base de datos con el proyecto a través de la función 'initializeApp' con el argumento -appSettings- que contiene la URL.
const app = initializeApp(appSettings)
// Declarar la variable 'const' -database- que obtiene la base de datos a traves de la función 'getDatabase' con el argumento -app-.
const database = getDatabase(app)
// Declarar la variable 'const' -shoppingListInDB- que crea la referencia -shoppingList- en la base de datos obtenida mendiante la variable -database-.
const christmasInDB = ref(database, "christmas")

// Declarar las variables 'const' -inputFieldEl- (campo de texto para ingresar items), -addButtonEl- (botón para agregar items a la lista) y -shoppingListEl- (lista de compras) para conectar los elementos HTML a javascript.
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const christmasEl = document.getElementById("christmas-ul")

// Agregar una función 'addEventListener' "click" con la función function () al botón -addButtonEl- para agregar items a la lista.
addButtonEl.addEventListener("click", function() {
    // Declarar la variable 'const' -inputValue- para obtener el valor/texto del campo de texto -inputFieldEl-.
    let inputValue = inputFieldEl.value
    
    // EJECUTAR la función 'push' para agregar items -inputValue- a la ubicación referenciada -shoppingListInDB- si el campo de texto -inputFieldEl- no esta vacío.
    if (inputValue === "") {return}
        push(christmasInDB, inputValue)
    
    // EJECUTAR la función -clearInputFieldEl- para limpiar el campo de texto -inputFieldEl-.
    clearInputFieldEl()
})

// EJECUTAR la función 'onValue' para mostrar(imprimir) la lista de items (obtenida a través de 'function(snapshot)') de -shoppingListInDB- en la base de datos.
onValue(christmasInDB, function(snapshot) {
  // Doble click en el último artículo también elimina -shoppingList- de la base de datos por lo que la función 'onValue' ya no se pueda ejecutar para limpiar hasta el último artículo. If junto con snapshot.exists()' se utiliza para un 'else' cuando no haya artículos en la base de datos.
  if (snapshot.exists()) {
    // Declarar la variable 'const' -itemsArray- para convertir el objeto 'snapshot.val()' en un array a través del método 'Object.values()'. Los métodos 'Object.keys()' y 'Object.entries()' convierten un objeto en un array de claves y entradas (key/value), respectivamente. Snapshot y snapshot.val() son objetos nativos de Firebase.
      let itemsArray = Object.entries(snapshot.val())    
      // EJECUTAR la función -clearShoppingListEl-.
     clearChristmasEl()

      // let i = 0; Declara una variable i y la inicializa con el valor 0. 
      // i < itemsArray.length; Mientras que i sea menor que la longitud del array itemsArray, el bucle seguirá ejecutándose.
      // i++ En cada iteración, el valor de i se incrementará en 1.
      for (let i = 0; i < itemsArray.length; i++) {

          // En cada iteración del bucle, se asigna el elemento actual del array itemsArray en la posición i a la variable currentItem.
          let currentItem = itemsArray[i]
          // Se asigna el primer elemento del array currentItem (que es un array en sí mismo) a la variable currentItemID
          let currentItemID = currentItem[0]
          //De manera similar, se asigna el segundo elemento del array currentItem a la variable currentItemValue.
          let currentItemValue = currentItem[1]

          // EJECUTAR la función -appendItemToShoppingListEl- para agregar el item actual de la iteración a la lista para ser impresa.
          appendItemToChristmasEl(currentItem)
      }
    // Texto "Aún no hay artículos" a mostrar si 'snapshot.exists()' indica que no hay artículos en la base de datos.
  } else {
    christmasEl.innerHTML = "Aún no hay artículos"
  }
      
})

// Función -clearShoppingListEl- para limpiar la lista antes de agregar un nuevo item y reimprimir toda la lista con la función 'onValue'.
function clearChristmasEl() {
    christmasEl.innerHTML = ""
}

// Función -clearInputFieldEl- para limpiar el campo de entrada después de agregar un nuevo item.
function clearInputFieldEl() {
    inputFieldEl.value = ""
}

// Función -appendItemToShoppingListEl- para agregar items a la lista para ser impresa. El nuevo parámetro 'itemValue' recibirá el valor del argumento de reiteración 'itemsArray[i]' cuando se EJECUTE la función 'onValue'.
function appendItemToChristmasEl(item) {
    let itemID = item[0]
    let itemValue =item[1]

  
    // Declarar la variable 'const' -newItem- para crear un nuevo elemento 'li'
    let newEl = document.createElement("li")
    // Insertar contenido de itemValue obtenido de -currentItemValue- declarado en la función 'onValue' en el nuevo elemento <li> creado
    newEl.innerHTML = itemValue
  
  // Función para remover items al hacer doble click
  newEl.addEventListener("dblclick", function() {
    // Declarar variable 'let' -exactLocationOfItemInDB- para llamar el -itemID- del elemento al hacer doble click.
    let exactLocationOfItemInDB = ref(database, `christmas/${itemID}`)
    // función 'remove' importado de Firebase para eliminar los elementos con -itemID- obtenidos por medio de la variable exactLocationOfItemInDB al hacer doble click.
    remove(exactLocationOfItemInDB)
  })
  
    // Agregar el elemento <li> y su contenido al elemento HTML -shoppingListEl-
    christmasEl.append(newEl)
}