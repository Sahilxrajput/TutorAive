import { createTransport } from "nodemailer";
import { LectureStatus } from "../types/type";

const transporter = createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendAssignmentEmail = async ({
  toEmail,
  classroomName,
  assignmentId,
}: {
  toEmail: string;
  classroomName?: string;
  assignmentId: string;
}) => {
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

  await transporter.sendMail(mailOptions);
};

const CLASS_STATUS_CONFIG: Record<
  LectureStatus,
  {
    subject: string;
    heading: string;
    message: string;
    color: string;
    buttonText?: string;
    showButton: boolean;
  }
> = {
  live: {
    subject: "🔴 Class Started",
    heading: "Class is Live Now",
    message:
      "Your class has started. Please join immediately to avoid missing important content.",
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
    message:
      "This class has been scheduled. Please check the timing before joining.",
    color: "#2563eb",
    buttonText: "View Schedule",
    showButton: true,
  },

  rescheduled: {
    subject: "📅 Class Rescheduled",
    heading: "Class Rescheduled",
    message:
      "This class has been rescheduled. Please check the updated timing.",
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

// type EmailStatus = Exclude<ClassStatus, "scheduled">;

export const sendClassStatusEmail = async ({
  toEmail,
  classroomName = "Advanced Backend",
  lectureId,
  status,
  title,
}: {
  toEmail: string;
  classroomName?: string;
  lectureId: string;
  status: LectureStatus;
  title: string;
}) => {
  const lectureUrl = `${process.env.SERVER_URL}/lectures/${lectureId}`;
  const config = CLASS_STATUS_CONFIG[status];

  await transporter.sendMail({
    from: `"Online Tutor" <online@tutor.in>`,
    to: toEmail,
    subject: config.subject,
    html: `
      <div style="font-family: Arial; background:#f4f6f8; padding:20px">
        <div style="max-width:600px;margin:auto;background:#fff;padding:24px;border-radius:6px">
          <h2 style="color:${config.color}">${config.heading}</h2>
          <p><strong>${title}</strong> — ${classroomName}</p>
          <p>${config.message}</p>

          ${
            config.showButton
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
              : ""
          }

          <p style="font-size:12px;color:#6b7280;margin-top:24px">
            This is an automated notification.
          </p>
        </div>
      </div>
    `,
  });
};

export const sendContactMail = async ({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  await transporter.sendMail({
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
};
