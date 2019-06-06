/**
 * Created by qurek on 24.11.2016.
 */
namespace Core
{
    export class Updater
    {
        // constructors

        public constructor( private date : Date )
        {
            // nothing here ...
        }

        // helper methods

		/**
         * Checks It is time to upgrade.
         *
		 * @param date
		 */
		private check( date : Date ) : boolean
        {
            if( date == null )
                return true;

            if( date.getTime() == this.date.getTime() )
                return false;

            return true;
        }

        // public methods

        public reload() : boolean
        {
            if( Cookies.checkSupport() )
            {
                let date = Cookies.getDate( 'last_update_time' );

                if( this.check( date ) )
                {
                    let expiration = Cookies.calculateDays( 30 );

                    Cookies.setDate( 'last_update_time', this.date, expiration );

                    location.reload( true );

                    return true;
                }
            }

            return false;
        }

        public static prepare( date : Date ) : void
        {
            let updater = new Updater( date );

            updater.reload();
        }
    }
}
