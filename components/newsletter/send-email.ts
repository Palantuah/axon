import { EmailTemplate } from "@/components/email-template";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

// Send email notification
      await resend.emails.send({
        from: "TikTok Downloader <hello@auth.downloadtiktoks.com>",
        to: [payload.email],
        subject: "Your TikTok Videos Are Ready",
        react: EmailTemplate({ 
          username: payload.username,
          userId: payload.userId
        }) as React.ReactElement,
      });