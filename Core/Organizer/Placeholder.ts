namespace Core.Organizer
{
    export class SinglePlaceholder
    {
		// constructors

		constructor( private master : Element )
        {
            // nothing here ...
        }

		// public methods

		public mount( scope : Element, pattern : ParentPattern ) : void
        {
            let placeholder = Dom.findHandle( 'script[id="' + pattern.identifier + '"]', this.master );

            if( placeholder == null )
                throw new Error( 'Placeholder with id "' + pattern.identifier + '" does not exist.' );

            let parent = placeholder.parentNode;

            parent.insertBefore( scope, placeholder );
            parent.removeChild( placeholder );
        }
    }

    export class MultiPlaceholder
    {
        // variables

        private identifier : string;

        private placeholder : Node;
        private parent : Node;

        // constructors

        constructor( master : Element, pattern : ParentPattern )
        {
			this.identifier = pattern.identifier;

			this.placeholder = Dom.findHandle( 'script[id="' + this.identifier + '"]', master );

            if( this.placeholder == null )
                throw new Error( 'Placeholder with id "' + this.identifier + '" does not exist.' );

            this.parent = this.placeholder.parentNode;
        }

        // public methods

        public mount( node : Node, placeholder ? : Node ) : void
        {
            if( placeholder )
            {
                if( placeholder.parentNode != this.parent )
                    throw new Error( 'Placeholder handle is not child of "' + this.identifier + '".' );
            }
            else
                placeholder = this.placeholder;

            this.parent.insertBefore( node, placeholder );
        }
    }
}
