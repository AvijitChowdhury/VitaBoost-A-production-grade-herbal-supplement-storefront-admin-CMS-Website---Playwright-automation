"""SEO metadata checks."""
import allure
from playwright.sync_api import Page, expect


@allure.epic("Storefront")
@allure.feature("SEO")
class TestSEO:
    def test_title_and_meta(self, page: Page, base_url):
        page.goto(base_url, wait_until="networkidle")
        title = page.title()
        assert "VitaBoost" in title, f"title missing brand: {title!r}"
        desc = page.locator('meta[name="description"]').get_attribute("content")
        assert desc and len(desc) > 20, "meta description missing"
        og = page.locator('meta[property="og:title"]').get_attribute("content")
        assert og, "og:title missing"

    def test_single_h1(self, page: Page, base_url):
        page.goto(base_url, wait_until="networkidle")
        h1s = page.locator("h1").count()
        assert h1s == 1, f"expected 1 H1, found {h1s}"

    def test_ldjson_present(self, page: Page, base_url):
        page.goto(base_url, wait_until="networkidle")
        expect(page.locator('script[type="application/ld+json"]').first).to_be_attached()
