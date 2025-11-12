export default {
  preload: ['./packages/api/src/__tests__/setup.ts'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  coverage: {
    enabled: true,
    reporter: ['text', 'html'],
    exclude: [
      'node_modules/**',
      '**/*.config.ts',
      '**/*.d.ts',
      '**/dist/**',
    ],
  },
}
