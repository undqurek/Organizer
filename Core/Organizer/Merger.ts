/**
 * Created by qurek on 03.02.2017.
 */
namespace Core.Organizer
{
	export class Dependency
	{
		/* Bridge name added to master organizer */
		public bridge : string;

		/* Bridge organizer namespace  */
		public namespace : any;

		/* Complement function organizer */
		public complement ? : IConsumer<Organizer>;

		/* Dependencies for bridge */
		public dependencies ? : Array<Dependency>;
	}

    export class Merger
    {
        // public methods

		public static run( master : Organizer, configs : Array<Dependency> ) : void
		{
			for( let config of configs )
			{
				let entry = Bootstrap.run( config.namespace, master );

				let slave = entry.getOrganizer();
				let bridge = entry.getBridge();

                if( config.dependencies )
                    this.run( slave, config.dependencies );

				if( config.complement )
                    config.complement( slave );

				master.addBridge( config.bridge, bridge );
			}
		}
    }
}
