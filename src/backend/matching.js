// Filtering, scoring, distance, time. Pure functions: no React, no storage. Owner: Fatima.
// Spec: docs/BUILD_PLAN.md → "Matching rules". Screens never compute these numbers themselves.

/** Straight-line miles between {lat,lng} points (Haversine). */
export function distanceMiles(a, b) { return 0 }

/** max(1, round(miles × 20)) */
export function walkMinutes(miles) { return 1 }

/** True if date is between restaurant.hours.open and .close ("HH:MM"). */
export function isOpenNow(restaurant, date = new Date()) { return true }

/** Lowest budget among members. */
export function groupBudget(group) { return 0 }

/** One restaurant for the group: { ...restaurant, miles, walkMin, openNow, matchPct, badge, fans, fails }. */
export function evaluate(group, restaurant) {
  return { ...restaurant, miles: 0, walkMin: 1, openNow: true, matchPct: 0, badge: '', fans: [], fails: [] }
}

/** Restaurants passing all hard checks, sorted by 'match' | 'closest' | 'cheapest'. */
export function getResults(group, restaurants, sort = 'match') { return [] }

/** Empty state: how many places each check removed → { distance, budget, dietary }. */
export function whyNoResults(group, restaurants) { return { distance: 0, budget: 0, dietary: 0 } }