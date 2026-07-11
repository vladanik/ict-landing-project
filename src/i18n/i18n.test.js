import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import i18n, { changeLanguage, resolveInitialLanguage, resources } from './index';
import { LANGUAGE_COOKIE_NAME } from './languages';
import Header from '../components/Header';
import ContactForm from '../components/ContactForm';
import SEO from '../components/SEO';
import Legal from '../components/Legal';

jest.mock('emailjs-com', () => ({
  sendForm: jest.fn(),
}));

jest.mock(
  'react-markdown',
  () =>
    function ReactMarkdownMock({ children }) {
      return <div>{children}</div>;
    }
);

const flattenKeys = (value, prefix = '') =>
  Object.entries(value).flatMap(([key, child]) => {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === 'object' && !Array.isArray(child)) {
      return flattenKeys(child, nextPrefix);
    }
    return nextPrefix;
  });

beforeEach(async () => {
  document.cookie = `${LANGUAGE_COOKIE_NAME}=; Max-Age=0; path=/`;
  await act(async () => changeLanguage('en'));
});

test('resolves language deterministically', () => {
  expect(resolveInitialLanguage({ cookieValue: 'pl', navigatorLanguages: ['en-US'] })).toBe('pl');
  expect(resolveInitialLanguage({ cookieValue: 'de', navigatorLanguages: ['ru-RU'] })).toBe('ru');
  expect(resolveInitialLanguage({ cookieValue: '', navigatorLanguages: ['ua'] })).toBe('uk');
  expect(resolveInitialLanguage({ cookieValue: '', navigatorLanguages: ['de-DE'] })).toBe('en');
});

test('all locale resources have matching key structures', () => {
  const englishNamespaces = resources.en;

  Object.entries(resources).forEach(([language, namespaces]) => {
    Object.entries(englishNamespaces).forEach(([namespace, englishResource]) => {
      expect(flattenKeys(namespaces[namespace]).sort()).toEqual(
        flattenKeys(englishResource).sort()
      );
    });
    expect(language).toMatch(/en|pl|ru|uk/);
  });
});

test('language switcher displays UA for Ukrainian and updates header labels', async () => {
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );

  expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /select language/i }));
  });
  expect(screen.getByRole('menuitemradio', { name: /UA Українська/i })).toBeInTheDocument();
  await act(async () => {
    fireEvent.click(screen.getByRole('menuitemradio', { name: /PL Polski/i }));
  });

  await waitFor(() => expect(i18n.resolvedLanguage).toBe('pl'));
  expect(document.cookie).toContain(`${LANGUAGE_COOKIE_NAME}=pl`);
  expect(screen.getByRole('link', { name: 'O nas' })).toBeInTheDocument();
});

test('contact form keeps entered values and stores stable option IDs after language changes', async () => {
  render(<ContactForm />);

  await act(async () => {
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ada' } });
    fireEvent.click(screen.getByRole('button', { name: 'Other' }));
  });

  await act(async () => changeLanguage('pl'));

  expect(screen.getByLabelText('Imię i nazwisko')).toHaveValue('Ada');
  expect(document.querySelector('input[name="selectedServicesJson"]')).toHaveValue('["other"]');
  expect(screen.getByRole('button', { name: 'Inne' })).toHaveAttribute('aria-pressed', 'true');
});

test('SEO updates document metadata and replaces alternate locales', async () => {
  const { rerender } = render(
    <SEO title="English title" description="English description" canonicalPath="/" />
  );

  expect(document.title).toBe('English title');
  expect(document.documentElement.lang).toBe('en');
  expect(document.head.querySelector('meta[property="og:locale"]')).toHaveAttribute(
    'content',
    'en_GB'
  );
  expect(document.head.querySelectorAll('meta[property="og:locale:alternate"]')).toHaveLength(3);

  await act(async () => changeLanguage('uk'));
  rerender(<SEO title="Український заголовок" description="Український опис" canonicalPath="/" />);

  expect(document.title).toBe('Український заголовок');
  expect(document.documentElement.lang).toBe('uk');
  expect(document.head.querySelector('meta[property="og:locale"]')).toHaveAttribute(
    'content',
    'uk_UA'
  );
  expect(document.head.querySelectorAll('meta[property="og:locale:alternate"]')).toHaveLength(3);
});

test('legal page loads active language and falls back to English', async () => {
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({ ok: true, text: () => Promise.resolve('Polityka !!!Treść') })
    .mockResolvedValueOnce({ ok: false, text: () => Promise.resolve('') })
    .mockResolvedValueOnce({ ok: true, text: () => Promise.resolve('Policy !!!Content') });

  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  await act(async () => changeLanguage('pl'));
  const { unmount } = render(<Legal />);

  await screen.findByText('Polityka');
  expect(global.fetch).toHaveBeenCalledWith('/legal/pl.txt', expect.any(Object));

  unmount();
  await act(async () => changeLanguage('ru'));
  render(<Legal />);

  await screen.findByText('Policy');
  expect(global.fetch).toHaveBeenCalledWith('/legal/ru.txt', expect.any(Object));
  expect(global.fetch).toHaveBeenCalledWith('/legal/en.txt', expect.any(Object));
  consoleErrorSpy.mockRestore();
});
