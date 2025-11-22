# 📚 Project Architecture Guide

## Clear Frontend vs Backend Separation

```
PerformancePredictor
│
├─ 🎨 FRONTEND (What users see and interact with)
│  └─ src/frontend/
│     ├─ pages/           (Page components)
│     │  ├─ Home.tsx      (Landing page)
│     │  ├─ Predict.tsx   (Prediction form)
│     │  ├─ Upload.tsx    (CSV upload)
│     │  ├─ Analytics.tsx (Dashboard)
│     │  └─ NotFound.tsx  (404 page)
│     │
│     ├─ components/      (Reusable UI components)
│     │  ├─ Header.tsx
│     │  ├─ ErrorBoundary.tsx
│     │  ├─ PredictionResult.tsx
│     │  └─ ui/           (30+ shadcn/ui components)
│     │
│     └─ hooks/           (Custom React hooks)
│        ├─ useToast.ts
│        └─ useMobile.tsx
│
├─ ⚙️ BACKEND (Business logic - can run on server or client)
│  └─ src/backend/
│     ├─ prediction.ts    (ML algorithm)
│     ├─ validation.ts    (Data validation)
│     ├─ constants.ts     (Configuration)
│     └─ README.md        (Backend docs)
│
├─ 🔌 INTEGRATIONS (External services)
│  └─ src/integrations/supabase/
│     ├─ client.ts        (Supabase connection)
│     └─ types.ts         (Database types)
│
└─ 📁 CONFIG (Build and tool configuration)
   ├─ package.json        (Dependencies)
   ├─ vite.config.ts      (Build config)
   ├─ tsconfig.json       (TypeScript config)
   ├─ tailwind.config.ts  (Tailwind config)
   └─ ...
```

---

## Data Flow Architecture

### Single Prediction Flow

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  User Input (Predict.tsx form)                           │
│         ↓                                                 │
│  React Hook Form validation                              │
│         ↓                                                 │
│  Zod schema validation (backend/validation.ts)           │
│         ↓                                                 │
│  Call predictStudent() (backend/prediction.ts)           │
│         ↓                                                 │
│  Get PredictionResult                                    │
│         ↓                                                 │
│  Display in PredictionResult component                   │
│         ↓                                                 │
│  User sees: Pass/Fail, Confidence, Risk, Recommendations │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Batch Upload Flow

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  User uploads CSV (Upload.tsx)                           │
│         ↓                                                 │
│  File validation (size < 5MB)                            │
│         ↓                                                 │
│  Loop through CSV rows                                   │
│         ↓                                                 │
│  parseCSVRow() for each row (backend/validation.ts)      │
│         ↓                                                 │
│  predictStudent() for each row (backend/prediction.ts)   │
│         ↓                                                 │
│  Collect all results                                     │
│         ↓                                                 │
│  Display results table                                   │
│         ↓                                                 │
│  User can download as CSV                                │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## File Organization Explanation

### Why This Structure?

1. **Clear Separation** - Easy to see what's frontend vs backend
2. **Easy Migration** - Copy `src/backend/` to Node.js backend later
3. **Maintainability** - Each layer has clear responsibility
4. **Scalability** - Can grow independently
5. **Testability** - Backend logic easy to unit test

### Frontend Files Location

```
src/pages/        ← User-facing page components
src/components/   ← Reusable UI components
src/hooks/        ← React custom hooks
src/integrations/ ← External API connections
```

**These files import from BACKEND:**
```typescript
import { predictStudent, StudentData } from '@/backend/prediction';
import { validateStudentData } from '@/backend/validation';
import { ROUTES } from '@/backend/constants';
```

### Backend Files Location

```
src/backend/prediction.ts  ← ML algorithm (can move to server)
src/backend/validation.ts  ← Data validation (can move to server)
src/backend/constants.ts   ← Configuration (can move to server)
```

**Pure functions with no React dependency:**
```typescript
// These work in Node.js, Express, or React
export const predictStudent = (data) => { /* ... */ }
export const validateStudentData = (data) => { /* ... */ }
```

---

## Current Architecture

```
Currently: FRONTEND COMPUTING

Frontend Browser
├─ React UI
├─ Form Input
├─ Backend Logic (in JavaScript)
└─ Display Results
```

## Future Architecture (When Ready)

```
Future: CLIENT-SERVER

Frontend Browser          Backend Server
├─ React UI         →    ├─ Express.js
├─ Form Input  ------→   ├─ Node.js
│                        ├─ Python ML Model
└─ Display Results ←---- ├─ Database (PostgreSQL)
                         └─ Redis Cache
```

To move to this architecture:
1. Copy `src/backend/` to `backend/` folder
2. Create Express routes
3. Update frontend to call API endpoints
4. Add database migrations

---

## Technology Stack by Layer

### Frontend
- **React 18.3** - UI library
- **TypeScript** - Type safety
- **React Router v6** - Routing
- **React Hook Form** - Forms
- **Tailwind CSS** - Styling
- **shadcn/ui** - Components
- **Recharts** - Charts
- **Zod** - Validation

### Backend (Currently in Frontend)
- **TypeScript** - Logic implementation
- **Zod** - Validation schemas
- **Pure functions** - No dependencies

### Future Backend
- **Node.js** - Runtime
- **Express** - Framework
- **PostgreSQL** - Database
- **Python** - Machine learning (optional)
- **Redis** - Caching

---

## Import Paths Guide

### From Frontend to Backend
```typescript
// Good ✅
import { predictStudent } from '@/backend/prediction';
import { validateStudentData } from '@/backend/validation';
import { ROUTES, PREDICTION_WEIGHTS } from '@/backend/constants';

// Bad ❌
import something from '@/lib/prediction';  // Old path
```

### From Frontend to Components
```typescript
// Good ✅
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';

// From pages
import Home from '@/pages/Home';
```

### From Frontend to Hooks
```typescript
// Good ✅
import { useToast } from '@/hooks/use-toast';
```

---

## How to Work with This Structure

### To Fix a Bug

1. **If bug is in calculations:** Edit `src/backend/prediction.ts`
2. **If bug is in validation:** Edit `src/backend/validation.ts`
3. **If bug is in UI:** Edit `src/frontend/pages/` or `src/frontend/components/`
4. **If bug is in config:** Edit `src/backend/constants.ts`

### To Add a Feature

1. **New prediction algorithm:** Update `src/backend/prediction.ts`
2. **New validation rule:** Update `src/backend/validation.ts`
3. **New UI page:** Create `src/pages/NewPage.tsx`
4. **New component:** Create `src/components/NewComponent.tsx`

### To Scale to Backend

1. Copy entire `src/backend/` folder
2. Create Node.js/Express server
3. Create API routes that use backend functions
4. Update frontend to call API endpoints instead

---

## Summary

```
Your project is now organized with:

🎨 FRONTEND
   Everything users see and interact with
   (Pages, forms, buttons, charts)

⚙️ BACKEND
   Business logic and algorithms
   (Prediction, validation, configuration)

The separation makes it:
✅ Easy to understand
✅ Easy to maintain
✅ Easy to scale
✅ Easy to test
✅ Easy to move backend to server later
```

---

**Questions? Check individual README.md files in:**
- `src/frontend/README.md` - Frontend guide
- `src/backend/README.md` - Backend guide

---

**Generated:** November 22, 2025  
**Project:** PerformancePredictor  
**Status:** Production Ready ✅
