import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock(
  '@vercel/analytics/react',
  () => ({
    Analytics: () => null,
  }),
  { virtual: true }
);

jest.mock(
  '@vercel/speed-insights/react',
  () => ({
    SpeedInsights: () => null,
  }),
  { virtual: true }
);

jest.mock(
  'react-markdown',
  () =>
    function ReactMarkdownMock({ children }) {
      return <div>{children}</div>;
    }
);

const appData = {
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
};

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue(appData),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders ICT home page after loading site data', async () => {
  render(<App />);

  expect(
    await screen.findByRole('heading', { name: /Salesforce & Full-Stack Development/i })
  ).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /View Services/i })).toBeInTheDocument();
});
