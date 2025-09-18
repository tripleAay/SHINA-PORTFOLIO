import Header from '../components/header';
import Hero from '../components/hero';
import About from '../components/about';
import SkillsSection from '../components/skillsSection';
import Portfolio from '../components/portfolio';
import ContactForm from '../components/contactForm';
import Footer from '../components/footer';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>Shina Adedokun | Web Developer Portfolio</title>
        <meta
          name="description"
          content="Portfolio of Shina Adedokun, a skilled web developer showcasing projects, skills, and contact information."
        />
        <meta name="keywords" content="web developer, portfolio, Shina Adedokun, front-end, full-stack, React, Next.js" />
        <meta name="author" content="Shina Adedokun" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://yourwebsite.com" /> {/* Replace with your website URL */}
      </Head>

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <Header />
        <Hero />
        <About />
        <SkillsSection/>
        <Portfolio />
        <ContactForm />
        <Footer />

        
        
      </div>
    </>
  );
}