

namespace Core.Organizer
{
    import Map = Core.Map;
    import CompositionCollection = Core.Organizer.CompositionCollection;
    import Composition = Core.Organizer.Composition;

    export class Changer
    {
        // variables

        private destroyed : boolean = false;

        private instances : Map<Composition> = { };

        private name : string = null;
        private instance : Composition = null;

        private started : boolean = false;

        // constructors

        public constructor( private parent : Controller<any> | null, private container : Element, private compositions : CompositionCollection )
        {
            // nothing here ...
        }

        // helper methods

		private callController( controller : Controller<any>, data ? : any, method : string = 'onBind' ) : void
		{
			let action = controller[ method ];

			if( action instanceof Function )
			{
				action.call( controller, data );

				return;
			}

			throw new Error( '"' + method + '" is not function.' );
		}

		private callComposition( composition : Composition, data ? : any, method : string = 'onBind' ) : void
		{
			let controller = composition.getController();

			this.callController( controller, data, method );
		}

        // public methods

		public getComposition( name ? : string ) : CompositionEntry | null
		{
			if( this.destroyed )
				throw new Error( 'Changer has been destroyed.' );

			if( name )
			{
				let instance = <any> this.instances[ name ];

				if( instance == null )
					instance = this.instances[ name ] = this.compositions.composeTemplate( name, this.parent );

				return instance.entry; //HACK
			}
			else
			{
				let instance = <any> this.instance;

				if( instance )
					return instance.entry; //HACK

				return null;
			}
		}

        public getController<C extends Controller<T>, T>( composition ? : string, controller ? : string ) : C | null
        {
            let entry = this.getComposition( composition );

            if( entry )
                return entry.getController( controller );

            return null;
        }

		public getLoop<C extends Controller<T>, T>( composition ? : string, loop ? : string ) : LoopEntry<C, T> | null
		{
			let entry = this.getComposition( composition );

			if( entry )
				return entry.getLoop( loop );

			return null;
		}

        public composeTemplate( name : string ) : void
        {
            if( this.destroyed )
                throw new Error( 'Changer has been destroyed.' );

            if( name in this.instances )
                throw new Error( 'Composition "' + name + '" has been composed.' );

            this.instances[ name ] = this.compositions.composeTemplate( name, this.parent );
        }

        public switchComposition( name : string, data ? : any, method : string = 'onBind' ) : void
        {
            if( this.destroyed )
                throw new Error( 'Changer has been destroyed.' );

            if( this.name == name )
                return;

            if( this.instance )
            {
                this.instance.stop();
                this.instance.remove();

                this.name = null;
                this.instance = null;
            }

            let instance = this.instances[ name ];

            if( instance == null )
                instance = this.instances[ name ] = this.compositions.composeTemplate( name, this.parent );

            if( data && method )
            	this.callComposition( instance, data, method );

            instance.mount( this.container );

            this.name = name;
            this.instance = instance;

            if( this.started )
                this.instance.start();
        }

		public destroyComposition( name : string ) : void
		{
			if( this.destroyed )
				throw new Error( 'Changer has been destroyed.' );

			if( this.name == name )
			{
				this.instance.stop();
				this.instance.remove();

				this.name = null;
				this.instance = null;
			}

			let instance = this.instances[ name ];

			if( instance )
			{
				instance.destroy();

				delete this.instances[ name ];
			}
		}

        public startComposition() : void
        {
            if( this.destroyed )
                throw new Error( 'Changer has been destroyed.' );

            if( this.instance )
                this.instance.start();

            this.started = true;
        }

        public stopComposition() : void
        {
            if( this.destroyed )
                throw new Error( 'Changer has been destroyed.' );

            if( this.instance )
                this.instance.stop();

            this.started = false;
        }

        public destroy() : void
        {
            if( this.destroyed )
                return;

            for( let el in this.instances )
            {
                let entry = this.instances[ el ];

                entry.destroy();
            }

            this.destroyed = true;
        }
    }
}



//
//
// namespace Core.Organizer
// {
//     import Map = Core.Map;
//     import CompositionCollection = Core.Organizer.CompositionCollection;
//     import Composition = Core.Organizer.Composition;
//
//     export class Changer
//     {
//         // variables
//
//         private destroyed : boolean = false;
//
//         private instances : Map<Composition> = { };
//
//         private name : string = null;
//         private cache : Composition = null;
//
//         private started : boolean = false;
//
//         // constructors
//
//         public constructor( private parent : any | null, private container : Element, private compositions : CompositionCollection )
//         {
//             // nothing here ...
//         }
//
//         // public methods
//
//         public composeTemplate( name : string ) : void
//         {
//             if( this.destroyed )
//                 throw new Error( 'Manager has been destroyed.' );
//
//             if( name in this.instances )
//                 throw new Error( 'Composition "' + name + '" has been composed.' );
//
//             this.instances[ name ] = this.compositions.composeTemplate( name, this.parent );
//         }
//
//         public switchComposition( name : string, data ? : any ) : void
//         {
//             if( this.destroyed )
//                 throw new Error( 'Manager has been destroyed.' );
//
//             if( this.name == name )
//                 return;
//
//             if( this.cache )
//             {
//                 this.name = null;
//
//                 this.cache.stop();
//                 this.cache.remove();
//             }
//
//             this.cache = this.instances[ name ];
//
//             if( this.cache == null )
//                 this.cache = this.instances[ name ] = this.compositions.composeTemplate( name, this.parent );
//
//             this.name = name;
//
//             if( data )
//             {
//                 let controller = this.cache.getController<any, any>();
//
//                 if( controller.onBind )
//                     controller.onBind( data );
//             }
//
//             this.cache.mount( this.container );
//
//             if( this.started )
//                 this.cache.start();
//         }
//
//         public startComposition() : void
//         {
//             if( this.destroyed )
//                 throw new Error( 'Manager has been destroyed.' );
//
//             if( this.cache )
//                 this.cache.start();
//
//             this.started = true;
//         }
//
//         public stopComposition() : void
//         {
//             if( this.destroyed )
//                 throw new Error( 'Manager has been destroyed.' );
//
//             if( this.cache )
//                 this.cache.stop();
//
//             this.started = false;
//         }
//
//         public destroy() : void
//         {
//             if( this.destroyed )
//                 return;
//
//             for( let el in this.instances )
//             {
//                 let entry = this.instances[ el ];
//
//                 entry.destroy();
//             }
//
//             this.destroyed = true;
//         }
//     }
// }
