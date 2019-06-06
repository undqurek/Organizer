/**
 * Created by qurek on 9.11.2018.
 */
namespace Core
{
    export class Eventor
    {
        // variables

        private destroyed : boolean = false;

        private removers : Array<IAction> = new Array<IAction>();

        // public methods

        public add( object : any | Element, event : string, action : Function, capturing : boolean = false ) : IAction
        {
			if( this.destroyed )
				throw new Error( 'Eventor has been destroyed.' );

			let remover = Event.add( object, event, action, capturing );

            this.removers.push( remover );

            let removed = false;

            let result = () : void =>
            {
                if( removed )
                    return;

                if( this.removers.remove( remover ) )
					remover();

                removed = true;
            };

            return result;
        }

        public clear() : void
        {
			if( this.destroyed )
				throw new Error( 'Eventor has been destroyed.' );

			if( this.removers.length > 0 )
            {
                for( let entry of this.removers )
                    entry();

                this.removers.clear();
            }
        }

		public destroy() : void
		{
			if( this.destroyed )
				throw new Error( 'Eventor has been destroyed.' );

			this.removers.clear();

			this.destroyed = true;
		}
    }
}
