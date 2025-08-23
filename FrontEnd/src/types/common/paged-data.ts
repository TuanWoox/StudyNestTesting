import { Page } from "./page";

export interface PagedData<T, Tkey> {
    Data: T[],
    Page: Page<Tkey>
}