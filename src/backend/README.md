# 🔧 Backend Logic

This folder contains all backend business logic and algorithms.

## Files

### 📊 `prediction.ts`
**Purpose:** Student performance prediction algorithm  
**Contains:**
- `predictStudent()` - Main prediction function
- `StudentData` interface - Input data structure
- `PredictionResult` interface - Output structure

**Algorithm:**
- 6-factor weighted scoring (Attendance, Internal Marks, Class Participation, Engagement, Sports, Cultural)
- Risk assessment (Low, Medium, High)
- Confidence scoring (0-100%)
- Feature importance ranking
- Personalized recommendations

**How to use:**
```typescript
import { predictStudent } from '@/backend/prediction';

const result = predictStudent({
  attendance: 85,
  internalMarks: 78,
  culturalActivity: 7,
  classParticipation: 8,
  sportsActivity: 6,
  curricularActivity: 9,
});

// Returns:
// {
//   prediction: 'Pass',
//   confidence: 92,
//   riskLevel: 'Low',
//   engagementIndex: 7.5,
//   riskScore: 12,
//   featureImportance: [...],
//   recommendations: [...]
// }
```

### ✅ `validation.ts`
**Purpose:** Data validation and CSV parsing  
**Contains:**
- `studentDataSchema` - Zod validation schema
- `validateStudentData()` - Validate student data
- `parseCSVRow()` - Parse and validate CSV rows

**Schemas:**
- Attendance: 0-100
- Internal Marks: 0-100
- Cultural/Sports/Class Participation/Curricular Activity: 0-10

**How to use:**
```typescript
import { validateStudentData, parseCSVRow } from '@/backend/validation';

// Validate single record
const result = validateStudentData({ attendance: 85, ... });
if (result.success) {
  console.log(result.data); // Type-safe
} else {
  console.log(result.error); // Error message
}

// Parse CSV row
const csvResult = parseCSVRow('85,78,7,8,6,9');
if (csvResult.success) {
  const prediction = predictStudent(csvResult.data);
}
```

### ⚙️ `constants.ts`
**Purpose:** Configuration and constants  
**Contains:**
- `PREDICTION_WEIGHTS` - Algorithm weights
- `RISK_THRESHOLDS` - Risk assessment thresholds
- `INPUT_RANGES` - Valid input ranges
- `CSV_CONFIG` - CSV processing settings
- `ERROR_MESSAGES` - Error message strings

**Key values:**
```typescript
PREDICTION_WEIGHTS = {
  attendance: 0.35,        // Most important
  internalMarks: 0.30,
  classParticipation: 0.15,
  engagement: 0.12,
  sports: 0.05,
  cultural: 0.03,
};
```

## Data Flow

```
Input Data
    ↓
validateStudentData() → validateoStudentData()
    ↓
predictStudent()
    ↓
PredictionResult
    ↓
Display in Frontend
```

## Future Backend Migration

When moving to Node.js/Express backend:

1. **Copy these files** to your backend project
2. **Create API endpoints:**
   - `POST /api/predict` - Single prediction
   - `POST /api/upload` - Batch predictions
   - `GET /api/analytics` - Analytics data

3. **Example endpoint:**
```typescript
// backend/routes/predict.ts
app.post('/api/predict', (req, res) => {
  const { data } = req.body;
  const validation = validateStudentData(data);
  
  if (!validation.success) {
    return res.status(400).json({ error: validation.error });
  }
  
  const result = predictStudent(validation.data);
  res.json(result);
});
```

4. **Update frontend** to call API:
```typescript
const response = await fetch('/api/predict', {
  method: 'POST',
  body: JSON.stringify(studentData),
});
const result = await response.json();
```

## Testing

These functions are easy to unit test:

```typescript
import { predictStudent } from '@/backend/prediction';

describe('predictStudent', () => {
  it('should pass high-performing students', () => {
    const result = predictStudent({
      attendance: 95,
      internalMarks: 90,
      culturalActivity: 9,
      classParticipation: 9,
      sportsActivity: 8,
      curricularActivity: 9,
    });
    
    expect(result.prediction).toBe('Pass');
    expect(result.riskLevel).toBe('Low');
    expect(result.confidence).toBeGreaterThan(90);
  });
});
```

## Performance

- Single prediction: < 5ms
- CSV parsing (1000 rows): < 500ms
- No external API calls
- No database queries

---

**These files are engine of PerformancePredictor!** 🚀
