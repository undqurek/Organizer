/**
 * Created by qurek on 02.08.2017.
 */
namespace Core
{
    export class Styler
    {
        // variables

        private list : DOMTokenList;

        // constructors

        public constructor( handle : Element )
        {
            this.list = handle.classList;
        }

        // public methods

        public set( condition : boolean, style : string ) : void
        {
            let action = condition ? this.list.add : this.list.remove;

            action.call( this.list, style );
        }

        public add( style : string ) : void
        {
            this.list.add( style );
        }

        public remove( style : string ) : void
        {
            this.list.remove( style );
        }
    }
}
