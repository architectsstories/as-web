# Architects Stories — People Visibility Patch

Adds a **Show in Community** toggle to the Sanity Person document.

- Default: ON
- Turn OFF to hide the person from the public Community directory and profile.
- Existing people remain visible because `showInCommunity != false` treats older documents without the field as enabled.

Changed files:
- admin/schemaTypes/person.ts
- website/lib/queries.js

Merge these files into the existing as-web project; do not replace the whole project.
