import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    'var(--font-inter)',
                    'var(--font-noto-sc)',
                    'var(--font-noto-jp)',
                    'var(--font-noto-kr)',
                    'PingFang SC',
                    'Microsoft YaHei',
                    'Hiragino Sans GB',
                    'Noto Sans CJK SC',
                    'sans-serif',
                ],
                mono: ['var(--font-geist-mono)', 'monospace'],
            },
            fontWeight: {
                normal: '400',
                medium: '500',
                semibold: '600',
                bold: '700',
            },
            spacing: {
                xs: 'var(--spacing-xs)',
                sm: 'var(--spacing-sm)',
                md: 'var(--spacing-md)',
                lg: 'var(--spacing-lg)',
                xl: 'var(--spacing-xl)',
                '2xl': 'var(--spacing-2xl)',
                '3xl': 'var(--spacing-3xl)',
            },
            maxWidth: {
                'container-sm': '640px',
                'container-md': '768px',
                'container-lg': '1024px',
                'container-xl': '1280px',
                'container-2xl': '1536px',
            },
            fontSize: {
                // Base sizes
                'xs': ['0.75rem', { lineHeight: '1rem' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem' }],
                'base': ['1rem', { lineHeight: '1.5rem' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
                '5xl': ['3rem', { lineHeight: '1.16' }],
                '6xl': ['3.75rem', { lineHeight: '1' }],
            },
            // Colors and border-radius are defined via @theme inline in globals.css
            // for Tailwind CSS v4 compatibility. Do not duplicate them here.
        },
    },
    plugins: [],
};

export default config;
