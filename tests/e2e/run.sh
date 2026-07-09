#!/usr/bin/env bash
# One-shot: run Playwright/pytest suite, generate Allure report, capture Allure screenshots.
set -euo pipefail
cd "$(dirname "$0")/../.."

rm -rf tests/e2e/allure-results tests/e2e/allure-report tests/e2e/screenshots
mkdir -p tests/e2e/screenshots

python -m pytest tests/e2e
nix run nixpkgs#allure -- generate tests/e2e/allure-results -o tests/e2e/allure-report --clean
python tests/e2e/capture_allure.py

echo
echo "Report:      tests/e2e/allure-report/index.html"
echo "Screenshots: tests/e2e/screenshots/"
