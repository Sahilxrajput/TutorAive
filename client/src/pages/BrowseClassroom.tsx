import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { BookOpen, Clock, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import API from "@/api";

export default function BrowseClassroom() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);

  useEffect(() => {
    async function getAllClassroom() {
      try {
        const { data } = await API.get("/classrooms");
        setCourses(data.data);
      } catch (error) {
        console.log(error);
      }
    }



    async function getEnrolled() {
      try {
        let { data } = await API.get("/users/enrolled");

        if (!Array.isArray(data)) {
          data = [];
        }
        console.log("enrolled data ", data) 
        //  Use IDs, not titles, for consistent matching
        setEnrolledCourses(data.map((c: any) => c._id));
      } catch (error) {
        console.log(error);
      }
    }
    getAllClassroom();
    getEnrolled();
  }, []);

  // All unique tags
  const allTags = courses.flatMap((c) => c.tags || []);
  const uniqueTag = ["All", ...Array.from(new Set(allTags)).slice(0, 8)];

  // Filtered by search + tags
  const filteredCourses = courses.filter((classroom) => {
    const matchesSearch = classroom.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesTags =
      selectedTags === "All" ||
      (Array.isArray(classroom.tags)
        ? classroom.tags.includes(selectedTags)
        : classroom.tags === selectedTags);
    return matchesSearch && matchesTags;
  });

  const handleEnrollClick = (classroom: any) => {
    if (enrolledCourses.includes(classroom._id)) {
      navigate(`/classrooms/${classroom._id}`);
      return;
    }
    setSelectedCourse(classroom);
    setIsDialogOpen(true);
  };

  const handleConfirmEnroll = async () => {
    console.log("selected classroom : ", selectedCourse)
    if (!selectedCourse) return;

    try {
      if (selectedCourse.paid) {
        // Payment integration placeholder
        console.log("Redirecting to payment gateway...");
      } else {
        const res = await API.post("/classrooms/enroll", {
          classroomId: selectedCourse._id,
        });
        console.log(res);
        setEnrolledCourses([...enrolledCourses, selectedCourse._id]);
        navigate("/classrooms/" + selectedCourse._id)
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-6">
      {/* Search Bar */}
      <section className="flex flex-col sm:flex-row w-full max-w-2xl items-center gap-3 mb-6">
        <Input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      {/* Tag Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {uniqueTag.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTags === tag ? "default" : "outline"}
            className="cursor-pointer text-sm"
            onClick={() => setSelectedTags(tag)}
          >
            <Tag className="h-3 w-3 mr-1" /> {tag}
          </Badge>
        ))}
      </div>

      {/* ✅ Enrolled Courses Section */}
      {enrolledCourses.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-8 mb-4 text-green-600">
            Enrolled Courses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filteredCourses
              .filter((c) => enrolledCourses.includes(c._id))
              .map((classroom) => (
                <Card
                  key={classroom._id}
                  className="border-2 border-green-500 shadow-green-200 shadow-sm hover:shadow-md transition-all"
                >
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      {classroom.title}
                      <Badge className="bg-green-500 text-white">
                        Enrolled
                      </Badge>
                    </CardTitle>
                    <CardDescription>{classroom.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <BookOpen size={16} /> {classroom.modules} Modules
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} /> {classroom.hour} Hours
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      size="sm"
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => navigate(`/classrooms/${classroom._id}`)}
                    >
                      Go to Course
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </>
      )}

      {/* 🩵 Available Courses Section */}
      <h2 className="text-xl font-semibold mt-8 mb-4 text-blue-600">
        Available Courses
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {filteredCourses
          .filter((c) => !enrolledCourses.includes(c._id))
          .map((classroom) => (
            <Card
              key={classroom._id}
              className={`shadow-md hover:shadow-lg border-2 transition-all ${classroom.paid
                ? "border-yellow-400 shadow-yellow-200"
                : "border-gray-200"
                }`}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {classroom.title}
                  {classroom.paid && (
                    <Badge className="bg-yellow-500 text-black font-semibold">
                      Paid
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500 line-clamp-2">
                  {classroom.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <BookOpen size={16} />
                    <span>{classroom.modules} Modules</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{classroom.hour} Hours</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  size="sm"
                  className="w-full mt-2"
                  variant={classroom.paid ? "default" : "secondary"}
                  onClick={() => handleEnrollClick(classroom)}
                >
                  {classroom.paid ? "Buy Course" : "Enroll Free"}
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>

      {/* Enroll Confirmation Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          {selectedCourse && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedCourse.title}</DialogTitle>
                <DialogDescription>
                  {selectedCourse.description}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-2 text-sm text-gray-600">
                <p>
                  <BookOpen className="inline mr-1" size={14} />{" "}
                  {selectedCourse.modules} modules
                </p>
                <p>
                  <Clock className="inline mr-1" size={14} />{" "}
                  {selectedCourse.hour} hours total
                </p>
                <p>
                  <Tag className="inline mr-1" size={14} />{" "}
                  {selectedCourse.category}
                </p>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="default" onClick={handleConfirmEnroll}>
                  Confirm Enroll
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
