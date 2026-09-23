export interface AmbQuantityProps {
	name?: string;
	value?: number;
	min?: number;
	max?: number;
	step?: number;
	disabled?: boolean;
}

export interface AmbQuantityElement extends HTMLElement, AmbQuantityProps {}

declare global {
	interface HTMLElementTagNameMap {
		'amb-quantity': AmbQuantityElement;
	}
}
