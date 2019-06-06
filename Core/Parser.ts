/**
 * Created by qurek on 24.11.2016 - 10.01.2019.
 */
namespace Core
{
    export class Parser
    {
        public static parseInteger( text ? : string ) : number | null
        {
            if( text == null )
                return null;

            return parseInt( text );
        }

        public static parseFloat( text ? : string ) : number | null
        {
            if( text == null )
                return null;

            return parseFloat( text );
        }

        /**
         * Parsuje kod zrodlowy. Jesli kod zrodlywy zawira bledy to rzucany jest exception.
         *
         * @param source
         *        parsowany kod zrodlowy
         * @returns wynik wykonania zparsowanego kodu
         */
        public static parseSource( source : string ) : any | null
        {
            let object = null;
            let result = eval( 'object = (' + source + ')' );

            return object || result;
        }
    }
}
