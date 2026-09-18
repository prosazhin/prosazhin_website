// Оценки по компетенциям (1–4). Ключи соответствуют id в i18n/locales/*/matrix.json.
const matrix = {
  designer: {
    // Общие навыки
    'analytical-and-creative-thinking': 4,
    'facilitation-of-meetings-brainstorming-sessions-critiques': 3,
    'communication-and-teamwork': 3,
    'stakeholder-management-and-presenting-solutions': 3,
    mentoring: 3,
    // Аналитика
    'understanding-of-the-domain-and-the-market': 3,
    'identification-and-tracking-of-interface-and-product-metrics': 3,
    'developing-and-validating-product-hypotheses': 3,
    'statistics-analysis-and-visualization-of-large-volumes-of-data': 3,
    // Пользовательские исследования
    'understanding-and-describing-users-personas-scenarios-customer-journey-maps-etc': 2,
    'insight-and-needs-discovery': 2,
    'validation-of-design-solutions': 3,
    // Информационная архитектура и проектирование
    'designing-structure-and-navigation': 4,
    'designing-interface-screens-and-their-interactive-prototypes': 4,
    'designing-interaction-outside-the-interface-service-design': 2,
    'description-of-interface-working-principles-and-patterns': 4,
    'accessibility-design': 3,
    // Визуальный дизайн
    'basic-skills-composition-and-grids-typography-color-theory': 3,
    'iconography-and-illustrations': 2,
    'interface-animation-and-motion-design': 3,
    'design-systems-and-tokens': 4,
    'creating-guidelines': 4,
    'data-visualization': 4,
    'identity-and-branding': 2,
    // Design engineering
    'layout-html-css-javascript-and-interface-animation': 4,
    'prototyping-in-code': 4,
    'developer-handoff-and-documentation': 4,
    'working-with-data-sources': 4,
    'setting-up-a-working-environment-for-testing-and-launching-services': 4,
    'optimization-performance-cross-browser-compatibility-etc': 4,
    // Контент-стратегия и копирайтинг
    'micro-copywriting': 3,
    'building-content-strategy-and-planning': 2,
    // Обеспечение качества
    'expert-evaluation': 4,
    'formal-quality-testing': 2,
    // Маркетинг и PR
    'publications-and-presentations': 2,
    'search-engine-optimization-seo': 4,
    // Управление проектами и продуктами
    'project-planning': 4,
    'team-organization': 3,
    'building-ux-strategy': 3,
    'product-thinking-and-business-models': 3,
    'prioritization-and-design-roi': 3,
    // ИИ в дизайне
    'ai-assisted-design-workflow': 4,
    'prompt-engineering-and-prompt-to-prototype': 4,
    'evaluating-and-curating-ai-output': 4,
    'designing-ai-products': 3,
    'design-process-automation': 4,
    'ethical-and-responsible-ai': 2,
  },
  developer: {
    // Базовые знания
    'analytics-services': 4,
    'authorization-and-authentication': 3,
    algorithms: 2,
    'basics-of-unix': 3,
    docker: 3,
    'chrome-devtools': 3,
    // Интернет
    'hosting-services': 3,
    dns: 3,
    ssh: 3,
    'http-protocol': 3,
    cors: 3,
    // HTML
    'html-basics': 4,
    'semantic-html': 4,
    'forms-and-validation': 4,
    accessibility: 3,
    seo: 4,
    // CSS
    'css-basics': 4,
    'making-layouts': 4,
    'responsive-design': 4,
    'tailwind-css': 4,
    less: 3,
    scss: 3,
    postcss: 3,
    bem: 3,
    'css-modules': 3,
    'css-in-js': 3,
    // JavaScript
    'js-basics': 4,
    dom: 3,
    'http-clients-and-error-handling': 3,
    typescript: 4,
    // Frameworks
    react: 4,
    next: 4,
    vue: 3,
    nuxt: 3,
    'svelte-sveltekit': 1,
    astro: 1,
    angular: 1,
    'web-components': 1,
    // Архитектура приложений
    'state-management': 4,
    'data-fetching-and-caching': 2,
    'routing-and-url-state': 4,
    'ui-states-loading-error-empty': 4,
    'error-handling-and-monitoring': 3,
    i18n: 4,
    'tables-and-charts': 4,
    // Рендеринг
    'ssr-ssg-isr': 4,
    'react-server-components': 3,
    'streaming-and-edge': 2,
    // Производительность
    'core-web-vitals': 4,
    'code-splitting-and-lazy-loading': 3,
    'assets-optimization': 4,
    'render-profiling': 3,
    'caching-strategies': 3,
    // Безопасность
    'xss-and-csrf': 3,
    csp: 1,
    'tokens-storage-and-sessions': 3,
    'dependencies-and-supply-chain': 2,
    // Дизайн-системы в коде
    storybook: 3,
    'component-api-design': 4,
    'design-tokens-in-code': 4,
    'npm-packages-publishing': 4,
    // VCS
    git: 4,
    github: 4,
    gitlab: 3,
    // Пакетные менеджеры и монорепо
    npm: 4,
    pnpm: 2,
    bun: 2,
    'monorepo-turborepo': 3,
    // Инструменты сборки и качество кода
    eslint: 4,
    prettier: 4,
    vite: 3,
    webpack: 3,
    rollup: 3,
    'git-hooks-and-commit-conventions': 4,
    'ci-cd': 3,
    // Тестирование
    'unit-testing': 3,
    'component-testing': 3,
    'e2e-testing': 1,
    'visual-regression-testing': 1,
    // Web API
    'service-workers': 2,
    'web-workers': 1,
    'local-session-storage': 4,
    indexeddb: 1,
    pwa: 2,
    'websockets-and-sse': 2,
    'intersection-and-resize-observer': 3,
    'view-transitions': 1,
    'browser-extensions': 3,
    // Бэкенд и интеграции
    'nodejs-api-routes-bff': 3,
    'headless-cms': 4,
    'databases-and-redis-basics': 2,
    'telegram-bots': 3,
    // ИИ в разработке
    'ai-assisted-development': 4,
    'context-engineering': 4,
    'ai-code-review-and-verification': 3,
    'building-ai-features': 3,
    'evaluating-ai-features': 2,
  },
};

export default matrix;
