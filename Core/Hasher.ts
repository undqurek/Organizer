
namespace Core
{
	export class Hasher
    {
		// constants

		private static readonly VALUES : Array<string> = [
			'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
			'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'w', 'y', 'x', 'z',
			'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'W', 'Y', 'X', 'Z'
		];

		// constructors

		private constructor()
		{
			// nothing here...
		}

		// public methods

		public static generateHash( size : number ) : string
		{
			let result = '';

			let limit = this.VALUES.length - 1;

			for( let i = 0; i < size; ++i )
			{
				let index = Math.round( limit * Math.random() );

				result += this.VALUES[ index ];
			}

			return result;
		}
    }
}
