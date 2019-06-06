/// <reference path="IValidator.ts" />

/**
 * Created by qurek on 10.02.2017.
 */
namespace Core.Validation
{
    export class TypeTextValidator implements IValidator
    {
        private hInput : HTMLInputElement;
        private hMessage : HTMLSpanElement;

        private error : string;

        public constructor( hInput : HTMLInputElement, hMessage : HTMLSpanElement, error ? : string )
        {
            this.hInput = hInput;
            this.hMessage = hMessage;

            this.error = error;
        }

        public validate() : boolean
        {
            let value = this.hInput.value;

            if( value == null || value.length == 0 )
            {
                if( this.error )
                    this.hMessage.textContent = this.error;

                Dom.showElement( this.hMessage );

                return false;
            }
            else
            {
                Dom.hideElement( this.hMessage );

                return true;
            }
        }

        public reset() : void
        {
            Dom.hideElement( this.hMessage );
        }
    }
}
