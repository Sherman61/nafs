#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: scripts/scaffold_repo.sh <target-directory> [options]

Creates a fresh copy of this stack in <target-directory>, optionally initializing
an empty Git repository and suggesting a Docker Compose project name for
parallel deployments.

Options:
  --project-name <name>  Suggest a docker compose project name for the copy.
  --no-git               Skip running `git init` inside the new directory.
  --force                Overwrite <target-directory> if it already exists.
  -h, --help             Show this message.
USAGE
}

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_DIR=""
PROJECT_NAME=""
INIT_GIT=true
FORCE=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --project-name)
      if [[ $# -lt 2 ]]; then
        echo "Error: --project-name requires a value" >&2
        usage >&2
        exit 1
      fi
      PROJECT_NAME="$2"
      shift 2
      ;;
    --no-git)
      INIT_GIT=false
      shift
      ;;
    --force)
      FORCE=true
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      if [[ -z "$TARGET_DIR" ]]; then
        TARGET_DIR="$1"
        shift
      else
        echo "Error: unexpected argument '$1'" >&2
        usage >&2
        exit 1
      fi
      ;;
  esac
done

if [[ -z "$TARGET_DIR" ]]; then
  echo "Error: target directory is required" >&2
  usage >&2
  exit 1
fi

abs_target=$(python3 - <<PY
import os
import sys
print(os.path.abspath(sys.argv[1]))
PY
"$TARGET_DIR")
TARGET_DIR="$abs_target"

case "$TARGET_DIR" in
  "$ROOT_DIR"|"$ROOT_DIR"/*)
    echo "Error: target directory must live outside the current repository ($ROOT_DIR)." >&2
    exit 1
    ;;
esac

if [[ -e "$TARGET_DIR" ]]; then
  if [[ ! -d "$TARGET_DIR" ]]; then
    echo "Error: $TARGET_DIR exists and is not a directory" >&2
    exit 1
  fi
  if [[ -n "$(ls -A "$TARGET_DIR" 2>/dev/null)" ]]; then
    if [[ "$FORCE" == true ]]; then
      if [[ "$TARGET_DIR" == "/" ]]; then
        echo "Refusing to delete root directory" >&2
        exit 1
      fi
      rm -rf "$TARGET_DIR"
      mkdir -p "$TARGET_DIR"
    else
      echo "Error: $TARGET_DIR is not empty (use --force to overwrite)" >&2
      exit 1
    fi
  fi
else
  mkdir -p "$TARGET_DIR"
fi

cd "$ROOT_DIR"

EXCLUDES=(
  --exclude='.git'
  --exclude='.github'
  --exclude='node_modules'
  --exclude='*/node_modules'
  --exclude='client/.vite'
  --exclude='client/dist'
  --exclude='server/.cache'
  --exclude='server/dist'
)

tar "${EXCLUDES[@]}" -cf - . | tar -xf - -C "$TARGET_DIR"

if [[ "$INIT_GIT" == true ]]; then
  (cd "$TARGET_DIR" && git init >/dev/null)
fi

echo "✅ New stack copied to $TARGET_DIR"
if [[ "$INIT_GIT" == true ]]; then
  echo "   A fresh Git repository has been initialized. Run 'git add -A && git commit' when ready."
fi

if [[ -n "$PROJECT_NAME" ]]; then
  echo "   Suggested Docker Compose project name: $PROJECT_NAME"
  echo "   Use it with: scripts/deploy.sh --project-name $PROJECT_NAME"
fi

echo "Next steps:"
echo "  1. cd $TARGET_DIR"
echo "  2. Install dependencies (npm install inside client/ and server/)."
echo "  3. Run scripts/deploy.sh${PROJECT_NAME:+ --project-name $PROJECT_NAME} -d"
