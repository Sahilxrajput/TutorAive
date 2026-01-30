import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Rocket, ShieldCheck, ArrowRight } from 'lucide-react';

const PricingCard = ({ tier, price, description, features, icon: Icon, highlighted = false, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay }}
        className={`relative p-8 rounded-[3rem] border ${highlighted
                ? 'bg-neutral-900 border-indigo-500/50 shadow-2xl shadow-indigo-500/20'
                : 'bg-neutral-900/40 border-white/5 backdrop-blur-xl'
            } flex flex-col h-full group hover:translate-y-[-8px] transition-all duration-500`}
    >
        {highlighted && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-4 py-1 rounded-full tracking-[0.2em] uppercase font-oswald">
                Most Popular
            </div>
        )}

        <div className="mb-8">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${highlighted ? 'bg-indigo-600 shadow-lg shadow-indigo-500/40' : 'bg-white/5'
                }`}>
                <Icon size={28} className={highlighted ? 'text-white' : 'text-indigo-400'} />
            </div>
            <h3 className="text-xl font-bold text-white font-oswald uppercase tracking-widest">{tier}</h3>
            <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white font-cinzel">${price}</span>
                <span className="text-neutral-500 text-sm">/month</span>
            </div>
            <p className="mt-4 text-neutral-400 text-sm leading-relaxed font-light">
                {description}
            </p>
        </div>

        <ul className="space-y-4 mb-10 flex-grow">
            {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-neutral-300">
                    <Check size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                </li>
            ))}
        </ul>

        <button className={`w-full py-4 rounded-2xl font-bold font-oswald tracking-widest text-xs uppercase transition-all flex items-center justify-center gap-2 ${highlighted
                ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
            }`}>
            Select Plan <ArrowRight size={14} />
        </button>
    </motion.div>
);

const Pricing = () => {
    const plans = [
        {
            tier: "Starter",
            price: "0",
            icon: Zap,
            description: "Perfect for students and small study groups exploring the platform.",
            features: [
                "Up to 40 mins per session",
                "1:1 Video Calls (WebRTC)",
                "Basic Digital Whiteboard",
                "Self-Attendance Logging",
                "GSSoC'25 Special Access"
            ],
            delay: 0.2
        },
        {
            tier: "Pro Educator",
            price: "29",
            icon: Rocket,
            highlighted: true,
            description: "Designed for professional tutors who need unlimited interaction.",
            features: [
                "Unlimited Session Length",
                "Up to 50 Students per Room",
                "Advanced Auto-Grading",
                "Cloud Session Recording",
                "Priority Support",
                "Custom Branding"
            ],
            delay: 0.4
        },
        {
            tier: "Institution",
            price: "99",
            icon: ShieldCheck,
            description: "Enterprise features for schools and learning centers scaling globally.",
            features: [
                "Multiple Teacher Accounts",
                "Campus-wide Analytics",
                "API Access for LMS Integration",
                "Dedicated Account Manager",
                "SLA Guarantee"
            ],
            delay: 0.6
        }
    ];

    return (
        <section id="pricing" className="py-24 bg-black relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-indigo-600/5 blur-[150px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto px-8">
                <div className="text-center mb-20">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-indigo-500 font-bold tracking-[0.4em] text-[10px] uppercase mb-4 block font-oswald"
                    >
                        Pricing & Plans
                    </motion.span>
                    <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight font-cinzel">
                        CHOOSE YOUR <span className="text-indigo-500 italic">ENERGY.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <PricingCard key={index} {...plan} />
                    ))}
                </div>

                {/* Security/Trust Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-16 flex flex-wrap justify-center gap-8 text-neutral-600 font-oswald text-[10px] uppercase tracking-[0.2em]"
                >
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-indigo-500" /> Secure Payments
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap size={14} className="text-indigo-500" /> Cancel Anytime
                    </div>
                    <div className="flex items-center gap-2">
                        <Check size={14} className="text-indigo-500" /> 14-Day Free Trial
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Pricing;