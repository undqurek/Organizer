/// <reference path="Interfaces.ts" />
/// <reference path="Event.ts" />


/**
 * Created by qurek on 9.11.2018.
 */
namespace Core
{
    export class Destroyer
    {
        // variables

        private actions : Array<IAction> = [ ];

        // constructors

        public constructor( private method : string = 'destroy' )
        {
            // nothing here ...
        }

        // public methods

        public assign( object : any, method : string = this.method ) : void
        {
            let action = object[ method ];

            if( action )
                this.actions.push( action.bind( object ) );
        }

        public run() : void
        {
            if( this.actions.length > 0 )
            {
                for( let entry of this.actions )
                    entry();

                this.actions = [ ];
            }
        }
    }
}
