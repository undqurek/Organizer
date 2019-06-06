/**
 * Created by qurek on 01.11.2016.
 */
namespace Core
{
    export class Listener
    {
        // variables

        private destroyed : boolean = false;

        private events : Map<Array<Function>> = new Map<Array<Function>>();

        // public methods

        public add( name : string, action : Function ) : IAction
        {
            if( this.destroyed )
                throw new Error( 'Listener has been destroyed.' )

            let events = this.events[ name ];

            if( events == null )
                events = this.events[ name ] = [ ];

            events.push( action );

            let result : IAction = () : void =>
            {
				if( this.destroyed )
					throw new Error( 'Listener has been destroyed.' )

                if( action )
                {
                    events.remove( action );

                    if( events.length == 0 )
                        delete this.events[ name ];

                    action = null;
                }
            };

            return result;
        }

        public remove( name : string, action : Function ) : void
        {
			if( this.destroyed )
				throw new Error( 'Listener has been destroyed.' )

            let events = this.events[ name ];

            if( events )
            {
                events.remove( action );

                if( events.length == 0 )
                    delete this.events[ name ];
            }
        }

        public fire( name : string, ...parameters : any[] ) : boolean
        {
			if( this.destroyed )
				throw new Error( 'Listener has been destroyed.' )

            let events = this.events[ name ];

            if( events )
            {
                for( let entry of events )
                    entry.apply( this, parameters );

                return true;
            }

            return false;
        }

        public clear() : void
        {
			if( this.destroyed )
				throw new Error( 'Listener has been destroyed.' )

            this.events = new Map<Array<Function>>();
        }

		public destroy() : void
		{
			if( this.destroyed )
				throw new Error( 'Listener has been destroyed.' )

			this.events = new Map<Array<Function>>();

			this.destroyed = true;
		}
    }
}
