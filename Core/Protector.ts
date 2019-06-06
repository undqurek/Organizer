/// <reference path="Interfaces.ts" />


/**
 * Created by qurek on 13.11.2016.
 */
namespace Core
{
    export interface IProtect
    {
        ( check : IAction ) : void
    }

    export class Protector
    {
        public static mediate( action : IProtect ) : void
        {
            let progress : boolean = true;

            let protect = () : void =>
            {
                if( progress )
                    throw new Error( 'Commit logic can not be called outside event sequence.' );
            };

            try
            {
                action( protect );
            }
            finally
            {
                progress = false;
            }
        }

        public static create( action : Function ) : Function
        {
            let called : boolean = false;

            let result = ( ...parameters : Array<any> ) : void =>
            {
                if( called )
                    return;

                try
                {
                    action.apply( action, parameters );
                }
                finally
                {
                    called = false;
                }
            };

            return result;
        }
    }
}
