
namespace Core
{
    export interface ICriterion
    {
        ( query : string, text : string ) : boolean;
    }

    export class Filter
    {
        // public methods

        public static checkPrefix( query : string, text : string ) : boolean
        {
            if( query.length > text.length )
                return false;

            for( let i = 0; i < query.length; ++i )
            {
                if( query[ i ] == text[ i ] )
                    continue;

                return false;
            }

            return true;
        }

		public static checkPostfix( query : string, text : string ) : boolean
		{
			if( query.length > text.length )
				return false;

			for( let i = query.length - 1, j = text.length - 1; i > -1; --i, --j )
			{
				if( query[ i ] == text[ j ] )
					continue;

				return false;
			}

			return true;
		}

		public static checkExistance( query : string, text : string ) : boolean
		{
		    throw new Error( 'This method has not been implemented yet.' );

			// if( query.length > text.length )
			// 	return false;
            //
			// for( let i = 0; i < query.length; ++i )
			// {
			// 	if( query[ i ] == text[ i ] )
			// 		continue;
            //
			// 	return false;
			// }
            //
			// return true;
		}

        public static findData( query : string, data : Array<any>, limit : number, selector : IFunction<any, string>, criterion : ICriterion = this.checkPrefix ) : Array<any>
        {
            if( limit > data.length )
                limit = data.length;

            let result : Array<any> = [ ];

            for( let entry of data )
            {
                if( result.length < limit )
                {
                    let value = selector( entry );

                    if( criterion( query, value ) )
                        result.push( entry );
                }
                else
                    break;
            }

            return result;
        }
    }
}
