export const CONTACT_FORM_SERVICE_OPTIONS = [
  { id: 'salesforceDevelopment', submissionValue: 'Salesforce Development' },
  { id: 'salesforceB2BCommerce', submissionValue: 'Salesforce B2B Commerce' },
  { id: 'frontendDevelopment', submissionValue: 'Frontend Development' },
  { id: 'backendDevelopment', submissionValue: 'Backend Development' },
  { id: 'apiIntegrations', submissionValue: 'API Integrations' },
  { id: 'technicalSupport', submissionValue: 'Technical Support' },
  { id: 'websiteDevelopment', submissionValue: 'Website Development' },
  { id: 'aiAutomation', submissionValue: 'AI / Automation' },
  { id: 'other', submissionValue: 'Other' },
];

export const TIMELINE_OPTIONS = [
  { id: 'asap', submissionValue: 'ASAP' },
  { id: 'withinOneMonth', submissionValue: 'Within 1 month' },
  { id: 'oneToThreeMonths', submissionValue: '1-3 months' },
  { id: 'flexiblePlanning', submissionValue: 'Flexible / planning stage' },
];

export const COLLABORATION_OPTIONS = [
  { id: 'oneTimeProject', submissionValue: 'One-time project' },
  { id: 'longTermCollaboration', submissionValue: 'Long-term collaboration' },
  { id: 'maintenanceSupport', submissionValue: 'Maintenance & support' },
  { id: 'notSure', submissionValue: 'Not sure yet' },
];

export const BUDGET_OPTIONS = [
  { id: 'under1k', submissionValue: 'Under €1k' },
  { id: 'eur1k5k', submissionValue: '€1k-5k' },
  { id: 'eur5k15k', submissionValue: '€5k-15k' },
  { id: 'eur15kPlus', submissionValue: '€15k+' },
  { id: 'notSure', submissionValue: 'Not sure yet' },
];

export const CONTACT_METHOD_OPTIONS = [
  { id: 'email', submissionValue: 'Email', requiresPhone: false },
  { id: 'phone', submissionValue: 'Phone', requiresPhone: true },
  { id: 'videoCall', submissionValue: 'Video call', requiresPhone: true },
];

export const getSubmissionValue = (options, id) =>
  options.find((option) => option.id === id)?.submissionValue || '';

export const getSubmissionValues = (options, ids) =>
  ids.map((id) => getSubmissionValue(options, id)).filter(Boolean);
