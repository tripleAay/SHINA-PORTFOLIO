'use client';

import { useContext, useState, useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faLinkedinIn, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from '../contexts/ThemeContext';
import picB from '../assets/images/pic b.png';

const Hero = () => {
  const { lightMode } = useContext(ThemeContext);

  // Typing effect
  const fullText = "Shina Adedokun";
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loop, setLoop] = useState(0);

  const typingSpeed = isDeleting ? 80 : 150;

  useEffect(() => {
    const handleTyping = () => {
      const updatedText = isDeleting
        ? fullText.substring(0, displayText.length - 1)
        : fullText.substring(0, displayText.length + 1);

      setDisplayText(updatedText);

      if (!isDeleting && updatedText === fullText) {
        setTimeout(() => setIsDeleting(true), 1200); // pause before deleting
      } else if (isDeleting && updatedText === "") {
        setIsDeleting(false);
        setLoop(loop + 1); // loop again
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loop]);

  return (
    <section
      className={`min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out ${
        lightMode ? 'bg-gray-900' : 'bg-gray-100'
      }`}
      aria-labelledby="hero-title"
    >
      <div
        className={`max-w-5xl w-full flex flex-col lg:flex-row items-center rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${
          lightMode ? 'text-white' : 'text-gray-900'
        }`}
      >
        {/* Text Section */}
        <div className="flex-1 p-6 lg:p-12 text-center lg:text-left">
          <h1
            id="hero-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight"
          >
            I’m <span className="text-yellow-400">{displayText}</span>
            <span className="ml-1 animate-pulse">|</span>
          </h1>
          <p className="text-lg sm:text-xl font-light mb-6 max-w-md mx-auto lg:mx-0">
            Full-Stack Web Developer & Brand Designer
          </p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className={`px-6 py-3 rounded-md text-sm font-semibold transition-all duration-300 ease-in-out ${
              lightMode
                ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900'
                : 'border-gray-900 text-yellow-400 bg-gray-900 hover:bg-yellow-400 hover:text-gray-900'
            } border focus:outline-none focus:ring-2 focus:ring-yellow-400`}
            aria-label="Contact Shina Adedokun"
          >
            Contact Me
          </button>
        </div>

        {/* Image Section */}
        <div className="relative flex-1 p-6">
          <Image
            src={picB}
            alt="Shina Adedokun - Profile"
            width={500}
            height={500}
            className="w-full h-auto rounded-md object-cover"
            priority
          />

          {/* Social Icons */}
          <div className="absolute top-1/2 right-6 transform -translate-y-1/2 space-y-4">
            <a
              href="https://x.com/Aaytriple"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-yellow-400 hover:text-gray-900 transition-all duration-300"
              aria-label="Visit Shina Adedokun's Twitter profile"
            >
              <FontAwesomeIcon
                icon={faTwitter}
                className={`w-5 h-5 ${lightMode ? 'text-white' : 'text-gray-300'}`}
              />
            </a>
            <a
              href="https://www.linkedin.com/in/tripleaay?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-yellow-400 hover:text-gray-900 transition-all duration-300"
              aria-label="Visit Shina Adedokun's LinkedIn profile"
            >
              <FontAwesomeIcon
                icon={faLinkedinIn}
                className={`w-5 h-5 ${lightMode ? 'text-white' : 'text-gray-300'}`}
              />
            </a>
            <a
              href="https://wa.me/2349167740076"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-yellow-400 hover:text-gray-900 transition-all duration-300"
              aria-label="Contact Shina Adedokun via WhatsApp"
            >
              <FontAwesomeIcon
                icon={faWhatsapp}
                className={`w-5 h-5 ${lightMode ? 'text-white' : 'text-gray-300'}`}
              />
            </a>
            <a
              href="tel:+2349167740076"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-yellow-400 hover:text-gray-900 transition-all duration-300"
              aria-label="Call Shina Adedokun"
            >
              <FontAwesomeIcon
                icon={faPhone}
                className={`w-5 h-5 ${lightMode ? 'text-white' : 'text-gray-300'}`}
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
