import { Request, Response } from "express";
import { ApiResponse } from "../types/apiResponse";
import { prisma } from "../prisma";
import { v4 as uuidv4 } from "uuid";
import { mkdir, writeFile, rename } from "fs/promises";
import path from "path";

import {
  getExtensionFile,
  pathMediaStorage,
  pathTempStorage,
} from "../utils/files";
import ffmpeg from "fluent-ffmpeg";
import { internalError } from "../errors";
import { validsMimeTypes } from "../utils/mimeTypes";
import { TypeMedia } from "../types/enums/typeMediaEnum";

async function POST(request: Request, response: Response<ApiResponse>) {
  const file = request.files!.file;

  if (!Array.isArray(file)) {
    const id = uuidv4();

    //Definir as pastas
    const rootTempDirFile = path.join(pathTempStorage, id);
    const rootDirFile = path.join(pathMediaStorage, id);
    await mkdir(rootTempDirFile);

    const filePathTemp = path.join(rootTempDirFile, file.name);

    //Criar as pastas
    await writeFile(filePathTemp, file.data);

    const metadados = await new Promise<{
      duration: number;
      size: number;
    } | null>((resolve) => {
      ffmpeg.ffprobe(filePathTemp, (err, metadata) => {
        if (err) {
          resolve(null);
        }
        resolve({
          duration: metadata.format.duration ?? 0,
          size: metadata.format.size ?? 0,
        });
      });
    });

    if (!metadados) {
      internalError(response);
      return;
    }

    const mimeType = validsMimeTypes.get(file.mimetype);

    if (mimeType) {
      //gerar thumbnail
      if (mimeType.type == TypeMedia.VIDEO) {
        if (
          !(await new Promise((resolve) => {
            ffmpeg(filePathTemp)
              .thumbnail({
                timestamps: [1],
                filename: "thumbnail.jpg",
                folder: rootTempDirFile,
              })
              .on("end", () => {
                resolve(true);
              })
              .on("error", () => {
                resolve(false);
              });
          }))
        ) {
          internalError(response);
          return;
        }


        
      }

      else if (mimeType.type == TypeMedia.AUDIO){

          let toExtension = '';
          if (mimeType.extension == 'mp3') {
            toExtension='wav';
          }
          else{
            toExtension= 'mp3';
          }

          if (
            !(await new Promise((resolve) => {
              ffmpeg(filePathTemp).toFormat(toExtension)
                .output(
                  path.join(
                    rootTempDirFile,
                    `converted.${toExtension}`
                  )
                )
                .on("end", () => {
                  resolve(true);
                })
                .on("error", () => {
    
                  resolve(false);
                }).run();
            }))
          ) {
            internalError(response);
            return;
          }
        
      }


      if (
        !(await new Promise((resolve) => {
          ffmpeg(filePathTemp)
            .setStartTime("00:00:00")
            .setDuration(metadados.duration > 30 ? 30 : metadados.duration)
            .output(
              path.join(
                rootTempDirFile,
                `short.${getExtensionFile(file.name)}`
              )
            )
            .on("end", () => {
              resolve(true);
            })
            .on("error", () => {

              resolve(false);
            }).run();
        }))
      ) {
        internalError(response);
        return;
      }

      //gravar na base de dados

      const File = await prisma.file.create({
        data: {
          id: id,
          name: file.name,
          size: metadados.size,
          duration: metadados.duration,
          type: mimeType.type,
          mimetype: mimeType.name,
          createdAt: new Date().toISOString(),
        },
      });

      await rename(rootTempDirFile, rootDirFile);

      response.status(201).json({
        success: true,
        message: "File uploaded",
        data: {
          id: File.id,
          createdAt: File.createdAt.toISOString(),
        },
      });
    }
  }
}

const uploadController = {
  POST,
};

export default uploadController;
