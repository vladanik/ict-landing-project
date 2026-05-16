import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('@vercel/analytics/react', () => ({
  Analytics: () => null,
}), { virtual: true });

jest.mock('react-markdown', () => function ReactMarkdownMock({ children }) {
  return <div>{children}</div>;
});

const appData = {
  about: {},
  projects: {
    projects: [],
    workWith: [],
  },
  services: [],
  contact: {
    github: {
      name: '/ict',
      link: 'https://github.com/ict',
    },
    linkedin: {
      name: '/ict',
      link: 'https://www.linkedin.com/company/ict',
    },
    email: {
      name: 'ict@example.com',
      link: 'mailto:ict@example.com',
    },
    telegram: {
      name: '@ict',
      link: 'https://t.me/ict',
    },
  },
  contactForm: {
    callerTypes: ['Business Client'],
    contactCategories: ['Service Request'],
  },
};

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue({ data: appData }),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders ICT home page after loading site data', async () => {
  render(<App />);

  expect(await screen.findByText(/DELIVERING_RESULTS/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /view services/i })).toBeInTheDocument();
});
