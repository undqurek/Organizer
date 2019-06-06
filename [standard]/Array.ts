/**
 * Created by qurek on 01.11.2016.
 */

declare interface Array<T>
{
    find( element : any, offset ? : number ) : number;
    remove( element : T ) : T;
    clear() : void;
    clone() : Array<T>;
}

Array.prototype.find = function( element : any, offset : number = 0, count : number = null ) : number
{
    if( count > 0 )
    {
        if( offset < 0 )
            offset = 0;

        let limit = Math.min( offset + count, this.length );

        for ( let i = offset; i < limit; i++ )
        {
            if ( this[ i ] == element )
                return i;
        }
    }

    return -1;
};

Array.prototype.remove = function( element : any ) : any
{
    let index = this.find( element );

    if ( index > -1 )
    {
        let tmp = this.splice( index, 1 );

        return tmp[ 0 ];
    }

    return null;
};

Array.prototype.clear = function() : void
{
    this.splice( 0, this.length );
};

Array.prototype.clone = function() : Array<any>
{
    return this.slice();
};

