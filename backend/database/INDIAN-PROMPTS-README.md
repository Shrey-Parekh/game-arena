# Indian-Themed Imposter Prompts

This file contains 50 culturally relevant Indian-themed prompt pairs designed specifically for Indian players. These prompts reference Bollywood, cricket, Indian weddings, street food, festivals, and daily life experiences that Indian players will relate to.

## Categories

### 🎬 Bollywood & Entertainment (10 prompts)
Prompts about Bollywood movies, songs, actors, and Indian entertainment culture.

**Examples:**
- Regular: "Describe your dream Bollywood movie plot."
- Imposter: "Describe your dream Hollywood movie plot."

### 🍛 Food & Street Culture (10 prompts)
Prompts about Indian street food, chai culture, and food experiences.

**Examples:**
- Regular: "What's your go-to street food when you're craving a snack?"
- Imposter: "What's your go-to home-cooked snack when hungry?"

### 💒 Weddings & Celebrations (10 prompts)
Prompts about Indian weddings, festivals like Diwali, and family celebrations.

**Examples:**
- Regular: "Explain your idea of the perfect Indian wedding."
- Imposter: "Explain your idea of the perfect wedding in another culture."

### 🏏 Sports & Cricket (5 prompts)
Prompts about cricket and Indian sports culture.

**Examples:**
- Regular: "If you were a cricket player, what would be your signature move?"
- Imposter: "If you were a football player, what would be your signature move?"

### 🚗 Daily Life & Survival (10 prompts)
Prompts about monsoons, power cuts, traffic, and everyday Indian life.

**Examples:**
- Regular: "How would you survive a sudden power cut at night?"
- Imposter: "How would you survive being lost in a big crowd?"

### 📚 School & College Life (5 prompts)
Prompts about Indian education system, exams, and student life.

**Examples:**
- Regular: "What's the weirdest thing you've done to avoid homework or college?"
- Imposter: "What's the cleverest excuse you used to skip an event?"

## Why These Prompts Work

1. **Cultural Relevance**: References to chai, Bollywood, cricket, and Indian weddings that players instantly recognize
2. **Subtle Differences**: The imposter prompts are similar enough to be confusing but different enough to be detectable
3. **Relatable Scenarios**: Based on real experiences Indian players have had
4. **Language Mix**: Includes Hindi words (चाय, हिंदी, दीवाली) for authenticity
5. **Humor**: Many prompts are designed to elicit funny responses

## Difficulty Levels

- **Easy**: Obvious differences (Bollywood vs Hollywood, cricket vs football)
- **Medium**: Subtle differences (Indian wedding vs another culture's wedding)
- **Hard**: Very subtle differences (chai break vs coffee break, monsoon vs summer)

## Installation

Run this SQL file in your Supabase SQL Editor:

```sql
backend/database/imposter-prompts-indian-themed.sql
```

## Mixing with General Prompts

You can use both Indian-themed and general international prompts together for more variety. The game will randomly select from all available prompts.

## Adding More Prompts

To add your own Indian-themed prompts, use this template:

```sql
INSERT INTO imposter_prompts (regular_prompt, imposter_prompt, category, difficulty) VALUES
('Your regular prompt about Indian culture', 'Similar imposter prompt with subtle difference', 'category_name', 'medium');
```

## Tips for Creating Good Prompts

1. Make the regular prompt specific to Indian culture
2. Make the imposter prompt similar but reference international/global culture
3. Keep both prompts asking for similar types of responses
4. Test with friends to ensure the difference is detectable but not too obvious
5. Use humor and relatable scenarios

## Examples of Good vs Bad Prompts

✅ **Good:**
- Regular: "Describe your ultimate चाय break setup."
- Imposter: "Describe your ultimate coffee break setup."
- *Why it works: Similar concept, subtle cultural difference*

❌ **Bad:**
- Regular: "What's your favorite Indian food?"
- Imposter: "What's your favorite sport?"
- *Why it fails: Completely different topics, too obvious*

## Feedback

These prompts are designed to be fun and engaging for Indian players. If you have suggestions for new prompts or improvements, feel free to add them!

Enjoy the game! 🎭
