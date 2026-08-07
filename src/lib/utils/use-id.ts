let counter = 0;

export function useId(prefix = 'id'): string {
	counter += 1;
	return `${prefix}-${counter}`;
}
