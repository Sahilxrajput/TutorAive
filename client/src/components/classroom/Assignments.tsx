import { CheckCircle, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import API from "@/lib/api"
import { PdfUploadDialog } from "../PdfUpload"
import { useParams } from "react-router-dom"
import type { IAssignment } from "@/types/auth"

export default function Assignments() {
  const [assignments, setAssignments] = useState<IAssignment[]>([])
  const [submitted, setSubmitted] = useState<IAssignment[]>([])
  const [pending, setPending] = useState<IAssignment[]>([])

  const { id: classroomId } = useParams();


  useEffect(() => {
    async function fetchAssignments() {
      const { data } = await API.get("/assignments/classroom/" + classroomId)
      setAssignments(data.data)
      console.log("asssign", data.data)
    }
    fetchAssignments()
  }, [])

  useEffect(() => {
    setSubmitted(assignments.filter(a => a.status === "submitted"))
    setPending(assignments.filter(a => a.status !== "submitted"))
  }, [assignments])

  function submissionUploaded(id: string) {
    const item = assignments.find((a: IAssignment) => a._id === id);
    if (!item) return; // prevent undefined push
    setPending(prev => prev.filter(a => a._id !== id));
    setSubmitted(prev => [...prev, item]);
  }


  return (
    <div className="p-8 w-full h-full overflow-y-auto bg-yellow-50">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Assignments</h2>

      Pending Assignments
      <section className="mb-10">
        <h3 className="text-2xl font-semibold text-yellow-700 mb-4 flex items-center gap-2">
          <Clock className="text-yellow-600" /> Pending Assignments
        </h3>

        {pending.length === 0 ? (
          <p className="text-gray-500 italic">No pending assignments</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {pending.map((item) => (
              <div
                key={item._id}
                className="bg-white flex flex-col gap-2 rounded-xl p-5 shadow-md hover:shadow-lg transition"
              >
                <h4 className="text-lg font-semibold text-gray-700">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-500">
                  Due: {new Date(item.dueDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Status:{" "}
                  <span className="font-medium text-red-500">{item.status}</span>
                </p>
                <p className="text-xs font-thin text-gray-500">
                  Post On: {new Date(item.createdAt).toLocaleDateString()}
                </p>
                <div className="flex mt-2 items-center justify-between">
                  <PdfUploadDialog onComplete={submissionUploaded} buttonText="Upload PDF" title="Upload Submission PDF" id={item._id} type="submission" />
                  <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">
                    {/* @todo make it publically accessable */}
                    See Assignment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Submitted Assignments */}
      <section>
        <h3 className="text-2xl font-semibold text-green-700 mb-4 flex items-center gap-2">
          <CheckCircle className="text-green-600" /> Submitted Assignments
        </h3>

        {submitted.length === 0 ? (
          <p className="text-gray-500 italic">
            You haven’t submitted any assignments yet.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {submitted.map((item) => (
              <div
                key={item._id}
                className="bg-green-50 border border-green-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
              >
                <h4 className="text-lg font-semibold text-gray-700">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-500">
                  Submitted on: {new Date(item.dueDate).toLocaleDateString()}
                </p>
                <div className="flex gap-4">
                  <p className="mt-2 text-sm text-gray-600">
                    Points:{" "}
                    <span className="font-medium text-blue-600">
                      {item.maxPoints || "Pending"}
                    </span>
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Obtained:{" "}
                    <span className="font-medium text-green-600">
                      {item.maxPoints || "Pending"}
                    </span>
                  </p>
                </div>
                <div className="flex mt-2 items-center justify-between">
                  <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">
                    See Assignment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )

  //   return (
  //     <div>
  //       hii
  //     </div>
  //   )
}
