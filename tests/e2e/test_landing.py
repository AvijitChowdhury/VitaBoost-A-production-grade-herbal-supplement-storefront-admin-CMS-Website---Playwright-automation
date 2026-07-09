"""Landing page feature coverage."""
import allure
from playwright.sync_api import Page, expect


@allure.epic("Storefront")
@allure.feature("Landing Page")
class TestLanding:
    def test_home_loads(self, page: Page, base_url, snap):
        page.goto(base_url, wait_until="networkidle")
        expect(page.get_by_role("heading", level=1)).to_be_visible()
        snap(page, "01_landing_hero")

    def test_benefits_section(self, page: Page, base_url, snap):
        page.goto(base_url, wait_until="networkidle")
        page.locator("#benefits").scroll_into_view_if_needed()
        expect(page.locator("#benefits")).to_be_visible()
        snap(page, "02_landing_benefits")

    def test_ingredients_section(self, page: Page, base_url, snap):
        page.goto(base_url, wait_until="networkidle")
        page.locator("#ingredients").scroll_into_view_if_needed()
        expect(page.locator("#ingredients")).to_be_visible()
        snap(page, "03_landing_ingredients")

    def test_reviews_section(self, page: Page, base_url, snap):
        page.goto(base_url, wait_until="networkidle")
        page.locator("#reviews").scroll_into_view_if_needed()
        expect(page.locator("#reviews")).to_be_visible()
        snap(page, "04_landing_reviews")

    def test_faq_accordion(self, page: Page, base_url, snap):
        page.goto(base_url, wait_until="networkidle")
        page.locator("#faq").scroll_into_view_if_needed()
        triggers = page.locator("#faq button")
        if triggers.count() > 0:
            triggers.first.click()
        snap(page, "05_landing_faq")

    def test_footer_visible(self, page: Page, base_url, snap):
        page.goto(base_url, wait_until="networkidle")
        page.keyboard.press("End")
        page.wait_for_timeout(500)
        expect(page.locator("footer")).to_be_visible()
        snap(page, "06_landing_footer")

    def test_mobile_viewport(self, browser, base_url, snap):
        ctx = browser.new_context(viewport={"width": 390, "height": 844})
        p = ctx.new_page()
        p.goto(base_url, wait_until="networkidle")
        snap(p, "07_landing_mobile")
        ctx.close()
