import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types/apiResponse";
import { getExtensionFile } from "../utils/files";
import { filesize } from "filesize";

import { validsMimeTypes } from "../utils/mimeTypes";
import { TypeMedia } from "../types/enums/typeMediaEnum";

export function fileRequestValidation(
  request: Request,
  response: Response<ApiResponse>,
  next: NextFunction
) {
  // Validação da existência de ficheiros
  if (
    !request.files ||
    Object.keys(request.files).length == 0 ||
    !request.files.file
  ) {
    response.status(400).json({
      success: false,
      message: "Missing file",
    });
    return;
  }

  // Limites de tipos de midea
  const audioSizeLimiter = parseInt(process.env.MAX_LENGHT_AUDIO ?? "0");
  const videoSizeLimiter = parseInt(process.env.MAX_LENGHT_VIDEO ?? "0");

  const uploadsError = [];

  const file = request.files.file;

  if (!Array.isArray(file)) {
    const mimeType = validsMimeTypes.get(file.mimetype);

    if (mimeType) {
      if (mimeType.extension == getExtensionFile(file.name)) {
        if (mimeType.type == TypeMedia.AUDIO) {
          if (!(file.size <= audioSizeLimiter || audioSizeLimiter == 0)) {
            uploadsError.push(
              `File is very large. The minimum is ${filesize(audioSizeLimiter)}`
            );
          }
        } else if (mimeType.type == TypeMedia.VIDEO) {
          if (!(file.size <= videoSizeLimiter || videoSizeLimiter == 0)) {
            uploadsError.push(
              `File is very large. The minimum is ${filesize(videoSizeLimiter)}`
            );
          }
        }
      } else {
        uploadsError.push(`File type does not match extension`);
      }
    } else {
      uploadsError.push(`Type of file unsupported`);
    }
  } else {
    uploadsError.push(
      "Not allowed to upload more than one file at the same time"
    );
  }

  if (uploadsError.length > 0){
    response.status(400).json({
        success:false, 
        message:uploadsError.join('. ')
    })
return;
  }
  next();
  
}
