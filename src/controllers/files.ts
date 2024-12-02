import { Request, Response } from "express";

import { ApiResponse } from "../types/apiResponse";
import { prisma } from "../prisma";
import { getExtensionFile, pathMediaStorage } from "../utils/files";
import path from "path";
import { TypeMedia } from "../types/enums/typeMediaEnum";
import getHostDomain from "../utils/domain";

async function GetAll(request: Request, response: Response<ApiResponse>) {
  const files = (await prisma.file.findMany()).map((file) => {
    const _f: any = {
      ...file,
      download_url: `${getHostDomain()}/files/${file.id}/download`,
      short_file: `${getHostDomain()}/files/${file.id}/short_file`,
    };

    if (file.type == TypeMedia.VIDEO) {
      _f.thumbnail = `${getHostDomain()}/files/${file.id}/thumbnail`;
    } else if (file.type == TypeMedia.AUDIO) {
      _f.file_converted = `${getHostDomain()}/files/${file.id}/converted`;
    }

    return _f;
  });

  response.status(200).json({
    success: true,
    data: files,
  });
}

async function GetId(request: Request, response: Response<ApiResponse>) {
  const { id } = request.params;

  const file = await prisma.file.findFirst({
    where: {
      id: id,
    },
  });

  if (file) {
    const _file: any = {
      ...file,
      download_url: `${getHostDomain()}/files/${file.id}/download`,
      short_file: `${getHostDomain()}/files/${file.id}/short_file`,
    };

    if (file.type == TypeMedia.VIDEO) {
      _file.thumbnail = `${getHostDomain()}/files/${file.id}/thumbnail`;
    } else if (file.type == TypeMedia.AUDIO) {
      _file.file_converted = `${getHostDomain()}/files/${file.id}/converted`;
    }

    response.status(200).json({
      success: true,
      data: _file,
    });
  } else {
    response.status(404).json({
      success: false,
      data: null,
    });
  }
}

async function GetThumbnail(request: Request, response: Response<ApiResponse>) {
  const { id } = request.params;

  const file = await prisma.file.findFirst({
    where: {
      id: id,
    },
  });

  if (file) {
    if (file.type == TypeMedia.VIDEO) {
      const thumbnailFile = path.join(
        pathMediaStorage,
        file.id,
        "thumbnail.jpg"
      );
      response.download(thumbnailFile);
    } else {
      response.sendStatus(404);
    }
  } else {
    response.sendStatus(404);
  }
}

async function GetFileDownload(
  request: Request,
  response: Response<ApiResponse>
) {
  const { id } = request.params;

  const file = await prisma.file.findFirst({
    where: {
      id: id,
    },
  });

  if (file) {
    const filePath = path.join(pathMediaStorage, file.id, file.name);
    response.download(filePath);
  } else {
    response.sendStatus(404);
  }
}

async function GetFileConverted(
  request: Request,
  response: Response<ApiResponse>
) {
  const { id } = request.params;

  const file = await prisma.file.findFirst({
    where: {
      id: id,
    },
  });

  if (file) {
    if (file.type == TypeMedia.AUDIO) {
      let convertedExtension = "";
      if (getExtensionFile(file.name) == "mp3") {
        convertedExtension = "wav";
      } else {
        convertedExtension = "mp3";
      }

      const convertedFile = path.join(
        pathMediaStorage,
        file.id,
        `converted.${convertedExtension}`
      );
      response.download(convertedFile);
    } else {
      response.sendStatus(404);
    }
  } else {
    response.sendStatus(404);
  }
}


async function GetShortFile(
    request: Request,
    response: Response<ApiResponse>
  ) {
    const { id } = request.params;
  
    const file = await prisma.file.findFirst({
      where: {
        id: id,
      },
    });
  
    if (file) {
      const filePath = path.join(pathMediaStorage, file.id,
       'short.' +getExtensionFile(file.name)
      );
      response.download(filePath);
    } else {
      response.sendStatus(404);
    }
  }

const filesController = {
  GetAll,
  GetId,
  GetThumbnail,
  GetFileDownload,
  GetFileConverted,
  GetShortFile
};

export default filesController;
