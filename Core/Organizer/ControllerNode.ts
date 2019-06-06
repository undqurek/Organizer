

namespace Core.Organizer
{
    export class ControllerNode
    {
        // constructors

        public constructor( public entry : ControllerEntry, public scope : ControllerScope )
        {
            // nothing here...
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
