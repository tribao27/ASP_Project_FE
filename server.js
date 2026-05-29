/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import crypto from "crypto";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized GenAI client to prevent startup crashes if key is missing
let aiClient = null;

function getGenAI() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is missing. Vui lòng thiết lập key trong file .env");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. API: Healthcheck
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. API: Standard AI Chat
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { prompt, history = [], documentContext = "", documentName = "" } = req.body;

    if (!prompt) {
      res.status(400).json({ error: "Tham số prompt không được để trống" });
      return;
    }

    const ai = getGenAI();

    const contents = [];

    for (const msg of history) {
      contents.push({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      });
    }

    contents.push({
      role: "user",
      parts: [
        {
          text: documentContext
            ? `Dựa trên tài liệu "${documentName}" có nội dung sau:\n---\n${documentContext}\n---\nYêu cầu người dùng: ${prompt}`
            : prompt
        }
      ],
    });

    let systemInstruction = "Bạn là vị Trợ lý học tập AI siêu việt trong nền tảng 'AI Study Hub'. Hãy hồi đáp một cách chuyên nghiệp, dễ thương, truyền cảm hứng bằng tiếng Việt. Sử dụng cấu trúc Markdown rõ ràng, danh sách gạch đầu dòng và công thức nếu cần. Đừng bao giờ trả lời quá ngắn gọn hời hợt, nhưng cũng giữ câu trả lời vừa đủ súc tích, trực quan.";

    if (documentName) {
      systemInstruction += `\nĐặc biệt: Hãy chú ý trả lời chính xác, thông thái dựa trên tài liệu "${documentName}" mà người dùng đang mở ở khung Context bên phải.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text || "Xin lỗi, tôi không thể xử lý yêu cầu lúc này." });
  } catch (error) {
    console.error("Gemini Chat API Error:", error);
    res.status(500).json({
      error: error.message || "Đã xảy ra lỗi hệ thống ở phía máy chủ.",
      keyMissing: !process.env.GEMINI_API_KEY
    });
  }
});

// 3. API: Generate smart summary
app.post("/api/gemini/summarize", async (req, res) => {
  try {
    const { documentName, documentContent } = req.body;

    if (!documentContent) {
      res.status(400).json({ error: "Nội dung tài liệu trống" });
      return;
    }

    const ai = getGenAI();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Hãy đọc và viết một bản tóm tắt cực kỳ chuyên nghiệp trực quan bằng tiếng Việt cho tài liệu "${documentName}". Bản tóm tắt phải bao gồm:\n1. Chủ đề cốt lõi\n2. 3-4 ý chính nổi bật (gạch đầu dòng)\n3. 1 lời khuyên thực tế học tập về tài liệu này.\nSử dụng định dạng Markdown đẹp mắt.\n\nTài liệu:\n${documentContent}`,
    });

    res.json({ summary: response.text || "Không thể tóm tắt tài liệu." });
  } catch (error) {
    console.error("Gemini Summarize API Error:", error);
    res.status(500).json({
      error: error.message || "Không thể khởi tạo tóm tắt thông tin tài liệu.",
      keyMissing: !process.env.GEMINI_API_KEY
    });
  }
});

// ----------------------------------------------------------------------------
// OTP Authentication Logic
// ----------------------------------------------------------------------------
const otpStore = new Map(); // In-memory store: email -> { otpHash, expiresAt, attempts }
const OTP_EXPIRATION_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 3;

// Configure Nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // Standard configuration for Gmail
    auth: {
      user: process.env.SMTP_USER || 'your-email@gmail.com',
      pass: process.env.SMTP_PASS || 'your-app-password',
    },
  });
};

const hashOTP = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtpEmail = async (email, otp) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: `"AI Study Hub" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Mã xác minh AI Study Hub',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #fbfbfd;">
        <div style="background-color: #ffffff; border-radius: 24px; padding: 40px; text-align: center; box-shadow: 0 8px 40px rgba(0,0,0,0.04); border: 1px solid rgba(0,0,0,0.06);">
          <div style="margin-bottom: 24px;">
            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #ff8a00, #ff5c00); border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 24px;">
              ✦
            </div>
          </div>
          <h1 style="color: #1d1d1f; font-size: 24px; font-weight: 600; margin: 0 0 12px 0; letter-spacing: -0.5px;">Mã xác minh của bạn</h1>
          <p style="color: #86868b; font-size: 15px; margin: 0 0 32px 0; line-height: 1.5;">Vui lòng nhập mã 6 chữ số bên dưới để tiếp tục. Mã này sẽ hết hạn sau 5 phút.</p>
          <div style="background-color: #f5f5f7; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
            <span style="font-size: 36px; font-weight: 700; color: #1d1d1f; letter-spacing: 8px;">${otp}</span>
          </div>
          <p style="color: #86868b; font-size: 13px; margin: 0; line-height: 1.5;">Nếu bạn không yêu cầu mã này, hãy an tâm bỏ qua email này. Tài khoản của bạn vẫn an toàn.</p>
        </div>
        <div style="text-align: center; margin-top: 24px;">
          <p style="color: #86868b; font-size: 12px;">© ${new Date().getFullYear()} AI Study Hub. All rights reserved.</p>
        </div>
      </div>
    `
  };
  await transporter.sendMail(mailOptions);
};

// 4. API: Send OTP
app.post("/api/auth/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email là bắt buộc." });

    const otp = generateOTP();
    const otpHash = hashOTP(otp);
    
    // Store OTP in memory
    otpStore.set(email, {
      otpHash,
      expiresAt: Date.now() + OTP_EXPIRATION_MS,
      attempts: 0
    });

    // In local dev without real SMTP, we'll log the OTP to console to avoid crashing
    if (!process.env.SMTP_USER) {
      console.log(`[DEV MODE] MÃ OTP CHO ${email} LÀ: ${otp}`);
      return res.json({ message: "OTP đã được gửi (Dev mode - Xem console)" });
    }

    await sendOtpEmail(email, otp);
    res.json({ message: "OTP đã được gửi thành công." });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ error: "Không thể gửi email OTP. Vui lòng kiểm tra lại cấu hình SMTP." });
  }
});

// 5. API: Verify OTP
app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: "Thiếu thông tin xác minh." });

    const record = otpStore.get(email);
    if (!record) return res.status(400).json({ error: "OTP không tồn tại hoặc đã hết hạn." });

    if (Date.now() > record.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ error: "Mã OTP đã hết hạn." });
    }

    if (record.attempts >= MAX_ATTEMPTS) {
      otpStore.delete(email);
      return res.status(400).json({ error: "Quá số lần thử. Vui lòng yêu cầu mã mới." });
    }

    if (hashOTP(otp) !== record.otpHash) {
      record.attempts += 1;
      return res.status(400).json({ error: "Mã OTP không chính xác." });
    }

    // Success, mark as verified (extend expiration for password reset phase)
    record.verified = true;
    record.expiresAt = Date.now() + (10 * 60 * 1000); // 10 more minutes to reset password
    
    res.json({ message: "Xác minh thành công." });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ error: "Lỗi hệ thống." });
  }
});

// 6. API: Reset Password
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ error: "Thiếu thông tin cần thiết." });

    const record = otpStore.get(email);
    if (!record || !record.verified || Date.now() > record.expiresAt) {
      return res.status(400).json({ error: "Phiên làm việc đã hết hạn hoặc không hợp lệ." });
    }

    // In a real app, update the password hash in the database here.
    console.log(`[AUTH] Đã đổi mật khẩu thành công cho ${email}`);

    // Invalidate OTP session
    otpStore.delete(email);

    res.json({ message: "Cập nhật mật khẩu thành công." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ error: "Lỗi hệ thống khi cập nhật mật khẩu." });
  }
});

// Serve frontend with Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AI Study Hub Server] listening on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
