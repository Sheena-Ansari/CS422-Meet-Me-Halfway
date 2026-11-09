# Meet Me Halfway

Group restaurant decisions near UIC. A host creates a group and gets a code, friends join with the code, everyone enters their cuisine, dietary and budget preferences, and the group shortlists, compares and votes on a restaurant together.

CS 422 Functional Prototype, Team 2: Abhijith Sreenivasan, Malika Batyrova, Sheena Ansari, Fatima Rasheed.

## Run it

```bash
npm install
npm run dev
```

Open the link it prints. To try a group alone: create a group in one tab, then open more tabs **in the same browser** and join with the code.

## Folders

```
docs/BUILD_PLAN.md     team plan: decisions, data, screens, who owns what
src/backend/           logic and data, no UI (db.js, matching.js, restaurants.json)
src/frontend/          screens, components and styles
public/images/         restaurant photos
```

Frontend files import from `backend/`, never the other way around.

## Working rules

1. Work on your own branch and merge to `main` with a pull request.
2. Only edit files you own (see `docs/BUILD_PLAN.md`).
3. Screens never hard-code distances, prices or match %; they call `src/backend/matching.js`.