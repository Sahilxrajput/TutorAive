import HowItWorks from './HowItWorks';
import Testimonials from './Testimonials';
import RolePage from './RolePage';
import HeroPage from './HeroPage';
import Features from './HeroPage';
import ContactSection from './ContactPage';
import Footer from './Footer';
import Pricing from './Pricing';
import { useState } from 'react';
import StudentPage from './StudentPage';
import TeacherPage from './Teacher';


const LandingPage = () => {
    const [activeTab, setActiveTab] = useState<'teacher' | 'student'>('teacher');


    return (
        <div className="min-h-screen bg-black text-neutral-200 selection:bg-indigo-500/30 overflow-x-hidden">
            <Features activeTab={activeTab} setActiveTab={setActiveTab} />
            <HowItWorks activeTab={activeTab} />
            {/* {activeTab === 'student' ? <StudentPage /> : <TeacherPage />} */}
            <Testimonials />
            <Pricing />
            <ContactSection />
            <Footer />
        </div>
    )
}

export default LandingPage
