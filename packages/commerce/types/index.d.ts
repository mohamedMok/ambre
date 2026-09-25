export interface AmbQuantityProps {
	name?: string;
	value?: number;
	min?: number;
	max?: number;
	step?: number;
	disabled?: boolean;
}

export interface AmbQuantityElement extends HTMLElement, AmbQuantityProps {}

/** `change` on amb-quantity, after the value is clamped to the bounds. */
export type AmbQuantityChangeEvent = CustomEvent<{ value: number }>;

declare global {
	interface HTMLElementTagNameMap {
		'amb-quantity': AmbQuantityElement;
	}
}
