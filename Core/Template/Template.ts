
namespace Core.Template
{
    /**
     * Compiles event condition method.
     *
     * Note: variable e063ad521acf34f20039ee0301472c59 postfix protects duplicated variables in condition
     *
     * @param s scope object
     * @param n node object
     * @param condition_e063ad521acf34f20039ee0301472c59 compiled condition source code
     */
    function compile( s : any, n : Node, condition_e063ad521acf34f20039ee0301472c59 : string ) : Function // this method should be placed in global scope
    {
        let scope = s; // scope variable proxy for condition_e063ad521acf34f20039ee0301472c59 source code
        let node = n; // node variable proxy for condition_e063ad521acf34f20039ee0301472c59 source code

        try
        {
            let object_e063ad521acf34f20039ee0301472c59 : Function = null;
            let result_e063ad521acf34f20039ee0301472c59 : Function = eval( 'object_e063ad521acf34f20039ee0301472c59 = function( e ) { var event = e; return (' + condition_e063ad521acf34f20039ee0301472c59 + '); }' );

            return object_e063ad521acf34f20039ee0301472c59 || result_e063ad521acf34f20039ee0301472c59;
        }
        catch ( ex )
        {
            throw new Error( 'Condition \'' + condition_e063ad521acf34f20039ee0301472c59 + '\' syntax error.' );
        }
    }

    /**
     * Umożliwia tworzenie szablonów.
     */
    export class Template
    {
        // constants

        private static readonly REGEX : RegExp = /^\s*(\w+)\s*(?:\((.+)\))?\s*:\s*(\w+)\s*$/;

        // helper methods

        private static prepareHandle( element : Element, scope : any, debug : boolean = false ) : void
        {
            let value = element.getAttribute( 'var-handle' );

            if( value )
            {
                if( debug == false )
                    element.removeAttribute( 'var-handle' );

                if( value == 'handle' )
                    throw new Error( 'Handle \'handle\' is reserved.' );

                if ( value in scope )
                    throw new Error( 'Handle \'' + value + '\' has been duplicated.' );

                scope[ value ] = element;
            }
        }

        private static prepareEvent( element : Element, part : string, scope : any, debug : boolean = false ) : void
        {
            let match = part.match( this.REGEX );

            if( match == null )
                throw new Error( 'Incorrect var-events attribute (attribute: ' + part + ').' );

            let name = match[ 1 ]; // event name
            let condition = match[ 2 ]; // event condition
            let method = match[ 3 ]; // event method

            let action = scope[ method ]; // event action

            if( action instanceof Function )
            {
                if( debug )
					Event.add( element, '-> [ EVENT:' + name + ' ]', action, false );

                if( condition )
                {
                    let logic = compile( scope, element, condition );

                    let proxy : Function = ( event : any ) : void =>
                    {
                        if( logic( event ) ) // checking event condition
                            action.call( scope, event );
                    };

                    Event.add( element, name, proxy, false );
                }
                else
                {
                    let proxy = action.bind( scope );

                    Event.add( element, name, proxy, false );
                }
            }
            else
                throw new Error( 'Indicated method \'' + method + '\' does not exist for event \'on' + name + '\' in scope.' );
        }

        private static prepareEvents( element : Element, scope : any, debug : boolean = false ) : void
        {
            let value = element.getAttribute( 'var-events' );

            if( value )
            {
                if( debug == false )
                    element.removeAttribute( 'var-events' );

                let parts = value.split( ',' );

                for ( let entry of parts )
                    this.prepareEvent( element, entry, scope, debug );
            }
        }

        // public methods

        /**
         * Wyodrębnia uchwyty elementów z wnętrza analizowanego elementu umieszczając je wewnątrz obiektu scope oraz binduje metody obiektu scope razem ze zdarzeniami opisanymi wewnątrz analizowanego elementu.
         *
         * @param element analizowany elemet
         * @param scope obiekt przechowujący bindowane metody
         */
        public static expose( element : Element, scope : any, handled : boolean = true, debug : boolean = false ) : void
        {
            this.prepareHandle( element, scope, debug );
            this.prepareEvents( element, scope, debug );

            if( handled )
                scope.handle = element;

            {
                let hElements = element.querySelectorAll( '[var-handle]' );

                for ( let entry of hElements as any )
                    this.prepareHandle( entry, scope, debug );
            }

            {
                let hElements = element.querySelectorAll( '[var-events]' );

                for ( let entry of hElements as any )
                    this.prepareEvents( entry, scope, debug );
            }
        }

        public static compile( template : string, scope : any, parent ? : Element, handled : boolean = true, debug : boolean = false ) : ExtendedElement
        {
            let element = Html.parse( template, parent );

            this.expose( element, scope, handled, debug );

            return element;
        }

        /**
         * Montuje szablon wewnątrz wskazanego rodzica.
         *
         * @param template montowany szablon
         * @param scope
         * @param hParent rodzic wewnątrz, którego montowany jest element
         * @param hBefore
         */
        public static mount( template : string, scope : any, parent : Element, placeholder ? : Element, handled : boolean = true, debug : boolean = false ) : ExtendedElement
        {
            let handle = this.compile( template, scope, parent, handled, debug );

            handle.mount( placeholder );

            return handle;
        }
    }
}



// namespace Core.Template
// {
//     /**
//      * Umożliwia tworzenie szablonów.
//      */
//     export class Template
//     {
//         // constants
//
//         private static readonly REGEX : RegExp = /^\s*(\w+)\s*:\s*(\w+)\s*$/;
//
//         // helper methods
//
//         private static prepareHandle( element : Element, scope : any, debug : boolean = false ) : void
//         {
//             let value = element.getAttribute( 'var-handle' );
//
//             if( value )
//             {
//                 if( debug == false )
//                     element.removeAttribute( 'var-handle' );
//
//                 if( value == 'handle' )
//                     throw new Error( 'Handle \'handle\' is reserved.' );
//
//                 if ( value in scope )
//                     throw new Error( 'Handle \'' + value + '\' has been duplicated.' );
//
//                 scope[ value ] = element;
//             }
//         }
//
//         private static prepareEvent( element : Element, part : string, scope : any, debug : boolean = false ) : void
//         {
//             let match = part.match( this.REGEX );
//
//             if( match == null )
//                 throw new Error( 'Incorrect var-events attribute.' );
//
//             let event = match[ 1 ];
//             let method = match[ 2 ];
//
//             let action = scope[ method ];
//
//             if( action == null )
//                 throw new Error( 'Indicated method \'' + method + '\' does not exist in scope.' );
//
//             let proxy = action.bind( scope );
//
//             Event.add( element, event, proxy, false );
//         }
//
//         private static prepareEvents( element : Element, scope : any, debug : boolean = false ) : void
//         {
//             let value = element.getAttribute( 'var-events' );
//
//             if( value )
//             {
//                 if( debug == false )
//                     element.removeAttribute( 'var-events' );
//
//                 let parts = value.split( ',' );
//
//                 for ( let entry of parts )
//                     this.prepareEvent( element, entry, scope, debug );
//             }
//         }
//
//         // public methods
//
//         /**
//          * Wyodrębnia uchwyty elementów z wnętrza analizowanego elementu umieszczając je wewnątrz obiektu scope oraz binduje metody obiektu scope razem ze zdarzeniami opisanymi wewnątrz analizowanego elementu.
//          *
//          * @param element analizowany elemet
//          * @param scope obiekt przechowujący bindowane metody
//          */
//         public static expose( element : Element, scope : any, handled : boolean = true, debug : boolean = false ) : void
//         {
//             this.prepareHandle( element, scope, debug );
//             this.prepareEvents( element, scope, debug );
//
//             if( handled )
//                 scope.handle = element;
//
//             {
//                 let hElements = element.querySelectorAll( '[var-handle]' );
//
//                 for ( let entry of hElements as any )
//                     this.prepareHandle( entry, scope, debug );
//             }
//
//             {
//                 let hElements = element.querySelectorAll( '[var-events]' );
//
//                 for ( let entry of hElements as any )
//                     this.prepareEvents( entry, scope, debug );
//             }
//         }
//
//         public static compile( template : string, scope : any, parent ? : Element, handled : boolean = true, debug : boolean = false ) : ExtendedElement
//         {
//             let element = Html.parse( template, parent );
//
//             this.expose( element, scope, handled, debug );
//
//             return element;
//         }
//
//         /**
//          * Montuje szablon wewnątrz wskazanego rodzica.
//          *
//          * @param template montowany szablon
//          * @param scope
//          * @param hParent rodzic wewnątrz, którego montowany jest element
//          * @param hBefore
//          */
//         public static mount( template : string, scope : any, parent : Element, placeholder ? : Element, handled : boolean = true, debug : boolean = false ) : ExtendedElement
//         {
//             let handle = this.compile( template, scope, parent, handled, debug );
//
//             handle.mount( placeholder );
//
//             return handle;
//         }
//     }
// }
