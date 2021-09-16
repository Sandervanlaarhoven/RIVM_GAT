import { catitaliseFirstLetter, swapElementsInArray, replaceElementsInArray } from './index';

test('capitalise first letter of a sentence', () => {
	const originalString = 'the string is long'
	const newString = catitaliseFirstLetter(originalString)
	expect(newString).toBe('The string is long')
});

test('capitalise first letter of a word', () => {
	const originalString = 'string'
	const newString = catitaliseFirstLetter(originalString)
	expect(newString).toBe('String')
});

test('swap elements in array of strings', () => {
	const originalArray = [
		'Number1',
		'Number2',
		'Number3',
		'Number4',
	]
	const newArray = swapElementsInArray(originalArray, 1, 3)
	expect(newArray).toEqual([
		'Number1',
		'Number4',
		'Number3',
		'Number2',
	])
});

test('swap elements in array of objects', () => {
	const originalArray = [
		{ number: 'Number1' },
		{ number: 'Number2' },
		{ number: 'Number3' },
		{ number: 'Number4' },
	]
	const newArray = swapElementsInArray(originalArray, 1, 3)
	expect(newArray).toEqual([
		{ number: 'Number1' },
		{ number: 'Number4' },
		{ number: 'Number3' },
		{ number: 'Number2' },
	])
});

test('replace element in array with new element', () => {
	interface NumberObject {
		number: string
	}
  const originalArray: NumberObject[] = [
		{ number: 'Number1' },
		{ number: 'Number2' },
		{ number: 'Number3' },
		{ number: 'Number4' },
	]
	const insertedElement: NumberObject = { number: 'Number5' }
  const newArray = replaceElementsInArray(originalArray, insertedElement, 3)
  const expected: NumberObject[] = [
		{ number: 'Number1' },
		{ number: 'Number2' },
		{ number: 'Number3' },
		{ number: 'Number5' },
	]
	expect(newArray).toEqual(expected)
	expect(Array.isArray(newArray)).toBe(true)
});
