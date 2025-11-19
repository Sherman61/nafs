#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

usage() {
  cat <<'USAGE'
Usage: scripts/deploy.sh [--project-name <name>] [docker compose options]

Wraps `docker compose up --build` but lets you override the Compose project name so
you can run multiple copies of the stack side-by-side. All remaining arguments are
forwarded directly to `docker compose` (for example `-d`).
USAGE
}

PROJECT_NAME=""
POSITIONAL=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    -p|--project-name)
      if [[ $# -lt 2 ]]; then
        echo "Error: --project-name requires a value" >&2
        usage >&2
        exit 1
      fi
      PROJECT_NAME="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    --)
      shift
      POSITIONAL+=("$@")
      break
      ;;
    *)
      POSITIONAL+=("$1")
      shift
      ;;
  esac
done

set -- "${POSITIONAL[@]}"

echo "Building and starting the Nafs stack..."

CMD=(docker compose)
if [[ -n "$PROJECT_NAME" ]]; then
  CMD+=(-p "$PROJECT_NAME")
fi

CMD+=(up --build)
CMD+=("$@")

"${CMD[@]}"
