/// <reference path="IValidator.ts" />

/**
 * Created by qurek on 10.02.2017.
 */
namespace Core.Validation
{
    export class CheckboxSelectionCondition implements ICondition
    {
        private hInput : HTMLInputElement;

        private expected : boolean;

        public constructor( hInput : HTMLInputElement, expected : boolean = true )
        {
            this.hInput = hInput;

            this.expected = expected;
        }

        public check() : boolean
        {
            if( this.hInput.checked == this.expected )
                return true;

            return false;
        }
    }
}
