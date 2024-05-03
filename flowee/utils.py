from playwright.sync_api import sync_playwright
import subprocess
import time
import site
import os

# Get the path to the site-packages directory
site_packages_path = site.getsitepackages()[0]

package_name = 'flowee'

# Path to the installed package directory
package_path = os.path.join(site_packages_path, package_name)

# Path to the 'web' folder inside the package
web_folder_path = os.path.join(package_path, 'web')
def take_screenshot(path, name):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Visit the localhost where the React app is running
        page.goto("http://localhost:5173")

        # Define the path where you want to save the screenshot
        screenshot_path = f"{path}/{name}.png"
        page.screenshot(path=screenshot_path)

        browser.close()
        print(f"Screenshot saved at: {screenshot_path}")

def run_react_app(path, name):
    # Start the React server in the background
    process = subprocess.Popen(['npm', 'run', 'dev'], cwd=web_folder_path)

    time.sleep(2)

    take_screenshot(path, name)

    time.sleep(1)
    process.send_signal(2)

    # Terminate the process after the delay
    process.terminate()



