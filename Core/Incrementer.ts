
namespace Core
{
    export class Incrementer
    {
        // variables

		private counter : number;

        // constructors

        public constructor( counter : number = 0 )
        {
            this.counter = counter - 1;
        }

        // public methods

        public generate() : number
        {
            return this.counter += 1;
        }
    }
}
