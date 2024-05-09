from setuptools import setup, find_packages
from setuptools.command.build_py import build_py as BuildPyCommand
import os, time

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
    version='1.1',
    packages=find_packages(),
    install_requires=[
        'playwright',
    ],
    package_data={'flowee': ['web/*/**/**/*']},
    include_package_data=True,
    entry_points={
        'console_scripts': [
            'flowee=flowee.cli:main',
        ],
    }
)