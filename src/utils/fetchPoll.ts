import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { PollData } from "./types";

const API_IP_ENDPOINT = "https://api.ipify.org?format=json";

export const fetchIP = async (): Promise<string> => {
  const response = await fetch(API_IP_ENDPOINT);
  const data = await response.json();
  return data.ip;
};

export const fetchPollData = async (pollId: string): Promise<PollData> => {
  const docRef = doc(db, "polls", pollId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as PollData;
  } else {
    throw new Error("Poll not found");
  }
};

export const updatePollVote = async (
  poll: PollData,
  selectedOption: string,
  userIP: string,
  pollId: string
): Promise<PollData> => {
  const updatedPoll = { ...poll };
  updatedPoll.options[selectedOption].votes += 1;
  updatedPoll.votedIPs.push(userIP);

  const pollDocRef = doc(db, "polls", pollId);
  await updateDoc(pollDocRef, {
    [`options.${selectedOption}.votes`]:
      updatedPoll.options[selectedOption].votes,
    votedIPs: updatedPoll.votedIPs,
  });

  return updatedPoll;
};
