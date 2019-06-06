/**
 * Created by qurek on 28.09.2018.
 */
namespace Core.Organizer
{
    export class Resource
    {
        constructor( public controller : ControllerType<any, any>, public services : Tube<Object> )
        {
            // nothing here...
        }
    }
}
