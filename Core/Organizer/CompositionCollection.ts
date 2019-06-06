namespace Core.Organizer
{
    export class CompositionCollection
    {
        // variables

        // constructors

        constructor( private compositions : Map<CompositionNode>, private organizer : Organizer, private bridges : Tube<Bridge> )
        {
            // nothing here...
        }

        // public methods

        public getComposition( name : string ) : CompositionEntry
        {
            let composition = this.compositions[ name ];

            if( composition == null )
                throw new Error( 'Composition "' + name +  '" does not exist in organizer "' + this.organizer.getName() + '".' );

            return composition.entry;
        }

        public composeTemplate<T>( name : string, parent ? : Controller<T> ) : Composition
        {
            let bridge = this.bridges.get( name, true );

            if( bridge == null )
                throw new Error( 'Template "' + name +  '" does not exist in organizer "' + this.organizer.getName() + '".' );

            return bridge.compose( parent );
        }
    }
}
