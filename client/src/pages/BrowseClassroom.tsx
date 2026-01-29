import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { BookOpen, Clock, SearchIcon, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import API from "@/lib/api";
import { toast } from "sonner";
import type { IClassroom } from "@/types/type";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { useSearchShortcut } from "@/hooks/useSearchShortcut";

export default function BrowseClassroom() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [selectedTag, setSelectedTag] = useState("All");
    const [selectedCourse, setSelectedCourse] =
        useState<IClassroom | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [courses, setCourses] = useState<IClassroom[]>([]);
    const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const { register } = useSearchShortcut();
    /* ---------- FETCH DATA ---------- */

    useEffect(() => {
        async function loadData() {
            try {
                const [{ data: all }, { data: enrolled }] = await Promise.all([
                    API.get("/classrooms"),
                    API.get("/users/enrolled"),
                ]);

                setCourses(all.data ?? []);
                setEnrolledCourses(
                    Array.isArray(enrolled)
                        ? enrolled.map((c: IClassroom) => c._id)
                        : []
                );
            } catch (err) {
                console.error(err);
            }
        }

        loadData();
    }, []);

    useEffect(() => {
        register(searchInputRef.current);
        return () => register(null);
    }, [register]);


    /* ---------- TAGS ---------- */

    const uniqueTags = useMemo(() => {
        const allTags = courses.flatMap((c) => c.tags || []);
        return ["All", ...Array.from(new Set(allTags)).slice(0, 8)];
    }, [courses]);

    /* ---------- SEARCH + TAG FILTER ---------- */

    const filteredCourses = useMemo(() => {
        const q = search.trim().toLowerCase();

        return courses.filter((course) => {
            const matchesSearch =
                !q ||
                course.title?.toLowerCase().includes(q) ||
                course.description?.toLowerCase().includes(q);

            const matchesTag =
                selectedTag === "All" || course.tags?.includes(selectedTag);

            return matchesSearch && matchesTag;
        });
    }, [courses, search, selectedTag]);

    /* ---------- SPLIT SECTIONS ---------- */

    const enrolledList = filteredCourses.filter((c) =>
        enrolledCourses.includes(c._id)
    );

    const availableList = filteredCourses.filter(
        (c) => !enrolledCourses.includes(c._id)
    );

    /* ---------- ENROLL HANDLERS ---------- */

    const handleEnrollClick = (course: IClassroom) => {
        if (enrolledCourses.includes(course._id)) {
            navigate(`/classrooms/${course._id}`);
            return;
        }
        setSelectedCourse(course);
        setIsDialogOpen(true);
    };

    const handleConfirmEnroll = async () => {
        if (!selectedCourse) return;

        try {
            const { data } = await API.post("/classrooms/enroll", {
                classroomId: selectedCourse._id,
            });
            toast.success(data.message);
            setEnrolledCourses((prev) => [...prev, selectedCourse._id]);
            navigate(`/classrooms/${selectedCourse._id}`);
        } catch (err) {
            console.error(err);
        } finally {
            setIsDialogOpen(false);
        }
    };

    /* ---------- RENDER ---------- */

    return (
        <div className="w-full py-8 px-6 flex flex-col items-center">
            {/* Search */}
            <div className="flex w-full mb-6 flex-col sm:flex-row max-w-2xl gap-6">
                <InputGroup>
                    <InputGroupInput
                        ref={searchInputRef}
                        placeholder="Search courses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end" className="hidden sm:flex">
                        <Kbd>⌘</Kbd>
                        <Kbd>K</Kbd>
                    </InputGroupAddon>
                </InputGroup>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {uniqueTags.map((tag) => (
                    <Badge
                        key={tag}
                        variant={selectedTag === tag ? "default" : "outline"}
                        className="cursor-pointer text-sm"
                        onClick={() => setSelectedTag(tag)}
                    >
                        <Tag className="h-3 w-3 mr-1" /> {tag}
                    </Badge>
                ))}
            </div>

            {/* Enrolled Courses */}
            {enrolledList.length > 0 && (
                <>
                    <h2 className="text-xl font-semibold mt-6 mb-4 text-green-600">
                        Enrolled Courses
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {enrolledList.map((course) => (
                            <Card
                                key={course._id}
                                className="border-2 border-green-500 shadow-sm hover:shadow-md"
                            >
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        {course.title}
                                        <Badge className="bg-green-500 text-white">
                                            Enrolled
                                        </Badge>
                                    </CardTitle>
                                    <CardDescription>
                                        {course.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <BookOpen size={14} /> {course.modules} modules
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} /> {course.hours} hrs
                                        </span>
                                    </div>
                                </CardContent>

                                <CardFooter>
                                    <Button
                                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() =>
                                            navigate(`/classrooms/${course._id}`)
                                        }
                                    >
                                        Go to Course
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </>
            )}

            {/* Available Courses */}
            <h2 className="text-xl font-semibold mt-8 mb-4 text-blue-600">
                Available Courses
            </h2>

            {availableList.length === 0 && (
                <p className="text-muted-foreground">
                    No courses match your filters.
                </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {availableList.map((course) => (
                    <Card
                        key={course._id}
                        className={`border-2 transition-all ${course.paid
                            ? "border-yellow-400 shadow-yellow-200"
                            : "border-gray-200"
                            }`}
                    >
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                {course.title}
                                {course.paid && (
                                    <Badge className="bg-yellow-500 text-black">
                                        Paid
                                    </Badge>
                                )}
                            </CardTitle>
                            <CardDescription className="line-clamp-2">
                                {course.description}
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <BookOpen size={14} /> {course.modules} modules
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock size={14} /> {course.hours} hrs
                                </span>
                            </div>
                        </CardContent>

                        <CardFooter>
                            <Button
                                className="w-full"
                                variant={course.paid ? "default" : "secondary"}
                                onClick={() => handleEnrollClick(course)}
                            >
                                {course.paid ? "Buy Course" : "Enroll Free"}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Confirm Enroll Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    {selectedCourse && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{selectedCourse.title}</DialogTitle>
                                <DialogDescription>
                                    {selectedCourse.description}
                                </DialogDescription>
                            </DialogHeader>

                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button onClick={handleConfirmEnroll}>
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
