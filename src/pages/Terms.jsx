import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
const Terms = () => {
  return (
    <div className="terms-page p-8">
      <h1 className="text-4xl font-bold text-red-600 mb-6">Privacy Policy & Terms and Conditions</h1>

      <section className="privacy-policy mb-12">
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">Privacy Policy</h2>
        <p className="text-gray-600 mb-4">
          <strong>Effective Date:</strong> [Insert Date]
        </p>
        <p className="text-gray-600 mb-4">
          Welcome to [HRIS Name]. This Privacy Policy outlines how we handle your personal data in compliance with applicable laws.
        </p>

        <h3 className="text-xl font-semibold text-red-600 mb-2">1. Information We Collect</h3>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>Personal Identifiable Information: Name, email address, phone number, etc.</li>
          <li>Employment Data: Job title, salary, department, etc.</li>
          <li>System Usage Data: Login times, device info, and IP address.</li>
        </ul>

        <h3 className="text-xl font-semibold text-red-600 mb-2">2. How We Use Your Data</h3>
        <p className="text-gray-600 mb-4">
          We use the data to provide and improve our HR services, including but not limited to payroll processing, attendance tracking, and employee evaluations.
        </p>

        <h3 className="text-xl font-semibold text-red-600 mb-2">3. Data Security</h3>
        <p className="text-gray-600 mb-4">
          We implement advanced security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
        </p>

        <h3 className="text-xl font-semibold text-red-600 mb-2">4. Data Sharing</h3>
        <p className="text-gray-600 mb-4">
          We do not sell your data. However, we may share data with trusted third-party services to perform essential functions (e.g., payroll providers, cloud storage).
        </p>

        <h3 className="text-xl font-semibold text-red-600 mb-2">5. Your Rights</h3>
        <p className="text-gray-600 mb-4">
          You have the right to access, update, or delete your personal data at any time. For any concerns, contact us at <a href="mailto:support@hris.com" className="text-red-600 underline">support@hris.com</a>.
        </p>
      </section>

      <section className="terms-conditions">
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">Terms and Conditions</h2>
        <p className="text-gray-600 mb-4">
          By using [HRIS Name], you agree to comply with the following terms and conditions.
        </p>

        <h3 className="text-xl font-semibold text-red-600 mb-2">1. Use of Service</h3>
        <p className="text-gray-600 mb-4">
          The services provided by [HRIS Name] are for employee management and related HR activities. Any misuse of the system may result in account suspension or legal action.
        </p>

        <h3 className="text-xl font-semibold text-red-600 mb-2">2. Account Responsibility</h3>
        <p className="text-gray-600 mb-4">
          Users are responsible for maintaining the confidentiality of their login credentials and are responsible for all activities under their account.
        </p>

        <h3 className="text-xl font-semibold text-red-600 mb-2">3. Termination</h3>
        <p className="text-gray-600 mb-4">
          We reserve the right to terminate or suspend accounts that violate our terms or engage in unlawful activities.
        </p>

        <h3 className="text-xl font-semibold text-red-600 mb-2">4. Limitation of Liability</h3>
        <p className="text-gray-600 mb-4">
          [HRIS Name] is not liable for any indirect, incidental, or consequential damages arising from the use or inability to use the system.
        </p>

        <h3 className="text-xl font-semibold text-red-600 mb-2">5. Changes to Terms</h3>
        <p className="text-gray-600 mb-4">
          We reserve the right to modify these Terms and Conditions at any time. Continued use of the service signifies acceptance of the updated terms.
        </p>
      </section>

      <footer className="mt-12 text-center">
        <p className="text-gray-600">&copy; [Insert Year] [HRIS Name]. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Terms;
