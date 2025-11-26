export interface Quote {
  quote: string;
  author: string;
}

// Motivational quotes that rotate on a time slot so everyone sees the same
// message for a few hours. No backend needed.
export const motivationalQuotes: Quote[] = [
  { quote: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { quote: "It's not whether you get knocked down; it's whether you get up.", author: "Vince Lombardi" },
  { quote: "Success is no accident.", author: "Pele" },
  { quote: "Dream big. Work hard. Stay humble.", author: "Stephen Curry" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { quote: "Champions keep playing until they get it right.", author: "Billie Jean King" },
  { quote: "The future belongs to those who prepare for it today.", author: "Malcolm X" },
  { quote: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { quote: "Be hungry. Be foolish.", author: "Steve Jobs" },
  { quote: "Don't count the days, make the days count.", author: "Muhammad Ali" },
  { quote: "The moment you give up is the moment you let someone else win.", author: "Kobe Bryant" },
  { quote: "I am not afraid... I was born to do this.", author: "Joan of Arc" },
  { quote: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { quote: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { quote: "Everything negative, pressure, challenges, is all an opportunity to rise.", author: "Kobe Bryant" },
  { quote: "Act as if what you do makes a difference. It does.", author: "William James" },
  { quote: "Success is liking yourself, liking what you do, and liking how you do it.", author: "Maya Angelou" },
  { quote: "A champion is someone who gets up when they can't.", author: "Jack Dempsey" },
  { quote: "Doubt kills more dreams than failure ever will.", author: "Suzy Kassem" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
  { quote: "Discipline is choosing what you want most over what you want now.", author: "Abraham Lincoln (attributed)" },
  { quote: "Pain is temporary. Pride is forever.", author: "Unknown" },
  { quote: "Opportunities don't happen. You create them.", author: "Chris Grosser" },
  { quote: "Never say never because limits, like fears, are often just illusions.", author: "Michael Jordan" },
  { quote: "Everything you want is on the other side of fear.", author: "Jack Canfield" },
  { quote: "If you're going through hell, keep going.", author: "Winston Churchill" },
  { quote: "Every strike brings me closer to the next home run.", author: "Babe Ruth" },
  { quote: "Success is fueled by failure.", author: "Barack Obama" },
  { quote: "If you don't build your dream, someone will hire you to help build theirs.", author: "Tony Gaskins" },
  { quote: "Small steps every day.", author: "Unknown" },
  { quote: "Stay afraid, but do it anyway.", author: "Carrie Fisher" },
  { quote: "Strength grows in the moments you think you can't go on but keep going anyway.", author: "Unknown" },
  { quote: "Your life is your story. Write well. Edit often.", author: "Susan Statham" },
  { quote: "Be so good they can't ignore you.", author: "Steve Martin" },
  { quote: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
  { quote: "Hustle until your haters ask if you're hiring.", author: "Unknown" },
  { quote: "Courage is not the absence of fear, but the triumph over it.", author: "Nelson Mandela" },
  { quote: "Great things are done by a series of small things brought together.", author: "Vincent van Gogh" },
  { quote: "Know your worth. Then add tax.", author: "Unknown" },
];

// Rotate the quote every 3 hours so the same quote is shown within the window.
export function getRotatingQuote(): Quote {
  const slot = Math.floor(Date.now() / (1000 * 60 * 60 * 3));
  const index = slot % motivationalQuotes.length;
  return motivationalQuotes[index];
}

// Stressed-supportive messages that rotate every 3 hours
const stressedMessages: string[] = [
  "Slow down. You're doing the best you can.",
  "One step at a time is enough.",
  "You have survived 100% of your hardest days.",
  "Breathe. You don't need to have everything figured out right now.",
  "Rest is also progress.",
  "You are allowed to take a break.",
  "Nothing lasts forever — not even this moment.",
  "Don't let your mind bully your body.",
  "You are stronger than the stress you're feeling.",
  "It's okay to ask for help.",
  "You don't need to be perfect to be worthy.",
  "This moment doesn't define you.",
  "Take things day by day, hour by hour.",
  "Peace begins with a single breath.",
  "Progress, not pressure.",
  "Your only job right now is to breathe.",
  "You are allowed to reset.",
  "One bad moment does not make a bad life.",
  "Let go of what you can't control.",
  "You've already made it through so much — keep going."
];

export function getRotatingStressedMessage(): string {
  const slot = Math.floor(Date.now() / (1000 * 60 * 60 * 3));
  const index = slot % stressedMessages.length;
  return stressedMessages[index];
}

// Tired-supportive messages that rotate every 3 hours
const tiredMessages: string[] = [
  "Rest is productive — don't forget that.",
  "Even machines need to recharge.",
  "You're tired because you've been strong for too long.",
  "Pause. Your body is talking to you.",
  "You don't have to push every day.",
  "It's okay to slow down.",
  "Your energy is a resource, not something to waste.",
  "You've done enough for today.",
  "Be kind to yourself — exhaustion is not weakness.",
  "Taking a break is better than burning out.",
  "Listen to your body; it knows what you need.",
  "You can try again after resting.",
  "You deserve rest without guilt.",
  "Fatigue means you worked hard — honor that.",
  "Recharge so you can rise again.",
  "Rest now, conquer later.",
  "You're allowed to not be productive.",
  "Healing happens when you rest.",
  "A tired mind makes problems look bigger.",
  "Tomorrow is another chance — go rest."
];

export function getRotatingTiredMessage(): string {
  const slot = Math.floor(Date.now() / (1000 * 60 * 60 * 3));
  const index = slot % tiredMessages.length;
  return tiredMessages[index];
}

// Happy/celebratory messages that rotate every 3 hours
const happyMessages: string[] = [
  "I fully embrace the joy I feel right now.",
  "I deserve this happiness and more.",
  "I allow myself to enjoy this moment without guilt.",
  "I am grateful for the good in my life.",
  "I radiate positivity everywhere I go.",
  "I welcome more moments like this into my life.",
  "I am aligned with peace, joy, and clarity.",
  "I honor the happiness flowing through me.",
  "I choose to celebrate myself today.",
  "I am proud of how far I've come.",
  "I attract experiences that make me feel alive.",
  "I am surrounded by love, support, and good energy.",
  "I trust that more beautiful moments are on the way.",
  "I let my happiness inspire others.",
  "I am open to receiving even greater joy.",
  "I feel deeply connected to the present moment.",
  "I appreciate the little things that bring me happiness.",
  "I am allowed to shine brightly.",
  "I am growing into the happiest version of myself.",
  "I choose to carry this joy with me throughout my day."
];

export function getRotatingHappyMessage(): string {
  const slot = Math.floor(Date.now() / (1000 * 60 * 60 * 3));
  const index = slot % happyMessages.length;
  return happyMessages[index];
}

// Daily affirmations rotate every 3 hours to keep things fresh
const dailyAffirmations: string[] = [
  "I am capable of achieving great things.",
  "I show up for myself every single day.",
  "I choose progress over perfection.",
  "I trust myself to make the right decisions.",
  "I am becoming stronger in every way.",
  "I control my mindset and my actions.",
  "I have the discipline to reach my goals.",
  "I am proud of the effort I put in today.",
  "I learn and grow from every challenge.",
  "I am focused, determined, and resilient.",
  "I have what it takes to succeed.",
  "I give myself permission to rise.",
  "I show up even when it's not easy.",
  "I believe in my ability to improve.",
  "I create opportunities for myself.",
  "I attract the habits that make me better.",
  "I am consistent, even on tough days.",
  "I turn setbacks into fuel.",
  "I am patient with my growth.",
  "I deserve success and I work for it.",
  "I bring value to everything I do.",
  "I am in control of my energy.",
  "I am committed to becoming my best self.",
  "I take action with clarity and confidence.",
  "I stay focused on what truly matters.",
  "I am the author of my own future.",
  "I follow through on my intentions.",
  "I use my time wisely and intentionally.",
  "I release habits that hold me back.",
  "I am grateful for my ability to improve.",
  "I trust the process of growth.",
  "I make progress one step at a time.",
  "I am stronger than my doubts.",
  "I turn effort into achievement.",
  "I have a powerful mind and a strong will.",
  "I am building a life I am proud of.",
  "I am committed to my personal evolution.",
  "I am worthy of all the goals I set.",
  "I show up with purpose and direction.",
  "I celebrate my wins, big and small.",
  "I am focused on solutions, not problems.",
  "I allow myself to succeed without fear.",
  "I am unstoppable when I believe in myself.",
  "I am dedicated to long-term growth.",
  "I am motivated by my future self.",
  "I take responsibility for my progress.",
  "I am building momentum every day.",
  "I am open to new opportunities.",
  "I am becoming the person I admire.",
  "I honor my efforts and keep moving forward."
];

export function getRotatingAffirmations(): string[] {
  const slot = Math.floor(Date.now() / (1000 * 60 * 60 * 3));
  const start = slot % dailyAffirmations.length;
  // Provide a small slice (up to 4) to keep the list manageable on screen
  const slice: string[] = [];
  for (let i = 0; i < 4; i++) {
    const idx = (start + i) % dailyAffirmations.length;
    slice.push(dailyAffirmations[idx]);
  }
  return slice;
}
