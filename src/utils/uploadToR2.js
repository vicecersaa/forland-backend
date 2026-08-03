import { PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import getR2Client from "./r2.js";
import generateFileName from "./generateFileName.js";

const uploadToR2 = async (buffer, originalName, mimeType, folder) => {
  const r2 = getR2Client();
  const filename = generateFileName(originalName);
  const key = `${folder}/${filename}`;

  // Resize kalau gambar
  let finalBuffer = buffer;
  if (mimeType.startsWith("image/")) {
    finalBuffer = await sharp(buffer)
      .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();
    mimeType = "image/jpeg";
  }

  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: finalBuffer,
      ContentType: mimeType,
    })
  );

  return {
    key,
    url: `${process.env.R2_PUBLIC_URL}/${key}`,
  };
};

export default uploadToR2;