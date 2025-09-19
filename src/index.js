/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx) {
		try {
			const url = new URL(request.url);

			// ここで、favicon.icoを読み込んでしまうとリクエストが2回ある事になってしまい、counterが2回増えてしまう
			if (url.pathname === '/favicon.ico') {
				return
			};

			let counter = await env.ACCESS_COUNTER.get("counter");
			counter = Number(counter);

			if (counter === null) {
				return new Response("Counter not found", { status: 404 })
			};

			counter = counter + 1;

			const welcomeMessage = `${counter}回目のお客さんです！`;

			await env.ACCESS_COUNTER.put("counter", `${counter.toString()}`);

			return new Response(welcomeMessage);
		} catch (err) {
			console.error(`KV returned error:`, err);
			const errorMessage =
				err instanceof Error
					? err.message
					: "An unknown error occurred when accessing KV storage";
			return new Response(errorMessage, {
				status: 500,
				headers: { "Content-type": "text/plain" },
			});
		}
	},
};
