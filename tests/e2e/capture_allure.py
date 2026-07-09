"""Screenshot the generated Allure HTML report."""
import asyncio
import http.server
import socketserver
import threading
from pathlib import Path

from playwright.async_api import async_playwright

REPORT = Path(__file__).parent / "allure-report"
OUT = Path(__file__).parent / "screenshots" / "allure"
OUT.mkdir(parents=True, exist_ok=True)

PORT = 8765


def _serve():
    class Handler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *a, **k):
            super().__init__(*a, directory=str(REPORT), **k)

        def log_message(self, *a, **k):
            pass

    with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
        httpd.serve_forever()


async def capture():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1440, "height": 1000})
        page = await ctx.new_page()

        tabs = [
            ("overview", ""),
            ("suites", "#suites"),
            ("graphs", "#graph"),
            ("timeline", "#timeline"),
            ("behaviors", "#behaviors"),
            ("packages", "#packages"),
        ]
        for name, hash_ in tabs:
            url = f"http://127.0.0.1:{PORT}/{hash_}" if hash_ else f"http://127.0.0.1:{PORT}/"
            await page.goto(url, wait_until="networkidle")
            await page.wait_for_timeout(2000)
            await page.screenshot(path=str(OUT / f"allure_{name}.png"))
            print("captured", name)

        await browser.close()


def main():
    t = threading.Thread(target=_serve, daemon=True)
    t.start()
    asyncio.run(capture())


if __name__ == "__main__":
    main()
