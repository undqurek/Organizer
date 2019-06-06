/// <reference path="Incrementer.ts" />


namespace Core
{
    export class Flagger
    {
        // variables

        private incrementer : Incrementer;

        // constructors

        public constructor( counter : number = 0 )
        {
            this.incrementer = new Incrementer( counter );
        }

        // public methods

        public generate() : number
        {
            let value = ( 1 << this.incrementer.generate() );

            if( value > Number.MAX_VALUE )
                throw new Error( 'Maximal flag value has been exceeded.' );

            return value;
        }
    }
}
