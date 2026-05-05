
import mammoth from "mammoth";
import * as pdf from "pdf-parse";

export const parseFile = async (file: Express.Multer.File): Promise<string> => {

  if (file.mimetype.includes("word")) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  }

  if (file.mimetype.includes("pdf")) {
    const data = await (pdf as any)(file.buffer);
    return data.text;
  }

  return file.buffer.toString("utf-8");
};