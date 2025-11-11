-- Add mode column to truth_or_dare_questions table (remove points since no scoring)
ALTER TABLE truth_or_dare_questions 
ADD COLUMN IF NOT EXISTS mode TEXT DEFAULT 'friends' CHECK (mode IN ('friends', 'couples'));

-- Remove points column since we don't need scoring
ALTER TABLE truth_or_dare_questions DROP COLUMN IF EXISTS points;

-- Update existing questions to be friends mode
UPDATE truth_or_dare_questions SET mode = 'friends';

-- Add friends mode questions
-- FRIENDS - MILD TRUTHS
INSERT INTO truth_or_dare_questions (type, spice_level, content, mode) VALUES
('truth', 'mild', 'What is your biggest fear?', 'friends'),
('truth', 'mild', 'What is your most embarrassing moment?', 'friends'),
('truth', 'mild', 'Who was your first crush?', 'friends'),
('truth', 'mild', 'What is your biggest pet peeve?', 'friends'),
('truth', 'mild', 'What is something you are really bad at?', 'friends'),
('truth', 'mild', 'What is your guilty pleasure?', 'friends'),
('truth', 'mild', 'What is the worst gift you have ever received?', 'friends'),
('truth', 'mild', 'What is your most used emoji?', 'friends'),
('truth', 'mild', 'What is the last lie you told?', 'friends'),
('truth', 'mild', 'What is your biggest regret?', 'friends');

-- FRIENDS - MILD DARES
INSERT INTO truth_or_dare_questions (type, spice_level, content, mode) VALUES
('dare', 'mild', 'Do your best impression of a celebrity', 'friends'),
('dare', 'mild', 'Speak in an accent for the next 3 minutes', 'friends'),
('dare', 'mild', 'Do 10 pushups', 'friends'),
('dare', 'mild', 'Sing the chorus of your favorite song', 'friends'),
('dare', 'mild', 'Do your best dance move', 'friends'),
('dare', 'mild', 'Tell a joke (it can be bad)', 'friends'),
('dare', 'mild', 'Show the last photo in your camera roll', 'friends'),
('dare', 'mild', 'Do your best animal impression', 'friends'),
('dare', 'mild', 'Speak only in questions for the next 2 minutes', 'friends'),
('dare', 'mild', 'Do a cartwheel or attempt one', 'friends');

-- FRIENDS - SPICY TRUTHS
INSERT INTO truth_or_dare_questions (type, spice_level, content, mode) VALUES
('truth', 'spicy', 'What is the most trouble you have ever been in?', 'friends'),
('truth', 'spicy', 'What is your biggest secret?', 'friends'),
('truth', 'spicy', 'Have you ever cheated on a test?', 'friends'),
('truth', 'spicy', 'What is the most embarrassing thing in your search history?', 'friends'),
('truth', 'spicy', 'Have you ever lied to get out of trouble?', 'friends'),
('truth', 'spicy', 'What is something you have done that you would never tell your parents?', 'friends'),
('truth', 'spicy', 'Have you ever had a crush on a friend''s partner?', 'friends'),
('truth', 'spicy', 'What is the worst thing you have said about someone behind their back?', 'friends'),
('truth', 'spicy', 'Have you ever stolen anything?', 'friends'),
('truth', 'spicy', 'What is your most toxic trait?', 'friends');

-- FRIENDS - SPICY DARES
INSERT INTO truth_or_dare_questions (type, spice_level, content, mode) VALUES
('dare', 'spicy', 'Text your crush or send them a message right now', 'friends'),
('dare', 'spicy', 'Post an embarrassing photo on social media', 'friends'),
('dare', 'spicy', 'Let the other player read your last 5 text messages', 'friends'),
('dare', 'spicy', 'Call a random contact and sing them a song', 'friends'),
('dare', 'spicy', 'Do a dramatic reading of your last social media post', 'friends'),
('dare', 'spicy', 'Let the other player post anything on your social media', 'friends'),
('dare', 'spicy', 'Show your most embarrassing photo', 'friends'),
('dare', 'spicy', 'Eat a spoonful of a condiment of the other player''s choice', 'friends'),
('dare', 'spicy', 'Do your best impression of the other player', 'friends'),
('dare', 'spicy', 'Let the other player go through your phone for 1 minute', 'friends');

-- FRIENDS - EXTREME TRUTHS
INSERT INTO truth_or_dare_questions (type, spice_level, content, mode) VALUES
('truth', 'extreme', 'What is the craziest thing you have ever done?', 'friends'),
('truth', 'extreme', 'What is your darkest secret?', 'friends'),
('truth', 'extreme', 'Have you ever done something illegal?', 'friends'),
('truth', 'extreme', 'What is the most embarrassing thing that has happened to you?', 'friends'),
('truth', 'extreme', 'What is something you would never want anyone to know?', 'friends'),
('truth', 'extreme', 'Have you ever betrayed a friend?', 'friends'),
('truth', 'extreme', 'What is the worst thing you have ever done?', 'friends'),
('truth', 'extreme', 'What is your most shameful moment?', 'friends'),
('truth', 'extreme', 'Have you ever lied about something serious?', 'friends'),
('truth', 'extreme', 'What is something you are deeply ashamed of?', 'friends');

-- FRIENDS - EXTREME DARES
INSERT INTO truth_or_dare_questions (type, spice_level, content, mode) VALUES
('dare', 'extreme', 'Call your ex right now', 'friends'),
('dare', 'extreme', 'Post your most embarrassing story on social media', 'friends'),
('dare', 'extreme', 'Let the other player send a text to anyone in your contacts', 'friends'),
('dare', 'extreme', 'Delete your most recent social media post', 'friends'),
('dare', 'extreme', 'Reveal your biggest secret out loud', 'friends'),
('dare', 'extreme', 'Let the other player look through your entire photo gallery', 'friends'),
('dare', 'extreme', 'Call a random number and try to have a 2 minute conversation', 'friends'),
('dare', 'extreme', 'Post a video of yourself doing something embarrassing', 'friends'),
('dare', 'extreme', 'Let the other player read all your messages with your crush', 'friends'),
('dare', 'extreme', 'Confess something you have never told anyone', 'friends');

-- Add couples mode questions
-- MILD COUPLES TRUTHS
INSERT INTO truth_or_dare_questions (type, spice_level, content, mode) VALUES
('truth', 'mild', 'What was your first impression of your partner?', 'couples'),
('truth', 'mild', 'What is your favorite thing about your partner?', 'couples'),
('truth', 'mild', 'What is your ideal date night?', 'couples'),
('truth', 'mild', 'When did you know you had feelings for your partner?', 'couples'),
('truth', 'mild', 'What is your love language?', 'couples'),
('truth', 'mild', 'What song reminds you of your relationship?', 'couples'),
('truth', 'mild', 'What is your favorite memory together?', 'couples'),
('truth', 'mild', 'What do you find most attractive about your partner?', 'couples'),
('truth', 'mild', 'What is something you want to do together?', 'couples'),
('truth', 'mild', 'What makes you feel most loved?', 'couples');

-- MILD COUPLES DARES
INSERT INTO truth_or_dare_questions (type, spice_level, content, mode) VALUES
('dare', 'mild', 'Give your partner a compliment', 'couples'),
('dare', 'mild', 'Hold hands for the next 5 minutes', 'couples'),
('dare', 'mild', 'Share your favorite photo of you two', 'couples'),
('dare', 'mild', 'Give your partner a hug', 'couples'),
('dare', 'mild', 'Tell your partner why you love them', 'couples'),
('dare', 'mild', 'Plan your next date together right now', 'couples'),
('dare', 'mild', 'Share a song that reminds you of them', 'couples'),
('dare', 'mild', 'Give your partner a kiss on the cheek', 'couples'),
('dare', 'mild', 'Write a short love note to your partner', 'couples'),
('dare', 'mild', 'Share your favorite thing about your relationship', 'couples');

-- SPICY COUPLES TRUTHS
INSERT INTO truth_or_dare_questions (type, spice_level, content, mode) VALUES
('truth', 'spicy', 'What is your biggest turn-on?', 'couples'),
('truth', 'spicy', 'What is your favorite physical feature of your partner?', 'couples'),
('truth', 'spicy', 'What is something you want to try in the bedroom?', 'couples'),
('truth', 'spicy', 'What is your favorite way to be kissed?', 'couples'),
('truth', 'spicy', 'What is your most romantic fantasy?', 'couples'),
('truth', 'spicy', 'Where is your favorite place to be touched?', 'couples'),
('truth', 'spicy', 'What is the most attractive thing your partner does?', 'couples'),
('truth', 'spicy', 'What is your ideal romantic evening?', 'couples'),
('truth', 'spicy', 'What makes you feel most desired?', 'couples'),
('truth', 'spicy', 'What is your favorite intimate moment together?', 'couples');

-- SPICY COUPLES DARES
INSERT INTO truth_or_dare_questions (type, spice_level, content, mode) VALUES
('dare', 'spicy', 'Give your partner a passionate kiss', 'couples'),
('dare', 'spicy', 'Whisper something romantic in your partner''s ear', 'couples'),
('dare', 'spicy', 'Give your partner a massage for 2 minutes', 'couples'),
('dare', 'spicy', 'Describe your partner in 3 romantic words', 'couples'),
('dare', 'spicy', 'Share your favorite intimate memory together', 'couples'),
('dare', 'spicy', 'Tell your partner your deepest desire', 'couples'),
('dare', 'spicy', 'Give your partner a slow dance', 'couples'),
('dare', 'spicy', 'Kiss your partner''s neck', 'couples'),
('dare', 'spicy', 'Tell your partner what you find most attractive about them physically', 'couples'),
('dare', 'spicy', 'Share a romantic fantasy with your partner', 'couples');

-- EXTREME COUPLES TRUTHS
INSERT INTO truth_or_dare_questions (type, spice_level, content, mode) VALUES
('truth', 'extreme', 'What is your wildest fantasy?', 'couples'),
('truth', 'extreme', 'What is something you have never told your partner?', 'couples'),
('truth', 'extreme', 'What is your biggest turn-on that you have not shared?', 'couples'),
('truth', 'extreme', 'What is the most adventurous thing you want to try?', 'couples'),
('truth', 'extreme', 'What is your secret desire?', 'couples'),
('truth', 'extreme', 'What is something that instantly turns you on?', 'couples'),
('truth', 'extreme', 'What is your most intimate fantasy?', 'couples'),
('truth', 'extreme', 'What is something you want to explore together?', 'couples'),
('truth', 'extreme', 'What is your deepest romantic secret?', 'couples'),
('truth', 'extreme', 'What is something that makes you feel most passionate?', 'couples');

-- EXTREME COUPLES DARES
INSERT INTO truth_or_dare_questions (type, spice_level, content, mode) VALUES
('dare', 'extreme', 'Give your partner a sensual kiss', 'couples'),
('dare', 'extreme', 'Describe in detail what you find most attractive about your partner', 'couples'),
('dare', 'extreme', 'Share your deepest fantasy with your partner', 'couples'),
('dare', 'extreme', 'Give your partner an intimate compliment', 'couples'),
('dare', 'extreme', 'Tell your partner exactly what you want right now', 'couples'),
('dare', 'extreme', 'Whisper something seductive to your partner', 'couples'),
('dare', 'extreme', 'Share what you love most about being intimate with your partner', 'couples'),
('dare', 'extreme', 'Tell your partner your biggest turn-on about them', 'couples'),
('dare', 'extreme', 'Describe your perfect romantic night together', 'couples'),
('dare', 'extreme', 'Share something you have been wanting to try together', 'couples');
