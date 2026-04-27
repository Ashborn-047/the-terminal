const madge = require('madge');

madge('src/main.tsx').then((res) => {
	const circular = res.circular();
	if (circular.length) {
		console.log('Circular dependencies found:');
		console.log(circular);
	} else {
		console.log('No circular dependencies found.');
	}
});
