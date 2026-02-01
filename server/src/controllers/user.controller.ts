import User from "../models/user.model";

export const getUserProfile = async (req: any, res: any) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

export async function getAllEnrolledClassrooms(req:any, res:any) {
  try {
    const user = await User.findById(req.userId).populate("enrolledClassrooms");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.enrolledClassrooms);
  } catch (error) {
    console.error("Error fetching enrolled classrooms:", error);
    res.status(500).json({ message: "Server error" });
  }
}
