/// <reference path="../Template/Html.ts" />
/// <reference path="../Template/Preprocessor.ts" />


namespace Core.Organizer
{
    import Html = Core.Template.Html;
    import Preprocessor = Core.Template.Preprocessor;

    /**
     * Allows to decompose template.
     *
     * @constructor Creates default decompositor.
     */
    export class Decompositor
    {
        // variables

        private static counter : number = 0;

        // constructors

        public constructor( private debug : boolean = false )
        {
            // nothing here ...
        }

        // helper methods

        private findMaster( root : Element, scopes : NodeList ) : Element
        {
            if( root == scopes[ 0 ] )
                return null;

            return root;
        }

        private findParent( scope : Element, pattern : RootPattern ) : ScopePattern
        {
            while( true )
            {
                let parent = scope.parentNode as any;

                if( parent == null )
                    return pattern;

                if( parent.$scope )
                    return parent.$scope;

                scope = parent;
            }
        }

        private createPlaceholder( scope : Element ) : string | null
        {
            let parent = scope.parentNode;

            if( parent )
            {
                let id = 'handle:' + ( ( Decompositor.counter++ ) + Math.random() );
                let script = Dom.createElement( 'script', parent );

                script.setAttribute( 'type', 'text/placeholder' );
                script.setAttribute( 'id', id );

                script.mount( scope );

                return id;
            }

            return null;
        }

        private collectScope( scope : Element | any, pattern : RootPattern ) : void
        {
            let template = scope.getAttribute( 'var-template' );

            if( template )
            {
				if( this.debug == false )
					scope.removeAttribute( 'var-template' );

				if( scope.hasAttribute( 'var-repeat' ) )
                    throw new Error( 'Template "' + template + '" root element cannot have "var-repeat" attribute.' );

                if( scope.hasAttribute( 'var-controller' ) )
                    throw new Error( 'Template "' + template + '" root element cannot have "var-controller" attribute.' );

                if( scope.hasAttribute( 'var-mount' ) )
                    throw new Error( 'Template "' + template + '" root element cannot have "var-mount" attribute.' );

                let name = Interpolator.extractName( template );

                if( name in pattern.templates )
                    throw new Error( 'Template name "' + name + '" is duplicated.' );

                pattern.templates[ name ] = scope.$scope = new TemplatePattern( scope );

                return;
            }

            let loop = scope.getAttribute( 'var-repeat' );
            let controller = scope.getAttribute( 'var-controller' );

            if( loop )
            {
				if( this.debug == false )
					scope.removeAttribute( 'var-repeat' );

				let parameter = Interpolator.parseParameter( loop );

                if( scope.hasAttribute( 'var-mount' ) )
                    throw new Error( 'Loop "' + parameter.name + '" cannot have "var-mount" attribute.' );

                if( controller )
                {
					if( this.debug == false )
						scope.removeAttribute( 'var-controller' );

					let parent = this.findParent( scope, pattern );
                    let identifier = this.createPlaceholder( scope );

                    if( parameter.name in parent.loops )
                        throw new Error( 'Loop name "' + parameter.name + '" is duplicated inside scope.' );

                    let logic = Interpolator.extractName( controller );

                    parent.loops[ parameter.name ] = scope.$scope = new LoopPattern( parent, scope, identifier, parameter.name, parameter.methods, logic );
                }
                else
                    throw new Error( 'Loop "' + parameter.name + '" has no "var-controller" attribute.' );

                return;
            }

            if( controller )
            {
				if( this.debug == false )
					scope.removeAttribute( 'var-controller' );

				let variable = Interpolator.parseVariable( controller );

                if( scope.hasAttribute( 'var-mount' ) )
                    throw new Error( 'Controller "' + variable.type + '" cannot have "var-mount" attribute.' );

                let parent = this.findParent( scope, pattern );
                let identifier = this.createPlaceholder( scope );

                if( variable.name in parent.controllers )
                    throw new Error( 'Controller name "' + variable.name + '" is duplicated inside scope.' );

                parent.controllers[ variable.name ] = scope.$scope = new ControllerPattern( parent, scope, identifier, variable.name, variable.type );

                return;
            }

            let composition = scope.getAttribute( 'var-mount' );

            if( composition )
            {
				if( this.debug == false )
					scope.removeAttribute( 'var-mount' );

				let variable = Interpolator.parseVariable( composition );

                let parent = this.findParent( scope, pattern );
                let identifier = this.createPlaceholder( scope );

                if( variable.name in parent.compositions )
                    throw new Error( 'Composition name "' + variable.name + '" is duplicated inside scope.' );

                parent.compositions[ variable.name ] = scope.$scope = new CompositionPattern( parent, identifier, variable.name, variable.type );

                return;
            }
        }

        private releaseScope( scope : Element | any ) : void
        {
            let parent = scope.parentNode;

            if( parent )
                parent.removeChild( scope );

            delete scope.$scope;
        }

        // public methods

        /**
         * Decompose template to scope tree.
         *
         * @param template
         * @param variables
         */
        public decompose( template : string, variables ? : Map<string> ) : RootPattern
        {
            if( variables )
                template = Preprocessor.compile( template, variables );

            let cover = Html.cover( template );
            let children = cover.children;

            if( children.length == 1 )
            {
                let scopes = Dom.findHandles( '[var-template],[var-repeat],[var-controller],[var-mount]', cover );
                let root = cover.removeChild( children[ 0 ] ); // po zebraniu informacji o scope'ach należy wydobyć root element

                if( root.hasAttribute( 'var-template' ) )
                    throw new Error( 'Root element cannot have "var-template" attribute.' );

                if( root.hasAttribute( 'var-repeat' ) )
                    throw new Error( 'Root element cannot have "var-repeat" attribute.' );

                if( root.hasAttribute( 'var-mount' ) )
                    throw new Error( 'Root element cannot have "var-mount" attribute.' );

                let master = this.findMaster( root, scopes );
                let pattern = new RootPattern( master );

                for( let entry of scopes as any )
                    this.collectScope( entry, pattern );

                for( let entry of scopes as any )
                    this.releaseScope( entry );

                return pattern;
            }
            else
                throw new Error( 'Expected one root element inside template.' );
        }
    }
}
