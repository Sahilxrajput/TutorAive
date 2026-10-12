"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranscriptModel = void 0;
exports.appendTranscriptSegment = appendTranscriptSegment;
exports.endTranscript = endTranscript;
exports.getTranscript = getTranscript;
const mongoose_1 = __importStar(require("mongoose"));
const TranscriptSchema = new mongoose_1.Schema({
    sessionId: { type: String, required: true, unique: true },
    segments: [
        {
            text: String,
            timestamp: Number,
            speaker: { type: String, default: "teacher" },
        },
    ],
    fullText: { type: String, default: "" },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
});
exports.TranscriptModel = mongoose_1.default.models.Transcript ||
    mongoose_1.default.model("Transcript", TranscriptSchema);
// ─── Service Functions ─────────────────────────────────────────────────────
// Append a new segment to the transcript (called from WebSocket handler)
function appendTranscriptSegment(sessionId, text, timestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        const segment = { text, timestamp, speaker: "teacher" };
        yield exports.TranscriptModel.findOneAndUpdate({ sessionId }, {
            $push: { segments: segment },
            $set: { fullText: "" }, // will be rebuilt below
            $setOnInsert: { startedAt: new Date() },
        }, { upsert: true, new: true }).then((doc) => __awaiter(this, void 0, void 0, function* () {
            if (doc) {
                // Rebuild fullText from all segments
                const fullText = doc.segments.map((s) => s.text).join(" ");
                yield exports.TranscriptModel.updateOne({ sessionId }, { $set: { fullText } });
            }
        }));
    });
}
// Mark transcript as ended
function endTranscript(sessionId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.TranscriptModel.findOneAndUpdate({ sessionId }, { $set: { endedAt: new Date() } });
    });
}
// Get full transcript for a session
function getTranscript(sessionId) {
    return __awaiter(this, void 0, void 0, function* () {
        return exports.TranscriptModel.findOne({ sessionId });
    });
}
