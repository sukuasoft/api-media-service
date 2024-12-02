import { Request, Response } from "express";
import { ApiResponse } from "../types/apiResponse";
import { prisma } from "../prisma";
import { v4 as uuidv4 } from "uuid";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { pathMediaStorage } from "../utils/files";
import ffmpeg from "fluent-ffmpeg";
import { internalError } from "../errors";
import { validsMimeTypes } from "../utils/mimeTypes";

async function POST(request: Request, response: Response<ApiResponse>) {
  const file = request.files!.file;

  if (!Array.isArray(file)) {
    const id = uuidv4();

    //Definir as pastas
    const rootDirFile = path.join(pathMediaStorage, id);
    mkdir(rootDirFile);
    const filePath = path.join(rootDirFile, file.name);

    //Criar as pastas
    await writeFile(filePath, file.data);

    const metadados = await new Promise<{
      duration: number;
      size: number;
    } | null>((resolve) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          resolve(null);
        }
        resolve({
          duration: metadata.format.duration ?? 0,
          size: metadata.format.size ?? 0,
        });
      });
    });

    if (!metadados){
        internalError(response);
        return;
    }

    const mimeType = validsMimeTypes.get(file.mimetype);

    if (mimeType){
        const File = await prisma.file.create({
            data: {
                id: id, 
                name: file.name, 
                size: metadados.size, 
                duration: metadados.duration, 
                type: mimeType.type, 
                mimetype: mimeType.name,
                createdAt: new Date().toISOString()
            }
        });
        
        response.status(201).json({
          success: true,
          message: "File uploaded",
          data: {
            id: File.id, 
            createdAt: File.createdAt.toISOString()
          }
        });

    }
   
  }
}

const uploadController = {
  POST,
};

export default uploadController;
