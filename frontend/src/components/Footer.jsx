import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {

  const popularExams = [
    { label: "JEE Main",  path: "/exam/jee-main" },
    { label: "NEET UG",   path: "/exam/neet-ug" },
    { label: "CAT",       path: "/exam/cat" },
    { label: "GATE",      path: "/exam/gate-cs" },
    { label: "CUET",      path: "/exam/cuet-pg" },
    { label: "CLAT",      path: "/exam/clat" },
    { label: "UPSC",      path: "/exam/upsc" },
    { label: "SSC CGL",   path: "/exam/ssc-cgl" },
  ];

  const topColleges = [
    { label: "Engineering Colleges", path: "/colleges?category=Engineering" },
    { label: "Medical Colleges",     path: "/colleges?category=Medical" },
    { label: "Law Colleges",         path: "/colleges?category=Law" },
    { label: "Computer Science Colleges",     path: "/colleges?category=Computer Science" },
    { label: "Commerce Colleges",    path: "/colleges?category=Government" },
  ];

  const resources = [
    { label: "Exam Calendar",   path: "/resources/exam-calendar" },
    { label: "Previous Papers", path: "/resources/previous-papers" },
  ];

  const quickLinks = [
    { label: "About Us",       path: "/about" },
    { label: "Contact Us",     path: "/contact" },
    { label: "Careers",        path: "/careers" },
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Terms of Use",   path: "/terms-of-use" },
    { label: "Advertise",      path: "/advertise" },
  ];

  const socialLinks = [
    { icon: Facebook,  label: "Facebook",  href: "https://facebook.com" },
    { icon: Twitter,   label: "Twitter",   href: "https://twitter.com" },
    { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
    { icon: Linkedin,  label: "LinkedIn",  href: "https://linkedin.com" },
    { icon: Youtube,   label: "YouTube",   href: "https://youtube.com" },
  ];

  const footerSections = [
    { title: "Popular Exams", links: popularExams },
    { title: "Top Colleges",  links: topColleges },
    { title: "Resources",     links: resources },
    { title: "Quick Links",   links: quickLinks },
  ];

  return (
    <footer className="bg-[#1f2937] text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold text-white">
                Exam<span className="text-orange-500">Prep360</span>
              </span>
            </Link>

            <p className="text-gray-400 mb-6 max-w-sm text-sm leading-relaxed">
              Your complete guide to education in India. Explore exams,
              colleges, courses, and career opportunities.
            </p>

            <div className="space-y-3 text-sm">
              <a href="mailto:info@examprep360.com"
                className="flex items-center gap-3 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>info@examprep360.com</span>
              </a>
              <a href="tel:+911800123456"
                className="flex items-center gap-3 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>+91 1800-123-4567</span>
              </a>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>

          {/* All 4 link sections */}
          {footerSections.map(({ title, links }) => (
            <div key={title}>
              <h3 className="font-semibold mb-4 text-white text-sm">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-orange-400 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} ExamPrep360. All rights reserved.
            </p>

            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center
                             hover:bg-blue-600 transition-colors"
                >
                  <social.icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

