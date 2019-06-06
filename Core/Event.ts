/**
 * Created by qurek on 22.11.2018.
 */
namespace Core
{
    export class Event
    {
        // public methods

        public static add( object : any | Element, event : string, action : Function, capturing : boolean = false ) : IAction
        {
            throw new Error( 'This method is not supported.' );
        }

        public static remove( object : any | Element, event : string, action : Function, capturing : boolean = false ) : void
        {
            throw new Error( 'This method is not supported.' );
        }
    }

    // cases

    if ( 'addEventListener' in window )
    {
        Event.add = ( object : any | Element, event : string, action : Function, capturing : boolean = false ) : IAction =>
        {
            object.addEventListener( event, action as any, capturing );

            let removed = false;

            let result = () : void =>
            {
                if( removed )
                    return;

                object.removeEventListener( event, action as any, capturing );

                removed = true;
            };

            return result;
        };

        Event.remove = ( object : any | Element, event : string, action : Function, capturing : boolean = false ) : void =>
        {
            object.removeEventListener( event, action as any, capturing );
        };
    }
    else
    {
        if( 'attachEvent' in window ) // older IE (before 9)
        {
            Event.add = ( object : any | Element, event : string, action : Function, capturing : boolean = false ) : IAction =>
            {
                object.attachEvent( 'on' + event, action );

                let removed = false;

                let result = () : void =>
                {
                    if( removed )
                        return;

                    object.detachEvent( 'on' + event, action );

                    removed = true;
                };

                return result;
            };

            Event.remove = ( object : any | Element, event : string, action : Function, capturing : boolean = false ) : void =>
            {
                object.detachEvent( 'on' + event, action );
            };
        }
        else
            throw new Error( 'Events are not supported.' );
    }
}
