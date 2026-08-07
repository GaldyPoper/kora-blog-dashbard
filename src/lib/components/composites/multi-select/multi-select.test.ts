import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import MultiSelect from './multi-select.svelte';

const options = [
	{ value: 'draft', label: 'Draft' },
	{ value: 'active', label: 'Active' },
	{ value: 'paused', label: 'Paused' }
];

type Overrides = {
	options?: { value: string; label: string }[];
	selected?: string[];
	onChange?: (values: string[]) => void;
	label?: string;
	placeholder?: string;
};

function setup(overrides: Overrides = {}) {
	const onChange = overrides.onChange ?? vi.fn();
	const utils = render(MultiSelect, {
		props: {
			options,
			selected: [],
			label: 'Status',
			placeholder: 'All statuses',
			...overrides,
			onChange
		}
	});
	return { onChange, ...utils };
}

describe('MultiSelect', () => {
	it('renders a collapsed listbox trigger showing the placeholder', () => {
		const { getByRole } = setup();
		const trigger = getByRole('button');
		expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
		expect(trigger.getAttribute('aria-expanded')).toBe('false');
		expect(trigger.textContent).toContain('All statuses');
	});

	it('opens on click and exposes a multi-selectable listbox of options', async () => {
		const user = userEvent.setup();
		const { getByRole, getAllByRole } = setup();
		await user.click(getByRole('button'));
		expect(getByRole('button').getAttribute('aria-expanded')).toBe('true');
		expect(getByRole('listbox').getAttribute('aria-multiselectable')).toBe('true');
		expect(getAllByRole('option')).toHaveLength(3);
	});

	it('toggles a value on option click, emitting values in options order', async () => {
		const user = userEvent.setup();
		const { getByRole, onChange } = setup({ selected: ['active'] });
		await user.click(getByRole('button'));
		await user.click(getByRole('option', { name: /draft/i }));
		expect(onChange).toHaveBeenCalledWith(['draft', 'active']);
	});

	it('deselects an already-selected value', async () => {
		const user = userEvent.setup();
		const { getByRole, onChange } = setup({ selected: ['active', 'draft'] });
		await user.click(getByRole('button'));
		await user.click(getByRole('option', { name: /active/i }));
		expect(onChange).toHaveBeenCalledWith(['draft']);
	});

	it('reflects the current selection via aria-selected', async () => {
		const user = userEvent.setup();
		const { getByRole } = setup({ selected: ['active'] });
		await user.click(getByRole('button'));
		expect(getByRole('option', { name: /active/i }).getAttribute('aria-selected')).toBe('true');
		expect(getByRole('option', { name: /draft/i }).getAttribute('aria-selected')).toBe('false');
	});

	it('opens with ArrowDown and toggles the focused option with Space', async () => {
		const user = userEvent.setup();
		const { getByRole, onChange } = setup();
		getByRole('button').focus();
		await user.keyboard('{ArrowDown}');
		expect(getByRole('listbox')).toBeTruthy();
		const draft = getByRole('option', { name: /draft/i });
		draft.focus();
		await user.keyboard(' ');
		expect(onChange).toHaveBeenCalledWith(['draft']);
	});

	it('closes on Escape and returns focus to the trigger', async () => {
		const user = userEvent.setup();
		const { getByRole, queryByRole } = setup();
		const trigger = getByRole('button');
		await user.click(trigger);
		expect(getByRole('listbox')).toBeTruthy();
		await user.keyboard('{Escape}');
		expect(queryByRole('listbox')).toBeNull();
		expect(document.activeElement).toBe(trigger);
	});
});
