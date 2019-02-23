declare module js {
    class Utils {
        static extractFileName(fileUrl: string): string;
        static extractDirectoryUrl(fileUrl: string): string;
        static createL2String(number: number): string;
        static createL4String(number: number): string;
        static watchValue(value: number, minValue: number, maxValue: number): number;
        static executeAction(action: any, argument: any): any;
    }
}
declare namespace Core {
    class Blocker {
        private progress;
        private eventor;
        constructor(progress?: boolean);
        add(handle: Element, action: Function): void;
        signal(progress?: boolean): void;
        clear(): void;
    }
}
declare namespace Core {
    type Map<V> = {
        [key: string]: V;
    };
}
declare namespace Core {
    class ConditionalAction {
        private barrier;
        private owner;
        private finalizer;
        private limiter;
        private counter;
        constructor(barrier: number, owner: any, finalizer: Function);
        schedule(owner: any, callback: Function): Function;
    }
}
declare namespace Core {
    class Cookies {
        private static initialised;
        private static cookies;
        private static setCache;
        private static removeCache;
        private static setCookie;
        private static removeCookie;
        static initialize(): void;
        static check(): boolean;
        static remove(name: string): void;
        static getText(name: string): string;
        static setText(name: string, value: string, expiration?: Date, domain?: string, path?: string): void;
        static getBoolean(name: string): boolean;
        static setBoolean(name: string, value: boolean, expiration: Date): void;
        static getNumber(name: string): number;
        static setNumber(name: string, value: number, expiration: Date): void;
        static getDate(name: string): Date;
        static setDate(name: string, value: Date, expiration: Date): void;
        static calculateSeconds(value: number): Date;
        static calculateMinutes(value: number): Date;
        static calculateHours(value: number): Date;
        static calculateDays(value: number): Date;
    }
}
declare namespace Core {
    class Delay {
        private handle;
        call(action: IAction, time: number): void;
        break(): void;
    }
}
declare namespace Core {
    class Position {
        x: number;
        y: number;
        constructor(x: number, y: number);
    }
    class Dom {
        static getHandle(id: string): Node;
        static findHandle(query: string, parent?: ParentNode): Node;
        static findHandles(query: string, parent?: ParentNode): NodeList;
        private static coverNode;
        static coverComment(handle: Comment, parent?: Node): ExtendedComment;
        static coverText(handle: Text, parent?: Node): ExtendedText;
        static coverElement(handle: Element, parent?: Node): ExtendedElement;
        static createComment(text: string, parent?: Node): ExtendedComment;
        static createText(text: string, parent?: Node): ExtendedText;
        static createElement(tag: string, parent?: Node): ExtendedElement;
        static prepareComment(text: string, parent: Node, placeholder?: Node): ExtendedComment;
        static prepareText(text: string, parent: Node, placeholder?: Node): ExtendedText;
        static prepareElement(tag: string, parent: Node, placeholder?: Node): ExtendedElement;
        static removeNode(handle: Node): void;
        static emptyElement(handle: Node): void;
        static cloneElement(handle: Element, parent?: Node): ExtendedElement;
        static showElement(handle: HTMLElement, display?: string): void;
        static hideElement(handle: HTMLElement): void;
        static exposeElement(handle: HTMLElement): void;
        static disguiseElement(handle: HTMLElement): void;
        static centerElement(handle: HTMLElement): void;
        static computePosition(handle: HTMLElement, limiter: HTMLElement): Position;
    }
}
declare namespace Core {
    class Event {
        static add(object: any | Element, event: string, action: Function, capturing?: boolean): IAction;
        static remove(object: any | Element, event: string, action: Function, capturing?: boolean): void;
    }
}
declare namespace Core {
    class Eventor {
        private actions;
        add(object: any | Element, event: string, action: Function, capturing?: boolean): void;
        clear(): void;
    }
}
declare namespace Core {
    class Incrementer {
        private counter;
        constructor(counter?: number);
        generate(): number;
    }
}
declare namespace Core {
    interface IAction {
        (): void;
    }
    interface IConsumer<T> {
        (argument: T): void;
    }
    interface IProducer<T> {
        (): T;
    }
    interface IFunction<TArgument, TResult> {
        (argument: TArgument): TResult;
    }
}
declare namespace Core {
    class Interval {
        private interval;
        private handle;
        private action;
        onAction?: IAction;
        constructor();
        start(interval?: number, extortion?: boolean): boolean;
        stop(): boolean;
    }
}
declare namespace Core {
    class Listener {
        private events;
        add(name: string, action: Function): IAction;
        remove(name: string, action: Function): void;
        fire(name: string, ...parameters: any[]): boolean;
        clear(): void;
    }
}
declare namespace Core {
    class Loader {
        static write(path: string): void;
    }
}
declare namespace Core {
    interface Docker {
        mount(placeholder?: Node, newParent?: Node): void;
        remove(): void;
    }
    interface ExtendedNode extends Docker, Node {
    }
    interface ExtendedComment extends Docker, Comment {
    }
    interface ExtendedText extends Docker, Text {
    }
    interface ExtendedElement extends Docker, Element {
    }
}
declare namespace Core {
    class ObjectUtils {
        static cloneObject(object: any): any;
        static createPath(names: Array<string>): object;
        static findHead(object: object): string;
        static findTail(object: object): string;
        static getHead(object: object): any;
        static getTail(object: object): any;
    }
}
declare namespace Core {
    class Parser {
        static parseInteger(text?: string): number;
        static parseFloat(text?: string): number;
        static parseSource(source: string): any;
    }
}
declare namespace Core {
    interface IProtect {
        (check: IAction): void;
    }
    class Protector {
        static mediate(action: IProtect): void;
        static create(action: Function): Function;
    }
}
declare namespace Core {
    enum ScrollerMode {
        Horizontal = 1,
        Vertical = 2
    }
    class MouseScroller {
        private eventor;
        addListener(element: Element, mode?: ScrollerMode, padding?: number): void;
        clearListeners(): void;
    }
    class TouchScroller {
        private eventor;
        addListener(element: Element, mode?: ScrollerMode): void;
        clearListeners(): void;
    }
    class DirectedScroller {
        private interrupt;
        private destroyed;
        private handles;
        private hAction;
        private vAction;
        private interval;
        constructor(interrupt?: number);
        addWorkspace(handle: Element): void;
        startScrolling(mode: ScrollerMode, velocity: number): void;
        stopScrolling(mode?: ScrollerMode): void;
        destroy(): void;
    }
    class ExtendedDirectedScroller {
        private destroyed;
        private eventor;
        private scroller;
        constructor(interrupt?: number);
        addWorkspace(handle: Element): void;
        addStarter(element: Element, event: string, mode: ScrollerMode, velocity: number): void;
        addStopper(element: Element, event: string, mode: ScrollerMode): void;
        suspend(): void;
        destroy(): void;
    }
}
declare namespace Core {
    class Stopwatch {
        private handle;
        onInterval: (time: number) => void;
        onFinished: (time: number) => void;
        start(limit: number, interval?: number): boolean;
        stop(): boolean;
    }
}
declare namespace Core {
    class Style {
        static get(handle: Element, name: string): string | null;
        static getWidth(handle: Element): number | null;
        static getHeight(handle: Element): number | null;
    }
}
declare namespace Core {
    class Styling {
        private list;
        constructor(handle: Element);
        set(condition: boolean, style: string): void;
        add(style: string): void;
        remove(style: string): void;
    }
}
declare namespace Core {
    class Time {
        static getMilliseconds(): number;
    }
}
declare namespace Core {
    class Timeout {
        private timeout;
        private handle;
        private action;
        onAction?: IAction;
        constructor();
        start(timeout?: number, extortion?: boolean): boolean;
        stop(): boolean;
    }
}
declare namespace Core {
    class Updater {
        private time;
        constructor(time: Date);
        private checkDate;
        reload(): boolean;
        static prepare(date: Date): void;
    }
}
declare namespace Core.Organizer {
    enum InjectionName {
        Organizer = "ORGANIZER",
        Parent = "PARENT",
        Loops = "LOOPS",
        Controllers = "CONTROLLERS",
        Compositions = "COMPOSITIONS"
    }
    class InjectionSurrogate {
        service: string;
        item: string;
        selector: IFunction<any, any>;
        variable: string;
        constructor(service: string, item: string, selector: IFunction<any, any>, variable: string);
    }
    class SubscriptionSurrogate {
        service: string;
        event: string;
        target: any;
        key: string;
        constructor(service: string, event: string, target: any, key: string);
    }
    class ContainerSurrogate<T extends Instance<E>, E extends string> {
        name: string;
        type: InstanceType<T, E>;
        instance: T;
        constructor(name: string, type: InstanceType<T, E>, instance: T);
    }
    function injection(service: string): any;
    function injection(service: InjectionName.Organizer): any;
    function injection(service: InjectionName.Parent): any;
    function injection(service: InjectionName.Loops, item?: string): any;
    function injection(service: InjectionName.Controllers, item?: string): any;
    function injection(service: InjectionName.Compositions, item?: string, selector?: IFunction<CompositionEntry, any>): any;
    function subscription<T extends string>(service: string, event: T): any;
    class Transitor {
        private organizer;
        private master;
        private debug;
        private services;
        private factories;
        private buffer;
        private events;
        constructor(organizer: Organizer, master: Tube<Object>, debug?: boolean);
        private applyInjections;
        private applySubscriptions;
        static detectInjections(type: ControllerType<any, any>): Array<InjectionSurrogate>;
        static detectSubscriptions(type: ControllerType<any, any>): Array<SubscriptionSurrogate>;
        addService<E extends string>(name: string, service: ServiceType<E>): void;
        addFactory<E extends string>(name: string, factory: FactoryType<E>): void;
        construct(): void;
        release(): void;
    }
}
declare namespace Core.Template {
    class Preprocessor {
        private static readonly VARIABLE_PATTERN;
        static compile(template: string, variables: Map<string>): string;
    }
}
declare namespace Core.Template {
    class Template {
        private static readonly REGEX;
        private static prepareHandle;
        private static prepareEvent;
        private static prepareEvents;
        static expose(element: Element, scope: any, handled?: boolean, debug?: boolean): void;
        static compile(template: string, scope: any, parent?: Element, handled?: boolean, debug?: boolean): ExtendedElement;
        static mount(template: string, scope: any, parent: Element, placeholder?: Element, handled?: boolean, debug?: boolean): ExtendedElement;
    }
}
declare namespace Core.Organizer {
    class Backbone {
        private templates;
        private organizer;
        private services;
        private bridges;
        private resources;
        private debug;
        constructor(templates: Map<TemplatePattern>, organizer: Organizer, services: Tube<Object>, bridges: Tube<Bridge>, resources: Tube<Resource>, debug?: boolean);
        static getHandle(node: CompositionNode): Element;
        static getController(patterns: Map<ControllerPattern>): ControllerEntity;
        static hasPattern(patterns: Map<ParentPattern>): boolean;
        constructLogic(pattern: ScopePattern, resource: Resource, parent?: Controller<any>, index?: number, data?: any): ControllerNode;
        constructBridge(bridge: Bridge, parent?: Controller<any>): CompositionNode;
        constructController(pattern: ControllerPattern, resource?: Resource, parent?: Controller<any>, index?: number, data?: any): ControllerNode;
        mountController(pattern: ControllerPattern, parent: Controller<any> | null, placeholder: SinglePlaceholder): ControllerNode;
        mountControllers(patterns: Map<ControllerPattern>, parent: Controller<any> | null, placeholder: SinglePlaceholder): Map<ControllerNode>;
        prepareControllers(patterns: Map<ControllerPattern>, parent: Controller<any> | null, hMaster: Element): Map<ControllerNode>;
        constructLoop(pattern: LoopPattern, parent: Controller<any> | null, hMaster: Element): LoopNode;
        constructLoops(patterns: Map<LoopPattern>, parent: Controller<any> | null, hMaster: Element): Map<LoopNode>;
        prepareLoops(patterns: Map<LoopPattern>, parent: Controller<any> | null, hMaster: Element): Map<LoopNode>;
        constructComposition(pattern: RootPattern | TemplatePattern, parent?: Controller<any>): CompositionNode;
        mountComposition(pattern: CompositionPattern, parent: Controller<any> | null, placeholder: SinglePlaceholder): CompositionNode;
        mountCompositions(patterns: Map<CompositionPattern>, parent: Controller<any> | null, placeholder: SinglePlaceholder): Map<CompositionNode>;
        prepareCompositions(patterns: Map<CompositionPattern>, parent: Controller<any> | null, hMaster: Element): Map<CompositionNode>;
    }
}
declare namespace Core.Organizer {
    enum InstanceMode {
        Singleton = 0,
        Transient = 1
    }
    function organizer(name: string, template?: string, master?: boolean): any;
    function service(name: string): any;
    function controller(name: string): any;
    class Entity {
        private path;
        private organizer;
        private bridge;
        private master;
        constructor(path: string, organizer: Organizer, bridge: Bridge | null, master: boolean);
        getPath(): string;
        getOrganizer(): Organizer;
        getBridge(): Bridge | null;
        getMaster(): boolean;
    }
    class Bootstrap {
        private static analyze;
        private static construct;
        static run(namespace: any, master?: Organizer): Entity;
    }
}
declare namespace Core.Organizer {
    class Bridge {
        private root;
        private compositor;
        private callback;
        constructor(root: RootPattern, compositor: Compositor, callback: IAction);
        compose<T>(parent?: Controller<T>): Composition;
    }
}
declare namespace Core.Organizer {
    import CompositionCollection = Core.Organizer.CompositionCollection;
    class Changer {
        private parent;
        private container;
        private compositions;
        private destroyed;
        private instances;
        private name;
        private cache;
        private started;
        constructor(parent: any | null, container: Element, compositions: CompositionCollection);
        composeTemplate(name: string): void;
        switchComposition(name: string, data?: any): void;
        startComposition(): void;
        stopComposition(): void;
        destroy(): void;
    }
}
declare namespace Core.Organizer {
    interface IIteration<T> {
        (index: number, data: T): boolean;
    }
    interface ICollection {
        getSize(): number;
        addItem(item: ItemNode): void;
        clearItems(): boolean;
        iterateItems(action: IIteration<ItemNode>): void;
    }
    class IndexedCollection implements ICollection {
        private array;
        getSize(): number;
        getItem(index: number): ItemNode;
        addItem(item: ItemNode): void;
        insertItem(index: number, item: ItemNode): void;
        removeItem(index: number): ItemNode;
        dropItem(item: ItemNode): void;
        clearItems(): boolean;
        iterateItems(action: IIteration<ItemNode>): void;
    }
    class MappedCollection implements ICollection {
        private path;
        private map;
        private size;
        constructor(path?: Array<string>);
        private extractKey;
        getSize(): number;
        getItem(key: number | string): ItemNode;
        addItem(item: ItemNode): void;
        removeItem(key: number | string): ItemNode;
        dropItem(item: ItemNode): void;
        clearItems(): boolean;
        iterateItems(action: IIteration<ItemNode>): void;
    }
    class ComposedCollection implements ICollection {
        private collections;
        private master;
        constructor(collections: Array<ICollection>);
        getSize(): number;
        addItem(item: ItemNode): void;
        clearItems(): boolean;
        iterateItems(action: IIteration<ItemNode>): void;
    }
}
declare namespace Core.Organizer {
    interface IExtendedIteration<C, T> {
        (index: number, data: T, controller: C, tag: any): boolean;
    }
    class LoopEntry<C extends Controller<T>, T> {
        private pattern;
        private resource;
        private parent;
        private organizer;
        private backbone;
        private services;
        private array;
        private map;
        private collection;
        private placeholder;
        private scope;
        constructor(pattern: LoopPattern, resource: Resource | null, parent: Controller<any> | null, organizer: Organizer, backbone: Backbone, services: Tube<Object>, array: IndexedCollection, map: MappedCollection, collection: ComposedCollection, placeholder: MultiPlaceholder, scope: LoopScope);
        private getPlaceholder;
        private createItem;
        getSize(): number;
        getIndex(index: number): ItemEntry<C, T> | null;
        getKey(key: number | string): ItemEntry<C, T> | null;
        iterateItems(iteration: IExtendedIteration<C, T>): void;
        addItem(data: T, type?: ControllerType<C, T>, tag?: any): ItemInstanceEntry<C, T>;
        addItems(data: Array<T>, type?: ControllerType<C, T>): void;
        insertItem(index: number, data: T, type?: ControllerType<C, T>, tag?: any): ItemInstanceEntry<C, T>;
        insertItems(index: number, data: Array<T>, type?: ControllerType<C, T>): void;
        bindItems(data: Array<T>, type?: ControllerType<C, T>): void;
        cleanItems(): boolean;
        removeKey(id: number | string): ItemInformationEntry<C, T> | null;
        removeIndex(index: number): ItemInformationEntry<C, T> | null;
    }
}
declare namespace Core.Organizer {
    class Composition {
        private composition;
        private handle;
        private entry;
        private scope;
        constructor(composition: CompositionNode);
        getHandle(): Element;
        getController<C extends Controller<T>, T>(name?: string): C;
        getLoop<C extends Controller<T>, T>(name?: string): LoopEntry<C, T>;
        mount(hParent: Node, hBefore?: Node): void;
        replace(hElement: Node): void;
        remove(): void;
        start(): void;
        stop(): void;
        destroy(): void;
    }
}
declare namespace Core.Organizer {
    class CompositionCollection {
        private compositions;
        private organizer;
        private bridges;
        constructor(compositions: Map<CompositionNode>, organizer: Organizer, bridges: Tube<Bridge>);
        getComposition(name: string): CompositionEntry;
        composeTemplate<T>(name: string, parent?: Controller<T>): Composition;
    }
}
declare namespace Core.Organizer {
    class CompositionEntry {
        protected handle: Element | null;
        protected scope: CompositionScope;
        constructor(handle: Element | null, scope: CompositionScope);
        getController<C extends Controller<T>, T>(name?: string): C;
        getLoop<C extends Controller<T>, T>(name?: string): LoopEntry<C, T>;
    }
}
declare namespace Core.Organizer {
    class CompositionNode {
        entry: CompositionEntry;
        scope: CompositionScope;
        constructor(entry: CompositionEntry, scope: CompositionScope);
        start(): void;
        stop(): void;
        destroy(): void;
    }
}
declare namespace Core.Organizer {
    class CompositionScope {
        handle: Element | null;
        controllers: Map<ControllerNode>;
        loops: Map<LoopNode>;
        compositions: Map<CompositionNode>;
        destroyed: boolean;
        working: boolean;
        constructor(handle: Element | null, controllers: Map<ControllerNode>, loops: Map<LoopNode>, compositions: Map<CompositionNode>);
        private startControllers;
        private startLoops;
        private startCompositions;
        private stopControllers;
        private stopLoops;
        private stopCompositions;
        private destroyControllers;
        private destroyLoops;
        private destroyCompositions;
        start(): void;
        stop(): void;
        destroy(): void;
    }
}
declare namespace Core.Organizer {
    class ControllerEntity {
        name: string;
        pattern: ControllerPattern;
        constructor(name: string, pattern: ControllerPattern);
    }
    class Compositor {
        private organizer;
        private services;
        private bridges;
        private resources;
        private debug;
        constructor(organizer: Organizer, services: Tube<Object>, bridges: Tube<Bridge>, resources: Tube<Resource>, debug?: boolean);
        compose(root: RootPattern, parent?: Controller<any>): Composition;
    }
}
declare namespace Core.Organizer {
    class ControllerCollection {
        private controllers;
        private organizer;
        constructor(controllers: Map<ControllerNode>, organizer: Organizer);
        getController<C extends Controller<T>, T>(name: string): C;
    }
}
declare namespace Core.Organizer {
    class ControllerEntry {
        protected handle: Element;
        protected instance: Controller<any>;
        protected scope: ControllerScope;
        constructor(handle: Element, instance: Controller<any>, scope: ControllerScope);
    }
}
declare namespace Core.Organizer {
    class ControllerNode {
        entry: ControllerEntry;
        scope: ControllerScope;
        constructor(entry: ControllerEntry, scope: ControllerScope);
        start(): void;
        stop(): void;
        destroy(): void;
    }
}
declare namespace Core.Organizer {
    class ControllerScope {
        handle: Element;
        instance: Controller<any> | any;
        subscriptions: Array<IAction>;
        controllers: Map<ControllerNode>;
        loops: Map<LoopNode>;
        compositions: Map<CompositionNode>;
        destroyed: boolean;
        working: boolean;
        constructor(handle: Element, instance: Controller<any> | any, subscriptions: Array<IAction>, controllers: Map<ControllerNode>, loops: Map<LoopNode>, compositions: Map<CompositionNode>);
        private startControllers;
        private startLoops;
        private startCompositions;
        private startInstance;
        private stopControllers;
        private stopLoops;
        private stopCompositions;
        private stopInstance;
        private destroySubscriptions;
        private destroyControllers;
        private destroyLoops;
        private destroyCompositions;
        private destroyInstance;
        start(): void;
        stop(): void;
        destroy(): void;
    }
}
declare namespace Core.Template {
    class Html {
        private static readonly REGEX;
        private static detect;
        static inject(tag: string, template: string, parent?: Node): ExtendedElement;
        static cover(template: string, parent?: Node): ExtendedElement;
        static extract(template: Element, parent?: Node): ExtendedElement;
        static parse(template: string, parent?: Element): ExtendedElement;
    }
}
declare namespace Core.Organizer {
    class Decompositor {
        private debug;
        private static counter;
        constructor(debug?: boolean);
        private findMaster;
        private findParent;
        private createPlaceholder;
        private collectScope;
        private releaseScope;
        decompose(template: string, variables?: Map<string>): RootPattern;
    }
}
declare namespace Core.Organizer {
    class Variable {
        name: string;
        type: string;
        constructor(name: string, type: string);
    }
    class Method {
        name: string;
        parameters: Array<string>;
        constructor(name: string, parameters: Array<string>);
    }
    class Parameter {
        name: string;
        methods: Array<Method>;
        constructor(name: string, methods: Array<Method>);
    }
    class Interpolator {
        private static NAME_REGEX;
        private static PATH_REGEX;
        private static VARIABLE_REGEX;
        private static PARAMETER_REGEX;
        private static DECLARATION_REGEX;
        static extractName(text: string): string;
        static extractPath(text: string): string;
        static extractParameters(text: string): Array<string>;
        static extractMethods(text: string): Array<Method>;
        static parseVariable(text: string): Variable;
        static parseParameter(text: string): Parameter;
    }
}
declare namespace Core.Organizer {
    class ItemEntry<C extends Controller<T>, T> {
        protected handle: Element;
        protected data: T;
        protected controller: C;
        protected tag: any;
        protected scope: ItemScope;
        constructor(handle: Element, data: T, controller: C, tag: any, scope: ItemScope);
        getHandle(): Element;
        getData(): T;
        getController(): C;
        getTag(): any;
    }
    class ItemInformationEntry<C extends Controller<T>, T> {
        protected data: T;
        protected tag: any;
        protected scope: ItemScope;
        constructor(data: T, tag: any, scope: ItemScope);
        getData(): T;
        getTag(): any;
    }
    class ItemInstanceEntry<C extends Controller<T>, T> {
        protected handle: Element;
        protected controller: C;
        protected scope: ItemScope;
        constructor(handle: Element, controller: C, scope: ItemScope);
        getHandle(): Element;
        getController(): C;
    }
}
declare namespace Core.Organizer {
    class ItemNode {
        entry: ItemEntry<any, any>;
        scope: ItemScope;
        constructor(entry: ItemEntry<any, any>, scope: ItemScope);
        start(): void;
        stop(): void;
        destroy(): void;
    }
}
declare namespace Core.Organizer {
    class ItemScope {
        handle: Element;
        instance: Controller<any> | any;
        subscriptions: Array<IAction>;
        controllers: Map<ControllerNode>;
        loops: Map<LoopNode>;
        compositions: Map<CompositionNode>;
        destroyed: boolean;
        working: boolean;
        constructor(handle: Element, instance: Controller<any> | any, subscriptions: Array<IAction>, controllers: Map<ControllerNode>, loops: Map<LoopNode>, compositions: Map<CompositionNode>);
        private startControllers;
        private startLoops;
        private startCompositions;
        private startInstance;
        private stopControllers;
        private stopLoops;
        private stopCompositions;
        private stopInstance;
        private destroySubscriptions;
        private destroyControllers;
        private destroyLoops;
        private destroyCompositions;
        private destroyInstance;
        start(): void;
        stop(): void;
        destroy(): void;
    }
}
declare namespace Core.Organizer {
    class LoopCollection {
        private loops;
        private organizer;
        constructor(loops: Map<LoopNode>, organizer: Organizer);
        getLoop<C extends Controller<T>, T>(name: string): LoopEntry<C, T>;
    }
}
declare namespace Core.Organizer {
    class LoopNode {
        entry: LoopEntry<any, any>;
        scope: LoopScope;
        constructor(entry: LoopEntry<any, any>, scope: LoopScope);
        start(): void;
        stop(): void;
        destroy(): void;
    }
}
declare namespace Core.Organizer {
    class LoopScope {
        protected collection: ComposedCollection;
        destroyed: boolean;
        working: boolean;
        constructor(collection: ComposedCollection);
        start(): void;
        stop(): void;
        destroy(): void;
    }
}
declare namespace Core.Organizer {
    abstract class Instance<E extends string> {
        private static counter_1545024291;
        static readonly INJECTIONS: Array<InjectionSurrogate>;
        static readonly SUBSCRIPTIONS: Array<SubscriptionSurrogate>;
        private readonly id_1545024291;
        protected onCreate(): void;
        protected onDestroy(): void;
        protected onStart(): void;
        protected onStop(): void;
        addListener(name: E, action: Function): IAction;
        removeListener(name: E, action: Function): void;
        toString(): string;
    }
    type InstanceType<T extends Instance<E>, E extends string> = {
        new (organizer?: Organizer): T;
        INJECTIONS: Array<InjectionSurrogate>;
        SUBSCRIPTIONS: Array<SubscriptionSurrogate>;
    };
    abstract class Service<E extends string> extends Instance<E> {
    }
    type ServiceType<E extends string> = {
        new (organizer?: Organizer): Service<E>;
        INJECTIONS: Array<InjectionSurrogate>;
        SUBSCRIPTIONS: Array<SubscriptionSurrogate>;
    };
    abstract class Factory<E extends string> extends Instance<E> {
        abstract get(): Object;
    }
    type FactoryType<E extends string> = {
        new (organizer?: Organizer): Factory<E>;
        INJECTIONS: Array<InjectionSurrogate>;
        SUBSCRIPTIONS: Array<SubscriptionSurrogate>;
    };
    abstract class Controller<T> {
        private static counter_1545024291;
        static readonly INJECTIONS: Array<InjectionSurrogate>;
        static readonly SUBSCRIPTIONS: Array<SubscriptionSurrogate>;
        private readonly id_1545024291;
        protected onCreate(index: number, data: T): void;
        protected onDestroy(): void;
        protected onStart(): void;
        protected onStop(): void;
        toString(): string;
    }
    type ControllerType<C extends Controller<T>, T> = {
        new (organizer?: Organizer): C;
        INJECTIONS: Array<InjectionSurrogate>;
        SUBSCRIPTIONS: Array<SubscriptionSurrogate>;
    };
    class Organizer {
        private static counter;
        private destroyed;
        private readonly id;
        private readonly name;
        private readonly debug;
        private readonly master;
        private readonly slaves;
        private readonly bridges;
        private readonly services;
        private readonly resources;
        private readonly transitor;
        private readonly decompositor;
        private readonly compositor;
        constructor(name: string, master?: Organizer, debug?: boolean);
        private construct;
        getName(): string;
        addService<E extends string>(name: string, service: ServiceType<E>): void;
        addFactory<E extends string>(name: string, factory: FactoryType<E>): void;
        addObject<T>(name: string, object: T): void;
        addController<C extends Controller<T>, T>(name: string, controller: ControllerType<C, T>): void;
        addTemplate(name: string, template: string, variables?: Map<string>): void;
        addBridge(name: string, bridge: Bridge): void;
        compileTemplate(template: string, variables?: Map<string>): Bridge;
        composeTemplate<T>(template: string, parent?: Controller<T>, variables?: Map<string>): Composition;
        destroy(): void;
        toString(): string;
    }
}
declare namespace Core.Organizer {
    class ParentPattern {
        parent: ScopePattern;
        identifier: string;
        constructor(parent: ScopePattern, identifier: string);
    }
    class ScopePattern extends ParentPattern {
        handle: Element;
        loops: Map<LoopPattern>;
        controllers: Map<ControllerPattern>;
        compositions: Map<CompositionPattern>;
        constructor(parent: ScopePattern, identifier: string, handle: Element);
    }
    class RootPattern extends ScopePattern {
        templates: Map<TemplatePattern>;
        constructor(handle: Element);
    }
    class TemplatePattern extends ScopePattern {
        constructor(handle: Element);
    }
    class LoopPattern extends ScopePattern {
        name: string;
        functions: Array<Method>;
        logic: string;
        constructor(parent: ScopePattern, handle: Element, identifier: string, name: string, functions: Array<Method>, logic: string);
    }
    class ControllerPattern extends ScopePattern {
        name: string;
        type: string;
        constructor(parent: ScopePattern, handle: Element, identifier: string, name: string, type: string);
    }
    class CompositionPattern extends ScopePattern {
        name: string;
        template: string;
        constructor(parent: ScopePattern, identifier: string, name: string, template: string);
    }
}
declare namespace Core.Organizer {
    class SinglePlaceholder {
        private hMaster;
        constructor(hMaster: Element);
        mount(hScope: Node, scope: ParentPattern): void;
    }
    class MultiPlaceholder {
        private identifier;
        private hPlaceholder;
        private hParent;
        constructor(hMaster: Element, scope: ParentPattern);
        mount(hScope: Node, hPlaceholder?: Node): void;
    }
}
declare namespace Core.Organizer {
    class Presenter {
        private buildText;
        private buildTemplate;
        private buildTemplates;
        private buildLoop;
        private buildLoops;
        private buildController;
        private buildControllers;
        private buildComposition;
        private buildCompositions;
        constructHtml(root: RootPattern): string;
        constructStructure(organizer: Organizer): string;
    }
}
declare namespace Core.Organizer {
    class Resource {
        controller: ControllerType<any, any>;
        services: Tube<Object>;
        constructor(controller: ControllerType<any, any>, services: Tube<Object>);
    }
}
declare namespace Core.Organizer {
    interface Tube<T> {
        has(name: string, deep?: boolean): boolean;
        get(name: string, deep?: boolean): T;
        add(name: string, object: T): void;
        iterate(iteration: IIteration<T>, deep?: boolean): void;
    }
    class SingleTube<T> implements Tube<T> {
        private objects;
        has(name: string, deep?: boolean): boolean;
        get(name: string, deep?: boolean): T;
        add(name: string, object: T): void;
        iterate(iteration: IIteration<T>, deep?: boolean): void;
    }
    class MultiTube<T> implements Tube<T> {
        private master;
        private objects;
        constructor(master: Tube<T>, objects?: Map<T>);
        has(name: string, deep?: boolean): boolean;
        get(name: string, deep?: boolean): T;
        add(name: string, object: T): void;
        iterate(iteration: IIteration<T>, deep?: boolean): void;
    }
}
declare namespace Core.Validation {
    interface IValidator {
        validate(): boolean;
        reset(): void;
    }
}
declare namespace Core.Validation {
    class CheckboxSelectionCondition implements ICondition {
        private hInput;
        private expected;
        constructor(hInput: HTMLInputElement, expected?: boolean);
        check(): boolean;
    }
}
declare namespace Core.Validation {
    class CompleteValidator implements IValidator {
        private array;
        add(validator: IValidator): void;
        validate(): boolean;
        reset(): void;
    }
}
declare namespace Core.Validation {
    class ConditionalValidator implements IValidator {
        private conditions;
        private validators;
        addCondition(condition: ICondition): void;
        addValidator(validator: IValidator): void;
        validate(): boolean;
        reset(): void;
    }
}
declare namespace Core.Validation {
    interface ICondition {
        check(): boolean;
    }
}
declare namespace Core.Validation {
    class TypeTextValidator implements IValidator {
        private hInput;
        private hMessage;
        private error;
        constructor(hInput: HTMLInputElement, hMessage: HTMLSpanElement, error?: string);
        validate(): boolean;
        reset(): void;
    }
}
declare interface Array<T> {
    find(element: any, offset?: number): number;
    remove(element: T): T;
    clear(): void;
    clone(): Array<T>;
}
