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
			'amb-link': {
				href?: string;
				variant?: 'text' | 'quiet';
				external?: boolean;
			};
			'amb-disclosure': {
				open?: boolean;
				disabled?: boolean;
			};
			'amb-icon': {
				size?: 'sm' | 'md' | 'lg';
				label?: string;
			};
			'amb-text-field': {
				name?: string;
				value?: string;
				type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
				placeholder?: string;
				autocomplete?: string;
				disabled?: boolean;
				required?: boolean;
				readonly?: boolean;
			};
			'amb-checkbox': {
				name?: string;
				value?: string;
				checked?: boolean;
				disabled?: boolean;
				required?: boolean;
			};
			'amb-radio': {
				name?: string;
				value?: string;
				checked?: boolean;
				disabled?: boolean;
				required?: boolean;
			};
			'amb-select': {
				name?: string;
				value?: string;
				disabled?: boolean;
				required?: boolean;
			};
		}
	}
}

export {};
