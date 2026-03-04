import { describe, it, expect } from 'vitest';
import { sanitizeHtml } from '../sanitize';

describe('sanitizeHtml', () => {
  it('escapa tags HTML', () => {
    expect(sanitizeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
    );
  });

  it('escapa ampersands', () => {
    expect(sanitizeHtml('A & B')).toBe('A &amp; B');
  });

  it('escapa comillas simples', () => {
    expect(sanitizeHtml("it's")).toBe('it&#x27;s');
  });

  it('no modifica texto plano', () => {
    expect(sanitizeHtml('iPhone 15 Pro Max')).toBe('iPhone 15 Pro Max');
  });

  it('maneja string vacío', () => {
    expect(sanitizeHtml('')).toBe('');
  });

  it('escapa atributos de evento', () => {
    expect(sanitizeHtml('<img onerror="alert(1)">')).toBe(
      '&lt;img onerror=&quot;alert(1)&quot;&gt;',
    );
  });
});
