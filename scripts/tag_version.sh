#!/bin/bash

# Se placer à la racine du dépôt
cd "$(dirname "$0")/.."

# Lire la version du package.json
version=$(node -p "require('./package.json').version")

# Créer un tag git avec cette version
git tag -a "v$version" -m "version v$version"

# Pousser le tag vers le dépôt distant
git push origin "v$version"
