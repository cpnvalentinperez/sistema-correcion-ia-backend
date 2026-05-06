
import mammoth from "mammoth";
import * as pdf from "pdf-parse";
import AdmZip from "adm-zip";

export const parseFile = async (file: Express.Multer.File): Promise<string> => {

  if (file.mimetype.includes("word")) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  }

  if (file.mimetype.includes("pdf")) {
    const data = await (pdf as any)(file.buffer);
    return data.text;
  }

  // 🔥 soporte .odt
  if (file.mimetype.includes("opendocument")) {
    const zip = new AdmZip(file.buffer);
    const contentXml = zip.readAsText("content.xml");

    // limpiar etiquetas XML básicas
    const text = contentXml
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ");

    return text;
  }

  return file.buffer.toString("utf-8");
};