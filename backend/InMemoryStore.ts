import type { Message } from "./types";
const EVICTION_TIME = 5 * 60 * 1000;

export class InMemoryStore {
    private static store: InMemoryStore;
    private store: Record<string, {
        messages: Message[],
        evictionTime: Date
    }>
    private constructor() {
        this.store = {};
    }

    static getInstance(){
        if(!InMemoryStore.store){
            InMemoryStore.store = new InMemoryStore();
        }
        return InMemoryStore.store;
    }

    add(converstationId: string, message: Message) {
        if(!this.store[converstationId]) {
            this.store[converstationId] = {
                messages: [],
                evictionTime: new Date.now() + 
            }
        }
    }
}