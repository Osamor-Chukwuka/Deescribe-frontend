import { ArrowRight, BookOpen, Users, TrendingUp, Star, Button, Navbar, HeroSection, StatisticsSection, FeaturesSection, Testimonials, CallToAction, Footer } from "@/app/ui/imports"

export default function Home() {
  return (
    <main className="min-h-screen bg-white pt-3 ">
      <Navbar/>

      <HeroSection/>

      {/* Stats Section */}
      <StatisticsSection/>
      

      {/* Features Section */}
      <FeaturesSection/>


      {/* Testimonials Section */}
      <Testimonials/>
      

      {/* Call-to-Action Section */}
      <CallToAction/>


      {/* Footer Section */}
      <Footer/>
      
    </main>
  );
}
