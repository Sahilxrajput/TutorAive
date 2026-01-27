"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateQrCode;
const fs_1 = __importDefault(require("fs"));
const qrcode_1 = __importDefault(require("qrcode"));
function base64ToImage(base64String, outputPath = "output.png") {
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    fs_1.default.writeFileSync(outputPath, buffer);
    return outputPath;
}
function generateQrCode(inviteCode_1) {
    return __awaiter(this, arguments, void 0, function* (inviteCode, outputPath = "./uploads/qrcode.png") {
        const joinUrl = `${process.env.CLIENT_URL}/join/${inviteCode}`;
        const qrBase64 = yield qrcode_1.default.toDataURL(joinUrl);
        const savedPath = base64ToImage(qrBase64, outputPath);
        console.log(`✅ QR code generated and saved at: ${savedPath}`);
        return savedPath;
    });
}
