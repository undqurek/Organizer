
namespace Core
{
	export class Cumulator
	{
		public static compose( ...functions : Array<IAction> ) : IAction
		{
			let result = () : void =>
			{
				for( let entry of functions )
					entry();
			};

			return result;
		}
	}
}
