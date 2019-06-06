

namespace Core.Organizer
{
    export class ItemNode
    {
        // variables

        // constructors

        public constructor( public entry : ItemEntry<any, any>, public scope : ItemScope )
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
