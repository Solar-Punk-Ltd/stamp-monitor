export default {
  '**/*.{ts,js,json}': stagedFiles => [
    `eslint .`,
    `prettier --write ${stagedFiles.join(' ')}`,
    'tsc --noEmit',
  ],
}
