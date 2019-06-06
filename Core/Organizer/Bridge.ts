/**
 * Created by qurek on 03.02.2017.
 */
namespace Core.Organizer
{
    export class Bridge
    {
        // constructors

        public constructor( private root : RootPattern, private compositor : Compositor, private callback : IAction )
        {
            // nothing here ...
        }

        // public methods

        public compose<T>( parent ? : Controller<T> ) : Composition
        {
            this.callback();

            return this.compositor.compose( this.root, parent );
        }
    }
}
