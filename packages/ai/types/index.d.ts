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

export interface AmbToolCallProps {
	status?: 'running' | 'complete' | 'error';
	open?: boolean;
}

export interface AmbToolCallElement extends HTMLElement, AmbToolCallProps {}

export interface AmbCodeBlockProps {
	language?: string;
	wrap?: boolean;
}

export interface AmbCodeBlockElement extends HTMLElement, AmbCodeBlockProps {}

/** `toggle` on amb-tool-call. */
export type AmbToolCallToggleEvent = CustomEvent<{ open: boolean }>;

/** `copied` on amb-code-block, after the text reached the clipboard. */
export type AmbCodeCopyEvent = CustomEvent<{ value: string }>;

/** `send` on amb-prompt. Call preventDefault() to keep the text in the field. */
export type AmbPromptSendEvent = CustomEvent<{ value: string }>;

/** `stop` on amb-prompt, while busy. */
export type AmbPromptStopEvent = CustomEvent<Record<string, never>>;

declare global {
	interface HTMLElementTagNameMap {
		'amb-code-block': AmbCodeBlockElement;
		'amb-message': AmbMessageElement;
		'amb-tool-call': AmbToolCallElement;
		'amb-prompt': AmbPromptElement;
		'amb-suggestion': AmbSuggestionElement;
		'amb-thinking': AmbThinkingElement;
	}
}
