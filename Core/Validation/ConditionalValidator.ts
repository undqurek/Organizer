/// <reference path="IValidator.ts" />

/**
 * Created by qurek on 10.02.2017.
 */
namespace Core.Validation
{
    export class ConditionalValidator implements IValidator
    {
        private conditions : Array<ICondition> = [ ];
        private validators : Array<IValidator> = [ ];

        public addCondition( condition : ICondition ) : void
        {
            this.conditions.push( condition );
        }

        public addValidator( validator : IValidator ) : void
        {
            this.validators.push( validator );
        }

        public validate() : boolean
        {
            for( let entry of this.conditions )
            {
                if( entry.check() )
                    continue;

                for( let entry of this.validators )
                    entry.reset();

                return true;
            }

            let result : boolean = true;

            for( let entry of this.validators )
            {
                if( ! entry.validate() )
                    result = false;
            }

            return result;
        }

        public reset() : void
        {
            for( let entry of this.validators )
                entry.reset();
        }
    }
}
