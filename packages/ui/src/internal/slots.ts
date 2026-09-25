/**
 * Whether the host has light-DOM content for a named slot.
 * Svelte creates a named slot only for the names present when the element connects,
 * so reading the children at the same moment keeps the wrapper and the slot in step.
 */
export function slotted(host: HTMLElement, name: string) {
	return [...host.children].some((child) => child.getAttribute('slot') === name);
}
