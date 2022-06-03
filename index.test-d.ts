import {type Transform as TransformStream} from 'node:stream';
import {expectType} from 'tsd';
import transformStream from './index.js';

expectType<TransformStream>(transformStream(async chunk => chunk));

transformStream({objectMode: true}, async chunk => chunk);

transformStream(async () => {}, async function * () { // eslint-disable-line @typescript-eslint/no-empty-function
	yield 'x';
});
