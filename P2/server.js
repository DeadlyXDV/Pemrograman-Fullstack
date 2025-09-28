// Nama    = Marcelo Jonathan Holle
// NIM     = 411222083

import { NOTIMP } from 'dns';
import http from 'http';
const port = 8081;

const server = http.createServer((req, res) => {
    res.writeHead(200, {'content-type': 'text/html'});
    res.end('<center><h2>Hello Marcelo Holle</h2></center>\n');
});

server.listen(port, () =>{
    console.log(`Server Running At http://localhost:8081 `);
})