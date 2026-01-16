// controllers/qna.controller.ts
import { Request, Response } from "express";
import { LiveQna } from "../models/LiveQna.model";

export const getLectureQna = async (req: Request, res: Response) => {
  const { lectureId } = req.params;

  const qna = await LiveQna.find({ lecture: lectureId })
    .sort({ createdAt: 1 })
    .populate("questionBy answeredBy", "name");

  res.json(qna);
};
