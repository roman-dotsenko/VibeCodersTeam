'use client';
import React from 'react';
import Link from 'next/link';

export default function TermsOfServicePage() {
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
          Terms of Service
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="prose prose-indigo max-w-none dark:prose-invert">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              By accessing and using JobHelper ("the Service"), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Description of Service</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              JobHelper provides tools for creating and managing resumes, taking skill assessment quizzes, 
              and leveraging AI-powered features to enhance your job search experience.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. User Accounts</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-4">3.1 Account Creation</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-2">You must:</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Be at least 16 years old to create an account</li>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Not share your account with others</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-4">3.2 Account Responsibilities</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You are responsible for all activities that occur under your account. 
              Notify us immediately of any unauthorized use.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Acceptable Use</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-4">4.1 Permitted Use</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You may use the Service for lawful purposes related to job searching and career development.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-4">4.2 Prohibited Activities</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-2">You must NOT:</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Use the Service for illegal purposes</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Submit false or misleading information</li>
              <li>Upload malicious code or viruses</li>
              <li>Scrape, spider, or crawl the Service</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. User Content</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-4">5.1 Your Content</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You retain ownership of all content you submit (resumes, personal information, etc.). 
              By using our Service, you grant us a license to use, store, and process your content 
              to provide and improve our services.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-4">5.2 Content Standards</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              All content must be accurate, lawful, and not infringe on any third-party rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. AI-Generated Content</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our Service uses AI to generate quizzes and parse CV information. While we strive for accuracy:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>AI-generated content may contain errors or inaccuracies</li>
              <li>You should review and verify all AI-generated content</li>
              <li>We are not liable for decisions made based on AI output</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Intellectual Property</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-4">7.1 Our Rights</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              All rights, title, and interest in the Service (excluding your content) are owned by JobHelper. 
              This includes our software, design, trademarks, and documentation.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-4">7.2 License to Use</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We grant you a limited, non-exclusive, non-transferable license to use the Service 
              for personal, non-commercial purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Privacy and Data Protection</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Your use of the Service is also governed by our Privacy Policy. We comply with GDPR and other 
              applicable data protection laws. Please review our{' '}
              <Link href="/privacy-policy" className="text-indigo-600 hover:text-indigo-700 underline">
                Privacy Policy
              </Link>{' '}
              for details on how we collect and use your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Service Availability</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We strive to maintain high availability but do not guarantee uninterrupted access. 
              We may suspend or terminate the Service for maintenance or other reasons without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10. Termination</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-4">10.1 By You</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You may delete your account at any time through the settings page. 
              Upon deletion, all your data will be permanently removed within 30 days.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-4">10.2 By Us</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We may suspend or terminate your account if you violate these Terms or engage in harmful activities. 
              We will provide notice when reasonably possible.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">11. Disclaimers</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4 uppercase font-semibold">
              The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We disclaim all warranties, express or implied, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Merchantability or fitness for a particular purpose</li>
              <li>Accuracy, reliability, or completeness of content</li>
              <li>Uninterrupted or error-free operation</li>
              <li>Security or freedom from viruses</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">12. Limitation of Liability</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4 uppercase font-semibold">
              To the maximum extent permitted by law, JobHelper shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              This includes damages for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Loss of profits, data, or business opportunities</li>
              <li>Service interruptions or errors</li>
              <li>Decisions made based on Service content</li>
              <li>Unauthorized access to your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">13. Indemnification</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You agree to indemnify and hold harmless JobHelper from any claims, damages, losses, 
              or expenses arising from:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Content you submit to the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">14. Governing Law</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              These Terms are governed by and construed in accordance with applicable laws. 
              Any disputes shall be resolved in the appropriate courts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">15. Dispute Resolution</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              In the event of a dispute, we encourage you to contact us first at support@jobhelper.com 
              to seek an informal resolution.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">16. Changes to Terms</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We may update these Terms from time to time. Material changes will be notified via email 
              or a prominent notice on our website. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">17. Severability</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If any provision of these Terms is found to be unenforceable, the remaining provisions 
              will continue in full force and effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">18. Entire Agreement</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you 
              and JobHelper regarding the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">19. Contact Information</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              For questions about these Terms, please contact us:
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300"><strong>Email:</strong> legal@jobhelper.com</p>
              <p className="text-gray-700 dark:text-gray-300"><strong>Support:</strong> support@jobhelper.com</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">20. Acknowledgment</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              By using JobHelper, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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
