import { getPosts, getItems, getUsers } from './data';

describe('server data layer', () => {
	it('reads and validates every post', () => {
		expect(getPosts().length).toBeGreaterThan(0);
	});

	it('reads and validates every item', () => {
		expect(getItems().length).toBeGreaterThan(0);
	});

	it('reads and validates every user', () => {
		expect(getUsers().length).toBeGreaterThan(0);
	});
});
