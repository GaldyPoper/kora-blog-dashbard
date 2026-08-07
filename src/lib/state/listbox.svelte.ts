export class Listbox {
	open = $state(false);
	activeIndex = $state(0);

	openAt(index: number) {
		this.open = true;
		this.activeIndex = index;
	}

	close() {
		this.open = false;
	}

	setActive(index: number, count: number) {
		if (count > 0) this.activeIndex = ((index % count) + count) % count;
	}
}
