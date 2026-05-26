from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import resend
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "../../.env"))
resend.api_key = os.getenv("RESEND_API_KEY")

router = APIRouter()

class WelcomeEmail(BaseModel):
    email: str
    name: str

class TaskReminderEmail(BaseModel):
    email: str
    name: str
    tasks: list

class JobAlertEmail(BaseModel):
    email: str
    name: str
    jobs_count: int
    apply_now: int

@router.post("/welcome")
def send_welcome_email(data: WelcomeEmail):
    try:
        response = resend.Emails.send({
            "from": "CareerOS <onboarding@resend.dev>",
            "to": data.email,
            "subject": "Welcome to CareerOS 🚀",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1e; color: white; padding: 40px; border-radius: 16px;">
                <h1 style="color: #818cf8; font-size: 28px; margin-bottom: 8px;">🚀 Welcome to CareerOS!</h1>
                <p style="color: #94a3b8; font-size: 16px; margin-bottom: 24px;">Hi {data.name},</p>
                <p style="color: #e2e8f0; font-size: 15px; line-height: 1.6;">
                    You've just joined the smartest career platform for Indian students.
                    CareerOS will help you get hired faster with AI-powered job matching,
                    daily tasks, and personalized career guidance.
                </p>
                <div style="background: #1e293b; border-radius: 12px; padding: 24px; margin: 24px 0;">
                    <h3 style="color: #818cf8; margin-bottom: 16px;">🎯 What you can do:</h3>
                    <p style="color: #94a3b8; margin: 8px 0;">📄 Upload your resume → Extract skills</p>
                    <p style="color: #94a3b8; margin: 8px 0;">🎯 Get job matches → Apply Now / Learn / Prepare</p>
                    <p style="color: #94a3b8; margin: 8px 0;">📋 Complete 3 daily tasks → Build your streak</p>
                    <p style="color: #94a3b8; margin: 8px 0;">🎤 Practice interviews → Get AI feedback</p>
                    <p style="color: #94a3b8; margin: 8px 0;">💔 Analyze rejections → Fix and improve</p>
                </div>
                <a href="http://localhost:3000" style="background: #4f46e5; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 8px;">
                    Start Your Journey 🚀
                </a>
                <p style="color: #475569; font-size: 13px; margin-top: 32px;">
                    CareerOS — Built for Indian Students 🇮🇳
                </p>
            </div>
            """
        })
        return {"status": "success", "message": "Welcome email sent"}
    except Exception as e:
        print(f"Email error: {e}")
        return {"status": "error", "message": str(e)}

@router.post("/task-reminder")
def send_task_reminder(data: TaskReminderEmail):
    try:
        tasks_html = "".join([
            f'<p style="color: #94a3b8; margin: 8px 0;">• {task}</p>'
            for task in data.tasks[:3]
        ])
        response = resend.Emails.send({
            "from": "CareerOS <onboarding@resend.dev>",
            "to": data.email,
            "subject": "📋 Your Daily Tasks Are Ready!",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1e; color: white; padding: 40px; border-radius: 16px;">
                <h1 style="color: #818cf8; font-size: 24px;">📋 Daily Tasks Ready!</h1>
                <p style="color: #94a3b8;">Hi {data.name}, your tasks for today:</p>
                <div style="background: #1e293b; border-radius: 12px; padding: 24px; margin: 24px 0;">
                    {tasks_html}
                </div>
                <p style="color: #e2e8f0;">Complete all 3 tasks to maintain your streak 🔥</p>
                <a href="http://localhost:3000" style="background: #4f46e5; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 16px;">
                    Complete Tasks 📋
                </a>
            </div>
            """
        })
        return {"status": "success", "message": "Task reminder sent"}
    except Exception as e:
        print(f"Email error: {e}")
        return {"status": "error", "message": str(e)}

@router.post("/job-alert")
def send_job_alert(data: JobAlertEmail):
    try:
        response = resend.Emails.send({
            "from": "CareerOS <onboarding@resend.dev>",
            "to": data.email,
            "subject": f"🎯 {data.apply_now} Jobs Ready to Apply!",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1e; color: white; padding: 40px; border-radius: 16px;">
                <h1 style="color: #818cf8; font-size: 24px;">🎯 Job Match Results!</h1>
                <p style="color: #94a3b8;">Hi {data.name}, here's your job match summary:</p>
                <div style="display: grid; gap: 12px; margin: 24px 0;">
                    <div style="background: #052e16; border: 1px solid #166534; border-radius: 12px; padding: 16px; text-align: center;">
                        <p style="color: #4ade80; font-size: 32px; font-weight: 900; margin: 0;">{data.apply_now}</p>
                        <p style="color: #86efac; margin: 4px 0;">🚀 Apply Now</p>
                    </div>
                </div>
                <p style="color: #e2e8f0;">Don't wait — apply to your matched jobs today!</p>
                <a href="http://localhost:3000" style="background: #4f46e5; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 16px;">
                    View Jobs 🎯
                </a>
            </div>
            """
        })
        return {"status": "success", "message": "Job alert sent"}
    except Exception as e:
        print(f"Email error: {e}")
        return {"status": "error", "message": str(e)}