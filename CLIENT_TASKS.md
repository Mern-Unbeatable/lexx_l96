# Client Feedback — Task List

Source: client messages (lexx_l96) — Jul 2026

---

## Find Games page

- [x] **Filters dropdown** — Filters icon-এ dropdown add করা হয়েছে
- [x] **Search radius** — input + dropdown combo রাখা হয়েছে (default empty)
- [x] **Location display** — current location এখন town / postcode দেখায় (Nominatim + fallback)

---

## Host a Game page

- [x] **Course search dropdown** — typing-এ England course suggestions
- [x] **England courses database** — curated England courses list (`src/data/englandCourses.js`)
- [x] **Payment note** — Cost per round field-এর নিচে note
- [x] **Date / Time layout** — mobile-এ single column করে overlap fix

---

## Join / Joined flow

- [x] **Request to Join modal** — message modal
- [x] **Joined status text** — “Awaiting hosts approval”
- [x] **Chat access** — Joined accepted games-এ chat open (player/game ids normalized)

---

## Reviews

- [x] **5-star rating** — Leave Review modal-এ 5-star picker
- [x] **Leave a review UI** — Past Games → “Leave review” button/badge

---

## Bugs

- [x] **Decline button** — Decline কাজ করে (My Games + Join Requests)

---

## Notes

1. England courses list currently curated static data (not every UK course). Backend API later replace করা যাবে।
2. Reverse geocode uses OpenStreetMap Nominatim until backend is ready.
