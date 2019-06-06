/**
 * Created by qurek on 24.08.2016.
 */
namespace Core.Organizer
{
    export interface IIteration<T>
    {
        ( index : number, data : T ) : boolean;
    }

    export interface ICollection
    {
        /**
         * Returns size of collection.
         *
         * @return size of collection
         */
        getSize() : number;

        /**
         * Adds item to collection.
         *
         * @param item added item
         */
        addItem( item : ItemNode ) : void

        /**
         * Removes all items from collection.
         */
        clearItems() : boolean;

        /**
         * Iterates stored items.
         *
         * @param action action executed during each iteration
         */
        iterateItems( action : IIteration<ItemNode> ) : void;
    }

    export class IndexedCollection implements ICollection
    {
        // variables

        private array : Array<ItemNode> = [ ];

        // public methods

        public getSize() : number
        {
            return this.array.length;
        }

        public getItem( index : number ) : ItemNode
        {
            return this.array[ index ];
        }

        public addItem( item : ItemNode ) : void
        {
            this.array.push( item );
        }

        public insertItem( index : number, item : ItemNode ) : void
        {
            this.array.splice( index, 0, item );
        }

        public removeItem( index : number ) : ItemNode
        {
            let result = this.array.splice( index, 1 );

            if( result.length > 0 )
                return result[ 0 ];

            return null;
        }

        public dropItem( item : ItemNode ) : void
        {
            let index = this.array.indexOf( item );

            if( index == -1 )
                return;

            this.array.splice( index, 1 );
        }

        public clearItems() : boolean
        {
            if( this.array.length > 0 )
            {
                this.array = [ ];

                return true;
            }

            return false;
        }

        public iterateItems( action : IIteration<ItemNode> ) : void
        {
            for( let i = 0; i < this.array.length; ++i )
            {
                if( !action( i, this.array[ i ] ) )
                    break;
            }
        }
    }

    export class MappedCollection implements ICollection
    {
        // variables

		private map : Map<ItemNode> = { };

		private size : number = 0;

		// constructors

        public constructor( private path : Array<string> = [ ] )
        {
            // nothing here ...
        }

        // helper methods

        private extractKey( object : any ) : string
        {
            let result : any = object;

            for( let entry of this.path )
            {
                if( result == null )
					throw new Error( 'Indicated object path (' + this.path.join( '.' ) + ') does not exist.' );

                result = result[ entry ];
            }

            return result;
        }

        // public methods

        public getSize() : number
        {
            return this.size;
        }

        public getItem( key : number | string ) : ItemNode
        {
            return this.map[ key ];
        }

        public addItem( item : ItemNode ) : void
        {
            let key = this.extractKey( item.entry.getData() );

            if( key in this.map )
                throw new Error( 'Map key "' + key + '" is duplicated.' );

            this.map[ key ] = item;
            this.size += 1;
        }

        public removeItem( key : number | string ) : ItemNode
        {
            let result = this.map[ key ];

            if( delete this.map[ key ] )
                this.size -= 1;

            return result;
        }

        public dropItem( item : ItemNode ) : void
        {
            let key = this.extractKey( item.entry.getData() );

            if( key )
            {
                if( delete this.map[ key ] )
                    this.size -= 1;
            }
        }

        public clearItems() : boolean
        {
            if( this.size > 0 )
            {
                this.map = { };
                this.size = 0;

                return true;
            }

            return false;
        }

        public iterateItems( action : IIteration<ItemNode> ) : void
        {
            let i = -1;

            for( let name in this.map )
            {
                if( !action( ++i, this.map[ name ] ) )
                    break;
            }
        }
    }

    export class ComposedCollection implements ICollection
    {
        // variables

        private master : ICollection = null;

        // constructors

        public constructor( private collections : Array<ICollection> )
        {
            if( collections.length > 0 )
                this.master = collections[ 0 ];
        }

        // public methods

        public getSize() : number
        {
            if( this.master )
                return this.master.getSize();

            return 0;
        }

        public addItem( item : ItemNode ) : void
        {
            for( let entry of this.collections )
                entry.addItem( item );
        }

        public clearItems() : boolean
        {
            if( this.master )
            {
                let size = this.master.getSize();

                for( let entry of this.collections )
                    entry.clearItems();

                return size > 0;
            }

            return false;
        }

        public iterateItems( action : IIteration<ItemNode> ) : void
        {
            if( this.master )
                this.master.iterateItems( action );
        }
    }
}
