#!/usr/bin/env bash

GIT_DIR=$(git rev-parse --git-dir)


echo "Installing hooks..."
cp ./script/pre-commit.sh $GIT_DIR/hooks/pre-commit.sh
mv $GIT_DIR/hooks/pre-commit.sh $GIT_DIR/hooks/pre-commit
echo "Done"!
