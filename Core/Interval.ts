// /**
//  * Created by qurek on 15.11.2016.
//  */
// namespace Core
// {
//     export class Interval
//     {
//         // variables
//
//         private interval : number = null;
//         private handle : number = null;
//
//         // events
//
//         public onAction : IAction;
//
//         // public methods
//
//         public start( interval : number = 1000, extortion : boolean = false ) : boolean
//         {
//             if( extortion )
//             {
//                 if( this.handle )
//                     window.clearInterval( this.handle );
//
//                 this.handle = window.setInterval( this.onAction, this.interval = interval );
//
//                 return true;
//             }
//             else
//             {
//                 if( this.handle == null )
//                 {
//                     this.handle = window.setInterval( this.onAction, this.interval = interval );
//
//                     return true;
//                 }
//
//                 return false;
//             }
//         }
//
//         public stop() : boolean
//         {
//             if( this.handle == null )
//                 return false;
//
//             window.clearInterval( this.handle );
//
//             this.interval = null;
//             this.handle = null;
//
//             return true;
//         }
//     }
// }

/**
 * Created by qurek on 15.11.2016.
 */
namespace Core
{
    export class Interval
    {
        // variables

		private destroyed : boolean = false;

        private interval : number = null;
        private handle : number = null;

        private action : Function;

        // events

        public onAction ? : IAction;

        // constructors

        public constructor()
        {
            this.action = () : void =>
            {
                this.handle = window.setTimeout( this.action, this.interval ); // next timeout musts occur in proper intervals and it must be able to break in onAction so next call must be here

                if( this.onAction )
                    this.onAction();
            };
        }

        // public methods

        public start( interval : number = 1000, extortion : boolean = false ) : boolean
        {
			if( this.destroyed )
				throw new Error( 'Interval has been destroyed.' );

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

            this.handle = window.setTimeout( this.action, this.interval = interval );

            return true;
        }

        public stop() : boolean
        {
			if( this.destroyed )
				throw new Error( 'Interval has been destroyed.' );

            if( this.handle )
            {
				window.clearTimeout( this.handle );

				this.interval = null;
				this.handle = null;

				return true;
            }

            return false;
        }

		public destroy() : void
		{
			if( this.destroyed )
				throw new Error( 'Interval has been destroyed.' );

			if( this.handle )
				window.clearTimeout( this.handle );

			this.destroyed = true;
		}
    }
}
