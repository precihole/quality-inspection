from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in quality_inspection/__init__.py
from quality_inspection import __version__ as version

setup(
	name="quality_inspection",
	version=version,
	description="For managing the quality of product",
	author="Precihole",
	author_email="erpadmin@preciholesports.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
