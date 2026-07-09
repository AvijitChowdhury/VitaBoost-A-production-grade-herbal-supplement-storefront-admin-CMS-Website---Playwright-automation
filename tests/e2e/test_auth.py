"""Authentication."""
import allure
from playwright.sync_api import Page, expect


@allure.epic("Admin")
@allure.feature("Authentication")
class TestAuth:
    def test_auth_page_renders(self, page: Page, base_url, snap):
        page.goto(f"{base_url}/auth", wait_until="networkidle")
        expect(page.get_by_role("heading", name="Admin sign in")).to_be_visible()
        snap(page, "11_auth_signin")

    def test_invalid_credentials(self, page: Page, base_url, snap):
        page.goto(f"{base_url}/auth", wait_until="networkidle")
        page.fill("#email", "nobody@example.com")
        page.fill("#password", "wrongpassword1")
        page.get_by_role("button", name="Sign in").click()
        # sonner toast should appear
        toast = page.locator("[data-sonner-toast]")
        expect(toast.first).to_be_visible(timeout=10000)
        snap(page, "12_auth_invalid")

    def test_admin_signin_success(self, page: Page, base_url, admin_creds, snap):
        email, password = admin_creds
        page.goto(f"{base_url}/auth", wait_until="networkidle")
        page.fill("#email", email)
        page.fill("#password", password)
        page.get_by_role("button", name="Sign in").click()
        page.wait_for_url("**/admin**", timeout=15000)
        snap(page, "13_auth_success_redirect")
