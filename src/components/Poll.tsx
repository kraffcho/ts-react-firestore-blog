import { useState, useEffect } from "react";
import { fetchIP, fetchPollData, updatePollVote } from "../utils/fetchPoll";
import { PollData } from "../utils/types";

interface PollProps {
  pollId: string;
}

const Poll: React.FC<PollProps> = ({ pollId }) => {
  const [poll, setPoll] = useState<PollData | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userIP, setUserIP] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { options = {}, votedIPs = [] } = poll || {};
  const hasVoted = userIP && votedIPs.includes(userIP);
  const totalVotes = Object.values(options).reduce((acc, option) => acc + option.votes, 0);
  const getVoteString = (votes: number) => `${votes} ${votes === 1 ? "vote" : "votes"}`;
  const handleVote = async () => {
    if (!poll || !selectedOption || !userIP || votedIPs.includes(userIP)) {
      console.log("You have already voted or data is missing.");
      return;
    }

    try {
      const updatedPoll = await updatePollVote(poll, selectedOption, userIP, pollId);
      setPoll(updatedPoll);
    } catch (error) {
      console.error("Error updating vote:", error);
      setError('Failed to update your vote. Please try again.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const ip = await fetchIP();
        const pollData = await fetchPollData(pollId);
        
        setUserIP(ip);
        setPoll(pollData);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [pollId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!poll) {
    return <div>No poll data available.</div>;
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
        <button className="vote-button btn green extra-padding" onClick={handleVote}>
          Cast Your Vote
        </button>
      )}
    </div>
  );
};

export default Poll;
