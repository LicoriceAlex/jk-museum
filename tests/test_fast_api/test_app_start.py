import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

@pytest.mark.asyncio
async def test_app_starts():
    """
    Проверяет, что приложение запускается без ошибок
    и отвечает на базовый запрос.
    """
    client = TestClient(app)
    response = client.get("/docs")
    assert response.status_code == 200
    