/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import 'immer'
import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'
import {createSelectorFunctions} from 'auto-zustand-selectors-hook'
import modes from './modes'

const initialMainCategoryKey = 'direitoBrasileiroPrivado';
const initialLegalArea = Object.keys(modes[initialMainCategoryKey].areas)[0];
const initialDocumentTypeKey = Object.keys(modes[initialMainCategoryKey].areas[initialLegalArea].documents)[0];

export const initialState = {
  didInit: false,
  // Navigation State
  currentView: 'landing', // 'home', 'recent', 'folders', 'templates', 'landing'
  
  feed: [],
  mainCategoryKey: initialMainCategoryKey,
  legalArea: initialLegalArea,
  documentTypeKey: initialDocumentTypeKey,
  analysisTypeKey: 'none',
  caseFiles: [],
  parties: [],
  links: [], // New state for reference links
  caseInfo: '',
  model: 'flash',
  temperature: 0.5,
  searchJurisprudence: false,
  
  // Database / Folders State
  folders: [],
  
  // State for notifications
  notifications: [],
  
  // State for Process Search
  processNumberInput: '',
  isProcessSearching: false,
  processSearchError: null,
  processSearchResult: null,
  processSearchTribunal: 'stj',

  // State for CNPJ Verifier
  cnpjInput: '',
  isCnpjVerifying: false,
  cnpjError: null,
  cnpjData: null,
  cnpjQueryType: 'basica',

  // Auth & Access State
  user: null,
  isAuthReady: false,
  isAdmin: false,
};

const store = create(immer(() => initialState));
store.initialState = initialState;

export default createSelectorFunctions(store);