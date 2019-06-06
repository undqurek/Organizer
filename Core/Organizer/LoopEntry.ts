/// <reference path="Collection.ts" />
/// <reference path="../Template/Template.ts" />


namespace Core.Organizer
{
    export interface IExtendedIteration<C, T>
    {
        ( index : number, data : T, controller : C, tag : any ) : boolean;
    }

    export class LoopEntry<C extends Controller<T>, T>
    {
        // constructors

        constructor( private pattern : LoopPattern, private resource : Resource | null, private parent : Controller<any> | null, private organizer : Organizer, private backbone : Backbone, private services : Tube<Object>, private array : IndexedCollection, private map : MappedCollection, private collection : ComposedCollection, private placeholder : MultiPlaceholder, private scope : LoopScope )
        {
            // nothing here...
        }

        // helper methods

        private getPlaceholder( index : number ) : Element
        {
            let placeholder = this.array.getItem( index );

            return placeholder.scope.handle;
        }

        private createItem( index : number, data : T, type ? : ControllerType<C, T>, tag ? : any ) : ItemNode
        {
            let resource : Resource;

            if( this.resource )
            {
                if( type )
                    throw new Error( 'Controller logic has been duplicated in loop "' + this.pattern.name +  '" (organizer "' + this.organizer.getName() + '").' );

                resource = this.resource;
            }
            else
            {
                if( type == null )
                    throw new Error( 'Controller logic is not defined in loop "' + this.pattern.name + '" (organizer "' + this.organizer.getName() + '").' );

                resource = new Resource( type, this.services );
            }

            let logic = this.backbone.constructLogic( this.pattern, resource, this.parent, index, data );

            let tmp = logic.scope;

            let scope = new ItemScope( tmp.handle, tmp.instance, tmp.subscriptions, tmp.controllers, tmp.loops, tmp.compositions );
            let entry = new ItemEntry( tmp.handle, data, tmp.instance, tag, scope );

            return new ItemNode( entry, scope );
        }

        // public methods

        public getSize() : number
        {
            if( this.scope.destroyed )
                throw new Error( 'Loop has been destroyed.' );

            return this.collection.getSize();
        }

        public getIndex( index : number ) : ItemEntry<C, T> | null
        {
            if( this.scope.destroyed )
                throw new Error( 'Loop has been destroyed.' );

            if( this.array == null )
                throw new Error( 'Indexed items are not supported in loop "' + this.pattern.name + '" (organizer "' + this.organizer.getName() + '").' );

            let item = this.array.getItem( index );

            if( item )
                return item.entry;

            return null;
        }

        public getKey( key : number | string ) : ItemEntry<C, T> | null
        {
            if( this.scope.destroyed )
                throw new Error( 'Loop has been destroyed.' );

            if( this.map == null )
                throw new Error( 'Mapped items are not supported in loop "' + this.pattern.name + '" (organizer "' + this.organizer.getName() + '").' );

            let item = this.map.getItem( key );

            if( item )
                return item.entry;

            return null;
        }

        public iterateItems( iteration : IExtendedIteration<C, T> ) : void
        {
            if( this.scope.destroyed )
                throw new Error( 'Loop has been destroyed.' );

            this.collection.iterateItems( ( index : number, item : ItemNode ) : boolean =>
            {
                let entry = item.entry;

                return iteration( index, entry.getData(), entry.getController(), entry.getTag() );
            } );
        }

        public addItem( data : T, type ? : ControllerType<C, T>, tag ? : any ) : ItemInstanceEntry<C, T>
        {
            if( this.scope.destroyed )
                throw new Error( 'Loop has been destroyed.' );

            let size = this.collection.getSize();
            let item = this.createItem( size, data, type, tag );

            let scope = item.scope;

            this.collection.addItem( item );
            this.placeholder.mount( scope.handle );

            if( this.scope.working )
                item.start();

            return new ItemInstanceEntry( scope.handle, scope.instance, scope );
        }

        public addItems( data : Array<T>, type ? : ControllerType<C, T> ) : void
        {
            if( this.scope.destroyed )
                throw new Error( 'Loop has been destroyed.' );

            for( let entry of data )
                this.addItem( entry, type );
        }

        public insertItem( index : number, data : T, type ? : ControllerType<C, T>, tag ? : any ) : ItemInstanceEntry<C, T>
        {
            if( this.scope.destroyed )
                throw new Error( 'Loop has been destroyed.' );

            if( this.array == null )
                throw new Error( 'Indexed items are not supported in loop "' + this.pattern.name + '" (organizer "' + this.organizer.getName() + '").' );

            let size = this.collection.getSize();

            if( index > size || size == 0 )
                return this.addItem( data, type, tag );

            else
            {
                let item = this.createItem( index, data, type, tag );
                let placeholder = this.getPlaceholder( index );

                this.array.insertItem( index, item );

                if( this.map )
                    this.map.addItem( item );

                let scope = item.scope;

                this.placeholder.mount( scope.handle, placeholder );

                if( this.scope.working )
                    item.start();

                return new ItemInstanceEntry( scope.handle, scope.instance, scope );
            }
        }

        public insertItems( index : number, data : Array<T>, type ? : ControllerType<C, T> ) : void
        {
            if( this.scope.destroyed )
                throw new Error( 'Loop has been destroyed.' );

            for( let entry of data )
                this.insertItem( index++, entry, type );
        }

        public bindItems( data : Array<T>, type ? : ControllerType<C, T> ) : void
        {
            this.clearItems();
            this.addItems( data, type );
        }

        public clearItems() : boolean
        {
            if( this.scope.destroyed )
                throw new Error( 'Loop has been destroyed.' );

            this.collection.iterateItems( ( index : number, item : ItemNode ) : boolean =>
            {
                item.stop();
                item.destroy();

                return true;
            } );

            return this.collection.clearItems();
        }

        public removeKey( id : number | string ) : ItemInformationEntry<C, T> | null
        {
            if( this.scope.destroyed )
                throw new Error( 'Loop has been destroyed.' );

            if( this.map == null )
                throw new Error( 'Mapped items are not supported in loop "' + this.pattern.name + '" (organizer "' + this.organizer.getName() + '").' );

            let item = this.map.removeItem( id );

            if( item )
            {
                if( this.array )
                    this.array.dropItem( item );

                item.stop();
                item.destroy();

                let entry = item.entry as any;

                return new ItemInformationEntry( entry.data, entry.tag, entry.scope );
            }

            return null;
        }

        public removeIndex( index : number ) : ItemInformationEntry<C, T> | null
        {
            if( this.scope.destroyed )
                throw new Error( 'Loop has been destroyed.' );

            if( this.array == null )
                throw new Error( 'Indexed items are not supported in loop "' + this.pattern.name + '" (organizer "' + this.organizer.getName() + '").' );

            let item = this.array.removeItem( index );

            if( item )
            {
                if( this.map )
                    this.map.dropItem( item );

                item.stop();
                item.destroy();

                let entry = item.entry as any;

                return new ItemInformationEntry( entry.data, entry.tag, entry.scope );
            }

            return null;
        }
    }
}
