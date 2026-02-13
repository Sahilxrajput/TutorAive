import { useState, lazy, Suspense } from 'react';

import HeroPage from './HeroPage';
import LandingNavbar from '@/components/landing/LandingNavbar';

// lazy sections
const HowItWorks = lazy(() => import('./HowItWorks'));
const Mission = lazy(() => import('./Mission'));
const Testimonials = lazy(() => import('./TestimonialsPage'));
const ContactSection = lazy(() => import('./ContactPage'));
const Footer = lazy(() => import('./Footer'));

const LandingPage = () => {
    const [activeTab, setActiveTab] = useState<string>('teacher');

    return (
        <div className="min-h-screen bg-background text-neutral-200 selection:bg-indigo-500/30 overflow-x-hidden">
            <LandingNavbar />
            <HeroPage activeTab={activeTab} setActiveTab={setActiveTab} />

            <Suspense fallback={null}>
                <HowItWorks activeTab={activeTab} />
                <Mission />
                <Testimonials />
                <ContactSection />
                <Footer />
            </Suspense>
        </div>
    )
}

export default LandingPage;