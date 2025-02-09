import { isBrowser } from "$lib/internal/utils/browser.js";

/**
 * Returns a reactive value that is equal to `document.activeElement`.
 * It automatically listens for changes, keeping the reference up to date.
 *
 * @returns an object with a reactive value `value` that is equal to `document.activeElement`, or `null`
 * if there's no active element.
 */
export function useActiveElement(): { value: Readonly<Element | null> } {
	const activeElement = $state({ value: isBrowser() ? document.activeElement : null });

	function onFocusChange() {
		activeElement.value = document.activeElement;
	}

	$effect(() => {
		document.addEventListener("focusin", onFocusChange);
		document.addEventListener("focusout", onFocusChange);

		return () => {
			document.removeEventListener("focusin", onFocusChange);
			document.removeEventListener("focusout", onFocusChange);
		};
	});

	return activeElement;
}
