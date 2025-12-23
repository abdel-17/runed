import { untrack } from "svelte";

/**
 * A stateful object that is lazily initialized.
 *
 * @see {@link https://runed.dev/docs/utilities/lazy-state}
 */
export class LazyState<T> {
	readonly #factory: () => T;

	/**
	 * @param factory - A function that returns the initial value of this object.
	 */
	constructor(factory: () => T) {
		this.#factory = factory;
	}

	#current: T | undefined = $state();
	#initialized = false;

	/** The current value of this object. */
	get current(): T {
		if (!this.#initialized) {
			untrack(() => {
				this.#current = this.#factory();
				this.#initialized = true;
			});
		}
		return this.#current!;
	}

	set current(value: T) {
		this.#current = value;
		this.#initialized = true;
	}
}
