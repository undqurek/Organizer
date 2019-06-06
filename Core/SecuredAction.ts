// /**
//  * Created by qurek on 01.11.2016.
//  */
// namespace Core
// {
//     export class SecuredAction
//     {
//         // public methods
//
//         public static call( owner : any, action : Function, ...parameters : Array<any> ) : any | null
//         {
//             try
//             {
//                 return action.apply( owner, parameters );
//             }
//             catch( e )
//             {
//                 console.error( e );
//
//                 return null;
//             }
//         }
//
//         public static apply( owner : any, action : Function, parameters ? : Array<any> ) : any | null
//         {
//             try
//             {
//                 return action.apply( owner, parameters );
//             }
//             catch( e )
//             {
//                 console.error( e );
//
//                 return null;
//             }
//         }
//
//         public static bind( owner : any, action : Function, parameters ? : Array<any> ) : Function
//         {
//             let result : Function = () : any | null =>
//             {
//                 try
//                 {
//                     return action.apply( owner, parameters );
//                 }
//                 catch( e )
//                 {
//                     console.error( e );
//
//                     return null;
//                 }
//             };
//
//             return result;
//         }
//     }
// }
