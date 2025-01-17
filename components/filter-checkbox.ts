import customEvent from "./custom-event";

class FilterCheckbox extends HTMLInputElement {
  public constructor() {
    super();
    this.addEventListener("change", this.onChange);
    this.handleInitialValue();

    // Listen for events to clear filter
    window.addEventListener("remove-checkbox", () => {
      this.checked = false;
      this.onChange();
    });
  }

  private onChange(): void {
    this.dispatchEvent(
      customEvent("handle-filter", {
        value: this.checked,
        id: this.id,
      }),
    );
    this.setUrlParam();
  }

  private setUrlParam(): void {
    const urlParameters = new URLSearchParams(window.location.search);
    // only set variable if it's true
    if (this.checked === false) {
      urlParameters.delete("variable");
    } else {
      urlParameters.set("variable", "true");
    }
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${urlParameters.toString()}`,
    );
  }

  private handleInitialValue(): void {
    const urlParameters = new URLSearchParams(window.location.search);
    const initialValue = urlParameters.get("variable");
    if (initialValue === "true") {
      this.checked = true;

      // Wait for main-app to load before dispatching event
      window.addEventListener("main-app-loaded", () => {
        this.onChange();
      });
    }
  }
}

customElements.define("filter-checkbox", FilterCheckbox, { extends: "input" });
