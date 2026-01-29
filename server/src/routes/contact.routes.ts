import { Router } from "express";
import { sendContactMail } from "../utils/sendEmail";

const router = Router();

router.post("/", async (req, res) => {
  const { name, email, role, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await sendContactMail({ name, email, role, message });
    res.status(200).json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
