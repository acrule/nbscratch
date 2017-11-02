/*
NBScratch: Jupyter Notebook Extension placing a computational scratchpad in the
notebook
*/

define([
    'require',
    'jquery',
    'base/js/namespace',
    'base/js/events',
    'base/js/utils',
    'notebook/js/codecell'
], function(
    require,
    $,
    Jupyter,
    events,
    utils,
    CodeCell
){

    var Scratchpad = function(nb) {
        var scratchpad = this;
        this.notebook = nb;
        this.kernel = nb.kernel;
        this.km = nb.keyboard_manager;
        this.collapsed = true;

        // create html elements
        this.element = $("<div id=scratchpad>")
        this.close_button = $("<i>").addClass("fa fa-caret-square-o-right scratchpad-btn scratchpad-close");
        this.open_button = $("<i>").addClass("fa fa-caret-square-o-left scratchpad-btn scratchpad-open");
        this.element.append(this.close_button);
        this.element.append(this.open_button);

        // hook up events to buttons
        this.open_button.click(function () {
            scratchpad.expand();
        });
        this.close_button.click(function () {
            scratchpad.collapse();
        });

        // create cell
        var cell = this.cell = new CodeCell.CodeCell(nb.kernel, {
            events: nb.events,
            config: nb.config,
            keyboard_manager: nb.keyboard_manager,
            notebook: nb,
            tooltip: nb.tooltip,
        });

        // render cell
        cell.set_input_prompt();
        this.element.append($("<div/>").attr('id', 'cell-wrapper').addClass('cell-wrapper').append(this.cell.element));
        cell.render();
        cell.refresh();
        this.collapse();

        // override main notebook execution if scratchpad is in focus
        // create and register new events
        var execute_and_select_action = this.km.actions.register({
            handler: $.proxy(this.execute_and_select_event, this),
        }, 'scratchpad-execute-and-select');
        var execute_action = this.km.actions.register({
            handler: $.proxy(this.execute_event, this),
        }, 'scratchpad-execute');
        var toggle_action = this.km.actions.register({
            handler: $.proxy(this.toggle, this),
        }, 'scratchpad-toggle');

        // set shortcuts
        var shortcuts = {
            'shift-enter': execute_and_select_action,
            'ctrl-enter': execute_action,
            'ctrl-b': toggle_action,
        }
        this.km.edit_shortcuts.add_shortcuts(shortcuts);
        this.km.command_shortcuts.add_shortcuts(shortcuts);

        // finally, add scratchpad the page
        $("#menubar-container").append(this.element);
    };

    Scratchpad.prototype.execute_and_select_event = function(evt){
        if(utils.is_focused(this.element)){
            this.cell.execute();
        }
        else {
            this.notebook.execute_cell_and_select_below();
        }
    };

    Scratchpad.prototype.execute_event = function(evt){
        if(utils.is_focused(this.element)){
            this.cell.execute();
        }
        else{
            this.notebook.execute_selected_cells();
        }
    }

    Scratchpad.prototype.toggle = function(){
        if(this.collapsed){
            this.expand();
        }
        else{
            this.collapse();
        }
        return false;
    }

    // TODO I think we may want this to come up from the bottom of the notebook
    Scratchpad.prototype.expand = function(){
        this.collapsed = false;
        var site_height = $("#site").height();
        this.element.animate({
            height: site_height / 2
        }, 400)
        this.open_button.hide();
        this.close_button.show();
        this.cell.element.show();
        this.cell.focus_editor();
    }

    Scratchpad.prototype.collapse = function(){
        this.collapsed = true;
        this.element.animate({
            height: 0,
        }, 250);
        this.close_button.hide();
        this.open_button.show();
        this.cell.element.hide();
    };

    function load_css() {
        // Load css for scratchpad
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl("./main.css");
        document.getElementsByTagName("head")[0].appendChild(link);
    };

    function setup_scratchpad(){
        // only create scratchpad if kernel is running
        if(Jupyter.notebook.kernel){
            create_scratchpad();
        }
        else{
            events.on('kernel_ready.Kernel', create_scratchpad);
        }
    }

    function create_scratchpad() {
        console.log('Creating Scratchpad')
        return new Scratchpad(Jupyter.notebook);
      }

    function load_extension(){
        /* Called as extension loads and notebook opens */
        console.log('[NBScratch] is working');
        load_css()
        setup_scratchpad()
    }

    return {
        load_jupyter_extension: load_extension,
        load_ipython_extension: load_extension
    };
});
