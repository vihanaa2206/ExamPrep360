export default function TermsOfUse() {
  const sections = [
    ["1. Acceptance of Terms","By accessing or using ExamPrep360, you agree to be bound by these Terms of Use. If you do not agree, please do not use our platform."],
    ["2. Use of Platform","ExamPrep360 is provided for educational and informational purposes only. You may not use our platform for any unlawful purpose or to harass or harm other users."],
    ["3. Accuracy of Information","While we strive to provide accurate information, always verify critical details from official sources (NTA, UPSC, SSC, college websites) before making decisions."],
    ["4. Intellectual Property","All content on ExamPrep360 is owned by ExamPrep360 or licensed to us. You may not reproduce or commercially exploit our content without written permission."],
    ["5. User Accounts","You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately of any unauthorized access to your account."],
    ["6. Limitation of Liability","ExamPrep360 shall not be liable for any indirect, incidental, or consequential damages arising from your use of our platform."],
    ["7. External Links","We are not responsible for the availability or accuracy of external websites linked from our platform."],
    ["8. Governing Law","These Terms shall be governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of courts in New Delhi."],
    ["9. Changes to Terms","We reserve the right to modify these Terms. Continued use of ExamPrep360 after changes constitutes acceptance."],
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-gray-800 to-slate-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">Terms of Use</h1>
          <p className="text-gray-300 text-sm">Last updated: March 2026</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 space-y-8">
          <p className="text-gray-600 text-sm leading-relaxed border-l-4 border-gray-500 pl-4">
            Please read these Terms of Use carefully before using ExamPrep360.
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
