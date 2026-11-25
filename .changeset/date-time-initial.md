---
"@sgx4u/date-time": minor
---

Summary: First release of @sgx4u/date-time.

Added: `isValidDate` reports whether a `Date`, a millisecond timestamp, or a `YYYY-MM-DD` or ISO date-time string is a real date. Overflow dates such as `2024-02-30`, `Invalid Date`, `NaN`, empty strings, `null`, and other non-dates return `false`.
