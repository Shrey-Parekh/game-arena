# Imposter Game Database Setup

This guide will help you set up the database for the Imposter multiplayer game.

## Prerequisites

- Supabase project set up
- Access to Supabase SQL Editor

## Setup Steps

### 1. Create the Imposter Prompts Table

Run the following SQL file in your Supabase SQL Editor:

```
backend/database/imposter-prompts-schema.sql
```

This will:
- Create the `imposter_prompts` table
- Add indexes for optimized queries
- Set up Row Level Security (RLS)
- Grant appropriate permissions

### 2. Seed the Prompts Data

**Option A: Indian-Themed Prompts (Recommended)**

Run the following SQL file in your Supabase SQL Editor:

```
backend/database/imposter-prompts-indian-themed.sql
```

This will insert 50 culturally relevant Indian-themed prompt pairs:
- Bollywood & Entertainment (10 prompts)
- Food & Street Culture (10 prompts)
- Weddings & Celebrations (10 prompts)
- Sports & Cricket (5 prompts)
- Daily Life & Survival (10 prompts)
- School & College Life (5 prompts)

**Option B: General International Prompts**

Run the following SQL file in your Supabase SQL Editor:

```
backend/database/imposter-prompts-seed.sql
```

This will insert 60 general prompt pairs:
- Travel (10 prompts)
- Food (10 prompts)
- Entertainment (10 prompts)
- Personal (10 prompts)
- Hypothetical (10 prompts)
- Work & Career (5 prompts)
- Social (5 prompts)

**Note:** You can run both files to have a larger variety of prompts!

### 3. Verify Installation

After running both files, you can verify the installation by running:

```sql
SELECT category, COUNT(*) as count 
FROM imposter_prompts 
GROUP BY category 
ORDER BY category;
```

**For Indian-Themed Prompts:**
- entertainment: 10
- food: 10
- personal: 10
- social: 10
- sports: 5
- work: 5

**Total: 50 prompt pairs**

**For General Prompts:**
- entertainment: 10
- food: 10
- hypothetical: 10
- personal: 10
- social: 5
- travel: 10
- work: 5

**Total: 60 prompt pairs**

**If you ran both:** 110 total prompt pairs!

## Prompt Structure

Each prompt pair consists of:
- `regular_prompt`: The prompt shown to non-imposter players
- `imposter_prompt`: A similar but different prompt shown to the imposter
- `category`: Thematic grouping
- `difficulty`: How subtle the difference is (easy, medium, hard)

Example:
- **Regular**: "Describe your dream vacation destination"
- **Imposter**: "Describe your ideal weekend getaway"
- **Category**: travel
- **Difficulty**: medium

## Adding More Prompts

To add more prompts, use this SQL template:

```sql
INSERT INTO imposter_prompts (regular_prompt, imposter_prompt, category, difficulty) VALUES
('Your regular prompt here', 'Your imposter prompt here', 'category_name', 'medium');
```

## Troubleshooting

### Error: relation "imposter_prompts" does not exist
- Make sure you ran `imposter-prompts-schema.sql` first

### Error: permission denied
- Check that RLS policies are set up correctly
- Verify your user has the `authenticated` role

### No prompts returned in game
- Verify data was inserted: `SELECT COUNT(*) FROM imposter_prompts;`
- Check that prompts have the correct structure
- Ensure the backend can connect to Supabase

## Game Flow

1. Host starts the Imposter game with 3-6 players
2. Server randomly selects one player as the imposter
3. Server fetches a random prompt pair from the database
4. Regular players receive the `regular_prompt`
5. Imposter receives the `imposter_prompt`
6. Players answer and vote
7. Process repeats for 5 rounds with different prompts

## Support

If you encounter any issues, check:
1. Supabase connection is working
2. Database tables are created correctly
3. RLS policies allow read access
4. Backend logs for any errors
