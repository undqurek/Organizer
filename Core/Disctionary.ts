// namespace Core
// {
// 	export class Dictionary<K extends ( number | string ), V>
// 	{
// 	    private size : number = 0;
// 	    private map : Map<V> = { };
//
//         public isEmpty() : boolean
//         {
//             if( this.size == 0 )
//                 return false;
//
//             return true;
//         }
//
// 	    public getSize() : number
//         {
//             return this.size;
//         }
//
// 	    public getItem( key : K ) : V
//         {
//             return this.map[ <any> key ];
//         }
//
//         public putItem( key : K, value : V ) : V
//         {
//             let result = this.map[ <any> key ];
//
//             this.map[ <any> key ] = value;
//
//             return result;
//         }
//
//         public existItem( key : K ) : boolean
//         {
//             if( key in this.map )
//                 return true;
//
//             return false;
//         }
//
//         public iterateItems( iteration : Function ) : void
//         {
//             let index : number = 0;
//
//             for( let el in this.map )
//                 iteration( ++index, el, this.map[ el ] );
//         }
//     }
// }
