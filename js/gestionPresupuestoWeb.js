import * as gp from './gestionPresupuesto.js';


function repintar(){
    mostrarDatoEnId(gp.mostrarPresupuesto(), "presupuesto");
    mostrarDatoEnId(gp.calcularTotalGastos(), "gastos-totales");
    mostrarDatoEnId(gp.calcularBalance(), "balance-total");
    
    let actLista = document.getElementById("listado-gastos-completo");
    actLista.innerHTML='';

    gp.listarGastos().forEach(gasto => {
        mostrarGastoWeb(gasto, "listado-gastos-completo");
    });

    mostrarGastosAgrupadosWeb(gp.agruparGastos("dia"), "día", "agrupacion-dia");
    mostrarGastosAgrupadosWeb(gp.agruparGastos("mes"), "mes", "agrupacion-mes");
    mostrarGastosAgrupadosWeb(gp.agruparGastos("anyo"), "año", "agrupacion-anyo");
}

function actualizarPresupuestoWeb(){
    let presupuesto = prompt("Introduzca presupuesto");
    if(presupuesto != null){
        presupuesto = parseFloat(presupuesto);
        gp.actualizarPresupuesto(presupuesto);
        repintar();
    }
    else{
        alert("El valor introducido no es valido");
    }
}

let btnActualizarPresupuesto = document.getElementById('actualizarpresupuesto');
btnActualizarPresupuesto.onclick = actualizarPresupuestoWeb;

function nuevoGastoWeb(){
    let descripcion = prompt("Introduzca la descripcion");
    let valor = parseFloat(prompt("Introduzca el valor"));
    let fecha = prompt("Introduzca la fecha");
    let etiquetas = prompt("Introduzca las etiquetas").split(',');

    let newGasto = new gp.CrearGasto(descripcion, valor, fecha, etiquetas);
    gp.anyadirGasto(newGasto);
    repintar();
}

let btnAnyadirGasto = document.getElementById('anyadirgasto');
btnAnyadirGasto.onclick = nuevoGastoWeb;

let editarHandle = function(){
    this.handleEvent = function(){
        let descripcion = prompt("Introduzca la descripcion");
        let valor = parseFloat(prompt("Introduzca el valor"));
        let fecha = prompt("Introduzca la fecha");
        let etiquetas = prompt("Introduzca las etiquetas").split(",");

        this.gasto.actualizarDescripcion(descripcion);
        this.gasto.actualizarValor(valor);
        this.gasto.actualizarFecha(new Date(fecha));
        this.gasto.anyadirEtiquetas(etiquetas);
        repintar();
    }
}

let borrarHandle = function(){
    this.handleEvent = function(){
        gp.borrarGasto(this.gasto.id);
        repintar();
    }
}

let borrarEtiquetasHandle = function(){
    this.handleEvent = function(){
        this.gasto.borrarEtiquetas(this.etiqueta);
        repintar();
    }
}

function mostrarDatoEnId(valor, idElemento) {
    if(idElemento != null){
        let elementoHTML = document.getElementById(idElemento);
        elementoHTML.innerHTML += valor;
    }
}

function mostrarGastoWeb(gasto, idElemento) {
    if(idElemento != null){
        let gastoHTML = document.createElement("div");
        gastoHTML.className = "gasto";

        let elementoHTML = document.getElementById(idElemento);
        elementoHTML.appendChild(gastoHTML);

        let descripcionHTML = document.createElement("div");
        descripcionHTML.className = "gasto-descripcion";
        descripcionHTML.innerHTML += gasto.descripcion;
        gastoHTML.appendChild(descripcionHTML);
        
        let fechaHTML = document.createElement("div");
        fechaHTML.className = "gasto-fecha";
        fechaHTML.innerHTML += gasto.fecha;
        gastoHTML.appendChild(fechaHTML);
        
        let valorHTML = document.createElement("div");
        valorHTML.className = "gasto-valor";
        valorHTML.innerHTML += gasto.valor;
        gastoHTML.appendChild(valorHTML);

        let etiquetasHTML = document.createElement("div");
        etiquetasHTML.className = "gasto-etiquetas";
        gastoHTML.appendChild(etiquetasHTML);
        gasto.etiquetas.forEach(etiqueta => {
            let span = document.createElement("span");
            span.className = "gasto-etiquetas-etiqueta";
            span.innerHTML = etiqueta;
            etiquetasHTML.appendChild(span);

            let objBorrarEtiqueta = new borrarEtiquetasHandle();
            objBorrarEtiqueta.gasto = gasto;
            objBorrarEtiqueta.etiqueta = etiqueta;
            span.addEventListener("click", objBorrarEtiqueta);

        });
        gastoHTML.appendChild(etiquetasHTML);

        let btnEditar = document.createElement("button");
        btnEditar.type = "button";
        btnEditar.textContent = "Editar";
        btnEditar.className = "gasto-editar";

        let objEditar = new editarHandle();
        objEditar.gasto = gasto;

        btnEditar.addEventListener("click", objEditar);
        gastoHTML.appendChild(btnEditar);

        let btnBorrar = document.createElement("button");
        btnBorrar.type = "button";
        btnBorrar.textContent = "Borrar";
        btnBorrar.className = "gasto-borrar";

        let objBorrar = new borrarHandle();
        objBorrar.gasto = gasto;

        btnBorrar.addEventListener("click", objBorrar);
        gastoHTML.appendChild(btnBorrar);

        let btnEditarFormulario = document.createElement('button');
        btnEditarFormulario.type = "button";
        btnEditarFormulario.textContent = "Editar (formulario)";
        btnEditarFormulario.classList = "gasto-editar-formulario";

        let objEditarFormulario = new EditarHandleFormulario();
        objEditarFormulario.gasto = gasto;
        objEditarFormulario.gastoHTML = gastoHTML;
        objEditarFormulario.btnEditar = btnEditarFormulario;

        btnEditarFormulario.addEventListener("click", objEditarFormulario);
        gastoHTML.appendChild(btnEditarFormulario);

        var btnBorrarAPI = document.createElement('button');
        btnBorrarAPI.type="button";
        btnBorrarAPI.textContent="Borrar (API)";
        btnBorrarAPI.classList="gasto-borrar";

        var objBorrarAPI = new borrarApiHandle();
        objBorrarAPI.gasto = gasto;

        btnBorrarAPI.addEventListener("click", objBorrarAPI);
        gastoHTML.appendChild(btnBorrarAPI);
    }
}

function mostrarGastosAgrupadosWeb(agrup, periodo, idElemento){
    // Obtener la capa donde se muestran los datos agrupados por el período indicado.
    // Seguramente este código lo tengas ya hecho pero el nombre de la variable sea otro.
    // Puedes reutilizarlo, por supuesto. Si lo haces, recuerda cambiar también el nombre de la variable en el siguiente bloque de código
    var divP = document.getElementById(idElemento);
    // Borrar el contenido de la capa para que no se duplique el contenido al repintar
    divP.innerHTML = "";

    if(idElemento != null) {
        let i = 0;
        let elemento = document.getElementById(idElemento);

        let agrupHTML = document.createElement("div");
        agrupHTML.className = "agrupacion";
            
        let titleH1HTML = document.createElement('h1');
        titleH1HTML.innerHTML = "Gastos agrupados por " + periodo;
        agrupHTML.appendChild(titleH1HTML);
    
        let keys = Object.keys(agrup);
        for(let actualAgroup in agrup){
            let agrupInfoHTML = document.createElement('div');
            agrupInfoHTML.className = "agrupacion-dato";
                
            let keysHTML = document.createElement('span');
            keysHTML.className = "agrupacion-dato-clave";
            keysHTML.innerHTML = keys[i];
            agrupInfoHTML.appendChild(keysHTML);
    
            let valueHTML = document.createElement('span');
            valueHTML.className = "agrupacion-dato-valor";
            valueHTML.innerHTML = agrup[actualAgroup];
            
            agrupInfoHTML.appendChild(valueHTML);
    
            agrupHTML.appendChild(agrupInfoHTML);

            i++;
        }
        
        elemento.appendChild(agrupHTML);
    }
    // Estilos
    divP.style.width = "33%";
    divP.style.display = "inline-block";
    // Crear elemento <canvas> necesario para crear la gráfica
    // https://www.chartjs.org/docs/latest/getting-started/
    let chart = document.createElement("canvas");
    // Variable para indicar a la gráfica el período temporal del eje X
    // En función de la variable "periodo" se creará la variable "unit" (anyo -> year; mes -> month; dia -> day)
    let unit = "";
    switch (periodo) {
    case "anyo":
        unit = "year";
        break;
    case "mes":
        unit = "month";
        break;
    case "dia":
    default:
        unit = "day";
        break;
    }

    // Creación de la gráfica
    // La función "Chart" está disponible porque hemos incluido las etiquetas <script> correspondientes en el fichero HTML
    const myChart = new Chart(chart.getContext("2d"), {
        // Tipo de gráfica: barras. Puedes cambiar el tipo si quieres hacer pruebas: https://www.chartjs.org/docs/latest/charts/line.html
        type: 'bar',
        data: {
            datasets: [
                {
                    // Título de la gráfica
                    label: `Gastos por ${periodo}`,
                    // Color de fondo
                    backgroundColor: "#555555",
                    // Datos de la gráfica
                    // "agrup" contiene los datos a representar. Es uno de los parámetros de la función "mostrarGastosAgrupadosWeb".
                    data: agrup
                }
            ],
        },
        options: {
            scales: {
                x: {
                    // El eje X es de tipo temporal
                    type: 'time',
                    time: {
                        // Indicamos la unidad correspondiente en función de si utilizamos días, meses o años
                        unit: unit
                    }
                },
                y: {
                    // Para que el eje Y empieza en 0
                    beginAtZero: true
                }
            }
        }
    });
    // Añadimos la gráfica a la capa
    divP.append(chart);
}

function nuevoGastoWebFormulario(){
    let plantillaFormulario = document.getElementById("formulario-template").content.cloneNode(true);
    let formulario = plantillaFormulario.querySelector("form");

    let divControles = document.getElementById("controlesprincipales");
    divControles.appendChild(formulario);

    let anyadirForm = new AnyadirGastoFormulario();
    formulario.addEventListener("submit", anyadirForm);

    let btnNuevoGastoApi = document.createElement("button");
    btnNuevoGastoApi.id="gasto-enviar-api";
    formulario.appendChild(btnNuevoGastoApi);
    btnNuevoGastoApi.innerHTML="Enviar (API)"
    var objetoNuevoApi = new nuevoGastoApiHandle();

    btnNuevoGastoApi.addEventListener("click", objetoNuevoApi);
    
    let btnAnyadirGastoForm = document.getElementById("anyadirgasto-formulario");
    btnAnyadirGastoForm.setAttribute("disabled", "");
    
    let cancelarForm = new CancelarGastoFormulario();
    cancelarForm.formulario = formulario;

    let btnCancelarForm = formulario.querySelector("button.cancelar");
    btnCancelarForm.addEventListener("click", cancelarForm);
}

document.getElementById("anyadirgasto-formulario").addEventListener("click", nuevoGastoWebFormulario);

let CancelarGastoFormulario = function(){
    this.handleEvent = function(event){
        this.formulario.remove();
        document.getElementById("anyadirgasto-formulario").removeAttribute("disabled");
    }
}

let CancelarCrearGastoFormulario = function(boton){
    this.handleEvent= function(event){
        document.forms[0].remove();

        boton.removeAttribute("disabled");
    }
}

let EditarHandleFormulario = function(){
    this.handleEvent = function() {
        
        let plantillaFormulario = document.getElementById("formulario-template").content.cloneNode(true);
        let formulario = plantillaFormulario.querySelector("form");

        this.gastoHTML.appendChild(formulario);
        this.btnEditar.setAttribute('disabled', "");

        let btnEditarGastoApi = document.createElement("button");
        btnEditarGastoApi.id="gasto-editar-api";
        btnEditarGastoApi.innerHTML="Editar (API)"
        formulario.appendChild(btnEditarGastoApi)
        var objetoEditarApi = new editarGastoApiHandle();
        objetoEditarApi.gasto = this.gasto;

        btnEditarGastoApi.addEventListener("click", objetoEditarApi);

        formulario.elements.descripcion.value = this.gasto.descripcion;
        formulario.elements.valor.value = this.gasto.valor;
        formulario.elements.fecha.value = this.gasto.fecha;
        formulario.elements.etiquetas.value = this.gasto.etiquetas;

        let form = new EditarGastoHandle();
        form.gasto = this.gasto;
        formulario.addEventListener("submit", form);

        let btnCancelar = formulario.querySelector("button.cancelar");
        let cancelarForm = new CancelarCrearGastoFormulario(this.btnEditar);
        btnCancelar.addEventListener('click', cancelarForm);
    }
}

let EditarGastoHandle=function(){
    this.handleEvent = function(event) {
        event.preventDefault();
        let form = document.forms[0];
        this.gasto.descripcion = form.elements.descripcion.value;
        this.gasto.valor = Number(form.elements.valor.value);
        this.gasto.fecha = new Date(form.elements.fecha.value);
        this.gasto.etiquetas = form.elements.etiquetas.value.split(",");

        repintar();
    }
}

function AnyadirGastoFormulario(){
    this.handleEvent = function(event){
        event.preventDefault();

        let formulario = document.forms[0];
        let descripcion = formulario.elements.descripcion.value;
        let valor = Number(formulario.elements.valor.value);
        let fecha = new Date (formulario.elements.fecha.value);
        let etiquetas = formulario.elements.etiquetas.value;
        
        gp.anyadirGasto(new gp.CrearGasto(descripcion, valor, fecha, etiquetas));
        repintar();

        document.getElementById("anyadirgasto-formulario").removeAttribute("disabled");
    }
}

let filtrarGastoWeb = function(){
    this.handleEvent = function(evento) {
        evento.preventDefault();

        let descripcionContiene = this.formulario.elements["formulario-filtrado-descripcion"].value;
        let valorMinimo = this.formulario.elements["formulario-filtrado-valor-minimo"].value;
        let valorMaximo = this.formulario.elements["formulario-filtrado-valor-maximo"].value;
        let fechaDesde = this.formulario.elements["formulario-filtrado-fecha-desde"].value;
        let fechaHasta = this.formulario.elements["formulario-filtrado-fecha-hasta"].value;
        let etiquetasTiene = this.formulario.elements["formulario-filtrado-etiquetas-tiene"].value;

        if(etiquetasTiene){
            etiquetasTiene = gp.transformarListadoEtiquetas(etiquetasTiene);
        }

        document.getElementById("listado-gastos-completo").innerHTML="";
        
        let filtrado = gp.filtrarGastos({descripcionContiene, valorMinimo, valorMaximo, fechaDesde, fechaHasta, etiquetasTiene});

        filtrado.forEach(gasto=>{
            mostrarGastoWeb(gasto, "listado-gastos-completo");
        });
    }
}

let formulario = document.getElementById("formulario-filtrado");

let filtrarResultados = new filtrarGastoWeb();
filtrarResultados.formulario = formulario;
formulario.addEventListener('submit', filtrarResultados);

function guardarGastosWeb(){
    this.handleEvent = function(event){
        event.preventDefault();
        localStorage.setItem("GestorGastosDWEC", JSON.stringify(gp.listarGastos()));
    }
    repintar();
}

let botonGuardarGasto = document.getElementById("guardar-gastos");
botonGuardarGasto.addEventListener("click", new guardarGastosWeb());

function cargarGastosWeb(){
    this.handleEvent = function(event){
        event.preventDefault();
        if(localStorage.getItem("GestorGastosDWEC")){
            gp.cargarGastos(JSON.parse(localStorage.getItem("GestorGastosDWEC")));
        }else{
            gp.cargarGastos([]);
        }
        repintar();
    }
}

let botonCargarGasto = document.getElementById('cargar-gastos');
botonCargarGasto.addEventListener("click", new cargarGastosWeb());

function cargarGastosApi(){
    var nombreUsuario = document.getElementById("nombre_usuario").value;
        fetch('https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/'+nombreUsuario, {method: 'Get'})
            .then(response => response.json())
            .then(data => {
                console.log(data);
                gp.cargarGastos(data);
                repintar();
            })
            .catch(err => console.log(err));
}

let btnCargarGastosApi = document.getElementById("cargar-gastos-api");
btnCargarGastosApi.addEventListener('click', new cargarGastosApiHandle());

function cargarGastosApiHandle(){
    this.handleEvent= function(event){
        event.preventDefault();
        cargarGastosApi();
    }
}

let borrarApiHandle = function(){
    this.handleEvent= function(event){
        event.preventDefault();
        var nombreUsuario = document.getElementById("nombre_usuario").value;
        fetch('https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/'+nombreUsuario+"/"+this.gasto.gastoId, {method: 'Delete'})
            .then(response => response.json())
            .then(data => {
                console.log(data);
                gp.borrarGasto(this.gasto.gastoId);
                cargarGastosApi();
            })
            .catch(err => console.log(err));
    }
}

function nuevoGastoApiHandle(){
    this.handleEvent= function(event){
        event.preventDefault();
        var nombreUsuario = document.getElementById("nombre_usuario").value;

        let form = document.forms[0];

        var nuevoGasto = {
            descripcion :form.elements.descripcion.value, 
            valor:form.elements.valor.value, 
            fecha:form.elements.fecha.value, 
            etiquetas: form.elements.etiquetas.value.split(","),
            usuario:nombreUsuario
        }
        
        fetch('https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/'+nombreUsuario, {method: 'Post',headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(nuevoGasto)})
            .then(response => response.json())
            .then(data => {
                console.log(data);
                cargarGastosApi();
            })
            .catch(err => console.log(err));
    }
}

function editarGastoApiHandle(){
    this.handleEvent= function(event){
        event.preventDefault();
        var nombreUsuario = document.getElementById("nombre_usuario").value;

        let form = document.forms[1];

        var nuevoGasto = new gp.CrearGasto(form.elements.descripcion.value, Number(form.elements.valor.value), new Date(form.elements.fecha.value), form.elements.etiquetas.value.split(","));
        
        fetch('https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/'+nombreUsuario+"/"+this.gasto.gastoId, {method: 'Put',headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(nuevoGasto)})
            .then(response => response.json())
            .then(data => {
                console.log(data);
                cargarGastosApi();
            })
            .catch(err => console.log(err));
    }
}

export{
    mostrarDatoEnId,
    mostrarGastoWeb,
    mostrarGastosAgrupadosWeb,
    nuevoGastoWebFormulario,
    repintar,
    actualizarPresupuestoWeb,
    nuevoGastoWeb,
    guardarGastosWeb,
    cargarGastosWeb,
    cargarGastosApi
}