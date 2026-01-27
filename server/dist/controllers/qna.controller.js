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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLectureQna = void 0;
const LiveQna_model_1 = require("../models/LiveQna.model");
const getLectureQna = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lectureId } = req.params;
    const qna = yield LiveQna_model_1.LiveQna.find({ lecture: lectureId })
        .sort({ createdAt: 1 })
        .populate("questionBy answeredBy", "name");
    res.json(qna);
});
exports.getLectureQna = getLectureQna;
