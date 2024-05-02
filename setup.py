from setuptools import setup, find_packages

setup(
    name='flowee',
    version='1.0',
    packages=find_packages(),
    install_requires=[
        'playwright==1.11.1',
        'subprocess',
        'time',
    ],
    entry_points={
        'console_scripts': [
            'flowee = flowee.main:main'
        ]
    },
    
)