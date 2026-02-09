import QRCode from "qrcode";

export default async function generateQrCode(code: string): Promise<string> {
  const joinUrl = `${process.env.CLIENT_URL}/classrooms/:classroomId/join/${code}`;
  const qrBase64 = await QRCode.toDataURL(joinUrl);
  return qrBase64;
}

