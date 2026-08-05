import { getInitials } from './initials';

describe('getInitials', () => {
	it('takes the first letter of the first two words', () => {
		expect(getInitials('Omar Haddad')).toBe('OH');
	});

	it('uppercases the result', () => {
		expect(getInitials('anna becker')).toBe('AB');
	});

	it('returns a single initial for a single-word name', () => {
		expect(getInitials('Cher')).toBe('C');
	});

	it('collapses extra and surrounding whitespace', () => {
		expect(getInitials('  Anna   Becker  ')).toBe('AB');
	});

	it('uses only the first two words when there are more', () => {
		expect(getInitials('Jean Luc Picard')).toBe('JL');
	});

	it('preserves non-ASCII initials', () => {
		expect(getInitials('Marek Dvořák')).toBe('MD');
	});

	it('returns an empty string for an empty or whitespace-only name', () => {
		expect(getInitials('')).toBe('');
		expect(getInitials('   ')).toBe('');
	});
});
