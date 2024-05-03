#!usr/bin/env bash

# This script is used to build the project
cd ..
python setup.py sdist bdist_wheel
pip install dist/flowee-1.0-py3-none-any.whl --force-reinstall