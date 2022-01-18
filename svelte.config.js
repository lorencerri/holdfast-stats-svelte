import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte'
	},
	vite: {
		ssr: {
			noExternal: ['svelte-hero-icons']
		}
	},
	preprocess: [preprocess({})]
};

export default config;
