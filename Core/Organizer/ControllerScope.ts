

namespace Core.Organizer
{
    export class ControllerScope
    {
        // variables

        public destroyed : boolean = false;

        public working : boolean = false;

        // constructors

        public constructor( public handle : Element, public instance : Controller<any> | any, public subscriptions : Array<IAction>, public controllers : Map<ControllerNode>, public loops : Map<LoopNode>, public compositions : Map<CompositionNode> )
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

        private startInstance() : void
        {
            if( this.instance.onStart )
                this.instance.onStart();
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

        private stopInstance() : void
        {
            if( this.instance.onStop )
                this.instance.onStop();
        }

        private destroySubscriptions() : void
        {
            for( let entry of this.subscriptions )
                entry();
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

        private destroyInstance() : void
        {
            if( this.instance.onDestroy )
                this.instance.onDestroy();
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
                this.startInstance();

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
                this.stopInstance();

                this.working = false;
            }
        }

        public destroy() : void
        {
            if( this.destroyed )
                return;

            Dom.removeNode( this.handle );

            this.destroySubscriptions();
            this.destroyControllers();
            this.destroyLoops();
            this.destroyCompositions();
            this.destroyInstance();

            this.destroyed = true;
        }
    }
}
