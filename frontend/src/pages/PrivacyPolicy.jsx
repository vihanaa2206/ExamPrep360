export default function PrivacyPolicy() {
  const sections = [
    ["1. Information We Collect","We collect information you provide when registering on ExamPrep360, including your name, email address, phone number, and academic details. We also collect usage data such as pages visited, searches performed, and interactions with content on our platform."],
    ["2. How We Use Your Information","We use collected information to provide and improve our services, send you exam notifications and updates, personalize your experience, respond to your queries, and send promotional communications (which you can opt out of at any time)."],
    ["3. Data Sharing","We do not sell your personal information to third parties. We may share data with trusted partners who help us operate our platform, subject to confidentiality agreements. We may disclose information if required by law."],
    ["4. Cookies","We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser."],
    ["5. Data Security","We implement industry-standard security measures including SSL encryption, secure servers, and regular security audits to protect your personal information from unauthorized access."],
    ["6. Your Rights","You have the right to access, update, or delete your personal information at any time. Contact us at privacy@examprep360.com to exercise your data rights."],
    ["7. Third-Party Links","Our platform contains links to official exam portals. We are not responsible for the privacy practices of external websites."],
    ["8. Changes to This Policy","We may update this Privacy Policy. We will notify registered users of significant changes via email."],
    ["9. Contact Us","For privacy queries: privacy@examprep360.com | ExamPrep360, 123 Connaught Place, New Delhi — 110001."],
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-slate-700 to-gray-800 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">Privacy Policy</h1>
          <p className="text-gray-300 text-sm">Last updated: March 2026</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 space-y-8">
          <p className="text-gray-600 text-sm leading-relaxed border-l-4 border-blue-500 pl-4">
            At ExamPrep360, we are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your data.
          </p>
          {sections.map(([title, content]) => (
            <div key={title}>
              <h2 className="text-base font-bold text-gray-900 mb-2">{title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

