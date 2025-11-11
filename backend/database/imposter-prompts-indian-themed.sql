-- Indian-Themed Imposter Game Prompts
-- Run this after imposter-prompts-schema.sql to add culturally relevant prompts

-- Clear existing prompts (optional - comment out if you want to keep old ones)
-- TRUNCATE TABLE imposter_prompts;

-- BOLLYWOOD & ENTERTAINMENT (10 prompts)
INSERT INTO imposter_prompts (regular_prompt, imposter_prompt, category, difficulty) VALUES
('Describe your dream Bollywood movie plot.', 'Describe your dream Hollywood movie plot.', 'entertainment', 'medium'),
('If you had to pick a Bollywood actor/actress to be your best friend, who?', 'If you had to pick a Hollywood actor/actress to be your best friend, who?', 'entertainment', 'easy'),
('If your life was a हिंदी film song, which one would it be?', 'If your life was an English pop song, which one would it be?', 'entertainment', 'medium'),
('What''s your go-to Bollywood song when you''re feeling dramatic?', 'What''s your go-to song from any genre when emotional?', 'entertainment', 'easy'),
('What''s a Bollywood dialogue that perfectly sums up your life?', 'What''s a famous dialogue from any movie that fits your story?', 'entertainment', 'medium'),
('What''s your favorite Bollywood dance move and can you describe it?', 'What''s your favorite dance move from any other music style?', 'entertainment', 'medium'),
('If your life had theme music from a famous Indian song, what would it be?', 'If your life had a theme song from a foreign movie, what would it be?', 'entertainment', 'medium'),
('Describe your favorite roadside tea stall experience.', 'Describe your favorite coffee shop or café experience.', 'entertainment', 'hard'),
('If your life was a famous Indian meme, which one would it be?', 'If your life was a popular global meme, which one would it be?', 'entertainment', 'easy'),
('Imagine your pet had a Bollywood-style entry scene—describe it.', 'Imagine your pet had a superhero movie entrance—describe it.', 'entertainment', 'medium');

-- FOOD & STREET CULTURE (10 prompts)
INSERT INTO imposter_prompts (regular_prompt, imposter_prompt, category, difficulty) VALUES
('What''s your go-to street food when you''re craving a snack?', 'What''s your go-to home-cooked snack when hungry?', 'food', 'medium'),
('What''s the weirdest thing you''ve eaten during a festival?', 'What''s the weirdest food you''ve eaten at a friend''s gathering?', 'food', 'easy'),
('Describe your ultimate चाय break setup.', 'Describe your ultimate coffee break setup.', 'food', 'hard'),
('What''s your secret midnight snack guilty pleasure?', 'What''s the weirdest snack you''ve tried in the middle of the night?', 'food', 'easy'),
('Describe your favorite चाय or coffee order.', 'Describe your favorite cold drink or smoothie.', 'food', 'medium'),
('If you had to compete in a spicy food challenge, what local dish would you pick?', 'If you had to compete in a sour food challenge, what would you pick?', 'food', 'medium'),
('What''s a traditional dish you secretly don''t like but eat anyway?', 'What''s a popular dessert or dish you don''t enjoy but eat politely?', 'food', 'easy'),
('Describe your all-time favorite Indian street performer or artist.', 'Describe your favorite street artist from anywhere in the world.', 'food', 'hard'),
('Share the weirdest thing you''ve seen happening on a street in your hometown.', 'Share the most unusual event you''ve witnessed on a street anywhere.', 'food', 'medium'),
('What''s the weirdest thing you''ve overheard in a shared auto or rickshaw?', 'What''s the funniest conversation you''ve overheard in a public place?', 'food', 'easy');

-- WEDDINGS & CELEBRATIONS (10 prompts)
INSERT INTO imposter_prompts (regular_prompt, imposter_prompt, category, difficulty) VALUES
('Explain your idea of the perfect Indian wedding.', 'Explain your idea of the perfect wedding in another culture.', 'social', 'medium'),
('What''s your funniest encounter at an Indian wedding?', 'What''s your funniest encounter at a family reunion?', 'social', 'easy'),
('Describe the most embarrassing moment during a traditional ceremony.', 'Describe the most awkward moment at a formal event.', 'social', 'medium'),
('Describe the most awkward moment at a family wedding you''ve experienced.', 'Describe the most awkward moment at any social gathering.', 'social', 'easy'),
('Describe your funniest experience during दीवाली preparations.', 'Describe your most chaotic holiday or celebration preparation.', 'social', 'medium'),
('Share a funny prank ever played at an Indian festival.', 'Share a funny prank you''ve seen or played anywhere.', 'social', 'easy'),
('Share a funny story involving Indian festivals and family chaos.', 'Share a funny family gathering story from any culture.', 'social', 'easy'),
('Describe the weirdest festival custom you''ve witnessed.', 'Describe the strangest tradition you''ve heard about globally.', 'social', 'hard'),
('If you had to invent a new Indian festival, what would it celebrate?', 'If you invented a global festival, what would it celebrate?', 'social', 'medium'),
('What''s your favorite quirky Indian superstition?', 'What''s a family superstition you secretly don''t believe?', 'social', 'hard');

-- SPORTS & CRICKET (5 prompts)
INSERT INTO imposter_prompts (regular_prompt, imposter_prompt, category, difficulty) VALUES
('If you were a cricket player, what would be your signature move?', 'If you were a football player, what would be your signature move?', 'sports', 'easy'),
('Imagine explaining cricket to an alien in 2 sentences.', 'Imagine explaining another sport to an alien in 2 sentences.', 'sports', 'hard'),
('If you woke up as a famous Indian cricketer, what''s the first thing you''d do?', 'If you woke up as a famous celebrity, what''s the first thing you''d do?', 'sports', 'medium'),
('What''s your funniest encounter with a traffic cop or auto driver?', 'What''s your funniest interaction with any stranger?', 'sports', 'easy'),
('Describe a chaotic traffic jam experience you had and how you survived it.', 'Describe your best stuck-in-line experience and what you did.', 'sports', 'medium');

-- DAILY LIFE & SURVIVAL (10 prompts)
INSERT INTO imposter_prompts (regular_prompt, imposter_prompt, category, difficulty) VALUES
('How would you survive a sudden power cut at night?', 'How would you survive being lost in a big crowd?', 'personal', 'medium'),
('Describe your perfect monsoon day plan.', 'Describe your perfect summer beach day plan.', 'personal', 'hard'),
('If you were stuck in a Mumbai local train, how would you entertain yourself?', 'If you were stuck in a long queue somewhere, how would you pass time?', 'personal', 'medium'),
('What''s your go-to excuse to get out of family gatherings?', 'What''s your favorite excuse to dodge work or school?', 'personal', 'easy'),
('Describe your favorite way to avoid boring family discussions.', 'Describe your favorite trick to avoid awkward conversations.', 'personal', 'easy'),
('What''s a quirky habit that you have from your childhood?', 'What''s a weird habit you noticed in your siblings or friends?', 'personal', 'medium'),
('What''s the funniest nickname you''ve had in your family or friend group?', 'What''s the weirdest nickname you''ve heard about someone else?', 'personal', 'easy'),
('What''s the weirdest advice you''ve received from a relative?', 'What''s the funniest advice you''ve given or given to friends?', 'personal', 'medium'),
('What''s a secret talent or skill you have that no one expects?', 'What''s a skill you''re working on learning but haven''t mastered?', 'personal', 'hard'),
('Describe your favorite childhood game in detail.', 'Describe your favorite video game or board game.', 'personal', 'medium');

-- SCHOOL & COLLEGE LIFE (5 prompts)
INSERT INTO imposter_prompts (regular_prompt, imposter_prompt, category, difficulty) VALUES
('What''s the weirdest thing you''ve done to avoid homework or college?', 'What''s the cleverest excuse you used to skip an event?', 'work', 'easy'),
('Describe your worst experience with exam pressure in school or college.', 'Describe a funny or embarrassing moment during a test or interview.', 'work', 'medium'),
('Describe your funniest autocorrect fail in any Indian language.', 'Describe your funniest autocorrect fail in English.', 'work', 'easy'),
('If you were a politician for a day, what''s the funniest law you''d try to pass?', 'If you ruled your school or workplace, what silly rule would you make?', 'work', 'medium'),
('If you had to stereotype your hometown in 3 words, what are they?', 'If you had to describe your current city in 3 words, what are they?', 'work', 'hard');

-- Update the updated_at timestamp trigger (if not already created)
-- Note: This will skip if the trigger already exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_imposter_prompts_updated_at'
    ) THEN
        CREATE TRIGGER update_imposter_prompts_updated_at BEFORE UPDATE
            ON imposter_prompts FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;

-- Verify data
SELECT category, COUNT(*) as count 
FROM imposter_prompts 
GROUP BY category 
ORDER BY category;

-- Total count
SELECT COUNT(*) as total_prompts FROM imposter_prompts;
