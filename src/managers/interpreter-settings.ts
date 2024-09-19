import { initializeToggles } from '../utils/ui-utils';
import { generalSettings, loadSettings, saveSettings } from '../utils/storage-utils';
import { updateUrl } from '../utils/routing';
import { modelList } from '../utils/model-list';

export function initializeInterpreterSettings(): void {
	const interpreterSettingsForm = document.getElementById('interpreter-settings-form');
	if (interpreterSettingsForm) {
		interpreterSettingsForm.addEventListener('input', debounce(saveInterpreterSettingsFromForm, 500));
	}
	loadSettings().then(() => {
		const apiKeyInput = document.getElementById('openai-api-key') as HTMLInputElement;
		const anthropicApiKeyInput = document.getElementById('anthropic-api-key') as HTMLInputElement;
		const modelSelect = document.getElementById('default-model') as HTMLSelectElement;
		const interpreterToggle = document.getElementById('interpreter-toggle') as HTMLInputElement;
		const interpreterAutoRunToggle = document.getElementById('interpreter-auto-run-toggle') as HTMLInputElement;

		if (apiKeyInput) apiKeyInput.value = generalSettings.openaiApiKey || '';
		if (anthropicApiKeyInput) anthropicApiKeyInput.value = generalSettings.anthropicApiKey || '';
		if (modelSelect) {
			modelSelect.innerHTML = modelList.map(model => 
				`<option value="${model.value}">${model.label}</option>`
			).join('');
			modelSelect.value = generalSettings.interpreterModel || modelList[0].value;
		}
		if (interpreterToggle) interpreterToggle.checked = generalSettings.interpreterEnabled;
		if (interpreterAutoRunToggle) interpreterAutoRunToggle.checked = generalSettings.interpreterAutoRun;
		initializeToggles();
		initializeAutoSave();

		if (interpreterToggle) {
			interpreterToggle.addEventListener('change', () => {
				saveInterpreterSettingsFromForm();
			});
		}
		if (interpreterAutoRunToggle) {
			interpreterAutoRunToggle.addEventListener('change', () => {
				saveInterpreterSettingsFromForm();
			});
		}
	});
}

function initializeAutoSave(): void {
	const interpreterSettingsForm = document.getElementById('interpreter-settings-form');
	if (interpreterSettingsForm) {
		interpreterSettingsForm.addEventListener('input', debounce(saveInterpreterSettingsFromForm, 500));
	}
}

function saveInterpreterSettingsFromForm(): void {
	const apiKeyInput = document.getElementById('openai-api-key') as HTMLInputElement;
	const anthropicApiKeyInput = document.getElementById('anthropic-api-key') as HTMLInputElement;
	const modelSelect = document.getElementById('default-model') as HTMLSelectElement;
	const interpreterToggle = document.getElementById('interpreter-toggle') as HTMLInputElement;
	const interpreterAutoRunToggle = document.getElementById('interpreter-auto-run-toggle') as HTMLInputElement;

	const updatedSettings = {
		openaiApiKey: apiKeyInput.value,
		anthropicApiKey: anthropicApiKeyInput.value,
		interpreterModel: modelSelect.value,
		interpreterEnabled: interpreterToggle.checked,
		interpreterAutoRun: interpreterAutoRunToggle.checked
	};

	saveSettings(updatedSettings);
}

function debounce(func: Function, delay: number): (...args: any[]) => void {
	let timeoutId: NodeJS.Timeout;
	return (...args: any[]) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func(...args), delay);
	};
}

export function showInterpreterSettings(): void {
	const generalSection = document.getElementById('general-section');
	const interpreterSection = document.getElementById('interpreter-section');
	const templatesSection = document.getElementById('templates-section');

	if (generalSection) generalSection.style.display = 'none';
	if (interpreterSection) {
		interpreterSection.style.display = 'block';
		interpreterSection.classList.add('active');
	}
	if (templatesSection) templatesSection.style.display = 'none';

	updateUrl('interpreter');

	// Update sidebar active state
	document.querySelectorAll('.sidebar li').forEach(item => item.classList.remove('active'));
	const interpreterItem = document.querySelector('.sidebar li[data-section="interpreter"]');
	if (interpreterItem) interpreterItem.classList.add('active');
}