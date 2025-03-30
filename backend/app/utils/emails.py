import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Any
import emails
from jinja2 import Template
from backend.app.core.config import settings
from backend.app.utils import logger

@dataclass
class EmailData:
    html_content: str
    subject: str


async def render_email_template(*, template_name: str, context: dict[str, Any]) -> str:
    template_str = (
        Path(__file__).parent.parent / "email-templates" / "build" / template_name
    ).read_text()
    html_content = Template(template_str).render(context)
    return html_content


async def send_email(
    *,
    email_to: str,
    subject: str = "",
    html_content: str = "",
) -> Any:
    message = emails.Message(
        subject=subject,
        html=html_content,
        mail_from=(settings.EMAILS_FROM_NAME, settings.EMAILS_FROM_EMAIL),
    )
    smtp_options = {"host": settings.SMTP_HOST, "port": settings.SMTP_PORT}
    smtp_options["user"] = settings.SMTP_USER
    smtp_options["password"] = settings.SMTP_PASSWORD
    smtp_options["tls"] = True
    response = message.send(to=email_to, smtp=smtp_options)
    logger.info(f"send email result: {response}")


async def generate_reset_password_email(email_to: str, email: str, token: str) -> EmailData:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Password recovery for user {email}"
    link = f"{settings.FRONTEND_HOST}/reset-password?token={token}"
    html_content = await render_email_template(
        template_name="reset_password.html",
        context={
            "project_name": settings.PROJECT_NAME,
            "username": email,
            "email": email_to,
            "valid_hours": settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS,
            "link": link,
        },
    )
    return EmailData(html_content=html_content, subject=subject)


async def generate_new_account_email(
    email_to: str, username: str, password: str
) -> EmailData:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - New account for user {username}"
    html_content = await render_email_template(
        template_name="new_account.html",
        context={
            "project_name": project_name,
            "username": username,
            "password": password,
            "email": email_to,
            "link": settings.FRONTEND_HOST,
        },
    )
    return EmailData(html_content=html_content, subject=subject)

