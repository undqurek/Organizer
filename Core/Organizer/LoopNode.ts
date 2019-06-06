

namespace Core.Organizer
{
    export class LoopNode
    {
        // variables

        // constructors

        public constructor( public entry : LoopEntry<any, any>, public scope : LoopScope )
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
