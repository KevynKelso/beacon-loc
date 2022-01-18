#!/usr/bin/env bash

echo "Running pre-commit hook"
$(pwd)/script/run-tests.sh
git cliff > $(pwd)/CHANGELOG.md

# $? stores exit value of the last command
if [ $? -ne 0 ]; then
 echo "Tests must pass before commit!"
 exit 1
fi
