export const toggleTheme = () => {
	if (typeof document === 'undefined') return;
	const currentTheme = document.documentElement.getAttribute('data-theme');
	const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
	document.documentElement.setAttribute('data-theme', nextTheme);
	localStorage.setItem('theme', nextTheme);
};
