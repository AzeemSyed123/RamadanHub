'use client';

import { useState } from 'react';

export default function WorkplaceRights() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center text-left"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          ⚖️ Know Your Workplace Rights
        </h3>
        <span className="text-2xl text-gray-600 dark:text-gray-400">
          {isExpanded ? '−' : '+'}
        </span>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4 text-gray-700 dark:text-gray-300">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Title VII of the Civil Rights Act
            </h4>
            <p className="text-sm">
              Under federal law, employers must reasonably accommodate employees&apos; religious beliefs
              and practices unless doing so would cause undue hardship to the business.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Your Rights During Ramadan
            </h4>
            <ul className="text-sm space-y-2 list-disc list-inside">
              <li>Request flexible scheduling for prayer times (approximately 5-10 minutes per prayer)</li>
              <li>Request break time adjustments to accommodate fasting</li>
              <li>Request time off for Eid celebrations</li>
              <li>Protection from discrimination based on religious practice</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              How to Request Accommodations
            </h4>
            <ol className="text-sm space-y-2 list-decimal list-inside">
              <li>Submit a written request to your supervisor or HR department</li>
              <li>Explain your religious needs clearly and specifically</li>
              <li>Suggest reasonable solutions that work for both parties</li>
              <li>Keep copies of all correspondence</li>
            </ol>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
              Need Help?
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
              If you believe your rights have been violated, contact:
            </p>
            <div className="space-y-1 text-sm">
              <p>
                <strong>EEOC (Equal Employment Opportunity Commission)</strong>
              </p>
              <p>Phone: 1-800-669-4000</p>
              <p>Website: <a href="https://www.eeoc.gov" target="_blank" rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline">www.eeoc.gov</a></p>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg">
            <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">
              💡 Pro Tips
            </h4>
            <ul className="text-sm space-y-1 text-amber-800 dark:text-amber-300 list-disc list-inside">
              <li>Start conversations early, before Ramadan begins</li>
              <li>Be flexible and willing to compromise</li>
              <li>Educate your colleagues about Ramadan respectfully</li>
              <li>Document all agreements in writing</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
