import React, { useState, useEffect } from "react";
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

  const hasVoted = Boolean(userIP && poll?.votedIPs.includes(userIP));
  const totalVotes = Object.values(poll?.options || {}).reduce(
    (acc, option) => acc + option.votes,
    0
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const ip = await fetchIP();
        const pollData = await fetchPollData(pollId);

        setUserIP(ip);
        setPoll(pollData);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pollId]);

  const handleVote = async () => {
    if (!poll || !selectedOption || hasVoted) {
      console.log("You have already voted or data is missing.");
      return;
    }

    try {
      const updatedPoll = await updatePollVote(
        poll,
        selectedOption,
        userIP!,
        pollId
      );
      setPoll(updatedPoll);
    } catch (error) {
      console.error("Error updating vote:", error);
      setError("Failed to update your vote. Please try again.");
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!poll) return <NoPollState />;

  return (
    <PollLayout
      poll={poll}
      totalVotes={totalVotes}
      hasVoted={hasVoted}
      handleVote={handleVote}
      setSelectedOption={setSelectedOption}
    />
  );
};

const LoadingState = () => <div>Loading...</div>;

const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <div>{error}</div>
);

const NoPollState = () => <div>No poll data available.</div>;

const PollLayout: React.FC<{
  poll: PollData;
  totalVotes: number;
  hasVoted: boolean;
  handleVote: () => void;
  setSelectedOption: (key: string) => void;
}> = ({ poll, totalVotes, hasVoted, handleVote, setSelectedOption }) => (
  <div className="poll-container animate__animated animate__fadeIn">
    <h2 className="poll-title">
      <span className="material-symbols-outlined">ballot</span>
      Poll Question
    </h2>
    <p className="poll-question">{poll.question}</p>
    <div className="poll-options">
      {Object.entries(poll.options).map(([key, option]) => (
        <PollOption
          key={key}
          id={key}
          option={option}
          totalVotes={totalVotes}
          hasVoted={hasVoted}
          setSelectedOption={setSelectedOption}
        />
      ))}
    </div>
    {hasVoted ? (
      <p className="voted-message">Your vote has been counted. Thanks!</p>
    ) : (
      <button
        className="vote-button btn green extra-padding"
        onClick={handleVote}
      >
        Cast Your Vote
      </button>
    )}
  </div>
);

const PollOption: React.FC<{
  id: string;
  option: {
    text: string;
    votes: number;
  };
  totalVotes: number;
  hasVoted: boolean;
  setSelectedOption: (key: string) => void;
}> = ({ id, option, totalVotes, hasVoted, setSelectedOption }) => {
  const percentage = totalVotes
    ? ((option.votes / totalVotes) * 100).toFixed(1)
    : "0";
  const voteString = `${option.votes} ${option.votes === 1 ? "vote" : "votes"}`;

  return (
    <div className="poll-option">
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
            id={id}
            className="option-input"
            name="poll-option"
            value={id}
            onChange={() => setSelectedOption(id)}
          />
          <label htmlFor={id} className="option-label">
            {option.text} ({voteString})
          </label>
        </>
      )}
    </div>
  );
};

export default Poll;
