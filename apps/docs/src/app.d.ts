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
				name?: string;
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
			'amb-text-area': {
				name?: string;
				value?: string;
				placeholder?: string;
				rows?: number;
				disabled?: boolean;
				required?: boolean;
				readonly?: boolean;
			};
			'amb-toggle': {
				name?: string;
				value?: string;
				checked?: boolean;
				disabled?: boolean;
				required?: boolean;
			};
			'amb-range': {
				name?: string;
				value?: number;
				min?: number;
				max?: number;
				step?: number;
				disabled?: boolean;
			};
			'amb-badge': { variant?: 'neutral' | 'accent' | 'success' | 'danger' };
			'amb-tag': { variant?: 'neutral' | 'accent' };
			'amb-spinner': { label?: string };
			'amb-progress': { value?: number; max?: number; label?: string };
			'amb-skeleton': {};
			'amb-banner': { variant?: 'neutral' | 'success' | 'danger' };
			'amb-breadcrumbs': {};
			'amb-pagination': { label?: string };
			'amb-tooltip': { text?: string };
			'amb-tabs': {};
			'amb-dialog': { open?: boolean; label?: string };
			'amb-menu': { open?: boolean; disabled?: boolean };
			'amb-quantity': {
				name?: string;
				value?: number;
				min?: number;
				max?: number;
				step?: number;
				disabled?: boolean;
			};
		}
	}
}

export {};
