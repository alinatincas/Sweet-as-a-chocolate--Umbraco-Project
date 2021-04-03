var contentEditingHelperDecorator = function ($delegate, navigationService, editorState, deployHelper, localizationService) {

    $delegate.configureContentEditorButtons = (function () {
        var cached_function = $delegate.configureContentEditorButtons;
        return function () {
            var buttons = cached_function.apply(this, arguments);
            if (Umbraco.Sys.ServerVariables.deploy &&
                Umbraco.Sys.ServerVariables.deploy.AllowDeployOptions &&
                Umbraco.Sys.ServerVariables.deploy.AllowDeployOptions === true) {
                buttons.subButtons.push({
                    letter: "D",
                    labelKey: "actions_deployTransferNow",
                    hotKey: "ctrl+d",
                    hotKeyWhenHidden: true,
                    handler: function() {

                        //getting the current tree node to open the dialog against.
                        var node = editorState.current;
                        if (!node.nodeType && node.udi) {
                            node.nodeType = deployHelper.getEntityTypeFromUdi(node.udi);
                        }

                        localizationService.localize("dialogs_deployTransferNowTitle").then( function(value) {
                            navigationService.showDialog({
                                action: {
                                    name: value,
                                    metaData: {
                                        actionView: "../App_Plugins/Deploy/views/dialogs/deploy.html",
                                        dialogMode: true
                                    }
                                },
                                node: node
                            });
                        });
                    }
                });
            }
            return buttons;
        };
    } ());
    return $delegate;
};

angular.module("umbraco").config(["$provide", function ($provide) {
    $provide.decorator("contentEditingHelper", contentEditingHelperDecorator);
}]);