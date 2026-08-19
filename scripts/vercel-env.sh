#!/usr/bin/env bash
#
# Bulk-load environment variables into a Vercel project.
#
# The Vercel CLI adds one variable at a time and has no --file flag, so this
# reads a local env file and pushes each entry. Existing variables are removed
# first, because `vercel env add` fails rather than overwrites — which means
# re-running this after changing one value would otherwise half-apply.
#
#   ./scripts/vercel-env.sh .env.production.local production
#
# The file is never committed: .gitignore excludes .env* apart from the
# template. Values are passed on stdin, so they never appear in your shell
# history or in `ps` output.
set -euo pipefail

FILE="${1:-.env.production.local}"
ENVIRONMENTS="${2:-production}"

if [ ! -f "$FILE" ]; then
  cat >&2 <<EOF
No such file: $FILE

Create it from the template, fill in the real values, then re-run:

    cp .env.example $FILE
    \$EDITOR $FILE
    ./scripts/vercel-env.sh $FILE $ENVIRONMENTS
EOF
  exit 1
fi

command -v vercel >/dev/null 2>&1 || VERCEL="npx vercel"
VERCEL="${VERCEL:-vercel}"

if [ ! -d .vercel ]; then
  echo "This directory is not linked to a Vercel project yet. Running link…"
  $VERCEL link
fi

added=0 skipped=0 failed=0

while IFS= read -r line || [ -n "$line" ]; do
  # Ignore comments and blank lines.
  case "$line" in ''|'#'*) continue ;; esac
  # Only KEY=VALUE lines.
  case "$line" in *=*) ;; *) continue ;; esac

  key="${line%%=*}"
  value="${line#*=}"

  # Trim whitespace and an optional `export ` prefix.
  key="$(printf '%s' "$key" | sed 's/^[[:space:]]*export[[:space:]]*//; s/[[:space:]]*$//')"
  # Strip surrounding quotes if present, leaving inner ones alone.
  value="$(printf '%s' "$value" | sed 's/^"\(.*\)"$/\1/; s/^'"'"'\(.*\)'"'"'$/\1/')"

  if [ -z "$value" ]; then
    printf '  skip   %-38s (no value set)\n' "$key"
    skipped=$((skipped + 1))
    continue
  fi

  # Remove any existing value so a re-run updates rather than fails. The
  # variable may legitimately not exist yet, so failure here is not an error.
  $VERCEL env rm "$key" "$ENVIRONMENTS" --yes >/dev/null 2>&1 || true

  if printf '%s' "$value" | $VERCEL env add "$key" "$ENVIRONMENTS" >/dev/null 2>&1; then
    printf '  added  %-38s -> %s\n' "$key" "$ENVIRONMENTS"
    added=$((added + 1))
  else
    printf '  FAILED %-38s\n' "$key"
    failed=$((failed + 1))
  fi
done < "$FILE"

echo
echo "$added added, $skipped skipped (blank), $failed failed"
[ "$failed" -eq 0 ] || exit 1

cat <<EOF

Values are stored but not yet live — Vercel reads them at build time, so:

    $VERCEL --prod

EOF
