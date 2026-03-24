/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

/**
 * Renders the application's logo, a stylized representation of the scales of justice.
 * This logo is designed to be clean, modern, and use the application's primary color theme.
 */
export default function Logo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="logo-svg"
    >
      <path d="M12 3V21"></path>
      <path d="M3 6H21"></path>
      <path d="M6 10L3.5 16.5C3.16667 17.5 3.5 18.5 4.5 18.5H9.5C10.5 18.5 10.8333 17.5 10.5 16.5L8 10H6Z"></path>
      <path d="M18 10L15.5 16.5C15.1667 17.5 15.5 18.5 16.5 18.5H21.5C22.5 18.5 22.8333 17.5 22.5 16.5L20 10H18Z"></path>
    </svg>
  );
}