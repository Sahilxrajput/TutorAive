import fs from "fs";
import QRCode from "qrcode";

function base64ToImage(base64String: string, outputPath: string = "output.png"): string {
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");
  fs.writeFileSync(outputPath, buffer);
  return outputPath;
}

export default async function generateQrCode(inviteCode: string, outputPath = "./uploads/qrcode.png"): Promise<string> {
  const joinUrl = `${process.env.CLIENT_URL}/join/${inviteCode}`;
  const qrBase64 = await QRCode.toDataURL(joinUrl);

  const savedPath = base64ToImage(qrBase64, outputPath);
  console.log(`✅ QR code generated and saved at: ${savedPath}`);
  return savedPath;
}

