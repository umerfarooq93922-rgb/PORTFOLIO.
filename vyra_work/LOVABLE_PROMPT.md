# VYRA — Lovable Prompt

Paste the prompt below into Lovable (lovable.dev) to scaffold the VYRA portfolio. Follow up with the notes at the bottom to refine it further.

---

## Main Prompt

Build a dark, editorial personal portfolio website called **VYRA** for Muhammad Umer Farooq, a design student working across character illustration and front-end web design. Theme: pure black and deep red (#08070a background, #c81e3a / #ff2e46 red accents, #f3ecec off-white text). Typography: a bold geometric display font (like Unbounded) for headings, a clean sans (like Manrope) for body text, and a monospace font (like Space Mono) for labels/eyebrows.

**Global elements:**
- A custom cursor: a small glowing red dot with a thin ring around it that expands on hover over links/buttons, plus two tiny animated devil-wing shapes flapping on the left and right of the cursor.
- A full-screen loading intro on first load: centered VYRA wordmark logo with small wing flourishes, and a bordered "Click / Tap to Open" button. Clicking or pressing Enter/Space fades the loader out and reveals the site with a subtle entrance animation.
- A fixed top navbar with the VYRA wing-mark logo on the left and nav links on the right: Home, Gallery (and Contact — but only show Contact on pages other than the homepage). Navbar gets a blurred dark background once the user scrolls. Include a mobile hamburger menu that slides in a full-height panel from the right.
- A floating chatbot widget bottom-right: a circular red toggle button that opens a small dark chat panel with quick-reply buttons (Services, Contact, Tools) and a text input, giving canned responses about services, contact info, and tools used.
- A footer with copyright, location (Karachi, Pakistan), and email link.
- Scroll-reveal animations (fade + slide up) on major sections using IntersectionObserver.

**Homepage (index.html):**
1. Hero section: eyebrow label "Muhammad Umer Farooq", big headline "Character Design & Web Craft." (with "Web" in red), a short intro paragraph, two CTA buttons (View Gallery / Get in Touch), a stat row (25+ Character Pieces, 03 Web Builds, 02 Core Disciplines), and a soft red radial glow in the background.
2. "Web Design" featured section: 3 animated project cards in a grid (image fills card, dark gradient overlay, project tag + name revealed with a hover-triggered arrow icon), linking to 3 separate front-end project pages. A "See More Web Design" button links to the gallery's web section.
3. "Character Design" featured section: 6-7 smaller animated character cards (portrait aspect ratio) in a grid, each tagged by style/character name, linking into the filterable gallery. A "See More Character Design" button.
4. About/CTA split section: short bio + skill tag pills (Photoshop, Canva, HTML/CSS/JS, Character Design, UI Motion) on one side, a featured artwork card on the other.

**Gallery page (gallery.html):**
- Two major headings: **Web Design** and **Character Design**.
- Web Design shows 3 project cards (image, tag, title, short description, "View Project" button) linking to the 3 demo project pages.
- Character Design shows a masonry/column grid (CSS columns, so images keep their natural aspect ratio and never stretch or crop awkwardly) of illustration pieces, each with a hover caption (style tag + name).
- A filter bar above the Character Design grid with pill buttons: All, Anime Illustration, Kai, Seno, Anthro Headshots, Design Sheet, Fan Art — clicking filters the grid instantly and updates a piece counter.
- Support deep-linking via URL hash (e.g. gallery.html#char-kai auto-selects the Kai filter and scrolls to the section).

**Contact page (contact.html):**
- Split layout: left side has a big "Start a project." headline, short blurb, and contact details (email, phone, location); right side has a contact form (name, email, message) that submits via fetch() to a PHP backend endpoint, shows a status message, and gracefully falls back to "email me directly" messaging if the request fails.

**3 front-end demo projects** (each a self-contained page, visually distinct from VYRA's red/black theme and from each other, linked from the homepage and gallery):
1. **NOVA** — a bold streetwear e-commerce landing page: black/off-white/acid-yellow palette, thick borders, a marquee ticker strip, a product grid with category filters (Tees/Hoodies/Accessories) and working "Add to Cart" buttons that update a cart counter in the nav.
2. **LUXE** — a soft-luxury cosmetics landing page: blush/cream palette, serif display font, an interactive shade-matcher (clicking swatches updates a preview card), and a product grid.
3. **PULSE** — a dark SaaS analytics dashboard: sidebar nav, animated counting stat cards, an animated bar chart and donut chart built with plain CSS/JS (no chart library required), and a date-range toggle.

**Tech constraints:** Plain HTML, CSS and vanilla JavaScript only — no frameworks required, no build step. All animations should use CSS transitions/keyframes or requestAnimationFrame. Keep it a static site (the contact form posts to an external PHP+MySQL endpoint, not part of the static build).

---

## Follow-up prompts (paste one at a time after the first generation)

1. "Add the custom two-dot cursor with tiny animated devil wings on both sides, and hide it in favor of the normal cursor on touch devices."
2. "Make the loading screen a true first-visit gate — full black screen with the VYRA logo and a bordered 'Click / Tap to Open' button that must be clicked (or Enter/Space pressed) before the site content is revealed."
3. "Convert the Character Design grid into a CSS-columns masonry layout so every image keeps its original aspect ratio without cropping or stretching."
4. "Wire up the filter buttons above the Character Design gallery so they show/hide items by data-category and update a live count label."
5. "Add the floating chatbot widget with quick-reply buttons and canned responses about services, tools, and contact info."

---

*Generated for VYRA — Muhammad Umer Farooq's design portfolio.*
