from setuptools import setup, find_packages
from setuptools.command.build_py import build_py as BuildPyCommand
import subprocess
import os
import site

site_packages = site.getsitepackages()[0]


class PostBuildCommand(BuildPyCommand):
    def run(self):
        # Run npm install command
        npm_install_command = ['npm', 'install']
        subprocess.check_call(npm_install_command, cwd=os.path.join(site_packages, 'flowee', 'web'))

        # Continue with the default installation process
        super().run()

setup(
    name='flowee',
    version='1.0',
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
    },
    cmdclass={
        'build_py': PostBuildCommand,
    }
)