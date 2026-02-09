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
exports.sendClassInviteEmail = exports.sendContactMail = exports.sendClassStatusEmail = exports.sendAssignmentEmail = void 0;
const nodemailer_1 = require("nodemailer");
const transporter = (0, nodemailer_1.createTransport)({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});
const sendAssignmentEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ toEmail, classroomName, assignmentId, }) {
    try {
        const assignmentUrl = `${process.env.SERVER_URL}/assignments/${assignmentId}`;
        const mailOptions = {
            from: `"Online Tutor" <online@tutor.in>`,
            to: toEmail,
            subject: "New Assignment Posted",
            html: `
      <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f8; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 24px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.08);">
      
      <h2 style="margin-top: 0; color: #1f2937;">
        New Assignment Posted
      </h2>
  
      <p style="color: #374151; font-size: 14px;">
        Hello,
      </p>
  
      <p style="color: #374151; font-size: 14px;">
        Your instructor has posted a new assignment in the classroom below:
      </p>
  
      <p style="font-size: 15px; font-weight: bold; color: #111827; margin: 16px 0;">
        ${classroomName}
      </p>
  
      <p style="color: #374151; font-size: 14px;">
        Please review the assignment details and submit your work before the deadline.
      </p>
  
      <div style="text-align: center; margin: 24px 0;">
        <a 
          href="${assignmentUrl}"
          target="_blank"
          style="
            display: inline-block;
            padding: 12px 22px;
            background-color: #2563eb;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 600;
          "
        >
          View Assignment
        </a>
      </div>
  
      <p style="color: #6b7280; font-size: 12px;">
        If the button doesn’t work, open this link in your browser:
      </p>
  
      <p style="font-size: 12px; word-break: break-all;">
        <a href="${assignmentUrl}" style="color: #2563eb;">
          ${assignmentUrl}
        </a>
      </p>
  
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
  
      <p style="color: #6b7280; font-size: 12px;">
        This is an automated message. Replies are not monitored.
      </p>
  
      <p style="color: #6b7280; font-size: 12px; margin-bottom: 0;">
        © ${new Date().getFullYear()} Online Tutor
      </p>
    </div>
    </div>
    `,
        };
        yield transporter.sendMail(mailOptions);
    }
    catch (_b) {
        throw new Error("Terminal was unable to dispatch the mail packet.");
    }
});
exports.sendAssignmentEmail = sendAssignmentEmail;
const CLASS_STATUS_CONFIG = {
    live: {
        subject: "🔴 Class Started",
        heading: "Class is Live Now",
        message: "Your class has started. Please join immediately to avoid missing important content.",
        color: "#dc2626",
        buttonText: "Join Now",
        showButton: true,
    },
    //   starting_soon: {
    //     subject: "⏰ Class Starting in 5 Minutes",
    //     heading: "Class Starting Soon",
    //     message:
    //       "Your class will begin in approximately 5 minutes. Please make sure you are ready.",
    //     color: "#16a34a",
    //     buttonText: "Join Class",
    //     showButton: true,
    //   },
    scheduled: {
        subject: "📅 Class Scheduled",
        heading: "Class Scheduled",
        message: "This class has been scheduled. Please check the timing before joining.",
        color: "#2563eb",
        buttonText: "View Schedule",
        showButton: true,
    },
    rescheduled: {
        subject: "📅 Class Rescheduled",
        heading: "Class Rescheduled",
        message: "This class has been rescheduled. Please check the updated timing.",
        color: "#2563eb",
        buttonText: "View Updated Schedule",
        showButton: true,
    },
    delayed: {
        subject: "⏳ Class Delayed",
        heading: "Class Delayed",
        message: "The class has been delayed. Further updates will be shared.",
        color: "#ca8a04",
        buttonText: "View Class Details",
        showButton: true,
    },
    cancelled: {
        subject: "❌ Class Cancelled",
        heading: "Class Cancelled",
        message: "Unfortunately, this class session has been cancelled.",
        color: "#dc2626",
        showButton: false,
    },
    completed: {
        //@todo complete it or remove it and modify type
        subject: "class complete",
        heading: "Class complete",
        message: " this class session has been complete.",
        color: "#dc2626",
        showButton: false,
    },
};
const sendClassStatusEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ toEmail, classroomName = "Advanced Backend", lectureId, status, title, }) {
    try {
        const lectureUrl = `${process.env.SERVER_URL}/lectures/${lectureId}`;
        const config = CLASS_STATUS_CONFIG[status];
        yield transporter.sendMail({
            from: `"Online Tutor" <online@tutor.in>`,
            to: toEmail,
            subject: config.subject,
            html: `
        <div style="font-family: Arial; background:#f4f6f8; padding:20px">
          <div style="max-width:600px;margin:auto;background:#fff;padding:24px;border-radius:6px">
            <h2 style="color:${config.color}">${config.heading}</h2>
            <p><strong>${title}</strong> — ${classroomName}</p>
            <p>${config.message}</p>
  
            ${config.showButton
                ? `<a href="${lectureUrl}" style="
                    display:inline-block;
                    margin-top:16px;
                    padding:12px 22px;
                    background:${config.color};
                    color:#fff;
                    text-decoration:none;
                    border-radius:4px;
                    font-weight:600;">
                    ${config.buttonText}
                  </a>`
                : ""}
  
            <p style="font-size:12px;color:#6b7280;margin-top:24px">
              This is an automated notification.
            </p>
          </div>
        </div>
      `,
        });
    }
    catch (_b) {
        throw new Error("Terminal was unable to dispatch the mail packet.");
    }
});
exports.sendClassStatusEmail = sendClassStatusEmail;
const sendContactMail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, email, subject, message, }) {
    try {
        yield transporter.sendMail({
            from: `"TutorAive Contact" <${process.env.EMAIL_USER}>`,
            to: process.env.CONTACT_USER,
            subject: "New Contact Message",
            html: `
        <h3>New Contact Submission</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Role:</b> ${subject}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
        });
    }
    catch (_b) {
        throw new Error("Terminal was unable to dispatch the mail packet.");
    }
});
exports.sendContactMail = sendContactMail;
const sendClassInviteEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ studentEmail, teacherName = "TutorAIve Teaacher", classroomName, invitationLink, }) {
    try {
        const mailOptions = {
            from: `"${teacherName}" <${process.env.EMAIL_USER}>`,
            to: studentEmail,
            subject: `Authorization Required: Your Invitation to ${classroomName}`,
            html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 25px;">
        <h1 style="color: #0f172a; font-size: 24px; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px;">Tutor<span style="color: #2563eb;">Aive</span></h1>
        <p style="font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 2px; margin: 0;">Auth Protocol v4.2</p>
      </div>

      <p>Hello,</p>

      <p>You have been authorized by <strong>${teacherName}</strong> to join a new learning sector on the <strong>TutorAive</strong> platform.</p>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Target Sector:</p>
        <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: #0f172a;">${classroomName}</p>
      </div>

      <p>To initialize your access and synchronize your profile with this classroom, please click the link below:</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${invitationLink}" 
           style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
          Initialize Sector Link
        </a>
      </div>

      <p style="font-size: 12px; color: #64748b;">
        If the button does not work, copy and paste this URL into your browser:<br/>
        <span style="color: #2563eb; word-break: break-all;">${invitationLink}</span>
      </p>

      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />

      <p style="font-size: 12px; color: #94a3b8;">
        This is an automated synchronization message. If you were not expecting this invitation, you can safely ignore this email.
      </p>
      
      <p style="margin-top: 20px; font-size: 14px;">
        <strong>Securely yours,</strong><br/>
        The TutorAive Protocol Team
      </p>
    </div>
  `,
        };
        yield transporter.sendMail(mailOptions);
    }
    catch (_b) {
        throw new Error("Terminal was unable to dispatch the mail packet.");
    }
});
exports.sendClassInviteEmail = sendClassInviteEmail;
