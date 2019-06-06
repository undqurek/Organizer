/**
 * Created by qurek on 01.11.2016.
 */
namespace Core
{
    export class ConditionalAction
    {
        // variables

        private limiter : number = 0;
        private counter : number = 0;

        // constructors

        public constructor( private barrier : number, private owner : any, private finalizer : Function )
        {
            // nothing here ...
        }

        // public methods

        public schedule( owner : any, callback : Function ) : Function
        {
            if( this.limiter < this.barrier )
            {
                let guardian = new SingleGuardian();

                let action : Function = ( ...parameters : Array<any> ) : void =>
                {
                    if( guardian.set() )
                    {
						this.counter += 1;

						callback.apply( owner, parameters );

						if( this.counter == this.barrier )
							this.finalizer.apply( this.owner );
                    }
                };

                this.limiter += 1;

                return action;
            }

            return null;
        }
    }
}
