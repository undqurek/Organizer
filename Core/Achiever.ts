/**
 * Created by qurek on 22.11.2018.
 */
namespace Core
{
    export class Achiever
    {
        // variables

        private eventor : Eventor = new Eventor();

        // constructors

        public constructor( private handle : Element, private tolerance : number )
        {
            // nothing here ...
        }

        // public methods

		public check() : boolean
		{
			return this.handle.scrollTop > this.handle.scrollHeight - this.handle.clientHeight - this.tolerance;
		}
    }
}
