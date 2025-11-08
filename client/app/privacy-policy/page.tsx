'use client';
import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <Link href="/" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="prose prose-indigo max-w-none dark:prose-invert">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Introduction</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Welcome to JobHelper ("we," "our," or "us"). We are committed to protecting your personal data and your right to privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Data Controller</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              The data controller responsible for your personal data is JobHelper.
              For any questions regarding this Privacy Policy or your data, please contact us at: privacy@jobhelper.com
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-4">3.1 Personal Information</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-2">We collect the following personal data:</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li><strong>Account Information:</strong> Name, email address, password (encrypted)</li>
              <li><strong>Profile Information:</strong> Picture, given name, surname</li>
              <li><strong>CV/Resume Data:</strong> Personal details, education, employment history, skills, languages, hobbies</li>
              <li><strong>Quiz Results:</strong> Quiz scores and completion data</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-4">3.2 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Usage data and analytics</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Legal Basis for Processing (GDPR)</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">We process your personal data based on:</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li><strong>Consent:</strong> You have given clear consent for us to process your personal data for specific purposes</li>
              <li><strong>Contract:</strong> Processing is necessary for a contract we have with you</li>
              <li><strong>Legitimate Interests:</strong> Processing is necessary for our legitimate interests (e.g., improving our services)</li>
              <li><strong>Legal Obligation:</strong> Processing is necessary to comply with the law</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Create and manage your account</li>
              <li>Process and store your CV/resume data</li>
              <li>Generate AI-powered content and recommendations</li>
              <li>Track quiz results and learning progress</li>
              <li>Send administrative information and updates</li>
              <li>Analyze usage patterns to improve user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Data Sharing and Disclosure</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">We may share your information with:</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li><strong>Service Providers:</strong> Third-party services that help us operate (e.g., hosting, AI services)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              <strong>We do NOT sell your personal data to third parties.</strong>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Your GDPR Rights</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">Under GDPR, you have the following rights:</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li><strong>Right to Access:</strong> Request copies of your personal data</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data ("right to be forgotten")</li>
              <li><strong>Right to Restrict Processing:</strong> Request that we limit how we use your data</li>
              <li><strong>Right to Data Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Right to Object:</strong> Object to our processing of your personal data</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time (without affecting lawfulness of prior processing)</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              To exercise these rights, please contact us at privacy@jobhelper.com or use the account deletion feature in your settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Data Retention</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
              unless a longer retention period is required or permitted by law. When you delete your account, we permanently delete 
              all your personal data within 30 days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Data Security</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, 
              alteration, disclosure, or destruction. This includes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
              <li>Secure data storage and backups</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10. International Data Transfers</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Your data may be transferred to and processed in countries outside the European Economic Area (EEA). 
              We ensure appropriate safeguards are in place, such as Standard Contractual Clauses or adequacy decisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">11. Cookies and Tracking</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We use cookies and similar tracking technologies. You can manage your cookie preferences through our cookie consent banner. 
              For more information, see our Cookie Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">12. Children's Privacy</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our service is not intended for children under 16. We do not knowingly collect personal data from children under 16. 
              If you become aware that a child has provided us with personal data, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">13. Changes to This Policy</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy 
              on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">14. Contact Us</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300"><strong>Email:</strong> privacy@jobhelper.com</p>
              <p className="text-gray-700 dark:text-gray-300"><strong>Data Protection Officer:</strong> dpo@jobhelper.com</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">15. Supervisory Authority</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you are located in the EEA, you have the right to lodge a complaint with your local data protection supervisory authority 
              if you believe we have not complied with applicable data protection laws.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            © {new Date().getFullYear()} JobHelper. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
