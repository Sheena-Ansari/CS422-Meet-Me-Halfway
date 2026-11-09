# Meet Me Halfway: Team Build Plan

Nov 9, 2026 · Abhijith Sreenivasan

## Summary

**Goal: a deployed, working Functional Prototype and Google Slides submitted by Tuesday Nov 10, 9:00am.** The repo is empty today, so this plan cuts everything that is not needed for the demo.

We build a React web app where the host creates a group and gets a 6-character code, then tells friends the code. For this prototype every "friend" is **another browser tab on the same laptop**: each tab joins with the code, enters its own preferences, and votes. Tabs see each other's changes live. Restaurant data is a static file of 20 real places within 2 miles of 900 W Taylor St. **No server and no database**: the site is deployed on Vercel, and group data lives in the browser's `localStorage`.

Real multi-phone joining (Firebase) is planned for User Study 2. `db.js` is written so only that one file changes later.

## Decisions locked in

1. **React + Vite, plain JavaScript, plain CSS.** No TypeScript, no UI library. React Router for screens, with the group code in the URL (`/g/K7P2QX/results`) so a refresh keeps you in the group.
2. **One laptop, several tabs.** The host creates the group in tab 1 and reads the code out loud (in the demo) or types it into tabs 2–4. Graders can test the deployed link the same way.
3. **Group data in `localStorage`**, one entry per group. Tabs listen for the browser's `storage` event, so "3 of 4 Ready" and votes update in every tab instantly.
4. **No accounts.** On create or join, each tab gets a random member ID kept in `sessionStorage`, so each tab is its own person.
5. **No share link for now.** The host tells friends the code. Joining is: open the site → Join with Code → type code and name.
6. **Restaurants are a static file**, `src/backend/data/restaurants.json`, with 20 real places.
7. **Host role.** Only the host can press **Find Restaurants** (once everyone has finished preferences). Everyone else still enters their own preferences and votes in their own tab.
8. **Hard constraints vs. preferences.** Dietary needs, budget and the 2-mile radius are hard: a place that fails one is hidden. Cuisine is soft: it only changes the match %.
9. **Group budget = lowest member budget**, never the average.
10. **Shared shortlist, max 2 places.** Anyone can add or remove. Compare shows those 2.
11. **One proposal at a time, anyone can propose** from Details or Compare. Needs every member's Works for Me. One Not This One (with an optional reason) cancels it and everyone returns to results.
12. **Groups of 2 to 8 people.**
13. **Our data for anything we filter on** (cuisine, price, dietary, hours, location). A **View on Google Maps** button for full reviews, more photos and directions. One photo per restaurant.
14. **Hosting on Vercel**, linked to the private GitHub repo. Every push to `main` redeploys automatically. Free. (GitHub Pages does not work for private repos on free accounts.)

## How join codes work

The group record has a `status` field, and every tab shows the screen that matches it. That one field keeps everyone in step.

1. **Host creates** a group in tab 1 (name, starting location, own name). App generates a code like `K7P2QX` and saves the group with `status: "lobby"`.
2. **Host tells friends the code** (in the demo: opens tabs 2–4 on the same laptop).
3. **Friends join** from the Home screen: Join with Code → type the code and their name. They are added to `members`.
4. **Everyone fills in preferences** in their own tab. The lobby shows "3 of 4 Ready" live in every tab.
5. **Host presses Find Restaurants** (enabled when everyone is ready and there are 2+ members). `status` becomes `"browsing"` and every tab jumps to Results.
6. **Anyone shortlists and proposes.** Proposing sets `status: "voting"` and every tab jumps to the vote screen.
7. **Everyone votes.** All yes → `status: "confirmed"`, every tab shows Decision Confirmed. Any no → proposal cleared, `status: "browsing"`, everyone is back on Results with the reason in a banner.

Codes are 6 characters from `ABCDEFGHJKMNPQRSTUVWXYZ23456789` (no 0/O or 1/I). A code that does not exist shows "No group with that code". Joining after Find Restaurants shows "This group has already started".

**Limit to state in the demo:** tabs must be in the same browser on the same computer. Different phones or an incognito window will not see the group. That is the Firebase step for User Study 2.

## Inconsistencies in the mockups and how we fix them

The revised mockups set the look (colors, cards, chips, layout). The restaurants in them are examples only; real data replaces them. Where the mockups conflict, follow the Fix column.

| # | Where | Problem | Fix |
| --- | --- | --- | --- |
| 1 | Create Group | Host types every member's name. | Host types only their own name; others join with the code. |
| 2 | Preferences | Starting Location is on each member's screen. | It belongs to the group: set once on Create Group. |
| 3 | Group Preferences | Shows Average Budget $15. | Show **Budget: up to $X (lowest in group)** and filter by that. |
| 4 | Requirements | Requirement 1 says up to 4 people; study says bigger groups. | Support 2–8; counters read "X of N". |
| 5 | Restaurants | Stray Find Restaurants button at the bottom; no way to reach Compare. | Remove it. Add a **Compare (2)** button when the shortlist has 2. |
| 6 | Compare | Shows %75, and both places show the same hard-coded number. | Show **75%**, computed from real data. |
| 7 | Cards, Compare | 0.2 mi = 1 min walk is wrong (about 4 min). | Walk time is always computed, never typed. |
| 8 | Final decision (wireframe) | Shows the starting address as the restaurant's address. | Show the restaurant's address, then "X min walk from [start]". |
| 9 | Restaurants | Mimi's "Matches all preferences" though one member needs halal and Mimi's lists only vegetarian. | Hard-constraint logic hides it; badges are generated. |
| 10 | Preferences | "+ Add Cuisine" / "+ Add Dietary Need" free text. | Remove. Use the fixed lists (Data section). |
| 11 | Vote screen | Study: people could not tell who had not voted. | Each member shows approved (green), rejected (red) or waiting (grey). |
| 12 | Vote screen | Study: a rejection is a dead end. | Not This One opens an optional "Why?" box; the reason shows to everyone. |
| 13 | Flow | Study: proposing required going through Compare. | **Propose** on Details too; Compare is optional. |
| 14 | Details tabs | Menu / Photos / Reviews tabs need lots of data. | Keep **Overview** and **Menu** tabs. Photos and Reviews become one **View on Google Maps** button. |

## Who does what, and the order of work

Each person owns their own files, so nobody blocks anybody. Screens use mock data until the real pieces land.

| Person | Owns (files) | Delivers |
| --- | --- | --- |
| Abhijith | Setup, `src/backend/db.js`, `src/backend/useGroup.js`, `src/App.jsx`, deploy | Vite + React scaffold pushed, all group functions with live tab sync, Vercel live link |
| Fatima | `src/backend/data/restaurants.json`, `src/backend/matching.js` | 20 real restaurants with dietary info and photos; matching, distance, walk time, open now |
| Malika | Screens 1–5, `src/frontend/styles.css` | Home, Create, Join, Preferences, Lobby; shared colors, buttons, chips, cards |
| Sheena | Screens 6–10 | Results, Details, Compare, Vote, Confirmed |
| Everyone | Slides | One section each (see Slides checklist) |

**Order of work (Monday Nov 9):**

- [ ] Abhijith: scaffold, routes, `db.js` stubs and 5 sample restaurants pushed to `main`; Vercel showing the app. Everyone clones and runs it.
- [ ] Fatima: list of 20 restaurant names posted in the group chat for a quick yes, then full `restaurants.json` and `matching.js`.
- [ ] Abhijith: real `db.js` working across tabs.
- [ ] Malika and Sheena: screens working on sample data.
- [ ] Everyone: connect screens to `db.js` and `matching.js`; run the full flow with 4 tabs on the deployed link.
- [ ] Everyone: fix bugs, polish styles, rejection reasons, Google Maps button. One cognitive walkthrough with Scenario 2 and a quick check against Nielsen's 10 heuristics.
- [ ] Everyone: slides drafted (each person their section).
- [ ] Code freeze. Record a 60-second backup video of the full flow.

**Tuesday Nov 10:**

- [ ] One last run of the full flow on the live link.
- [ ] Slides submitted through the deliverables form before 9:00am, with the live link on the first slide.

## Setup

**First time (everyone):**

1. Get added as a collaborator on the repo (Sheena: Settings → Collaborators).
2. In VS Code: Cmd + Shift + P → **Git: Clone** → paste `https://github.com/Sheena-Ansari/CS422-Meet-Me-Halfway.git` → Open.
3. Terminal → New Terminal, then run `npm install` and `npm run dev`. Cmd + click the link it prints.
4. Make your own branch: click **main** in the bottom-left corner → **Create new branch…** → e.g. `malika/screens-1-5`.

**Deploy (Abhijith, once):** vercel.com → sign in with GitHub → Add New Project → import `CS422-Meet-Me-Halfway` → Framework: Vite → Deploy. `vercel.json` is already in the repo so refreshing on `/g/K7P2QX/results` works. Sheena (repo owner) may need to approve Vercel's access.

**Folder structure** (frontend and backend kept apart):

```
docs/BUILD_PLAN.md            this plan
src/
  main.jsx, App.jsx           entry point and routes
  backend/                    logic and data (no UI)
    constants.js              fixed lists: cuisines, dietary, budget, start locations
    db.js                     create/join/save/vote + tab sync (Abhijith)
    useGroup.js               React hook: live group + current member (Abhijith)
    matching.js               filtering, scoring, distance, open now (Fatima)
    data/restaurants.json     20 restaurants (Fatima)
  frontend/                   everything the user sees
    styles.css                colors, buttons, chips, cards (Malika)
    screens/                  one file per screen (Malika 1–5, Sheena 6–10)
    components/               Header, Chip, RestaurantCard, MemberAvatar
public/images/                one photo per restaurant
vercel.json                   lets Vercel load any route on refresh
```

Rule: files in `frontend/` import from `backend/`, never the other way around.

**Style tokens from the mockups:** teal `#0B7A6F` (buttons, selected chips, badges), navy `#163B5C` (headings), chip grey `#E8EEF0`, light green badge `#D4F0E4`, font Inter. Cards are white with a 1px `#DDE3E6` border and 12px radius. Max width 430px, centered, so it looks like a phone on a laptop too.

## Data

Two data structures run the whole app: the restaurant list (fixed) and the group record (live). These also go on the Information Design slide.

### The 20 restaurants

All within 2 miles of 900 W Taylor St: Taylor Street / Little Italy, University Village, Greektown, West Loop, Pilsen, Chinatown. Fatima fills them by hand from Google Maps; no API script needed for Tuesday. Pick for variety so filters always return something:

- At least 7 cuisines, at least 6 with halal options, 8 vegetarian-friendly, 3 vegan-friendly
- Prices from about $8 to $30 per person; a mix of 1–20 minute walks
- Cuisine list (fixed): American, Burgers, Mediterranean, Middle Eastern, Mexican, Italian, Pizza, Chinese, Thai, Indian, Japanese, Cafe
- Dietary list (fixed): Halal, Vegetarian, Vegan

```json
{
  "id": "thai-bowl",
  "name": "Thai Bowl",
  "address": "1049 W Taylor St, Chicago, IL 60607",
  "lat": 41.8695, "lng": -87.6527,
  "cuisine": "Thai",
  "rating": 4.3, "reviewCount": 451,
  "priceMin": 10, "priceMax": 20,
  "dietary": { "halal": true, "vegetarian": true, "vegan": false },
  "hours": { "open": "11:00", "close": "21:00" },
  "about": "Small storefront serving classic Thai noodles and curries.",
  "menu": [{ "item": "Pad Thai", "price": 12 }, { "item": "Green Curry", "price": 13 }],
  "photo": "/images/thai-bowl.jpg",
  "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Thai+Bowl+1049+W+Taylor+St+Chicago"
}
```

(The values above are an example of the shape only; check every real restaurant yourself.)

- `lat`/`lng`: right-click the place in Google Maps; the first menu line is the coordinates.
- `priceMin`/`priceMax`: cheapest and typical main dish on the menu.
- `dietary`: only `true` if the menu or website clearly shows it. Otherwise `false`.
- `menu`: 3–5 real dishes with prices.
- `hours`: one open/close pair (the usual weekday hours).

### The group record (in `localStorage`, key `mmh:group:K7P2QX`)

```json
{
  "code": "K7P2QX",
  "name": "Friday Dinner",
  "hostId": "m_ab12",
  "start": { "label": "900 W Taylor St", "lat": 41.8696, "lng": -87.6475 },
  "status": "lobby",
  "members": {
    "m_ab12": { "name": "Kamilla", "cuisines": [], "dietary": [], "budget": 20, "ready": true },
    "m_cd34": { "name": "Priya", "cuisines": ["Indian"], "dietary": ["Vegetarian"], "budget": 20, "ready": false }
  },
  "shortlist": ["busy-burger", "belly-bowl"],
  "proposal": { "restaurantId": "busy-burger", "by": "m_ab12", "votes": { "m_ab12": { "vote": "yes", "reason": "" } } },
  "lastRejection": null,
  "finalId": null,
  "updatedAt": 1762678800000
}
```

- `status`: `lobby` → `browsing` → `voting` → `confirmed` (back to `browsing` on any no).
- Empty `cuisines` means "No preference".
- Each tab's own member ID lives in `sessionStorage` (`mmh:me:K7P2QX`).
- Starting locations are a short fixed list (900 W Taylor St, UIC Student Center East, Student Center West, Richard J. Daley Library) with coordinates stored, so no address lookup is needed.

### Functions in `db.js` (Abhijith)

Every write reads the latest record, changes it, saves it, and updates `updatedAt`. Other tabs get the browser's `storage` event and re-render.

| Function | What it does |
| --- | --- |
| `createGroup(name, start, hostName)` | Makes a code, saves the record, returns `{ code, memberId }` |
| `joinGroup(code, name)` | Checks the code exists and status is `lobby`, adds member, returns `memberId` |
| `subscribeGroup(code, callback)` | Calls back now and on every `storage` event for that key; returns an unsubscribe function |
| `savePreferences(code, memberId, prefs)` | Saves cuisines, dietary, budget and sets `ready: true` |
| `startBrowsing(code)` | Host only: `status = "browsing"` |
| `toggleShortlist(code, restaurantId)` | Add or remove; refuses a third |
| `propose(code, memberId, restaurantId)` | Sets proposal with proposer's yes vote, `status = "voting"` |
| `vote(code, memberId, yesNo, reason)` | Records vote; all yes → `confirmed`; a no → back to `browsing` with `lastRejection` |
| `leaveGroup(code)` | Clears this tab's member ID (Create Another Group) |

The browser's `storage` event fires only in the *other* tabs, so `db.js` also calls the current tab's callback directly after each write.

## Matching rules (Fatima, `matching.js`)

A restaurant appears only if it passes all three hard checks; cuisine then sets its match % and badge. All screens call these functions and never compute numbers themselves.

**Hard checks (fail one = hidden):**

1. **Distance:** 2 miles or less from the group's start (Haversine formula).
2. **Budget:** `priceMin` ≤ the lowest member budget.
3. **Dietary:** for every need any member picked, the restaurant's flag is `true`.

**Match % and badge:**

- Match % = members whose cuisines include this restaurant's cuisine, or who picked none, ÷ group size, rounded. 3 of 4 = 75%.
- Badge: 100% → "Matches all preferences"; 50–99% → "Matches X% of cuisine picks"; under 50% → "Meets everyone's needs and budget".
- `fans`: names behind the %, shown on Details ("Sebastian and Kamilla want Mediterranean").

**Other numbers:** walk minutes = max(1, round(miles × 20)). Open now = current time between `open` and `close`.

**Sort:** default by match %, then distance. Toggle: Closest, Cheapest.

| Function | Returns |
| --- | --- |
| `getResults(group, restaurants, sort)` | Passing restaurants, each `{ ...restaurant, miles, walkMin, openNow, matchPct, badge, fans }` |
| `evaluate(group, restaurant)` | The same object for one restaurant, plus `fails` (which checks fail) |
| `groupBudget(group)` | Lowest member budget |

**If nothing passes:** show "No places fit everyone yet" and which check removed the most places (e.g. "Budget removed 9 places"). This is a cheap version of the compromise idea from our proposal.

## Screen-by-screen spec

Ten screens. Bold = new or changed from the revised mockups. On screens 6–10, a status change in the group record moves every tab automatically (`useGroup` hook redirects).

| # | Route | Screen | Shows | Actions → next |
| --- | --- | --- | --- | --- |
| 1 | `/` | **Home** | Logo, one-line pitch | **Create a Group** → 2, **Join with Code** → 3 |
| 2 | `/create` | Create a Group | Group name, **starting location dropdown**, **your name** | Create → 4 (as host) |
| 3 | `/join` | **Join** | Code box, your name; errors for bad or started codes | Join → 4 |
| 4 | `/g/:code/prefs` | Your Preferences | Cuisine chips (up to 3, or No preference), dietary chips, budget slider $5–$40 in $5 steps | Save → 5 |
| 5 | `/g/:code/lobby` | Group Preferences | **Big code to tell friends** (host), "N of N Ready" bar, **Budget: up to $X (lowest)**, member list with picks and ✓ or "filling in…" | Host: **Find Restaurants** (enabled when all ready). Others: "Waiting for host…". Edit my preferences → 4 |
| 6 | `/g/:code/results` | Restaurants | Sort toggle, cards: photo, name, rating, price range, cuisine, dietary icons, distance + walk, badge, **bookmark** | Tap card → 7; **Compare (2)** → 8; rejection banner if last proposal failed |
| 7 | `/g/:code/r/:id` | Restaurant Details | Photo, rating, distance/walk, open now + hours, price, tabs **Overview / Menu**, dietary checks, **who wants this cuisine**, **View on Google Maps** | Add to Shortlist / Saved; **Propose to Group** |
| 8 | `/g/:code/compare` | Compare | 2 columns: price, distance, walk, cuisine, halal, vegetarian, vegan, **real match %** | Propose under each column |
| 9 | `/g/:code/vote` | Proposed Restaurant | Summary card, "X of N Approved", **each member green / red / grey** | Works for Me / Not This One (**optional Why?**) |
| 10 | `/g/:code/done` | Decision Confirmed | Name, restaurant address, "X min walk from [start]", Google Maps button | **Create Another Group** → 1 |

Every screen needs a loading state ("Joining…") and a friendly error if the group cannot be found. Back arrows never break the group.

## Slides checklist (7 minutes, strict)

Time follows the rubric points: 65 of 100 points are the working app, so the live demo gets half the talk. Extra detail can sit in hidden slides.

| Slide(s) | Rubric pts | Time | Content | Owner |
| --- | --- | --- | --- | --- |
| Title | – | 0:10 | Name, team, **live link + QR code**, "To try: create a group, then open more tabs and join with the code" | Malika |
| Requirements, Personas, Use Cases | 10 | 0:45 | 12 requirements in one table; 3 personas as one-liners; Scenarios 1 and 2 rewritten as Use Cases (actor, goal, steps, alternate path: "someone says no") | Sheena |
| Implications for Design / MVP Spec | 10 | 0:45 | Bulleted list, each a **bold title + short paragraph**: Hard constraints are filters; Propose from anywhere; Visible vote state; Rejections carry a reason; Join with a code; Budget = lowest; Price and walk time on every card | Fatima |
| Information design | 10 | 1:00 | The restaurant JSON and group record with example values; facets (dietary, budget, distance = hard; cuisine = soft); status flow lobby → browsing → voting → confirmed; screenshots | Abhijith |
| Live demo | 25 + 20 + 20 | 3:00 | Scenario 2 (Friday Dinner) in 4 tabs side by side on one projected laptop: create → join with code → preferences → results → shortlist → compare → propose → one "Not This One" with reason → re-propose → 4 of 4 → confirmed | Abhijith drives, another member narrates |
| What works / what doesn't | (in 20s) | 0:40 | Honest list, mapped to requirements; e.g. restaurant data is hand-curated, no tie-breaker yet | Sheena |
| Plan for User Study 2 | (in 20s) | 0:40 | What we test (does the vote screen make consensus clear? do codes feel easy?); what we add (joining from real phones with a share link, compromise suggestions, tie-breaker) | Malika |

Backup: the 60-second recorded video, in a hidden slide, in case Wi-Fi fails.

## Out of scope and working rules

**Not building for Tuesday** (say these in "what doesn't work yet"):

- Joining from different phones or a share link (Firebase, next study); accounts or saved history
- Calling Google Places from the app, live maps or typed address search
- "Raise budget to $X → +N options" compromise suggestions and tie-breakers
- Real per-day hours, wait times, reservations
- More than 2 restaurants in Compare

**Working rules:**

1. Work on your own branch (`malika/screens-1-5` etc.). Merge to `main` with a pull request; pull `main` often.
2. Only edit files you own. Need a change in someone else's file? Ask in the group chat first.
3. Screens never type numbers, distances or badges; they call `matching.js` and `db.js`.
4. Test at phone width (390px) before merging.
5. Not covered here? Pick the simplest option, post it in the chat, add one line to this doc.