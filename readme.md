# automatiaclly remove token if user try to relogin from other account

# complete

signin page
signup page

<!-- shortcut -->

selecet a word => ctrl + d (automatically selct next occuring)
selecet a word => ctrl + shift + l (automatically selct all occuring)

<!-- component -->
empty component -> shadcn

<!-- note model -->
trashedAt, ArchievedAt doesn't work as expected --> trashedBy, ArcheivedBy


<!-- mediasoup -->
transport.updateIceServers({ iceServers })
https://mediasoup.org/documentation/v3/mediasoup-client/api/#transport-updateIceServers

<!-- Features -->
exclidraw intregration



<!-- Bonus: Fix slow restarts -->
{
  "compilerOptions": {
    "skipLibCheck": true,
    "incremental": true
  }
}

 <-------------------------aggregate---------------------------------->

const classroomId = req.params.classroomId;
const studentId = req.userId;

const stats = await Assignment.aggregate([
  {
    $match: {
      classroom: new mongoose.Types.ObjectId(classroomId),
    },
  },
  {
    $lookup: {
      from: "submissions",
      let: { assignmentId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$assignmentId", "$$assignmentId"] },
                { $eq: ["$studentId", new mongoose.Types.ObjectId(studentId)] },
              ],
            },
          },
        },
      ],
      as: "mySubmission",
    },
  },
  {
    $addFields: {
      isSubmitted: { $gt: [{ $size: "$mySubmission" }, 0] },
    },
  },
  {
    $group: {
      _id: null,
      totalAssignments: { $sum: 1 },
      submitted: {
        $sum: {
          $cond: ["$isSubmitted", 1, 0],
        },
      },
    },
  },
  {
    $addFields: {
      pending: { $subtract: ["$totalAssignments", "$submitted"] },
    },
  },
]);


<!-- color -->
#26D9D9
#0E1422
#0B0F1C