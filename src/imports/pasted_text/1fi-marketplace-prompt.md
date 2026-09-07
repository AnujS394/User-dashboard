Prompt: Build the 1Fi Marketplace Feature (1Fi SDE Intern Assignment)

Copy everything below into Claude Code / Cursor / your AI coding tool of choice.

Role & Mindset

You are a Senior Engineer working inside the existing 1Fi production codebase — not a greenfield builder. Your task is to extend the existing Shop section by adding a new "1Fi Marketplace" feature. You are NOT redesigning the app, NOT starting a new project, and NOT introducing a different tech stack, styling system, or navigation pattern than what already exists.

Before writing any code, analyze the existing project:

Identify the current navigation structure (bottom tabs, stack/route setup) and where Shop lives in it.
Identify the existing Shop page implementation and its tab-switching pattern (Top Brands / Nearby Stores).
Identify existing reusable components (cards, skeletons, empty states, error states, buttons, bottom sheets) so you reuse them instead of rebuilding.
Identify the existing data-fetching pattern (API client, hooks, state management library already in use) and match it exactly.
Identify the existing design tokens (colors, spacing, typography, border radius, shadows) and use them as-is.

Only after this analysis, propose where Marketplace files should live and confirm the plan before generating code. The final result should look like it was built by the original 1Fi engineering team, not bolted on by an external contributor.

Stack note: If this repo is React Native (Expo or bare), use its existing navigation library (e.g. React Navigation), existing styling approach (StyleSheet / styled-components / NativeWind — whichever the repo already uses), and existing state pattern (Context / Redux / Zustand — whichever exists). If this repo is actually a Next.js/React web app, use App Router conventions, Tailwind, and API routes instead. Detect and match the real stack in the repo rather than assuming — do not introduce a second styling system or state library alongside an existing one.

Product Context

1Fi is a fintech affordability platform that lets users buy products (starting with smartphones) on 0% interest EMI backed by their mutual fund holdings instead of a credit score. Tagline on the real Shop page: "Shop today, Pay later using Mutual funds." Reference 1fi.in for overall tone — think Fi Money / Jupiter / CRED-adjacent polish, but staying inside 1Fi's own visual language.

Primary brand/accent color: 
#712CDC (purple) — use for CTAs, active tabs, selected states, matching however this token is already named/used in the codebase's theme file (don't hardcode a new hex if a theme variable already exists for it).

Persistent bottom navigation (already exists, do not rebuild): Home | Shop | EMI Dues | Limit | Profile — Shop is the active tab throughout this feature.

1. Shop Page (existing — extend, don't rebuild)

The existing Shop page has:

Hero banner: "Shop today, Pay later using Mutual funds"
Segmented tabs below the banner: Top Brands, Nearby Stores

Add a third tab: "1Fi Marketplace", matching the existing tab component's styling and interaction pattern exactly (active/inactive states, indicator animation, spacing).

Top Brands and Nearby Stores: leave as empty placeholder states, using the app's existing empty-state component/pattern (e.g. "No matching stores found" style).
1Fi Marketplace: fully implement per the spec below.
2. Marketplace Listing Screen

Route: Shop → "1Fi Marketplace" tab (or a dedicated marketplace route if the existing routing convention calls for a separate screen rather than an inline tab panel).

Each product renders as a reusable ProductCard, showing:

Product image
Product name
Product category
Starting price (e.g. "From ₹XX,XXX")
"EMI from ₹X/mo" badge (the affordability hook)
Product rating, if available in the data

Requirements:

Responsive grid/list layout (mobile-first; must not break on tablet/larger viewports)
Loading skeleton state while fetching (reuse the app's existing skeleton pattern if one exists)
Empty state (reuse existing empty-state component)
Error state with a retry action (reuse existing error/retry pattern)
Tapping a card navigates to the Product Detail screen
3. Product Detail Screen

Route: /shop/marketplace/[productId] (or the equivalent screen name in the existing navigator).

Displays:

Image gallery/carousel
Product name, description, base price
Product specifications
Variant selector (e.g. storage/color combinations) — selecting a variant updates the displayed price dynamically
EMI plan list, fetched per product/variant, each plan showing:
Tenure (e.g. 3 / 6 / 9 / 12 / 18 / 24 months)
Monthly amount
Total payable
Interest rate / processing fee (0% is the headline feature, but keep the model generic so non-zero rates are supportable)
Single-select EMI plan (radio-style), highlighted in the brand purple when selected
Sticky bottom CTA: "Continue" — disabled until both a variant and an EMI plan are selected
4. Confirmation / Summary Step

Can be a modal, bottom sheet, or separate route — follow whichever pattern the existing app already uses for confirmation flows.

Recap shown:

Product + variant
Selected EMI plan, monthly amount, total payable

Final CTA: "Confirm" — no real payment integration needed; a success state is sufficient.

5. Data Model

Implement as typed models (TypeScript interfaces), served through an API/service layer — never hardcoded directly into UI components.

ts
interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  rating?: number;
  images: string[];
  basePrice: number;
  description: string;
  specifications?: Record<string, string>;
  variants: Variant[];
}

interface Variant {
  id: string;
  label: string;       // e.g. "256GB / Titanium Black"
  priceDelta: number;  // added to basePrice
  inStock: boolean;
}

interface EmiPlan {
  id: string;
  productId: string;
  tenureMonths: number;
  interestRate: number;   // 0 for no-cost EMI
  processingFee: number;
  monthlyAmount: number;
  totalPayable: number;
}
API / service layer
GET /products → list all products (paginated if you want to show off)
GET /products/:id → single product with variants and specs
GET /products/:id/emi-plans (optionally with a variantId query param) → EMI plans, with monthlyAmount / totalPayable computed server-side from basePrice + priceDelta

Back these with:

A repository/service layer that the UI calls through (typed fetch wrappers — getProducts, getProduct, getEmiPlans), so swapping the mock layer for a real backend later requires no UI changes.
A mock implementation (JSON or in-memory) if no backend is available — 5–8 realistic smartphone/laptop products, 2–3 variants each, and the 3–6 EMI tenure options above.
Loading, error, and retry handling implemented once in the service layer / a shared data-fetching hook, reused across screens — not duplicated per screen.
All EMI math (monthly amount, total payable) centralized in a single emi.ts utility — no inline magic numbers in components.
6. Suggested File/Folder Structure

Adapt paths/naming to match whatever convention the existing repo already uses (e.g. screens/ vs app/, features/ vs flat folders). This is illustrative, not prescriptive:

/marketplace (or /features/marketplace)
  screens/
    MarketplaceListScreen
    ProductDetailScreen
  components/
    ProductCard
    ProductGrid / ProductList
    ProductSkeleton
    VariantSelector
    EmiPlanCard
    EmiPlanList
    ProceedBar / ContinueCTA        → sticky bottom CTA
    ConfirmationSheet
  state/
    MarketplaceSelectionContext      → tracks selected product/variant/EMI plan across the flow
  services/
    marketplaceApi                  → typed fetch/service wrappers
    mockData                        → mock products/variants/EMI plans
  lib/
    emi.ts                          → centralized EMI calculation
  types.ts

Reuse the existing ShopTabs/tab-switcher component and the existing EmptyState component rather than creating new ones for this feature.

7. Non-Functional Requirements
Fully responsive; mobile-first, must hold up on larger screens too.
Loading, empty, and error states on every data-fetching screen.
Reusable, typed components — no prop-drilling hacks.
Clean, incremental commit history.
A short README covering setup, assumptions made, and what you'd do with more time.
Visual and interaction consistency with the rest of 1Fi: same color tokens, spacing scale, typography, card shadows/radii, and animation feel already used elsewhere in the app — nothing should look like a visually distinct "bolt-on" feature.
How to proceed
First, inspect and summarize the existing project structure, navigation setup, design tokens, and data-fetching conventions.
Propose the exact file locations for the Marketplace feature within that existing structure, and confirm before generating code.
Scaffold mock data + the service/API layer.
Build the Marketplace listing screen (with the new Shop tab wired in).
Build the Product Detail screen with variant + EMI selection.
Wire up state management (selection context) and the confirmation step.

Show each part as you go so it can be reviewed before moving to the next step