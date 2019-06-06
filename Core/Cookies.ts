/**
 * Created by qurek on 24.11.2016.
 */
namespace Core
{
    export class Cookies
    {
        // variables

        private static initialised : boolean = false;
        private static cookies : Map<any> = new Map<any>();

        // helper methods

        private static setCache( name : string, value : string ) : void
        {
            this.cookies[ name ] = value;
        }

        private static removeCache( name : string ) : void
        {
            delete this.cookies[ name ];
        }

        private static setCookie( name : string, value : string, expiration ? : Date, domain ? : string, path ? : string ) : void
        {
            let cookie = encodeURIComponent( name ) + "=" + encodeURIComponent( value );

            if( expiration )
                cookie += ";expires=" + expiration.toUTCString();

            if( domain )
                cookie += ';domain=' + encodeURIComponent( domain );

            if( path )
                cookie += ";path=" + encodeURIComponent( path );

            document.cookie = cookie;
        }

        private static removeCookie( name : string ) : void
        {
            let expiration = this.calculateDays( -100 );

            document.cookie = encodeURIComponent( name ) + ";expires=" + expiration.toUTCString();
        }

        // public methods

        public static initialize() : void
        {
            if( this.initialised )
                return;

            let cookie = document.cookie;

            if( cookie.length > 0 )
            {
                let parts = cookie.split( '; ' );

                for( let entry of parts )
                {
                    let index = entry.indexOf( '=' );

                    let name = decodeURIComponent( entry.substr( 0, index ) );
                    let value = decodeURIComponent( entry.substr( index + 1 ) );

                    this.setCache( name, value );
                }
            }

            this.initialised = true;
        }

        // ---- Logic

        public static checkSupport() : boolean
        {
            return navigator.cookieEnabled;
        }

        public static removeValue( name : string ) : void
        {
            this.removeCache( name );
            this.removeCookie( name );
        }

        public static getText( name : string ) : string
        {
            return this.cookies[ name ] || null;
        }

        public static setText( name : string, value : string, expiration ? : Date, domain ? : string, path ? : string ) : void
        {
            this.setCache( name, value );
            this.setCookie( name, value, expiration, domain, path );
        }

        public static getBoolean( name : string ) : boolean
        {
            let cookie = this.getText( name );

            if( cookie == null )
                return null;

            return cookie == 'true' || cookie == '1';
        }

        public static setBoolean( name : string, value : boolean, expiration : Date ) : void
        {
            let tmp = value.toString();

            this.setText( name, tmp, expiration );
        }

        public static getNumber( name : string ) : number
        {
            let cookie = this.getText( name );

            if( cookie == null )
                return null;

            return parseFloat( cookie );
        }

        public static setNumber( name : string, value : number, expiration : Date ) : void
        {
            let tmp = value.toString();

            this.setText( name, tmp, expiration );
        }

        public static getDate( name : string ) : Date
        {
            let cookie = this.getNumber( name );

            if( cookie == null )
                return null;

            return new Date( cookie );
        }

        public static setDate( name : string, value : Date, expiration : Date ) : void
        {
            let tmp = value.getTime();

            this.setNumber( name, tmp, expiration );
        }

        // ---- Utils

        public static calculateSeconds( value : number ) : Date
        {
            let now = new Date();

            return new Date( now.getTime() + 1000 * value );
        }

        public static calculateMinutes( value : number ) : Date
        {
            let now = new Date();

            return new Date( now.getTime() + 60000 * value ); // 60 * 1000 = 60000
        }

        public static calculateHours( value : number ) : Date
        {
            let now = new Date();

            return new Date( now.getTime() + 3600000 * value ); // 60 * 60 * 1000 = 3600000
        }

        public static calculateDays( value : number ) : Date
        {
            let now = new Date();

            return new Date( now.getTime() + 86400000 * value ); // 24 * 60 * 60 * 1000 = 86400000
        }
    }

    Cookies.initialize();
}
