/**
 * Created by qurek on 22.11.2018.
 */
namespace Core
{
    export class Style
    {
        // public methods

        public static get( handle : Element, name : string ) : string | null
        {
            throw new Error( 'This method is not supported.' );
        }

        public static getWidth( handle : Element ) : number | null
        {
            throw new Error( 'This method is not supported.' );
        }

        public static getHeight( handle : Element ) : number | null
        {
            throw new Error( 'This method is not supported.' );
        }
    }

    // cases

    if ( 'getComputedStyle' in window )
    {
        Style.get = ( handle : Element, name : string ) : string | null =>
        {
            let collection = window.getComputedStyle( handle, null );

            if( collection == null )
                throw new Error( 'Indicated element has not computed styles.' );

            return collection.getPropertyValue( name );
        };

        Style.getWidth = ( handle : Element ) : number | null =>
        {
            let collection = window.getComputedStyle( handle, null );

            if( collection == null )
                throw new Error( 'Indicated element has not computed styles.' );

            return Parser.parseInteger( collection.width );
        };

        Style.getHeight = ( handle : Element ) : number | null =>
        {
            let collection = window.getComputedStyle( handle, null );

            if( collection == null )
                throw new Error( 'Indicated element has not computed styles.' );

            return Parser.parseInteger( collection.height );
        };
    }
    else
    {
        if( 'currentStyle' in Element.prototype ) // older IE
        {
            Style.get = ( handle : any | Element, name : string ) : string | null =>
            {
                let parts = name.match( /\w[^-]*/g );

                if( parts.length > 0 )
                {
                    let param = parts[ 0 ];

                    for ( let i = 1; i < parts.length; ++i )
                    {
                        let part = parts[ i ];

                        param += part[ 0 ].toUpperCase() + part.substr( 1 );
                    }

                    return handle.currentStyle[ param ];
                }

                throw new Error( 'Indicated element has not computed styles.' );
            };

            Style.getWidth = ( handle : any | Element ) : number | null =>
            {
                return Parser.parseInteger( handle.currentStyle.width );
            };

            Style.getHeight = ( handle : any | Element ) : number | null =>
            {
                return Parser.parseInteger( handle.currentStyle.height );
            };
        }
        else
            throw new Error( 'Computed styles are not supported.' );
    }
}
