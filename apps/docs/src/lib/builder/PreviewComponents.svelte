<script lang="ts">
	let dialog = $state<HTMLElement>();
</script>

<section class="pc" aria-label="Components preview">
	<div class="pc-card pc-wide">
		<div class="pc-head">
			<div>
				<p class="pc-kicker">Workspace</p>
				<h3 class="pc-title">Northwind settings</h3>
			</div>
			<amb-badge variant="accent">Business</amb-badge>
		</div>
		<amb-breadcrumbs>
			<li><a href="#builder-preview">Settings</a></li>
			<li><a href="#builder-preview">Workspace</a></li>
			<li>General</li>
		</amb-breadcrumbs>
		<amb-tabs>
			<button slot="tab" type="button">General</button>
			<button slot="tab" type="button">Members</button>
			<button slot="tab" type="button" disabled>Billing</button>
			<div slot="panel">Name, region and security for the whole workspace.</div>
			<div slot="panel">Invite people and set their roles.</div>
			<div slot="panel">Plans and invoices.</div>
		</amb-tabs>
		<div class="pc-grid">
			<amb-text-field name="workspace" value="Northwind">Workspace name</amb-text-field>
			<amb-select name="region">
				Data region
				<option value="eu">Europe (Frankfurt)</option>
				<option value="us">United States (Virginia)</option>
			</amb-select>
		</div>
		<amb-text-area name="about" rows="2" placeholder="What the workspace is for">Description</amb-text-area>
		<div class="pc-row">
			<amb-toggle name="sso" checked>Require single sign-on</amb-toggle>
			<amb-toggle name="audit">Keep an audit log</amb-toggle>
		</div>
		<amb-progress value="72" max="100" label="Seats used: 72 of 100"></amb-progress>
		<div class="pc-actions">
			<amb-button variant="ghost">View audit log</amb-button>
			<span class="pc-spacer"></span>
			<amb-button variant="secondary">Cancel</amb-button>
			<amb-button>Save changes</amb-button>
		</div>
	</div>

	<div class="pc-card">
		<h3 class="pc-title">Actions</h3>
		<div class="pc-row">
			<amb-button size="sm">Small</amb-button>
			<amb-button>Primary</amb-button>
			<amb-button size="lg">Large</amb-button>
		</div>
		<div class="pc-row">
			<amb-button variant="secondary">Secondary</amb-button>
			<amb-button variant="ghost">Ghost</amb-button>
			<amb-button disabled>Disabled</amb-button>
		</div>
		<p class="pc-text">
			Read the <amb-link href="#builder-preview">shipping policy</amb-link> or the
			<amb-link href="#builder-preview" variant="quiet">returns guide</amb-link>.
		</p>
		<div class="pc-row pc-menu">
			<amb-menu open>
				Share
				<button slot="panel" type="button">Copy link</button>
				<button slot="panel" type="button">Email</button>
			</amb-menu>
			<amb-tooltip text="Saves the draft on this page"><amb-button variant="secondary">Hover me</amb-button></amb-tooltip>
		</div>
		<amb-button
			variant="secondary"
			onclick={() => dialog?.setAttribute('open', '')}
		>
			Open dialog
		</amb-button>
		<amb-dialog bind:this={dialog} label="Delete the draft">
			<p>The draft and its comments go away. This cannot be undone.</p>
			<span slot="close">Close</span>
		</amb-dialog>
	</div>

	<div class="pc-card">
		<h3 class="pc-title">Choices</h3>
		<amb-checkbox name="terms" checked>Accept the terms</amb-checkbox>
		<amb-checkbox name="news">Send product updates</amb-checkbox>
		<fieldset class="pc-fieldset">
			<legend>Plan</legend>
			<amb-radio name="plan" value="annual" checked>Annual</amb-radio>
			<amb-radio name="plan" value="monthly">Monthly</amb-radio>
		</fieldset>
		<amb-range name="volume" value="60" min="0" max="100">Volume</amb-range>
		<amb-quantity name="linen" value="2" min="1" max="8">Linen sheet</amb-quantity>
	</div>

	<div class="pc-card pc-wide">
		<h3 class="pc-title">Content</h3>
		<div class="pc-tiles">
			<amb-stat-tile trend="up" sentiment="positive">
				Revenue <span slot="value">48,210 €</span> <span slot="delta">12% up on August</span>
			</amb-stat-tile>
			<amb-stat-tile trend="up" sentiment="negative">
				Refunds <span slot="value">1,904 €</span> <span slot="delta">4% up</span>
			</amb-stat-tile>
			<amb-tile href="#builder-preview" tone="accent">
				<amb-icon slot="icon" name="rocket_launch"></amb-icon>
				Get started
				<span slot="description">Install in five minutes.</span>
			</amb-tile>
			<amb-tile href="#builder-preview">
				<amb-icon slot="icon" name="group"></amb-icon>
				<amb-badge slot="meta">12</amb-badge>
				Members
				<span slot="description">Invite people and set roles.</span>
			</amb-tile>
		</div>
		<div class="pc-tiles">
			<amb-card href="#builder-preview">
				<h4 slot="heading">Autumn linen</h4>
				<p>Six colors, woven in Portugal.</p>
				<amb-badge slot="footer" variant="accent">New</amb-badge>
			</amb-card>
			<amb-card variant="outlined">
				<h4 slot="heading">Stoneware</h4>
				<p>A set of four bowls, glazed by hand.</p>
				<amb-button slot="footer" size="sm" variant="secondary">Save</amb-button>
			</amb-card>
			<amb-card variant="filled">
				<h4 slot="heading">Wool throw</h4>
				<p>Warm, light, and made to last.</p>
			</amb-card>
		</div>
	</div>

	<div class="pc-card">
		<h3 class="pc-title">Choice cards and dates</h3>
		<fieldset class="pc-fieldset">
			<legend>Plan</legend>
			<div class="pc-choices">
				<amb-radio-card name="builder-plan" value="team" checked>Team<span slot="description">8 € a person</span></amb-radio-card>
				<amb-radio-card name="builder-plan" value="business">Business<span slot="description">16 € a person</span></amb-radio-card>
			</div>
		</fieldset>
		<amb-checkbox-card name="builder-addon" checked>
			<amb-icon slot="icon" name="backup"></amb-icon>
			Daily backups
			<span slot="description">Keep 30 days of snapshots.</span>
		</amb-checkbox-card>
		<amb-date-picker name="builder-date" value="2026-10-14">Start date</amb-date-picker>
	</div>

	<div class="pc-card">
		<h3 class="pc-title">AI</h3>
		<amb-message from="user">Which invoices are overdue?</amb-message>
		<amb-message status="streaming">
			<span slot="avatar">A</span>
			<span slot="author">Assistant</span>
			Three, for 4,210 euros in total
		</amb-message>
		<amb-thinking label="Reading the invoices"></amb-thinking>
		<div class="pc-row">
			<amb-suggestion>Draft a reminder</amb-suggestion>
			<amb-suggestion>Compare months</amb-suggestion>
		</div>
		<amb-prompt placeholder="Ask about your invoices">Message</amb-prompt>
	</div>

	<div class="pc-card">
		<h3 class="pc-title">Feedback</h3>
		<div class="pc-row">
			<amb-badge>Draft</amb-badge>
			<amb-badge variant="accent">New</amb-badge>
			<amb-badge variant="success">Paid</amb-badge>
			<amb-badge variant="danger">Failed</amb-badge>
			<amb-tag>Linen</amb-tag>
			<amb-tag variant="accent">Sale</amb-tag>
		</div>
		<amb-banner>Maintenance on Sunday from 2:00 to 3:00.</amb-banner>
		<amb-banner variant="success">Your changes are saved.</amb-banner>
		<amb-banner variant="danger">The payment failed. Try another card.</amb-banner>
		<div class="pc-row">
			<amb-spinner label="Loading orders"></amb-spinner>
			<div class="pc-skeleton"><amb-skeleton></amb-skeleton><amb-skeleton></amb-skeleton></div>
		</div>
	</div>

	<div class="pc-card">
		<h3 class="pc-title">Navigation and disclosure</h3>
		<amb-pagination label="Orders">
			<li><a href="#builder-preview">Previous</a></li>
			<li><a href="#builder-preview" aria-current="page">1</a></li>
			<li><a href="#builder-preview">2</a></li>
			<li><a href="#builder-preview">3</a></li>
			<li><a href="#builder-preview">Next</a></li>
		</amb-pagination>
		<amb-disclosure open>
			Shipping
			<p slot="panel" class="pc-text">Arrives in two days. Free returns for 30 days.</p>
		</amb-disclosure>
		<amb-disclosure>
			Warranty
			<p slot="panel" class="pc-text">Two years on every product.</p>
		</amb-disclosure>
		<div class="pc-row">
			<amb-icon name="favorite" label="Favorite"></amb-icon>
			<amb-icon name="search" label="Search"></amb-icon>
			<amb-icon name="settings" size="lg" label="Settings"></amb-icon>
		</div>
	</div>
</section>

<style>
	.pc {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--amb-space-500);
		color: var(--amb-color-fg-default);
		font-family: var(--amb-font-family-sans);
		font-size: var(--amb-font-size-300);
		line-height: var(--amb-font-line-height-body);
	}

	.pc-card {
		display: grid;
		align-content: start;
		gap: var(--amb-space-400);
		min-width: 0;
		padding: var(--amb-space-500);
		border: var(--amb-border-width-default) solid color-mix(in oklab, var(--amb-color-border-default) 40%, transparent);
		border-radius: var(--amb-radius-lg);
		background: var(--amb-color-bg-surface);
		box-shadow:
			inset 0 1px 0 var(--amb-color-highlight),
			var(--amb-elevation-1);
	}

	.pc-wide {
		grid-column: 1 / -1;
	}

	.pc-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--amb-space-400);
	}

	.pc-kicker {
		margin: 0 0 var(--amb-space-100);
		color: var(--amb-color-fg-subtle);
		font-size: var(--amb-font-size-100);
		font-weight: var(--amb-font-weight-semibold);
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.pc-title {
		margin: 0;
		font-size: var(--amb-font-size-500);
		font-weight: var(--amb-font-weight-semibold);
		line-height: var(--amb-font-line-height-tight);
	}

	.pc-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--amb-space-400);
	}

	.pc-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--amb-space-300);
	}

	.pc-menu {
		align-items: flex-start;
		min-height: 150px;
	}

	.pc-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--amb-space-300);
		padding-top: var(--amb-space-400);
		border-top: var(--amb-border-width-default) solid color-mix(in oklab, var(--amb-color-border-default) 30%, transparent);
	}

	.pc-spacer {
		flex: 1;
	}

	.pc-text {
		margin: 0;
		color: var(--amb-color-fg-muted);
	}

	.pc-fieldset {
		display: grid;
		gap: var(--amb-space-100);
		margin: 0;
		padding: 0;
		border: 0;
	}

	.pc-fieldset legend {
		margin-bottom: var(--amb-space-200);
		font-weight: var(--amb-font-weight-semibold);
	}

	.pc-tiles {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: var(--amb-space-300);
	}

	.pc-choices {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--amb-space-200);
	}

	.pc-card h4 {
		margin: 0;
	}

	.pc-skeleton {
		display: grid;
		flex: 1;
		gap: var(--amb-space-200);
		min-width: 140px;
	}
</style>
