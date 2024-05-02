from playwright.sync_api import sync_playwright
import subprocess
import time

def start_react_server():
    # Change directory to the root of your project where the React app is located
    project_root = "./web"
    command = ["npm", "run", "dev"]

    # Start the React development server in a separate process
    react_process = subprocess.Popen(command, cwd=project_root)

    # Wait for the server to fully start (you can adjust the waiting time as needed)
    time.sleep(1)

    return react_process

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

def stop_react_server(react_process):
    # Terminate the React development server process
    react_process.terminate()
    subprocess.run(["killall", "node"], shell=True)

    time.sleep(2)

