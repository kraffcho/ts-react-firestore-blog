import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../firebase";

interface Option {
  text: string;
  votes: number;
}

interface PollProps {
  pollId: string;
}

interface PollData {
  question: string;
  options: {
    [key: string]: Option;
  };
  votedIPs: string[];
}

const getVoteString = (votes: number) =>
  `${votes} ${votes === 1 ? "vote" : "votes"}`;

const Poll: React.FC<PollProps> = ({ pollId }) => {
  const [poll, setPoll] = useState<PollData | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userIP, setUserIP] = useState<string | null>(null);
  const hasVoted = userIP && poll?.votedIPs.includes(userIP);
  const totalVotes = Object.values(poll?.options || {}).reduce(
    (acc, option) => acc + option.votes,
    0
  );

  const fetchIP = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      setUserIP(data.ip);
    } catch (error) {
      console.error("Error fetching IP:", error);
    }
  };

  const fetchPoll = async () => {
    const docRef = doc(db, "polls", pollId);
    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPoll(docSnap.data() as PollData);
      } else {
        console.log("Poll not found!");
      }
    } catch (error) {
      console.error("Error fetching poll:", error);
    }
  };

  const handleVote = async () => {
    if (poll && selectedOption && userIP) {
      if (poll.votedIPs.includes(userIP)) {
        console.log("You have already voted.");
        return;
      }

      const updatedPoll = { ...poll };
      updatedPoll.options[selectedOption].votes += 1;
      updatedPoll.votedIPs.push(userIP);

      setPoll(updatedPoll);

      const pollDocRef = doc(db, "polls", pollId);
      try {
        await updateDoc(pollDocRef, {
          [`options.${selectedOption}.votes`]:
            updatedPoll.options[selectedOption].votes,
          votedIPs: updatedPoll.votedIPs,
        });
      } catch (error) {
        console.error("Error updating vote:", error);
      }
    }
  };

  useEffect(() => {
    fetchIP();
    fetchPoll();
  }, []);

  if (!poll) {
    return null;
  }

  return (
    <div className="poll-container animate__animated animate__fadeIn">
      <h2 className="poll-title">
        <span className="material-symbols-outlined">ballot</span>
        Poll Question
      </h2>
      <p className="poll-question">{poll.question}</p>
      <div className="poll-options">
        {Object.entries(poll.options).map(([key, option]) => {
          const percentage = totalVotes
            ? ((option.votes / totalVotes) * 100).toFixed(1)
            : 0;
          const voteString = getVoteString(option.votes);

          return (
            <div key={key} className="poll-option">
              <div
                className="percentage-background"
                style={{ width: `${percentage}%` }}
              ></div>
              {hasVoted ? (
                <span className="option-text">
                  {option.text} ({voteString}) - {percentage}%
                </span>
              ) : (
                <>
                  <input
                    type="radio"
                    id={key}
                    className="option-input"
                    name="poll-option"
                    value={key}
                    onChange={() => setSelectedOption(key)}
                  />
                  <label htmlFor={key} className="option-label">
                    {option.text} ({voteString})
                  </label>
                </>
              )}
            </div>
          );
        })}
      </div>
      {hasVoted ? (
        <p className="voted-message">Your vote has been counted. Thanks!</p>
      ) : (
        <button className="vote-button btn green" onClick={handleVote}>
          Cast Your Vote Now!
        </button>
      )}
    </div>
  );
};

export default Poll;
