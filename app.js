//se obtienen elementos del html y son almacenados en variables (const las cuales no se pueden redeclarar, cambiar valor )
const productos = document.getElementById("productos");
const templateCard = document.getElementById("template-card").content;
const fragment = document.createDocumentFragment();
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const buscar = document.getElementById("buscador");
const categories = document.getElementById("categories");
const btnCarrito = document.getElementById("btnCarrito");
let carrito = {};
let allProduct = {};
const noImage = new Image();
noImage.src = './image/noImage.jpg';
//noImage.src ='https://app-bsale-eduardopoblete.herokuapp.com/'

// Ruta para  connexión a la API del backend
const url = "http://localhost:3001/api/product";
const urlCategory = "http://localhost:3001/api/category";

//evento que se dispara cuando se aprieta cualquier tecla dentro del input buscador
//captura lo que va escribiendo el usuario y lo va guardando en una variable
//se genera una consulta XMLHttpRequest a la API y posteriormente BD para ver si existen coincidencias con algun producto
buscar.addEventListener("keyup", () => {
  const name = buscar.value;
  var xhr = new XMLHttpRequest(),
    method = "GET",
    api = url + `/name?name=${name}`;

  xhr.open(method, api, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      let data = JSON.parse(this.responseText);
      console.log(data);
      loadData(data);
    }
  };
  xhr.send();
});

//evento que se dispara cuando se carga el DOM
//se genera una consulta XMLHttpRequest a la API y posteriormente BD para así traer todos los datos de la tabla produto
document.addEventListener("DOMContentLoaded", () => {
  var xhr = new XMLHttpRequest(),
    method = "GET",
    api = url;

  xhr.open(method, api, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      let data = JSON.parse(this.responseText);
      allProduct = data
      console.log(data);
      loadData(data);
    }
  };
  xhr.send();
});

//función que recibe la data de los diferentes eventos de donde es llamada, para cada valor recibido esta función los va cargando en las diferentes etiquetas del templatecard en el HTML
//Cada uno de los elementos (forEach) son creados como nodos independientes(cloneNode), los cuales son alamacenados en un objeto de tipo fragment
//el cual posteriormente es añadido a producto el cual es parte del arbol del DOM.
//Esto se hace para no generar reflow ya que el fragment son nodos del DOM (estan en memoria),pero que no foman parte del arbol del DOM, lo que mejora la performance de la aplicación
const loadData = (data) => {
  productos.innerHTML = "";
  Object.values(data).forEach((producto) => {
    templateCard.querySelector("h5").textContent = producto.name;
    templateCard.querySelector("p").textContent = producto.price;
    if(producto.url_image==null || producto.url_image == "") {
      templateCard.querySelector("img").setAttribute("src",noImage.src);
    }else{
      templateCard.querySelector("img").setAttribute("src",producto.url_image);
    }
    templateCard.querySelector(".btn-dark").dataset.id = producto.id;
    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });
  productos.appendChild(fragment);
};

//Evento que escucha cuando se realiza click en el boton de comprar en cada producto
//se captura el evento (e) y se addCarrito
productos.addEventListener("click", (e) => {
  addcarrito(e);
});

//Función que recibe el evento (e) y pregunta si dentro de la clase contiene el nombre 'btn-dark'
//en el caso de que si lo contenga, esta función llama a la función setCarrito y le envía un objeto con todos los parametros del elemento capturado
const addcarrito = (e) => {
  if (e.target.classList.contains("btn-dark")) {
    setCarrito(e.target.parentElement);
  }
  e.stopPropagation();
};

//Función que recibe un objeto (que es un producto), del cual se puede ingresar a sus valores y almacenarlos en variables (id, nombre, precio)
//Con las ayuda del spread operator  agregamos y concatenamos el producto al carrito de compras 
const setCarrito = (objeto) => {
  const producto = {
    id: objeto.querySelector(".btn-dark").dataset.id,
    nombre: objeto.querySelector("h5").textContent,
    precio: objeto.querySelector("p").textContent,
    cantidad: 1,
  };
  if (carrito.hasOwnProperty(producto.id)) {
    producto.cantidad = carrito[producto.id].cantidad + 1;
  }
  carrito[producto.id] = { ...producto };
  agregarCarrtito();
};


//Función que para cada objeto del carrito agrega los valores del producto en cada una de las etiquetas HTML del templateCarrito 
//se crea un nodo para cada templateCarrito, este es añadido a un fragment el cual posteriormente se añade a un items
//esto manejo de los elementos, nodos y fragments es similar a la función loadData()
const agregarCarrtito = () => {
  items.innerHTML = "";
  Object.values(carrito).forEach((producto) => {
    templateCarrito.querySelector("th").textContent = producto.id;
    templateCarrito.querySelectorAll("td")[0].textContent = producto.nombre;
    templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad;
    templateCarrito.querySelector(".btn-info").dataset.id = producto.id;
    templateCarrito.querySelector(".btn-danger").dataset.id = producto.id;
    templateCarrito.querySelector("span").textContent = producto.cantidad * producto.precio;

    const clone = templateCarrito.cloneNode(true);
    fragment.appendChild(clone);
  });
  items.appendChild(fragment);
  agregarFooter();
};

//Se agrega el footer del carrito de compras
//si esta vacio el carrito añade una etiqueta HTML, si encuentra un elemento en el carrito solamente mostrara los productos del carrito
const agregarFooter = () => {
  footer.innerHTML = "";
  if (Object.keys(carrito).length === 0) {
    footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`;
    return;
  }

  //calculos de acumulador de productos
  const nCantidad = Object.values(carrito).reduce(   (acc, { cantidad }) => acc + cantidad,0);

  //con el acumulador de productos anterior podremos calcular el total del producto en función de la cantidad comprada.
  const nTotal = Object.values(carrito).reduce(
    (acc, { precio, cantidad }) => acc + precio * cantidad, 0 );

  //se añade la cantidad de productos y el total de la compra al templateFooter
  templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
  templateFooter.querySelector("span").textContent = nTotal;
  btnCarrito.textContent =(`Ver Carrito 🛒 ( ${nCantidad} )`)

  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment);

  //función para vaciar carrito
  const vaciarCarrito = document.getElementById("vaciar-carrito");
  vaciarCarrito.addEventListener("click", () => {
    carrito = {};
    agregarCarrtito();
  });
};


//evento que captura si se realizo un click en los botones del items dentro del carrito
items.addEventListener("click", (e) => {
  botonAgregar(e);
});

//si detecta que se apreto el boton 'btn-info' agregara uno a la cantidad del producto
//si detecta que se apreto el boton 'btn-danger' disminuira en uno la cantidad del producto
const botonAgregar = (e) => {
  if (e.target.classList.contains("btn-info")) {
    const producto = carrito[e.target.dataset.id];
    producto.cantidad++;
    carrito[e.target.dataset.id] = { ...producto };
    agregarCarrtito();
  }

  if (e.target.classList.contains("btn-danger")) {
    const producto = carrito[e.target.dataset.id];
    producto.cantidad--;
    if (producto.cantidad === 0) {
      delete carrito[e.target.dataset.id];
    }
    agregarCarrtito();
  }
  e.stopPropagation();
};


//Eveneto que se dispara cuando se carga el DOM element
//realiza una petición XMLHttpRequest para obtener todas las categorias de productos disponibles en la BD
document.addEventListener("DOMContentLoaded", () => {
  var xhr = new XMLHttpRequest(),
    method = "GET",
    api = urlCategory;

  xhr.open(method, api, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      let data = JSON.parse(this.responseText);
      console.log(data);
      loadCategory(data);
    }
  };
  xhr.send();
});


//Función que recibe las categorías desde la BD y las añade como boton al HTML
const loadCategory = (data) => {
  data.map(function (category) {
    let name = category.name.toUpperCase();
    document.querySelector("#categories").innerHTML += `<button type="button" class="btn btn-primary">${name}</button>&nbsp`;
  });
  document.querySelector(
    "#categories"
  ).innerHTML += `<button type="button" class="btn btn-success">SACAR FILTRO</button>&nbsp`;
};

//Función que captura el botón de la categoría donde se realizo el click
//se genera petición XMLHttpRequest para ir a buscar todos los productos de la categoria selecionada
categories.addEventListener("click", (e) => {
  const category_name = e.target.innerText.toLowerCase();
  console.log(category_name);
  if (category_name === "sacar filtro") {
    loadData(allProduct)
  } else {
    var xhr = new XMLHttpRequest(),
      method = "GET",
      api = urlCategory + `/name?name=${category_name}`;

    xhr.open(method, api, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        let data = JSON.parse(this.responseText);
        console.log(data);
        loadData(data);
      }
    };
    xhr.send();
  }
});
