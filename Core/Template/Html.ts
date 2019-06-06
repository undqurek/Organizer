
namespace Core.Template
{
    export class Html
    {
        // constants

        private static readonly REGEX : RegExp = /^\s*<([a-zA-Z]+)/; // match of template begin

        // helper methods

        private static detect( template : string ) : string // detects expected parent tag
        {
            let matches = template.match( Html.REGEX );

            if( matches == null || matches.length < 2 )
                throw new Error( 'Incorrect template format.' );

            switch( matches[ 1 ] )
            {
                case 'tr': return 'tbody';
                case 'td': return 'tr';
            }

            return 'div';
        }

        // public methods

        public static inject( tag : string, template : string, parent ? : Node ) : ExtendedElement
        {
            let handle = Dom.createElement( tag, parent );

            handle.innerHTML = template;

            return handle;
        }

        /**
         * Covers template inside cover element.
         *
         * @param template
         * @param parent
         */
        public static cover( template : string, parent ? : Node ) : ExtendedElement
        {
            let tag = this.detect( template );

            return this.inject( tag, template, parent );
        }

        /**
         * Extracts node from template element.
         *
         * @param template analyzed element handle
         * @param parent new parent handle
         */
        public static extract( template : Element, parent ? : Node ) : ExtendedElement
        {
            let children = template.children;

            if( children.length != 1 )
                throw new Error( 'Expected one internal root element.' );

            let root = template.removeChild( children[ 0 ] );

            return Dom.coverElement( root as Element, parent );
        }

        /**
         * Parses template.
         *
         * @param template parsed template
         * @param parent suggested parent
         */
        public static parse( template : string, parent ? : Element ) : ExtendedElement
        {
            let root = this.cover( template, parent );

            return this.extract( root, parent );
        }
    }
}
