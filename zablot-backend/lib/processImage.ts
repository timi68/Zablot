import sharp from "sharp";

export default async function resizeImage(file: Express.Multer.File) {
  return await sharp(file.buffer)
    .rotate()
    .resize(200)
    .jpeg({ mozjpeg: true })
    .toBuffer();
}
