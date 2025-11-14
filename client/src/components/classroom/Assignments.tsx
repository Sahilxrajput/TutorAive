import { CheckCircle, Clock } from "lucide-react"
import { classroomData } from "@/data/classData"
import { useEffect, useState } from "react"
import API from "@/lib/api"
import { PdfUploadDialog } from "../PdfUpload"

export default function Assignments() {
  const { assignments } = classroomData
  const assignmentId = "676b81b72d98f134e4b9f00a"; // dynamic later
  // const [assignments, setAssignments] = useState([])


  useEffect(() => {
    async function fetchAssignments() {
      const res = await API.get("/assignments")
      // setAssignments(res.data)
      // console.log(res.data)
    }
    fetchAssignments()
  }, [])

  const submitted = assignments.filter((a) => a.status === "Submitted")
  const pending = assignments.filter((a) => a.status !== "Submitted")

  const handleUpload = async (file: File) => {
    const form = new FormData()
    form.append("pdf", file)
    await fetch("/api/upload", { method: "POST", body: form })
  }

  return (
    <div className="p-8 w-full h-full overflow-y-auto bg-yellow-50">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Assignments</h2>

      {/* Pending Assignments */}
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

                <div className="flex mt-2 items-center justify-between">
                  <PdfUploadDialog assignmentId={assignmentId} />
                  <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">
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
}
