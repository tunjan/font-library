import { ButtonType } from "./pagination-buttons";

class SortBy extends HTMLElement {
  private mainApp = document.querySelector("main-app");

  public constructor() {
    super();
    this.button = this.button.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  private get sortBy(): string {
    return this.getAttribute("sort-by");
  }

  private set sortBy(value: string) {
    this.setAttribute("sort-by", value);
    if (this.mainApp) this.mainApp.setAttribute("sort-by", value);
  }

  private get resultsLength(): number {
    return Number.parseInt(this.getAttribute("results-length"), 10);
  }

  public render(): void {
    if (this.resultsLength === 0) {
      this.innerHTML = "";
      return;
    }
    const buttons = [
      {
        label: "Family",
        value: "family",
      },
      {
        label: "Last modified",
        value: "date",
      },
    ]
      .map((button) => this.button(button))
      .join("");

    this.innerHTML = `<div class="label">Sort by</div><div class="btn-group">${buttons}</div>`;

    for (const button of this.querySelectorAll("[data-sort]")) {
      button.addEventListener("click", this.handleSort);
    }
  }

  private button({ label, value }: { label: string; value: string }): string {
    const active = this.sortBy === value ? "active" : "";
    return `<button class="${active}" data-sort="${value}">${label}</button>`;
  }

  private handleSort(event: ButtonType): void {
    const value = (event.target as HTMLElement).dataset.sort;
    this.sortBy = value;
  }

  private static get observedAttributes(): string[] {
    return ["sort-by", "results-length"];
  }

  public attributeChangedCallback(
    name: string,
    oldValue: string,
    nextValue: string,
  ): void {
    if (oldValue === nextValue) return;
    this.render();
  }
}

customElements.define("sort-by", SortBy);
