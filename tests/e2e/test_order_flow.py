"""Order placement flow."""
import allure
import time
from playwright.sync_api import Page, expect


@allure.epic("Storefront")
@allure.feature("Order Flow")
class TestOrder:
    def test_place_cod_order(self, page: Page, base_url, snap):
        page.goto(base_url, wait_until="networkidle")
        page.locator("#order").scroll_into_view_if_needed()
        snap(page, "08_order_form")

        page.fill("#customer_name", "Playwright QA")
        page.fill("#phone", "+919876543210")
        page.fill("#address", "221B Baker Street, Test City, IN 110001")
        # COD is default
        page.get_by_role("button", name="Place order").click()

        confirm = page.get_by_text("Order confirmed", exact=False)
        expect(confirm).to_be_visible(timeout=15000)
        snap(page, "09_order_confirmed")

    def test_place_online_order(self, page: Page, base_url, snap):
        page.goto(base_url, wait_until="networkidle")
        page.locator("#order").scroll_into_view_if_needed()
        page.fill("#customer_name", "Online Buyer")
        page.fill("#phone", "+919812345678")
        page.fill("#address", "Flat 7, MG Road, Bengaluru 560001")
        # switch to online payment
        page.get_by_text("Online", exact=True).click()
        page.get_by_role("button", name="Place order").click()
        expect(page.get_by_text("Order confirmed", exact=False)).to_be_visible(timeout=15000)
        snap(page, "10_order_online_confirmed")
