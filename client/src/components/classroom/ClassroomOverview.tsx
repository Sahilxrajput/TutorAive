import API from "@/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ClassroomOverview() {
  const [classroom, setClassroom] = useState<any>(null);
  const { id } = useParams();

  useEffect(() => {
    async function classroomData() {
      const { data } = await API.get("/classrooms/" + id);
      setClassroom(data);
    }
    classroomData();
  }, [id]);

  if (!classroom) return <p>Loading course details...</p>;

  const { overview, curriculum, syllabus, rawData, title, description } =
    classroom;

  // Helper: check if overview actually has data
  const hasOverview =
    overview &&
    (overview.courseObjective ||
      overview.targetAudience ||
      overview.prerequisites ||
      (overview.learningOutcomes && overview.learningOutcomes.length > 0) ||
      overview.duration ||
      overview.mode ||
      (overview.resources && overview.resources.length > 0));

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Course Title */}
      {title && <h1 className="text-4xl font-bold mb-2">{title}</h1>}
      {description && <p className="text-gray-700 mb-6">{description}</p>}

      {/* Overview Section */}
      {hasOverview && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Course Overview</h2>
          <ul className="space-y-2 text-gray-800">
            {overview?.courseObjective && (
              <li>
                <strong>Objective:</strong> {overview.courseObjective}
              </li>
            )}
            {overview?.targetAudience && (
              <li>
                <strong>Target Audience:</strong> {overview.targetAudience}
              </li>
            )}
            {overview?.prerequisites && (
              <li>
                <strong>Prerequisites:</strong> {overview.prerequisites}
              </li>
            )}
            {overview?.learningOutcomes?.length > 0 && (
              <li>
                <strong>Learning Outcomes:</strong>
                <ul className="list-disc ml-5">
                  {overview.learningOutcomes.map((lo: any, idx: number) => (
                    <li key={idx}>{lo}</li>
                  ))}
                </ul>
              </li>
            )}
            {overview?.duration && (
              <li>
                <strong>Duration:</strong> {overview.duration}
              </li>
            )}
            {overview?.mode && (
              <li>
                <strong>Mode:</strong> {overview.mode}
              </li>
            )}
            {overview?.resources?.length > 0 && (
              <li>
                <strong>Resources:</strong>
                <ul className="list-disc ml-5">
                  {overview.resources.map((res: any, idx: number) => (
                    <li key={idx}>
                      <a
                        href={res}
                        className="text-blue-600 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {res}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
        </section>
      )}

      {/* Curriculum Section — show only if exists */}
      {curriculum?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Curriculum</h2>
          {curriculum.map((module: any, idx: number) => (
            <div key={idx} className="mb-4 p-4 border rounded-md shadow-sm">
              {module?.moduleTitle && (
                <h3 className="text-xl font-medium">{module.moduleTitle}</h3>
              )}
              {module?.moduleDescription && (
                <p className="text-gray-700 mb-2">{module.moduleDescription}</p>
              )}
              {module?.topics?.length > 0 && (
                <ul className="list-disc ml-5 mb-2">
                  {module.topics.map((topic: any, tidx: number) => (
                    <li key={tidx}>{topic}</li>
                  ))}
                </ul>
              )}
              {module?.resources?.length > 0 && (
                <div>
                  <strong>Resources:</strong>
                  <ul className="list-disc ml-5">
                    {module.resources.map((res: any, ridx: number) => (
                      <li key={ridx}>
                        <a
                          href={res}
                          className="text-blue-600 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {res}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Syllabus Section — show only if exists */}
      {syllabus?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Syllabus</h2>
          {syllabus.map((week: any, idx: number) => (
            <div key={idx} className="mb-3 p-3 border rounded-md bg-gray-50">
              {(week?.week || week?.topic) && (
                <h3 className="font-medium">
                  {week?.week && `Week ${week.week}:`} {week?.topic}
                </h3>
              )}
              {week?.description && (
                <p className="text-gray-700 mb-1">{week.description}</p>
              )}
              {week?.readingMaterials?.length > 0 && (
                <ul className="list-disc ml-5">
                  {week.readingMaterials.map((rm: any, ridx: number) => (
                    <li key={ridx}>
                      <a
                        href={rm}
                        className="text-blue-600 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {rm}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Raw Data Section — optional */}
      {rawData && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Extra Notes</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            {JSON.stringify(rawData, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}
