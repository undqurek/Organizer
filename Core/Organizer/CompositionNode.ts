

namespace Core.Organizer
{
    export class CompositionNode
    {
        // constructors

        public constructor( public entry : CompositionEntry, public scope : CompositionScope )
        {
            // nothing here ...
        }

        // public methods

        public start() : void
        {
            this.scope.start();
        }

        public stop() : void
        {
            this.scope.stop();
        }

        public destroy() : void
        {
            this.scope.destroy();
        }
    }
}
