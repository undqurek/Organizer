/**
 * Created by qurek on 10.02.2017.
 */
namespace Core.Validation
{
    export interface IValidator
    {
        validate() : boolean;
        reset() : void;
    }
}
