
const valor = document.getElementById ("moneyInput");
const tipo = document.getElementById ("tipoMoneda");
const search = document.getElementById ("search");
const resultado = document.getElementById ("resultado");
let chart;

async function getValue(){

    try{
    const res = await fetch("https://mindicador.cl/api");
    const data = await res.json();
    const coin = tipo.value
    let almacen;
    let codigoSeleccion;
    const cantidad = parseFloat(valor.value)
    if (cantidad =='' || isNaN(cantidad) || cantidad <= 0 || coin == "a") {
        alert ("Ingrese una cantidad válida");
    } else {
        if (coin == "usd") {
            almacen = cantidad / data.dolar.valor;
            codigoSeleccion = data.dolar.codigo
        } else if (coin == "euro") {
            almacen = cantidad / data.euro.valor;
            codigoSeleccion = data.euro.codigo
        } else if (coin == "uf") {
            almacen = cantidad / data.uf.valor;
            codigoSeleccion = data.uf.codigo
        }else if (coin == "bitcoin") {
            almacen = cantidad / data.bitcoin.valor;
            codigoSeleccion = data.bitcoin.codigo
        }
        resultado.innerHTML = `$${almacen.toFixed(3)} ${coin.toUpperCase()}`
        chartData(codigoSeleccion, coin);
    }

    } catch (e) {
        alert(e.message);
    }
}

search.addEventListener ("click", getValue);

async function chartData(codigoMoneda, nombreMoneda) {
    const res = await fetch(`https://mindicador.cl/api/${codigoMoneda}`);
    const graficaData = await res.json();
    const diezValores = graficaData.serie.slice(0,10);
    const labels = diezValores.map((item) => {
    return new Date(item.fecha).toLocaleDateString('en-GB')
    }); 

    const valores = diezValores.map((item) => {
        return item.valor;
    }); 

    const datasets = [
        {
        label:`Historial de ${nombreMoneda} `,
                    fill:false,
                    backgroundColor: "#4cffd1",
                    borderColor: 'black',
                    data:valores.reverse(),
                    

        }
        ];

        if(chart){
            chart.destroy();
        }

       chart = new Chart('myChart',{
            type:'line',
            data:{
                labels:labels.reverse(),
                datasets:datasets
            }
        }) 
}

