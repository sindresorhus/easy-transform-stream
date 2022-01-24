import {promisify} from 'node:util';
import {Readable as ReadableStream, PassThrough as PassThroughStream, pipeline} from 'node:stream';
import test from 'ava';
import delay from 'delay';
import getStream from 'get-stream';
import transformStream from './index.js';

const pipelinePromise = promisify(pipeline);

test('transform', async t => {
	const sourceStream = ReadableStream.from([...'abc']);
	const destinationStream = new PassThroughStream();

	sourceStream.setEncoding('utf8');

	let callCount = 0;

	await pipelinePromise(
		sourceStream,
		transformStream({decodeStrings: false}, async chunk => {
			callCount++;
			await delay(200);
			return chunk.toUpperCase();
		}),
		destinationStream,
	);

	t.is(callCount, 3);
	t.is(await getStream(destinationStream), 'ABC');
});

test('flush', async t => {
	const sourceStream = ReadableStream.from([...'abc']);
	const destinationStream = new PassThroughStream();

	sourceStream.setEncoding('utf8');

	await pipelinePromise(
		sourceStream,
		transformStream(chunk => chunk, async function * () {
			yield 'd';
			yield 'e';
		}),
		destinationStream,
	);

	t.is(await getStream(destinationStream), 'abcde');
});
