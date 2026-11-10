// Filtering, scoring, distance, time. Pure functions: no React, no storage.
// Owner: Fatima. Spec: docs/BUILD_PLAN.md → "Matching rules".
// Screens never compute these numbers themselves; they call these.
import { MAX_DISTANCE_MILES } from './constants.js'

const DIETARY_KEY = { Halal: 'halal', Vegetarian: 'vegetarian', Vegan: 'vegan' }

/** Straight-line miles between two { lat, lng } points (Haversine formula). */
export function distanceMiles(a, b) {
  if (!a || !b) return 0
  const R = 3958.8 // Earth radius in miles
  const rad = (d) => (d * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLng = rad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

/** Walking minutes at about 3 mph: max(1, round(miles × 20)). */
export function walkMinutes(miles) {
  return Math.max(1, Math.round(miles * 20))
}

/** True if `date` falls between restaurant.hours.open and .close ("HH:MM"). Handles closing after midnight. */
export function isOpenNow(restaurant, date = new Date()) {
  const h = restaurant?.hours
  if (!h?.open || !h?.close) return false
  const toMin = (t) => {
    const [hh, mm] = t.split(':').map(Number)
    return hh * 60 + mm
  }
  const now = date.getHours() * 60 + date.getMinutes()
  const open = toMin(h.open)
  const close = toMin(h.close)
  return close > open ? now >= open && now < close : now >= open || now < close
}

/** Members as an array (works with the group record's members object). */
function membersOf(group) {
  return group?.members ? Object.values(group.members) : []
}

/** Lowest budget among members (0 if no members). */
export function groupBudget(group) {
  const budgets = membersOf(group).map((m) => m.budget).filter((b) => typeof b === 'number')
  return budgets.length ? Math.min(...budgets) : 0
}

/** Every dietary need anyone in the group picked, e.g. ['Halal', 'Vegetarian']. */
export function groupDietary(group) {
  return [...new Set(membersOf(group).flatMap((m) => m.dietary || []))]
}

/**
 * One restaurant for the group:
 * { ...restaurant, miles, walkMin, openNow, matchPct, badge, fans, fails }
 * fails = [] when it passes, otherwise any of 'distance' | 'budget' | 'dietary'
 */
export function evaluate(group, restaurant) {
  const members = membersOf(group)
  const miles = Math.round(distanceMiles(group?.start, restaurant) * 10) / 10

  const fails = []
  if (miles > MAX_DISTANCE_MILES) fails.push('distance')
  if (restaurant.priceMin > groupBudget(group)) fails.push('budget')
  const needs = groupDietary(group)
  if (needs.some((n) => restaurant.dietary?.[DIETARY_KEY[n]] !== true)) fails.push('dietary')

  // Cuisine is soft: who wants this restaurant's cuisine (or has no preference)?
  const fans = members
    .filter((m) => !m.cuisines?.length || m.cuisines.includes(restaurant.cuisine))
    .map((m) => m.name)
  const matchPct = members.length ? Math.round((fans.length / members.length) * 100) : 0

  let badge
  if (matchPct === 100) badge = 'Matches all preferences'
  else if (matchPct >= 50) badge = `Matches ${matchPct}% of cuisine picks`
  else badge = "Meets everyone's needs and budget"

  return {
    ...restaurant,
    miles,
    walkMin: walkMinutes(miles),
    openNow: isOpenNow(restaurant),
    matchPct,
    badge,
    fans,
    fails,
  }
}

/**
 * Restaurants passing every hard check, sorted.
 * sort: 'match' (default: match %, then closest) | 'closest' | 'cheapest'
 */
export function getResults(group, restaurants, sort = 'match') {
  const passing = restaurants.map((r) => evaluate(group, r)).filter((r) => r.fails.length === 0)
  const sorters = {
    match: (a, b) => b.matchPct - a.matchPct || a.miles - b.miles,
    closest: (a, b) => a.miles - b.miles,
    cheapest: (a, b) => a.priceMin - b.priceMin || a.miles - b.miles,
  }
  return passing.sort(sorters[sort] || sorters.match)
}

/** For the empty state: how many places each hard check removed → { distance, budget, dietary }. */
export function whyNoResults(group, restaurants) {
  const counts = { distance: 0, budget: 0, dietary: 0 }
  restaurants.forEach((r) => evaluate(group, r).fails.forEach((f) => counts[f]++))
  return counts
}