// @ts-check
import { defineConfig } from 'astro/config'

import cloudflare from '@astrojs/cloudflare'

import tailwindcss from '@tailwindcss/vite'

import react from '@astrojs/react'

// Detect CI environment for conditional configuration
const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true'

// https://astro.build/config
export default defineConfig({
	// Conditional adapter: static for GitHub Pages in CI, Cloudflare for local/production
	...(isCI
		? {
				// Static build for GitHub Pages
				output: 'static',
				site: 'https://jubalm.github.io',
				base: '/augur-fork-meter',
			}
		: {
				// Cloudflare adapter for local development and production deploys
				adapter: cloudflare({
					platformProxy: {
						enabled: true,
					},
					imageService: 'cloudflare',
				}),
			}),

	vite: {
		plugins: [tailwindcss()],
	},

	integrations: [react()],
})
