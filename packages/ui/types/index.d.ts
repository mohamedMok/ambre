export interface AmbButtonProps {
	variant?: 'primary' | 'secondary' | 'ghost';
	size?: 'sm' | 'md' | 'lg';
	disabled?: boolean;
	type?: 'button' | 'submit' | 'reset';
}

export interface AmbButtonElement extends HTMLElement, AmbButtonProps {}

declare global {
	interface HTMLElementTagNameMap {
		'amb-button': AmbButtonElement;
	}
}
