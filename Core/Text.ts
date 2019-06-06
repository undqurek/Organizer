/// <reference path="Interfaces.ts" />
/// <reference path="Event.ts" />


/**
 * Created by qurek on 9.11.2018.
 */
namespace Core
{
    export class Text
    {
        // variables

        private static REGEX : RegExp = /[-\/\\^$*+?.()|[\]{}]/g;

        // public methods

        public static escape( text : string ) : string
        {
            return text.replace( this.REGEX, '\\$&' );
        }

        public static replace( text : string, phrase : string, replacer : string | Function ) : string
        {
            let expression = new RegExp( this.escape( phrase ), 'g' );

            return text.replace( expression, replacer as any );
        }
    }
}
