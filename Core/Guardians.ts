/**
 * Created by qurek on 22.11.2018.
 */
namespace Core
{
	export class SingleGuardian
	{
		// variables

		private blocked : boolean = false;

		// public methods

		public get() : boolean
		{
			return this.blocked;
		}

		public set( permanent : boolean = false ) : boolean
		{
			if( permanent == false )
			{
				if( this.blocked )
					return false;
			}

			this.blocked = true;

			return true;
		}

		public clear() : void
		{
			this.blocked = false;
		}
	}

    export class PluralGuardian
    {
		// variables

		private map : Map<boolean> = new Map<boolean>();

		// public methods

		public get( name : string ) : boolean
		{
			if( this.map[ name ] )
				return true;

			return false;
		}

		public add( name : string, permanent : boolean = false ) : boolean
		{
			if( permanent == false )
			{
				if( this.map[ name ] )
					return false;
			}

			this.map[ name ] = true;

			return true;
		}

		public remove( name : string ) : boolean
		{
			return delete this.map[ name ];
		}

		public clear() : void
		{
			this.map = new Map<boolean>();
		}
	}
}
