/**
 * Created by qurek on 13.11.2016.
 */
namespace Core
{
    export interface IAction
    {
        () : void
    }

    export interface IConsumer<T>
    {
        ( argument : T ) : void
    }

    export interface IProducer<T>
    {
        () : T
    }

    export interface IFunction<TArgument, TResult>
    {
        ( argument : TArgument ) : TResult
    }
}
