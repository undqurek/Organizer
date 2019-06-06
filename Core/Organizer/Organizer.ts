/// <reference path="../Template/Preprocessor.ts" />
/// <reference path="../Template/Template.ts" />
/// <reference path="../Template/Html.ts" />
/// <reference path="Decompositor.ts" />
/// <reference path="Compositor.ts" />
/// <reference path="Interpolator.ts" />


namespace Core.Organizer
{
    export abstract class Instance<E extends string>
    {
        // statics

        private static counter_1545024291 : number = 0;

        public static readonly INJECTIONS : Array<InjectionSurrogate>;
        public static readonly SUBSCRIPTIONS : Array<SubscriptionSurrogate>;

        // variables

        private readonly id_1545024291 : number = Instance.counter_1545024291++;

        // event methods

        protected onCreate() : void
        {
            // nothing here...
        }

        protected onDestroy() : void
        {
            // nothing here...
        }

        protected onStart() : void
        {
            // nothing here...
        }

        protected onStop() : void
        {
            // nothing here...
        }

        // public methods

        public addListener( name : E, action : Function ) : IAction
        {
            throw new Error( 'Add listener method is not implemented.' );
        }

        public removeListener( name : E, action : Function ) : void
        {
            throw new Error( 'Remove listener method is not implemented.' );
        }

        public toString() : string
        {
            return '{ Instance (service or factory) : id=' + this.id_1545024291 + ' }';
        }
    }

    export type InstanceType<T extends Instance<E>, E extends string> = { new( organizer ? : Organizer ) : T; INJECTIONS : Array<InjectionSurrogate>; SUBSCRIPTIONS : Array<SubscriptionSurrogate>; };


    export abstract class Service<E extends string> extends Instance<E>
    {
        // nothing here...
    }

    export type ServiceType<E extends string> = { new( organizer ? : Organizer ) : Service<E>; INJECTIONS : Array<InjectionSurrogate>; SUBSCRIPTIONS : Array<SubscriptionSurrogate>; };


    export abstract class Factory<E extends string> extends Instance<E>
    {
        public abstract get() : Object;
    }

    export type FactoryType<E extends string> = { new( organizer ? : Organizer ) : Factory<E>; INJECTIONS : Array<InjectionSurrogate>; SUBSCRIPTIONS : Array<SubscriptionSurrogate>; };


    export abstract class Controller<T>
    {
        // statics

        private static counter_1545024291 : number = 0;

        public static readonly INJECTIONS : Array<InjectionSurrogate>;
        public static readonly SUBSCRIPTIONS : Array<SubscriptionSurrogate>;

        // variables

        private readonly id_1545024291 : number = Controller.counter_1545024291++;

        // bindings

        // protected readonly handle : HTMLDivElement;

        // event methods

        protected onCreate( index : number, data : T ) : void
        {
            // nothing here...
        }

        protected onDestroy() : void
        {
            // nothing here...
        }

        protected onStart() : void
        {
            // nothing here...
        }

        protected onStop() : void
        {
            // nothing here...
        }

        // public methods

        public toString() : string
        {
            return '{ Controller : id=' + this.id_1545024291 + ' }';
        }
    }

    export type ControllerType<C extends Controller<T>, T> = { new( organizer ? : Organizer ) : C; INJECTIONS : Array<InjectionSurrogate>; SUBSCRIPTIONS : Array<SubscriptionSurrogate>; };

    /**
     * Allows to manage source during building controls by splitting template and logic into separated places.
     */
    export class Organizer
    {
        // variables

        private static counter : number = 0;

        // variables

        private destroyed : boolean = false;

        private readonly id : number;
        private readonly name : string;

        private readonly debug : boolean = null;

        private readonly master : Organizer = null;
        private readonly slaves : Map<Organizer> = { };

        private readonly bridges : Tube<Bridge>;
        private readonly services : Tube<Object>;
        private readonly resources : Tube<Resource>;

        private readonly transitor : Transistor;
        private readonly decompositor : Decompositor;
        private readonly compositor : Compositor;

        // constructor

        constructor( name : string, master : Organizer = null, debug : boolean = null )
        {
            this.id = Organizer.counter++;

            if( master )
            {
                this.name = master.name + ' -> ' + name;
                this.debug = debug == null ? master.debug : debug;

                this.master = master;

                this.bridges = new MultiTube( master.bridges );
                this.services = new MultiTube( master.services );
                this.resources = new MultiTube( master.resources );

                master.slaves[ this.id ] = this;
            }
            else
            {
                this.name = name;
                this.debug = debug == null ? false : debug;

                this.bridges = new SingleTube();
                this.services = new SingleTube();
                this.resources = new SingleTube();
            }

            this.transitor = new Transistor( this, this.services, this.debug );
            this.decompositor = new Decompositor( this.debug );
            this.compositor = new Compositor( this, this.services, this.bridges, this.resources, this.debug );
        }

        // helper methods

        private construct() : void
        {
            if( this.master )
                this.master.construct();

            this.transitor.construct();
        }

        // public methods

        public getName() : string
        {
            if( this.destroyed )
                throw new Error( 'Organizer "' + this.name + '" has been destroyed.' );

            return this.name;
        }

        public addService<E extends string>( name : string, service : ServiceType<E> ) : void
        {
            if( this.destroyed )
                throw new Error( 'Organizer "' + this.name + '" has been destroyed.' );

            if( name == null )
                throw new Error( 'Added service name "' + name +  '" is not defined (organizer "' + this.name + '").' );

            if( service == null )
                throw new Error( 'Added service type is not defined (organizer "' + this.name + '", service "' + name +  '").' );

            if( name in InjectionName )
                throw new Error( 'Added service name "' + name +  '" is reserved in organizer "' + this.name + '".' );

            if( this.services.has( name ) )
                throw new Error( 'Added service "' + name +  '" already exists in organizer "' + this.name + '".' );

            this.transitor.addService( name, service );
        }

        public addFactory<E extends string>( name : string, factory : FactoryType<E> ) : void
        {
            if( this.destroyed )
                throw new Error( 'Organizer "' + this.name + '" has been destroyed.' );

            if( name == null )
                throw new Error( 'Added service (factory) name "' + name +  '" is not defined (organizer "' + this.name + '").' );

            if( factory == null )
                throw new Error( 'Added service (factory) type is not defined (organizer "' + this.name + '", factory "' + name +  '").' );

            if( name in InjectionName )
                throw new Error( 'Added service (factory) name "' + name +  '" is reserved in organizer "' + this.name + '".' );

            if( this.services.has( name ) )
                throw new Error( 'Service (factory) "' + name +  '" already exists in organizer "' + this.name + '".' );

            this.transitor.addFactory( name, factory );
        }

        public addObject<T>( name : string, object : T ) : void
        {
            if( this.destroyed )
                throw new Error( 'Organizer "' + this.name + '" has been destroyed.' );

            if( name == null )
                throw new Error( 'Added service (object) name "' + name +  '" is not defined (organizer "' + this.name + '").' );

            if( object == null )
                throw new Error( 'Added service (object) instance is not defined (organizer "' + this.name + '", object "' + name +  '").' );

            if( name in InjectionName )
                throw new Error( 'Added service (object) name "' + name +  '" is reserved in organizer "' + this.name + '".' );

            if( this.services.has( name ) )
                throw new Error( 'Added service (object) "' + name +  '" already exists in organizer "' + this.name + '".' );

            this.services.add( name, object );
        }

        public addController<C extends Controller<T>, T>( name : string, controller : ControllerType<C, T> ) : void
        {
            if( this.destroyed )
                throw new Error( 'Organizer "' + this.name + '" has been destroyed.' );

            if( name == null )
                throw new Error( 'Added controller name "' + name +  '" is not defined (organizer "' + this.name + '").' );

            if( controller == null )
                throw new Error( 'Added controller type is not defined (organizer "' + this.name + '", controller "' + name +  '").' );

            if( this.resources.has( name ) )
                throw new Error( 'Added controller "' + name +  '" already exists in organizer "' + this.name + '".' );

            this.resources.add( name, new Resource( controller, this.services ) );
        }

        public addTemplate( name : string, template : string, variables ? : Map<string> ) : void
        {
            if( this.destroyed )
                throw new Error( 'Organizer "' + this.name + '" has been destroyed.' );

            if( name == null )
                throw new Error( 'Added template name "' + name +  '" is not defined (organizer "' + this.name + '").' );

            let bridge = this.compileTemplate( template, variables );

            this.addBridge( name, bridge );
        }

        public addBridge( name : string, bridge : Bridge ) : void
        {
            if( this.destroyed )
                throw new Error( 'Organizer "' + this.name + '" has been destroyed.' );

            if( name == null )
                throw new Error( 'Added bridge name "' + name +  '" is not defined (organizer "' + this.name + '").' );

            if( bridge == null )
                throw new Error( 'Added bridge instance is not defined (organizer "' + this.name + '", bridge "' + name +  '" ).' );

            if( this.bridges.has( name ) )
                throw new Error( 'Added bridge (or template) "' + name +  '" already exists in organizer "' + this.name + '".' );

            this.bridges.add( name, bridge );
        }

        public compileTemplate( template : string, variables ? : Map<string> ) : Bridge
        {
            if( this.destroyed )
                throw new Error( 'Organizer "' + this.name + '" has been destroyed.' );

            if( template == null )
                throw new Error( 'Template content is not defined (organizer "' + this.name + '", template "' + name +  '").' );

            let root = this.decompositor.decompose( template, variables );
            let proxy = () : void => this.construct();

            return new Bridge( root, this.compositor, proxy );
        }

        public composeTemplate<T>( template : string, parent ? : Controller<T>, variables ? : Map<string> ) : Composition
        {
            let bridge = this.compileTemplate( template, variables );

            return bridge.compose( parent );
        }

        public destroy() : void
        {
            if( this.destroyed )
                return;

            if( this.master )
                delete this.master.slaves[ this.id ]; // organizer destroying requires removing itself from master (parent) organizer

            for( let el in this.slaves )
                this.slaves[ el ].destroy();

            //TODO: destroying of compositions
            this.transitor.release();

            this.destroyed = true;
        }

        public toString() : string
        {
            return '{ Organizer : id=' + this.id + ' }';
        }
    }
}
