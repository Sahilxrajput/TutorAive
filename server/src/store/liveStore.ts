export interface LiveChatMessage {
  _id: string; // temp uuid
  lectureId: string;
  userId: string;
  userName: string;
  userProfilePicture?: string;
  role: "student" | "instructor";
  message: string;
  createdAt: Date;
}

export interface PollOption {
  _id: string;
  text: string;
  votes: number;
}

export interface LivePoll {
  _id: string;
  question: string;
  options: PollOption[];
  isActive: boolean;

  // runtime-only
  votedUsers: Map<string, string>; // userId -> optionId
}

// export interface Answer {
//   userId: string;
//   userName: string;
//   answer: string;
//   createdAt: Date;
// }

export interface LiveQuestion {
  _id: string; // temp id (uuid)
  userId: string;
  userName: string;
  question: string;
  upvotes: number;
  isAnswered: boolean;
  createdAt: Date;
  //   answer?: Answer;
  userProfilePicture: string;

  // runtime-only
  upvotedUsers: Set<string>; // userId set
}

export const livePolls = new Map<
  string, // lectureId
  Map<string, LivePoll> // pollId -> poll
>();

export const liveQnA = new Map<
  string, // lectureId
  Map<string, LiveQuestion> // questionId -> question
>();

export const liveChats = new Map<
  string, // lectureId
  LiveChatMessage[] // messages
>();

export const clearLectureStore = (lectureId: string) => {
  livePolls.delete(lectureId);
  liveQnA.delete(lectureId);
  liveChats.delete(lectureId);
  console.log(`[store] cleared lecture ${lectureId}`);
};
