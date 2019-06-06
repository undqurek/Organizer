/// <reference path="IValidator.ts" />

/**
 * Created by qurek on 10.02.2017.
 */
namespace Core.Validation
{
    export class CompleteValidator implements IValidator
    {
        private array : Array<IValidator> = [ ];

        public add( validator : IValidator ) : void
        {
            this.array.push( validator );
        }

        public validate() : boolean
        {
            let result : boolean = true;

            for( let entry of this.array )
            {
                let tmp = entry.validate();

                if( tmp == false )
                    result = false;
            }

            return result;
        }

        public reset() : void
        {
            for( let entry of this.array )
                entry.reset();
        }
    }
}
