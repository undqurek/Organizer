namespace Core.Organizer
{
    export enum InstanceMode
    {
        /**
         * Single instance.
         */
        Singleton,

        /**
         * Multiple instances (Prototype, Transient, Multipleton or Multiton).
         */
        Transient
    }

    class OrganizerSurrogate
    {
        public constructor( public name : string, public template : string | null, public master : boolean, public type : any )
        {
            // nothing here ...
        }
    }

    class ServiceSurrogate
    {
        public constructor( public name : string, public type : any )
        {
            // nothing here ...
        }
    }

    class ControllerSurrogate
    {
        public constructor( public name : string, public type : any )
        {
            // nothing here ...
        }
    }

    class ScopeSurrogate
    {
        public constructor( public path : string, public organizer : OrganizerSurrogate, public services : Array<ServiceSurrogate>, public controllers : Array<ControllerSurrogate>, public scopes : Array<ScopeSurrogate> )
        {
            // nothing here ...
        }
    }

    export function organizer( name : string, template ? : string, master : boolean = false ) : any
    {
        if( name == null )
            throw new Error( '@organizer name is not defined.' );

        return function( target : any ) : any
        {
            let organizer = target.ORGANISER as OrganizerSurrogate;

            if( organizer )
                throw new Error( 'Organiser decorator is duplicated (organiser "' + name + '").' );

            target.ORGANISER = new OrganizerSurrogate( name, template, master, target );
        };
    }

    export function service( name : string ) : any
    {
        if( name == null )
            throw new Error( '@service name is not defined.' );

        return function( target : any ) : any
        {
            let services = target.SERVICES as Array<ServiceSurrogate>;

            if( services == null )
                services = target.SERVICES = new Array<ServiceSurrogate>();

            services.push( new ServiceSurrogate( name, target ) );
        };
    }

    export function controller( name : string ) : any
    {
        if( name == null )
            throw new Error( '@controller name is not defined.' );

        return function( target : any ) : any
        {
            let controllers = target.CONTROLLERS as Array<ControllerSurrogate>;

            if( controllers == null )
                controllers = target.CONTROLLERS = new Array<ControllerSurrogate>();

            controllers.push( new ControllerSurrogate( name, target ) );
        };
    }

    export class Entity
    {
        // constructors

        public constructor( private path : string, private organizer : Organizer, private bridge : Bridge | null, private master : boolean )
        {
            // nothing here ...
        }

        // public methods

        public getPath() : string
        {
            return this.path;
        }

        public getOrganizer() : Organizer
        {
            return this.organizer;
        }

        public getBridge() : Bridge | null
        {
            return this.bridge;
        }

        public getMaster() : boolean
        {
            return this.master;
        }
    }

    export class Bootstrap
    {
        // helper methods

        private static analyze( namespace : any, path : string ) : ScopeSurrogate
        {
            let completed = false;

            let services = new Array<ServiceSurrogate>();
            let controllers = new Array<ControllerSurrogate>();
            let scopes = new Array<ScopeSurrogate>();

            let scope = new ScopeSurrogate( path, null, services, controllers, scopes );

            if( path )
                path = path + '.';

            for( let el in namespace )
            {
                let entry = namespace[ el ];

                if( entry.__Ignore__ ) // __Ignore__ object in namespace makes namespace ignored
                    continue;

                if( entry.constructor == Function ) // classes
                {
                    let o = entry.ORGANISER as OrganizerSurrogate;

                    if( o )
                    {
                        if( scope.organizer )
                            throw new Error( 'Surrogate organiser class "' + o.name + '" is duplicated in namespace (is allowed only one organiser per namespace).' );

                        scope.organizer = o;

                        completed = true;

                        continue;
                    }

                    let s = entry.SERVICES as Array<ServiceSurrogate>;

                    if( s )
                    {
                        for( let entry of s )
                            services.push( entry );

                        completed = true;

                        continue;
                    }

                    let c = entry.CONTROLLERS as Array<ControllerSurrogate>;

                    if( c )
                    {
                        for( let entry of c )
                            controllers.push( entry );

                        completed = true;

                        continue;
                    }

                    continue;
                }

                if( entry.constructor == Object ) // namespaces
                {
                    let s = this.analyze( entry, path + el );

                    if( s )
                    {
                        scopes.push( s );

                        completed = true;
                    }

                    continue;
                }
            }

            return completed ? scope : null;
        }

        private static construct( scope : ScopeSurrogate, master ? : Organizer, variables ? : Map<string> ) : Entity | null
        {
            let surrogate = scope.organizer;

            if( surrogate )
            {
                let organizer = new Organizer( surrogate.name, master );

                for( let entry of scope.services )
                    organizer.addService( entry.name, entry.type );

                for( let entry of scope.controllers )
                    organizer.addController( entry.name, entry.type );

                let candidate : Entity = null;

                for( let entry of scope.scopes )
                {
                    let entity = this.construct( entry, organizer );

                    if( entity )
                    {
                        let bridge = entity.getBridge();

                        if( bridge )
                        {
                            let surrogate = entry.organizer;

                            if( entity.getMaster() )
                            {
                                if( candidate )
                                    throw new Error( 'In scope "' + scope.path + '" appears many times master sub-scopes (master=true flag in @organizer "' + candidate.getPath() + '" and "' + entity.getPath() + '").' );

                                let path = entity.getPath();

                                candidate = new Entity( path, organizer, bridge, surrogate.master );
                            }
                            else
                                organizer.addBridge( surrogate.name, bridge );
                        }
                    }
                }

				let instance = new surrogate.type();

				if( instance.complement )
					instance.complement( organizer );

				if( surrogate.template )
                {
                    if( candidate )
                        throw new Error( 'In ' + ( scope.path ? '"' + scope.path + '" scope' : 'master-scope' ) + ' and in "' + candidate.getPath() + '" sub-scope are defined master templates (master=true flag in sub-scope @organizer).' );

                    if( surrogate.master )
                    {
						let bridge = organizer.compileTemplate( surrogate.template, variables );

						return new Entity( scope.path, organizer, bridge, true );
                    }
                    else
                    {
						let bridge = organizer.compileTemplate( surrogate.template );

						return new Entity( scope.path, organizer, bridge, false );
                    }
                }
                else
                {
                    if( candidate )
                        return candidate;

                    if( surrogate.master )
                        throw new Error( 'Scope "' + scope.path + '" can not be set as master templates if has not sub-scope template (master=true flag in some sub-scope @organizer).' );

                    return new Entity( scope.path, organizer, null, false );
                }
            }
            else
            {
                for( let entry of scope.services )
                    master.addService( entry.name, entry.type );

                for( let entry of scope.controllers )
                    master.addController( entry.name, entry.type );

                let candidate : Entity = null;

                for( let entry of scope.scopes )
                {
                    let entity = this.construct( entry, master );

                    if( entity )
                    {
                        let bridge = entity.getBridge();

                        if( bridge )
                        {
                            if( entity.getMaster() )
                            {
                                if( candidate )
                                    throw new Error( 'In "' + scope.path + '" scope appears many times master sub-scopes (master=true flag in @organizer-s "' + candidate.getPath() + '" and "' + entity.getPath() + '").' );

                                let path = entity.getPath();

                                candidate = new Entity( path, master, bridge, true );
                            }
                            else
                                master.addBridge( entry.organizer.name, bridge );
                        }
                    }
                }

                return candidate;
            }
        }

        // public methods

        public static run( namespace : any, master ? : Organizer, variables ? : Map<string> ) : Entity | null
        {
            if( namespace == null )
				throw new Error( 'Indicated namespace does not exist.' );

            let scope = this.analyze( namespace, '' );

			if( scope )
            {
				if( scope.organizer == null )
					throw new Error( 'Surrogate organiser class is not defined inside ' + ( scope.path ? '"' + scope.path + '"' : 'root' ) + ' namespace.' );

				return this.construct( scope, master, variables );
            }

			throw new Error( 'Indicated namespace is not organizer type.' );
        }
    }
}
