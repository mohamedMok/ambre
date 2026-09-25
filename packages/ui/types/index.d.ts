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
	name?: string;
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

export interface AmbTextAreaProps {
	name?: string;
	value?: string;
	placeholder?: string;
	rows?: number;
	disabled?: boolean;
	required?: boolean;
	readonly?: boolean;
}

export interface AmbTextAreaElement extends HTMLElement, AmbTextAreaProps {}

export interface AmbToggleProps {
	name?: string;
	value?: string;
	checked?: boolean;
	disabled?: boolean;
	required?: boolean;
}

export interface AmbToggleElement extends HTMLElement, AmbToggleProps {}

export interface AmbRangeProps {
	name?: string;
	value?: number;
	min?: number;
	max?: number;
	step?: number;
	disabled?: boolean;
}

export interface AmbRangeElement extends HTMLElement, AmbRangeProps {}

export interface AmbBadgeProps {
	variant?: 'neutral' | 'accent' | 'success' | 'danger';
}

export interface AmbBadgeElement extends HTMLElement, AmbBadgeProps {}

export interface AmbTagProps {
	variant?: 'neutral' | 'accent';
}

export interface AmbTagElement extends HTMLElement, AmbTagProps {}

export interface AmbSpinnerProps {
	label?: string;
}

export interface AmbSpinnerElement extends HTMLElement, AmbSpinnerProps {}

export interface AmbProgressProps {
	value?: number;
	max?: number;
	label?: string;
}

export interface AmbProgressElement extends HTMLElement, AmbProgressProps {}

export interface AmbSkeletonElement extends HTMLElement {}

export interface AmbBannerProps {
	variant?: 'neutral' | 'success' | 'danger';
}

export interface AmbBannerElement extends HTMLElement, AmbBannerProps {}

export interface AmbBreadcrumbsElement extends HTMLElement {}

export interface AmbPaginationProps {
	label?: string;
}

export interface AmbPaginationElement extends HTMLElement, AmbPaginationProps {}

export interface AmbTooltipProps {
	text?: string;
}

export interface AmbTooltipElement extends HTMLElement, AmbTooltipProps {}

export interface AmbTabsElement extends HTMLElement {}

export interface AmbDialogProps {
	open?: boolean;
	label?: string;
}

export interface AmbDialogElement extends HTMLElement, AmbDialogProps {}

export interface AmbMenuProps {
	open?: boolean;
	disabled?: boolean;
}

export interface AmbMenuElement extends HTMLElement, AmbMenuProps {}

export interface AmbDatePickerProps {
	name?: string;
	value?: string;
	min?: string;
	max?: string;
	disabled?: boolean;
	required?: boolean;
}

export interface AmbDatePickerElement extends HTMLElement, AmbDatePickerProps {}

export interface AmbCheckboxCardElement extends HTMLElement, AmbCheckboxProps {}

export interface AmbRadioCardElement extends HTMLElement, AmbRadioProps {}

export interface AmbCardProps {
	variant?: 'raised' | 'outlined' | 'filled';
	href?: string;
}

export interface AmbCardElement extends HTMLElement, AmbCardProps {}

export interface AmbTileProps {
	href?: string;
	tone?: 'neutral' | 'accent';
}

export interface AmbTileElement extends HTMLElement, AmbTileProps {}

export interface AmbStatTileProps {
	trend?: 'none' | 'up' | 'down';
	sentiment?: 'neutral' | 'positive' | 'negative';
}

export interface AmbStatTileElement extends HTMLElement, AmbStatTileProps {}

export interface AmbLayoutProps {
	variant?: 'sidebar' | 'split' | 'stacked';
	label?: string;
}

export interface AmbLayoutElement extends HTMLElement, AmbLayoutProps {}

declare global {
	interface HTMLElementTagNameMap {
		'amb-badge': AmbBadgeElement;
		'amb-banner': AmbBannerElement;
		'amb-breadcrumbs': AmbBreadcrumbsElement;
		'amb-button': AmbButtonElement;
		'amb-card': AmbCardElement;
		'amb-checkbox': AmbCheckboxElement;
		'amb-checkbox-card': AmbCheckboxCardElement;
		'amb-date-picker': AmbDatePickerElement;
		'amb-dialog': AmbDialogElement;
		'amb-disclosure': AmbDisclosureElement;
		'amb-icon': AmbIconElement;
		'amb-layout': AmbLayoutElement;
		'amb-link': AmbLinkElement;
		'amb-menu': AmbMenuElement;
		'amb-pagination': AmbPaginationElement;
		'amb-progress': AmbProgressElement;
		'amb-radio': AmbRadioElement;
		'amb-radio-card': AmbRadioCardElement;
		'amb-range': AmbRangeElement;
		'amb-select': AmbSelectElement;
		'amb-skeleton': AmbSkeletonElement;
		'amb-spinner': AmbSpinnerElement;
		'amb-stat-tile': AmbStatTileElement;
		'amb-tabs': AmbTabsElement;
		'amb-tag': AmbTagElement;
		'amb-text-area': AmbTextAreaElement;
		'amb-text-field': AmbTextFieldElement;
		'amb-tile': AmbTileElement;
		'amb-toggle': AmbToggleElement;
		'amb-tooltip': AmbTooltipElement;
	}
}
