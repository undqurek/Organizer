/**
 * Created by qurek on 22.11.2018.
 */
namespace Core
{
    export class Blocker
    {
        // variables

        private eventor : Eventor = new Eventor();

        // constructors

        public constructor( private progress : boolean = false )
        {
            // nothing here ...
        }

        // public methods

        public add( handle : Element, action : Function ) : void
        {
            this.eventor.add( handle, 'click', ( e : MouseEvent ) : void =>
            {
                this.progress = false;
            } );

            this.eventor.add( document.body, 'click', ( e : MouseEvent ) : void =>
            {
                if( this.progress )
                    action();

                else
                    this.progress = true;
            } );
        }

        public signal( progress : boolean = false ) : void
        {
            this.progress = progress;
        }

        public clear() : void
        {
            this.progress = false;

            this.eventor.clear();
        }
    }
}
