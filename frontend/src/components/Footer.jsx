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
  const footerLinks = {
    "Popular Exams": [
      "JEE Main",
      "NEET UG",
      "CAT",
      "GATE",
      "CUET",
      "CLAT",
      "UPSC",
      "SSC CGL",
    ],
    "Top Colleges": [
      "Engineering Colleges",
      "Medical Colleges",
      "MBA Colleges",
      "Law Colleges",
      "Science Colleges",
      "Commerce Colleges",
    ],
    Resources: [
      "Exam Calendar",
      "Admit Cards",
      "Results",
      "Cutoff",
      "Answer Keys",
      "Previous Papers",
    ],
    "Quick Links": [
      "About Us",
      "Contact Us",
      "Careers",
      "Privacy Policy",
      "Terms of Use",
      "Advertise",
    ],
  };

  const socialLinks = [
    { icon: Facebook, label: "Facebook" },
    { icon: Twitter, label: "Twitter" },
    { icon: Instagram, label: "Instagram" },
    { icon: Linkedin, label: "LinkedIn" },
    { icon: Youtube, label: "YouTube" },
  ];

  return (
    <footer className="bg-[#1f2937] text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">
          
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold text-white">
                Exam<span className="text-orange-500">Prep360</span>
              </span>
            </div>

            <p className="text-gray-400 mb-6 max-w-sm text-sm leading-relaxed">
              Your complete guide to education in India. Explore exams,
              colleges, courses, and career opportunities.
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>info@examprep360.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>+91 1800-123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold mb-4 text-white text-sm">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-orange-400 transition-colors text-sm"
                    >
                      {link}
                    </a>
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
              © 2024 ExamPrep360. All rights reserved.
            </p>

            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href="#"
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
