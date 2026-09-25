/**
 * Dispatches an Ambre event on the host.
 *
 * Every Ambre event bubbles and is composed, so it reaches listeners outside the shadow root and
 * in any ancestor, like a native `click` or `input`. A native `change` is not composed: it stops
 * at the shadow root, so controls re-dispatch it here with the value in `detail`.
 *
 * Events report what a person did. Setting a property from code does not fire them, as with
 * native elements.
 *
 * @returns false when a listener called `preventDefault()` on a cancelable event.
 */
export function emit<Detail>(
	host: HTMLElement,
	type: string,
	detail: Detail,
	options: { cancelable?: boolean } = {}
) {
	return host.dispatchEvent(
		new CustomEvent<Detail>(type, {
			bubbles: true,
			composed: true,
			cancelable: options.cancelable ?? false,
			detail
		})
	);
}
