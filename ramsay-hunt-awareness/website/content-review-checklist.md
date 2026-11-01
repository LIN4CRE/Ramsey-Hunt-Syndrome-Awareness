# Website Content and Accessibility Review Checklist

> **Standard:** WCAG 2.1 AA Compliance and Section 10 Brief Alignment  
> **Target:** Live Web Application & Awareness Portal

---

## Content Verification Checklist
- [x] **Project Mission Clearly Displayed:** Stated as an awareness initiative, not a registered charity.
- [x] **Personal vs. Medical Facts Separated:** Lived experience narratives are clearly delineated from verified clinical facts.
- [x] **Clinical Disclaimer Present:** Unambiguous warning stating no individual medical advice or diagnosis is provided.
- [x] **Primary Source Links:** Verified links to Facial Palsy UK, The Brain Charity, and NHS provided.
- [x] **Non-Monetary Action Items:** Clear guidance for supporters who cannot or do not wish to donate money.
- [x] **Contact Channel:** Dedicated written contact channel indicated without exposing personal home addresses.
- [x] **Pre-Registration Status:** Clear disclosure that the initiative is currently unincorporated and does not claim Gift Aid.

---

## Accessibility (WCAG 2.1 AA) Checklist
- [x] **Contrast Ratio:** Text meets minimum 4.5:1 contrast against backgrounds (tested in dark and light modes).
- [x] **Keyboard Navigation:** All interactive elements (tabs, modals, buttons, sliders) are reachable and operable via keyboard alone (`Tab`, `Enter`, `Escape`, `Space`).
- [x] **Visible Focus Indicators:** High-contrast focus rings (`focus:ring-2 focus:ring-emerald-500`) on all interactive controls.
- [x] **Screen Reader Semantic Headings:** Proper H1 -> H2 -> H3 hierarchical structure without skipping levels.
- [x] **Alt Text & ARIA Labels:** Meaningful labels provided on all SVG icons, canvas viewports, and modal dialogs (`role="dialog"`, `aria-label`).
- [x] **Motion & Reduced Animation:** 3D viewport honors hardware performance constraints; animations use smooth easing with no flashing or rapid strobing.
- [x] **Mobile Responsiveness:** Viewports tested from 375px mobile portrait up to 4K desktop without clipped navigation or horizontal scrolling.
