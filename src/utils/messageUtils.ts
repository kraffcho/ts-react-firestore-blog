export const getRandomMessage = () => {
  const messages = [
    "Hope you're having a fantastic day!",
    "Let's make today a great day!",
    "Anything exciting planned today?",
    "Remember to take breaks and stay hydrated!",
    "You're doing great. Keep it up!",
    "Need any help? Just ask!",
    "Stay positive and focused.",
    "Great things never come from comfort zones.",
    "Chase your dreams today!",
    "Feeling inspired? Share a story with us today!",
    "There's a community here, eager to hear your voice.",
    "Every post you share leaves a mark. Keep writing!",
    "Your words have the power to inspire many.",
    "Dive deep into your thoughts and let the words flow.",
    "The world is waiting to hear your unique perspective.",
    "Your stories are a beacon for others. Keep shining!",
    "Every writer started with a single word. Keep going!",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};
