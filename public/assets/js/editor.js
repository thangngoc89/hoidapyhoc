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

(function() { if (window.define) { var define = window.define; } if (window.require) { var require = window.require; } if (window.jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd) { var define = jQuery.fn.select2.amd.define; var require = jQuery.fn.select2.amd.require; }/**
 * @license almond 0.2.9 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                name = baseParts.concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("almond", function(){});

define('jquery',[],function () {
  var _$ = jQuery || $;

  if (_$ == null && console && console.error) {
    console.error(
      'Select2: An instance of jQuery or a jQuery-compatible library was not ' +
      'found. Make sure that you are including jQuery before Select2 on your ' +
      'web page.'
    );
  }

  return _$;
});

define('select2/utils',[], function () {
  var Utils = {};

  Utils.Extend = function (ChildClass, SuperClass) {
    var __hasProp = {}.hasOwnProperty;

    function BaseConstructor () {
      this.constructor = ChildClass;
    }

    for (var key in SuperClass) {
      if (__hasProp.call(SuperClass, key)) {
        ChildClass[key] = SuperClass[key];
      }
    }

    BaseConstructor.prototype = SuperClass.prototype;
    ChildClass.prototype = new BaseConstructor();
    ChildClass.__super__ = SuperClass.prototype;

    return ChildClass;
  };

  function getMethods (theClass) {
    var proto = theClass.prototype;

    var methods = [];

    for (var methodName in proto) {
      var m = proto[methodName];

      if (typeof m !== 'function') {
        continue;
      }

      if (methodName === 'constructor') {
        continue;
      }

      methods.push(methodName);
    }

    return methods;
  }

  Utils.Decorate = function (SuperClass, DecoratorClass) {
    var decoratedMethods = getMethods(DecoratorClass);
    var superMethods = getMethods(SuperClass);

    function DecoratedClass () {
      var unshift = Array.prototype.unshift;

      var argCount = DecoratorClass.prototype.constructor.length;

      var calledConstructor = SuperClass.prototype.constructor;

      if (argCount > 0) {
        unshift.call(arguments, SuperClass.prototype.constructor);

        calledConstructor = DecoratorClass.prototype.constructor;
      }

      calledConstructor.apply(this, arguments);
    }

    DecoratorClass.displayName = SuperClass.displayName;

    function ctr () {
      this.constructor = DecoratedClass;
    }

    DecoratedClass.prototype = new ctr();

    for (var m = 0; m < superMethods.length; m++) {
        var superMethod = superMethods[m];

        DecoratedClass.prototype[superMethod] =
          SuperClass.prototype[superMethod];
    }

    var calledMethod = function (methodName) {
      // Stub out the original method if it's not decorating an actual method
      var originalMethod = function () {};

      if (methodName in DecoratedClass.prototype) {
        originalMethod = DecoratedClass.prototype[methodName];
      }

      var decoratedMethod = DecoratorClass.prototype[methodName];

      return function () {
        var unshift = Array.prototype.unshift;

        unshift.call(arguments, originalMethod);

        return decoratedMethod.apply(this, arguments);
      };
    };

    for (var d = 0; d < decoratedMethods.length; d++) {
      var decoratedMethod = decoratedMethods[d];

      DecoratedClass.prototype[decoratedMethod] = calledMethod(decoratedMethod);
    }

    return DecoratedClass;
  };

  var Observable = function () {
    this.listeners = {};
  };

  Observable.prototype.on = function (event, callback) {
    this.listeners = this.listeners || {};

    if (event in this.listeners) {
      this.listeners[event].push(callback);
    } else {
      this.listeners[event] = [callback];
    }
  };

  Observable.prototype.trigger = function (event) {
    var slice = Array.prototype.slice;

    this.listeners = this.listeners || {};

    if (event in this.listeners) {
      this.invoke(this.listeners[event], slice.call(arguments, 1));
    }

    if ('*' in this.listeners) {
      this.invoke(this.listeners['*'], arguments);
    }
  };

  Observable.prototype.invoke = function (listeners, params) {
    for (var i = 0, len = listeners.length; i < len; i++) {
      listeners[i].apply(this, params);
    }
  };

  Utils.Observable = Observable;

  Utils.generateChars = function (length) {
    var chars = '';

    for (var i = 0; i < length; i++) {
      var randomChar = Math.floor(Math.random() * 36);
      chars += randomChar.toString(36);
    }

    return chars;
  };

  Utils.bind = function (func, context) {
    return function () {
      func.apply(context, arguments);
    };
  };

  Utils._convertData = function (data) {
    for (var originalKey in data) {
      var keys = originalKey.split('-');

      var dataLevel = data;

      if (keys.length === 1) {
        continue;
      }

      for (var k = 0; k < keys.length; k++) {
        var key = keys[k];

        // Lowercase the first letter
        // By default, dash-separated becomes camelCase
        key = key.substring(0, 1).toLowerCase() + key.substring(1);

        if (!(key in dataLevel)) {
          dataLevel[key] = {};
        }

        if (k == keys.length - 1) {
          dataLevel[key] = data[originalKey];
        }

        dataLevel = dataLevel[key];
      }

      delete data[originalKey];
    }

    return data;
  };

  Utils.hasScroll = function (index, el) {
    // Adapted from the function created by @ShadowScripter
    // and adapted by @BillBarry on the Stack Exchange Code Review website.
    // The original code can be found at
    // http://codereview.stackexchange.com/q/13338
    // and was designed to be used with the Sizzle selector engine.

    var $el = $(el);
    var overflowX = el.style.overflowX;
    var overflowY = el.style.overflowY;

    //Check both x and y declarations
    if (overflowX === overflowY &&
        (overflowY === 'hidden' || overflowY === 'visible')) {
      return false;
    }

    if (overflowX === 'scroll' || overflowY === 'scroll') {
      return true;
    }

    return ($el.innerHeight() < el.scrollHeight ||
      $el.innerWidth() < el.scrollWidth);
  };

  return Utils;
});

define('select2/results',[
  'jquery',
  './utils'
], function ($, Utils) {
  function Results ($element, options, dataAdapter) {
    this.$element = $element;
    this.data = dataAdapter;
    this.options = options;

    Results.__super__.constructor.call(this);
  }

  Utils.Extend(Results, Utils.Observable);

  Results.prototype.render = function () {
    var $results = $(
      '<ul class="select2-results__options" role="tree"></ul>'
    );

    if (this.options.get('multiple')) {
      $results.attr('aria-multiselectable', 'true');
    }

    this.$results = $results;

    return $results;
  };

  Results.prototype.clear = function () {
    this.$results.empty();
  };

  Results.prototype.displayMessage = function (params) {
    this.clear();
    this.hideLoading();

    var $message = $(
      '<li role="treeitem" class="select2-results__option"></li>'
    );

    var message = this.options.get('translations').get(params.message);

    $message.text(message(params.args));

    this.$results.append($message);
  };

  Results.prototype.append = function (data) {
    this.hideLoading();

    var $options = [];

    if (data.results == null || data.results.length === 0) {
      if (this.$results.children().length === 0) {
        this.trigger('results:message', {
          message: 'noResults'
        });
      }

      return;
    }

    data.results = this.sort(data.results);

    for (var d = 0; d < data.results.length; d++) {
      var item = data.results[d];

      var $option = this.option(item);

      $options.push($option);
    }

    this.$results.append($options);
  };

  Results.prototype.position = function ($results, $dropdown) {
    var $resultsContainer = $dropdown.find('.select2-results');
    $resultsContainer.append($results);
  };

  Results.prototype.sort = function (data) {
    var sorter = this.options.get('sorter');

    return sorter(data);
  };

  Results.prototype.setClasses = function () {
    var self = this;

    this.data.current(function (selected) {
      var selectedIds = $.map(selected, function (s) {
        return s.id.toString();
      });

      var $options = self.$results
        .find('.select2-results__option[aria-selected]');

      $options.each(function () {
        var $option = $(this);

        var item = $.data(this, 'data');

        if (item.id != null && selectedIds.indexOf(item.id.toString()) > -1) {
          $option.attr('aria-selected', 'true');
        } else {
          $option.attr('aria-selected', 'false');
        }
      });

      var $selected = $options.filter('[aria-selected=true]');

      // Check if there are any selected options
      if ($selected.length > 0) {
        // If there are selected options, highlight the first
        $selected.first().trigger('mouseenter');
      } else {
        // If there are no selected options, highlight the first option
        // in the dropdown
        $options.first().trigger('mouseenter');
      }
    });
  };

  Results.prototype.showLoading = function (params) {
    this.hideLoading();

    var loadingMore = this.options.get('translations').get('searching');

    var loading = {
      disabled: true,
      loading: true,
      text: loadingMore(params)
    };
    var $loading = this.option(loading);
    $loading.className += ' loading-results';

    this.$results.prepend($loading);
  };

  Results.prototype.hideLoading = function () {
    this.$results.find('.loading-results').remove();
  };

  Results.prototype.option = function (data) {
    var option = document.createElement('li');
    option.className = 'select2-results__option';

    var attrs = {
      'role': 'treeitem',
      'aria-selected': 'false'
    };

    if (data.disabled) {
      delete attrs['aria-selected'];
      attrs['aria-disabled'] = 'true';
    }

    if (data.id == null) {
      delete attrs['aria-selected'];
    }

    if (data._resultId != null) {
      option.id = data._resultId;
    }

    if (data.children) {
      attrs.role = 'group';
      attrs['aria-label'] = data.text;
      delete attrs['aria-selected'];
    }

    for (var attr in attrs) {
      var val = attrs[attr];

      option.setAttribute(attr, val);
    }

    if (data.children) {
      var $option = $(option);

      var label = document.createElement('strong');
      label.className = 'select2-results__group';

      var $label = $(label);
      this.template(data, label);

      var $children = [];

      for (var c = 0; c < data.children.length; c++) {
        var child = data.children[c];

        var $child = this.option(child);

        $children.push($child);
      }

      var $childrenContainer = $('<ul></ul>', {
        'class': 'select2-results__options select2-results__options--nested'
      });

      $childrenContainer.append($children);

      $option.append(label);
      $option.append($childrenContainer);
    } else {
      this.template(data, option);
    }

    $.data(option, 'data', data);

    return option;
  };

  Results.prototype.bind = function (container, $container) {
    var self = this;

    var id = container.id + '-results';

    this.$results.attr('id', id);

    container.on('results:all', function (params) {
      self.clear();
      self.append(params.data);

      if (container.isOpen()) {
        self.setClasses();
      }
    });

    container.on('results:append', function (params) {
      self.append(params.data);

      if (container.isOpen()) {
        self.setClasses();
      }
    });

    container.on('query', function (params) {
      self.showLoading(params);
    });

    container.on('select', function () {
      if (!container.isOpen()) {
        return;
      }

      self.setClasses();
    });

    container.on('unselect', function () {
      if (!container.isOpen()) {
        return;
      }

      self.setClasses();
    });

    container.on('open', function () {
      // When the dropdown is open, aria-expended="true"
      self.$results.attr('aria-expanded', 'true');
      self.$results.attr('aria-hidden', 'false');

      self.setClasses();
      self.ensureHighlightVisible();
    });

    container.on('close', function () {
      // When the dropdown is closed, aria-expended="false"
      self.$results.attr('aria-expanded', 'false');
      self.$results.attr('aria-hidden', 'true');
      self.$results.removeAttr('aria-activedescendant');
    });

    container.on('results:select', function () {
      var $highlighted = self.getHighlightedResults();

      if ($highlighted.length === 0) {
        return;
      }

      var data = $highlighted.data('data');

      if ($highlighted.attr('aria-selected') == 'true') {
        if (self.options.get('multiple')) {
          self.trigger('unselect', {
            data: data
          });
        } else {
          self.trigger('close');
        }
      } else {
        self.trigger('select', {
          data: data
        });
      }
    });

    container.on('results:previous', function () {
      var $highlighted = self.getHighlightedResults();

      var $options = self.$results.find('[aria-selected]');

      var currentIndex = $options.index($highlighted);

      // If we are already at te top, don't move further
      if (currentIndex === 0) {
        return;
      }

      var nextIndex = currentIndex - 1;

      // If none are highlighted, highlight the first
      if ($highlighted.length === 0) {
        nextIndex = 0;
      }

      var $next = $options.eq(nextIndex);

      $next.trigger('mouseenter');

      var currentOffset = self.$results.offset().top;
      var nextTop = $next.offset().top;
      var nextOffset = self.$results.scrollTop() + (nextTop - currentOffset);

      if (nextIndex === 0) {
        self.$results.scrollTop(0);
      } else if (nextTop - currentOffset < 0) {
        self.$results.scrollTop(nextOffset);
      }
    });

    container.on('results:next', function () {
      var $highlighted = self.getHighlightedResults();

      var $options = self.$results.find('[aria-selected]');

      var currentIndex = $options.index($highlighted);

      var nextIndex = currentIndex + 1;

      // If we are at the last option, stay there
      if (nextIndex >= $options.length) {
        return;
      }

      var $next = $options.eq(nextIndex);

      $next.trigger('mouseenter');

      var currentOffset = self.$results.offset().top +
        self.$results.outerHeight(false);
      var nextBottom = $next.offset().top + $next.outerHeight(false);
      var nextOffset = self.$results.scrollTop() + nextBottom - currentOffset;

      if (nextIndex === 0) {
        self.$results.scrollTop(0);
      } else if (nextBottom > currentOffset) {
        self.$results.scrollTop(nextOffset);
      }
    });

    container.on('results:focus', function (params) {
      params.element.addClass('select2-results__option--highlighted');
    });

    container.on('results:message', function (params) {
      self.displayMessage(params);
    });

    if ($.fn.mousewheel) {
      this.$results.on('mousewheel', function (e) {
        var top = self.$results.scrollTop();

        var bottom = (
          self.$results.get(0).scrollHeight -
          self.$results.scrollTop() +
          e.deltaY
        );

        var isAtTop = e.deltaY > 0 && top - e.deltaY <= 0;
        var isAtBottom = e.deltaY < 0 && bottom <= self.$results.height();

        if (isAtTop) {
          self.$results.scrollTop(0);

          e.preventDefault();
          e.stopPropagation();
        } else if (isAtBottom) {
          self.$results.scrollTop(
            self.$results.get(0).scrollHeight - self.$results.height()
          );

          e.preventDefault();
          e.stopPropagation();
        }
      });
    }

    this.$results.on('mouseup', '.select2-results__option[aria-selected]',
      function (evt) {
      var $this = $(this);

      var data = $this.data('data');

      if ($this.attr('aria-selected') === 'true') {
        if (self.options.get('multiple')) {
          self.trigger('unselect', {
            originalEvent: evt,
            data: data
          });
        } else {
          self.trigger('close');
        }

        return;
      }

      self.trigger('select', {
        originalEvent: evt,
        data: data
      });
    });

    this.$results.on('mouseenter', '.select2-results__option[aria-selected]',
      function (evt) {
      var data = $(this).data('data');

      self.getHighlightedResults()
          .removeClass('select2-results__option--highlighted');

      self.trigger('results:focus', {
        data: data,
        element: $(this)
      });
    });
  };

  Results.prototype.getHighlightedResults = function () {
    var $highlighted = this.$results
    .find('.select2-results__option--highlighted');

    return $highlighted;
  };

  Results.prototype.destroy = function () {
    this.$results.remove();
  };

  Results.prototype.ensureHighlightVisible = function () {
    var $highlighted = this.getHighlightedResults();

    if ($highlighted.length === 0) {
      return;
    }

    var $options = this.$results.find('[aria-selected]');

    var currentIndex = $options.index($highlighted);

    var currentOffset = this.$results.offset().top;
    var nextTop = $highlighted.offset().top;
    var nextOffset = this.$results.scrollTop() + (nextTop - currentOffset);

    var offsetDelta = nextTop - currentOffset;
    nextOffset -= $highlighted.outerHeight(false) * 2;

    if (currentIndex <= 2) {
      this.$results.scrollTop(0);
    } else if (offsetDelta > this.$results.outerHeight() || offsetDelta < 0) {
      this.$results.scrollTop(nextOffset);
    }
  };

  Results.prototype.template = function (result, container) {
    var template = this.options.get('templateResult');

    var content = template(result);

    if (content == null) {
      container.style.display = 'none';
    } else {
      container.innerHTML = content;
    }
  };

  return Results;
});

define('select2/keys',[

], function () {
  var KEYS = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    ESC: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    DELETE: 46,

    isArrow: function (k) {
        k = k.which ? k.which : k;

        switch (k) {
        case KEY.LEFT:
        case KEY.RIGHT:
        case KEY.UP:
        case KEY.DOWN:
            return true;
        }

        return false;
    }
  };

  return KEYS;
});

define('select2/selection/base',[
  'jquery',
  '../utils',
  '../keys'
], function ($, Utils, KEYS) {
  function BaseSelection ($element, options) {
    this.$element = $element;
    this.options = options;

    BaseSelection.__super__.constructor.call(this);
  }

  Utils.Extend(BaseSelection, Utils.Observable);

  BaseSelection.prototype.render = function () {
    var $selection = $(
      '<span class="select2-selection" tabindex="0" role="combobox" ' +
      'aria-autocomplete="list" aria-haspopup="true" aria-expanded="false">' +
      '</span>'
    );

    $selection.attr('title', this.$element.attr('title'));

    this.$selection = $selection;

    return $selection;
  };

  BaseSelection.prototype.bind = function (container, $container) {
    var self = this;

    var id = container.id + '-container';
    var resultsId = container.id + '-results';

    this.container = container;

    this.$selection.attr('aria-owns', resultsId);

    this.$selection.on('keydown', function (evt) {
      self.trigger('keypress', evt);

      if (evt.which === KEYS.SPACE) {
        evt.preventDefault();
      }
    });

    container.on('results:focus', function (params) {
      self.$selection.attr('aria-activedescendant', params.data._resultId);
    });

    container.on('selection:update', function (params) {
      self.update(params.data);
    });

    container.on('open', function () {
      // When the dropdown is open, aria-expanded="true"
      self.$selection.attr('aria-expanded', 'true');

      self._attachCloseHandler(container);
    });

    container.on('close', function () {
      // When the dropdown is closed, aria-expanded="false"
      self.$selection.attr('aria-expanded', 'false');
      self.$selection.removeAttr('aria-activedescendant');

      self.$selection.focus();

      self._detachCloseHandler(container);
    });

    container.on('enable', function () {
      self.$selection.attr('tabindex', '0');
    });

    container.on('disable', function () {
      self.$selection.attr('tabindex', '-1');
    });
  };

  BaseSelection.prototype._attachCloseHandler = function (container) {
    var self = this;

    $(document.body).on('mousedown.select2.' + container.id, function (e) {
      var $target = $(e.target);

      var $select = $target.closest('.select2');

      var $all = $('.select2.select2-container--open');

      $all.each(function () {
        var $this = $(this);

        if (this == $select[0]) {
          return;
        }

        var $element = $this.data('element');

        $element.select2('close');
      });
    });
  };

  BaseSelection.prototype._detachCloseHandler = function (container) {
    $(document.body).off('mousedown.select2.' + container.id);
  };

  BaseSelection.prototype.position = function ($selection, $container) {
    var $selectionContainer = $container.find('.selection');
    $selectionContainer.append($selection);
  };

  BaseSelection.prototype.destroy = function () {
    this._detachCloseHandler(this.container);
  };

  BaseSelection.prototype.update = function (data) {
    throw new Error('The `update` method must be defined in child classes.');
  };

  return BaseSelection;
});

define('select2/selection/single',[
  'jquery',
  './base',
  '../utils',
  '../keys'
], function ($, BaseSelection, Utils, KEYS) {
  function SingleSelection () {
    SingleSelection.__super__.constructor.apply(this, arguments);
  }

  Utils.Extend(SingleSelection, BaseSelection);

  SingleSelection.prototype.render = function () {
    var $selection = SingleSelection.__super__.render.call(this);

    $selection.addClass('select2-selection--single');

    $selection.html(
      '<span class="select2-selection__rendered"></span>' +
      '<span class="select2-selection__arrow" role="presentation">' +
        '<b role="presentation"></b>' +
      '</span>'
    );

    return $selection;
  };

  SingleSelection.prototype.bind = function (container, $container) {
    var self = this;

    SingleSelection.__super__.bind.apply(this, arguments);

    var id = container.id + '-container';

    this.$selection.find('.select2-selection__rendered').attr('id', id);
    this.$selection.attr('aria-labelledby', id);

    this.$selection.on('mousedown', function (evt) {
      // Only respond to left clicks
      if (evt.which !== 1) {
        return;
      }

      self.trigger('toggle', {
        originalEvent: evt
      });
    });

    this.$selection.on('focus', function (evt) {
      // User focuses on the container
    });

    this.$selection.on('blur', function (evt) {
      // User exits the container
    });

    container.on('selection:update', function (params) {
      self.update(params.data);
    });
  };

  SingleSelection.prototype.clear = function () {
    this.$selection.find('.select2-selection__rendered').empty();
  };

  SingleSelection.prototype.display = function (data) {
    var template = this.options.get('templateSelection');

    return template(data);
  };

  SingleSelection.prototype.selectionContainer = function () {
    return $('<span></span>');
  };

  SingleSelection.prototype.update = function (data) {
    if (data.length === 0) {
      this.clear();
      return;
    }

    var selection = data[0];

    var formatted = this.display(selection);

    this.$selection.find('.select2-selection__rendered').html(formatted);
  };

  return SingleSelection;
});

define('select2/selection/multiple',[
  'jquery',
  './base',
  '../utils'
], function ($, BaseSelection, Utils) {
  function MultipleSelection ($element, options) {
    MultipleSelection.__super__.constructor.apply(this, arguments);
  }

  Utils.Extend(MultipleSelection, BaseSelection);

  MultipleSelection.prototype.render = function () {
    var $selection = MultipleSelection.__super__.render.call(this);

    $selection.addClass('select2-selection--multiple');

    $selection.html(
      '<ul class="select2-selection__rendered"></ul>'
    );

    return $selection;
  };

  MultipleSelection.prototype.bind = function (container, $container) {
    var self = this;

    MultipleSelection.__super__.bind.apply(this, arguments);

    this.$selection.on('click', function (evt) {
      self.trigger('toggle', {
        originalEvent: evt
      });
    });

    this.$selection.on('click', '.select2-selection__choice__remove',
      function (evt) {
      var $remove = $(this);
      var $selection = $remove.parent();

      var data = $selection.data('data');

      self.trigger('unselect', {
        originalEvent: evt,
        data: data
      });
    });
  };

  MultipleSelection.prototype.clear = function () {
    this.$selection.find('.select2-selection__rendered').empty();
  };

  MultipleSelection.prototype.display = function (data) {
    var template = this.options.get('templateSelection');

    return template(data);
  };

  MultipleSelection.prototype.selectionContainer = function () {
    var $container = $(
      '<li class="select2-selection__choice">' +
        '<span class="select2-selection__choice__remove" role="presentation">' +
          '&times;' +
        '</span>' +
      '</li>'
    );

    return $container;
  };

  MultipleSelection.prototype.update = function (data) {
    this.clear();

    if (data.length === 0) {
      return;
    }

    var $selections = [];

    for (var d = 0; d < data.length; d++) {
      var selection = data[d];

      var formatted = this.display(selection);
      var $selection = this.selectionContainer();

      $selection.append(formatted);
      $selection.data('data', selection);

      $selections.push($selection);
    }

    this.$selection.find('.select2-selection__rendered').append($selections);
  };

  return MultipleSelection;
});

define('select2/selection/placeholder',[
  '../utils'
], function (Utils) {
  function Placeholder (decorated, $element, options) {
    this.placeholder = this.normalizePlaceholder(options.get('placeholder'));

    decorated.call(this, $element, options);
  }

  Placeholder.prototype.normalizePlaceholder = function (_, placeholder) {
    if (typeof placeholder === 'string') {
      placeholder = {
        id: '',
        text: placeholder
      };
    }

    return placeholder;
  };

  Placeholder.prototype.createPlaceholder = function (decorated, placeholder) {
    var $placeholder = this.selectionContainer();

    $placeholder.html(this.display(placeholder));
    $placeholder.addClass('select2-selection__placeholder')
                .removeClass('select2-selection__choice');

    return $placeholder;
  };

  Placeholder.prototype.update = function (decorated, data) {
    var singlePlaceholder = (
      data.length == 1 && data[0].id != this.placeholder.id
    );
    var multipleSelections = data.length > 1;

    if (multipleSelections || singlePlaceholder) {
      return decorated.call(this, data);
    }

    this.clear();

    var $placeholder = this.createPlaceholder(this.placeholder);

    this.$selection.find('.select2-selection__rendered').append($placeholder);
  };

  return Placeholder;
});

define('select2/selection/allowClear',[
  'jquery'
], function ($) {
  function AllowClear () { }

  AllowClear.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    this.$selection.on('mousedown', '.select2-selection__clear',
      function (evt) {
        // Ignore the event if it is disabled
        if (self.options.get('disabled')) {
          return;
        }

        evt.stopPropagation();

        var data = $(this).data('data');

        for (var d = 0; d < data.length; d++) {
          var unselectData = {
            data: data[d]
          };

          // Trigger the `unselect` event, so people can prevent it from being
          // cleared.
          self.trigger('unselect', unselectData);

          // If the event was prevented, don't clear it out.
          if (unselectData.prevented) {
            return;
          }
        }

        self.$element.val(self.placeholder.id).trigger('change');

        self.trigger('toggle');
    });
  };

  AllowClear.prototype.update = function (decorated, data) {
    decorated.call(this, data);

    if (this.$selection.find('.select2-selection__placeholder').length > 0 ||
        data.length === 0) {
      return;
    }

    var $remove = $(
      '<span class="select2-selection__clear">' +
        '&times;' +
      '</span>'
    );
    $remove.data('data', data);

    this.$selection.find('.select2-selection__rendered').append($remove);
  };

  return AllowClear;
});

define('select2/selection/search',[
  'jquery',
  '../utils',
  '../keys'
], function ($, Utils, KEYS) {
  function Search (decorated, $element, options) {
    decorated.call(this, $element, options);
  }

  Search.prototype.render = function (decorated) {
    var $search = $(
      '<li class="select2-search select2-search--inline">' +
        '<input class="select2-search__field" type="search" tabindex="-1"' +
          ' role="textbox" />' +
      '</li>'
    );

    this.$searchContainer = $search;
    this.$search = $search.find('input');

    var $rendered = decorated.call(this);

    return $rendered;
  };

  Search.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('open', function () {
      self.$search.attr('tabindex', 0);

      self.$search.focus();
    });

    container.on('close', function () {
      self.$search.attr('tabindex', -1);

      self.$search.val('');
    });

    container.on('enable', function () {
      self.$search.prop('disabled', false);
    });

    container.on('disable', function () {
      self.$search.prop('disabled', true);
    });

    this.$selection.on('keydown', '.select2-search--inline', function (evt) {
      evt.stopPropagation();

      self.trigger('keypress', evt);

      self._keyUpPrevented = evt.isDefaultPrevented();

      var key = evt.which;

      if (key === KEYS.BACKSPACE && self.$search.val() === '') {
        var $previousChoice = self.$searchContainer
          .prev('.select2-selection__choice');

        if ($previousChoice.length > 0) {
          var item = $previousChoice.data('data');

          self.searchRemoveChoice(item);
        }
      }
    });

    this.$selection.on('keyup', '.select2-search--inline', function (evt) {
      self.handleSearch(evt);
    });
  };

  Search.prototype.createPlaceholder = function (decorated, placeholder) {
    this.$search.attr('placeholder', placeholder.text);
  };

  Search.prototype.update = function (decorated, data) {
    this.$search.attr('placeholder', '');

    decorated.call(this, data);

    this.$selection.find('.select2-selection__rendered')
                   .append(this.$searchContainer);

    this.resizeSearch();
  };

  Search.prototype.handleSearch = function () {
    this.resizeSearch();

    if (!this._keyUpPrevented) {
      var input = this.$search.val();

      this.trigger('query', {
        term: input
      });
    }

    this._keyUpPrevented = false;
  };

  Search.prototype.searchRemoveChoice = function (decorated, item) {
    this.trigger('unselect', {
      data: item
    });

    this.trigger('open');

    this.$search.val(item.text + ' ');
  };

  Search.prototype.resizeSearch = function () {
    this.$search.css('width', '25px');

    var width = '';

    if (this.$search.attr('placeholder') !== '') {
      width = this.$selection.find('.select2-selection__rendered').innerWidth();
    } else {
      var minimumWidth = this.$search.val().length + 1;

      width = (minimumWidth * 0.75) + 'em';
    }

    this.$search.css('width', width);
  };

  return Search;
});

define('select2/selection/eventRelay',[
  'jquery'
], function ($) {
  function EventRelay () { }

  EventRelay.prototype.bind = function (decorated, container, $container) {
    var self = this;
    var relayEvents = [
      'open', 'opening',
      'close', 'closing',
      'select', 'selecting',
      'unselect', 'unselecting'
    ];

    var preventableEvents = ['opening', 'closing', 'selecting', 'unselecting'];

    decorated.call(this, container, $container);

    container.on('*', function (name, params) {
      // Ignore events that should not be relayed
      if (relayEvents.indexOf(name) === -1) {
        return;
      }

      // The parameters should always be an object
      params = params || {};

      // Generate the jQuery event for the Select2 event
      var evt = $.Event('select2:' + name, {
        params: params
      });

      self.$element.trigger(evt);

      // Only handle preventable events if it was one
      if (preventableEvents.indexOf(name) === -1) {
        return;
      }

      params.prevented = evt.isDefaultPrevented();
    });
  };

  return EventRelay;
});

define('select2/translation',[
  'jquery'
], function ($) {
  function Translation (dict) {
    this.dict = dict || {};
  }

  Translation.prototype.all = function () {
    return this.dict;
  };

  Translation.prototype.get = function (key) {
    return this.dict[key];
  };

  Translation.prototype.extend = function (translation) {
    this.dict = $.extend({}, translation.all(), this.dict);
  };

  // Static functions

  Translation._cache = {};

  Translation.loadPath = function (path) {
    if (!(path in Translation._cache)) {
      var translations = require(path);

      Translation._cache[path] = translations;
    }

    return new Translation(Translation._cache[path]);
  };

  return Translation;
});

define('select2/diacritics',[

], function () {
  var diacritics = {
    '\u24B6': 'A',
    '\uFF21': 'A',
    '\u00C0': 'A',
    '\u00C1': 'A',
    '\u00C2': 'A',
    '\u1EA6': 'A',
    '\u1EA4': 'A',
    '\u1EAA': 'A',
    '\u1EA8': 'A',
    '\u00C3': 'A',
    '\u0100': 'A',
    '\u0102': 'A',
    '\u1EB0': 'A',
    '\u1EAE': 'A',
    '\u1EB4': 'A',
    '\u1EB2': 'A',
    '\u0226': 'A',
    '\u01E0': 'A',
    '\u00C4': 'A',
    '\u01DE': 'A',
    '\u1EA2': 'A',
    '\u00C5': 'A',
    '\u01FA': 'A',
    '\u01CD': 'A',
    '\u0200': 'A',
    '\u0202': 'A',
    '\u1EA0': 'A',
    '\u1EAC': 'A',
    '\u1EB6': 'A',
    '\u1E00': 'A',
    '\u0104': 'A',
    '\u023A': 'A',
    '\u2C6F': 'A',
    '\uA732': 'AA',
    '\u00C6': 'AE',
    '\u01FC': 'AE',
    '\u01E2': 'AE',
    '\uA734': 'AO',
    '\uA736': 'AU',
    '\uA738': 'AV',
    '\uA73A': 'AV',
    '\uA73C': 'AY',
    '\u24B7': 'B',
    '\uFF22': 'B',
    '\u1E02': 'B',
    '\u1E04': 'B',
    '\u1E06': 'B',
    '\u0243': 'B',
    '\u0182': 'B',
    '\u0181': 'B',
    '\u24B8': 'C',
    '\uFF23': 'C',
    '\u0106': 'C',
    '\u0108': 'C',
    '\u010A': 'C',
    '\u010C': 'C',
    '\u00C7': 'C',
    '\u1E08': 'C',
    '\u0187': 'C',
    '\u023B': 'C',
    '\uA73E': 'C',
    '\u24B9': 'D',
    '\uFF24': 'D',
    '\u1E0A': 'D',
    '\u010E': 'D',
    '\u1E0C': 'D',
    '\u1E10': 'D',
    '\u1E12': 'D',
    '\u1E0E': 'D',
    '\u0110': 'D',
    '\u018B': 'D',
    '\u018A': 'D',
    '\u0189': 'D',
    '\uA779': 'D',
    '\u01F1': 'DZ',
    '\u01C4': 'DZ',
    '\u01F2': 'Dz',
    '\u01C5': 'Dz',
    '\u24BA': 'E',
    '\uFF25': 'E',
    '\u00C8': 'E',
    '\u00C9': 'E',
    '\u00CA': 'E',
    '\u1EC0': 'E',
    '\u1EBE': 'E',
    '\u1EC4': 'E',
    '\u1EC2': 'E',
    '\u1EBC': 'E',
    '\u0112': 'E',
    '\u1E14': 'E',
    '\u1E16': 'E',
    '\u0114': 'E',
    '\u0116': 'E',
    '\u00CB': 'E',
    '\u1EBA': 'E',
    '\u011A': 'E',
    '\u0204': 'E',
    '\u0206': 'E',
    '\u1EB8': 'E',
    '\u1EC6': 'E',
    '\u0228': 'E',
    '\u1E1C': 'E',
    '\u0118': 'E',
    '\u1E18': 'E',
    '\u1E1A': 'E',
    '\u0190': 'E',
    '\u018E': 'E',
    '\u24BB': 'F',
    '\uFF26': 'F',
    '\u1E1E': 'F',
    '\u0191': 'F',
    '\uA77B': 'F',
    '\u24BC': 'G',
    '\uFF27': 'G',
    '\u01F4': 'G',
    '\u011C': 'G',
    '\u1E20': 'G',
    '\u011E': 'G',
    '\u0120': 'G',
    '\u01E6': 'G',
    '\u0122': 'G',
    '\u01E4': 'G',
    '\u0193': 'G',
    '\uA7A0': 'G',
    '\uA77D': 'G',
    '\uA77E': 'G',
    '\u24BD': 'H',
    '\uFF28': 'H',
    '\u0124': 'H',
    '\u1E22': 'H',
    '\u1E26': 'H',
    '\u021E': 'H',
    '\u1E24': 'H',
    '\u1E28': 'H',
    '\u1E2A': 'H',
    '\u0126': 'H',
    '\u2C67': 'H',
    '\u2C75': 'H',
    '\uA78D': 'H',
    '\u24BE': 'I',
    '\uFF29': 'I',
    '\u00CC': 'I',
    '\u00CD': 'I',
    '\u00CE': 'I',
    '\u0128': 'I',
    '\u012A': 'I',
    '\u012C': 'I',
    '\u0130': 'I',
    '\u00CF': 'I',
    '\u1E2E': 'I',
    '\u1EC8': 'I',
    '\u01CF': 'I',
    '\u0208': 'I',
    '\u020A': 'I',
    '\u1ECA': 'I',
    '\u012E': 'I',
    '\u1E2C': 'I',
    '\u0197': 'I',
    '\u24BF': 'J',
    '\uFF2A': 'J',
    '\u0134': 'J',
    '\u0248': 'J',
    '\u24C0': 'K',
    '\uFF2B': 'K',
    '\u1E30': 'K',
    '\u01E8': 'K',
    '\u1E32': 'K',
    '\u0136': 'K',
    '\u1E34': 'K',
    '\u0198': 'K',
    '\u2C69': 'K',
    '\uA740': 'K',
    '\uA742': 'K',
    '\uA744': 'K',
    '\uA7A2': 'K',
    '\u24C1': 'L',
    '\uFF2C': 'L',
    '\u013F': 'L',
    '\u0139': 'L',
    '\u013D': 'L',
    '\u1E36': 'L',
    '\u1E38': 'L',
    '\u013B': 'L',
    '\u1E3C': 'L',
    '\u1E3A': 'L',
    '\u0141': 'L',
    '\u023D': 'L',
    '\u2C62': 'L',
    '\u2C60': 'L',
    '\uA748': 'L',
    '\uA746': 'L',
    '\uA780': 'L',
    '\u01C7': 'LJ',
    '\u01C8': 'Lj',
    '\u24C2': 'M',
    '\uFF2D': 'M',
    '\u1E3E': 'M',
    '\u1E40': 'M',
    '\u1E42': 'M',
    '\u2C6E': 'M',
    '\u019C': 'M',
    '\u24C3': 'N',
    '\uFF2E': 'N',
    '\u01F8': 'N',
    '\u0143': 'N',
    '\u00D1': 'N',
    '\u1E44': 'N',
    '\u0147': 'N',
    '\u1E46': 'N',
    '\u0145': 'N',
    '\u1E4A': 'N',
    '\u1E48': 'N',
    '\u0220': 'N',
    '\u019D': 'N',
    '\uA790': 'N',
    '\uA7A4': 'N',
    '\u01CA': 'NJ',
    '\u01CB': 'Nj',
    '\u24C4': 'O',
    '\uFF2F': 'O',
    '\u00D2': 'O',
    '\u00D3': 'O',
    '\u00D4': 'O',
    '\u1ED2': 'O',
    '\u1ED0': 'O',
    '\u1ED6': 'O',
    '\u1ED4': 'O',
    '\u00D5': 'O',
    '\u1E4C': 'O',
    '\u022C': 'O',
    '\u1E4E': 'O',
    '\u014C': 'O',
    '\u1E50': 'O',
    '\u1E52': 'O',
    '\u014E': 'O',
    '\u022E': 'O',
    '\u0230': 'O',
    '\u00D6': 'O',
    '\u022A': 'O',
    '\u1ECE': 'O',
    '\u0150': 'O',
    '\u01D1': 'O',
    '\u020C': 'O',
    '\u020E': 'O',
    '\u01A0': 'O',
    '\u1EDC': 'O',
    '\u1EDA': 'O',
    '\u1EE0': 'O',
    '\u1EDE': 'O',
    '\u1EE2': 'O',
    '\u1ECC': 'O',
    '\u1ED8': 'O',
    '\u01EA': 'O',
    '\u01EC': 'O',
    '\u00D8': 'O',
    '\u01FE': 'O',
    '\u0186': 'O',
    '\u019F': 'O',
    '\uA74A': 'O',
    '\uA74C': 'O',
    '\u01A2': 'OI',
    '\uA74E': 'OO',
    '\u0222': 'OU',
    '\u24C5': 'P',
    '\uFF30': 'P',
    '\u1E54': 'P',
    '\u1E56': 'P',
    '\u01A4': 'P',
    '\u2C63': 'P',
    '\uA750': 'P',
    '\uA752': 'P',
    '\uA754': 'P',
    '\u24C6': 'Q',
    '\uFF31': 'Q',
    '\uA756': 'Q',
    '\uA758': 'Q',
    '\u024A': 'Q',
    '\u24C7': 'R',
    '\uFF32': 'R',
    '\u0154': 'R',
    '\u1E58': 'R',
    '\u0158': 'R',
    '\u0210': 'R',
    '\u0212': 'R',
    '\u1E5A': 'R',
    '\u1E5C': 'R',
    '\u0156': 'R',
    '\u1E5E': 'R',
    '\u024C': 'R',
    '\u2C64': 'R',
    '\uA75A': 'R',
    '\uA7A6': 'R',
    '\uA782': 'R',
    '\u24C8': 'S',
    '\uFF33': 'S',
    '\u1E9E': 'S',
    '\u015A': 'S',
    '\u1E64': 'S',
    '\u015C': 'S',
    '\u1E60': 'S',
    '\u0160': 'S',
    '\u1E66': 'S',
    '\u1E62': 'S',
    '\u1E68': 'S',
    '\u0218': 'S',
    '\u015E': 'S',
    '\u2C7E': 'S',
    '\uA7A8': 'S',
    '\uA784': 'S',
    '\u24C9': 'T',
    '\uFF34': 'T',
    '\u1E6A': 'T',
    '\u0164': 'T',
    '\u1E6C': 'T',
    '\u021A': 'T',
    '\u0162': 'T',
    '\u1E70': 'T',
    '\u1E6E': 'T',
    '\u0166': 'T',
    '\u01AC': 'T',
    '\u01AE': 'T',
    '\u023E': 'T',
    '\uA786': 'T',
    '\uA728': 'TZ',
    '\u24CA': 'U',
    '\uFF35': 'U',
    '\u00D9': 'U',
    '\u00DA': 'U',
    '\u00DB': 'U',
    '\u0168': 'U',
    '\u1E78': 'U',
    '\u016A': 'U',
    '\u1E7A': 'U',
    '\u016C': 'U',
    '\u00DC': 'U',
    '\u01DB': 'U',
    '\u01D7': 'U',
    '\u01D5': 'U',
    '\u01D9': 'U',
    '\u1EE6': 'U',
    '\u016E': 'U',
    '\u0170': 'U',
    '\u01D3': 'U',
    '\u0214': 'U',
    '\u0216': 'U',
    '\u01AF': 'U',
    '\u1EEA': 'U',
    '\u1EE8': 'U',
    '\u1EEE': 'U',
    '\u1EEC': 'U',
    '\u1EF0': 'U',
    '\u1EE4': 'U',
    '\u1E72': 'U',
    '\u0172': 'U',
    '\u1E76': 'U',
    '\u1E74': 'U',
    '\u0244': 'U',
    '\u24CB': 'V',
    '\uFF36': 'V',
    '\u1E7C': 'V',
    '\u1E7E': 'V',
    '\u01B2': 'V',
    '\uA75E': 'V',
    '\u0245': 'V',
    '\uA760': 'VY',
    '\u24CC': 'W',
    '\uFF37': 'W',
    '\u1E80': 'W',
    '\u1E82': 'W',
    '\u0174': 'W',
    '\u1E86': 'W',
    '\u1E84': 'W',
    '\u1E88': 'W',
    '\u2C72': 'W',
    '\u24CD': 'X',
    '\uFF38': 'X',
    '\u1E8A': 'X',
    '\u1E8C': 'X',
    '\u24CE': 'Y',
    '\uFF39': 'Y',
    '\u1EF2': 'Y',
    '\u00DD': 'Y',
    '\u0176': 'Y',
    '\u1EF8': 'Y',
    '\u0232': 'Y',
    '\u1E8E': 'Y',
    '\u0178': 'Y',
    '\u1EF6': 'Y',
    '\u1EF4': 'Y',
    '\u01B3': 'Y',
    '\u024E': 'Y',
    '\u1EFE': 'Y',
    '\u24CF': 'Z',
    '\uFF3A': 'Z',
    '\u0179': 'Z',
    '\u1E90': 'Z',
    '\u017B': 'Z',
    '\u017D': 'Z',
    '\u1E92': 'Z',
    '\u1E94': 'Z',
    '\u01B5': 'Z',
    '\u0224': 'Z',
    '\u2C7F': 'Z',
    '\u2C6B': 'Z',
    '\uA762': 'Z',
    '\u24D0': 'a',
    '\uFF41': 'a',
    '\u1E9A': 'a',
    '\u00E0': 'a',
    '\u00E1': 'a',
    '\u00E2': 'a',
    '\u1EA7': 'a',
    '\u1EA5': 'a',
    '\u1EAB': 'a',
    '\u1EA9': 'a',
    '\u00E3': 'a',
    '\u0101': 'a',
    '\u0103': 'a',
    '\u1EB1': 'a',
    '\u1EAF': 'a',
    '\u1EB5': 'a',
    '\u1EB3': 'a',
    '\u0227': 'a',
    '\u01E1': 'a',
    '\u00E4': 'a',
    '\u01DF': 'a',
    '\u1EA3': 'a',
    '\u00E5': 'a',
    '\u01FB': 'a',
    '\u01CE': 'a',
    '\u0201': 'a',
    '\u0203': 'a',
    '\u1EA1': 'a',
    '\u1EAD': 'a',
    '\u1EB7': 'a',
    '\u1E01': 'a',
    '\u0105': 'a',
    '\u2C65': 'a',
    '\u0250': 'a',
    '\uA733': 'aa',
    '\u00E6': 'ae',
    '\u01FD': 'ae',
    '\u01E3': 'ae',
    '\uA735': 'ao',
    '\uA737': 'au',
    '\uA739': 'av',
    '\uA73B': 'av',
    '\uA73D': 'ay',
    '\u24D1': 'b',
    '\uFF42': 'b',
    '\u1E03': 'b',
    '\u1E05': 'b',
    '\u1E07': 'b',
    '\u0180': 'b',
    '\u0183': 'b',
    '\u0253': 'b',
    '\u24D2': 'c',
    '\uFF43': 'c',
    '\u0107': 'c',
    '\u0109': 'c',
    '\u010B': 'c',
    '\u010D': 'c',
    '\u00E7': 'c',
    '\u1E09': 'c',
    '\u0188': 'c',
    '\u023C': 'c',
    '\uA73F': 'c',
    '\u2184': 'c',
    '\u24D3': 'd',
    '\uFF44': 'd',
    '\u1E0B': 'd',
    '\u010F': 'd',
    '\u1E0D': 'd',
    '\u1E11': 'd',
    '\u1E13': 'd',
    '\u1E0F': 'd',
    '\u0111': 'd',
    '\u018C': 'd',
    '\u0256': 'd',
    '\u0257': 'd',
    '\uA77A': 'd',
    '\u01F3': 'dz',
    '\u01C6': 'dz',
    '\u24D4': 'e',
    '\uFF45': 'e',
    '\u00E8': 'e',
    '\u00E9': 'e',
    '\u00EA': 'e',
    '\u1EC1': 'e',
    '\u1EBF': 'e',
    '\u1EC5': 'e',
    '\u1EC3': 'e',
    '\u1EBD': 'e',
    '\u0113': 'e',
    '\u1E15': 'e',
    '\u1E17': 'e',
    '\u0115': 'e',
    '\u0117': 'e',
    '\u00EB': 'e',
    '\u1EBB': 'e',
    '\u011B': 'e',
    '\u0205': 'e',
    '\u0207': 'e',
    '\u1EB9': 'e',
    '\u1EC7': 'e',
    '\u0229': 'e',
    '\u1E1D': 'e',
    '\u0119': 'e',
    '\u1E19': 'e',
    '\u1E1B': 'e',
    '\u0247': 'e',
    '\u025B': 'e',
    '\u01DD': 'e',
    '\u24D5': 'f',
    '\uFF46': 'f',
    '\u1E1F': 'f',
    '\u0192': 'f',
    '\uA77C': 'f',
    '\u24D6': 'g',
    '\uFF47': 'g',
    '\u01F5': 'g',
    '\u011D': 'g',
    '\u1E21': 'g',
    '\u011F': 'g',
    '\u0121': 'g',
    '\u01E7': 'g',
    '\u0123': 'g',
    '\u01E5': 'g',
    '\u0260': 'g',
    '\uA7A1': 'g',
    '\u1D79': 'g',
    '\uA77F': 'g',
    '\u24D7': 'h',
    '\uFF48': 'h',
    '\u0125': 'h',
    '\u1E23': 'h',
    '\u1E27': 'h',
    '\u021F': 'h',
    '\u1E25': 'h',
    '\u1E29': 'h',
    '\u1E2B': 'h',
    '\u1E96': 'h',
    '\u0127': 'h',
    '\u2C68': 'h',
    '\u2C76': 'h',
    '\u0265': 'h',
    '\u0195': 'hv',
    '\u24D8': 'i',
    '\uFF49': 'i',
    '\u00EC': 'i',
    '\u00ED': 'i',
    '\u00EE': 'i',
    '\u0129': 'i',
    '\u012B': 'i',
    '\u012D': 'i',
    '\u00EF': 'i',
    '\u1E2F': 'i',
    '\u1EC9': 'i',
    '\u01D0': 'i',
    '\u0209': 'i',
    '\u020B': 'i',
    '\u1ECB': 'i',
    '\u012F': 'i',
    '\u1E2D': 'i',
    '\u0268': 'i',
    '\u0131': 'i',
    '\u24D9': 'j',
    '\uFF4A': 'j',
    '\u0135': 'j',
    '\u01F0': 'j',
    '\u0249': 'j',
    '\u24DA': 'k',
    '\uFF4B': 'k',
    '\u1E31': 'k',
    '\u01E9': 'k',
    '\u1E33': 'k',
    '\u0137': 'k',
    '\u1E35': 'k',
    '\u0199': 'k',
    '\u2C6A': 'k',
    '\uA741': 'k',
    '\uA743': 'k',
    '\uA745': 'k',
    '\uA7A3': 'k',
    '\u24DB': 'l',
    '\uFF4C': 'l',
    '\u0140': 'l',
    '\u013A': 'l',
    '\u013E': 'l',
    '\u1E37': 'l',
    '\u1E39': 'l',
    '\u013C': 'l',
    '\u1E3D': 'l',
    '\u1E3B': 'l',
    '\u017F': 'l',
    '\u0142': 'l',
    '\u019A': 'l',
    '\u026B': 'l',
    '\u2C61': 'l',
    '\uA749': 'l',
    '\uA781': 'l',
    '\uA747': 'l',
    '\u01C9': 'lj',
    '\u24DC': 'm',
    '\uFF4D': 'm',
    '\u1E3F': 'm',
    '\u1E41': 'm',
    '\u1E43': 'm',
    '\u0271': 'm',
    '\u026F': 'm',
    '\u24DD': 'n',
    '\uFF4E': 'n',
    '\u01F9': 'n',
    '\u0144': 'n',
    '\u00F1': 'n',
    '\u1E45': 'n',
    '\u0148': 'n',
    '\u1E47': 'n',
    '\u0146': 'n',
    '\u1E4B': 'n',
    '\u1E49': 'n',
    '\u019E': 'n',
    '\u0272': 'n',
    '\u0149': 'n',
    '\uA791': 'n',
    '\uA7A5': 'n',
    '\u01CC': 'nj',
    '\u24DE': 'o',
    '\uFF4F': 'o',
    '\u00F2': 'o',
    '\u00F3': 'o',
    '\u00F4': 'o',
    '\u1ED3': 'o',
    '\u1ED1': 'o',
    '\u1ED7': 'o',
    '\u1ED5': 'o',
    '\u00F5': 'o',
    '\u1E4D': 'o',
    '\u022D': 'o',
    '\u1E4F': 'o',
    '\u014D': 'o',
    '\u1E51': 'o',
    '\u1E53': 'o',
    '\u014F': 'o',
    '\u022F': 'o',
    '\u0231': 'o',
    '\u00F6': 'o',
    '\u022B': 'o',
    '\u1ECF': 'o',
    '\u0151': 'o',
    '\u01D2': 'o',
    '\u020D': 'o',
    '\u020F': 'o',
    '\u01A1': 'o',
    '\u1EDD': 'o',
    '\u1EDB': 'o',
    '\u1EE1': 'o',
    '\u1EDF': 'o',
    '\u1EE3': 'o',
    '\u1ECD': 'o',
    '\u1ED9': 'o',
    '\u01EB': 'o',
    '\u01ED': 'o',
    '\u00F8': 'o',
    '\u01FF': 'o',
    '\u0254': 'o',
    '\uA74B': 'o',
    '\uA74D': 'o',
    '\u0275': 'o',
    '\u01A3': 'oi',
    '\u0223': 'ou',
    '\uA74F': 'oo',
    '\u24DF': 'p',
    '\uFF50': 'p',
    '\u1E55': 'p',
    '\u1E57': 'p',
    '\u01A5': 'p',
    '\u1D7D': 'p',
    '\uA751': 'p',
    '\uA753': 'p',
    '\uA755': 'p',
    '\u24E0': 'q',
    '\uFF51': 'q',
    '\u024B': 'q',
    '\uA757': 'q',
    '\uA759': 'q',
    '\u24E1': 'r',
    '\uFF52': 'r',
    '\u0155': 'r',
    '\u1E59': 'r',
    '\u0159': 'r',
    '\u0211': 'r',
    '\u0213': 'r',
    '\u1E5B': 'r',
    '\u1E5D': 'r',
    '\u0157': 'r',
    '\u1E5F': 'r',
    '\u024D': 'r',
    '\u027D': 'r',
    '\uA75B': 'r',
    '\uA7A7': 'r',
    '\uA783': 'r',
    '\u24E2': 's',
    '\uFF53': 's',
    '\u00DF': 's',
    '\u015B': 's',
    '\u1E65': 's',
    '\u015D': 's',
    '\u1E61': 's',
    '\u0161': 's',
    '\u1E67': 's',
    '\u1E63': 's',
    '\u1E69': 's',
    '\u0219': 's',
    '\u015F': 's',
    '\u023F': 's',
    '\uA7A9': 's',
    '\uA785': 's',
    '\u1E9B': 's',
    '\u24E3': 't',
    '\uFF54': 't',
    '\u1E6B': 't',
    '\u1E97': 't',
    '\u0165': 't',
    '\u1E6D': 't',
    '\u021B': 't',
    '\u0163': 't',
    '\u1E71': 't',
    '\u1E6F': 't',
    '\u0167': 't',
    '\u01AD': 't',
    '\u0288': 't',
    '\u2C66': 't',
    '\uA787': 't',
    '\uA729': 'tz',
    '\u24E4': 'u',
    '\uFF55': 'u',
    '\u00F9': 'u',
    '\u00FA': 'u',
    '\u00FB': 'u',
    '\u0169': 'u',
    '\u1E79': 'u',
    '\u016B': 'u',
    '\u1E7B': 'u',
    '\u016D': 'u',
    '\u00FC': 'u',
    '\u01DC': 'u',
    '\u01D8': 'u',
    '\u01D6': 'u',
    '\u01DA': 'u',
    '\u1EE7': 'u',
    '\u016F': 'u',
    '\u0171': 'u',
    '\u01D4': 'u',
    '\u0215': 'u',
    '\u0217': 'u',
    '\u01B0': 'u',
    '\u1EEB': 'u',
    '\u1EE9': 'u',
    '\u1EEF': 'u',
    '\u1EED': 'u',
    '\u1EF1': 'u',
    '\u1EE5': 'u',
    '\u1E73': 'u',
    '\u0173': 'u',
    '\u1E77': 'u',
    '\u1E75': 'u',
    '\u0289': 'u',
    '\u24E5': 'v',
    '\uFF56': 'v',
    '\u1E7D': 'v',
    '\u1E7F': 'v',
    '\u028B': 'v',
    '\uA75F': 'v',
    '\u028C': 'v',
    '\uA761': 'vy',
    '\u24E6': 'w',
    '\uFF57': 'w',
    '\u1E81': 'w',
    '\u1E83': 'w',
    '\u0175': 'w',
    '\u1E87': 'w',
    '\u1E85': 'w',
    '\u1E98': 'w',
    '\u1E89': 'w',
    '\u2C73': 'w',
    '\u24E7': 'x',
    '\uFF58': 'x',
    '\u1E8B': 'x',
    '\u1E8D': 'x',
    '\u24E8': 'y',
    '\uFF59': 'y',
    '\u1EF3': 'y',
    '\u00FD': 'y',
    '\u0177': 'y',
    '\u1EF9': 'y',
    '\u0233': 'y',
    '\u1E8F': 'y',
    '\u00FF': 'y',
    '\u1EF7': 'y',
    '\u1E99': 'y',
    '\u1EF5': 'y',
    '\u01B4': 'y',
    '\u024F': 'y',
    '\u1EFF': 'y',
    '\u24E9': 'z',
    '\uFF5A': 'z',
    '\u017A': 'z',
    '\u1E91': 'z',
    '\u017C': 'z',
    '\u017E': 'z',
    '\u1E93': 'z',
    '\u1E95': 'z',
    '\u01B6': 'z',
    '\u0225': 'z',
    '\u0240': 'z',
    '\u2C6C': 'z',
    '\uA763': 'z',
    '\u0386': '\u0391',
    '\u0388': '\u0395',
    '\u0389': '\u0397',
    '\u038A': '\u0399',
    '\u03AA': '\u0399',
    '\u038C': '\u039F',
    '\u038E': '\u03A5',
    '\u03AB': '\u03A5',
    '\u038F': '\u03A9',
    '\u03AC': '\u03B1',
    '\u03AD': '\u03B5',
    '\u03AE': '\u03B7',
    '\u03AF': '\u03B9',
    '\u03CA': '\u03B9',
    '\u0390': '\u03B9',
    '\u03CC': '\u03BF',
    '\u03CD': '\u03C5',
    '\u03CB': '\u03C5',
    '\u03B0': '\u03C5',
    '\u03C9': '\u03C9',
    '\u03C2': '\u03C3'
  };

  return diacritics;
});

define('select2/data/base',[
  '../utils'
], function (Utils) {
  function BaseAdapter ($element, options) {
    BaseAdapter.__super__.constructor.call(this);
  }

  Utils.Extend(BaseAdapter, Utils.Observable);

  BaseAdapter.prototype.current = function (callback) {
    throw new Error('The `current` method must be defined in child classes.');
  };

  BaseAdapter.prototype.query = function (params, callback) {
    throw new Error('The `query` method must be defined in child classes.');
  };

  BaseAdapter.prototype.bind = function (container, $container) {
    // Can be implemented in subclasses
  };

  BaseAdapter.prototype.destroy = function () {
    // Can be implemented in subclasses
  };

  BaseAdapter.prototype.generateResultId = function (container, data) {
    var id = container.id + '-result-';

    id += Utils.generateChars(4);

    if (data.id != null) {
      id += '-' + data.id.toString();
    } else {
      id += '-' + Utils.generateChars(4);
    }
    return id;
  };

  return BaseAdapter;
});

define('select2/data/select',[
  './base',
  '../utils',
  'jquery'
], function (BaseAdapter, Utils, $) {
  function SelectAdapter ($element, options) {
    this.$element = $element;
    this.options = options;

    SelectAdapter.__super__.constructor.call(this);
  }

  Utils.Extend(SelectAdapter, BaseAdapter);

  SelectAdapter.prototype.current = function (callback) {
    var data = [];
    var self = this;

    this.$element.find(':selected').each(function () {
      var $option = $(this);

      var option = self.item($option);

      data.push(option);
    });

    callback(data);
  };

  SelectAdapter.prototype.select = function (data) {
    var self = this;

    // If data.element is a DOM nose, use it instead
    if ($(data.element).is('option')) {
      data.element.selected = true;

      this.$element.trigger('change');

      return;
    }

    if (this.$element.prop('multiple')) {
      this.current(function (currentData) {
        var val = [];

        data = [data];
        data.push.apply(data, currentData);

        for (var d = 0; d < data.length; d++) {
          id = data[d].id;

          if (val.indexOf(id) === -1) {
            val.push(id);
          }
        }

        self.$element.val(val);
        self.$element.trigger('change');
      });
    } else {
      var val = data.id;

      this.$element.val(val);

      this.$element.trigger('change');
    }
  };

  SelectAdapter.prototype.unselect = function (data) {
    var self = this;

    if (!this.$element.prop('multiple')) {
      return;
    }

    if ($(data.element).is('option')) {
      data.element.selected = false;

      this.$element.trigger('change');

      return;
    }

    this.current(function (currentData) {
      var val = [];

      for (var d = 0; d < currentData.length; d++) {
        id = currentData[d].id;

        if (id !== data.id && val.indexOf(id) === -1) {
          val.push(id);
        }
      }

      self.$element.val(val);

      self.$element.trigger('change');
    });
  };

  SelectAdapter.prototype.bind = function (container, $container) {
    var self = this;

    this.container = container;

    container.on('select', function (params) {
      self.select(params.data);
    });

    container.on('unselect', function (params) {
      self.unselect(params.data);
    });
  };

  SelectAdapter.prototype.destroy = function () {
    // Remove anything added to child elements
    this.$element.find('*').each(function () {
      // Remove any custom data set by Select2
      $.removeData(this, 'data');
    });
  };

  SelectAdapter.prototype.query = function (params, callback) {
    var data = [];
    var self = this;

    var $options = this.$element.children();

    $options.each(function () {
      var $option = $(this);

      if (!$option.is('option') && !$option.is('optgroup')) {
        return;
      }

      var option = self.item($option);

      var matches = self.matches(params, option);

      if (matches !== null) {
        data.push(matches);
      }
    });

    callback({
      results: data
    });
  };

  SelectAdapter.prototype.option = function (data) {
    var option;

    if (data.children) {
      option = document.createElement('optgroup');
      option.label = data.text;
    } else {
      option = document.createElement('option');
      option.innerText = data.text;
    }

    if (data.id) {
      option.value = data.id;
    }

    if (data.disabled) {
      option.disabled = true;
    }

    if (data.selected) {
      option.selected = true;
    }

    var $option = $(option);

    var normalizedData = this._normalizeItem(data);
    normalizedData.element = option;

    // Override the option's data with the combined data
    $.data(option, 'data', normalizedData);

    return $option;
  };

  SelectAdapter.prototype.item = function ($option) {
    var data = {};

    data = $.data($option[0], 'data');

    if (data != null) {
      return data;
    }

    if ($option.is('option')) {
      data = {
        id: $option.val(),
        text: $option.html(),
        disabled: $option.prop('disabled'),
        selected: $option.prop('selected')
      };
    } else if ($option.is('optgroup')) {
      data = {
        text: $option.prop('label'),
        children: []
      };

      var $children = $option.children('option');
      var children = [];

      for (var c = 0; c < $children.length; c++) {
        var $child = $($children[c]);

        var child = this.item($child);

        children.push(child);
      }

      data.children = children;
    }

    data = this._normalizeItem(data);
    data.element = $option[0];

    $.data($option[0], 'data', data);

    return data;
  };

  SelectAdapter.prototype._normalizeItem = function (item) {
    if (!$.isPlainObject(item)) {
      item = {
        id: item,
        text: item
      };
    }

    item = $.extend({}, {
      text: ''
    }, item);

    var defaults = {
      selected: false,
      disabled: false
    };

    if (item.id != null) {
      item.id = item.id.toString();
    }

    if (item.text != null) {
      item.text = item.text.toString();
    }

    if (item._resultId == null && item.id && this.container != null) {
      item._resultId = this.generateResultId(this.container, item);
    }

    return $.extend({}, defaults, item);
  };

  SelectAdapter.prototype.matches = function (params, data) {
    var matcher = this.options.get('matcher');

    return matcher(params, data);
  };

  return SelectAdapter;
});

define('select2/data/array',[
  './select',
  '../utils',
  'jquery'
], function (SelectAdapter, Utils, $) {
  function ArrayAdapter ($element, options) {
    var data = options.get('data') || [];

    ArrayAdapter.__super__.constructor.call(this, $element, options);

    $element.append(this.convertToOptions(data));
  }

  Utils.Extend(ArrayAdapter, SelectAdapter);

  ArrayAdapter.prototype.select = function (data) {
    var $option = this.$element.find('option[value="' + data.id + '"]');

    if ($option.length === 0) {
      $option = this.option(data);

      this.$element.append($option);
    }

    ArrayAdapter.__super__.select.call(this, data);
  };

  ArrayAdapter.prototype.convertToOptions = function (data) {
    var self = this;

    var $existing = this.$element.find('option');
    var existingIds = $existing.map(function () {
      return self.item($(this)).id;
    }).get();

    var $options = [];

    // Filter out all items except for the one passed in the argument
    function onlyItem (item) {
      return function () {
        return $(this).val() == item.id;
      };
    }

    for (var d = 0; d < data.length; d++) {
      var item = this._normalizeItem(data[d]);

      // Skip items which were pre-loaded, only merge the data
      if (existingIds.indexOf(item.id) >= 0) {
        var $existingOption = $existing.filter(onlyItem(item));

        var existingData = this.item($existingOption);
        var newData = $.extend(true, {}, existingData, item);

        var $newOption = this.option(existingData);

        $existingOption.replaceWith($newOption);

        continue;
      }

      var $option = this.option(item);

      if (item.children) {
        var $children = this.convertToOptions(item.children);

        $option.append($children);
      }

      $options.push($option);
    }

    return $options;
  };

  return ArrayAdapter;
});

define('select2/data/ajax',[
  './array',
  '../utils',
  'jquery'
], function (ArrayAdapter, Utils, $) {
  function AjaxAdapter ($element, options) {
    this.ajaxOptions = options.get('ajax');

    if (this.ajaxOptions.processResults != null) {
      this.processResults = this.ajaxOptions.processResults;
    }

    ArrayAdapter.__super__.constructor.call(this, $element, options);
  }

  Utils.Extend(AjaxAdapter, ArrayAdapter);

  AjaxAdapter.prototype.processResults = function (results) {
    return results;
  };

  AjaxAdapter.prototype.query = function (params, callback) {
    var matches = [];
    var self = this;

    if (this._request) {
      this._request.abort();
      this._request = null;
    }

    var options = $.extend({
      type: 'GET'
    }, this.ajaxOptions);

    if (typeof options.url === 'function') {
      options.url = options.url(params);
    }

    if (typeof options.data === 'function') {
      options.data = options.data(params);
    }

    function request () {
      var $request = $.ajax(options);

      $request.success(function (data) {
        var results = self.processResults(data, params);

        if (console && console.error) {
          // Check to make sure that the response included a `results` key.
          if (!results || !results.results || !$.isArray(results.results)) {
            console.error(
              'Select2: The AJAX results did not return an array in the ' +
              '`results` key of the response.'
            );
          }
        }

        callback(results);
      });

      self._request = $request;
    }

    if (this.ajaxOptions.delay && params.term !== '') {
      if (this._queryTimeout) {
        window.clearTimeout(this._queryTimeout);
      }

      this._queryTimeout = window.setTimeout(request, this.ajaxOptions.delay);
    } else {
      request();
    }
  };

  return AjaxAdapter;
});

define('select2/data/tags',[
  'jquery'
], function ($) {
  function Tags (decorated, $element, options) {
    var tags = options.get('tags');

    var createTag = options.get('createTag');

    if (createTag !== undefined) {
      this.createTag = createTag;
    }

    decorated.call(this, $element, options);

    if ($.isArray(tags)) {
      for (var t = 0; t < tags.length; t++) {
        var tag = tags[t];
        var item = this._normalizeItem(tag);

        var $option = this.option(item);

        this.$element.append($option);
      }
    }
  }

  Tags.prototype.query = function (decorated, params, callback) {
    var self = this;

    this._removeOldTags();

    if (params.term == null || params.term === '' || params.page != null) {
      decorated.call(this, params, callback);
      return;
    }

    function wrapper (obj, child) {
      var data = obj.results;

      for (var i = 0; i < data.length; i++) {
        var option = data[i];

        var checkChildren = (
          option.children != null &&
          !wrapper({
            results: option.children
          }, true)
        );

        var checkText = option.text === params.term;

        if (checkText || checkChildren) {
          if (child) {
            return false;
          }

          obj.data = data;
          callback(obj);

          return;
        }
      }

      if (child) {
        return true;
      }

      var tag = self.createTag(params);

      if (tag != null) {
        var $option = self.option(tag);
        $option.attr('data-select2-tag', true);

        self.$element.append($option);

        self.insertTag(data, tag);
      }

      obj.results = data;

      callback(obj);
    }

    decorated.call(this, params, wrapper);
  };

  Tags.prototype.createTag = function (decorated, params) {
    return {
      id: params.term,
      text: params.term
    };
  };

  Tags.prototype.insertTag = function (_, data, tag) {
    data.unshift(tag);
  };

  Tags.prototype._removeOldTags = function (_) {
    var tag = this._lastTag;

    var $options = this.$element.find('option[data-select2-tag]');

    $options.each(function () {
      if (this.selected) {
        return;
      }

      $(this).remove();
    });
  };

  return Tags;
});

define('select2/data/tokenizer',[
  'jquery'
], function ($) {
  function Tokenizer (decorated, $element, options) {
    var tokenizer = options.get('tokenizer');

    if (tokenizer !== undefined) {
      this.tokenizer = tokenizer;
    }

    decorated.call(this, $element, options);
  }

  Tokenizer.prototype.bind = function (decorated, container, $container) {
    decorated.call(this, container, $container);

    this.$search =  container.dropdown.$search || container.selection.$search ||
      $container.find('.select2-search__field');
  };

  Tokenizer.prototype.query = function (decorated, params, callback) {
    var self = this;

    function select (data) {
      self.select(data);
    }

    params.term = params.term || '';

    var tokenData = this.tokenizer(params, this.options, select);

    if (tokenData.term !== params.term) {
      // Replace the search term if we have the search box
      if (this.$search.length) {
        this.$search.val(tokenData.term);
        this.$search.focus();
      }

      params.term = tokenData.term;
    }

    decorated.call(this, params, callback);
  };

  Tokenizer.prototype.tokenizer = function (_, params, options, callback) {
    var separators = options.get('tokenSeparators') || [];
    var term = params.term;
    var i = 0;

    var createTag = this.createTag || function (params) {
      return {
        id: params.term,
        text: params.term
      };
    };

    while (i < term.length) {
      var termChar = term[i];

      if (separators.indexOf(termChar) === -1) {
        i++;

        continue;
      }

      var part = term.substr(0, i);
      var partParams = $.extend({}, params, {
        term: part
      });

      var data = createTag(partParams);

      callback(data);

      // Reset the term to not include the tokenized portion
      term = term.substr(i + 1) || '';
      i = 0;
    }

    return {
      term: term
    };
  };

  return Tokenizer;
});

define('select2/data/minimumInputLength',[

], function () {
  function MinimumInputLength (decorated, $e, options) {
    this.minimumInputLength = options.get('minimumInputLength');

    decorated.call(this, $e, options);
  }

  MinimumInputLength.prototype.query = function (decorated, params, callback) {
    params.term = params.term || '';

    if (params.term.length < this.minimumInputLength) {
      this.trigger('results:message', {
        message: 'inputTooShort',
        args: {
          minimum: this.minimumInputLength,
          input: params.term,
          params: params
        }
      });

      return;
    }

    decorated.call(this, params, callback);
  };

  return MinimumInputLength;
});

define('select2/data/maximumInputLength',[

], function () {
  function MaximumInputLength (decorated, $e, options) {
    this.maximumInputLength = options.get('maximumInputLength');

    decorated.call(this, $e, options);
  }

  MaximumInputLength.prototype.query = function (decorated, params, callback) {
    params.term = params.term || '';

    if (this.maximumInputLength > 0 &&
        params.term.length > this.maximumInputLength) {
      this.trigger('results:message', {
        message: 'inputTooLong',
        args: {
          minimum: this.maximumInputLength,
          input: params.term,
          params: params
        }
      });

      return;
    }

    decorated.call(this, params, callback);
  };

  return MaximumInputLength;
});

define('select2/data/maximumSelectionLength',[

], function (){
  function MaximumSelectionLength (decorated, $e, options) {
    this.maximumSelectionLength = options.get('maximumSelectionLength');

    decorated.call(this, $e, options);
  }

  MaximumSelectionLength.prototype.query =
    function (decorated, params, callback) {
      var self = this;

      this.current(function (currentData) {
        var count = currentData != null ? currentData.length : 0;
        if (self.maximumSelectionLength > 0 &&
          count >= self.maximumSelectionLength) {
          self.trigger('results:message', {
            message: 'maximumSelected',
            args: {
              maximum: self.maximumSelectionLength
            }
          });
          return;
        }
        decorated.call(self, params, callback);
      });
  };

  return MaximumSelectionLength;
});

define('select2/dropdown',[
  'jquery',
  './utils'
], function ($, Utils) {
  function Dropdown ($element, options) {
    this.$element = $element;
    this.options = options;

    Dropdown.__super__.constructor.call(this);
  }

  Utils.Extend(Dropdown, Utils.Observable);

  Dropdown.prototype.render = function () {
    var $dropdown = $(
      '<span class="select2-dropdown">' +
        '<span class="select2-results"></span>' +
      '</span>'
    );

    $dropdown.attr('dir', this.options.get('dir'));

    this.$dropdown = $dropdown;

    return $dropdown;
  };

  Dropdown.prototype.position = function ($dropdown, $container) {
    // Should be implmented in subclasses
  };

  Dropdown.prototype.destroy = function () {
    // Remove the dropdown from the DOM
    this.$dropdown.remove();
  };

  Dropdown.prototype.bind = function (container, $container) {
    var self = this;

    container.on('select', function (params) {
      self._onSelect(params);
    });

    container.on('unselect', function (params) {
      self._onUnSelect(params);
    });
  };

  Dropdown.prototype._onSelect = function () {
    this.trigger('close');
  };

  Dropdown.prototype._onUnSelect = function () {
    this.trigger('close');
  };

  return Dropdown;
});

define('select2/dropdown/search',[
  'jquery',
  '../utils'
], function ($, Utils) {
  function Search () { }

  Search.prototype.render = function (decorated) {
    var $rendered = decorated.call(this);

    var $search = $(
      '<span class="select2-search select2-search--dropdown">' +
        '<input class="select2-search__field" type="search" tabindex="-1"' +
        ' role="textbox" />' +
      '</span>'
    );

    this.$searchContainer = $search;
    this.$search = $search.find('input');

    $rendered.prepend($search);

    return $rendered;
  };

  Search.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    this.$search.on('keydown', function (evt) {
      self.trigger('keypress', evt);

      self._keyUpPrevented = evt.isDefaultPrevented();
    });

    this.$search.on('keyup', function (evt) {
      self.handleSearch(evt);
    });

    container.on('open', function () {
      self.$search.attr('tabindex', 0);

      self.$search.focus();

      window.setTimeout(function () {
        self.$search.focus();
      }, 0);
    });

    container.on('close', function () {
      self.$search.attr('tabindex', -1);

      self.$search.val('');
    });

    container.on('results:all', function (params) {
      if (params.query.term == null || params.query.term === '') {
        var showSearch = self.showSearch(params);

        if (showSearch) {
          self.$searchContainer.removeClass('select2-search--hide');
        } else {
          self.$searchContainer.addClass('select2-search--hide');
        }
      }
    });
  };

  Search.prototype.handleSearch = function (evt) {
    if (!this._keyUpPrevented) {
      var input = this.$search.val();

      this.trigger('query', {
        term: input
      });
    }

    this._keyUpPrevented = false;
  };

  Search.prototype.showSearch = function (_, params) {
    return true;
  };

  return Search;
});

define('select2/dropdown/hidePlaceholder',[

], function () {
  function HidePlaceholder (decorated, $element, options, dataAdapter) {
    this.placeholder = this.normalizePlaceholder(options.get('placeholder'));

    decorated.call(this, $element, options, dataAdapter);
  }

  HidePlaceholder.prototype.append = function (decorated, data) {
    data.results = this.removePlaceholder(data.results);

    decorated.call(this, data);
  };

  HidePlaceholder.prototype.normalizePlaceholder = function (_, placeholder) {
    if (typeof placeholder === 'string') {
      placeholder = {
        id: '',
        text: placeholder
      };
    }

    return placeholder;
  };

  HidePlaceholder.prototype.removePlaceholder = function (_, data) {
    var modifiedData = data.slice(0);

    for (var d = data.length - 1; d >= 0; d--) {
      var item = data[d];

      if (this.placeholder.id === item.id) {
        modifiedData.splice(d, 1);
      }
    }

    return modifiedData;
  };

  return HidePlaceholder;
});

define('select2/dropdown/infiniteScroll',[
  'jquery'
], function ($) {
  function InfiniteScroll (decorated, $element, options, dataAdapter) {
    this.lastParams = {};

    decorated.call(this, $element, options, dataAdapter);

    this.$loadingMore = this.createLoadingMore();
    this.loading = false;
  }

  InfiniteScroll.prototype.append = function (decorated, data) {
    this.$loadingMore.remove();
    this.loading = false;

    decorated.call(this, data);

    if (this.showLoadingMore(data)) {
      this.$results.append(this.$loadingMore);
    }
  };

  InfiniteScroll.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('query', function (params) {
      self.lastParams = params;
      self.loading = true;
    });

    container.on('query:append', function (params) {
      self.lastParams = params;
      self.loading = true;
    });

    this.$results.on('scroll', function () {
      var isLoadMoreVisible = $.contains(
        document.documentElement,
        self.$loadingMore[0]
      );

      if (self.loading || !isLoadMoreVisible) {
        return;
      }

      var currentOffset = self.$results.offset().top +
        self.$results.outerHeight(false);
      var loadingMoreOffset = self.$loadingMore.offset().top +
        self.$loadingMore.outerHeight(false);

      if (currentOffset + 50 >= loadingMoreOffset) {
        self.loadMore();
      }
    });
  };

  InfiniteScroll.prototype.loadMore = function () {
    this.loading = true;

    var params = $.extend({}, {page: 1}, this.lastParams);

    params.page++;

    this.trigger('query:append', params);
  };

  InfiniteScroll.prototype.showLoadingMore = function (_, data) {
    return data.pagination && data.pagination.more;
  };

  InfiniteScroll.prototype.createLoadingMore = function () {
    var $option = $(
      '<li class="option load-more" role="treeitem"></li>'
    );

    var message = this.options.get('translations').get('loadingMore');

    $option.html(message(this.lastParams));

    return $option;
  };

  return InfiniteScroll;
});

define('select2/dropdown/attachBody',[
  'jquery',
  '../utils'
], function ($, Utils) {
  function AttachBody (decorated, $element, options) {
    this.$dropdownParent = options.get('dropdownParent') || document.body;

    decorated.call(this, $element, options);
  }

  AttachBody.prototype.bind = function (decorated, container, $container) {
    var self = this;

    var setupResultsEvents = false;

    decorated.call(this, container, $container);

    container.on('open', function () {
      self._showDropdown();
      self._attachPositioningHandler(container);

      if (!setupResultsEvents) {
        setupResultsEvents = true;

        container.on('results:all', function () {
          self._positionDropdown();
          self._resizeDropdown();
        });

        container.on('results:append', function () {
          self._positionDropdown();
          self._resizeDropdown();
        });
      }
    });

    container.on('close', function () {
      self._hideDropdown();
      self._detachPositioningHandler(container);
    });

    this.$dropdownContainer.on('mousedown', function (evt) {
      evt.stopPropagation();
    });
  };

  AttachBody.prototype.position = function (decorated, $dropdown, $container) {
    // Clone all of the container classes
    $dropdown.attr('class', $container.attr('class'));

    $dropdown.removeClass('select2');
    $dropdown.addClass('select2-container--open');

    $dropdown.css({
      position: 'absolute',
      top: -999999
    });

    this.$container = $container;
  };

  AttachBody.prototype.render = function (decorated) {
    var $container = $('<span></span>');

    var $dropdown = decorated.call(this);
    $container.append($dropdown);

    this.$dropdownContainer = $container;

    return $container;
  };

  AttachBody.prototype._hideDropdown = function (decorated) {
    this.$dropdownContainer.detach();
  };

  AttachBody.prototype._attachPositioningHandler = function (container) {
    var self = this;

    var scrollEvent = 'scroll.select2.' + container.id;
    var resizeEvent = 'resize.select2.' + container.id;
    var orientationEvent = 'orientationchange.select2.' + container.id;

    $watchers = this.$container.parents().filter(Utils.hasScroll);
    $watchers.each(function () {
      $(this).data('select2-scroll-position', {
        x: $(this).scrollLeft(),
        y: $(this).scrollTop()
      });
    });

    $watchers.on(scrollEvent, function (ev) {
      var position = $(this).data('select2-scroll-position');
      $(this).scrollTop(position.y);
    });

    $(window).on(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent,
      function (e) {
      self._positionDropdown();
      self._resizeDropdown();
    });
  };

  AttachBody.prototype._detachPositioningHandler = function (container) {
    var scrollEvent = 'scroll.select2.' + container.id;
    var resizeEvent = 'resize.select2.' + container.id;
    var orientationEvent = 'orientationchange.select2.' + container.id;

    $watchers = this.$container.parents().filter(Utils.hasScroll);
    $watchers.off(scrollEvent);

    $(window).off(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent);
  };

  AttachBody.prototype._positionDropdown = function () {
    var $window = $(window);

    var isCurrentlyAbove = this.$dropdown.hasClass('select2-dropdown--above');
    var isCurrentlyBelow = this.$dropdown.hasClass('select2-dropdown--below');

    var newDirection = null;

    var position = this.$container.position();
    var offset = this.$container.offset();

    offset.bottom = offset.top + this.$container.outerHeight(false);

    var container = {
      height: this.$container.outerHeight(false)
    };

    container.top = offset.top;
    container.bottom = offset.top + container.height;

    var dropdown = {
      height: this.$dropdown.outerHeight(false)
    };

    var viewport = {
      top: $window.scrollTop(),
      bottom: $window.scrollTop() + $window.height()
    };

    var enoughRoomAbove = viewport.top < (offset.top - dropdown.height);
    var enoughRoomBelow = viewport.bottom > (offset.bottom + dropdown.height);

    var css = {
      left: offset.left,
      top: container.bottom
    };

    if (!isCurrentlyAbove && !isCurrentlyBelow) {
      newDirection = 'below';
    }

    if (!enoughRoomBelow && enoughRoomAbove && !isCurrentlyAbove) {
      newDirection = 'above';
    } else if (!enoughRoomAbove && enoughRoomBelow && isCurrentlyAbove) {
      newDirection = 'below';
    }

    if (newDirection == 'above' ||
      (isCurrentlyAbove && newDirection !== 'below')) {
      css.top = container.top - dropdown.height;
    }

    if (newDirection != null) {
      this.$dropdown
        .removeClass('select2-dropdown--below select2-dropdown--above')
        .addClass('select2-dropdown--' + newDirection);
      this.$container
        .removeClass('select2-container--below select2-container--above')
        .addClass('select2-container--' + newDirection);
    }

    this.$dropdownContainer.css(css);
  };

  AttachBody.prototype._resizeDropdown = function () {
    this.$dropdownContainer.width();

    this.$dropdown.css({
      width: this.$container.outerWidth(false) + 'px'
    });
  };

  AttachBody.prototype._showDropdown = function (decorated) {
    this.$dropdownContainer.appendTo(this.$dropdownParent);

    this._positionDropdown();
    this._resizeDropdown();
  };

  return AttachBody;
});

define('select2/dropdown/minimumResultsForSearch',[

], function () {
  function countResults (data) {
    count = 0;

    for (var d = 0; d < data.length; d++) {
      var item = data[d];

      if (item.children) {
        count += countResults(item.children);
      } else {
        count++;
      }
    }

    return count;
  }

  function MinimumResultsForSearch (decorated, $element, options, dataAdapter) {
    this.minimumResultsForSearch = options.get('minimumResultsForSearch');

    decorated.call(this, $element, options, dataAdapter);
  }

  MinimumResultsForSearch.prototype.showSearch = function (decorated, params) {
    if (countResults(params.data.results) < this.minimumResultsForSearch) {
      return false;
    }

    return decorated.call(this, params);
  };

  return MinimumResultsForSearch;
});

define('select2/dropdown/selectOnClose',[

], function () {
  function SelectOnClose () { }

  SelectOnClose.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('close', function () {
      self._handleSelectOnClose();
    });
  };

  SelectOnClose.prototype._handleSelectOnClose = function () {
    var $highlightedResults = this.getHighlightedResults();

    if ($highlightedResults.length < 1) {
      return;
    }

    $highlightedResults.trigger('mouseup');
  };

  return SelectOnClose;
});

define('select2/i18n/en',[],function () {
  // English
  return {
    errorLoading: function () {
      return 'The results could not be loaded.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = 'Please delete ' + overChars + ' character';

      if (overChars != 1) {
        message += 's';
      }

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = 'Please enter ' + remainingChars + ' or more characters';

      return message;
    },
    loadingMore: function () {
      return 'Loading more results…';
    },
    maximumSelected: function (args) {
      var message = 'You can only select ' + args.maximum + ' item';

      if (args.maximum != 1) {
        message += 's';
      }

      return message;
    },
    noResults: function () {
      return 'No results found';
    },
    searching: function () {
      return 'Searching…';
    }
  };
});

define('select2/defaults',[
  'jquery',
  './results',

  './selection/single',
  './selection/multiple',
  './selection/placeholder',
  './selection/allowClear',
  './selection/search',
  './selection/eventRelay',

  './utils',
  './translation',
  './diacritics',

  './data/select',
  './data/array',
  './data/ajax',
  './data/tags',
  './data/tokenizer',
  './data/minimumInputLength',
  './data/maximumInputLength',
  './data/maximumSelectionLength',

  './dropdown',
  './dropdown/search',
  './dropdown/hidePlaceholder',
  './dropdown/infiniteScroll',
  './dropdown/attachBody',
  './dropdown/minimumResultsForSearch',
  './dropdown/selectOnClose',

  './i18n/en'
], function ($, ResultsList,

             SingleSelection, MultipleSelection, Placeholder, AllowClear,
             SelectionSearch, EventRelay,

             Utils, Translation, DIACRITICS,

             SelectData, ArrayData, AjaxData, Tags, Tokenizer,
             MinimumInputLength, MaximumInputLength, MaximumSelectionLength,

             Dropdown, DropdownSearch, HidePlaceholder, InfiniteScroll,
             AttachBody, MinimumResultsForSearch, SelectOnClose,

             EnglishTranslation) {
  function Defaults () {
    this.reset();
  }

  Defaults.prototype.apply = function (options) {
    options = $.extend({}, this.defaults, options);

    if (options.dataAdapter == null) {
      if (options.ajax != null) {
        options.dataAdapter = AjaxData;
      } else if (options.data != null) {
        options.dataAdapter = ArrayData;
      } else {
        options.dataAdapter = SelectData;
      }

      if (options.minimumInputLength > 0) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          MinimumInputLength
        );
      }

      if (options.maximumInputLength > 0) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          MaximumInputLength
        );
      }

      if (options.maximumSelectionLength > 0) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          MaximumSelectionLength
        );
      }

      if (options.tags != null) {
        options.dataAdapter = Utils.Decorate(options.dataAdapter, Tags);
      }

      if (options.tokenSeparators != null || options.tokenizer != null) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          Tokenizer
        );
      }

      if (options.query != null) {
        var Query = require(options.amdBase + 'compat/query');

        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          Query
        );
      }

      if (options.initSelection != null) {
        var InitSelection = require(options.amdBase + 'compat/initSelection');

        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          InitSelection
        );
      }
    }

    if (options.resultsAdapter == null) {
      options.resultsAdapter = ResultsList;

      if (options.ajax != null) {
        options.resultsAdapter = Utils.Decorate(
          options.resultsAdapter,
          InfiniteScroll
        );
      }

      if (options.placeholder != null) {
        options.resultsAdapter = Utils.Decorate(
          options.resultsAdapter,
          HidePlaceholder
        );
      }

      if (options.selectOnClose) {
        options.resultsAdapter = Utils.Decorate(
          options.resultsAdapter,
          SelectOnClose
        );
      }
    }

    if (options.dropdownAdapter == null) {
      if (options.multiple) {
        options.dropdownAdapter = Dropdown;
      } else {
        var SearchableDropdown = Utils.Decorate(Dropdown, DropdownSearch);

        options.dropdownAdapter = SearchableDropdown;
      }

      if (options.minimumResultsForSearch > 0) {
        options.dropdownAdapter = Utils.Decorate(
          options.dropdownAdapter,
          MinimumResultsForSearch
        );
      }

      options.dropdownAdapter = Utils.Decorate(
        options.dropdownAdapter,
        AttachBody
      );
    }

    if (options.selectionAdapter == null) {
      if (options.multiple) {
        options.selectionAdapter = MultipleSelection;
      } else {
        options.selectionAdapter = SingleSelection;
      }

      // Add the placeholder mixin if a placeholder was specified
      if (options.placeholder != null) {
        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          Placeholder
        );

        if (options.allowClear) {
          options.selectionAdapter = Utils.Decorate(
            options.selectionAdapter,
            AllowClear
          );
        }
      }

      if (options.multiple) {
        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          SelectionSearch
        );
      }

      options.selectionAdapter = Utils.Decorate(
        options.selectionAdapter,
        EventRelay
      );
    }

    if (typeof options.language === 'string') {
      // Check if the lanugage is specified with a region
      if (options.language.indexOf('-') > 0) {
        // Extract the region information if it is included
        var languageParts = options.language.split('-');
        var baseLanguage = languageParts[0];

        options.language = [options.language, baseLanguage];
      } else {
        options.language = [options.language];
      }
    }

    if ($.isArray(options.language)) {
      var languages = new Translation();
      options.language.push('en');

      var languageNames = options.language;

      for (var l = 0; l < languageNames.length; l++) {
        var name = languageNames[l];
        var language = {};

        try {
          // Try to load it with the original name
          language = Translation.loadPath(name);
        } catch (e) {
          try {
            // If we couldn't load it, check if it wasn't the full path
            name = this.defaults.amdLanguageBase + name;
            language = Translation.loadPath(name);
          } catch (ex) {
            // The translation could not be loaded at all. Sometimes this is
            // because of a configuration problem, other times this can be
            // because of how Select2 helps load all possible translation files.
            if (console && console.warn) {
              console.warn(
                'Select2: The lanugage file for "' + name + '" could not be ' +
                'automatically loaded. A fallback will be used instead.'
              );
            }

            continue;
          }
        }

        languages.extend(language);
      }

      options.translations = languages;
    } else {
      options.translations = new Translation(options.language);
    }

    return options;
  };

  Defaults.prototype.reset = function () {
    function stripDiacritics (text) {
      // Used 'uni range + named function' from http://jsperf.com/diacritics/18
      function match(a) {
        return DIACRITICS[a] || a;
      }

      return text.replace(/[^\u0000-\u007E]/g, match);
    }

    function matcher (params, data) {
      // Always return the object if there is nothing to compare
      if ($.trim(params.term) === '') {
        return data;
      }

      // Do a recursive check for options with children
      if (data.children && data.children.length > 0) {
        // Clone the data object if there are children
        // This is required as we modify the object to remove any non-matches
        var match = $.extend(true, {}, data);

        // Check each child of the option
        for (var c = data.children.length - 1; c >= 0; c--) {
          var child = data.children[c];

          var matches = matcher(params, child);

          // If there wasn't a match, remove the object in the array
          if (matches == null) {
            match.children.splice(c, 1);
          }
        }

        // If any children matched, return the new object
        if (match.children.length > 0) {
          return match;
        }

        // If there were no matching children, check just the plain object
        return matcher(params, match);
      }

      var original = stripDiacritics(data.text).toUpperCase();
      var term = stripDiacritics(params.term).toUpperCase();

      // Check if the text contains the term
      if (original.indexOf(term) > -1) {
        return data;
      }

      // If it doesn't contain the term, don't return anything
      return null;
    }

    this.defaults = {
      amdBase: 'select2/',
      amdLanguageBase: 'select2/i18n/',
      language: EnglishTranslation,
      matcher: matcher,
      minimumInputLength: 0,
      maximumInputLength: 0,
      maximumSelectionLength: 0,
      minimumResultsForSearch: 0,
      selectOnClose: false,
      sorter: function (data) {
        return data;
      },
      templateResult: function (result) {
        return result.text;
      },
      templateSelection: function (selection) {
        return selection.text;
      },
      theme: 'default',
      width: 'resolve'
    };
  };

  Defaults.prototype.set = function (key, value) {
    var camelKey = $.camelCase(key);

    var data = {};
    data[camelKey] = value;

    var convertedData = Utils._convertData(data);

    $.extend(this.defaults, convertedData);
  };

  var defaults = new Defaults();

  return defaults;
});

define('select2/options',[
  'jquery',
  './defaults',
  './utils'
], function ($, Defaults, Utils) {
  function Options (options, $element) {
    this.options = options;

    if ($element != null) {
      this.fromElement($element);
    }

    this.options = Defaults.apply(this.options);
  }

  Options.prototype.fromElement = function ($e) {
    var excludedData = ['select2'];

    if (this.options.multiple == null) {
      this.options.multiple = $e.prop('multiple');
    }

    if (this.options.disabled == null) {
      this.options.disabled = $e.prop('disabled');
    }

    if (this.options.language == null) {
      if ($e.prop('lang')) {
        this.options.language = $e.prop('lang').toLowerCase();
      } else if ($e.closest('[lang]').prop('lang')) {
        this.options.language = $e.closest('[lang]').prop('lang');
      }
    }

    if (this.options.dir == null) {
      if ($e.prop('dir')) {
        this.options.dir = $e.prop('dir');
      } else if ($e.closest('[dir]').prop('dir')) {
        this.options.dir = $e.closest('[dir]').prop('dir');
      } else {
        this.options.dir = 'ltr';
      }
    }

    $e.prop('disabled', this.options.disabled);
    $e.prop('multiple', this.options.multiple);

    if ($e.data('select2-tags')) {
      if (console && console.warn) {
        console.warn(
          'Select2: The `data-select2-tags` attribute has been changed to ' +
          'use the `data-data` and `data-tags="true"` attributes and will be ' +
          'removed in future versions of Select2.'
        );
      }

      $e.data('data', $e.data('select2-tags'));
      $e.data('tags', true);
    }

    if ($e.data('ajax-url')) {
      if (console && console.warn) {
        console.warn(
          'Select2: The `data-ajax-url` attribute has been changed to ' +
          '`data-ajax--url` and support for the old attribute will be removed' +
          ' in future versions of Select2.'
        );
      }

      $e.data('ajax--url', $e.data('ajax-url'));
    }

    var data = $e.data();

    data = Utils._convertData(data);

    for (var key in data) {
      if (excludedData.indexOf(key) > -1) {
        continue;
      }

      if ($.isPlainObject(this.options[key])) {
        $.extend(this.options[key], data[key]);
      } else {
        this.options[key] = data[key];
      }
    }

    return this;
  };

  Options.prototype.get = function (key) {
    return this.options[key];
  };

  Options.prototype.set = function (key, val) {
    this.options[key] = val;
  };

  return Options;
});

define('select2/core',[
  'jquery',
  './options',
  './utils',
  './keys'
], function ($, Options, Utils, KEYS) {
  var Select2 = function ($element, options) {
    if ($element.data('select2') != null) {
      $element.data('select2').destroy();
    }

    this.$element = $element;

    this.id = this._generateId($element);

    options = options || {};

    this.options = new Options(options, $element);

    Select2.__super__.constructor.call(this);

    // Set up containers and adapters

    var DataAdapter = this.options.get('dataAdapter');
    this.data = new DataAdapter($element, this.options);

    var $container = this.render();

    this._placeContainer($container);

    var SelectionAdapter = this.options.get('selectionAdapter');
    this.selection = new SelectionAdapter($element, this.options);
    this.$selection = this.selection.render();

    this.selection.position(this.$selection, $container);

    var DropdownAdapter = this.options.get('dropdownAdapter');
    this.dropdown = new DropdownAdapter($element, this.options);
    this.$dropdown = this.dropdown.render();

    this.dropdown.position(this.$dropdown, $container);

    var ResultsAdapter = this.options.get('resultsAdapter');
    this.results = new ResultsAdapter($element, this.options, this.data);
    this.$results = this.results.render();

    this.results.position(this.$results, this.$dropdown);

    // Bind events

    var self = this;

    // Bind the container to all of the adapters
    this._bindAdapters();

    // Register any DOM event handlers
    this._registerDomEvents();

    // Register any internal event handlers
    this._registerDataEvents();
    this._registerSelectionEvents();
    this._registerDropdownEvents();
    this._registerResultsEvents();
    this._registerEvents();

    // Set the initial state
    this.data.current(function (initialData) {
      self.trigger('selection:update', {
        data: initialData
      });
    });

    // Hide the original select
    $element.hide();

    // Synchronize any monitored attributes
    this._syncAttributes();

    this._tabindex = $element.attr('tabindex') || 0;

    $element.attr('tabindex', '-1');

    $element.data('select2', this);
  };

  Utils.Extend(Select2, Utils.Observable);

  Select2.prototype._generateId = function ($element) {
    var id = '';

    if ($element.attr('id') != null) {
      id = $element.attr('id');
    } else if ($element.attr('name') != null) {
      id = $element.attr('name') + '-' + Utils.generateChars(2);
    } else {
      id = Utils.generateChars(4);
    }

    id = 'select2-' + id;

    return id;
  };

  Select2.prototype._placeContainer = function ($container) {
    $container.insertAfter(this.$element);

    var width = this._resolveWidth(this.$element, this.options.get('width'));

    if (width != null) {
      $container.css('width', width);
    }
  };

  Select2.prototype._resolveWidth = function ($element, method) {
    var WIDTH = /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;

    if (method == 'resolve') {
      var styleWidth = this._resolveWidth($element, 'style');

      if (styleWidth != null) {
        return styleWidth;
      }

      return this._resolveWidth($element, 'element');
    }

    if (method == 'element') {
      var elementWidth = $element.outerWidth(false);

      if (elementWidth <= 0) {
        return 'auto';
      }

      return elementWidth + 'px';
    }

    if (method == 'style') {
      var style = $element.attr('style');

      if (typeof(style) !== 'string') {
        return null;
      }

      var attrs = style.split(';');

      for (i = 0, l = attrs.length; i < l; i = i + 1) {
        attr = attrs[i].replace(/\s/g, '');
        var matches = attr.match(WIDTH);

        if (matches !== null && matches.length >= 1) {
          return matches[1];
        }
      }

      return null;
    }

    return method;
  };

  Select2.prototype._bindAdapters = function () {
    this.data.bind(this, this.$container);
    this.selection.bind(this, this.$container);

    this.dropdown.bind(this, this.$container);
    this.results.bind(this, this.$container);
  };

  Select2.prototype._registerDomEvents = function () {
    var self = this;

    this.$element.on('change.select2', function () {
      self.data.current(function (data) {
        self.trigger('selection:update', {
          data: data
        });
      });
    });

    this._sync = Utils.bind(this._syncAttributes, this);

    if (this.$element[0].attachEvent) {
      this.$element[0].attachEvent('onpropertychange', this._sync);
    }

    var observer = window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver
    ;

    if (observer != null) {
      this._observer = new observer(function (mutations) {
        $.each(mutations, self._sync);
      });
      this._observer.observe(this.$element[0], {
        attributes: true,
        subtree: false
      });
    }
  };

  Select2.prototype._registerDataEvents = function () {
    var self = this;

    this.data.on('*', function (name, params) {
      self.trigger(name, params);
    });
  };

  Select2.prototype._registerSelectionEvents = function () {
    var self = this;
    var nonRelayEvents = ['toggle'];

    this.selection.on('toggle', function () {
      self.toggleDropdown();
    });

    this.selection.on('*', function (name, params) {
      if (nonRelayEvents.indexOf(name) !== -1) {
        return;
      }

      self.trigger(name, params);
    });
  };

  Select2.prototype._registerDropdownEvents = function () {
    var self = this;

    this.dropdown.on('*', function (name, params) {
      self.trigger(name, params);
    });
  };

  Select2.prototype._registerResultsEvents = function () {
    var self = this;

    this.results.on('*', function (name, params) {
      self.trigger(name, params);
    });
  };

  Select2.prototype._registerEvents = function () {
    var self = this;

    this.on('open', function () {
      self.$container.addClass('select2-container--open');
    });

    this.on('close', function () {
      self.$container.removeClass('select2-container--open');
    });

    this.on('enable', function () {
      self.$container.removeClass('select2-container--disabled');
    });

    this.on('disable', function () {
      self.$container.addClass('select2-container--disabled');
    });

    this.on('query', function (params) {
      this.data.query(params, function (data) {
        self.trigger('results:all', {
          data: data,
          query: params
        });
      });
    });

    this.on('query:append', function (params) {
      this.data.query(params, function (data) {
        self.trigger('results:append', {
          data: data,
          query: params
        });
      });
    });

    this.on('keypress', function (evt) {
      var key = evt.which;

      if (self.isOpen()) {
        if (key === KEYS.ENTER) {
          self.trigger('results:select');

          evt.preventDefault();
        } else if (key === KEYS.UP) {
          self.trigger('results:previous');

          evt.preventDefault();
        } else if (key === KEYS.DOWN) {
          self.trigger('results:next');

          evt.preventDefault();
        } else if (key === KEYS.ESC || key === KEYS.TAB) {
          self.close();

          evt.preventDefault();
        }
      } else {
        if (key === KEYS.ENTER || key === KEYS.SPACE ||
            ((key === KEYS.DOWN || key === KEYS.UP) && evt.altKey)) {
          self.open();

          evt.preventDefault();
        }
      }
    });
  };

  Select2.prototype._syncAttributes = function () {
    this.options.set('disabled', this.$element.prop('disabled'));

    if (this.options.get('disabled')) {
      if (this.isOpen()) {
        this.close();
      }

      this.trigger('disable');
    } else {
      this.trigger('enable');
    }
  };

  /**
   * Override the trigger method to automatically trigger pre-events when
   * there are events that can be prevented.
   */
  Select2.prototype.trigger = function (name, args) {
    var actualTrigger = Select2.__super__.trigger;
    var preTriggerMap = {
      'open': 'opening',
      'close': 'closing',
      'select': 'selecting',
      'unselect': 'unselecting'
    };

    if (name in preTriggerMap) {
      var preTriggerName = preTriggerMap[name];
      var preTriggerArgs = {
        prevented: false,
        name: name,
        args: args
      };

      actualTrigger.call(this, preTriggerName, preTriggerArgs);

      if (preTriggerArgs.prevented) {
        args.prevented = true;

        return;
      }
    }

    actualTrigger.call(this, name, args);
  };

  Select2.prototype.toggleDropdown = function () {
    if (this.options.get('disabled')) {
      return;
    }

    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  };

  Select2.prototype.open = function () {
    if (this.isOpen()) {
      return;
    }

    this.trigger('query', {});

    this.trigger('open');
  };

  Select2.prototype.close = function () {
    if (!this.isOpen()) {
      return;
    }

    this.trigger('close');
  };

  Select2.prototype.isOpen = function () {
    return this.$container.hasClass('select2-container--open');
  };

  Select2.prototype.enable = function (args) {
    if (console && console.warn) {
      console.warn(
        'Select2: The `select2("enable")` method has been deprecated and will' +
        ' be removed in later Select2 versions. Use $element.prop("disabled")' +
        ' instead.'
      );
    }

    if (args.length === 0) {
      args = [true];
    }

    var disabled = !args[0];

    this.$element.prop('disabled', disabled);
  };

  Select2.prototype.val = function (args) {
    if (console && console.warn) {
      console.warn(
        'Select2: The `select2("val")` method has been deprecated and will be' +
        ' removed in later Select2 versions. Use $element.val() instead.'
      );
    }

    if (args.length === 0) {
      return this.$element.val();
    }

    var newVal = args[0];

    if ($.isArray(newVal)) {
      newVal = $.map(newVal, function (obj) {
        return obj.toString();
      });
    }

    this.$element.val(newVal).trigger('change');
  };

  Select2.prototype.destroy = function () {
    this.$container.remove();

    if (this.$element[0].detachEvent) {
      this.$element[0].detachEvent('onpropertychange', this._sync);
    }

    if (this._observer != null) {
      this._observer.disconnect();
      this._observer = null;
    }

    this._sync = null;

    this.$element.off('.select2');
    this.$element.attr('tabindex', this._tabindex);

    this.$element.show();
    this.$element.removeData('select2');

    this.data.destroy();
    this.selection.destroy();
    this.dropdown.destroy();
    this.results.destroy();

    this.data = null;
    this.selection = null;
    this.dropdown = null;
    this.results = null;
  };

  Select2.prototype.render = function () {
    var $container = $(
      '<span class="select2 select2-container">' +
        '<span class="selection"></span>' +
        '<span class="dropdown-wrapper" aria-hidden="true"></span>' +
      '</span>'
    );

    $container.attr('dir', this.options.get('dir'));

    this.$container = $container;

    this.$container.addClass('select2-container--' + this.options.get('theme'));

    $container.data('element', this.$element);

    return $container;
  };

  return Select2;
});

define('jquery.select2',[
  'jquery',
  './select2/core',
  './select2/defaults'
], function ($, Select2, Defaults) {
  // Force jQuery.mousewheel to be loaded if it hasn't already
  try {
    require('jquery.mousewheel');
  } catch (Exception) { }

  if ($.fn.select2 == null) {
    $.fn.select2 = function (options) {
      options = options || {};

      if (typeof options === 'object') {
        this.each(function () {
          var instanceOptions = $.extend({}, options, true);

          var instance = new Select2($(this), instanceOptions);
        });

        return this;
      } else if (typeof options === 'string') {
        var instance = this.data('select2');
        var args = Array.prototype.slice.call(arguments, 1);

        return instance[options](args);
      } else {
        throw new Error('Invalid arguments for Select2: ' + options);
      }
    };
  }

  if ($.fn.select2.defaults == null) {
    $.fn.select2.defaults = Defaults;
  }

  return Select2;
});

require('jquery.select2'); jQuery.fn.select2.amd = { define: define, require: require }; }());
(function(){if(window.define)var e=window.define;if(window.require)var t=window.require;if(window.jQuery&&jQuery.fn&&jQuery.fn.select2&&jQuery.fn.select2.amd)var e=jQuery.fn.select2.amd.define,t=jQuery.fn.select2.amd.require;e("select2/i18n/vi",[],function(){return{inputTooLong:function(e){var t=e.input.length-e.maximum,n="Vui lòng nhập ít hơn "+t+" ký tự";return t!=1&&(n+="s"),n},inputTooShort:function(e){var t=e.minimum-e.input.length,n="Vui lòng nhập nhiều hơn "+t+' ký tự"';return n},loadingMore:function(){return"Đang lấy thêm kết quả…"},maximumSelected:function(e){var t="Chỉ có thể chọn được "+e.maximum+" lựa chọn";return t},noResults:function(){return"Không tìm thấy kết quả"},searching:function(){return"Đang tìm…"}}}),t("jquery.select2"),jQuery.fn.select2.amd={define:e,require:t}})();
/*!
 * Validator v0.6.0 for Bootstrap 3, by @1000hz
 * Copyright 2014 Spiceworks, Inc.
 * Licensed under http://opensource.org/licenses/MIT
 *
 * https://github.com/1000hz/bootstrap-validator
 */

+function ($) {
  'use strict';

  // VALIDATOR CLASS DEFINITION
  // ==========================

  var Validator = function (element, options) {
    this.$element = $(element)
    this.options  = options

    this.$element.attr('novalidate', true) // disable automatic native validation
    this.toggleSubmit()

    this.$element.on('input.bs.validator change.bs.validator focusout.bs.validator', $.proxy(this.validateInput, this))
    this.$element.on('submit.bs.validator', $.proxy(this.onSubmit, this))

    this.$element.find('[data-match]').each(function () {
      var $this  = $(this)
      var target = $this.data('match')

      $(target).on('input.bs.validator', function (e) {
        $this.val() && $this.trigger('input')
      })
    })
  }

  Validator.DEFAULTS = {
    delay: 500,
    html: false,
    errors: {
      match: 'Does not match',
      minlength: 'Not long enough'
    }
  }

  Validator.VALIDATORS = {
    native: function ($el) {
      var el = $el[0]
      return el.checkValidity ? el.checkValidity() : true
    },
    match: function ($el) {
      var target = $el.data('match')
      return !$el.val() || $el.val() === $(target).val()
    },
    minlength: function ($el) {
      var minlength = $el.data('minlength')
      return !$el.val() || $el.val().length >= minlength
    }
  }

  Validator.prototype.validateInput = function (e) {
    var $el        = $(e.target)
    var prevErrors = $el.data('bs.validator.errors')
    var errors

    if ($el.is('[type="radio"]')) $el = this.$element.find('input[name="' + $el.attr('name') + '"]')

    this.$element.trigger(e = $.Event('validate.bs.validator', {relatedTarget: $el[0]}))

    if (e.isDefaultPrevented()) return

    var self = this

    this.runValidators($el).done(function (errors) {
      $el.data('bs.validator.errors', errors)

      errors.length ? self.showErrors($el) : self.clearErrors($el)

      if (!prevErrors || errors.toString() !== prevErrors.toString()) {
        e = errors.length
          ? $.Event('invalid.bs.validator', {relatedTarget: $el[0], detail: errors})
          : $.Event('valid.bs.validator', {relatedTarget: $el[0], detail: prevErrors})

        self.$element.trigger(e)
      }

      self.toggleSubmit()

      self.$element.trigger($.Event('validated.bs.validator', {relatedTarget: $el[0]}))
    })
  }


  Validator.prototype.runValidators = function ($el) {
    var errors     = []
    var validators = [Validator.VALIDATORS.native]
    var deferred   = $.Deferred()
    var options    = this.options

    $el.data('bs.validator.deferred') && $el.data('bs.validator.deferred').reject()
    $el.data('bs.validator.deferred', deferred)

    function getErrorMessage(key) {
      return $el.data(key + '-error')
        || $el.data('error')
        || key == 'native' && $el[0].validationMessage
        || options.errors[key]
    }

    $.each(Validator.VALIDATORS, $.proxy(function (key, validator) {
      if (($el.data(key) || key == 'native') && !validator.call(this, $el)) {
        var error = getErrorMessage(key)
        !~errors.indexOf(error) && errors.push(error)
      }
    }, this))

    if (!errors.length && $el.val() && $el.data('remote')) {
      this.defer($el, function () {
        $.get($el.data('remote'), [$el.attr('name'), $el.val()].join('='))
          .fail(function (jqXHR, textStatus, error) { errors.push(getErrorMessage('remote') || error) })
          .always(function () { deferred.resolve(errors)})
      })
    } else deferred.resolve(errors)

    return deferred.promise()
  }

  Validator.prototype.validate = function () {
    var delay = this.options.delay

    this.options.delay = 0
    this.$element.find(':input').trigger('input')
    this.options.delay = delay

    return this
  }

  Validator.prototype.showErrors = function ($el) {
    var method = this.options.html ? 'html' : 'text'

    this.defer($el, function () {
      var $group = $el.closest('.form-group')
      var $block = $group.find('.help-block.with-errors')
      var errors = $el.data('bs.validator.errors')

      if (!errors.length) return

      errors = $('<ul/>')
        .addClass('list-unstyled')
        .append($.map(errors, function (error) { return $('<li/>')[method](error) }))

      $block.data('bs.validator.originalContent') === undefined && $block.data('bs.validator.originalContent', $block.html())
      $block.empty().append(errors)

      $group.addClass('has-error')
    })
  }

  Validator.prototype.clearErrors = function ($el) {
    var $group = $el.closest('.form-group')
    var $block = $group.find('.help-block.with-errors')

    $block.html($block.data('bs.validator.originalContent'))
    $group.removeClass('has-error')
  }

  Validator.prototype.hasErrors = function () {
    function fieldErrors() {
      return !!($(this).data('bs.validator.errors') || []).length
    }

    return !!this.$element.find(':input:enabled').filter(fieldErrors).length
  }

  Validator.prototype.isIncomplete = function () {
    function fieldIncomplete() {
      return this.type === 'checkbox' ? !this.checked                                   :
             this.type === 'radio'    ? !$('[name="' + this.name + '"]:checked').length :
                                        $.trim(this.value) === ''
    }

    return !!this.$element.find(':input[required]:enabled').filter(fieldIncomplete).length
  }

  Validator.prototype.onSubmit = function (e) {
    this.validate()
    if (this.isIncomplete() || this.hasErrors()) e.preventDefault()
  }

  Validator.prototype.toggleSubmit = function () {
    var $btn = this.$element.find('input[type="submit"], button[type="submit"]')
    $btn.toggleClass('disabled', this.isIncomplete() || this.hasErrors())
      .css({'pointer-events': 'all', 'cursor': 'pointer'})
  }

  Validator.prototype.defer = function ($el, callback) {
    if (!this.options.delay) return callback()
    window.clearTimeout($el.data('bs.validator.timeout'))
    $el.data('bs.validator.timeout', window.setTimeout(callback, this.options.delay))
  }

  Validator.prototype.destroy = function () {
    this.$element
      .removeAttr('novalidate')
      .removeData('bs.validator')
      .off('.bs.validator')

    this.$element.find(':input')
      .removeData(['bs.validator.errors', 'bs.validator.deferred', 'bs.validator.timeout'])
      .off('.bs.validator')

    this.$element.find('.help-block.with-errors').each(function () {
      var $this = $(this)
      var originalContent = $this.data('bs.validator.originalContent')

      $this
        .removeData('bs.validator.originalContent')
        .html(originalContent)
    })

    this.$element.find('input[type="submit"], button[type="submit"]').removeClass('disabled')

    this.$element.find('.has-error').removeClass('has-error')

    return this
  }

  // VALIDATOR PLUGIN DEFINITION
  // ===========================


  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var options = $.extend({}, Validator.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var data    = $this.data('bs.validator')

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.validator', (data = new Validator(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.validator

  $.fn.validator             = Plugin
  $.fn.validator.Constructor = Validator


  // VALIDATOR NO CONFLICT
  // =====================

  $.fn.validator.noConflict = function () {
    $.fn.validator = old
    return this
  }


  // VALIDATOR DATA-API
  // ==================

  $(window).on('load', function () {
    $('form[data-toggle="validator"]').each(function () {
      var $form = $(this)
      Plugin.call($form, $form.data())
    })
  })

}(jQuery);
