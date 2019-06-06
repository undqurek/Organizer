/**
 * Created by qurek on 22.11.2018.
 */
namespace Core
{
    // export enum MountMode
    // {
    //     Before = 1,
    //     Behind = 2
    // }

    // export interface Docker
    // {
    //     mount( placeholder ? : Node, mode ? : MountMode, newParent ? : Node ) : void;
    //
    //     remove() : void;
    // }

    export interface Docker
    {
        // addEvent( name : string, action : Function, capturing ? : boolean ) : IAction;
        // removeEvent( name : string, action : Function, capturing ? : boolean ) : void;

        mount( placeholder ? : Node, newParent ? : Node ) : void;

        remove() : void;
    }

    export interface ExtendedNode extends Docker, Node
    {
        // nothing here ...
    }

    export interface ExtendedComment extends Docker, Comment
    {
        // nothing here ...
    }

    export interface ExtendedText extends Docker, Text
    {
        // nothing here ...
    }

    export interface ExtendedElement extends Docker, Element
    {
        // empty() : void;
        //
        // show( display ? : string ) : void;
        // hide() : void;
        //
        // expose() : void;
        // disguise() : void;
    }

    // export class ExtendedNode<T extends Node>
    // {
    //     // constructors
    //
    //     public constructor( protected handle : T, protected parent ? : Node )
    //     {
    //         // nothing here ...
    //     }
    //
    //     // public methods
    //
    //     public mount( placeholder ? : Node, newParent ? : Node ) : void
    //     {
    //         if( newParent )
    //             this.parent = newParent;
    //
    //         if( this.parent == null )
    //             throw new Error( 'Text parent is not defined.' );
    //
    //         this.parent.insertBefore( this.handle, placeholder );
    //     }
    //
    //     public remove() : void
    //     {
    //         Dom.removeNode( this.handle );
    //     }
    // }
    //
    // export class ExtendedComment extends ExtendedNode<Comment>
    // {
    //     // constructors
    //
    //     public constructor( handle : Comment, parent ? : Node )
    //     {
    //         super( handle, parent );
    //     }
    // }
    //
    // export class ExtendedText extends ExtendedNode<Text>
    // {
    //     // constructors
    //
    //     public constructor( handle : Text, parent ? : Node )
    //     {
    //         super( handle, parent );
    //     }
    // }
    //
    // export class ExtendedElement extends ExtendedNode<HTMLElement>
    // {
    //     // constructors
    //
    //     public constructor( handle : HTMLElement, parent ? : Node )
    //     {
    //         super( handle, parent );
    //     }
    //
    //     // public methods
    //
    //     public getHandle() : HTMLElement
    //     {
    //         return this.handle;
    //     }
    //
    //     public addEvent( name : string, action : Function, capturing : boolean = false ) : IAction
    //     {
    //         return Event.add( this.handle, name, action, capturing );
    //     }
    //
    //     public removeEvent( name : string, action : Function, capturing : boolean = false ) : void
    //     {
    //         Event.remove( this.handle, name, action, capturing );
    //     }
    //
    //     public empty() : void
    //     {
    //         Dom.emptyElement( this.handle );
    //     }
    //
    //     public show( display : string = 'block' ) : void
    //     {
    //         Dom.showElement( this.handle, display );
    //     }
    //
    //     public hide() : void
    //     {
    //         Dom.hideElement( this.handle );
    //     }
    //
    //     public expose() : void
    //     {
    //         Dom.exposeElement( this.handle );
    //     }
    //
    //     public disguise() : void
    //     {
    //         Dom.disguiseElement( this.handle );
    //     }
    // }
}
