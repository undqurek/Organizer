/**
 * Created by qurek on 03.02.2017.
 */
namespace Core.Template
{
    export class Preprocessor
    {
        // constants

        private static readonly VARIABLE_PATTERN : RegExp = /(\\*){{\s*([a-zA-Z0-9_$]+)\s*}}/gi;

        // public methods

        public static compile( template : string, variables : Map<string> ) : string
        {
            let action : Function = ( text : string, escape : string, name : string ) : string =>
            {
				let sign : string = '';

				if( escape )
                {
                    let index = 1;
                    let count = escape.length;

					while( index < count )
                    {
						sign += '\\';
						index += 2;
                    }

                    if( index + 1 == count )
						return sign + '{{' + name + '}}';
                }

				return sign + variables[ name ];




                // let sign : string = '';
                //
                // if( text[ 0 ] == '\\' )
                // {
                //     if( text[ 1 ] != '\\' )
                //         return '{{' + name + '}}';
                //
                //     sign = '\\';
                // }
                //
				// return sign + variables[ name ];
            };

            return template.replace( this.VARIABLE_PATTERN, action as any );
        }
    }
}
