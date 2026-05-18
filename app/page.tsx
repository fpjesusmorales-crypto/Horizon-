import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { AddonsSection } from "@/components/addons-section"
import { RecurringPlansSection } from "@/components/recurring-plans-section"
import { ExpectSection } from "@/components/expect-section"
import { AboutSection } from "@/components/about-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { SafetySection } from "@/components/safety-section"
import QuoteEstimator from "@/components/quote-estimator"
import { FaqSection } from "@/components/faq-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function HorizonOperationsWebsite() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <AddonsSection />
        <RecurringPlansSection />
        <ExpectSection />
        <AboutSection />
        <TestimonialsSection />
        <SafetySection />
        <QuoteEstimator />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
