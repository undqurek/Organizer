/**
 * Created by qurek on 03.02.2017.
 */
namespace Core.Organizer
{
    export interface Tube<T>
    {
        has( name : string, deep ? : boolean ) : boolean;
        get( name : string, deep ? : boolean ) : T;
        add( name : string, object : T ) : void;

        iterate( iteration : IIteration<T>, deep ? : boolean ) : boolean
    }

    export class SingleTube<T> implements Tube<T>
    {
        // variables

        private objects : Map<T> = { };

        // public methods

        public has( name : string, deep ? : boolean ) : boolean
        {
            return name in this.objects;
        }

        public get( name : string, deep ? : boolean ) : T
        {
            return this.objects[ name ];
        }

        public add( name : string, object : T ) : void
        {
            if( name in this.objects )
                return;

            this.objects[ name ] = object;
        }

        public iterate( iteration : IIteration<T>, deep ? : boolean ) : boolean
        {
            let index = -1;

            for( let name in this.objects )
            {
                let object = this.objects[ name ];

                if( !iteration( ++index, object ) )
                    return false;
            }

            return true;
        }
    }

    export class MultiTube<T> implements Tube<T>
    {
        // constructors

        constructor( private master : Tube<T>, private objects : Map<T> = { } )
        {
            // nothing here ...
        }

        // public methods

        public has( name : string, deep ? : boolean ) : boolean
        {
            if( name in this.objects )
                return true;

            return deep && this.master.has( name, deep );
        }

        public get( name : string, deep ? : boolean ) : T
        {
            let object = this.objects[ name ];

            if( object == null )
            {
                if( deep )
                    return this.master.get( name, true );

                return null;
            }

            return object;
        }

        public add( name : string, object : T ) : void
        {
            if( name in this.objects )
                return;

            this.objects[ name ] = object;
        }

        public iterate( iteration : IIteration<T>, deep ? : boolean ) : boolean
        {
            let index = -1;

            if( deep )
            {
                let tmp = ( i : number, data : T ) : boolean =>
                {
                    return iteration( ++index, data );
                };

                if( !this.master.iterate( tmp, deep ) )
                    return false;
            }

            for( let name in this.objects )
            {
                let object = this.objects[ name ];

                if( !iteration( ++index, object ) )
                    return false;
            }

            return true;
        }
    }
}
