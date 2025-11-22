# 🎨 Frontend Code

This folder contains all user-facing React components, pages, and UI logic.

## Structure

```
frontend/
├─ README.md (this file)
├─ pages/       (main page components)
├─ components/  (reusable UI components)
└─ hooks/       (custom React hooks)
```

## Pages

### 📄 `pages/Home.tsx`
The landing page displaying:
- Hero section with call-to-action buttons
- Statistics dashboard (4 metrics)
- Feature overview cards

**Route:** `/`

### 📄 `pages/Predict.tsx`
Single student prediction form:
- 6 input fields (Attendance, Marks, Activities)
- Real-time form validation
- Submit button with loading state
- Results display

**Route:** `/predict`

### 📄 `pages/Upload.tsx`
Batch CSV upload:
- File upload interface
- Progress bar (0-100%)
- Results table
- Export to CSV button

**Route:** `/upload`

### 📄 `pages/Analytics.tsx`
Dashboard with visualizations:
- Pie chart (student distribution)
- Bar chart (feature importance)
- Key insights section

**Route:** `/analytics`

### 📄 `pages/NotFound.tsx`
404 error page

**Route:** `*` (all other routes)

## Components

### 🎯 `Header.tsx`
Navigation header with:
- Logo and app name
- Navigation links (active route highlighting)
- Sticky positioning

Used on: All pages

### 🎨 `Logo.tsx`
App logo component

Used in: Header.tsx

### 🔗 `NavLink.tsx`
Navigation link wrapper

Used in: Header.tsx

### ⚠️ `ErrorBoundary.tsx`
Error recovery component:
- Catches React errors
- Shows fallback UI
- Recovery buttons

Used in: App.tsx (root)

### 📊 `PredictionResult.tsx`
Displays prediction results:
- Pass/Fail status
- Confidence score
- Risk level
- Feature importance
- Recommendations

Used in: Predict.tsx, Upload.tsx

## UI Component Library

The `ui/` folder contains 30+ shadcn/ui components:
- Button, Card, Input, Label
- Alert, Dialog, Toast
- Chart, Progress, Slider
- And many more...

These are reusable, accessible, styled components.

## Data Flow

```
User Input
    ↓
React Form (Hook Form)
    ↓
Frontend Validation (Zod)
    ↓
Call Backend predictStudent()
    ↓
Display Results Component
    ↓
User sees Prediction
```

## Key Technologies

- **React 18.3** - UI library
- **TypeScript** - Type safety
- **React Router** - Page routing
- **React Hook Form** - Form management
- **Zod** - Validation schemas
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Recharts** - Charts and graphs

## Styling

All styling uses **Tailwind CSS**:
- Utility-first CSS framework
- Color variables in CSS
- Responsive design (mobile-first)
- Dark mode ready

## State Management

Uses React built-in:
- `useState` for component state
- `useContext` for context API
- `useForm` from React Hook Form
- `useQuery` from React Query

No external store needed.

## Hooks

Custom hooks in `hooks/`:
- `useToast` - Show toast notifications
- `useMobile` - Detect mobile screen

## How to Add a New Page

1. Create `src/pages/NewPage.tsx`:
```typescript
import { Header } from '@/components/Header';
import { ROUTES } from '@/backend/constants';

const NewPage = () => {
  return (
    <div>
      <Header activePath={ROUTES.NEW} />
      {/* Your content */}
    </div>
  );
};

export default NewPage;
```

2. Update `src/App.tsx`:
```typescript
import NewPage from './pages/NewPage';

// In Routes:
<Route path="/new-page" element={<NewPage />} />
```

## How to Add a New Component

1. Create `src/frontend/components/NewComponent.tsx`:
```typescript
interface Props {
  title: string;
  // other props...
}

export const NewComponent = ({ title }: Props) => {
  return <div>{title}</div>;
};
```

2. Use in your pages:
```typescript
import NewComponent from '@/components/NewComponent';

const Page = () => {
  return <NewComponent title="Hello" />;
};
```

## Best Practices

✅ **Do:**
- Keep components small and focused
- Use TypeScript types
- Pass data via props
- Use React hooks for state
- Import from shadcn/ui
- Use Tailwind for styling

❌ **Don't:**
- Use inline styles
- Pass too many props (use composition)
- Use any types
- Create global state unless necessary
- Duplicate code (extract to components)

## Testing Frontend

Since frontend uses backend functions, you can test:

```typescript
import { render, screen } from '@testing-library/react';
import Predict from '@/pages/Predict';

describe('Predict page', () => {
  it('renders form', () => {
    render(<Predict />);
    expect(screen.getByText(/Attendance/)).toBeInTheDocument();
  });
});
```

---

**Frontend is the beautiful UI that users interact with!** 🚀
