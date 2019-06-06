
namespace Core
{
    export class Delay
    {
        // variable

        private destroyed : boolean = false;

        private handle : number = null;

        // public methods

        public call( action : IAction, time : number ) : void
        {
            if( this.destroyed )
                throw new Error( 'Delay has been destroyed.' );

            if( this.handle )
                clearTimeout( this.handle );

            this.handle = setTimeout( action, time );
        }

        public break() : void
        {
			if( this.destroyed )
				throw new Error( 'Delay has been destroyed.' );

            if( this.handle )
            {
                clearTimeout( this.handle );

                this.handle = null;
            }
        }

		public destroy() : void
		{
			if( this.destroyed )
				throw new Error( 'Delay has been destroyed.' );

			if( this.handle )
				clearTimeout( this.handle );

			this.destroyed = true;
		}
    }
}
