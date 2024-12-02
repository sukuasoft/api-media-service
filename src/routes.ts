import { Express } from "express";
import homeController from "./controllers/home";
import uploadController from "./controllers/upload";
import { fileRequestValidation } from "./middlewares/fileRequestValidation";
import filesController from "./controllers/files";


export function generateRoutes (server:Express){
    server.get('/', homeController.GET);
    server.post('/upload',fileRequestValidation,  uploadController.POST);
    server.get('/files', filesController.GetAll);
    server.get('/files/:id', filesController.GetId);
    server.get('/files/:id/thumbnail', filesController.GetThumbnail);
    server.get('/files/:id/download', filesController.GetFileDownload);
    server.get('/files/:id/converted', filesController.GetFileConverted);
    server.get('/files/:id/short_file', filesController.GetShortFile);
}