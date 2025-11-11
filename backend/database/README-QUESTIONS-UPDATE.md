# Truth or Dare Questions Database Update

## Overview
This update replaces ALL existing Truth or Dare questions with a comprehensive new set organized by mode and spice level.

## Total Questions
- **Friends Mode**: 240 questions (60 per spice level × 4 types)
- **Couples Mode**: 240 questions (60 per spice level × 4 types)
- **Total**: 480 questions

## Files to Run (IN ORDER)

### 1. replace-all-questions.sql
Contains:
- DELETE all existing questions
- Friends Mild Dares (65)
- Friends Mild Truths (60)
- Friends Spicy Dares (60)
- Friends Spicy Truths (60)

### 2. replace-questions-part2.sql
Contains:
- Friends Extreme Dares (60)
- Friends Extreme Truths (56)

### 3. replace-questions-part3-couples.sql
Contains:
- Couples Mild Dares (63)

### 4. replace-questions-part4-couples-truths.sql
Contains:
- Couples Mild Truths (60)

### 5. REMAINING (Create manually or use provided data.txt)
You still need to add:
- Couples Spicy Dares (60)
- Couples Spicy Truths (60)
- Couples Extreme Dares (60)
- Couples Extreme Truths (60)

## How to Run

1. Open Supabase SQL Editor
2. Run each file in order (1-4)
3. For remaining questions, use the data.txt file format:
   ```sql
   INSERT INTO truth_or_dare_questions (type, spice_level, content, mode) VALUES
   ('dare', 'spicy', 'Question text here', 'couples'),
   ('truth', 'spicy', 'Question text here', 'couples'),
   -- etc...
   ```

## Verification

After running all scripts, verify with:
```sql
SELECT mode, type, spice_level, COUNT(*) as count
FROM truth_or_dare_questions
GROUP BY mode, type, spice_level
ORDER BY mode, spice_level, type;
```

Expected results:
- friends, dare, mild: ~65
- friends, truth, mild: ~60
- friends, dare, spicy: ~60
- friends, truth, spicy: ~60
- friends, dare, extreme: ~60
- friends, truth, extreme: ~56
- couples, dare, mild: ~63
- couples, truth, mild: ~60
- couples, dare, spicy: ~60
- couples, truth, spicy: ~60
- couples, dare, extreme: ~60
- couples, truth, extreme: ~60

## Notes
- All old questions are deleted first
- Questions use proper SQL escaping for apostrophes
- Mode column is set correctly (friends/couples)
- Spice levels: mild, spicy, extreme
