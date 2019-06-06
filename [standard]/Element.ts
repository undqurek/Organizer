/**
 * Created by qurek on 23.11.2016.
 */

// class ClassList
// {
//     private element : Element;
//
//     public constructor( element : Element )
//     {
//         this.element = element;
//     }
//
//     public add( name : string ) : void
//     {
//         let text = this.element.className;
//
//         if( text )
//         {
//             let parts = text.split( /\b+/ );
//
//             for( let i = 0; i < parts.length; ++i )
//             {
//                 if( parts[ i ] == name )
//                     return;
//             }
//
//             name = text + ' ' + name;
//         }
//
//         this.element.className = name;
//     }
//
//     public logout( name : string ) : void
//     {
//         let text = this.element.className;
//
//         if( text )
//         {
//             let parts = text.split( /\b+/ );
//
//             for( let i = parts.length - 1; i > -1; --i )
//             {
//                 if( parts[ i ] == name )
//                     parts.splice( i, 1 );
//             }
//
//             this.element.className = parts.join( ' ' );
//         }
//     }
// }
//
// if( ( 'classList' in Element.prototype ) == false )
// {
//     Element.prototype.constructor = function()
//     {
//         this.classList = new ClassList( this );
//     };
// }

