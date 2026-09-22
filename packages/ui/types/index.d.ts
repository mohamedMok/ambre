export interface AmbButtonProps {
	variant?: 'primary' | 'secondary' | 'ghost';
	size?: 'sm' | 'md' | 'lg';
	disabled?: boolean;
	type?: 'button' | 'submit' | 'reset';
}

export interface AmbButtonElement extends HTMLElement, AmbButtonProps {}

export interface AmbLinkProps {
	href?: string;
	variant?: 'text' | 'quiet';
	external?: boolean;
}

export interface AmbLinkElement extends HTMLElement, AmbLinkProps {}

export interface AmbDisclosureProps {
	open?: boolean;
	disabled?: boolean;
}

export interface AmbDisclosureElement extends HTMLElement, AmbDisclosureProps {}

export interface AmbIconProps {
	size?: 'sm' | 'md' | 'lg';
	label?: string;
}

export interface AmbIconElement extends HTMLElement, AmbIconProps {}

export interface AmbTextFieldProps {
	name?: string;
	value?: string;
	type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
	placeholder?: string;
	autocomplete?: string;
	disabled?: boolean;
	required?: boolean;
	readonly?: boolean;
}

export interface AmbTextFieldElement extends HTMLElement, AmbTextFieldProps {}

export interface AmbCheckboxProps {
	name?: string;
	value?: string;
	checked?: boolean;
	disabled?: boolean;
	required?: boolean;
}

export interface AmbCheckboxElement extends HTMLElement, AmbCheckboxProps {}

export interface AmbRadioProps {
	name?: string;
	value?: string;
	checked?: boolean;
	disabled?: boolean;
	required?: boolean;
}

export interface AmbRadioElement extends HTMLElement, AmbRadioProps {}

export interface AmbSelectProps {
	name?: string;
	value?: string;
	disabled?: boolean;
	required?: boolean;
}

export interface AmbSelectElement extends HTMLElement, AmbSelectProps {}

declare global {
	interface HTMLElementTagNameMap {
		'amb-button': AmbButtonElement;
		'amb-checkbox': AmbCheckboxElement;
		'amb-disclosure': AmbDisclosureElement;
		'amb-icon': AmbIconElement;
		'amb-link': AmbLinkElement;
		'amb-radio': AmbRadioElement;
		'amb-select': AmbSelectElement;
		'amb-text-field': AmbTextFieldElement;
	}
}
