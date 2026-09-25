export interface AmbPromptProps {
	name?: string;
	value?: string;
	placeholder?: string;
	disabled?: boolean;
	busy?: boolean;
}

export interface AmbPromptElement extends HTMLElement, AmbPromptProps {}

export interface AmbMessageProps {
	from?: 'user' | 'assistant';
	status?: 'complete' | 'streaming' | 'error';
}

export interface AmbMessageElement extends HTMLElement, AmbMessageProps {}

export interface AmbThinkingProps {
	label?: string;
}

export interface AmbThinkingElement extends HTMLElement, AmbThinkingProps {}

export interface AmbSuggestionProps {
	disabled?: boolean;
}

export interface AmbSuggestionElement extends HTMLElement, AmbSuggestionProps {}

/** Fired by amb-prompt when the prompt is sent. Cancel it to keep the text in the field. */
export type AmbPromptSendEvent = CustomEvent<{ value: string }>;

declare global {
	interface HTMLElementTagNameMap {
		'amb-message': AmbMessageElement;
		'amb-prompt': AmbPromptElement;
		'amb-suggestion': AmbSuggestionElement;
		'amb-thinking': AmbThinkingElement;
	}
}
