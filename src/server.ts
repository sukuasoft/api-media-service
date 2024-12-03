import express, { Express } from 'express';
import { generateRoutes } from './routes';
import fileUpload from 'express-fileupload';
import { initDoc } from './docs/init';
import path from 'path';

//Inicializador do servidor
export function initServer() {
  const PORT = process.env.PORT ?? 5533;

  const server: Express = express();
  server.use(fileUpload());
  server.use(express.static(path.resolve(__dirname, '../public')));

  //Inicializar a documentação
  initDoc(server);

  generateRoutes(server);

  server.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`);
  });
}
