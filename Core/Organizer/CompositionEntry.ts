/// <reference path="LoopEntry.ts" />


namespace Core.Organizer
{
    export class CompositionEntry
    {
        // constructors

        public constructor( protected handle : Element | null, protected scope : CompositionScope )
        {
            // nothing here...
        }

        // public methods

        public getController<C extends Controller<T>, T>( name ? : string ) : C
        {
            if( this.scope.destroyed )
                throw new Error( 'Composition has been destroyed.' );

            let controllers = this.scope.controllers;

            if( name )
            {
                let controller = controllers[ name ];

                if( controller == null )
                    throw new Error( 'Controller "' + name +  '" does not exist.' );

                return controller.scope.instance as C;
            }
            else
            {
                for( let el in controllers )
                {
                    let controller = controllers[ el ];

                    return controller.scope.instance as C;
                }

                throw new Error( 'Default controller does not exist.' );
            }
        }

        public getLoop<C extends Controller<T>, T>( name ? : string ) : LoopEntry<C, T>
        {
            if( this.scope.destroyed )
                throw new Error( 'Composition has been destroyed.' );

            let loops = this.scope.loops;

            if( name )
            {
                let loop = loops[ name ];

                if( loop == null )
                    throw new Error( 'Loop "' + name +  '" does not exist.' );

                return loop.entry;
            }
            else
            {
                for( let el in loops )
                {
                    let loop = loops[ el ];

                    return loop.entry;
                }

                throw new Error( 'Default loop does not exist.' );
            }
        }
    }
}
