namespace Core.Organizer
{
    export class ParentPattern
    {
        constructor( public parent : ScopePattern, public identifier : string )
        {
            // nothing here...
        }
    }

    export class ScopePattern extends ParentPattern
    {
        public loops : Map<LoopPattern> = { };
        public controllers : Map<ControllerPattern> = { };
        public compositions : Map<CompositionPattern> = { };

        constructor( parent : ScopePattern, identifier : string, public handle : Element )
        {
            super( parent, identifier );
        }
    }

    export class RootPattern extends ScopePattern
    {
        public templates : Map<TemplatePattern> = { };

        constructor( handle : Element )
        {
            super( null, null, handle );
        }
    }

    export class TemplatePattern extends ScopePattern
    {
        constructor( handle : Element )
        {
            super( null, null, handle );
        }
    }

    export class LoopPattern extends ScopePattern
    {
        constructor( parent : ScopePattern, handle : Element, identifier : string, public name : string, public functions : Array<Method>, public logic : string )
        {
            super( parent, identifier, handle );
        }
    }

    export class ControllerPattern extends ScopePattern
    {
        constructor( parent : ScopePattern, handle : Element, identifier : string, public name : string, public type : string )
        {
            super( parent, identifier, handle );
        }
    }

    export class CompositionPattern extends ScopePattern
    {
        constructor( parent : ScopePattern, identifier : string, public name : string, public template : string )
        {
            super( parent, identifier, null );
        }
    }
}
