"""Pytest fixtures for VitaBoost+ E2E tests."""
from __future__ import annotations

import os
from pathlib import Path

import allure
import pytest
from playwright.sync_api import Page, sync_playwright

BASE_URL = os.environ.get("E2E_BASE_URL", "http://localhost:8080")
ADMIN_EMAIL = os.environ.get("E2E_ADMIN_EMAIL", "abhichy30@gmail.com")
ADMIN_PASSWORD = os.environ.get("E2E_ADMIN_PASSWORD", "12345678")

SHOTS = Path(__file__).parent / "screenshots"
SHOTS.mkdir(exist_ok=True)


@pytest.fixture(scope="session")
def playwright_instance():
    with sync_playwright() as p:
        yield p


@pytest.fixture(scope="session")
def browser(playwright_instance):
    b = playwright_instance.chromium.launch(headless=True)
    yield b
    b.close()


@pytest.fixture
def context(browser):
    ctx = browser.new_context(viewport={"width": 1280, "height": 1800})
    yield ctx
    ctx.close()


@pytest.fixture
def page(context) -> Page:
    return context.new_page()


@pytest.fixture(scope="session")
def base_url() -> str:
    return BASE_URL


@pytest.fixture
def admin_creds():
    return ADMIN_EMAIL, ADMIN_PASSWORD


def shot(page: Page, name: str) -> Path:
    """Save screenshot and attach to Allure."""
    path = SHOTS / f"{name}.png"
    page.screenshot(path=str(path))
    allure.attach.file(str(path), name=name, attachment_type=allure.attachment_type.PNG)
    return path


@pytest.fixture
def snap():
    return shot
