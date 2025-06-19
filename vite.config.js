import path from 'node:path';
import react from '@vitejs/plugin-react';
import { createLogger, defineConfig } from 'vite';

const isDev = process.env.NODE_ENV !== 'production';

let inlineEditPlugin = () => ({ name: 'noop-inline-edit' });
let editModeDevPlugin = () => ({ name: 'noop-edit-mode' });

try {
	if (isDev) {
		inlineEditPlugin = require('./plugins/visual-editor/vite-plugin-react-inline-editor.js').default;
		editModeDevPlugin = require('./plugins/visual-editor/vite-plugin-edit-mode.js').default;
	}
} catch (e) {
	console.warn('Editor plugins no disponibles en producción o entorno sin archivos.');
}

const configHorizonsViteErrorHandler = `...`; // puedes mantener tu bloque original aquí
const configHorizonsRuntimeErrorHandler = `...`; // igual aquí
const configHorizonsConsoleErrroHandler = `...`;
const configWindowFetchMonkeyPatch = `...`;

// Todo el código de manejo de errores visuales, igual que antes:
const addTransformIndexHtml = {
	name: 'add-transform-index-html',
	transformIndexHtml(html) {
		return {
			html,
			tags: [
				{
					tag: 'script',
					attrs: { type: 'module' },
					children: configHorizonsRuntimeErrorHandler,
					injectTo: 'head',
				},
				{
					tag: 'script',
					attrs: { type: 'module' },
					children: configHorizonsViteErrorHandler,
					injectTo: 'head',
				},
				{
					tag: 'script',
					attrs: { type: 'module' },
					children: configHorizonsConsoleErrroHandler,
					injectTo: 'head',
				},
				{
					tag: 'script',
					attrs: { type: 'module' },
					children: configWindowFetchMonkeyPatch,
					injectTo: 'head',
				},
			],
		};
	},
};

console.warn = () => {};

const logger = createLogger();
const loggerError = logger.error;
logger.error = (msg, options) => {
	if (options?.error?.toString().includes('CssSyntaxError: [postcss]')) {
		return;
	}
	loggerError(msg, options);
};

export default defineConfig({
	customLogger: logger,
	plugins: [
		...(isDev ? [inlineEditPlugin(), editModeDevPlugin()] : []),
		react(),
		addTransformIndexHtml
	],
	server: {
		cors: true,
		headers: {
			'Cross-Origin-Embedder-Policy': 'credentialless',
		},
		allowedHosts: true,
	},
	resolve: {
		extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	build: {
		rollupOptions: {
			external: [
				'@babel/parser',
				'@babel/traverse',
				'@babel/generator',
				'@babel/types',
			],
		},
	},
});
