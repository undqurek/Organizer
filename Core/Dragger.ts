/**
 * Created by qurek on 22.11.2018.
 */
namespace Core
{
	class Workspace extends Position
	{
		// constructors

		public constructor( public handle : HTMLElement, public action ? : IWorkspaceAction )
		{
			super( handle.offsetLeft, handle.offsetTop );
		}
	}

	export interface IWorkspaceAction
	{
		( workspace : HTMLElement, newPosition : Position, oldPosition : Position ) : Position;
	}

	export interface IActivatorAction
	{
		( e : MouseEvent ) : void;
	}

    export class Dragger
    {
        // variables

        private destroyed : boolean = false;

		private eventor : Eventor = new Eventor();

        private workspaces : Array<Workspace> = new Array<Workspace>();

        // public methods

        public addWorkspace( handle : HTMLElement, action ? : IWorkspaceAction ) : IAction
        {
			if( this.destroyed )
				throw new Error( 'Dragger has been destroyed.' );

			let workspace = new Workspace( handle, action );

            this.workspaces.push( workspace );

			let removed = false;

            let result = () : void =>
            {
                if( removed )
                    return;

                this.workspaces.remove( workspace );

                removed = false;
            };

            return result;
        }

		public clearWorkspaces() : void
        {
			if( this.destroyed )
				throw new Error( 'Dragger has been destroyed.' );

			this.workspaces.clear();
        }

        public addActivator( handle : HTMLElement, mode : ScrollerMode = ScrollerMode.Both, onStart ? : IActivatorAction, onStop ? : IActivatorAction ) : IAction
        {
			// destroyed exception inside internal method

			if( document.body )
            {
				let active = false;

				let deltaX = 0;
				let deltaY = 0;

				let bResult = this.eventor.add( document.body, 'mouseup', ( e : MouseEvent ) : void =>
				{
					if( active ) // this condition is important (call from mouseleave too)
					{
						active = false;

						if( onStop ) // stop event can occur many times
							onStop( e );
					}
					else
						active = false;
				} );

				let dResult = this.eventor.add( document.body, 'mouseleave', ( e : MouseEvent ) : void =>
				{
					if( active ) // this condition is important (call from mouseup too)
					{
						active = false;

						if( onStop )
							onStop( e );
					}
					else
						active = false;
				} );

				if( mode == ScrollerMode.Horizontal )
                {
					let aResult = this.eventor.add( handle, 'mousedown', ( e : MouseEvent ) : void =>
					{
						deltaX = e.clientX;

						for( let entry of this.workspaces )
							entry.x = entry.handle.offsetLeft;

						active = true;

						if( onStart )
							onStart( e );
					} );

					let cResult = this.eventor.add( document.body, 'mousemove', ( e : MouseEvent ) : void =>
					{
						if( active )
						{
							let x = e.clientX - deltaX;

							for( let entry of this.workspaces )
							{
								let handle = entry.handle;
								let action = entry.action;

								if( action )
								{
									let oldPosition = new Position( entry.x + 0, entry.y + 0 );
									let newPosition = new Position( entry.x + x, entry.y + 0 );

									entry.x += x;

									let position = action( handle, newPosition, oldPosition );

									handle.style.left = position.x + 'px';
								}
								else
								{
									entry.x += x;

									handle.style.left = entry.x + 'px';
								}

								deltaX = e.clientX;
							}
						}
					} );

					return Cumulator.compose( aResult, bResult, cResult, dResult );
                }

                if( mode == ScrollerMode.Vertical )
                {
					let aResult = this.eventor.add( handle, 'mousedown', ( e : MouseEvent ) : void =>
					{
						deltaY = e.clientY;

						for( let entry of this.workspaces )
							entry.y = entry.handle.offsetTop;

						active = true;

						if( onStart )
							onStart( e );
					} );

					let cResult = this.eventor.add( document.body, 'mousemove', ( e : MouseEvent ) : void =>
					{
						if( active )
						{
							let y = e.clientY - deltaY;

							for( let entry of this.workspaces )
							{
								let handle = entry.handle;
								let action = entry.action;

								if( action )
								{
									let oldPosition = new Position( entry.x + 0, entry.y + 0 );
									let newPosition = new Position( entry.x + 0, entry.y + y );

									entry.y += y;

									let position = action( handle, newPosition, oldPosition );

									handle.style.top = position.y + 'px';
								}
								else
								{
									entry.y += y;

									handle.style.top = entry.y + 'px';
								}

								deltaY = e.clientY;
							}
						}
					} );

					return Cumulator.compose( aResult, bResult, cResult, dResult );
                }

				if( mode == ScrollerMode.Both )
				{
					let aResult = this.eventor.add( handle, 'mousedown', ( e : MouseEvent ) : void =>
					{
						deltaX = e.clientX;
						deltaY = e.clientY;

						for( let entry of this.workspaces )
						{
							let handle = entry.handle;

							entry.x = handle.offsetLeft;
							entry.y = handle.offsetTop;
						}

						active = true;

						if( onStart )
							onStart( e );
					} );

					let cResult = this.eventor.add( document.body, 'mousemove', ( e : MouseEvent ) : void =>
					{
						if( active )
						{
							let x = e.clientX - deltaX;
							let y = e.clientY - deltaY;

							for( let entry of this.workspaces )
							{
								let handle = entry.handle;
								let action = entry.action;

								let style = handle.style;

								if( action )
								{
									let oldPosition = new Position( entry.x + 0, entry.y + 0 );
									let newPosition = new Position( entry.x + x, entry.y + y );

									entry.x += x;
									entry.y += y;

									let position = action( handle, newPosition, oldPosition );

									style.left = position.x + 'px';
									style.top = position.y + 'px';
								}
								else
								{
									entry.x += x;
									entry.y += y;

									style.left = entry.x + 'px';
									style.top = entry.y + 'px';
								}

								deltaX = e.clientX;
								deltaY = e.clientY;
							}
						}
					} );

					return Cumulator.compose( aResult, bResult, cResult, dResult );
				}

				throw new Error( 'Indicated mode does not exist.' );
			}

            throw new Error( 'Body element does not exist.' );
        }

		public clearActivators() : void
		{
			// destroyed exception inside internal method

			this.eventor.clear();
		}

        public destroy() : void
        {
			if( this.destroyed )
				throw new Error( 'Dragger has been destroyed.' );

			this.eventor.destroy();

			this.destroyed = true;
		}
    }
}
