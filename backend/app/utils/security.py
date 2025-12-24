import datetime
from datetime import timedelta

import jwt
from backend.app.core import security
from backend.app.core.config import settings
from jwt.exceptions import InvalidTokenError


async def verify_password_reset_token(token: str) -> str | None:
    try:
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=[security.ALGORITHM])
        return str(decoded_token["sub"])
    except InvalidTokenError:
        return None


async def generate_password_reset_token(email: str) -> str:
    delta = timedelta(hours=settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS)
    now = datetime.now(datetime.UTC)
    expires = now + delta
    exp = expires.timestamp()
    encoded_jwt = jwt.encode(
        {"exp": exp, "nbf": now, "sub": email},
        settings.SECRET_KEY,
        algorithm=security.ALGORITHM,
    )
    return encoded_jwt
