/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

/**
 * Renders a custom SVG icon for the Justy Assistant button, symbolizing "intelligent justice".
 * The icon is designed to look like a stylized brain or circuit.
 */
export default function JustyButtonIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
        <path d="M12 20.5v-3.5"/>
        <path d="M9.5 17a2.5 2.5 0 0 1 5 0"/>
        <path d="M12 14.5a2.5 2.5 0 0 0-2.5 2.5"/>
        <path d="M12 14.5a2.5 2.5 0 0 1 2.5 2.5"/>
        <path d="M15 11.5a2.5 2.5 0 0 0 2.5-2.5V8a2.5 2.5 0 0 0-5 0v1a2.5 2.5 0 0 0 2.5 2.5Z"/>
        <path d="M9 11.5a2.5 2.5 0 0 1-2.5-2.5V8a2.5 2.5 0 0 1 5 0v1a2.5 2.5 0 0 1-2.5 2.5Z"/>
        <path d="M12 8V6.5a2.5 2.5 0 0 0-5 0V8"/>
        <path d="M12 8V6.5a2.5 2.5 0 0 1 5 0V8"/>
    </svg>
  );
}