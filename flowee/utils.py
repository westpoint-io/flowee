from playwright.sync_api import sync_playwright
import subprocess
import time
import os
import pkg_resources

def get_package_installation_path(package_name):
    # Get information about the installed package
    try:
        package = pkg_resources.get_distribution(package_name)
        return package.location
    except pkg_resources.DistributionNotFound:
        return None

package_name = 'flowee'
package_path = get_package_installation_path(package_name)

if package_path:
    web_folder_path = os.path.join(package_path, package_name,  'web')
    print("Path to 'web' folder inside the package:", web_folder_path)
else:
    print("Package '{}' is not installed.".format(package_name))
    exit()

def take_screenshot(path, name):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Visit the localhost where the React app is running
        page.goto("http://localhost:8000")

        # Define the path where you want to save the screenshot
        screenshot_path = f"{path}/{name}.png"
        page.screenshot(path=screenshot_path)

        browser.close()
        print(f"Screenshot saved at: {screenshot_path}")

def run_react_app(path, name):

    # Start the React server in the background
    install = subprocess.run(['npm', 'install'], cwd=web_folder_path)
    build = subprocess.run([ 'npm','run',  'build' ], cwd=web_folder_path)
    print('Opening server ...')

    python3_command = ['python3', '-m', 'http.server', '--directory', 'dist']
    python_command = ['python', '-m', 'http.server', '--directory', 'dist']
    choosed_python = None

    try:
        # Try running the command with Python 3
        startserver = subprocess.Popen(python3_command, cwd=web_folder_path)
        choosed_python = 'python3'
    except FileNotFoundError:
        # If Python 3 is not found, fall back to Python
        startserver = subprocess.Popen(python_command, cwd=web_folder_path)
        choosed_python = 'python'
   
    print('Opening browser ...')
    take_screenshot(path, name)

    print('Closing server ...')
    startserver.terminate()



