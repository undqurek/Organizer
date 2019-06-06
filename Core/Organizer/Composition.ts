/// <reference path="LoopEntry.ts" />


namespace Core.Organizer
{
    export class Composition
    {
        // variables

        private handle : Element;

        private entry : CompositionEntry;
        private scope : CompositionScope;

        // constructors

        public constructor( private composition : CompositionNode )
        {
            this.handle = Backbone.getHandle( composition );

            this.entry = composition.entry;
            this.scope = composition.scope;
        }

        // public methods

        public getHandle() : Element
        {
            if( this.scope.destroyed )
                throw new Error( 'Composition has been destroyed.' );

            return this.handle;
        }

        public getController<C extends Controller<T>, T>( name ? : string ) : C
        {
            return this.entry.getController( name );
        }

        public getLoop<C extends Controller<T>, T>( name ? : string ) : LoopEntry<C, T>
        {
            return this.entry.getLoop( name );
        }

        public mount( parent : Node, placeholder ? : Node ) : void
        {
            if( this.scope.destroyed )
                throw new Error( 'Composition has been destroyed.' );

            parent.insertBefore( this.handle, placeholder );
        }

        public replace( placeholder : Node ) : void
        {
            if( this.scope.destroyed )
                throw new Error( 'Composition has been destroyed.' );

            let parent = placeholder.parentNode;

            if( parent == null )
                throw new Error( 'Indicated element has not parent.' );

            parent.insertBefore( this.handle, placeholder );
            parent.removeChild( placeholder );
        }

        public remove() : void
        {
            if( this.scope.destroyed )
                throw new Error( 'Composition has been destroyed.' );

            Dom.removeNode( this.handle );
        }

        public start() : void
        {
            if( this.scope.destroyed )
                throw new Error( 'Composition has been destroyed.' );

            this.scope.start();
        }

        public stop() : void
        {
            if( this.scope.destroyed )
                throw new Error( 'Composition has been destroyed.' );

            this.scope.stop();
        }

        public destroy() : void
        {
            this.composition.destroy();
        }
    }
}
