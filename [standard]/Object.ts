// /**
//  * Created by qurek on 20.10.2017.
//  */
//
// declare interface Object
// {
//     clone() : Object;
// }
//
// if ( Object.prototype.clone == null )
// {
//     Object.prototype.clone = () : Object =>
//     {
//         if ( this.constructor == Object )
//             return new Object();
//
//         if ( this.constructor == Array )
//             return this.clone();
//
//         if ( this.constructor == Date || this.constructor == RegExp || this.constructor == Function || this.constructor == String || this.constructor == Number || this.constructor == Boolean )
//             return new this.constructor( this );
//
//         let result = new this.constructor.apply( this.constructor, this.arguments );
//
//         for ( let el in this )
//         {
//             let entry = this[ el ];
//
//             result[ el ] = entry ? entry.clone() : null;
//         }
//
//         return result;
//     };
// }

