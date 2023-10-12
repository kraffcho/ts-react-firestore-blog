import React, { useState, useEffect } from "react";

interface TimedNotificationProps {
  message: string;
  time: number;
  classes?: string;
}

const TimedNotification: React.FC<TimedNotificationProps> = ({
  message,
  time,
  classes = "",
}) => {
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, time);

    return () => {
      clearTimeout(timer);
    };
  }, [time]);

  if (!visible) return null;

  const combinedClasses = `notification ${classes}`;

  return <div className={combinedClasses}>{message}</div>;
};

export default TimedNotification;
