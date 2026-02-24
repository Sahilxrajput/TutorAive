import { ShieldCheck } from "lucide-react";

const TutoraiveUserCard = ({ name = "User Name", role = "Student" }) => {
    return (
        <div className="bg-gradient-to-br from-primary/10 via-background to-transparent border border-primary/20 rounded-[2.5rem] p-8 relative overflow-hidden group transition-all duration-500 hover:shadow-xl">

            <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center text-primary shadow-inner">
                    <ShieldCheck size={28} strokeWidth={1.5} />
                </div>

                <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest font-oswald">
                        Tutoraive Official User
                    </h4>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wide">
                        {role} • Verified Member
                    </p>
                </div>
            </div>

            <div className="mb-6">
                <p className="text-sm font-semibold font-inter">{name}</p>
                <p className="text-xs text-muted-foreground font-inter">
                    Registered on Tutoraive Platform
                </p>
            </div>

            <p className="text-xs text-muted-foreground font-inter leading-relaxed">
                This card certifies that the above individual is an officially registered and verified user of the Tutoraive learning ecosystem.
            </p>

            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
        </div>
    );
};

export default TutoraiveUserCard;