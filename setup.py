from setuptools import setup, find_packages
from setuptools.command.install import install
import os, time, subprocess, sys
# read the contents of your README file
from pathlib import Path
this_directory = Path(__file__).parent
long_description = (this_directory / "README.MD").read_text()


class PostInstallCommand(install):
    def run(self):
        install.run(self)
        try:
            if sys.platform.startswith('win'):
                subprocess.call(['playwright.cmd', 'install-deps'])  # Adjust if necessary
                subprocess.call(['playwright.cmd', 'install'])       # Adjust if necessary
            else:
                subprocess.call(['playwright', 'install-deps'])
                subprocess.call(['playwright', 'install'])
        except FileNotFoundError:
            print("Playwright not found. Please make sure it's installed and in your PATH.")

web_folder_path = os.path.join('./flowee', 'web')

# Delete npm lock file if it exists from the web folder
lock_file_path = os.path.join(web_folder_path, 'package-lock.json')
if os.path.exists(lock_file_path):
    os.remove(lock_file_path)

# Delete yarn lock file if it exists from the web folder
lock_file_path = os.path.join(web_folder_path, 'yar.lock')
if os.path.exists(lock_file_path):
    os.remove(lock_file_path)

# Remove node_modules folder if it exists from the web folder
node_modules_path = os.path.join(web_folder_path, 'node_modules')
if os.path.exists(node_modules_path):
    import shutil
    shutil.rmtree(node_modules_path)

# Remove dist folder if it exists from the web folder
dist_path = os.path.join(web_folder_path, 'dist')
if os.path.exists(dist_path):
    import shutil
    shutil.rmtree(dist_path)

time.sleep(3)
setup(
    name='flowee',
    version='1.7',
    packages=find_packages(),
    install_requires=[
        'playwright',
        'click'
    ],
    description='A CLI tool to create AWS diagrams from Cloudformation templates.',
    package_data={'flowee': ['web/*/**/**/*']},
    include_package_data=True,
    entry_points={
        'console_scripts': [
            'flowee=flowee.cli:main',
        ],
    },
    cmdclass={
        'install': PostInstallCommand,
    },
    author='Westpoint Software Solutions',
    long_description=long_description,
    long_description_content_type='text/markdown'
)