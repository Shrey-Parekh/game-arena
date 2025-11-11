-- Imposter Game Prompts Seed Data
-- Run this after imposter-prompts-schema.sql

-- TRAVEL CATEGORY (10 prompts)
INSERT INTO imposter_prompts (regular_prompt, imposter_prompt, category, difficulty) VALUES
('Describe your dream vacation destination', 'Describe your ideal weekend getaway', 'travel', 'medium'),
('What would you do on a perfect beach day?', 'What would you do on a perfect day at the lake?', 'travel', 'easy'),
('Describe the best hotel you''ve ever stayed in', 'Describe the best Airbnb you''ve ever stayed in', 'travel', 'medium'),
('What''s your favorite thing about traveling abroad?', 'What''s your favorite thing about road trips?', 'travel', 'medium'),
('Describe your ideal tropical island vacation', 'Describe your ideal mountain cabin retreat', 'travel', 'hard'),
('What would you pack for a two-week European trip?', 'What would you pack for a two-week camping trip?', 'travel', 'medium'),
('Describe the most beautiful city you''ve visited', 'Describe the most beautiful natural place you''ve visited', 'travel', 'hard'),
('What''s your favorite airline to fly with?', 'What''s your favorite train to ride?', 'travel', 'easy'),
('Describe your perfect cruise ship experience', 'Describe your perfect yacht experience', 'travel', 'medium'),
('What would you do during a layover in Paris?', 'What would you do during a layover in Tokyo?', 'travel', 'easy');

-- FOOD CATEGORY (10 prompts)
INSERT INTO imposter_prompts (regular_prompt, imposter_prompt, category, difficulty) VALUES
('Describe your favorite pizza toppings', 'Describe your favorite pasta dish', 'food', 'medium'),
('What''s your go-to breakfast order?', 'What''s your go-to brunch order?', 'food', 'easy'),
('Describe the best burger you''ve ever had', 'Describe the best sandwich you''ve ever had', 'food', 'medium'),
('What would you order at a fancy Italian restaurant?', 'What would you order at a fancy French restaurant?', 'food', 'medium'),
('Describe your perfect ice cream sundae', 'Describe your perfect milkshake', 'food', 'easy'),
('What''s your favorite type of sushi?', 'What''s your favorite type of seafood?', 'food', 'hard'),
('Describe your ideal Thanksgiving dinner', 'Describe your ideal Christmas dinner', 'food', 'medium'),
('What toppings do you put on your hot dog?', 'What toppings do you put on your nachos?', 'food', 'easy'),
('Describe the best dessert you''ve ever tasted', 'Describe the best appetizer you''ve ever tasted', 'food', 'medium'),
('What would you cook for a romantic dinner?', 'What would you cook for a dinner party?', 'food', 'medium');

-- ENTERTAINMENT CATEGORY (10 prompts)
INSERT INTO imposter_prompts (regular_prompt, imposter_prompt, category, difficulty) VALUES
('Describe your favorite movie of all time', 'Describe your favorite TV show of all time', 'entertainment', 'medium'),
('What''s your ideal Friday night activity?', 'What''s your ideal Saturday night activity?', 'entertainment', 'easy'),
('Describe the best concert you''ve ever been to', 'Describe the best live theater show you''ve ever seen', 'entertainment', 'hard'),
('What''s your favorite genre of music?', 'What''s your favorite genre of movies?', 'entertainment', 'medium'),
('Describe your perfect video game', 'Describe your perfect board game', 'entertainment', 'medium'),
('What would you binge-watch on Netflix?', 'What would you binge-watch on YouTube?', 'entertainment', 'easy'),
('Describe your favorite superhero movie', 'Describe your favorite action movie', 'entertainment', 'medium'),
('What''s your go-to karaoke song?', 'What''s your go-to dance song?', 'entertainment', 'easy'),
('Describe the best book you''ve read this year', 'Describe the best podcast you''ve listened to this year', 'entertainment', 'hard'),
('What would you do at an amusement park?', 'What would you do at a water park?', 'entertainment', 'easy');

-- PERSONAL CATEGORY (10 prompts)
INSERT INTO imposter_prompts (regular_prompt, imposter_prompt, category, difficulty) VALUES
('Describe your morning routine', 'Describe your evening routine', 'personal', 'medium'),
('What''s your favorite way to relax after work?', 'What''s your favorite way to relax on weekends?', 'personal', 'easy'),
('Describe your ideal birthday celebration', 'Describe your ideal New Year''s Eve celebration', 'personal', 'medium'),
('What would you do with a free day at home?', 'What would you do with a free day in the city?', 'personal', 'medium'),
('Describe your perfect workout routine', 'Describe your perfect meditation routine', 'personal', 'hard'),
('What''s your favorite childhood memory?', 'What''s your favorite high school memory?', 'personal', 'medium'),
('Describe your dream home', 'Describe your dream apartment', 'personal', 'easy'),
('What would you do if you won the lottery?', 'What would you do if you inherited a million dollars?', 'personal', 'easy'),
('Describe your ideal pet', 'Describe your ideal plant collection', 'personal', 'hard'),
('What''s your favorite season and why?', 'What''s your favorite holiday and why?', 'personal', 'medium');

-- HYPOTHETICAL CATEGORY (10 prompts)
INSERT INTO imposter_prompts (regular_prompt, imposter_prompt, category, difficulty) VALUES
('What superpower would you choose?', 'What magical ability would you choose?', 'hypothetical', 'medium'),
('Describe what you''d do on a deserted island', 'Describe what you''d do in a zombie apocalypse', 'hypothetical', 'medium'),
('What would you do if you could time travel to the past?', 'What would you do if you could time travel to the future?', 'hypothetical', 'easy'),
('Describe your perfect robot assistant', 'Describe your perfect AI companion', 'hypothetical', 'hard'),
('What would you do if you were invisible for a day?', 'What would you do if you could fly for a day?', 'hypothetical', 'easy'),
('Describe your ideal spaceship', 'Describe your ideal submarine', 'hypothetical', 'medium'),
('What would you do if you could talk to animals?', 'What would you do if you could read minds?', 'hypothetical', 'medium'),
('Describe your perfect clone', 'Describe your perfect twin', 'hypothetical', 'hard'),
('What would you do if you lived in a video game?', 'What would you do if you lived in a movie?', 'hypothetical', 'easy'),
('Describe what you''d do as president for a day', 'Describe what you''d do as a billionaire for a day', 'hypothetical', 'medium');

-- WORK & CAREER CATEGORY (5 prompts)
INSERT INTO imposter_prompts (regular_prompt, imposter_prompt, category, difficulty) VALUES
('Describe your dream job', 'Describe your dream business', 'work', 'medium'),
('What would your perfect office look like?', 'What would your perfect home office look like?', 'work', 'easy'),
('Describe your ideal work schedule', 'Describe your ideal retirement schedule', 'work', 'hard'),
('What skills would you love to learn?', 'What hobbies would you love to master?', 'work', 'medium'),
('Describe your perfect team project', 'Describe your perfect solo project', 'work', 'medium');

-- SOCIAL CATEGORY (5 prompts)
INSERT INTO imposter_prompts (regular_prompt, imposter_prompt, category, difficulty) VALUES
('Describe your ideal dinner party', 'Describe your ideal house party', 'social', 'easy'),
('What makes a perfect first date?', 'What makes a perfect anniversary date?', 'social', 'medium'),
('Describe your best friend', 'Describe your ideal friend', 'social', 'hard'),
('What would you do at a wedding reception?', 'What would you do at a birthday party?', 'social', 'easy'),
('Describe your perfect group vacation', 'Describe your perfect couples vacation', 'social', 'medium');

-- Update the updated_at timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_imposter_prompts_updated_at BEFORE UPDATE
    ON imposter_prompts FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verify data
SELECT category, COUNT(*) as count 
FROM imposter_prompts 
GROUP BY category 
ORDER BY category;
