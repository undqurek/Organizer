
namespace Core
{
    export enum ScrollerMode
    {
        // do not change those values

        Horizontal = 1,
        Vertical = 2,
        Both = Horizontal | Vertical
    }

    export class ScrollerActivator
	{
		// constructors

		public constructor( public padding : number, public activator : HTMLElement )
		{
			// nothing here ...
		}
	}

	export class WheelScroller
	{
		// variables

		private destroyed : boolean = false;

		private eventor : Eventor = new Eventor();

		// public methods

		public addListener( element : Element, mode : ScrollerMode = ScrollerMode.Both ) : IAction
		{
			if( this.destroyed )
				throw new Error( 'Scroller has been destroyed.' );

			let actions = new Array<Function>();

			if( mode & ScrollerMode.Horizontal )
			{
				actions.push( ( e : WheelEvent ) : void =>
				{
					element.scrollLeft += e.deltaX;
				} );
			}

			if( mode & ScrollerMode.Vertical )
			{
				actions.push( ( e : WheelEvent ) : void =>
				{
					element.scrollTop += e.deltaY;
				} );
			}

			let result = this.eventor.add( element, 'wheel', ( e : MouseEvent ) : void =>
			{
				for( let entry of actions )
					entry( e );
			} );

			return result;
		}

		public clearListeners() : void
		{
			if( this.destroyed )
				throw new Error( 'Scroller has been destroyed.' );

			this.eventor.clear();
		}

		public destroy() : void
		{
			if( this.destroyed )
				throw new Error( 'Scroller has been destroyed.' );

			this.eventor.destroy();

			this.destroyed = true;
		}
	}

    export class CursorScroller
    {
        // variables

		private destroyed : boolean = false;

		private eventor : Eventor = new Eventor();

        // public methods

        public addListener( element : HTMLElement, mode : ScrollerMode = ScrollerMode.Both, padding : number = 0, activator : HTMLElement = null) : IAction
        {
			if( this.destroyed )
				throw new Error( 'Scroller has been destroyed.' );

			if( activator == null )
				activator = element;

			let deltaX = 0;
            let deltaY = 0;

            let actions = new Array<Function>();

            if( mode & ScrollerMode.Horizontal )
            {
                let tmp = 2.0 * padding + 1.0;

                actions.push( ( e : MouseEvent ) : void =>
                {
                    if( element.scrollWidth > element.clientWidth )
                    {
                        let ratio = ( e.clientX - deltaX  - padding ) / ( activator.clientWidth - tmp ) ;
						let range = element.scrollWidth - element.clientWidth;

                        element.scrollLeft = ratio * range;
                    }
                } );
            }

            if( mode & ScrollerMode.Vertical )
            {
                let tmp = 2.0 * padding + 1.0;

                actions.push( ( e : MouseEvent ) : void =>
                {
                    if( element.scrollHeight > element.clientHeight )
                    {
                        let ratio = ( e.clientY - deltaY - padding ) / ( activator.clientHeight - tmp ) ;
                        let range = activator.scrollHeight - activator.clientHeight;

                        element.scrollTop = ratio * range;
                    }
                } );
            }

			let aResult = this.eventor.add( activator, 'mouseover', ( e : MouseEvent ) : void =>
			{
                let position = Dom.computePosition( activator );

                deltaX = position.x;
                deltaY = position.y;
            } );

            let bResult = this.eventor.add( activator, 'mousemove', ( e : MouseEvent ) : void =>
            {
                if( e.movementX == 0 && e.movementY == 0 ) // protection against touch event
                    return;

				for( let entry of actions )
                    entry( e );
            } );

            return Cumulator.compose( aResult, bResult );
        }

        public clearListeners() : void
        {
			if( this.destroyed )
				throw new Error( 'Scroller has been destroyed.' );

			this.eventor.clear();
        }

		public destroy() : void
		{
			if( this.destroyed )
				throw new Error( 'Scroller has been destroyed.' );

			this.eventor.destroy();

			this.destroyed = true;
		}
    }

    export class TouchScroller
    {
        // variables

		private destroyed : boolean = false;

        private eventor : Eventor = new Eventor();

        // public methods

        public addListener( element : Element, mode : ScrollerMode = ScrollerMode.Both, activator : Element = null ) : IAction
        {
			if( this.destroyed )
				throw new Error( 'Scroller has been destroyed.' );

			if( activator == null )
				activator = element;

			let deltaX = 0;
            let deltaY = 0;

            let aActions = new Array<Function>();
            let bActions = new Array<Function>();

            if( mode & ScrollerMode.Horizontal )
            {
                aActions.push( ( touch : Touch ) : void =>
                {
                    deltaX = touch.clientX;
                } );

                bActions.push( ( touch : Touch ) : void =>
                {
                    element.scrollLeft -= touch.clientX - deltaX;

                    deltaX = touch.clientX;
                } );
            }

            if( mode & ScrollerMode.Vertical )
            {
                aActions.push( ( touch : Touch ) : void =>
                {
                    deltaY = touch.clientY;
                } );

                bActions.push( ( touch : Touch ) : void =>
                {
                    element.scrollTop -= touch.clientY - deltaY;

                    deltaY = touch.clientY;
                } );
            }

            let aResult = this.eventor.add( activator, 'touchstart', ( e : TouchEvent ) : void =>
            {
                let touch = e.touches[ 0 ];

                for( let entry of aActions )
                    entry( touch );
            } );

			let bResult = this.eventor.add( activator, 'touchmove', ( e : TouchEvent ) : void =>
            {
                let touch = e.touches[ 0 ];

                for( let entry of bActions )
                    entry( touch );
            } );

			return Cumulator.compose( aResult, bResult );
        }

        public clearListeners() : void
        {
			if( this.destroyed )
				throw new Error( 'Scroller has been destroyed.' );

			this.eventor.clear();
        }

		public destroy() : void
		{
			if( this.destroyed )
				throw new Error( 'Scroller has been destroyed.' );

			this.eventor.destroy();

			this.destroyed = true;
		}
    }

    export class DirectedScroller
    {
        // variables

        private destroyed : boolean = false;

        private handles : Array<Element> = [ ];

        private hAction : IProducer<boolean> = null;
        private vAction : IProducer<boolean> = null;

        private interval : Interval = new Interval();

        // constructors

        public constructor( private interrupt : number = 10 )
        {
            this.interval.onAction = () : void =>
            {
                let counter = 0;

                if( this.hAction && this.hAction() )
                    counter += 1;

                if( this.vAction && this.vAction() )
                    counter += 1;

                if( counter == 0 )
                    this.interval.stop();
            };
        }

        // public methods

        public addWorkspace( handle : Element ) : IAction
        {
            if( this.destroyed )
                throw new Error( 'Scroller has been destroyed.' );

			this.handles.push( handle );

			let removed = false;

            let result = () : void =>
            {
				if( this.destroyed )
					throw new Error( 'Scroller has been destroyed.' );

				if( removed )
					return;

				this.handles.remove( handle );

				removed = true;
            };

            return result;
        }

		public clearWorkspaces() : void
		{
			if( this.destroyed )
				throw new Error( 'Scroller has been destroyed.' );

			this.handles.clear();
		}

        public startScrolling( mode : ScrollerMode, velocity : number ) : void
        {
            if( this.destroyed )
                throw new Error( 'Scroller has been destroyed.' );

            let counter = 0;

            if( velocity > 0 )
            {
                if( mode & ScrollerMode.Horizontal )
                {
                    this.hAction = () : boolean =>
                    {
                        let counter = 0;

                        for( let entry of this.handles )
                        {
                            let limit = entry.scrollWidth - entry.clientWidth;

                            if( entry.scrollLeft < limit )
                            {
                                entry.scrollLeft += velocity;

                                counter += 1;
                            }
                        }

                        if( counter > 0 )
                            return true;

						this.hAction = null;

						return false;
                    };

                    counter += 1;
                }

                if( mode & ScrollerMode.Vertical )
                {
                    this.vAction = () : boolean =>
                    {
                        let counter = 0;

                        for( let entry of this.handles )
                        {
                            let limit = entry.scrollHeight - entry.clientHeight;

                            if( entry.scrollTop < limit )
                            {
                                entry.scrollTop += velocity;

                                counter += 1;
                            }
                        }

						if( counter > 0 )
							return true;

						this.vAction = null;

						return false;
                    };

                    counter += 1;
                }
            }
            else
            {
                if( velocity == 0 )
                    throw new Error( 'Incorrect velocity value.' );

                if( mode & ScrollerMode.Horizontal )
                {
                    this.hAction = () : boolean =>
                    {
                        let counter = 0;

                        for( let entry of this.handles )
                        {
                            if( entry.scrollLeft > 0 )
                            {
                                entry.scrollLeft += velocity;

                                counter += 1;
                            }
                        }

                        return counter > 0;
                    };

                    counter += 1;
                }

                if( mode & ScrollerMode.Vertical )
                {
                    this.vAction = () : boolean =>
                    {
                        let counter = 0;

                        for( let entry of this.handles )
                        {
                            if( entry.scrollTop > 0 )
                            {
                                entry.scrollTop += velocity;

                                counter += 1;
                            }
                        }

                        return counter > 0;
                    };

                    counter += 1;
                }
            }

            if( counter > 0 )
                this.interval.start( this.interrupt );
        }

        public stopScrolling( mode ? : ScrollerMode ) : void
        {
            if( this.destroyed )
                throw new Error( 'Scroller has been destroyed.' );

            let counter = 0;

            if( mode )
            {
                if( this.hAction && ( mode & ScrollerMode.Horizontal ) )
                {
                    this.hAction = null;

                    counter += 1;
                }

                if( this.vAction && ( mode & ScrollerMode.Vertical ) )
                {
                    this.vAction = null;

                    counter += 1;
                }
            }
            else
            {
                if( this.hAction )
                {
                    this.hAction = null;

                    counter += 1;
                }

                if( this.vAction )
                {
                    this.vAction = null;

                    counter += 1;
                }
            }

            if( counter > 0 )
                this.interval.stop();
        }

        public destroy() : void
        {
            if( this.destroyed )
                throw new Error( 'Scroller has been destroyed.' );

            this.interval.destroy();

            this.destroyed = true;
        }
	}

    export class ExtendedDirectedScroller
    {
        // variables

        private starters : Eventor = new Eventor();
		private stoppers : Eventor = new Eventor();

        private scroller : DirectedScroller;

        // constructors

        public constructor( interrupt : number = 10 )
        {
            this.scroller = new DirectedScroller( interrupt );
        }

        // public methods

        public addWorkspace( handle : Element ) : IAction
        {
            // destroyed exception inside internal method

            return this.scroller.addWorkspace( handle );
        }

        public clearWorkspaces() : void
        {
			// destroyed exception inside internal method

			this.scroller.clearWorkspaces();
        }

        public addStarter( element : Element, event : string, mode : ScrollerMode, velocity : number ) : IAction
        {
			// destroyed exception inside internal method

            let result = this.starters.add( element, event, () : void =>
            {
                this.scroller.startScrolling( mode, velocity );
            } );

            return result;
        }

		public clearStarters() : void
		{
			// destroyed exception inside internal method

			this.starters.clear();
		}

        public addStopper( element : Element, event : string, mode : ScrollerMode ) : IAction
        {
			// destroyed exception inside internal method

			let result = this.stoppers.add( element, event, () : void =>
            {
                this.scroller.stopScrolling( mode );
            } );

			return result;
        }

		public clearStoppers() : void
		{
			// destroyed exception inside internal method

			this.stoppers.clear();
		}

        public suspend() : void
        {
			// destroyed exception inside internal method

			this.scroller.stopScrolling();
        }

        public destroy() : void
        {
			// destroyed exception inside internal method

            this.starters.destroy();
			this.stoppers.destroy();
			this.scroller.destroy();
        }
    }
}
