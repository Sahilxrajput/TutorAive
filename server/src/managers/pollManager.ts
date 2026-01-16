// PollManager.ts

interface PollOption {
  _id: string;
  text: string;
  votes: number;
}

interface Poll {
  _id: string;
  question: string;
  options: PollOption[];
  isActive: boolean;
  totalVotes: number;
}


class PollManager {
  private polls = new Map<string, Poll>(); // pollId → poll

  add(poll: Poll) {
    this.polls.set(poll._id, poll);
  }

  get(pollId: string) {
    return this.polls.get(pollId);
  }

  getAll() {
    return [...this.polls.values()];
  }

  update(poll: Poll) {
    this.polls.set(poll._id, poll);
  }

  remove(pollId: string) {
    this.polls.delete(pollId);
  }
}

export const pollManager = new PollManager();
