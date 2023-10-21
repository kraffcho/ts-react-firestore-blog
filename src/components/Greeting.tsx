import React from "react";

interface GreetingProps {
  name: string;
  additionalMessage: string;
}

const Greeting: React.FC<GreetingProps> = ({ name, additionalMessage }) => {
  const getTimeBasedGreeting = (name: string) => {
    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour < 6) {
      return `You're up early, ${name}!`;
    } else if (currentHour >= 6 && currentHour < 12) {
      return `Good morning, ${name}!`;
    } else if (currentHour >= 12 && currentHour < 18) {
      return `Good afternoon, ${name}!`;
    } else if (currentHour >= 18 && currentHour < 22) {
      return `Good evening, ${name}!`;
    } else {
      return `Still awake, ${name}? It's getting late!`;
    }
  };

  const greetingMessage = getTimeBasedGreeting(name);

  return (
    <p className="user-profile__greetings">
      {greetingMessage} {additionalMessage}
    </p>
  );
};

export default Greeting;
