import { Express } from "express";
import homeController from "./controllers/home";
import uploadController from "./controllers/upload";
import { fileRequestValidation } from "./middlewares/fileRequestValidation";
import filesController from "./controllers/files";

export function generateRoutes(server: Express) {
  server.get("/", homeController.GET);
  server.post("/api/v1/upload", fileRequestValidation, uploadController.POST);
  server.get("/api/v1/files", filesController.GetAll);
  server.get("/api/v1/files/:id", filesController.GetId);
  server.get("/api/v1/files/:id/thumbnail", filesController.GetThumbnail);
  server.get("/api/v1/files/:id/download", filesController.GetFileDownload);
  server.get("/api/v1/files/:id/converted", filesController.GetFileConverted);
  server.get("/api/v1/files/:id/short_file", filesController.GetShortFile);
}
