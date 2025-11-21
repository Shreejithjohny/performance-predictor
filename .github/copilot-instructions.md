# PerformancePredictor AI Copilot Instructions

## Project Overview
**PerformancePredictor** is a student performance prediction system built with React + TypeScript + Vite. It uses a weighted machine learning simulation to predict pass/fail outcomes and risk levels based on 6 student engagement factors.

**Key Pages:**
- `Home.tsx` - Landing page with statistics and feature overview
- `Predict.tsx` - Single student prediction form
- `Upload.tsx` - Batch CSV processing (client-side only)
- `Analytics.tsx` - Dashboard (placeholder in codebase)

## Architecture & Data Flow

### Tech Stack
- **UI:** React 18 + shadcn/ui components (Radix UI primitives)
- **Styling:** Tailwind CSS with HSL color system variables
- **Forms:** React Hook Form + Zod (imported, not actively used yet)
- **Routing:** React Router v6
- **State:** TanStack React Query (configured but unused in current pages)
- **Build:** Vite 5 with SWC
- **Backend:** Supabase client setup (configured, not integrated)

### Component Structure
```
src/
├── pages/           # Route components (Home, Predict, Upload, Analytics)
├── components/
│   ├── PredictionResult.tsx   # Displays prediction results with charts
│   ├── NavLink.tsx             # Navigation helper
│   └── ui/                     # Shadcn component library
├── lib/
│   ├── prediction.ts           # Core ML simulation logic
│   └── utils.ts                # Utility functions
├── integrations/supabase/      # Supabase client (not yet wired)
└── hooks/                      # Custom React hooks (use-toast, use-mobile)
```

## Critical Patterns & Conventions

### 1. Prediction Algorithm (`src/lib/prediction.ts`)
- **Input:** 6 student metrics (0-100 scale for attendance/marks, 0-10 for activities)
- **Output:** Pass/Fail prediction + confidence + risk metrics
- **Weighted scoring:** attendance (35%) > internalMarks (30%) > classParticipation (15%) > engagement (12%) > sports (5%) > cultural (3%)
- **Risk calculation:** Combines normalized inverse score + penalties for low attendance/marks
- **Feature importance:** Sorted by weight, used for visualization

### 2. UI/Component Patterns
- **Headers:** Sticky header with nav on every page (duplicated pattern)
- **Layout:** Container grid with 2-column on large screens, 1-column on mobile
- **Cards:** Using shadcn Card for all content sections
- **Icons:** Lucide React icons for visual hierarchy
- **Colors:** Semantic CSS variables (primary, success, destructive, accent, etc.)
- **State:** Component-level useState for forms; no global state manager

### 3. Tailwind Configuration
- **Design system:** All colors defined as CSS variables in `src/index.css`
- **Key variables:**
  - Primary (blue): `hsl(221, 83%, 53%)`
  - Success (green): `hsl(142, 76%, 36%)`
  - Destructive (red): `hsl(0, 84%, 60%)`
  - Accent (orange): `hsl(25, 95%, 53%)`
- **Dark mode:** Class-based with `.dark` selector
- **Theming:** Sidebar, card, chart colors all use HSL variables

### 4. CSV Processing (`Upload.tsx`)
- **Client-side parsing:** Uses FileReader API, no backend upload
- **Format:** 6 comma-separated values (attendance, internalMarks, cultural, classParticipation, sports, curricular)
- **Download:** Results as CSV with all prediction fields
- **No validation:** Assumes well-formed CSV; should add error handling

### 5. Form Handling
- React Hook Form patterns started (import exists) but forms use native `useState` for simplicity
- Input validation is basic (min/max constraints on inputs)
- No error boundaries or form submission error handling

## Development Workflow

### Development Workflow
- Dev server: `http://localhost:8080`
- Auto-reloading enabled
- TypeScript strict mode relaxed for rapid development

### Path Alias
- `@/*` resolves to `src/*` (configured in tsconfig.json)

## Integration Points (Not Yet Active)

### Supabase
- Client initialized in `src/integrations/supabase/client.ts`
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
- Auto-auth persistence enabled
- No tables/queries implemented yet

### TanStack React Query
- `QueryClient` created in `App.tsx` and provided to tree
- Useful for: batch prediction caching, analytics data fetching, CSV result persistence
- Currently unused; consider using when backend API is added

## Common Tasks & Examples

### Adding a New Page
1. Create file in `src/pages/PageName.tsx`
2. Add Route in `App.tsx` Routes
3. Update navigation in page headers
4. Use same header pattern (sticky, with nav links)

### Extending Prediction Logic
- Modify weights in `src/lib/prediction.ts` > `weights` object
- Add new feature fields to `StudentData` interface
- Update `Predict.tsx` form inputs and `Upload.tsx` CSV parsing

### Styling New Components
- Reference HSL variables: `className="text-success"` or `style={{ color: 'hsl(var(--success))' }}`
- Use Tailwind utilities; avoid inline CSS
- Mobile-first: use `md:` breakpoint prefix for responsive layouts

### Adding Supabase Features
1. Authenticate: `await supabase.auth.signUp({ email, password })`
2. Fetch data: `supabase.from('table_name').select()`
3. Wrap in React Query: `useQuery({ queryKey: [...], queryFn: () => supabase.from(...).select() })`

## TypeScript Configuration

- **Strict mode:** `noImplicitAny: false`, `strictNullChecks: false` (relaxed)
- **Unused vars:** Disabled in eslint rules
- **Path resolution:** `baseUrl: "."` with `@` alias
- **React JSX:** Automatic (via Vite + React plugin)

## Known Limitations & TODOs

1. **No backend:** Prediction is client-side simulation; scale to real ML endpoint if needed
2. **CSV validation:** No input sanitization or format checking
3. **Duplicate headers:** Each page redefines header nav—extract to `Header` component
4. **No error handling:** Forms, file uploads, and predictions lack try-catch + user feedback
5. **Analytics page:** Not implemented (placeholder route exists)
6. **Offline mode:** No service worker; all state lost on refresh
