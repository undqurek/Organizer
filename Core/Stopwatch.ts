/**
 * Created by qurek on 13.11.2016.
 */
namespace Core
{
    export class Stopwatch
    {
        // variables

        private handle : number = null;

        // events

        public onInterval : ( time : number ) => void;
        public onFinished : ( time : number ) => void;

        // public methods

        public start( limit : number, interval : number = 1000 ) : boolean
        {
            if( this.handle == null )
            {
                let time : number = 0;

                let action = () =>
                {
                    if( time < limit )
                    {
                        time += 1;

                        if( this.onInterval )
                            this.onInterval( time );
                    }
                    else
                    {
                        window.clearInterval( this.handle );

                        this.handle = null;

                        if( this.onFinished )
                            this.onFinished( time );
                    }
                };

                this.handle = window.setInterval( action, interval );

                return true;
            }

            return false;
        }

        public stop() : boolean
        {
            if( this.handle == null )
                return false;

            window.clearInterval( this.handle );

            this.handle = null;

            return true;
        }
    }
}
