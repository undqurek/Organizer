
/**
 * Created by qurek on 13.11.2016.
 */
namespace Core
{
    // export declare type Map<V> = { [ key : string ] : V; };
	//
	// export declare const Map : { new<T>(); };





	// export declare class Map<T>
	// {
	// 	new() : { [ key : string ] : T };
	// }








	export interface Map<V>
	{
		[ key : number ] : V;
		[ key : string ] : V;
	}

	export declare const Map : { new() : any; new<T>() : Map<T>; };









}

window[ 'Core' ].Map = new Function(); //HACK!!!