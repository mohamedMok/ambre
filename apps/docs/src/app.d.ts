declare global {
	namespace App {}
	namespace svelteHTML {
		interface IntrinsicElements {
			'amb-button': {
				variant?: 'primary' | 'secondary' | 'ghost';
				size?: 'sm' | 'md' | 'lg';
				disabled?: boolean;
				type?: 'button' | 'submit' | 'reset';
			};
		}
	}
}

export {};
