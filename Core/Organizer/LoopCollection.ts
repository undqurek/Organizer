namespace Core.Organizer
{
    export class LoopCollection
    {
        // constructors

        constructor( private loops : Map<LoopNode>, private organizer : Organizer )
        {
            // nothing here...
        }

        // public methods

        public getLoop<C extends Controller<T>, T>( name : string ) : LoopEntry<C, T>
        {
            let loop = this.loops[ name ];

            if( loop == null )
                throw new Error( 'Loop "' + name +  '" does not exist in organizer "' + this.organizer.getName() + '".' );

            return loop.entry;
        }
    }
}
