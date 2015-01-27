function MediumEditor(elements, options) {
    'use strict';
    return this.init(elements, options);
}

if (typeof module === 'object') {
    module.exports = MediumEditor;
}
// AMD support
else if (typeof define === 'function' && define.amd) {
    define(function () {
        'use strict';
        return MediumEditor;
    });
}

(function (window, document) {
    'use strict';

    function extend(b, a) {
        var prop;
        if (b === undefined) {
            return a;
        }
        for (prop in a) {
            if (a.hasOwnProperty(prop) && b.hasOwnProperty(prop) === false) {
                b[prop] = a[prop];
            }
        }
        return b;
    }

    function isDescendant(parent, child) {
         var node = child.parentNode;
         while (node !== null) {
             if (node === parent) {
                 return true;
             }
             node = node.parentNode;
         }
         return false;
    }

    // http://stackoverflow.com/questions/5605401/insert-link-in-contenteditable-element
    // by Tim Down
    function saveSelection() {
        var i,
            len,
            ranges,
            sel = this.options.contentWindow.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            ranges = [];
            for (i = 0, len = sel.rangeCount; i < len; i += 1) {
                ranges.push(sel.getRangeAt(i));
            }
            return ranges;
        }
        return null;
    }

    function restoreSelection(savedSel) {
        var i,
            len,
            sel = this.options.contentWindow.getSelection();
        if (savedSel) {
            sel.removeAllRanges();
            for (i = 0, len = savedSel.length; i < len; i += 1) {
                sel.addRange(savedSel[i]);
            }
        }
    }

    // http://stackoverflow.com/questions/1197401/how-can-i-get-the-element-the-caret-is-in-with-javascript-when-using-contentedi
    // by You
    function getSelectionStart() {
        var node = this.options.ownerDocument.getSelection().anchorNode,
            startNode = (node && node.nodeType === 3 ? node.parentNode : node);
        return startNode;
    }

    // http://stackoverflow.com/questions/4176923/html-of-selected-text
    // by Tim Down
    function getSelectionHtml() {
        var i,
            html = '',
            sel,
            len,
            container;
        if (this.options.contentWindow.getSelection !== undefined) {
            sel = this.options.contentWindow.getSelection();
            if (sel.rangeCount) {
                container = this.options.ownerDocument.createElement('div');
                for (i = 0, len = sel.rangeCount; i < len; i += 1) {
                    container.appendChild(sel.getRangeAt(i).cloneContents());
                }
                html = container.innerHTML;
            }
        } else if (this.options.ownerDocument.selection !== undefined) {
            if (this.options.ownerDocument.selection.type === 'Text') {
                html = this.options.ownerDocument.selection.createRange().htmlText;
            }
        }
        return html;
    }

    // https://github.com/jashkenas/underscore
    function isElement(obj) {
        return !!(obj && obj.nodeType === 1);
    }

    MediumEditor.prototype = {
        defaults: {
            allowMultiParagraphSelection: true,
            anchorInputPlaceholder: 'Paste or type a link',
            anchorPreviewHideDelay: 500,
            buttons: ['bold', 'italic', 'underline', 'anchor', 'header1', 'header2', 'quote'],
            buttonLabels: false,
            checkLinkFormat: false,
            cleanPastedHTML: false,
            delay: 0,
            diffLeft: 0,
            diffTop: -10,
            disableReturn: false,
            disableDoubleReturn: false,
            disableToolbar: false,
            disableEditing: false,
            elementsContainer: false,
            contentWindow: window,
            ownerDocument: document,
            firstHeader: 'h3',
            forcePlainText: true,
            placeholder: 'Type your text',
            secondHeader: 'h4',
            targetBlank: false,
            anchorTarget: false,
            anchorButton: false,
            anchorButtonClass: 'btn',
            extensions: {},
            activeButtonClass: 'medium-editor-button-active',
            firstButtonClass: 'medium-editor-button-first',
            lastButtonClass: 'medium-editor-button-last'
        },

        // http://stackoverflow.com/questions/17907445/how-to-detect-ie11#comment30165888_17907562
        // by rg89
        isIE: ((navigator.appName === 'Microsoft Internet Explorer') || ((navigator.appName === 'Netscape') && (new RegExp('Trident/.*rv:([0-9]{1,}[.0-9]{0,})').exec(navigator.userAgent) !== null))),

        init: function (elements, options) {
            this.options = extend(options, this.defaults);
            this.setElementSelection(elements);
            if (this.elements.length === 0) {
                return;
            }
            this.parentElements = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre'];
            if (!this.options.elementsContainer) {
                this.options.elementsContainer = document.body;
            }
            this.id = this.options.elementsContainer.querySelectorAll('.medium-editor-toolbar').length + 1;
            return this.setup();
        },

        setup: function () {
            this.events = [];
            this.isActive = true;
            this.initElements()
                .bindSelect()
                .bindPaste()
                .setPlaceholders()
                .bindWindowActions()
                .passInstance();
        },

        on: function(target, event, listener, useCapture) {
            target.addEventListener(event, listener, useCapture);
            this.events.push([target, event, listener, useCapture]);
        },

        off: function(target, event, listener, useCapture) {
            var index = this.events.indexOf([target, event, listener, useCapture]),
                e;
            if(index !== -1) {
                e = this.events.splice(index, 1);
                e[0].removeEventListener(e[1], e[2], e[3]);
            }
        },

        removeAllEvents: function() {
            var e = this.events.pop();
            while(e) {
                e[0].removeEventListener(e[1], e[2], e[3]);
                e = this.events.pop();
            }
        },

        initElements: function () {
            this.updateElementList();
            var i,
                addToolbar = false;
            for (i = 0; i < this.elements.length; i += 1) {
                if (!this.options.disableEditing && !this.elements[i].getAttribute('data-disable-editing')) {
                    this.elements[i].setAttribute('contentEditable', true);
                }
                if (!this.elements[i].getAttribute('data-placeholder')) {
                    this.elements[i].setAttribute('data-placeholder', this.options.placeholder);
                }
                this.elements[i].setAttribute('data-medium-element', true);
                this.bindParagraphCreation(i).bindReturn(i).bindTab(i);
                if (!this.options.disableToolbar && !this.elements[i].getAttribute('data-disable-toolbar')) {
                    addToolbar = true;
                }
            }
            // Init toolbar
            if (addToolbar) {
                this.initToolbar()
                    .bindButtons()
                    .bindAnchorForm()
                    .bindAnchorPreview();
            }
            return this;
        },

        setElementSelection: function (selector) {
            this.elementSelection = selector;
            this.updateElementList();
        },

        updateElementList: function () {
            this.elements = typeof this.elementSelection === 'string' ? this.options.ownerDocument.querySelectorAll(this.elementSelection) : this.elementSelection;
            if (this.elements.nodeType === 1) {
                this.elements = [this.elements];
            }
        },

        serialize: function () {
            var i,
                elementid,
                content = {};
            for (i = 0; i < this.elements.length; i += 1) {
                elementid = (this.elements[i].id !== '') ? this.elements[i].id : 'element-' + i;
                content[elementid] = {
                    value: this.elements[i].innerHTML.trim()
                };
            }
            return content;
        },

        /**
         * Helper function to call a method with a number of parameters on all registered extensions.
         * The function assures that the function exists before calling.
         *
         * @param {string} funcName name of the function to call
         * @param [args] arguments passed into funcName
         */
        callExtensions: function (funcName) {
            if (arguments.length < 1) {
                return;
            }

            var args = Array.prototype.slice.call(arguments, 1),
                ext,
                name;

            for (name in this.options.extensions) {
                if (this.options.extensions.hasOwnProperty(name)) {
                    ext = this.options.extensions[name];
                    if (ext[funcName] !== undefined) {
                        ext[funcName].apply(ext, args);
                    }
                }
            }
        },

        /**
         * Pass current Medium Editor instance to all extensions
         * if extension constructor has 'parent' attribute set to 'true'
         *
         */
        passInstance: function () {
            var self = this,
                ext,
                name;

            for (name in self.options.extensions) {
                if (self.options.extensions.hasOwnProperty(name)) {
                    ext = self.options.extensions[name];

                    if (ext.parent) {
                        ext.base = self;
                    }
                }
            }

            return self;
        },

        bindParagraphCreation: function (index) {
            var self = this;
            this.on(this.elements[index], 'keypress', function (e) {
                var node = getSelectionStart.call(self),
                    tagName;
                if (e.which === 32) {
                    tagName = node.tagName.toLowerCase();
                    if (tagName === 'a') {
                        document.execCommand('unlink', false, null);
                    }
                }
            });

            this.on(this.elements[index], 'keyup', function (e) {
                var node = getSelectionStart.call(self),
                    tagName,
                    editorElement;

                if (node && node.getAttribute('data-medium-element') && node.children.length === 0 && !(self.options.disableReturn || node.getAttribute('data-disable-return'))) {
                    document.execCommand('formatBlock', false, 'p');
                }
                if (e.which === 13) {
                    node = getSelectionStart.call(self);
                    tagName = node.tagName.toLowerCase();
                    editorElement = self.getSelectionElement();

                    if (!(self.options.disableReturn || editorElement.getAttribute('data-disable-return')) &&
                        tagName !== 'li' && !self.isListItemChild(node)) {
                        if (!e.shiftKey) {
                            document.execCommand('formatBlock', false, 'p');
                        }
                        if (tagName === 'a') {
                            document.execCommand('unlink', false, null);
                        }
                    }
                }
            });
            return this;
        },

        isListItemChild: function (node) {
            var parentNode = node.parentNode,
                tagName = parentNode.tagName.toLowerCase();
            while (this.parentElements.indexOf(tagName) === -1 && tagName !== 'div') {
                if (tagName === 'li') {
                    return true;
                }
                parentNode = parentNode.parentNode;
                if (parentNode && parentNode.tagName) {
                    tagName = parentNode.tagName.toLowerCase();
                } else {
                    return false;
                }
            }
            return false;
        },

        bindReturn: function (index) {
            var self = this;
            this.on(this.elements[index], 'keypress', function (e) {
                if (e.which === 13) {
                    if (self.options.disableReturn || this.getAttribute('data-disable-return')) {
                        e.preventDefault();
                    } else if (self.options.disableDoubleReturn || this.getAttribute('data-disable-double-return')) {
                        var node = getSelectionStart.call(self);
                        if (node && node.innerText === '\n') {
                            e.preventDefault();
                        }
                    }
                }
            });
            return this;
        },

        bindTab: function (index) {
            var self = this;
            this.on(this.elements[index], 'keydown', function (e) {
                if (e.which === 9) {
                    // Override tab only for pre nodes
                    var tag = getSelectionStart.call(self).tagName.toLowerCase();
                    if (tag === 'pre') {
                        e.preventDefault();
                        document.execCommand('insertHtml', null, '    ');
                    }

                    // Tab to indent list structures!
                    if (tag === 'li') {
                        e.preventDefault();

                        // If Shift is down, outdent, otherwise indent
                        if (e.shiftKey) {
                            document.execCommand('outdent', e);
                        } else {
                            document.execCommand('indent', e);
                        }
                    }
                }
            });
            return this;
        },

        buttonTemplate: function (btnType) {
            var buttonLabels = this.getButtonLabels(this.options.buttonLabels),
                buttonTemplates = {
                    'bold': '<button class="medium-editor-action medium-editor-action-bold" data-action="bold" data-element="b">' + buttonLabels.bold + '</button>',
                    'italic': '<button class="medium-editor-action medium-editor-action-italic" data-action="italic" data-element="i">' + buttonLabels.italic + '</button>',
                    'underline': '<button class="medium-editor-action medium-editor-action-underline" data-action="underline" data-element="u">' + buttonLabels.underline + '</button>',
                    'strikethrough': '<button class="medium-editor-action medium-editor-action-strikethrough" data-action="strikethrough" data-element="strike">' + buttonLabels.strikethrough +'</button>',
                    'superscript': '<button class="medium-editor-action medium-editor-action-superscript" data-action="superscript" data-element="sup">' + buttonLabels.superscript + '</button>',
                    'subscript': '<button class="medium-editor-action medium-editor-action-subscript" data-action="subscript" data-element="sub">' + buttonLabels.subscript + '</button>',
                    'anchor': '<button class="medium-editor-action medium-editor-action-anchor" data-action="anchor" data-element="a">' + buttonLabels.anchor + '</button>',
                    'image': '<button class="medium-editor-action medium-editor-action-image" data-action="image" data-element="img">' + buttonLabels.image + '</button>',
                    'header1': '<button class="medium-editor-action medium-editor-action-header1" data-action="append-' + this.options.firstHeader + '" data-element="' + this.options.firstHeader + '">' + buttonLabels.header1 + '</button>',
                    'header2': '<button class="medium-editor-action medium-editor-action-header2" data-action="append-' + this.options.secondHeader + '" data-element="' + this.options.secondHeader + '">' + buttonLabels.header2 + '</button>',
                    'quote': '<button class="medium-editor-action medium-editor-action-quote" data-action="append-blockquote" data-element="blockquote">' + buttonLabels.quote + '</button>',
                    'orderedlist': '<button class="medium-editor-action medium-editor-action-orderedlist" data-action="insertorderedlist" data-element="ol">' + buttonLabels.orderedlist + '</button>',
                    'unorderedlist': '<button class="medium-editor-action medium-editor-action-unorderedlist" data-action="insertunorderedlist" data-element="ul">' + buttonLabels.unorderedlist + '</button>',
                    'pre': '<button class="medium-editor-action medium-editor-action-pre" data-action="append-pre" data-element="pre">' + buttonLabels.pre + '</button>',
                    'indent': '<button class="medium-editor-action medium-editor-action-indent" data-action="indent" data-element="ul">' + buttonLabels.indent + '</button>',
                    'outdent': '<button class="medium-editor-action medium-editor-action-outdent" data-action="outdent" data-element="ul">' + buttonLabels.outdent + '</button>',
                    'justifyCenter': '<button class="medium-editor-action medium-editor-action-justifyCenter" data-action="justifyCenter" data-element="">' + buttonLabels.justifyCenter + '</button>',
                    'justifyFull': '<button class="medium-editor-action medium-editor-action-justifyFull" data-action="justifyFull" data-element="">' + buttonLabels.justifyFull + '</button>',
                    'justifyLeft': '<button class="medium-editor-action medium-editor-action-justifyLeft" data-action="justifyLeft" data-element="">' + buttonLabels.justifyLeft + '</button>',
                    'justifyRight': '<button class="medium-editor-action medium-editor-action-justifyRight" data-action="justifyRight" data-element="">' + buttonLabels.justifyRight + '</button>'
                };
            return buttonTemplates[btnType] || false;
        },

        // TODO: break method
        getButtonLabels: function (buttonLabelType) {
            var customButtonLabels,
                attrname,
                buttonLabels = {
                    'bold': '<b>B</b>',
                    'italic': '<b><i>I</i></b>',
                    'underline': '<b><u>U</u></b>',
                    'strikethrough': '<s>A</s>',
                    'superscript': '<b>x<sup>1</sup></b>',
                    'subscript': '<b>x<sub>1</sub></b>',
                    'anchor': '<b>#</b>',
                    'image': '<b>image</b>',
                    'header1': '<b>H1</b>',
                    'header2': '<b>H2</b>',
                    'quote': '<b>&ldquo;</b>',
                    'orderedlist': '<b>1.</b>',
                    'unorderedlist': '<b>&bull;</b>',
                    'pre': '<b>0101</b>',
                    'indent': '<b>&rarr;</b>',
                    'outdent': '<b>&larr;</b>',
                    'justifyCenter': '<b>C</b>',
                    'justifyFull': '<b>J</b>',
                    'justifyLeft': '<b>L</b>',
                    'justifyRight': '<b>R</b>'
                };
            if (buttonLabelType === 'fontawesome') {
                customButtonLabels = {
                    'bold': '<i class="fa fa-bold"></i>',
                    'italic': '<i class="fa fa-italic"></i>',
                    'underline': '<i class="fa fa-underline"></i>',
                    'strikethrough': '<i class="fa fa-strikethrough"></i>',
                    'superscript': '<i class="fa fa-superscript"></i>',
                    'subscript': '<i class="fa fa-subscript"></i>',
                    'anchor': '<i class="fa fa-link"></i>',
                    'image': '<i class="fa fa-picture-o"></i>',
                    'quote': '<i class="fa fa-quote-right"></i>',
                    'orderedlist': '<i class="fa fa-list-ol"></i>',
                    'unorderedlist': '<i class="fa fa-list-ul"></i>',
                    'pre': '<i class="fa fa-code fa-lg"></i>',
                    'indent': '<i class="fa fa-indent"></i>',
                    'outdent': '<i class="fa fa-outdent"></i>',
                    'justifyCenter': '<i class="fa fa-align-center"></i>',
                    'justifyFull': '<i class="fa fa-align-justify"></i>',
                    'justifyLeft': '<i class="fa fa-align-left"></i>',
                    'justifyRight': '<i class="fa fa-align-right"></i>'
                };
            } else if (typeof buttonLabelType === 'object') {
                customButtonLabels = buttonLabelType;
            }
            if (typeof customButtonLabels === 'object') {
                for (attrname in customButtonLabels) {
                    if (customButtonLabels.hasOwnProperty(attrname)) {
                        buttonLabels[attrname] = customButtonLabels[attrname];
                    }
                }
            }
            return buttonLabels;
        },

        initToolbar: function () {
            if (this.toolbar) {
                return this;
            }
            this.toolbar = this.createToolbar();
            this.keepToolbarAlive = false;
            this.anchorForm = this.toolbar.querySelector('.medium-editor-toolbar-form-anchor');
            this.anchorInput = this.anchorForm.querySelector('input.medium-editor-toolbar-anchor-input');
            this.anchorTarget = this.anchorForm.querySelector('input.medium-editor-toolbar-anchor-target');
            this.anchorButton = this.anchorForm.querySelector('input.medium-editor-toolbar-anchor-button');
            this.toolbarActions = this.toolbar.querySelector('.medium-editor-toolbar-actions');
            this.anchorPreview = this.createAnchorPreview();

            return this;
        },

        createToolbar: function () {
            var toolbar = document.createElement('div');
            toolbar.id = 'medium-editor-toolbar-' + this.id;
            toolbar.className = 'medium-editor-toolbar';
            toolbar.appendChild(this.toolbarButtons());
            toolbar.appendChild(this.toolbarFormAnchor());
            this.options.elementsContainer.appendChild(toolbar);
            return toolbar;
        },

        //TODO: actionTemplate
        toolbarButtons: function () {
            var btns = this.options.buttons,
                ul = document.createElement('ul'),
                li,
                i,
                btn,
                ext;

            ul.id = 'medium-editor-toolbar-actions';
            ul.className = 'medium-editor-toolbar-actions clearfix';

            for (i = 0; i < btns.length; i += 1) {
                if (this.options.extensions.hasOwnProperty(btns[i])) {
                    ext = this.options.extensions[btns[i]];
                    btn = ext.getButton !== undefined ? ext.getButton() : null;
                } else {
                    btn = this.buttonTemplate(btns[i]);
                }

                if (btn) {
                    li = document.createElement('li');
                    if (isElement(btn)) {
                        li.appendChild(btn);
                    } else {
                        li.innerHTML = btn;
                    }
                    ul.appendChild(li);
                }
            }

            return ul;
        },

        toolbarFormAnchor: function () {
            var anchor = document.createElement('div'),
                input = document.createElement('input'),
                target_label = document.createElement('label'),
                target = document.createElement('input'),
                button_label = document.createElement('label'),
                button = document.createElement('input'),
                close = document.createElement('a'),
                save = document.createElement('a');

            close.setAttribute('href', '#');
            close.className = 'medium-editor-toobar-anchor-close';
            close.innerHTML = '&times;';

            save.setAttribute('href', '#');
            save.className = 'medium-editor-toobar-anchor-save';
            save.innerHTML = '&#10003;';

            input.setAttribute('type', 'text');
            input.className = 'medium-editor-toolbar-anchor-input';
            input.setAttribute('placeholder', this.options.anchorInputPlaceholder);


            target.setAttribute('type', 'checkbox');
            target.className = 'medium-editor-toolbar-anchor-target';
            target_label.innerHTML = "Open in New Window?";
            target_label.insertBefore(target, target_label.firstChild);

            button.setAttribute('type', 'checkbox');
            button.className = 'medium-editor-toolbar-anchor-button';
            button_label.innerHTML = "Button";
            button_label.insertBefore(button, button_label.firstChild);


            anchor.className = 'medium-editor-toolbar-form-anchor';
            anchor.id = 'medium-editor-toolbar-form-anchor';
            anchor.appendChild(input);

            anchor.appendChild(save);
            anchor.appendChild(close);

            if (this.options.anchorTarget) {
                anchor.appendChild(target_label);
            }

            if (this.options.anchorButton) {
                anchor.appendChild(button_label);
            }

            return anchor;
        },

        bindSelect: function () {
            var self = this,
                timer = '',
                i;

            this.checkSelectionWrapper = function (e) {

                // Do not close the toolbar when bluring the editable area and clicking into the anchor form
                if (e && self.clickingIntoArchorForm(e)) {
                    return false;
                }

                clearTimeout(timer);
                timer = setTimeout(function () {
                    self.checkSelection();
                }, self.options.delay);
            };

            this.on(document.documentElement, 'mouseup', this.checkSelectionWrapper);

            for (i = 0; i < this.elements.length; i += 1) {
                this.on(this.elements[i], 'keyup', this.checkSelectionWrapper);
                this.on(this.elements[i], 'blur', this.checkSelectionWrapper);
            }
            return this;
        },

        checkSelection: function () {
            var newSelection,
                selectionElement;

            if (this.keepToolbarAlive !== true && !this.options.disableToolbar) {

                newSelection = this.options.contentWindow.getSelection();
                if (newSelection.toString().trim() === '' ||
                    (this.options.allowMultiParagraphSelection === false && this.hasMultiParagraphs()) ||
                    this.selectionInContentEditableFalse()) {
                    this.hideToolbarActions();
                } else {
                    selectionElement = this.getSelectionElement();
                    if (!selectionElement || selectionElement.getAttribute('data-disable-toolbar')) {
                        this.hideToolbarActions();
                    } else {
                        this.checkSelectionElement(newSelection, selectionElement);
                    }
                }
            }
            return this;
        },

        clickingIntoArchorForm: function (e) {
            var self = this;

            if (e.type && e.type.toLowerCase() === 'blur' && e.relatedTarget && e.relatedTarget === self.anchorInput) {
                return true;
            }

            return false;
        },

        hasMultiParagraphs: function () {
            var selectionHtml = getSelectionHtml.call(this).replace(/<[\S]+><\/[\S]+>/gim, ''),
                hasMultiParagraphs = selectionHtml.match(/<(p|h[0-6]|blockquote)>([\s\S]*?)<\/(p|h[0-6]|blockquote)>/g);

            return (hasMultiParagraphs ? hasMultiParagraphs.length : 0);
        },

        checkSelectionElement: function (newSelection, selectionElement) {
            var i;
            this.selection = newSelection;
            this.selectionRange = this.selection.getRangeAt(0);
            for (i = 0; i < this.elements.length; i += 1) {
                if (this.elements[i] === selectionElement) {
                    this.setToolbarButtonStates()
                        .setToolbarPosition()
                        .showToolbarActions();
                    return;
                }
            }
            this.hideToolbarActions();
        },

        findMatchingSelectionParent: function(testElementFunction) {
            var selection = this.options.contentWindow.getSelection(), range, current;

            if (selection.rangeCount === 0) {
                return false;
            }

            range = selection.getRangeAt(0);
            current = range.commonAncestorContainer;

            do {
              if (current.nodeType === 1){
                if ( testElementFunction(current) )
                {
                    return current;
                }
                // do not traverse upwards past the nearest containing editor
                if (current.getAttribute('data-medium-element')) {
                    return false;
                }
              }

              current = current.parentNode;
            } while (current);

            return false;
        },

        getSelectionElement: function () {
            return this.findMatchingSelectionParent(function(el) {
                return el.getAttribute('data-medium-element');
            });
        },

        selectionInContentEditableFalse: function () {
            return this.findMatchingSelectionParent(function(el) {
                return (el && el.nodeName !== '#text' && el.getAttribute('contenteditable') === 'false');
            });
        },

        setToolbarPosition: function () {
            var buttonHeight = 50,
                selection = this.options.contentWindow.getSelection(),
                range = selection.getRangeAt(0),
                boundary = range.getBoundingClientRect(),
                defaultLeft = (this.options.diffLeft) - (this.toolbar.offsetWidth / 2),
                middleBoundary = (boundary.left + boundary.right) / 2,
                halfOffsetWidth = this.toolbar.offsetWidth / 2;
            if (boundary.top < buttonHeight) {
                this.toolbar.classList.add('medium-toolbar-arrow-over');
                this.toolbar.classList.remove('medium-toolbar-arrow-under');
                this.toolbar.style.top = buttonHeight + boundary.bottom - this.options.diffTop + this.options.contentWindow.pageYOffset - this.toolbar.offsetHeight + 'px';
            } else {
                this.toolbar.classList.add('medium-toolbar-arrow-under');
                this.toolbar.classList.remove('medium-toolbar-arrow-over');
                this.toolbar.style.top = boundary.top + this.options.diffTop + this.options.contentWindow.pageYOffset - this.toolbar.offsetHeight + 'px';
            }
            if (middleBoundary < halfOffsetWidth) {
                this.toolbar.style.left = defaultLeft + halfOffsetWidth + 'px';
            } else if ((this.options.contentWindow.innerWidth - middleBoundary) < halfOffsetWidth) {
                this.toolbar.style.left = this.options.contentWindow.innerWidth + defaultLeft - halfOffsetWidth + 'px';
            } else {
                this.toolbar.style.left = defaultLeft + middleBoundary + 'px';
            }

            this.hideAnchorPreview();

            return this;
        },

        setToolbarButtonStates: function () {
            var buttons = this.toolbarActions.querySelectorAll('button'),
                i;
            for (i = 0; i < buttons.length; i += 1) {
                buttons[i].classList.remove(this.options.activeButtonClass);
            }
            this.checkActiveButtons();
            return this;
        },

        checkActiveButtons: function () {
            var elements = Array.prototype.slice.call(this.elements),
                parentNode = this.getSelectedParentElement();
            while (parentNode.tagName !== undefined && this.parentElements.indexOf(parentNode.tagName.toLowerCase) === -1) {
                this.activateButton(parentNode.tagName.toLowerCase());
                this.callExtensions('checkState', parentNode);

                // we can abort the search upwards if we leave the contentEditable element
                if (elements.indexOf(parentNode) !== -1) {
                    break;
                }
                parentNode = parentNode.parentNode;
            }
        },

        activateButton: function (tag) {
            var el = this.toolbar.querySelector('[data-element="' + tag + '"]');
            if (el !== null && el.className.indexOf(this.options.activeButtonClass) === -1) {
                el.className += ' ' + this.options.activeButtonClass;
            }
        },

        bindButtons: function () {
            var buttons = this.toolbar.querySelectorAll('button'),
                i,
                self = this,
                triggerAction = function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (self.selection === undefined) {
                        self.checkSelection();
                    }
                    if (this.className.indexOf(self.options.activeButtonClass) > -1) {
                        this.classList.remove(self.options.activeButtonClass);
                    } else {
                        this.className += ' ' + self.options.activeButtonClass;
                    }
                    if (this.hasAttribute('data-action')) {
                        self.execAction(this.getAttribute('data-action'), e);
                    }
                };
            for (i = 0; i < buttons.length; i += 1) {
                this.on(buttons[i], 'click', triggerAction);
            }
            this.setFirstAndLastItems(buttons);
            return this;
        },

        setFirstAndLastItems: function (buttons) {
            if (buttons.length > 0) {
                buttons[0].className += ' ' + this.options.firstButtonClass;
                buttons[buttons.length - 1].className += ' ' + this.options.lastButtonClass;
            }
            return this;
        },

        execAction: function (action, e) {
            if (action.indexOf('append-') > -1) {
                this.execFormatBlock(action.replace('append-', ''));
                this.setToolbarPosition();
                this.setToolbarButtonStates();
            } else if (action === 'anchor') {
                this.triggerAnchorAction(e);
            } else if (action === 'image') {
                this.options.ownerDocument.execCommand('insertImage', false, this.options.contentWindow.getSelection());
            } else {
                this.options.ownerDocument.execCommand(action, false, null);
                this.setToolbarPosition();
            }
        },

        // http://stackoverflow.com/questions/15867542/range-object-get-selection-parent-node-chrome-vs-firefox
        rangeSelectsSingleNode: function (range) {
            var startNode = range.startContainer;
            return startNode === range.endContainer &&
                startNode.hasChildNodes() &&
                range.endOffset === range.startOffset + 1;
        },

        getSelectedParentElement: function () {
            var selectedParentElement = null,
                range = this.selectionRange;
            if (this.rangeSelectsSingleNode(range)) {
                selectedParentElement = range.startContainer.childNodes[range.startOffset];
            } else if (range.startContainer.nodeType === 3) {
                selectedParentElement = range.startContainer.parentNode;
            } else {
                selectedParentElement = range.startContainer;
            }
            return selectedParentElement;
        },

        triggerAnchorAction: function () {
            var selectedParentElement = this.getSelectedParentElement();
            if (selectedParentElement.tagName &&
                    selectedParentElement.tagName.toLowerCase() === 'a') {
                this.options.ownerDocument.execCommand('unlink', false, null);
            } else {
                if (this.anchorForm.style.display === 'block') {
                    this.showToolbarActions();
                } else {
                    this.showAnchorForm();
                }
            }
            return this;
        },

        execFormatBlock: function (el) {
            var selectionData = this.getSelectionData(this.selection.anchorNode);
            // FF handles blockquote differently on formatBlock
            // allowing nesting, we need to use outdent
            // https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla
            if (el === 'blockquote' && selectionData.el &&
                selectionData.el.parentNode.tagName.toLowerCase() === 'blockquote') {
                return this.options.ownerDocument.execCommand('outdent', false, null);
            }
            if (selectionData.tagName === el) {
                el = 'p';
            }
            // When IE we need to add <> to heading elements and
            //  blockquote needs to be called as indent
            // http://stackoverflow.com/questions/10741831/execcommand-formatblock-headings-in-ie
            // http://stackoverflow.com/questions/1816223/rich-text-editor-with-blockquote-function/1821777#1821777
            if (this.isIE) {
                if (el === 'blockquote') {
                    return this.options.ownerDocument.execCommand('indent', false, el);
                }
                el = '<' + el + '>';
            }
            return this.options.ownerDocument.execCommand('formatBlock', false, el);
        },

        getSelectionData: function (el) {
            var tagName;

            if (el && el.tagName) {
                tagName = el.tagName.toLowerCase();
            }

            while (el && this.parentElements.indexOf(tagName) === -1) {
                el = el.parentNode;
                if (el && el.tagName) {
                    tagName = el.tagName.toLowerCase();
                }
            }

            return {
                el: el,
                tagName: tagName
            };
        },

        getFirstChild: function (el) {
            var firstChild = el.firstChild;
            while (firstChild !== null && firstChild.nodeType !== 1) {
                firstChild = firstChild.nextSibling;
            }
            return firstChild;
        },

        hideToolbarActions: function () {
            this.keepToolbarAlive = false;
            if (this.toolbar !== undefined) {
                this.toolbar.classList.remove('medium-editor-toolbar-active');
            }
        },

        showToolbarActions: function () {
            var self = this,
                timer;
            this.anchorForm.style.display = 'none';
            this.toolbarActions.style.display = 'block';
            this.keepToolbarAlive = false;
            clearTimeout(timer);
            timer = setTimeout(function () {
                if (self.toolbar && !self.toolbar.classList.contains('medium-editor-toolbar-active')) {
                    self.toolbar.classList.add('medium-editor-toolbar-active');
                }
            }, 100);
        },

        saveSelection: function() {
            this.savedSelection = saveSelection.call(this);
        },

        restoreSelection: function() {
            restoreSelection.call(this, this.savedSelection);
        },

        showAnchorForm: function (link_value) {
            this.toolbarActions.style.display = 'none';
            this.saveSelection();
            this.anchorForm.style.display = 'block';
            this.setToolbarPosition();
            this.keepToolbarAlive = true;
            this.anchorInput.focus();
            this.anchorInput.value = link_value || '';
        },

        bindAnchorForm: function () {
            var linkCancel = this.anchorForm.querySelector('a.medium-editor-toobar-anchor-close'),
                linkSave = this.anchorForm.querySelector('a.medium-editor-toobar-anchor-save'),
                self = this;

            this.on(this.anchorForm, 'click', function (e) {
                e.stopPropagation();
                self.keepToolbarAlive = true;
            });

            this.on(this.anchorInput, 'keyup', function (e) {
                var button = null,
                    target;

                if (e.keyCode === 13) {
                    e.preventDefault();
                    if (self.options.anchorTarget && self.anchorTarget.checked) {
                        target = "_blank";
                    }
                    else {
                        target = "_self";
                    }

                    if (self.options.anchorButton && self.anchorButton.checked) {
                        button = self.options.anchorButtonClass;
                    }

                    self.createLink(this, target, button);
                }
            });

            this.on(linkSave, 'click', function(e) {
                var button = null,
                    target;
                e.preventDefault();
                if ( self.options.anchorTarget && self.anchorTarget.checked) {
                    target = "_blank";
                }
                else {
                    target = "_self";
                }

                if (self.options.anchorButton && self.anchorButton.checked) {
                    button = self.options.anchorButtonClass;
                }

                self.createLink(self.anchorInput, target, button);
            }, true);

            this.on(this.anchorInput, 'click', function (e) {
                // make sure not to hide form when cliking into the input
                e.stopPropagation();
                self.keepToolbarAlive = true;
            });

            // Hide the anchor form when focusing outside of it.
            this.on(this.options.ownerDocument.body, 'click', function (e) {
                if (e.target !== self.anchorForm && !isDescendant(self.anchorForm, e.target) && !isDescendant(self.toolbarActions, e.target)) {
                    self.keepToolbarAlive = false;
                    self.checkSelection();
                }
            }, true);
            this.on(this.options.ownerDocument.body, 'focus', function (e) {
                if (e.target !== self.anchorForm && !isDescendant(self.anchorForm, e.target) && !isDescendant(self.toolbarActions, e.target)) {
                    self.keepToolbarAlive = false;
                    self.checkSelection();
                }
            }, true);

            this.on(linkCancel, 'click', function (e) {
                e.preventDefault();
                self.showToolbarActions();
                restoreSelection.call(self, self.savedSelection);
            });
            return this;
        },


        hideAnchorPreview: function () {
            this.anchorPreview.classList.remove('medium-editor-anchor-preview-active');
        },

        // TODO: break method
        showAnchorPreview: function (anchorEl) {
            if (this.anchorPreview.classList.contains('medium-editor-anchor-preview-active')
                || anchorEl.getAttribute('data-disable-preview')) {
                return true;
            }

            var self = this,
                buttonHeight = 40,
                boundary = anchorEl.getBoundingClientRect(),
                middleBoundary = (boundary.left + boundary.right) / 2,
                halfOffsetWidth,
                defaultLeft,
                timer;

            self.anchorPreview.querySelector('i').textContent = anchorEl.href;
            halfOffsetWidth = self.anchorPreview.offsetWidth / 2;
            defaultLeft = self.options.diffLeft - halfOffsetWidth;

            clearTimeout(timer);
            timer = setTimeout(function () {
                if (self.anchorPreview && !self.anchorPreview.classList.contains('medium-editor-anchor-preview-active')) {
                    self.anchorPreview.classList.add('medium-editor-anchor-preview-active');
                }
            }, 100);

            self.observeAnchorPreview(anchorEl);

            self.anchorPreview.classList.add('medium-toolbar-arrow-over');
            self.anchorPreview.classList.remove('medium-toolbar-arrow-under');
            self.anchorPreview.style.top = Math.round(buttonHeight + boundary.bottom - self.options.diffTop + this.options.contentWindow.pageYOffset - self.anchorPreview.offsetHeight) + 'px';
            if (middleBoundary < halfOffsetWidth) {
                self.anchorPreview.style.left = defaultLeft + halfOffsetWidth + 'px';
            } else if ((this.options.contentWindow.innerWidth - middleBoundary) < halfOffsetWidth) {
                self.anchorPreview.style.left = this.options.contentWindow.innerWidth + defaultLeft - halfOffsetWidth + 'px';
            } else {
                self.anchorPreview.style.left = defaultLeft + middleBoundary + 'px';
            }

            return this;
        },

        // TODO: break method
        observeAnchorPreview: function (anchorEl) {
            var self = this,
                lastOver = (new Date()).getTime(),
                over = true,
                stamp = function () {
                    lastOver = (new Date()).getTime();
                    over = true;
                },
                unstamp = function (e) {
                    if (!e.relatedTarget || !/anchor-preview/.test(e.relatedTarget.className)) {
                        over = false;
                    }
                },
                interval_timer = setInterval(function () {
                    if (over) {
                        return true;
                    }
                    var durr = (new Date()).getTime() - lastOver;
                    if (durr > self.options.anchorPreviewHideDelay) {
                        // hide the preview 1/2 second after mouse leaves the link
                        self.hideAnchorPreview();

                        // cleanup
                        clearInterval(interval_timer);
                        self.off(self.anchorPreview, 'mouseover', stamp);
                        self.off(self.anchorPreview, 'mouseout', unstamp);
                        self.off(anchorEl, 'mouseover', stamp);
                        self.off(anchorEl, 'mouseout', unstamp);

                    }
                }, 200);

            this.on(self.anchorPreview, 'mouseover', stamp);
            this.on(self.anchorPreview, 'mouseout', unstamp);
            this.on(anchorEl, 'mouseover', stamp);
            this.on(anchorEl, 'mouseout', unstamp);
        },

        createAnchorPreview: function () {
            var self = this,
                anchorPreview = this.options.ownerDocument.createElement('div');

            anchorPreview.id = 'medium-editor-anchor-preview-' + this.id;
            anchorPreview.className = 'medium-editor-anchor-preview';
            anchorPreview.innerHTML = this.anchorPreviewTemplate();
            this.options.elementsContainer.appendChild(anchorPreview);

            this.on(anchorPreview, 'click', function () {
                self.anchorPreviewClickHandler();
            });

            return anchorPreview;
        },

        anchorPreviewTemplate: function () {
            return '<div class="medium-editor-toolbar-anchor-preview" id="medium-editor-toolbar-anchor-preview">' +
                '    <i class="medium-editor-toolbar-anchor-preview-inner"></i>' +
                '</div>';
        },

        anchorPreviewClickHandler: function (e) {
            if (this.activeAnchor) {

                var self = this,
                    range = this.options.ownerDocument.createRange(),
                    sel = this.options.contentWindow.getSelection();

                range.selectNodeContents(self.activeAnchor);
                sel.removeAllRanges();
                sel.addRange(range);
                setTimeout(function () {
                    if (self.activeAnchor) {
                        self.showAnchorForm(self.activeAnchor.href);
                    }
                    self.keepToolbarAlive = false;
                }, 100 + self.options.delay);

            }

            this.hideAnchorPreview();
        },

        editorAnchorObserver: function (e) {
            var self = this,
                overAnchor = true,
                leaveAnchor = function () {
                    // mark the anchor as no longer hovered, and stop listening
                    overAnchor = false;
                    self.off(self.activeAnchor, 'mouseout', leaveAnchor);
                };

            if (e.target && e.target.tagName.toLowerCase() === 'a') {

                // Detect empty href attributes
                // The browser will make href="" or href="#top"
                // into absolute urls when accessed as e.targed.href, so check the html
                if (!/href=["']\S+["']/.test(e.target.outerHTML) || /href=["']#\S+["']/.test(e.target.outerHTML)) {
                    return true;
                }

                // only show when hovering on anchors
                if (this.toolbar.classList.contains('medium-editor-toolbar-active')) {
                    // only show when toolbar is not present
                    return true;
                }
                this.activeAnchor = e.target;
                this.on(this.activeAnchor, 'mouseout', leaveAnchor);
                // show the anchor preview according to the configured delay
                // if the mouse has not left the anchor tag in that time
                setTimeout(function () {
                    if (overAnchor) {
                        self.showAnchorPreview(e.target);
                    }
                }, self.options.delay);


            }
        },

        bindAnchorPreview: function (index) {
            var i, self = this;
            this.editorAnchorObserverWrapper = function (e) {
                self.editorAnchorObserver(e);
            };
            for (i = 0; i < this.elements.length; i += 1) {
                this.on(this.elements[i], 'mouseover', this.editorAnchorObserverWrapper);
            }
            return this;
        },

        checkLinkFormat: function (value) {
            var re = /^(https?|ftps?|rtmpt?):\/\/|mailto:/;
            return (re.test(value) ? '' : 'http://') + value;
        },

        setTargetBlank: function (el) {
            var i;
            el = el || getSelectionStart.call(this);
            if (el.tagName.toLowerCase() === 'a') {
                el.target = '_blank';
            } else {
                el = el.getElementsByTagName('a');

                for (i = 0; i < el.length; i += 1) {
                    el[i].target = '_blank';
                }
            }
        },

        setButtonClass: function (buttonClass) {
            var el = getSelectionStart.call(this),
                classes = buttonClass.split(' '),
                i, j;
            if (el.tagName.toLowerCase() === 'a') {
                for (j = 0; j < classes.length; j += 1) {
                    el.classList.add(classes[j]);
                }
            } else {
                el = el.getElementsByTagName('a');
                for (i = 0; i < el.length; i += 1) {
                    for (j = 0; j < classes.length; j += 1) {
                        el[i].classList.add(classes[j]);
                    }
                }
            }
        },

        createLink: function (input, target, buttonClass) {
            var i, event;

            if (input.value.trim().length === 0) {
                this.hideToolbarActions();
                return;
            }

            restoreSelection.call(this, this.savedSelection);

            if (this.options.checkLinkFormat) {
                input.value = this.checkLinkFormat(input.value);
            }

            this.options.ownerDocument.execCommand('createLink', false, input.value);

            if (this.options.targetBlank || target === "_blank") {
                this.setTargetBlank();
            }

            if (buttonClass) {
                this.setButtonClass(buttonClass);
            }

            if (this.options.targetBlank || target === "_blank" || buttonClass) {
                event = this.options.ownerDocument.createEvent("HTMLEvents");
                event.initEvent("input", true, true, this.options.contentWindow);
                for (i = 0; i < this.elements.length; i += 1) {
                    this.elements[i].dispatchEvent(event);
                }
            }

            this.checkSelection();
            this.showToolbarActions();
            input.value = '';
        },

        bindWindowActions: function () {
            var timerResize,
                self = this;
            this.windowResizeHandler = function () {
                clearTimeout(timerResize);
                timerResize = setTimeout(function () {
                    if (self.toolbar && self.toolbar.classList.contains('medium-editor-toolbar-active')) {
                        self.setToolbarPosition();
                    }
                }, 100);
            };
            this.on(this.options.contentWindow, 'resize', this.windowResizeHandler);
            return this;
        },

        activate: function () {
            if (this.isActive) {
                return;
            }

            this.setup();
        },

        // TODO: break method
        deactivate: function () {
            var i;
            if (!this.isActive) {
                return;
            }
            this.isActive = false;

            if (this.toolbar !== undefined) {
                this.options.elementsContainer.removeChild(this.anchorPreview);
                this.options.elementsContainer.removeChild(this.toolbar);
                delete this.toolbar;
                delete this.anchorPreview;
            }

            for (i = 0; i < this.elements.length; i += 1) {
                this.elements[i].removeAttribute('contentEditable');
                this.elements[i].removeAttribute('data-medium-element');
            }

            this.removeAllEvents();
        },

        htmlEntities: function (str) {
            // converts special characters (like <) into their escaped/encoded values (like &lt;).
            // This allows you to show to display the string without the browser reading it as HTML.
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        },

        bindPaste: function () {
            var i, self = this;
            this.pasteWrapper = function (e) {
                var paragraphs,
                    html = '',
                    p;

                this.classList.remove('medium-editor-placeholder');
                if (!self.options.forcePlainText && !self.options.cleanPastedHTML) {
                    return this;
                }

                if (e.clipboardData && e.clipboardData.getData && !e.defaultPrevented) {
                    e.preventDefault();

                    if (self.options.cleanPastedHTML && e.clipboardData.getData('text/html')) {
                        return self.cleanPaste(e.clipboardData.getData('text/html'));
                    }
                    if (!(self.options.disableReturn || this.getAttribute('data-disable-return'))) {
                        paragraphs = e.clipboardData.getData('text/plain').split(/[\r\n]/g);
                        for (p = 0; p < paragraphs.length; p += 1) {
                            if (paragraphs[p] !== '') {
                                if (navigator.userAgent.match(/firefox/i) && p === 0) {
                                    html += self.htmlEntities(paragraphs[p]);
                                } else {
                                    html += '<p>' + self.htmlEntities(paragraphs[p]) + '</p>';
                                }
                            }
                        }
                        self.options.ownerDocument.execCommand('insertHTML', false, html);
                    } else {
                        html = self.htmlEntities(e.clipboardData.getData('text/plain'));
                        self.options.ownerDocument.execCommand('insertHTML', false, html);
                    }
                }
            };
            for (i = 0; i < this.elements.length; i += 1) {
                this.on(this.elements[i], 'paste', this.pasteWrapper);
            }
            return this;
        },

        setPlaceholders: function () {
            var i,
                activatePlaceholder = function (el) {
                    if (!(el.querySelector('img')) &&
                            !(el.querySelector('blockquote')) &&
                            el.textContent.replace(/^\s+|\s+$/g, '') === '') {
                        el.classList.add('medium-editor-placeholder');
                    }
                },
                placeholderWrapper = function (e) {
                    this.classList.remove('medium-editor-placeholder');
                    if (e.type !== 'keypress') {
                        activatePlaceholder(this);
                    }
                };
            for (i = 0; i < this.elements.length; i += 1) {
                activatePlaceholder(this.elements[i]);
                this.on(this.elements[i], 'blur', placeholderWrapper);
                this.on(this.elements[i], 'keypress', placeholderWrapper);
            }
            return this;
        },

        cleanPaste: function (text) {

            /*jslint regexp: true*/
            /*
                jslint does not allow character negation, because the negation
                will not match any unicode characters. In the regexes in this
                block, negation is used specifically to match the end of an html
                tag, and in fact unicode characters *should* be allowed.
            */
            var i, elList, workEl,
                el = this.getSelectionElement(),
                multiline = /<p|<br|<div/.test(text),
                replacements = [

                    // replace two bogus tags that begin pastes from google docs
                    [new RegExp(/<[^>]*docs-internal-guid[^>]*>/gi), ""],
                    [new RegExp(/<\/b>(<br[^>]*>)?$/gi), ""],

                     // un-html spaces and newlines inserted by OS X
                    [new RegExp(/<span class="Apple-converted-space">\s+<\/span>/g), ' '],
                    [new RegExp(/<br class="Apple-interchange-newline">/g), '<br>'],

                    // replace google docs italics+bold with a span to be replaced once the html is inserted
                    [new RegExp(/<span[^>]*(font-style:italic;font-weight:bold|font-weight:bold;font-style:italic)[^>]*>/gi), '<span class="replace-with italic bold">'],

                    // replace google docs italics with a span to be replaced once the html is inserted
                    [new RegExp(/<span[^>]*font-style:italic[^>]*>/gi), '<span class="replace-with italic">'],

                    //[replace google docs bolds with a span to be replaced once the html is inserted
                    [new RegExp(/<span[^>]*font-weight:bold[^>]*>/gi), '<span class="replace-with bold">'],

                     // replace manually entered b/i/a tags with real ones
                    [new RegExp(/&lt;(\/?)(i|b|a)&gt;/gi), '<$1$2>'],

                     // replace manually a tags with real ones, converting smart-quotes from google docs
                    [new RegExp(/&lt;a\s+href=(&quot;|&rdquo;|&ldquo;|“|”)([^&]+)(&quot;|&rdquo;|&ldquo;|“|”)&gt;/gi), '<a href="$2">']

                ];
            /*jslint regexp: false*/

            for (i = 0; i < replacements.length; i += 1) {
                text = text.replace(replacements[i][0], replacements[i][1]);
            }

            if (multiline) {

                // double br's aren't converted to p tags, but we want paragraphs.
                elList = text.split('<br><br>');

                this.pasteHTML('<p>' + elList.join('</p><p>') + '</p>');
                this.options.ownerDocument.execCommand('insertText', false, "\n");

                // block element cleanup
                elList = el.querySelectorAll('a,p,div,br');
                for (i = 0; i < elList.length; i += 1) {

                    workEl = elList[i];

                    switch (workEl.tagName.toLowerCase()) {
                    case 'a':
                        if (this.options.targetBlank){
                          this.setTargetBlank(workEl);
                        }
                        break;
                    case 'p':
                    case 'div':
                        this.filterCommonBlocks(workEl);
                        break;
                    case 'br':
                        this.filterLineBreak(workEl);
                        break;
                    }

                }


            } else {

                this.pasteHTML(text);

            }

        },

        pasteHTML: function (html) {
            var elList, workEl, i, fragmentBody, pasteBlock = this.options.ownerDocument.createDocumentFragment();

            pasteBlock.appendChild(this.options.ownerDocument.createElement('body'));

            fragmentBody = pasteBlock.querySelector('body');
            fragmentBody.innerHTML = html;

            this.cleanupSpans(fragmentBody);

            elList = fragmentBody.querySelectorAll('*');
            for (i = 0; i < elList.length; i += 1) {

                workEl = elList[i];

                // delete ugly attributes
                workEl.removeAttribute('class');
                workEl.removeAttribute('style');
                workEl.removeAttribute('dir');

                if (workEl.tagName.toLowerCase() === 'meta') {
                    workEl.parentNode.removeChild(workEl);
                }

            }
            this.options.ownerDocument.execCommand('insertHTML', false, fragmentBody.innerHTML.replace(/&nbsp;/g, ' '));
        },
        isCommonBlock: function (el) {
            return (el && (el.tagName.toLowerCase() === 'p' || el.tagName.toLowerCase() === 'div'));
        },
        filterCommonBlocks: function (el) {
            if (/^\s*$/.test(el.innerText)) {
                el.parentNode.removeChild(el);
            }
        },
        filterLineBreak: function (el) {
            if (this.isCommonBlock(el.previousElementSibling)) {

                // remove stray br's following common block elements
                el.parentNode.removeChild(el);

            } else if (this.isCommonBlock(el.parentNode) && (el.parentNode.firstChild === el || el.parentNode.lastChild === el)) {

                // remove br's just inside open or close tags of a div/p
                el.parentNode.removeChild(el);

            } else if (el.parentNode.childElementCount === 1) {

                // and br's that are the only child of a div/p
                this.removeWithParent(el);

            }

        },

        // remove an element, including its parent, if it is the only element within its parent
        removeWithParent: function (el) {
            if (el && el.parentNode) {
                if (el.parentNode.parentNode && el.parentNode.childElementCount === 1) {
                    el.parentNode.parentNode.removeChild(el.parentNode);
                } else {
                    el.parentNode.removeChild(el.parentNode);
                }
            }
        },

        cleanupSpans: function (container_el) {

            var i,
                el,
                new_el,
                spans = container_el.querySelectorAll('.replace-with');

            for (i = 0; i < spans.length; i += 1) {

                el = spans[i];
                new_el = this.options.ownerDocument.createElement(el.classList.contains('bold') ? 'b' : 'i');

                if (el.classList.contains('bold') && el.classList.contains('italic')) {

                    // add an i tag as well if this has both italics and bold
                    new_el.innerHTML = '<i>' + el.innerHTML + '</i>';

                } else {

                    new_el.innerHTML = el.innerHTML;

                }
                el.parentNode.replaceChild(new_el, el);

            }

            spans = container_el.querySelectorAll('span');
            for (i = 0; i < spans.length; i += 1) {

                el = spans[i];

                // remove empty spans, replace others with their contents
                if (/^\s*$/.test()) {
                    el.parentNode.removeChild(el);
                } else {
                    el.parentNode.replaceChild(this.options.ownerDocument.createTextNode(el.innerText), el);
                }

            }

        }

    };

}(window, document));

/*! 
 * medium-editor-insert-plugin v0.3.2 - jQuery insert plugin for MediumEditor
 *
 * https://github.com/orthes/medium-editor-insert-plugin
 * 
 * Copyright (c) 2014 Pavel Linkesch (http://linkesch.sk)
 * Released under the MIT license
 */

/* global MediumEditor */

(function ($) {
  /*
  * Private storage of registered addons
  */
  var addons = {};

  /**
  * Extend MediumEditor functions if the editor exists
  */
  if (MediumEditor && typeof(MediumEditor) === "function") {
      /**
      * Extend MediumEditor's serialize function to get rid of unnecesarry Medium Editor Insert Plugin stuff
      *
      * @return {object} content Object containing HTML content of each element
      */

      MediumEditor.prototype.serialize = function () {
        var i, j,
            elementid,
            content = {},
            $clone, $inserts, $insert, $insertData, html;
        for (i = 0; i < this.elements.length; i += 1) {
          elementid = (this.elements[i].id !== '') ? this.elements[i].id : 'element-' + i;

          $clone = $(this.elements[i]).clone();
          $inserts = $('.mediumInsert', $clone);
          for (j = 0; j < $inserts.length; j++) {
            $insert = $($inserts[j]);
            $insertData = $('.mediumInsert-placeholder', $insert).children();
            if ($insertData.length === 0) {
              $insert.remove();
            } else {
              $insert.removeAttr('contenteditable');
              $('img[draggable]', $insert).removeAttr('draggable');
              if ($insert.hasClass('small')) {
                $insertData.addClass('small');
              }
              $('.mediumInsert-buttons', $insert).remove();
              $insertData.unwrap();
            }
          }

          html = $clone.html().trim();
          content[elementid] = {
            value: html
          };
        }
        return content;
      };

      /**
      * Extend MediumEditor's deactivate function to call $.fn.mediumInsert.insert.disable function
      *
      * @return {void}
      */

      MediumEditor.prototype.deactivate = function () {
        var i;
        if (!this.isActive) {
          return false;
        }
        this.isActive = false;

        if (this.toolbar !== undefined) {
          this.toolbar.style.display = 'none';
        }

        document.documentElement.removeEventListener('mouseup', this.checkSelectionWrapper);

        for (i = 0; i < this.elements.length; i += 1) {
          this.elements[i].removeEventListener('keyup', this.checkSelectionWrapper);
          this.elements[i].removeEventListener('blur', this.checkSelectionWrapper);
          this.elements[i].removeAttribute('contentEditable');
        }

        if ($.fn.mediumInsert.insert.$el)
          $.fn.mediumInsert.insert.$el.mediumInsert('disable');
      };

      /**
      * Extend MediumEditor's activate function to call $.fn.mediumInsert.insert.enable function
      *
      * @return {void}
      */

      MediumEditor.prototype.activate = function () {
        var i;
        if (this.isActive) {
          return false;
        }

        if (this.toolbar !== undefined) {
          this.toolbar.style.display = 'block';
        }

        this.isActive = true;
        for (i = 0; i < this.elements.length; i += 1) {
          this.elements[i].setAttribute('contentEditable', true);
        }
        this.bindSelect();

        if ($.fn.mediumInsert.insert.$el)
          $.fn.mediumInsert.insert.$el.mediumInsert('enable');
      };
  }

  /**
  * Medium Editor Insert Plugin
  *
  * @param {object} options Options for the plugin
  * @param {void}
  */

  $.fn.mediumInsert = function (options) {

    if (typeof options === 'string' && $.fn.mediumInsert.insert[options]) {
      $.fn.mediumInsert.insert[options]();
    } else {
      $.fn.mediumInsert.settings = $.extend($.fn.mediumInsert.settings, options);



      /**
      * Initial plugin loop
      */

      return this.each(function () {
        $(this).addClass('medium-editor-insert-plugin');

        var blocks = 'p, h1, h2, h3, h4, h5, h6, ol, ul, blockquote';
        $(this).on('dragover drop', blocks, function (e) {
          e.preventDefault();
          return false;
        });

        $.fn.mediumInsert.insert.init($(this));

        $.each($.fn.mediumInsert.settings.addons, function (i) {
          if (typeof addons[i] !== 'undefined') {
            var addonOptions = $.fn.mediumInsert.settings.addons[i];
            addonOptions.$el = $.fn.mediumInsert.insert.$el;
            addons[i].init(addonOptions);
          }
        });
      });
    }
  };


  /**
  * Settings
  */
  $.fn.mediumInsert.settings = {
    enabled: true,
    beginning: false,
    addons: {
      images: {},
      embeds: {}
    }
  };

  /**
  * Register new addon
  */
  $.fn.mediumInsert.registerAddon = function(name, addon){
    addons[name] = addon;
  };

  /**
  * Get registered addon
  */
  $.fn.mediumInsert.getAddon = function(name){
    return addons[name];
  };


  /**
  * Addon Initialization
  */

  $.fn.mediumInsert.insert = {

    /**
    * Insert initial function
    *
    * @param {element} el Parent container element
    * @return {void}
    */

    init: function ($el) {
      this.$el = $el;
      this.isFirefox = navigator.userAgent.match(/firefox/i);
      this.setPlaceholders();
      this.setEvents();
    },

    /**
    * Deselect selected text
    *
    * @return {void}
    */

    deselect: function () {
      document.getSelection().removeAllRanges();
    },

    /**
    * Disable the plugin
    *
    * @return {void}
    */

    disable: function () {
      $.fn.mediumInsert.settings.enabled = false;

      $.fn.mediumInsert.insert.$el.find('.mediumInsert-buttons').addClass('hide');
    },

    /**
    * Enable the plugin
    *
    * @return {void}
    */

    enable: function () {
      $.fn.mediumInsert.settings.enabled = true;

      $.fn.mediumInsert.insert.$el.find('.mediumInsert-buttons').removeClass('hide');
    },

    /**
    * Return max id in #mediumInsert-*
    *
    * @return {int} max (Max number, -1 if no placeholders exist)
    */
    getMaxId: function () {
      var max = -1;

      $('div[id^="mediumInsert-"]').each(function () {
        var id = parseInt($(this).attr('id').split('-')[1], 10);
        if (id > max) {
          max = id;
        }
      });

      return max;
    },

    /**
    * Return insert buttons optionally filtered by addon name
    *
    * @param {string} addon Addon name of addon to display only
    * @return {void}
    */
    getButtons: function (addon) {
      var editor = $.fn.mediumInsert.settings.editor,
          buttonLabels = (editor && editor.options) ? editor.options.buttonLabels : '';

      var buttons;
      if($.fn.mediumInsert.settings.enabled) {
      buttons = '<div class="mediumInsert-buttons">'+
            '<a class="mediumInsert-buttonsShow">+</a>'+
            '<ul class="mediumInsert-buttonsOptions medium-editor-toolbar medium-editor-toolbar-active">';
      } else {
      buttons = '<div class="mediumInsert-buttons hide">'+
            '<a class="mediumInsert-buttonsShow">+</a>'+
            '<ul class="mediumInsert-buttonsOptions medium-editor-toolbar medium-editor-toolbar-active">';
      }

      if (Object.keys($.fn.mediumInsert.settings.addons).length === 0) {
        return false;
      }

      if (typeof addon === 'undefined') {
        $.each($.fn.mediumInsert.settings.addons, function (i) {
          if (typeof addons[i] === 'undefined') {
            console.log('Addon "' + i + '" is not available. Did you forgot to include the related file?');
          } else {
            buttons += '<li>' + addons[i].insertButton(buttonLabels) + '</li>';
          }
        });
      } else {
        buttons += '<li>' + addons[addon].insertButton(buttonLabels) + '</li>';
      }

      buttons += '</ul></div>';

      return buttons;
    },

    /**
    * Method setting placeholders
    *
    * @return {void}
    */

    setPlaceholders: function () {
      var that = this,
          $el = $.fn.mediumInsert.insert.$el,
          insertBlock = this.getButtons(),
          $firstEl;

      if (insertBlock === false) {
        return false;
      }

      insertBlock = '<div class="mediumInsert" contenteditable="false">'+
        insertBlock +
        '<div class="mediumInsert-placeholder"></div>'+
      '</div>';

      if ($el.is(':empty')) {
        $el.html('<p><br></p>');
      }

      $el.keyup(function () {
        var $lastChild = $el.children(':last'),
            i;

        // Fix #39
        // After deleting all content (ctrl+A and delete) in Firefox, all content is deleted and only <br> appears
        // To force placeholder to appear, set <p><br></p> as content of the $el
        if ($el.html() === '' || $el.html() === '<br>') {
          $el.html('<p><br></p>');
        }

        if ($lastChild.hasClass('mediumInsert') && $lastChild.find('.mediumInsert-placeholder').children().length > 0) {
          $el.append('<p><br></p>');
        }

        // Fix not deleting placeholder in Firefox
        // by removing all empty placeholders
        if (that.isFirefox){
          $('.mediumInsert .mediumInsert-placeholder:empty', $el).each(function () {
            $(this).parent().remove();
          });
        }

        i = that.getMaxId() +1;

        var blocks = 'p, h1, h2, h3, h4, h5, h6, ol, ul, blockquote';

        if ($.fn.mediumInsert.settings.beginning) {
          $firstEl = $el.children(blocks).first();
          if ($firstEl.prev().hasClass('mediumInsert') === false) {
            $firstEl.before(insertBlock);
            $firstEl.prev('.mediumInsert').attr('id', 'mediumInsert-'+ i).addClass('mediumInsert-first');
            i++;
          }
        }

        $el.children(blocks).each(function () {
          if ($(this).next().hasClass('mediumInsert') === false) {
            $(this).after(insertBlock);
            $(this).next('.mediumInsert').attr('id', 'mediumInsert-'+ i);
          }
          i++;
        });

      }).keyup();
    },


    /**
    * Set events on placeholders
    *
    * @return {void}
    */

    setEvents: function () {
      var that = this,
          $el = $.fn.mediumInsert.insert.$el;

      $el.on('selectstart mousedown', '.mediumInsert', function (e) {
        if ($(e.target).is('img') === false) {
          e.preventDefault();
        }
      });

      $el.on('blur', function () {
        var $clone = $(this).clone(),
            cloneHtml;

        $clone.find('.mediumInsert').remove();
        cloneHtml = $clone.html().replace(/^\s+|\s+$/g, '');

        if (cloneHtml === '' || cloneHtml === '<p><br></p>') {
          $(this).addClass('medium-editor-placeholder');
        }
      });


      // Fix #29
      // Sometimes in Firefox when you hit enter, <br type="_moz"> appears instead of <p><br></p>
      // If it happens, force to wrap the <br> into a paragraph
      $el.on('keypress', function (e) {
        if (that.isFirefox) {
          if (e.keyCode === 13) {
            //wrap content text in p to avoid firefox problems
            $el.contents().each((function() {
              return function(index, field) {
                if (field.nodeName === '#text' && field.textContent.trim() !== '') {
                  document.execCommand('insertHTML', false, "<p>" + field.data + "</p>");
                  return field.remove();
                }
              };
            })(this));
            // Removed because of #94 issue
            //
            // Firefox add extra br tag inside p tag
            // var latestPTag = $el.find('p').last();
            // if (latestPTag.text().length > 0) {
            //   latestPTag.find('br').remove();
            // }
          }
        }
      });

      // Fix #39
      // For some reason Chrome doesn't "select-all", when the last placeholder is visible.
      // So it's needed to hide it when the user "selects all", and show it again when they presses any other key.
      $el.on('keydown', function (e) {
        // Fix Select-all using (ctrl + a) in chrome
        if (navigator.userAgent.match(/chrome/i)) {
          $el.children().last().removeClass('hide');
          if ( (e.ctrlKey || e.metaKey) && e.which === 65) {
            e.preventDefault();
            if($el.find('p').text().trim().length === 0) {
              return false;
            }

            $el.children().last().addClass('hide');
            return document.execCommand('selectAll', false, null);
          }
        }
      });

      $el.on('click', '.mediumInsert-buttons a.mediumInsert-buttonsShow', function () {
        var $options = $(this).siblings('.mediumInsert-buttonsOptions'),
            $placeholder = $(this).parent().siblings('.mediumInsert-placeholder');

        if ($(this).hasClass('active')) {
          $(this).removeClass('active');
          $options.hide();

          $('a', $options).show();
        } else {
          $(this).addClass('active');
          $options.show();

          $('a', $options).each(function () {
            var aClass = $(this).attr('class').split('action-')[1],
                plugin = aClass.split('-')[0];
            if ($('.mediumInsert-'+ plugin, $placeholder).length > 0) {
              $('a:not(.action-'+ aClass +')', $options).hide();
            }
          });
        }

        that.deselect();
      });

      $el.on('mouseleave', '.mediumInsert', function () {
        $('a.mediumInsert-buttonsShow', this).removeClass('active');
        $('.mediumInsert-buttonsOptions', this).hide();
      });

      $el.on('click', '.mediumInsert-buttons .mediumInsert-action', function (e) {
        e.preventDefault();

        var addon = $(this).data('addon'),
            action = $(this).data('action'),
            $placeholder = $(this).parents('.mediumInsert-buttons').siblings('.mediumInsert-placeholder');

        if (addons[addon] && addons[addon][action]) {
          addons[addon][action]($placeholder);
        }

        $(this).parents('.mediumInsert').mouseleave();
      });
    }

  };

}(jQuery));

/*! 
 * medium-editor-insert-plugin v0.3.2 - jQuery insert plugin for MediumEditor
 *
 * https://github.com/orthes/medium-editor-insert-plugin
 * 
 * Copyright (c) 2014 Pavel Linkesch (http://linkesch.sk)
 * Released under the MIT license
 */

(function ($) {

  $.fn.mediumInsert.registerAddon('images', {

    /**
    * Images default options
    */

    defaults: {
      /**
      * Active or inactive image's drag and drop
      */
      useDragAndDrop: true,

      /**
      * Relative path to a script that handles file uploads
      */
      imagesUploadScript: 'upload.php',

      /**
      * Relative path to a script that handles file deleting
      */
      imagesDeleteScript: 'delete.php',
      
      /**
      * Placeeholder text for inserting link
      */
      urlPlaceholder: 'Paste or type a link',

      /**
      * Format data before sending them to server while uploading an image
      *
      * @param {File} file File to upload
      * @return {object} formData FormData instance
      */
      formatData: function (file) {
        var formData = new FormData();
        formData.append('file', file);
        return formData;
      },

      /**
      * Upload single file
      *
      * @param {element} $placeholder Placeholder to add image to
      * @param {File} file File to upload
      * @param {object} that Context
      * @param {void}
      */
      uploadFile: function ($placeholder, file, that) {
        $.ajax({
          type: "post",
          url: that.options.imagesUploadScript,
          xhr: function () {
            var xhr = new XMLHttpRequest();
            xhr.upload.onprogress = that.updateProgressBar;
            return xhr;
          },
          cache: false,
          contentType: false,
          complete: function (jqxhr) {
            that.uploadCompleted(jqxhr, $placeholder);
          },
          processData: false,
          data: that.options.formatData(file)
        });
      },

      /**
      * Makes ajax call for deleting a file on a server
      *
      * @param {string} file File name
      * @param {object} that Context
      * @return {void}
      */
      deleteFile: function (file, that) {
        $.ajax({
          type: "post",
          url: that.options.imagesDeleteScript,
          data: {
            file: file
          }
        });
      }
    },


    /**
    * Images initial function
    *
    * @param {object} options Options to overide defaults
    * @return {void}
    */

    init: function (options) {
      if (options && options.$el) {
        this.$el = options.$el;
      }
      this.options = $.extend(this.defaults, options);

      this.setImageEvents();

      if (this.options.useDragAndDrop === true){
        this.setDragAndDropEvents();
      }

      this.preparePreviousImages();

    },


    /**
    * Returns insert button
    *
    * @param {string} buttonLabels
    * @return {string}
    */

    insertButton: function(buttonLabels){
      var label = 'Img';
      if (buttonLabels === 'fontawesome' || typeof buttonLabels === 'object' && !!(buttonLabels.fontawesome)) {
        label = '<i class="fa fa-picture-o"></i>';
      }
      
      if (typeof buttonLabels === 'object' && buttonLabels.img) {
        label = buttonLabels.img;
      }

      return '<button data-addon="images" data-action="add" class="medium-editor-action mediumInsert-action">'+label+'</button>';
    },

    /**
    * Make existing images interactive
    *
    * @return {void}
    */

    preparePreviousImages: function () {
      this.$el.find('.mediumInsert-images').each(function() {
        var $parent = $(this).parent();
        if (!$parent.hasClass('mediumInsert-placeholder')) {
          $parent.html($.fn.mediumInsert.insert.getButtons('images') +
            '<div class="mediumInsert-placeholder" draggable="true">' + $parent.html() + '</div>'
          );
        }
      });
    },

    /**
    * Add image to placeholder
    *
    * @param {element} $placeholder Placeholder to add image to
    * @return {element} $selectFile <input type="file"> element
    */

    add: function ($placeholder) {
      var that = this,
          $selectFile, files;

      $selectFile = $('<input type="file" multiple="multiple">').click();
      $selectFile.change(function () {
        files = this.files;
        that.uploadFiles($placeholder, files, that);
      });

      $.fn.mediumInsert.insert.deselect();

      return $selectFile;
    },

    /**
    * Update progressbar while upload
    *
    * @param {event} e XMLHttpRequest.upload.onprogress event
    * @return {void}
    */

    updateProgressBar: function (e) {
      var $progress = $('.progress:first', this.$el),
          complete;

      if (e.lengthComputable) {
        complete = e.loaded / e.total * 100;
        complete = complete ? complete : 0;
        $progress.attr('value', complete);
        $progress.html(complete);
      }
    },

    /**
    * Show uploaded image after upload completed
    *
    * @param {jqXHR} jqxhr jqXHR object
    * @return {void}
    */

    uploadCompleted: function (jqxhr, $placeholder) {
      var $progress = $('.progress:first', $placeholder),
          $img;

      $progress.attr('value', 100);
      $progress.html(100);

      if (jqxhr.responseText) {
        $progress.before('<figure class="mediumInsert-images"><img src="'+ jqxhr.responseText +'" draggable="true" alt=""></figure>');
        $img = $progress.siblings('img');

        $img.load(function () {
          $img.parent().mouseleave().mouseenter();
        });
      } else {
        $progress.before('<div class="mediumInsert-error">There was a problem uploading the file.</div>');

        setTimeout(function () {
          $('.mediumInsert-error:first', $placeholder).fadeOut(function () {
            $(this).remove();
          });
        }, 3000);
      }

      $progress.remove();

      $placeholder.closest('[data-medium-element]').trigger('keyup').trigger('input');
    },

    /**
    * Upload single file
    *
    * @param {element} $placeholder Placeholder to add image to
    * @param {File} file File to upload
    * @param {object} that Context
    * @param {void}
    */

    uploadFile: function ($placeholder, file, that) {
      return that.options.uploadFile($placeholder, file, that);
    },

    /**
    * Lopp though files, check file types and call uploadFile() function on each file that passes
    *
    * @param {element} placeholder Placeholder to add image to
    * @param {FileList} files Files to upload
    * @param {object} that Context
    * @return {void}
    */

    uploadFiles: function ($placeholder, files, that) {
      var acceptedTypes = {
        'image/png': true,
        'image/jpeg': true,
        'image/gif': true
      };

      for (var i = 0; i < files.length; i++) {
        var file = files[i];

        if (acceptedTypes[file.type] === true) {
          $placeholder.append('<progress class="progress" min="0" max="100" value="0">0</progress>');

          that.uploadFile($placeholder, file, that);
        }
      }
    },

    /**
    * Makes ajax call for deleting a file on a server
    *
    * @param {string} file File name
    * @param {object} that Context
    * @return {void}
    */

    deleteFile: function (file, that) {
      return that.options.deleteFile(file, that);
    },

    /**
    * Set image events displaying remove and resize buttons
    *
    * @return {void}
    */

    setImageEvents: function () {
      var that = this;

      this.$el.on('mouseenter', '.mediumInsert-images', function () {
        var $img = $('img', this),
            positionTop,
            positionLeft;

        if ($.fn.mediumInsert.settings.enabled === false) {
          return;
        }

        if ($img.length > 0) {
          $(this).append('<a class="mediumInsert-imageIcon mediumInsert-imageRemove"></a>');

          if ($(this).prevAll().length === 0) {
            if ($(this).parent().parent().hasClass('small')) {
              $(this).append('<a class="mediumInsert-imageIcon mediumInsert-imageResizeBigger"></a>');
            } else {
              $(this).append('<a class="mediumInsert-imageIcon mediumInsert-imageResizeSmaller"></a>');
            }
          }
          
          if ($(this).siblings().length === 0) {  
            if ($img.parent().is('a')) {
              $(this).append('<a class="mediumInsert-imageIcon mediumInsert-imageUnlink"></a>');
            } else {
              $(this).append('<a class="mediumInsert-imageIcon mediumInsert-imageLink"></a>');
            }
          }
          
          positionTop = $img.position().top + parseInt($img.css('margin-top'), 10);
          positionLeft = $img.position().left + $img.width() -30;
          $('.mediumInsert-imageRemove', this).css({
            'right': 'auto',
            'top': positionTop,
            'left': positionLeft
          });
          $('.mediumInsert-imageResizeBigger, .mediumInsert-imageResizeSmaller', this).css({
            'right': 'auto',
            'top': positionTop,
            'left': positionLeft-31
          });
          $('.mediumInsert-imageLink, .mediumInsert-imageUnlink', this).css({
            'right': 'auto',
            'top': positionTop,
            'left': positionLeft-62
          });
        }
      });

      this.$el.on('mouseleave', '.mediumInsert-images', function () {
        $('.mediumInsert-imageIcon', this).remove();
      });

      this.$el.on('click', '.mediumInsert-imageResizeSmaller', function () {
        $(this).parent().parent().parent().addClass('small');
        $(this).parent().mouseleave().mouseleave();

        $.fn.mediumInsert.insert.deselect();
        that.$el.trigger('keyup').trigger('input');
      });

      this.$el.on('click', '.mediumInsert-imageResizeBigger', function () {
        $(this).parent().parent().parent().removeClass('small');
        $(this).parent().mouseleave().mouseleave();

        $.fn.mediumInsert.insert.deselect();
        that.$el.trigger('keyup').trigger('input');
      });

      this.$el.on('click', '.mediumInsert-imageRemove', function () {
        var img = $(this).siblings('img').attr('src');

        if ($(this).parent().siblings().length === 0) {
          $(this).parent().parent().parent().removeClass('small');
        }
        $(this).parent().remove();

        that.deleteFile(img, that);

        $.fn.mediumInsert.insert.deselect();

        that.$el.trigger('keyup').trigger('input');
      });
      
      this.$el.on('click', '.mediumInsert-imageLink', function () {
        var $placeholder = $(this).closest('.mediumInsert-placeholder'),
            $formHtml = $('<div class="medium-editor-toolbar medium-editor-toolbar-active medium-editor-toolbar-form-anchor mediumInsert-imageLinkWire" style="display: block;"><input type="text" value="" placeholder="' + that.options.urlPlaceholder + '" class="mediumInsert-imageLinkText medium-editor-toolbar-anchor-input"></div>');
        
        $formHtml.appendTo($placeholder);
        setTimeout(function () {
          $formHtml.find('input').focus();
        }, 50);

        $.fn.mediumInsert.insert.deselect();
      });
      
      this.$el.on('click', '.mediumInsert-imageUnlink', function () {
        var $figure = $(this).closest('.mediumInsert-images');

        $figure.find('img').unwrap();
        
        $(this).removeClass('mediumInsert-imageUnlink')
          .addClass('mediumInsert-imageLink');
          
        that.$el.trigger('keyup').trigger('input');
      });
      
      this.$el
        .on('keypress', '.mediumInsert-imageLinkText', function (e) {
          var $placeholder = $(this).closest('.mediumInsert-placeholder');

          if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
            $placeholder.find('.mediumInsert-images:first').find('img').wrap('<a href="'+ $(this).val() +'" target="_blank"></a>');            
            $placeholder.find('.mediumInsert-imageLink')
              .removeClass('mediumInsert-imageLink')
              .addClass('mediumInsert-imageUnlink');
            
            // Workaround for "Uncaught NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is no longer a child of this node. Perhaps it was moved in a 'blur' event handler?"
            try {  
              $('.mediumInsert-imageLinkWire').remove();
            } catch(err) {}
            
            that.$el.trigger('keyup').trigger('input');
          }
        })
        .on('blur', '.mediumInsert-imageLinkText', function () {
          $('.mediumInsert-imageLinkWire').remove();
        })
        .on('paste', '.mediumInsert-imageLinkText', function (e) {
          if ($.fn.mediumInsert.insert.isFirefox && e.originalEvent.clipboardData) {
            $(this).val(e.originalEvent.clipboardData.getData('text/plain'));
          }
        });
    },

    /**
    * Set drag and drop events
    *
    * @return {void}
    */

    setDragAndDropEvents: function () {
      var that = this,
          dropSuccessful = false,
          dropSort = false,
          dropSortIndex, dropSortParent;

      $(document).on('dragover', 'body', function () {
        if ($.fn.mediumInsert.settings.enabled === false) {
          return;
        }

        that.$el.addClass('hover');
      });

      $(document).on('dragend', 'body', function () {
        if ($.fn.mediumInsert.settings.enabled === false) {
          return;
        }

        that.$el.removeClass('hover');
      });

      this.$el.on('dragover', '.mediumInsert', function () {
        if ($.fn.mediumInsert.settings.enabled === false) {
          return;
        }

        $(this).addClass('hover');
        $(this).attr('contenteditable', true);
      });

      this.$el.on('dragleave', '.mediumInsert', function () {
        if ($.fn.mediumInsert.settings.enabled === false) {
          return;
        }

        $(this).removeClass('hover');
        $(this).attr('contenteditable', false);
      });

      this.$el.on('dragstart', '.mediumInsert .mediumInsert-images img', function () {
        if ($.fn.mediumInsert.settings.enabled === false) {
          return;
        }

        dropSortIndex = $(this).parent().index();
        dropSortParent = $(this).parent().parent().parent().attr('id');
      });

      this.$el.on('dragend', '.mediumInsert .mediumInsert-images img', function (e) {
        if ($.fn.mediumInsert.settings.enabled === false) {
          return;
        }

        if (dropSuccessful === true) {
          if ($(e.originalEvent.target.parentNode).siblings().length === 0) {
            $(e.originalEvent.target.parentNode).parent().parent().removeClass('small');
          }
          $(e.originalEvent.target.parentNode).mouseleave();
          $(e.originalEvent.target.parentNode).remove();
          dropSuccessful = false;
          dropSort = false;

          that.$el.trigger('keyup').trigger('input');
        }
      });

      this.$el.on('dragover', '.mediumInsert .mediumInsert-images img', function (e) {
        if ($.fn.mediumInsert.settings.enabled === false) {
          return;
        }

        e.preventDefault();
      });

      this.$el.on('drop', '.mediumInsert .mediumInsert-images img', function () {
        var index, $dragged, finalIndex;

        if ($.fn.mediumInsert.settings.enabled === false) {
          return;
        }


        if (dropSortParent !== $(this).parent().parent().parent().attr('id')) {
          dropSort = false;
          dropSortIndex = dropSortParent = null;
          return;
        }

        index = parseInt(dropSortIndex, 10);

        // Sort
        $dragged = $(this).parent().parent().find('.mediumInsert-images:nth-child('+ (index+1) +')');
        finalIndex = $(this).parent().index();
        if(index < finalIndex) {
          $dragged.insertAfter($(this).parent());
        } else if(index > finalIndex) {
          $dragged.insertBefore($(this).parent());
        }

        $dragged.mouseleave();

        dropSort = true;
        dropSortIndex = null;

        that.$el.trigger('keyup').trigger('input');
      });

      this.$el.on('drop', '.mediumInsert', function (e) {
        var files;

        e.preventDefault();

        if ($.fn.mediumInsert.settings.enabled === false) {
          return;
        }

        $(this).removeClass('hover');
        that.$el.removeClass('hover');
        $(this).attr('contenteditable', false);

        files = e.originalEvent.dataTransfer.files;
        if (files.length > 0) {
          // File upload
          that.uploadFiles($('.mediumInsert-placeholder', this), files, that);
        } else if (dropSort === true) {
          dropSort = false;
        } else {
          // Image move from block to block
          $('.mediumInsert-placeholder', this).append('<figure class="mediumInsert-images">'+ e.originalEvent.dataTransfer.getData('text/html') +'</figure>');
          $('meta', this).remove();
          dropSuccessful = true;
        }
      });
    }
  });
}(jQuery));
