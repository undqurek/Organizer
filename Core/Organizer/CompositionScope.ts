

namespace Core.Organizer
{
    export class CompositionScope
    {
        // variables

        public destroyed : boolean = false;

        public working : boolean = false;

        // constructors

        public constructor( public handle : Element | null, public controllers : Map<ControllerNode>, public loops : Map<LoopNode>, public compositions : Map<CompositionNode> )
        {
            // nothing here ...
        }

        // helper methods

        private startControllers() : void
        {
            for( let el in this.controllers )
                this.controllers[ el ].start();
        }

        private startLoops() : void
        {
            for( let el in this.loops )
                this.loops[ el ].start();
        }

        private startCompositions() : void
        {
            for( let el in this.compositions )
                this.compositions[ el ].start();
        }

        private stopControllers() : void
        {
            for( let el in this.controllers )
                this.controllers[ el ].stop();
        }

        private stopLoops() : void
        {
            for( let el in this.loops )
                this.loops[ el ].stop();
        }

        private stopCompositions() : void
        {
            for( let el in this.compositions )
                this.compositions[ el ].stop();
        }

        private destroyControllers() : void
        {
            for( let el in this.controllers )
                this.controllers[ el ].destroy();
        }

        private destroyLoops() : void
        {
            for( let el in this.loops )
                this.loops[ el ].destroy();
        }

        private destroyCompositions() : void
        {
            for( let el in this.compositions )
                this.compositions[ el ].destroy();
        }

        // public methods

        public start() : void
        {
            if( this.destroyed )
                return;

            if( this.working == false )
            {
                this.startControllers();
                this.startLoops();
                this.startCompositions();

                this.working = true;
            }
        }

        public stop() : void
        {
            if( this.destroyed )
                return;

            if( this.working == true )
            {
                this.stopControllers();
                this.stopLoops();
                this.stopCompositions();

                this.working = false;
            }
        }

        public destroy() : void
        {
            if( this.destroyed )
                return;

            if( this.handle )
                Dom.removeNode( this.handle );

            this.destroyControllers();
            this.destroyLoops();
            this.destroyCompositions();

            this.destroyed = true;
        }
    }
}
