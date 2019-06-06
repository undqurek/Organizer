

namespace Core.Organizer
{
    export class LoopScope
    {
        // variables

        public destroyed : boolean = false;

        public working : boolean = false;

        // constructors

        constructor( protected collection : ComposedCollection )
        {
            // nothing here ...
        }

        // public methods

        public start() : void
        {
            if( this.destroyed )
                return;

            if( this.working == false )
            {
                this.collection.iterateItems(  ( index : number, node : ItemNode ) : boolean =>
                {
                    node.start();

                    return true;
                } );

                this.working = true;
            }
        }

        public stop() : void
        {
            if( this.destroyed )
                return;

            if( this.working == true )
            {
                this.collection.iterateItems(  ( index : number, node : ItemNode ) : boolean =>
                {
                    node.start();

                    return true;
                } );

                this.working = false;
            }
        }

        public destroy() : void
        {
            if( this.destroyed )
                return;

            this.collection.iterateItems(  ( index : number, node : ItemNode ) : boolean =>
            {
                node.destroy();

                return true;
            } );

            this.destroyed = true;
        }
    }
}
