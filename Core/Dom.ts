/// <reference path="Flagger.ts" />


/**
 * Created by qurek on 24.11.2016 - 10.01.2019.
 */
namespace Core
{
    let flagger = new Flagger();

    export enum OrientationMode
    {
        // this element values are used as flags

	    Horizontal = flagger.generate(),
        Vertical = flagger.generate()
    }

    export class Dom
    {
        public static getHandle( id : string ) : Node
        {
            return document.getElementById( id );
        }

        public static findHandle( query : string, parent ? : Element ) : Node
        {
            return parent.querySelector( query );
        }

        public static findHandles( query : string, parent ? : Element ) : NodeList
        {
            return parent.querySelectorAll( query );
        }

        // --- cover methods

        private static coverNode( handle : any, parent ? : Node ) : any
        {
            handle.mount = ( placeholder ? : Node, newParent ? : Node ) : void =>
            {
                if( newParent )
                    parent = newParent;

                if( parent == null )
                    throw new Error( 'Node parent is not defined.' );

                parent.insertBefore( handle, placeholder );
            };

            handle.remove = () : void =>
            {
                Dom.removeNode( handle );
            };

            return handle;
        }

        public static coverComment( handle : Comment, parent ? : Node ) : ExtendedComment
        {
            return this.coverNode( handle, parent );
        }

        public static coverText( handle : Text, parent ? : Node ) : ExtendedText
        {
            return this.coverNode( handle, parent );
        }

        public static coverElement( handle : Element, parent ? : Node ) : ExtendedElement
        {
            return this.coverNode( handle, parent );
        }

        // --- create methods

        public static createComment( text : string, parent ? : Node ) : ExtendedComment
        {
            let handle = document.createComment( text );

            return this.coverComment( handle, parent );
        }

        public static createText( text : string, parent ? : Node ) : ExtendedText
        {
            let handle = document.createTextNode( text );

            return this.coverText( handle, parent );
        }

        public static createElement( tag : string, parent ? : Node ) : ExtendedElement
        {
            let handle = document.createElement( tag );

            return this.coverElement( handle, parent );
        }

        // --- prepare methods

        public static prepareComment( text : string, parent : Node, placeholder ? : Node ) : ExtendedComment
        {
            let handle = this.createComment( text, parent );

            handle.mount( placeholder );

            return handle;
        }

        public static prepareText( text : string, parent : Node, placeholder ? : Node ) : ExtendedText
        {
            let handle = this.createText( text, parent );

            handle.mount( placeholder );

            return handle;
        }

        public static prepareElement( tag : string, parent : Node, placeholder ? : Node ) : ExtendedElement
        {
            let handle = this.createElement( tag, parent );

            handle.mount( placeholder );

            return handle;
        }

        // other methods

        public static removeNode( handle : Node ) : void
        {
            let parent = handle.parentNode;

            if ( parent )
                parent.removeChild( handle );
        }

        public static emptyElement( handle : Node ) : void
        {
            let hChild : Node;

            while ( hChild = handle.firstChild )
                handle.removeChild( hChild );
        }

        public static cloneElement( handle : Element, parent ? : Node ) : ExtendedElement
        {
            let tmp = handle.cloneNode( true );

            return this.coverElement( tmp as HTMLElement, parent );
        }

        public static showElement( handle : HTMLElement, display : string = 'block' ) : void
        {
            handle.style.display = display;
        }

        public static hideElement( handle : HTMLElement ) : void
        {
            handle.style.display = 'none';
        }

        public static exposeElement( handle : HTMLElement ) : void
        {
            handle.style.visibility = 'visible';
        }

        public static disguiseElement( handle : HTMLElement ) : void
        {
            handle.style.visibility = 'hidden';
        }

        public static centerElement( handle : HTMLElement, mode : OrientationMode ) : void
        {
            let style = handle.style;

            if( mode & OrientationMode.Horizontal )
            {
				let x = Math.round( handle.offsetWidth / 2 );

				style.marginLeft = '-' + x + 'px';
				style.marginRight = '0px';

				style.left = '50%';
				style.right = 'auto';
            }

			if( mode & OrientationMode.Horizontal )
			{
				let y = Math.round( handle.offsetHeight / 2 );

				style.marginTop = '-' + y + 'px';
				style.marginBottom = '0px';

				style.top = '50%';
				style.bottom = 'auto';
			}
        }

        public static computePosition( handle : HTMLElement, limiter ? : HTMLElement ) : Position
        {
            let x = 0;
            let y = 0;

            while ( handle.offsetParent )
            {
                x += handle.offsetLeft;
                y += handle.offsetTop;

                handle = handle.offsetParent as HTMLElement;

                if( handle == limiter )
                    break;
            }

            return new Position( x, y );
        }
    }
}

// /**
//  * Created by qurek on 24.11.2016 - 10.01.2019.
//  */
// namespace Core
// {
//     export class Position
//     {
//         // constructors
//
//         public constructor( public x : number, public y : number )
//         {
//             // nothing here ...
//         }
//     }
//
//     export class Dom
//     {
//         public static getHandle( id : string ) : Node
//         {
//             return document.getElementById( id );
//         }
//
//         public static findHandle( query : string, parent ? : ParentNode ) : Node
//         {
//             return parent.querySelector( query );
//         }
//
//         public static findHandles( query : string, parent ? : ParentNode ) : NodeList
//         {
//             return parent.querySelectorAll( query );
//         }
//
//         // public static getHandle( id : string ) : ExtendedNode
//         // {
//         //     let handle = document.getElementById( id );
//         //
//         //     return this.coverNode( handle, handle.parentNode );
//         // }
//
//         // --- cover methods
//
//         private static coverNode( handle : any, parent ? : Node ) : any
//         {
//             handle.mount = ( placeholder ? : Node, newParent ? : Node ) : void =>
//             {
//                 if( newParent )
//                     parent = newParent;
//
//                 if( parent == null )
//                     throw new Error( 'Node parent is not defined.' );
//
//                 parent.insertBefore( handle, placeholder );
//             };
//
//             // handle.mount = ( placeholder ? : Node, mode : MountMode = MountMode.Before, newParent ? : Node ) : void =>
//             // {
//             //     if( newParent )
//             //         parent = newParent;
//             //
//             //     if( parent == null )
//             //         throw new Error( 'Node parent is not defined.' );
//             //
//             //     if( placeholder )
//             //     {
//             //         if( mode == MountMode.Before )
//             //         {
//             //             parent.insertBefore( handle, placeholder );
//             //
//             //             return;
//             //         }
//             //
//             //         if( mode == MountMode.Behind )
//             //         {
//             //             parent.insertBefore( handle, handle.nextSibling );
//             //
//             //             return;
//             //         }
//             //
//             //         throw new Error( 'Unknown mount mode.' );
//             //     }
//             //     else
//             //         parent.appendChild( handle );
//             // };
//
//             handle.remove = () : void =>
//             {
//                 Dom.removeNode( handle );
//             };
//
//             return handle;
//         }
//
//         public static coverComment( handle : Comment, parent ? : Node ) : ExtendedComment
//         {
//             return this.coverNode( handle, parent );
//         }
//
//         public static coverText( handle : Text, parent ? : Node ) : ExtendedText
//         {
//             return this.coverNode( handle, parent );
//         }
//
//         public static coverElement( handle : Element, parent ? : Node ) : ExtendedElement
//         {
//             return this.coverNode( handle, parent );
//         }
//
//         // --- create methods
//
//         public static createComment( parent : Node, text : string ) : ExtendedComment
//         {
//             let handle = document.createComment( text );
//
//             return this.coverComment( handle, parent );
//         }
//
//         public static createText( parent : Node, text : string ) : ExtendedText
//         {
//             let handle = document.createTextNode( text );
//
//             return this.coverText( handle, parent );
//         }
//
//         public static createElement( parent : Node, tag : string ) : ExtendedElement
//         {
//             let handle = document.createElement( tag );
//
//             return this.coverElement( handle, parent );
//         }
//
//         // --- prepare methods
//
//         public static prepareComment( parent : Node, text : string, placeholder ? : Node ) : ExtendedComment
//         {
//             let handle = this.createComment( parent, text );
//
//             handle.mount( placeholder );
//
//             return handle;
//         }
//
//         public static prepareText( parent : Node, text : string, placeholder ? : Node ) : ExtendedText
//         {
//             let handle = this.createText( parent, text );
//
//             handle.mount( placeholder );
//
//             return handle;
//         }
//
//         public static prepareElement( parent : Node, tag : string, placeholder ? : Node ) : ExtendedElement
//         {
//             let handle = this.createElement( parent, tag );
//
//             handle.mount( placeholder );
//
//             return handle;
//         }
//
//         // other methods
//
//         public static removeNode( handle : Node ) : void
//         {
//             let parent = handle.parentNode;
//
//             if ( parent )
//                 parent.removeChild( handle );
//         }
//
//         public static emptyElement( handle : Node ) : void
//         {
//             let hChild : Node;
//
//             while ( hChild = handle.firstChild )
//                 handle.removeChild( hChild );
//         }
//
//         public static cloneElement( handle : Element, parent ? : Node ) : ExtendedElement
//         {
//             let tmp = handle.cloneNode( true );
//
//             return this.coverElement( tmp as HTMLElement, parent );
//         }
//
//         public static showElement( handle : HTMLElement, display : string = 'block' ) : void
//         {
//             handle.style.display = display;
//         }
//
//         public static hideElement( handle : HTMLElement ) : void
//         {
//             handle.style.display = 'none';
//         }
//
//         public static exposeElement( handle : HTMLElement ) : void
//         {
//             handle.style.visibility = 'visible';
//         }
//
//         public static disguiseElement( handle : HTMLElement ) : void
//         {
//             handle.style.visibility = 'hidden';
//         }
//
//         public static centerElement( handle : HTMLElement ) : void
//         {
//             let style = handle.style;
//
//             let x = Math.round( handle.offsetWidth / 2 );
//             let y = Math.round( handle.offsetHeight / 2 );
//
//             style.marginTop = '-' + x + 'px';
//             style.marginLeft = '-' + y + 'px';
//             style.left = '50%';
//             style.top = '50%';
//         }
//
//         public static computePosition( handle : HTMLElement, limiter : HTMLElement ) : Position
//         {
//             let x : number = 0;
//             let y : number = 0;
//
//             while ( handle.offsetParent )
//             {
//                 x += handle.offsetLeft;
//                 y += handle.offsetTop;
//
//                 handle = handle.offsetParent as HTMLElement;
//
//                 if( handle == limiter )
//                     break;
//             }
//
//             return new Position( x, y );
//         }
//     }
// }
