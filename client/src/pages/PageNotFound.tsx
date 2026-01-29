import { Button } from "@/components/ui/button";
import { ArrowBigLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/"); // fallback so users don’t get launched into space
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-background px-4">

            {/* Back button */}
            <Button
                onClick={handleBack}
                variant="secondary"
                size="icon"
                className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20"
            >
                <ArrowBigLeft className="h-5 w-5" />
            </Button>

            {/* 404 Image */}
            <img
                src="/404.jpg"
                alt="404 page not found"
                className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl h-auto object-contain pointer-events-none"
            />
        </div>
    );
};

export default PageNotFound;
