import { TypeMedia } from "../types/enums/typeMediaEnum";
import { MimeTypes } from "../types/mimeTypes";

export const validsMimeTypes: Map<string, MimeTypes> = new Map([
  [
    "video/mp4",
    {
      type: TypeMedia.VIDEO,
      name: "video/mp4",
      extension: "mp4",
    },
  ],
  [
    "video/x-msvideo",
    {
      type: TypeMedia.VIDEO,
      name: "video/x-msvideo",
      extension: "avi",
    },
  ],
  [
    "audio/mpeg",
    {
      type: TypeMedia.AUDIO,
      name: "audio/mpeg",
      extension: "mp3",
    },
  ],
  [
    "audio/wav",
    {
      type: TypeMedia.AUDIO,
      name: "audio/wav",
      extension: "wav",
    },
  ],
]);
