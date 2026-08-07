import { Listbox } from './listbox.svelte';

describe('Listbox', () => {
	it('starts closed', () => {
		const listbox = new Listbox();
		expect(listbox.open).toBe(false);
		expect(listbox.activeIndex).toBe(0);
	});

	it('opens at an index and closes again', () => {
		const listbox = new Listbox();
		listbox.openAt(2);
		expect(listbox.open).toBe(true);
		expect(listbox.activeIndex).toBe(2);
		listbox.close();
		expect(listbox.open).toBe(false);
	});

	it('wraps the active index around the option count', () => {
		const listbox = new Listbox();
		listbox.setActive(5, 3); // 5 -> 2
		expect(listbox.activeIndex).toBe(2);
		listbox.setActive(-1, 3); // -1 -> 2
		expect(listbox.activeIndex).toBe(2);
		listbox.setActive(3, 3); // 3 -> 0
		expect(listbox.activeIndex).toBe(0);
	});

	it('ignores setActive when there are no options', () => {
		const listbox = new Listbox();
		listbox.setActive(2, 0);
		expect(listbox.activeIndex).toBe(0);
	});
});
