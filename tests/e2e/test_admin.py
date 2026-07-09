"""Admin dashboard coverage."""
import allure
import time
from playwright.sync_api import Page, expect, BrowserContext


def _sign_in(page: Page, base_url: str, email: str, password: str) -> None:
    page.goto(f"{base_url}/auth", wait_until="networkidle")
    page.fill("#email", email)
    page.fill("#password", password)
    page.get_by_role("button", name="Sign in").click()
    page.wait_for_url("**/admin**", timeout=15000)
    page.wait_for_load_state("networkidle")


@allure.epic("Admin")
@allure.feature("Dashboard")
class TestAdmin:
    def test_dashboard(self, page: Page, base_url, admin_creds, snap):
        _sign_in(page, base_url, *admin_creds)
        page.goto(f"{base_url}/admin", wait_until="networkidle")
        snap(page, "14_admin_dashboard")

    def test_orders_page(self, page: Page, base_url, admin_creds, snap):
        _sign_in(page, base_url, *admin_creds)
        page.goto(f"{base_url}/admin/orders", wait_until="networkidle")
        expect(page.get_by_role("heading", name="Orders")).to_be_visible()
        snap(page, "15_admin_orders")

    def test_product_page(self, page: Page, base_url, admin_creds, snap):
        _sign_in(page, base_url, *admin_creds)
        page.goto(f"{base_url}/admin/product", wait_until="networkidle")
        snap(page, "16_admin_product")

    def test_benefits_crud(self, page: Page, base_url, admin_creds, snap):
        _sign_in(page, base_url, *admin_creds)
        page.goto(f"{base_url}/admin/benefits", wait_until="networkidle")
        snap(page, "17_admin_benefits")
        page.get_by_role("button", name="New").click()
        dialog = page.get_by_role("dialog")
        dialog.locator("#title").fill("E2E Auto Benefit")
        dialog.locator("#description").fill("Created by Playwright test")
        dialog.locator("#icon").fill("Sparkles")
        dialog.locator("#display_order").fill("99")
        snap(page, "17b_admin_benefit_dialog")
        dialog.get_by_role("button", name="Create").click()
        expect(page.get_by_text("E2E Auto Benefit")).to_be_visible(timeout=15000)
        snap(page, "18_admin_benefits_created")
        # cleanup
        page.once("dialog", lambda d: d.accept())
        row = page.locator("li", has_text="E2E Auto Benefit")
        row.get_by_role("button", name="Delete").click()
        page.wait_for_timeout(1000)

    def test_ingredients_page(self, page: Page, base_url, admin_creds, snap):
        _sign_in(page, base_url, *admin_creds)
        page.goto(f"{base_url}/admin/ingredients", wait_until="networkidle")
        snap(page, "19_admin_ingredients")

    def test_testimonials_page(self, page: Page, base_url, admin_creds, snap):
        _sign_in(page, base_url, *admin_creds)
        page.goto(f"{base_url}/admin/testimonials", wait_until="networkidle")
        snap(page, "20_admin_testimonials")

    def test_faq_page(self, page: Page, base_url, admin_creds, snap):
        _sign_in(page, base_url, *admin_creds)
        page.goto(f"{base_url}/admin/faq", wait_until="networkidle")
        snap(page, "21_admin_faq")

    def test_settings_page(self, page: Page, base_url, admin_creds, snap):
        _sign_in(page, base_url, *admin_creds)
        page.goto(f"{base_url}/admin/settings", wait_until="networkidle")
        expect(page.get_by_label("Store name")).to_be_visible()
        snap(page, "22_admin_settings")
