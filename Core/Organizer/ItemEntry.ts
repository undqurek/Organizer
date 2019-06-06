
/**
 * Created by qurek on 27.09.2018.
 */
namespace Core.Organizer
{
    export class ItemEntry<C extends Controller<T>, T>
    {
        // variables

        // constructors

        constructor( protected handle : Element, protected data : T, protected controller : C, protected tag : any, protected scope : ItemScope )
        {
            // nothing here...
        }

        // public methods

        public getHandle() : Element
        {
            if( this.scope.destroyed )
                throw new Error( 'Item scope has been destroyed.' );

            return this.handle;
        }

        public getData() : T
        {
            if( this.scope.destroyed )
                throw new Error( 'Item scope has been destroyed.' );

            return this.data;
        }

        public getController() : C
        {
            if( this.scope.destroyed )
                throw new Error( 'Item scope has been destroyed.' );

            return this.controller;
        }

        public getTag() : any
        {
            if( this.scope.destroyed )
                throw new Error( 'Item scope has been destroyed.' );

            return this.tag;
        }
    }

    export class ItemInformationEntry<C extends Controller<T>, T>
    {
        // constructors

        constructor( protected data : T, protected tag : any, protected scope : ItemScope )
        {
            // nothing here...
        }

        // public methods

        public getData() : T
        {
            return this.data;
        }

        public getTag() : any
        {
            return this.tag;
        }
    }

    export class ItemInstanceEntry<C extends Controller<T>, T>
    {
        // constructors

        constructor( protected handle : Element, protected controller : C, protected scope : ItemScope )
        {
            // nothing here...
        }

        // public methods

        public getHandle() : Element
        {
            if( this.scope.destroyed )
                throw new Error( 'Item scope has been destroyed.' );

            return this.handle;
        }

        public getController() : C
        {
            if( this.scope.destroyed )
                throw new Error( 'Item scope has been destroyed.' );

            return this.controller;
        }
    }
}
