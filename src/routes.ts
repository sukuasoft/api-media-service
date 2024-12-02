import { Express } from "express";
import homeController from "./controllers/home";
import uploadController from "./controllers/upload";
import { fileRequestValidation } from "./middlewares/fileRequestValidation";


export function generateRoutes (server:Express){
    server.get('/', homeController.GET);
    server.post('/upload',fileRequestValidation,  uploadController.POST);
}