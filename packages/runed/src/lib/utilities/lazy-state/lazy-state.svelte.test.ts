import { describe, vi } from "vitest";
import { LazyState } from "./lazy-state.svelte.js";

describe("LazyState", () => {
	it("calls the factory only when `current` is first accessed", () => {
		const factory = vi.fn(() => 0);
		const counter = new LazyState(factory);
		expect(factory).toHaveBeenCalledTimes(0);

		expect(counter.current).toBe(0);
		expect(factory).toHaveBeenCalledTimes(1);

		expect(counter.current).toBe(0);
		expect(factory).toHaveBeenCalledTimes(1);
	});

	it("does not call the factory when `current` is set", () => {
		const factory = vi.fn(() => 0);
		const counter = new LazyState(factory);
		counter.current = 1;
		expect(counter.current).toBe(1);
		expect(factory).toHaveBeenCalledTimes(0);
	});
});
