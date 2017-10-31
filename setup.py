"""
NBScratch: Jupyter Notebook Extension placing a computational scratchpad in the
notebook operating in the same namespace as the notebook
"""

from distutils.core import setup

setup(
    name='nbscratch',
    version='0.1',
    description='Jupyter Notebook Extension placing a computational scratchpad in the notebook operating in the same namespace as the notebook',
    author='Adam Rule',
    author_email='acrule@ucsd.edu',
    license='BSD-3-Clause',
    packages=['nbscratch'],
    package_dir={'nbscratch': 'nbscratch'},
    package_data={'nbscratch': ['static/*.js']}
)
