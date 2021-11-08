import * as gestionPresupuesto from './gestionPresupuesto.js';

//Para iterar sobre un collection del node usar for...of


function mostrarDatoEnId(idElemento, valor) {
    let elemento = document.getElementById(idElemento);
    let p = document.createElement("p");
    p.textContent = valor;
    elemento.appendChild(p);
}

//aqui gasto es un array, con lo que habria que cambiarlo y meterlo todo dentro de una iteracción
function mostrarGastoWeb(idElemento, gastos) {
    let elemento = document.getElementById(idElemento);
    for (let gasto of gastos) {
        //let GUID = crypto.randomUUID();
        //let randomNumber = Math.floor((Math.random() * 1000) + 1);
        let data = "";
        for (let i of gasto.etiquetas) {
            data += `
            <span class="gasto-etiquetas-etiqueta">
                ${i}
            </span>`
        }
        elemento.innerHTML += 
        `<div class="gasto">
            <div class="gasto-descripcion">${gasto.descripcion}</div>
            <div class="gasto-fecha">${gasto.fecha}</div> 
            <div class="gasto-valor">${gasto.valor}</div> 
            <div class="gasto-etiquetas">
            ${data}
            </div>
            `;
            let buttonEdit = document.createElement("button");
                             buttonEdit.className += 'gasto-editar'
                             buttonEdit.textContent = "Editar";
                             buttonEdit.type = 'button';

            let buttonBorr = document.createElement("button");
                             buttonBorr.className += 'gasto-borrar'
                             buttonBorr.textContent = "Borrar";
                             buttonBorr.type = 'button';

            let nM = new EditarHandle(gasto);
            let nB = new BorrarHandle(gasto);
            
            
            buttonEdit.addEventListener('click', nM);
            buttonBorr.addEventListener('click', nB);
            
            elemento.append(buttonEdit);
            elemento.append(buttonBorr);

    }
    elemento.innerHTML += "================================================"
}

function mostrarGastosAgrupadosWeb(idElemento, agrup, periodo) {
    const elemento = document.getElementById(idElemento);
    let data = ""
    for (let [key, value] of Object.entries(agrup)) {
        data += `
        <div class="agrupacion-dato">
            <span class="agrupacion-dato-clave">${key}</span>
            <span class="agrupacion-dato-valor">${value}</span>
        </div>`
    };
    elemento.innerHTML += 
    `
    <div class="agrupacion">
        <h1>Gastos agrupados por ${periodo}</h1>
        ${data}
    `
}

function repintar() {
    //Presupuesto
    let mostPresupuesto = gestionPresupuesto.mostrarPresupuesto();
    mostrarDatoEnId('presupuesto', mostPresupuesto);

    //Total de gastos
    let calcularTotalGastos = gestionPresupuesto.calcularTotalGastos();
    mostrarDatoEnId("gastos-totales", calcularTotalGastos);

    //Balance actual
    let calcularBalance = gestionPresupuesto.calcularBalance();
    mostrarDatoEnId("balance-total", calcularBalance);

    //Borrar div#listado-gastos-completo | Listado con los gastos y sus datos
    document.getElementById("listado-gastos-completo").innerHTML = "";
    let listaGastos = gestionPresupuesto.listarGastos();
    mostrarGastoWeb("listado-gastos-completo", listaGastos);
}

function formatearFecha(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function actualizarPresupuestoWeb() {
    let presupuesto = parseFloat(prompt("Introduzca un presupuesto: "))
    gestionPresupuesto.actualizarPresupuesto(presupuesto);
    repintar();
}

function nuevoGastoWeb() {
    let descripcion = prompt("Introduzca la descripción: ");
    let valor = parseFloat(prompt("Introduzca el valor: "));
    let fecha = formatearFecha(Date.parse(prompt("Introduzca la fecha: ")));
    let etiquetas = prompt("Introduce las etiquetas: ").split(",");
    let newGasto = gestionPresupuesto.CrearGasto(descripcion, valor, fecha, etiquetas);
    gestionPresupuesto.anyadirGasto(newGasto);
    repintar();
}


/* https://stackoverflow.com/questions/2230992/javascript-creating-objects-based-on-a-prototype-without-using-new-constructo*/

function EditarHandle(gastoR) {
    this.gasto = gastoR;
    this.handleEvent = function(event) {
        let descripcion1 = prompt("Introduzca la nueva descripción: ");
        let valor1 = parseFloat(prompt("Introduzca el nuevo valor: "));
        let fecha1 = formatearFecha(Date.parse(prompt("Introduzca la nueva fecha: ")));
        let etiquetas1 = prompt("Introduce las nuevas etiquetas: ");

        if (typeof etiquetas1 != undefined) {
            etiquetas1.split(',');
            this.gasto.etiquetas = [...etiquetas1];
        } else {
            this.gasto.etiquetas = [];
        }

        this.gasto.actualizarValor(valor1);
        this.gasto.actualizarDescripcion(descripcion1);
        this.gasto.actualizarFecha(fecha1);
        repintar();   
        
    }
}

function BorrarHandle(gasto) {
    let obj = {
        handleEvent() {
            gestionPresupuesto.borrarGasto(gasto);
            repintar();
       }
   }
   return obj;
}

//Botones
const actualizarpresupuesto = document.getElementById("actualizarpresupuesto");
const anyadirgasto = document.getElementById("anyadirgasto");

const gastoBorrar = document.getElementById("gasto-borrar");

//Eventos
actualizarpresupuesto.addEventListener('click', actualizarPresupuestoWeb);
anyadirgasto.addEventListener('click', nuevoGastoWeb);


export   {
    mostrarDatoEnId,
    mostrarGastoWeb,
    mostrarGastosAgrupadosWeb
}
