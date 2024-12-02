import express, { Express } from "express";
import { generateRoutes } from "./routes";
import fileUpload from "express-fileupload";

export function initServer() {
  const PORT = process.env.PORT ?? 5533;

  const server: Express = express();
  server.use(fileUpload());

  generateRoutes(server);

  server.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`);
  });
}
