<svelte:options
	customElement={{
		tag: 'amb-date-picker',
		shadow: { mode: 'open', delegatesFocus: true },
		props: {
			name: { reflect: true, type: 'String', attribute: 'name' },
			value: { type: 'String' },
			min: { reflect: true, type: 'String', attribute: 'min' },
			max: { reflect: true, type: 'String', attribute: 'max' },
			disabled: { reflect: true, type: 'Boolean', attribute: 'disabled' },
			required: { reflect: true, type: 'Boolean', attribute: 'required' }
		},
		extend: (Base) => {
			return class extends Base {
				static formAssociated = true;

				constructor() {
					super();
					this.attachedInternals = this.attachInternals();
					adopt(this.shadowRoot, styles);
				}
			};
		}
	}}
/>

<script module lang="ts">
	import { tick } from 'svelte';
	import { adopt } from '../styles/adopt';
	import { emit } from '../internal/events';
	import styles from '../styles/components/date-picker.scss?inline';

	const DAY = 86_400_000;

	/** Dates are handled at midnight UTC, so no time zone or daylight saving shift moves a day. */
	function parse(text: string | null | undefined) {
		if (!text || !/^\d{4}-\d{2}-\d{2}$/.test(text)) return null;
		const date = new Date(`${text}T00:00:00Z`);
		return Number.isNaN(date.getTime()) || iso(date) !== text ? null : date;
	}

	function iso(date: Date) {
		return date.toISOString().slice(0, 10);
	}

	function today() {
		const now = new Date();
		return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
	}

	function addDays(date: Date, days: number) {
		return new Date(date.getTime() + days * DAY);
	}

	/** Moves by months and keeps the day, or the last day of a shorter month. */
	function addMonths(date: Date, months: number) {
		const year = date.getUTCFullYear();
		const month = date.getUTCMonth() + months;
		const last = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
		return new Date(Date.UTC(year, month, Math.min(date.getUTCDate(), last)));
	}

	/** First day of the week for the locale, 0 for Sunday. Monday when the browser cannot say. */
	function weekStart(locale: string) {
		try {
			const info = new Intl.Locale(locale) as Intl.Locale & {
				getWeekInfo?: () => { firstDay: number };
				weekInfo?: { firstDay: number };
			};
			const first = info.getWeekInfo?.().firstDay ?? info.weekInfo?.firstDay ?? 1;
			return first % 7;
		} catch {
			return 1;
		}
	}
</script>

<script lang="ts">
	interface Props {
		name?: string;
		value?: string;
		min?: string;
		max?: string;
		disabled?: boolean;
		required?: boolean;
		attachedInternals?: ElementInternals;
	}

	let {
		name = '',
		value = '',
		min = '',
		max = '',
		disabled = false,
		required = false,
		attachedInternals
	}: Props = $props();

	let input = $state<HTMLInputElement>();
	let toggle = $state<HTMLButtonElement>();
	let panel = $state<HTMLDivElement>();
	let open = $state(false);
	let showMessage = $state(false);
	let message = $state('');
	let focused = $state(today());
	const host = $host();
	const id = `amb-date-picker-${Math.random().toString(36).slice(2, 8)}`;

	const locale = host.closest('[lang]')?.getAttribute('lang') || navigator.language || 'en';
	const first = weekStart(locale);
	const monthFormat = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' });
	const fullFormat = new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeZone: 'UTC' });
	const shortDay = new Intl.DateTimeFormat(locale, { weekday: 'narrow', timeZone: 'UTC' });
	const longDay = new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' });

	const selected = $derived(parse(value));
	const lower = $derived(parse(min));
	const upper = $derived(parse(max));
	const todayIso = iso(today());

	// A known Sunday (4 January 1970) shifted to the locale's first day.
	const weekdays = Array.from({ length: 7 }, (_, index) => {
		const day = new Date((3 + first + index) * DAY);
		return { short: shortDay.format(day), long: longDay.format(day) };
	});

	// Rows of seven days for the focused month; days of the other months are blank cells.
	const weeks = $derived.by(() => {
		const start = new Date(Date.UTC(focused.getUTCFullYear(), focused.getUTCMonth(), 1));
		const offset = (start.getUTCDay() - first + 7) % 7;
		const rows: (Date | null)[][] = [];
		for (let row = 0; row < 6; row += 1) {
			const cells = Array.from({ length: 7 }, (_, column) => {
				const day = addDays(start, row * 7 + column - offset);
				return day.getUTCMonth() === start.getUTCMonth() ? day : null;
			});
			if (cells.some(Boolean)) rows.push(cells);
		}
		return rows;
	});

	function outOfRange(day: Date) {
		return Boolean((lower && day < lower) || (upper && day > upper));
	}

	function publish() {
		if (!input) return;
		attachedInternals?.setFormValue(input.value || null);
		attachedInternals?.setValidity(input.validity, input.validationMessage, input);
		message = input.validationMessage;
		if (input.validity.valid) showMessage = false;
	}

	// `input` from the native field is composed and reaches the host on its own.
	function notify() {
		emit(host, 'change', { value: input?.value ?? '' });
	}

	function onInput() {
		if (!input) return;
		host.value = input.value;
		publish();
	}

	function onInvalid() {
		showMessage = true;
		publish();
	}

	async function focusCell() {
		await tick();
		panel?.querySelector<HTMLElement>('td[tabindex="0"]')?.focus();
	}

	function show() {
		if (disabled) return;
		const start = selected ?? today();
		focused = lower && start < lower ? lower : upper && start > upper ? upper : start;
		open = true;
		focusCell();
	}

	function close(restoreFocus: boolean) {
		open = false;
		if (restoreFocus) toggle?.focus();
	}

	function choose(day: Date) {
		if (outOfRange(day)) return;
		host.value = iso(day);
		if (input) input.value = iso(day);
		publish();
		notify();
		close(true);
	}

	function move(next: Date) {
		focused = next;
		focusCell();
	}

	function onGridKeydown(event: KeyboardEvent) {
		const moves: Record<string, () => Date> = {
			ArrowRight: () => addDays(focused, 1),
			ArrowLeft: () => addDays(focused, -1),
			ArrowDown: () => addDays(focused, 7),
			ArrowUp: () => addDays(focused, -7),
			Home: () => addDays(focused, -((focused.getUTCDay() - first + 7) % 7)),
			End: () => addDays(focused, 6 - ((focused.getUTCDay() - first + 7) % 7)),
			PageUp: () => addMonths(focused, event.shiftKey ? -12 : -1),
			PageDown: () => addMonths(focused, event.shiftKey ? 12 : 1)
		};
		if (moves[event.key]) {
			event.preventDefault();
			move(moves[event.key]());
		} else if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			choose(focused);
		}
	}

	function onPanelKeydown(event: KeyboardEvent) {
		if (event.key !== 'Escape') return;
		event.preventDefault();
		event.stopPropagation();
		close(true);
	}

	// The calendar closes when focus moves outside it. A press outside is handled on the document,
	// because some browsers do not focus a pressed button, which leaves no related target.
	function onFocusOut(event: FocusEvent) {
		const next = event.relatedTarget;
		if (!(next instanceof Node) || panel?.contains(next) || next === toggle) return;
		close(false);
	}

	$effect(() => {
		if (!input) return;
		if (input.value !== value) input.value = value;
		publish();
		const onHostInvalid = () => {
			showMessage = true;
			message = input?.validationMessage ?? '';
		};
		const onPointer = (event: PointerEvent) => {
			if (open && !event.composedPath().includes(host)) close(false);
		};
		host.addEventListener('invalid', onHostInvalid);
		document.addEventListener('pointerdown', onPointer);
		return () => {
			host.removeEventListener('invalid', onHostInvalid);
			document.removeEventListener('pointerdown', onPointer);
		};
	});
</script>

<div part="field" class={['c-date-picker', open && 'is-open', disabled && 'is-disabled']}>
	<label for={`${id}-input`} part="label" class="c-date-picker__label"><slot /></label>
	<div class="c-date-picker__field">
		<input
			bind:this={input}
			id={`${id}-input`}
			part="control"
			class="c-date-picker__control"
			type="date"
			{name}
			min={min || undefined}
			max={max || undefined}
			{disabled}
			{required}
			oninput={onInput}
			onchange={notify}
			oninvalid={onInvalid}
		/>
		<button
			bind:this={toggle}
			part="toggle"
			type="button"
			class="c-date-picker__toggle"
			aria-label="Choose a date"
			aria-haspopup="dialog"
			aria-expanded={open}
			aria-controls={`${id}-panel`}
			{disabled}
			onclick={() => (open ? close(true) : show())}
		>
			<svg class="c-date-picker__glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
				<rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
				<path d="M3.5 10h17M8 3v4M16 3v4" />
			</svg>
		</button>
	</div>
	{#if showMessage && message}
		<p part="message" class="c-date-picker__message">{message}</p>
	{/if}

	<div
		bind:this={panel}
		id={`${id}-panel`}
		part="panel"
		class="c-date-picker__panel"
		role="dialog"
		tabindex="-1"
		aria-modal="false"
		aria-labelledby={`${id}-month`}
		hidden={!open}
		onkeydown={onPanelKeydown}
		onfocusout={onFocusOut}
	>
		<div class="c-date-picker__head">
			<button
				type="button"
				class="c-date-picker__nav"
				aria-label="Previous month"
				onclick={() => (focused = addMonths(focused, -1))}
			>
				<svg class="c-date-picker__glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
					<path d="M15 6l-6 6 6 6" />
				</svg>
			</button>
			<h2 id={`${id}-month`} class="c-date-picker__month" aria-live="polite">{monthFormat.format(focused)}</h2>
			<button
				type="button"
				class="c-date-picker__nav"
				aria-label="Next month"
				onclick={() => (focused = addMonths(focused, 1))}
			>
				<svg class="c-date-picker__glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
					<path d="M9 6l6 6-6 6" />
				</svg>
			</button>
		</div>

		<table class="c-date-picker__grid" role="grid" aria-labelledby={`${id}-month`}>
			<thead>
				<tr>
					{#each weekdays as day}
						<th scope="col" abbr={day.long} class="c-date-picker__weekday">{day.short}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each weeks as week}
					<tr>
						{#each week as day}
							{#if day}
								{@const dayIso = iso(day)}
								<td
									class={[
										'c-date-picker__day',
										dayIso === iso(focused) && 'is-focused',
										selected && dayIso === iso(selected) && 'is-selected',
										dayIso === todayIso && 'is-today',
										outOfRange(day) && 'is-unavailable'
									]}
									role="gridcell"
									tabindex={dayIso === iso(focused) ? 0 : -1}
									aria-selected={selected ? dayIso === iso(selected) : false}
									aria-current={dayIso === todayIso ? 'date' : undefined}
									aria-disabled={outOfRange(day) ? 'true' : undefined}
									aria-label={fullFormat.format(day)}
									onclick={() => choose(day)}
									onkeydown={onGridKeydown}
								>
									{day.getUTCDate()}
								</td>
							{:else}
								<td class="c-date-picker__blank"></td>
							{/if}
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>

		<div class="c-date-picker__foot">
			<button
				type="button"
				class="c-date-picker__action"
				disabled={outOfRange(today())}
				onclick={() => choose(today())}
			>
				Today
			</button>
		</div>
	</div>
</div>
