import HowItWorks from './HowItWorks';
import Testimonials from './TestimonialsPage';
import ContactSection from './ContactPage';
import Footer from './Footer';
import { useState } from 'react';
import HeroPage from './HeroPage';
import LandingNavbar from '@/components/landing/LandingNavbar';
import Mission from '@/components/landing/Mission';


const LandingPage = () => {
    const [activeTab, setActiveTab] = useState<string>('teacher');

    return (
        <div className="min-h-screen bg-background text-neutral-200 selection:bg-indigo-500/30 overflow-x-hidden">
            <LandingNavbar />
            <HeroPage activeTab={activeTab} setActiveTab={setActiveTab} />
            <HowItWorks  activeTab={activeTab} />
            <Mission/>
            <Testimonials />
            <ContactSection />
            <Footer />
        </div>
    )
}

export default LandingPage
