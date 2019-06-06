
namespace Core
{
    export class Descriptor
    {
        // variables

        private static counter : number = 0;

        // public methods

        public static generate() : string
        {
            let value = ( ++this.counter ) + Math.random();

            return 'handle-' + value;
        }
    }
}
