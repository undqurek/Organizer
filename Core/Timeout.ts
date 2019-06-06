/**
 * Created by qurek on 15.11.2016.
 */
namespace Core
{
    export class Timeout
    {
        // variables

        private destroyed : boolean = false;

        private timeout : number = null;
        private handle : number = null;

        private action : Function;

        // events

        public onAction ? : IAction;

        // constructors

        public constructor()
        {
            this.action = () : void =>
            {
            	try
				{

					if( this.onAction )
						this.onAction();
				}
				finally
				{
					this.handle = null;
				}
            };
        }

        // public methods

        public start( timeout : number = 1000, extortion : boolean = false ) : boolean
        {
            if( this.destroyed )
                throw new Error( 'Timeout has been destroyed.' );

            if( extortion )
            {
                if( this.handle )
                    window.clearTimeout( this.handle );
            }
            else
            {
                if( this.handle )
                    return false;
            }

            this.handle = window.setTimeout( this.action, this.timeout = timeout );

            return true;
        }

        public stop() : boolean
        {
			if( this.destroyed )
				throw new Error( 'Timeout has been destroyed.' );

            if( this.handle )
            {
				window.clearTimeout( this.handle );

				this.timeout = null;
				this.handle = null;

				return true;
            }

            return false;
        }

        public destroy() : void
        {
			if( this.destroyed )
				throw new Error( 'Timeout has been destroyed.' );

			if( this.handle )
    			window.clearTimeout( this.handle );

			this.destroyed = true;
        }
    }
}
