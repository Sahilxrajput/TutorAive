import { AnimatePresence, motion } from "framer-motion";
import SectorHeader from "./SectorHeader";
import { BookOpen, Download, FileText, Plus, Upload, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import API from "@/lib/api";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { Progress } from "../ui/progress";
import { IResource } from "@/types/type";
import { useClassroom } from "@/hooks/useClassroom";


const ArchiveSector = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [noteName, setNoteName] = useState("");
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [file, setFile] = useState<File | null>(null)
    const [files, setFiles] = useState<IResource[]>([]);

    const { isClassInstructor } = useClassroom();
    const { classroomId } = useParams();

    useEffect(() => {

        const fetchFiles = async () => {
            try {
                const { data } = await API.get(`/classrooms/${classroomId}/resources`);
                setFiles(data.data);
            } catch {
                toast.info("somthing goes wrong");
                setFiles([])
            }
        }

        fetchFiles()
    }, [classroomId])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0]
        if (selected) setFile(selected)
    }

    const resourceUpload = async (e: FormEvent<HTMLElement>) => {
        if (!file) {
            return;
        }

        e.preventDefault();


        let cloudData;

        // 1. get signature + upload
        try {
            setUploading(true)

            const { data } = await API.post(`/classrooms/${classroomId}/resources`);

            const formData = new FormData();
            formData.append("file", file);
            formData.append("api_key", data.apiKey);
            formData.append("timestamp", data.timestamp);
            formData.append("signature", data.signature);
            formData.append("folder", data.folder);

            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${data.cloudName}/raw/upload`,
                formData,
                {
                    onUploadProgress: (e) => {
                        if (!e.total) return;
                        setProgress(Math.round((e.loaded * 100) / e.total));
                    },
                }
            );

            cloudData = res.data;
            toast.success("File uploaded successfully.");
        } catch (error) {
            toast.error("Cloud upload failed. Please try again.");
            console.error("cloudinary/server error:", error);
            setNoteName("")
            setFile(null)
            return; // STOP HERE
        }

        // 2. save in db (only if upload succeeded)
        try {
            setProgress(0)
            const payload =
            {
                url: cloudData.secure_url,
                publicId: cloudData.public_id,
                resourceType: cloudData.resource_type,
                title: noteName,
            }

            await API.post(`/classrooms/${classroomId}/resources/save`, payload, {
                onUploadProgress: (e) => {
                    if (!e.total) return;
                    setProgress(Math.round((e.loaded * 100) / e.total));
                },
            });

            toast.success("Resource posted successfully.");
            setIsModalOpen(false)
            // @todo after successfully upload and save into db
        } catch (err) {
            console.log(err)
            toast.error("Failed to save resource.");
        } finally {
            setUploading(false)
            setProgress(0)
            setFile(null)
            setNoteName("")
        }
    };

    return (<>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} >

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <SectorHeader title="Knowledge Vault" subtitle="Authorized course materials and archives" icon={BookOpen} />
                {isClassInstructor && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all"
                    >
                        <Plus size={20} />
                        <span>Add Note</span>
                    </motion.button>
                )}
            </div>

            <div className="space-y-4 mt-6">
                {files && files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-card/40 border border-border dark:border-white/5 hover:bg-primary/5 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                                <FileText size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-sm text-foreground uppercase font-oswald tracking-wide">{file.title}</p>
                                <p className="text-[10px] text-muted-foreground">• Last Sync: {new Date(file.updatedAt).toLocaleString(undefined, {
                                    dateStyle: "medium", timeStyle: "short"
                                })}</p>
                            </div>
                        </div>
                        <a href={file.file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Download size={18} />
                        </a>
                    </div>
                ))}
            </div>
        </motion.div>

        {/* Teacher Add Note Modal */}
        <AnimatePresence>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsModalOpen(false)}
                        className="absolute inset-0 bg-background/80 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md p-8 rounded-[2rem] bg-card border border-border shadow-2xl"
                    >
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-6">
                            <h3 className="text-xl font-bold font-oswald uppercase">Upload New Material</h3>
                            <p className="text-sm text-muted-foreground">Add a new PDF note to the knowledge vault.</p>
                        </div>

                        <form onSubmit={resourceUpload} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Note Title</label>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="e.g. Advanced_WebRTC_Patterns"
                                    value={noteName}
                                    required
                                    onChange={(e) => setNoteName(e.target.value)}
                                    className="w-full p-4 rounded-2xl bg-muted/50 border border-transparent focus:border-primary focus:bg-background transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">File</label>
                                <input
                                    autoFocus
                                    type="file"
                                    onChange={handleFileChange}
                                    required
                                    className="w-full p-4 rounded-2xl bg-muted/50 border border-transparent focus:border-primary focus:bg-background transition-all outline-none"
                                />
                            </div>
                            {uploading && <Progress value={progress} />}

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                // disabled={!!file || uploading}
                                className="w-full py-4 mt-4 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2"
                            >
                                <Upload size={18} />
                                {uploading ? "Uploading..." : "Confirm Upload"}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    </>
    );
};

export default ArchiveSector;