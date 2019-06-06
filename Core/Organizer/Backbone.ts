/// <reference path="Transistor.ts" />
/// <reference path="../Template/Preprocessor.ts" />
/// <reference path="../Template/Template.ts" />


/**
 * Created by qurek on 22.01.2017-30.09.2018.
 */
namespace Core.Organizer
{
	import Template = Core.Template.Template;

	export class Backbone
	{
		// constructors

		constructor( private templates : Map<TemplatePattern>, private organizer : Organizer, private services : Tube<Object>, private bridges : Tube<Bridge>, private resources : Tube<Resource>, private debug : boolean = false )
		{
			// nothing here...
		}

		// public methods

		public static getHandle( node : CompositionNode ) : Element
		{
			if( node.scope.handle )
				return node.scope.handle;

			else
			{
				let controllers = node.scope.controllers;

				for( let el in controllers )
				{
					let controller = controllers[ el ];

					return controller.scope.handle;
				}
			}
		}

		public static getController( patterns : Map<ControllerPattern> ) : ControllerEntity
		{
			let name = null; // this variable is necessary
			let pattern = null;

			for( let el in patterns )
			{
				if( pattern )
					throw new Error( 'Root controller is duplicated (name: "' + pattern.name + '", type: "' + pattern.type + '") - allowed is only one controller.' );

				pattern = patterns[ name = el ];
			}

			if( pattern == null )
				throw new Error( 'Root controller does not exist.' );

			return new ControllerEntity( name, pattern );
		}

		public static hasPattern( patterns : Map<ParentPattern> ) : boolean
		{
			for( let el in patterns )
				return true;

			return false;
		}

		public constructLogic( pattern : ScopePattern, resource : Resource, parent ? : Controller<any>, index ? : number, data ? : any ) : ControllerNode
		{
			let type = resource.controller;

			let handle = Dom.cloneElement( pattern.handle );
			let instance = new type( this.organizer );

			Template.expose( handle, instance, true, this.debug );

			if( this.debug )
				Event.add( handle, '-> [ CONTROLLER ]', instance.constructor, false );

			let controllers = this.prepareControllers( pattern.controllers, instance, handle );
			let loops = this.prepareLoops( pattern.loops, instance, handle );
			let compositions = this.prepareCompositions( pattern.compositions, instance, handle );

			let destroyers = new Array<IAction>(); // subscriptions

			let injections = Transistor.detectInjections( type );
			let subscriptions = Transistor.detectSubscriptions( type );

			let cache : Map<Object> = { };

			if( injections )
			{
				for( let entry of injections )
				{
					if( entry.variable in instance )
						throw new Error( 'Injection: Variable "' + entry.variable +  '" already exist in controller "' + type[ 'name' ] + '" in organizer "' + this.organizer.getName() + '".' );

					if( entry.service == InjectionName.Loops )
					{
						if( entry.selector )
							throw new Error( 'Injection: Selector can be used only with "' + InjectionName.Compositions + '" service injection (organizer "' + this.organizer.getName() + '" -> controller "' + type[ 'name' ] + '").' );

						let collection = new LoopCollection( loops, this.organizer );

						if( entry.item )
							instance[ entry.variable ] = collection.getLoop( entry.item );

						else
							instance[ entry.variable ] = collection;

						continue;
					}

					if( entry.service == InjectionName.Controllers )
					{
						if( entry.selector )
							throw new Error( 'Injection: Selector can be used only with "' + InjectionName.Compositions + '" service injection (organizer "' + this.organizer.getName() + '" -> controller "' + type[ 'name' ] + '").' );

						let collection = new ControllerCollection( controllers, this.organizer );

						if( entry.item )
							instance[ entry.variable ] = collection.getController(  entry.item);

						else
							instance[ entry.variable ] = collection;

						continue;
					}

					if( entry.service == InjectionName.Compositions )
					{
						let collection = new CompositionCollection( compositions, this.organizer, this.bridges );

						if( entry.item )
						{
							let selector = entry.selector;

							if( selector )
							{
								if( selector instanceof Function )
								{
									let item = selector( collection.getComposition( entry.item ) );

									if( item == null )
										throw new Error( 'Injection: Selector result is null (organizer "' + this.organizer.getName() + '" -> controller "' + type[ 'name' ] + '" -> service "' + entry.service  + '" -> item "' + entry.item + '").' );

									instance[ entry.variable ] = item;
								}
								else
									throw new Error( 'Injection: Selector is not function (organizer "' + this.organizer.getName() + '" -> controller "' + type[ 'name' ] + '" -> service "' + entry.service  + '" -> item "' + entry.item + '").' );
							}
							else
								instance[ entry.variable ] = collection.getComposition( entry.item );
						}
						else
							instance[ entry.variable ] = collection;

						continue;
					}

					if( entry.item )
						throw new Error( 'Injection: Item can be used only with "' + InjectionName.Loops + '", "' + InjectionName.Controllers + '" or "' + InjectionName.Compositions + '" service injection (organizer "' + this.organizer.getName() + '" -> controller "' + type[ 'name' ] + '" -> service "' + entry.service  + '").' );

					if( entry.selector )
						throw new Error( 'Injection: Selector can be used only with "' + InjectionName.Compositions + '" service injection (organizer "' + this.organizer.getName() + '" -> controller "' + type[ 'name' ] + '" -> service "' + entry.service  + '").' );

					if( entry.service == InjectionName.Organizer )
					{
						instance[ entry.variable ] = this.organizer;

						continue;
					}

					if( entry.service == InjectionName.Parent )
					{
						if( parent == null )
							throw new Error( 'Injection: Parent controller (injection "' + InjectionName.Parent + '") does not exist for controller "' + type[ 'name' ] + '" in organizer "' + this.organizer.getName() + '".' );

						instance[ entry.variable ] = parent;

						continue;
					}

					let service = cache[ entry.service ];

					if( service == null )
					{
						service = this.services.get( entry.service, true );

						if( service == null )
							throw new Error( 'Injection: Service "' + entry.service +  '" does not exist for controller "' + type[ 'name' ] + '" in organizer "' + this.organizer.getName() + '".' );

						cache[ entry.service ] = service;
					}

					instance[ entry.variable ] = service;
				}
			}

			if( subscriptions )
			{
				for( let entry of subscriptions )
				{
					let action = instance[ entry.key ];

					if( action == null )
						throw new Error( 'Subscription: Method "' + entry.key +  '" does not exist in controller "' + type[ 'name' ] + ' " in organizer "' + this.organizer.getName() + '".' );

					let service = cache[ entry.service ];

					if( service == null )
					{
						service = this.services.get( entry.service, true );

						if( service == null )
							throw new Error( 'Subscription: Service "' + entry.service +  '" does not exist for controller "' + type[ 'name' ] + '" in organizer "' + this.organizer.getName() + '".' );

						cache[ entry.service ] = service;
					}

					let cast = service as Instance<any>;

					if( cast.addListener )
					{
						let proxy = action.bind( instance );

						destroyers.push( cast.addListener( entry.event, proxy ) );
					}
					else
						throw new Error( 'Subscription: Service "' + entry.service +  '" has not addListener method (organizer "' + this.organizer.getName() + '").' );
				}
			}

			if( instance.onCreate )
				instance.onCreate( index, data );

			let scope = new ControllerScope( handle, instance, destroyers, controllers, loops, compositions );
			let entry = new ControllerEntry( handle, instance, scope );

			return new ControllerNode( entry, scope );
		}

		public constructBridge( bridge : Bridge, parent ? : Controller<any> ) : CompositionNode
		{
			let composition = <any> bridge.compose( parent );

			return composition.composition; //HACK
		}

		public constructController( pattern : ControllerPattern, resource ? : Resource, parent ? : Controller<any>, index ? : number, data ? : any ) : ControllerNode
		{
			if( resource == null )
			{
				resource = this.resources.get( pattern.type, true );

				if( resource == null )
					throw new Error( 'Controller "' + pattern.type +  '" does not exist in organizer "' + this.organizer.getName() + '".' );
			}

			return this.constructLogic( pattern, resource, parent, index, data );
		}

		public mountController( pattern : ControllerPattern, parent : Controller<any> | null, placeholder : SinglePlaceholder ) : ControllerNode
		{
			let instance = this.constructController( pattern, null, parent );

			placeholder.mount( instance.scope.handle, pattern );

			return instance;
		}

		public mountControllers( patterns : Map<ControllerPattern>, parent : Controller<any> | null, placeholder : SinglePlaceholder ) : Map<ControllerNode>
		{
			let instances : Map<ControllerNode> = { };

			for( let el in patterns )
				instances[ el ] = this.mountController( patterns[ el ],  parent, placeholder );

			return instances;
		}

		public prepareControllers( patterns : Map<ControllerPattern>, parent : Controller<any> | null, master : Element ) : Map<ControllerNode>
		{
			let placeholder = new SinglePlaceholder( master );

			return this.mountControllers( patterns, parent, placeholder );
		}

		public constructLoop( pattern : LoopPattern, parent : Controller<any> | null, master : Element ) : LoopNode
		{
			// resource can not exists (can be set during item adding)

			let functions = pattern.functions;

			let array : IndexedCollection = null;
			let map : MappedCollection = null;

			let items : Array<ICollection> = [ ];

			if( functions.length > 0 )
			{
				for( let entry of functions )
				{
					switch ( entry.name )
					{
						case 'array':
							items.push( array = new IndexedCollection() );
							break;

						case 'object':
						{
							let parameters = entry.parameters;

							if( parameters.length == 1 )
							{
								let parameter = parameters[ 0 ];

								items.push( map = new MappedCollection( parameter.split( '.' ) ) );
							}
							else
								items.push( map = new MappedCollection() );
						}
							break;

						default:
							throw new Error( 'Loop "' + pattern.name + '" supports only "array" and "object(path.to.id)" parameter (organizer: "' + this.organizer.getName() + '").' );
					}
				}
			}
			else
				items.push( array = new IndexedCollection() );

			let backbone = this;

			let collection = new ComposedCollection( items );
			let placeholder = new MultiPlaceholder( master, pattern );

			let resource = this.resources.get( pattern.logic, true ); // resource can be null

			let scope = new LoopScope( collection );
			let entry = new LoopEntry( pattern, resource, parent, this.organizer, backbone, this.services, array, map, collection, placeholder, scope );

			return new LoopNode( entry, scope );
		}

		public constructLoops( patterns : Map<LoopPattern>, parent : Controller<any> | null, master : Element ) : Map<LoopNode>
		{
			let instances : Map<LoopNode> = { };

			for( let el in patterns )
				instances[ el ] = this.constructLoop( patterns[ el ], parent, master );

			return instances;
		}

		public prepareLoops( patterns : Map<LoopPattern>, parent : Controller<any> | null, master : Element ) : Map<LoopNode>
		{
			return this.constructLoops( patterns, parent, master );
		}

		public constructComposition( pattern : RootPattern | TemplatePattern, parent ? : Controller<any> ) : CompositionNode
		{
			if( pattern.handle )
			{
				let handle = Dom.cloneElement( pattern.handle );

				let controllers = this.prepareControllers( pattern.controllers, parent, handle );
				let loops = this.prepareLoops( pattern.loops, parent, handle );
				let compositions = this.prepareCompositions( pattern.compositions, parent, handle );

				let scope = new CompositionScope( handle, controllers, loops, compositions );
				let entry = new CompositionEntry( handle, scope );

				return new CompositionNode( entry, scope );
			}
			else
			{
				let self = Backbone;

				if( self.hasPattern( pattern.loops ) )
					throw new Error( 'Loop cannot be root element (organizer "' + this.organizer.getName() + '").' );

				if( self.hasPattern( pattern.compositions ) )
					throw new Error( 'Composition cannot be root element (organizer "' + this.organizer.getName() + '").' );

				let entity = self.getController( pattern.controllers );
				let controller = this.constructController( entity.pattern, null, parent );

				let controllers : Map<ControllerNode> = { };
				let loops : Map<LoopNode> = { };
				let compositions : Map<CompositionNode> = { };

				controllers[ entity.name ] = controller;

				let scope = new CompositionScope( null, controllers, loops, compositions );
				let entry = new CompositionEntry( null, scope );

				return new CompositionNode( entry, scope );
			}
		}

		public mountComposition( pattern : CompositionPattern, parent : Controller<any> | null, placeholder : SinglePlaceholder ) : CompositionNode
		{
			let composition : CompositionNode;

			{
				let template = this.templates[ pattern.template ];

				if( template == null )
				{
					let bridge = this.bridges.get( pattern.template, true );

					if( bridge == null )
						throw new Error( 'Template "' + pattern.template +  '" does not exist in organizer "' + this.organizer.getName() + '".' );

					composition = this.constructBridge( bridge, parent );
				}
				else
					composition = this.constructComposition( template, parent );
			}

			let handle = Backbone.getHandle( composition );

            // if( this.debug )
            // {
            //     let container = Dom.createElement( 'var-debug' );
			//
            //     container.setAttribute( 'var-mount', pattern.template + ' as ' + pattern.name );
            //     container.appendChild( handle );
			//
            //     placeholder.mount( container, pattern );
            // }
            // else
                placeholder.mount( handle, pattern );

            return composition;
		}

		public mountCompositions( patterns : Map<CompositionPattern>, parent : Controller<any> | null, placeholder : SinglePlaceholder ) : Map<CompositionNode>
		{
			let instances : Map<CompositionNode> = { };

			for( let el in patterns )
				instances[ el ] = this.mountComposition( patterns[ el ], parent, placeholder );

			return instances;
		}

		public prepareCompositions( patterns : Map<CompositionPattern>, parent : Controller<any> | null, master : Element ) : Map<CompositionNode>
		{
			let placeholder = new SinglePlaceholder( master );

			return this.mountCompositions( patterns, parent, placeholder );
		}
	}
}