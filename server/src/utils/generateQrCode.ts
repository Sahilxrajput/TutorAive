import QRCode from "qrcode";

// Generate QR code for the invite URL
export default async function genearteQrCode(inviteCode: string) {
  const joinUrl = `${process.env.CLIENT_URL}/join/${inviteCode}`;
  const qrCode = await QRCode.toDataURL(joinUrl);
  return qrCode;
}
