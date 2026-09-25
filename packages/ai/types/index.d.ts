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

/** `send` on amb-prompt. Call preventDefault() to keep the text in the field. */
export type AmbPromptSendEvent = CustomEvent<{ value: string }>;

/** `stop` on amb-prompt, while busy. */
export type AmbPromptStopEvent = CustomEvent<Record<string, never>>;

declare global {
	interface HTMLElementTagNameMap {
		'amb-message': AmbMessageElement;
		'amb-prompt': AmbPromptElement;
		'amb-suggestion': AmbSuggestionElement;
		'amb-thinking': AmbThinkingElement;
	}
}
