<section id="results-section">

	<div class="results-head">
		<div>
			<div class="eyebrow">Your readiness score</div>
			<h2>Readiness Intelligence Brief</h2>
		</div>
	</div>

	<div class="report-grid">
		<div class="card score-card">
			<div class="score-circle">
				<svg viewBox="0 0 120 120">
					<circle class="sc-bg" cx="60" cy="60" r="52"></circle>
					<circle class="sc-fg" id="sc-fg" cx="60" cy="60" r="52" stroke-dasharray="326.7" stroke-dashoffset="326.7"></circle>
				</svg>

				<div class="score-num">
					<span class="sn-val" id="score-val">—</span>
					<span class="sn-sub">out of 100</span>
				</div>

			</div>

			<div class="tier-chip" id="tier-chip">—</div>
			<p class="score-explain" id="score-explain"></p>

		</div>

		<div class="card snapshot">
			<h3>Executive snapshot</h3>
			<div class="tier-name" id="tier-name"></div>
			<p id="tier-text"></p>
			<div class="snapshot-copy-grid">
				<div class="snapshot-copy-card">
					<h4>What this score suggests</h4>
					<p id="score-meaning"></p>
				</div>

				<div class="snapshot-copy-card">
					<h4>Where readiness may fail first</h4>
					<p id="fail-first-text"></p>
				</div>

				<div class="snapshot-copy-card">
					<h4>How to start the internal conversation</h4>
					<p id="escalation-text"></p>
				</div>

			</div>

			<div class="snapshot-panels">
				<div class="snapshot-panel">
					<h4>Conversation starter</h4>
					<p id="conversation-text"></p>
				</div>

				<div class="snapshot-panel">
					<h4>First validation action</h4>
					<p id="validation-text"></p>
				</div>
			</div>

			<div class="insight-grid" id="insight-grid"></div>
			<div class="snapshot-actions" id="snapshot-actions"></div>

		</div>

	</div>

	<div class="card wall-card">
		<div class="wall-head">
			<h3>Defense wall snapshot</h3>
			<div class="wall-sub">Weakest-function prioritization</div>
		</div>

		<p class="wall-lede">The wall is a prioritization heuristic. In incident readiness, the weakest operational function often determines where the response will break first. Use it to decide what to validate first, not as a mathematical proof of total risk.</p>

		<div class="wall-viz" id="wall-viz"></div>
		<p class="wall-caption" id="wall-caption"></p>
	</div>

	<div class="card answer-log-card">
		<h3>Your answer log</h3>
		<div class="table-scroll">
			<table class="answer-log-table" id="answer-log-table"></table>
		</div>
	</div>

</section>