namespace Core.Organizer
{
    export class Variable
    {
        constructor( public name : string, public type : string ) { }
    }

    export class Method
    {
        constructor( public name : string, public parameters : Array<string> ) { }
    }

    export class Parameter
    {
        constructor( public name : string, public methods : Array<Method> ) { }
    }

    export class Interpolator
    {
        private static NAME_REGEX = /^\s*(\w+)\s*$/;
        private static PATH_REGEX = /^\s*(\w+(?:\.\w+)*)\s*$/;
        private static VARIABLE_REGEX = /^\s*(\w+)\s+as\s+(\w+)\s*$/;
        private static PARAMETER_REGEX = /^\s*(\w+)\s*:?\s*([^:]*)\s*$/;
        private static DECLARATION_REGEX = /^\s*(\w+)(?:\(([^()]*)\))?\s*/;

        public static extractName( text : string ) : string
        {
            let matches = text.match( this.NAME_REGEX );

            if( matches == null )
                throw new Error( 'Incorrect name format.' );

            return matches[ 1 ];
        }

        public static extractPath( text : string ) : string
        {
            let matches = text.match( this.PATH_REGEX );

            if( matches == null )
                throw new Error( 'Incorrect object path format.' );

            return matches[ 1 ];
        }

        public static extractParameters( text : string ) : Array<string>
        {
            let parts = text.split( ',' );
            let result : Array<string> = [ ];

            for( let entry of parts )
                result.push( this.extractPath( entry ) );

            return result;
        }

        public static extractMethods( text : string ) : Array<Method>
        {
            let parts = text.split( '|' );
            let result : Array<Method> = [ ];

            for( let entry of parts )
            {
                let matches = entry.match( this.DECLARATION_REGEX );

                if( matches == null )
                    throw new Error( 'Incorrect function format.' );

                let content = matches[ 2 ];
                let parameters = content ? this.extractParameters( content ) : new Array<string>();

                result.push( new Method( matches[ 1 ], parameters ) );
            }

            return result;
        }

        public static parseVariable( text : string ) : Variable
        {
            let matches = text.match( this.VARIABLE_REGEX ); // Controller as variable

            if( matches == null )
                throw new Error( 'Incorrect controller attribute format ("' + text + '").' );

            return new Variable( matches[ 2 ], matches[ 1 ] );
        }

        public static parseParameter( text : string ) : Parameter
        {
            let matches = text.match( this.PARAMETER_REGEX ); // items:array|object(path.to.id)

            if( matches == null )
                throw new Error( 'Incorrect repeat attribute format ("' + text + '").' );

            let content = matches[ 2 ];
            let methods = content ? this.extractMethods( content ) : new Array<Method>();

            return new Parameter( matches[ 1 ], methods );
        }
    }
}
