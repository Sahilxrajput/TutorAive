import React from "react";

interface LearningCardProps {
    Icon: React.ElementType;
    title: string;
    number: number;
    iconColor?: "blue" | "green" | "red" | "amber" | "pink" | "purple" | "gray";
}

const LearningCard: React.FC<LearningCardProps> = ({
    Icon,
    title,
    number,
    iconColor = "gray",
}) => {
    const textColor = `text-${iconColor}-600`;
    const bgColor = `bg-${iconColor}-100`;

    return (
        <div className="flex flex-col items-start gap-2 justify-center px-6 pr-10 py-4 rounded-xl shadow-md bg-white hover:shadow-lg transition">
            <span className={`${textColor} ${bgColor} p-2 rounded-full`}>
                <Icon size={16} />
            </span>
            <h3 className="text-gray-700 text-sm font-medium">{title}</h3>
            <h2 className="text-3xl font-bold text-gray-900">{number}</h2>
        </div>
    );
};

export default LearningCard;
