namespace Core.Organizer
{
    export class ControllerCollection
    {
        constructor( private controllers : Map<ControllerNode>, private organizer : Organizer )
        {
            // nothing here...
        }

        public getController<C extends Controller<T>, T>( name : string ) : C
        {
            let controller = this.controllers[ name ];

            if( controller == null )
                throw new Error( 'Controller "' + name +  '" does not exist in organizer "' + this.organizer.getName() + '".' );

            return controller.scope.instance as C;
        }
    }
}
