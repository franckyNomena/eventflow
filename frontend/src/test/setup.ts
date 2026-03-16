import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Nettoyage automatique après chaque test
afterEach(() => {
  cleanup();
});
