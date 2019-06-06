namespace Core.Organizer
{
    export enum InjectionName
    {
        Organizer = 'ORGANIZER',
        Parent = 'PARENT',
        Loops = 'LOOPS',
        Controllers = 'CONTROLLERS',
        Compositions = 'COMPOSITIONS'
    }

    export class InjectionSurrogate
    {
        public constructor( public service : string, public item : string, public selector : IFunction<any, any>, public variable : string )
        {
            // nothing here...
        }
    }

    export class SubscriptionSurrogate
    {
        public constructor( public service : string, public event : string, public target : any, public key : string )
        {
            // nothing here...
        }
    }

    export class ContainerSurrogate<T extends Instance<E>, E extends string>
    {
        public constructor( public name : string, public type : InstanceType<T, E>, public instance : T )
        {
            // nothing here...
        }
    }

    export function injection( service : string ) : any;
    export function injection( service : InjectionName.Organizer ) : any;
    export function injection( service : InjectionName.Parent ) : any;
    export function injection( service : InjectionName.Loops, item ? : string ) : any;
    export function injection( service : InjectionName.Controllers, item ? : string ) : any;
    export function injection( service : InjectionName.Compositions, item ? : string, selector ? : IFunction<CompositionEntry, any> ) : any;

    export function injection( service : string, item ? : string, selector ? : IFunction<any, any> ) : any
    {
        if( service == null )
            throw new Error( '@injection service name is not defined.' );

        return function( target : any, key : string ) : any
        {
            let injections : Array<InjectionSurrogate> = target.constructor.INJECTIONS;

            if( injections == null )
                injections = target.constructor.INJECTIONS = [ ];

            injections.push( new InjectionSurrogate( service, item, selector, key ) );
        };
    }

    export function subscription<T extends string>( service : string, event : T ) : any
    {
        if( service == null )
            throw new Error( '@subscription service name is not defined.' );

        if( event == null )
            throw new Error( '@subscription event name is not defined.' );

        return function( target : any, key : string ) : any
        {
            let subscriptions : Array<SubscriptionSurrogate> = target.constructor.SUBSCRIPTIONS;

            if( subscriptions == null )
                subscriptions = target.constructor.SUBSCRIPTIONS = [ ];

            subscriptions.push( new SubscriptionSurrogate( service, event, target, key ) );
        };
    }

    export class Transistor
    {
        // variables

        private services : Array<ContainerSurrogate<Service<any>, any>> = [ ];
        private factories : Array<ContainerSurrogate<Factory<any>, any>> = [ ];

        private buffer : Array<Instance<any>> = [ ];
        private events : Array<IAction> = [ ];

        // constructors

        public constructor( private organizer : Organizer, private master : Tube<Object>, private debug : boolean = false )
        {
            // nothing here ...
        }

        // helper methods

        private applyInjections<T extends Instance<E>, E extends string>( cache : Map<Object>, container : ContainerSurrogate<T, E> ) : void
        {
            let injections = Transistor.detectInjections( container.type );

            if( injections ) // jesli wykryto zależności
            {
                let instance = container.instance;

                for( let entry of injections )
                {
                    if( entry.variable in instance )
                        throw new Error( 'Injection: Variable "' + entry.variable +  '" already exist in service "' + container.name + ' (type: ' + container.type[ 'name' ] + ')" in organizer "' + this.organizer.getName() + '".' );

                    let service = cache[ entry.service ];

                    if( service == null )
                    {
                        service = this.master.get( entry.service, true );

                        if( service == null )
                            throw new Error( 'Injection: Service "' + entry.service + '" does not exist for service "' + container.name + ' (type: ' + container.type[ 'name' ] + ')" in organizer "' + this.organizer.getName() + '" (factories require specific adding order to be visible for other factories).' );

                        cache[ entry.service ] = service;
                    }

                    if( entry.item )
                        throw new Error( 'Injection item can be used only with "' + InjectionName.Loops + '", "' + InjectionName.Controllers + '" or "' + InjectionName.Compositions + '" service injection in controllers.' );

                    instance[ entry.variable ] = service;
                }
            }
        }

        private applySubscriptions<T extends Instance<E>, E extends string>( cache : Map<Object>, container : ContainerSurrogate<T, E> ) : void
        {
            let subscriptions = Transistor.detectSubscriptions( container.type );

            if( subscriptions ) // jeśli wykryto zdarzenia
            {
                let instance = container.instance;

                for( let entry of subscriptions )
                {
                    let action = instance[ entry.key ];

                    if( action == null )
                        throw new Error( 'Subscription: Method "' + entry.key +  '" does not exist in service "' + container.name + ' (type: ' + container.type[ 'name' ] + ')" in organizer "' + this.organizer.getName() + '".' );

                    let service = cache[ entry.service ];

                    if( service == null )
                    {
                        service = this.master.get( entry.service, true );

                        if( service == null )
                            throw new Error( 'Subscription: Service "' + entry.service +  '" does not exist for service "' + container.name + ' (type: ' + container.type[ 'name' ] + ')" in organizer "' + this.organizer.getName() + '" (factories require specific adding order to be visible for other factories).' );

                        cache[ entry.service ] = service;
                    }

                    let cast = service as Instance<any>;

                    if( cast.addListener )
                    {
                        let proxy = action.bind( instance );

                        this.events.push( cast.addListener( entry.event, proxy ) );
                    }
                    else
                        throw new Error( 'Subscription: Service "' + entry.service +  '" has not addListener method (organizer "' + this.organizer.getName() + '").' );
                }
            }
        }

        // private apply<T extends Instance<E>, E extends string>( container : ContainerSurrogate<T, E> ) : T
        // {
        //     let instance = container.instance;
        //
        //     let injections = Transitor.detectInjections( container.type );
        //     let subscriptions = Transitor.detectSubscriptions( container.type );
        //
        //     let cache : Map<Object> = { };
        //
        //     if( injections ) // jesli wykryto zależności
        //     {
        //         for( let entry of injections )
        //         {
        //             if( entry.variable in instance )
        //                 throw new Error( 'Injected variable "' + entry.variable +  '" already exist in service "' + container.name + ' (type: ' + container.type[ 'name' ] + ')" in organizer "' + this.name + '".' );
        //
        //             let service = cache[ entry.service ];
        //
        //             if( service == null )
        //             {
        //                 service = this.master.get( entry.service, true );
        //
        //                 if( service == null )
        //                     throw new Error( 'Injected service "' + entry.service + '" does not exist for service "' + container.name + ' (type: ' + container.type[ 'name' ] + ')" in organizer "' + this.name + '" (factories require specific adding order to be visible for other factories).' );
        //
        //                 cache[ entry.service ] = service;
        //             }
        //
        //             instance[ entry.variable ] = service;
        //         }
        //     }
        //
        //     if( subscriptions ) // jeśli wykryto zdarzenia
        //     {
        //         for( let entry of subscriptions )
        //         {
        //             let action = instance[ entry.key ];
        //
        //             if( action == null )
        //                 throw new Error( 'Method "' + entry.key +  '" does not exist in service "' + container.name + ' (type: ' + container.type[ 'name' ] + ')" in organizer "' + this.name + '".' );
        //
        //             let service = cache[ entry.service ];
        //
        //             if( service == null )
        //             {
        //                 service = this.master.get( entry.service, true );
        //
        //                 if( service == null )
        //                     throw new Error( 'Subscription service "' + entry.service +  '" does not exist for service "' + container.name + ' (type: ' + container.type[ 'name' ] + ')" in organizer "' + this.name + '" (factories require specific adding order to be visible for other factories).' );
        //
        //                 cache[ entry.service ] = service;
        //             }
        //
        //             let cast = service as Instance<any>;
        //
        //             if( cast.addListener )
        //             {
        //                 let proxy = action.bind( instance );
        //
        //                 this.events.push( cast.addListener( entry.event, proxy ) );
        //             }
        //             else
        //                 throw new Error( 'Service "' + entry.service +  '" has not addListener method (organizer "' + this.name + '").' );
        //         }
        //     }
        //
        //     return container.instance;
        // }

        // public methods

        public static detectInjections( type : ControllerType<any, any> ) : Array<InjectionSurrogate>
        {
            while( type )
            {
                let injections = type.INJECTIONS;

                if( injections )
                    return injections;

                type = type.prototype;
            }

            return null;
        }

        public static detectSubscriptions( type : ControllerType<any, any> ) : Array<SubscriptionSurrogate>
        {
            while( type )
            {
                let subscriptions = type.SUBSCRIPTIONS;

                if( subscriptions )
                    return subscriptions;

                type = type.prototype;
            }

            return null;
        }

        public addService<E extends string>( name : string, service : ServiceType<E> ) : void
        {
            let instance = new service( this.organizer );
            let container = new ContainerSurrogate( name, service, instance );

            this.services.push( container );
        }

        public addFactory<E extends string>( name : string, factory : FactoryType<E> ) : void
        {
            let instance = new factory( this.organizer );
            let container = new ContainerSurrogate( name, factory, instance );

            this.factories.push( container );
        }

        public construct() : void
        {
            let cache : Map<Object> = { };

            if( this.services.length > 0 )
            {
                // step descriptions explain why they are in separated loops

                for( let entry of this.services ) // step 1: available services are collected for sharing with other services in next steps (it is necessary for case service X injects service Y and service Y injects service X in same organizer)
                {
                    if( this.master.has( entry.name ) )
                        throw new Error( 'Service "' + entry.name +  '" already exists in organizer "' + this.organizer.getName() + '".' );

                    this.master.add( entry.name, entry.instance );
                }

                for( let entry of this.services ) // step 2: all injections in organizer must be ready before subscriptions (it is necessary for case service X has been defined before service Y, service X subscribe events from service Y and called event during creation do not see service Y injections)
                    this.applyInjections( cache, entry );

                for( let entry of this.services ) // step 3: all subscriptions can be assigned and we are sure that during event execution all services are injected (it is necessary when queue of subscribed services is long and order do not allow to use injections)
                    this.applySubscriptions( cache, entry );

                for( let entry of this.services ) // step 4: all injections and subscriptions are ready so we can signal that services are ready
                {
                    let instance = entry.instance as any;

                    if( instance.onCreate )
                        instance.onCreate();

                    this.buffer.push( instance ); // buffer allow to clean up for services and factories
                }

                this.services = [ ];
            }

            if( this.factories.length > 0 )
            {
                for( let entry of this.factories )
                {
                    if( this.master.has( entry.name ) )
                        throw new Error( 'Service "' + entry.name +  '" already exists in organizer "' + this.organizer.getName() + '".' );

                    this.applyInjections( cache, entry );
                    this.applySubscriptions( cache, entry );

                    let instance = entry.instance as any;

                    if( instance.onCreate )
                        instance.onCreate();

                    this.master.add( entry.name, instance.get() ); // factories can use other factory services only if they are ordered because get method which returns service can not be executed before onCreate method
                    this.buffer.push( instance ); // buffer allow to clean up for services and factories
                }

                this.factories = [ ];
            }
        }

        public release() : void
        {
            if( this.events.length > 0 )
            {
                for( let entry of this.events )
                    entry();

                this.events = [ ];
            }

            if( this.buffer.length > 0 )
            {
                for( let entry of this.buffer )
                {
                    let instance = entry as any;

                    if( instance.onDestroy )
                        instance.onDestroy();
                }

                this.buffer = [ ];
            }
        }
    }
}
