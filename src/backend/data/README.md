# Restaurant data — Owner: Fatima

`restaurants.json` holds 15 real restaurants within about 1.3 miles of 900 W Taylor St (gathered Nov 9, 2026).

| Field | Where it came from | Trust |
|---|---|---|
| name, address, lat/lng, rating, reviewCount, hours | Google Maps listing | Real |
| halal | Listed on Zabihah (halal directory) or "Halal Certified" in the name: IDOF, Cairo Kebab, Ghareeb Nawaz UIC, Bereket. Everything else is `false` because it could not be confirmed. | Checked |
| vegetarian / vegan | Vegan = clearly vegan dishes on the menu (IDOF, Veggie House, One More Sushi). Vegetarian = has meat-free mains. | Best effort |
| priceMin / priceMax | Google price level + menu prices where found | Approximate |
| menu | 4 real dishes. Exact prices only where `"menuApprox": false` (IDOF, Veggie House); otherwise approximate, and the app says "Prices are approximate." | See `menuApprox` |
| menuUrl | The restaurant's full menu: its own ordering page (Toast, OpenTable) where one exists, otherwise its menu on MenuPages, DoorDash, Uber Eats, Slice or order.online. Thai Bowl links to its Google Maps listing (Menu tab). | Real links |
| hours | One open/close pair = usual weekday hours. Some places close one day a week (noted in `about`). | Simplified |
| photo | Empty for now: the app shows a placeholder. Add photos to `public/images/` and set `"photo": "/images/<id>.jpg"`. | To do |

Before the demo, spot-check a couple of menus and prices. Say in the presentation that menu prices are approximate.
