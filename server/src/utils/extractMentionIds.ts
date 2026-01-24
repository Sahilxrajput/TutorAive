import { Types } from "mongoose";
import User from "../models/user.model";

export async function extractMentionedUserIds(
  content: string,
  authorId: string
): Promise<Types.ObjectId[]> {
  if (!content) return [];

  const matches = content.matchAll(/@([a-zA-Z0-9_]{3,30})/g);
  const usernames = [...matches].map((m) => m[1].toLowerCase());
  if (usernames.length === 0) return [];

  // 2. Remove duplicates
  const uniqueUsernames = [...new Set(usernames)];

  // 3. Find users in DB
  const users = await User.find(
    { userName: { $in: uniqueUsernames } },
    { _id: 1 }
  );

  const creatorId = new Types.ObjectId(authorId);

  // 4. Map to IDs & filter self-mention
  const ids = users
    .map((u) => u._id)
    .filter((id : Types.ObjectId) => !creatorId || !id.equals(creatorId));

  return ids;
}
