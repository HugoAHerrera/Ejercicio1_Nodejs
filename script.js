const http = require('http');
const os = require('os');
const processo = require('process');
const fs = require('fs');
const ruta = require('path');

const configRuta = ruta.join(__dirname, 'config.json');
const configJson = fs.readFileSync(configRuta, 'utf8');
const config = JSON.parse(configJson);
let intervalo = config.intervalo_segundos * 1000; // Convertir a milisegundos
let informacionPeriodica = [];

function cargarJsonConfig() {
  informacionPeriodica = config.informacion_periodica;
}

function generarInfoSistemaHTML() {
  return `
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Información del Sistema</title>
      </head>
      <body>
        <h1>Información del sistema:</h1>
        <h1>Sistema Operativo: ${os.type()} ${os.release()}</h1>
        <h1>Arquitectura: ${os.arch()}</h1>
        <h1>Versión de Node.js: ${processo.version}</h1>
        <h1>CPU: ${os.cpus()[0].model}</h1>
        <h1>Memoria Total: ${(os.totalmem())}</h1>
        <h1>Memoria Libre: ${(os.freemem())}</h1>
      </body>
    </html>
  `;
}

function mostrarInfoPeriodica() {
  console.log("\nInformación periódica:");
  informacionPeriodica.forEach(info => {
    const valor = eval(info.comando); //eval ejecuta texto como código
    console.log(`${info.nombre}:`, valor);
  });
}

cargarJsonConfig();

setInterval(mostrarInfoPeriodica, intervalo);

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
  res.end(generarInfoSistemaHTML());
}).listen(3000, () => {
  console.log("Servidor escuchando en http://localhost:3000");
});
