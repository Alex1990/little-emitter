type EventType = string | symbol;
type Listener = (...args: any[]) => void;

interface Emitter {
    addEventListener(event: EventType, listener: Listener): this;
    on(event: EventType, listener: Listener): this;

    emit(event: EventType, ...args: any[]): boolean;
    trigger(event: EventType, ...args: any[]): boolean;

    getListeners(event?: EventType): Array<Listener>;
    listeners(event?: EventType): Array<Listener>;

    off(event?: EventType, listener?: Listener): this;
    removeEventListener(event?: EventType, listener?: Listener): this;
    removeEventListeners(event?: EventType, listener?: Listener): this;

    once(event: EventType, listener: Listener): this;
    one(event: EventType, listener: Listener): this;
}

interface EmitterStatic {
    <T extends object>(target: T): T & Emitter;
    new(): Emitter;
}

declare const Emitter: EmitterStatic;

export = Emitter;
