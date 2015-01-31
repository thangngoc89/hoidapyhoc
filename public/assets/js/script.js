/**
 * jQuery alterClass plugin
 *
 * Remove element classes with wildcard matching. Optionally add classes:
 *   $( '#foo' ).alterClass( 'foo-* bar-*', 'foobar' )
 *
 * Copyright (c) 2011 Pete Boere (the-echoplex.net)
 * Free under terms of the MIT license: http://www.opensource.org/licenses/mit-license.php
 *
 */
(function ( $ ) {

    $.fn.alterClass = function ( removals, additions ) {

        var self = this;

        if ( removals.indexOf( '*' ) === -1 ) {
            // Use native jQuery methods if there is no wildcard matching
            self.removeClass( removals );
            return !additions ? self : self.addClass( additions );
        }

        var patt = new RegExp( '\\s' +
        removals.
            replace( /\*/g, '[A-Za-z0-9-_]+' ).
            split( ' ' ).
            join( '\\s|\\s' ) +
        '\\s', 'g' );

        self.each( function ( i, it ) {
            var cn = ' ' + it.className + ' ';
            while ( patt.test( cn ) ) {
                cn = cn.replace( patt, ' ' );
            }
            it.className = $.trim( cn );
        });

        return !additions ? self : self.addClass( additions );
    };

})( jQuery );
/*!
 * jQuery Upload File Plugin
 * version: 3.1.10
 * @requires jQuery v1.5 or later & form plugin
 * Copyright (c) 2013 Ravishanker Kusuma
 * http://hayageek.com/
 */
(function ($) {
    if($.fn.ajaxForm == undefined) {
        $.getScript(("https:" == document.location.protocol ? "https://" : "http://") + "malsup.github.io/jquery.form.js");
    }
    var feature = {};
    feature.fileapi = $("<input type='file'/>").get(0).files !== undefined;
    feature.formdata = window.FormData !== undefined;
    $.fn.uploadFile = function (options) {
        // This is the easiest way to have default options.
        var s = $.extend({
            // These are the defaults.
            url: "",
            method: "POST",
            enctype: "multipart/form-data",
            returnType: null,
            allowDuplicates: true,
            duplicateStrict: false,
            allowedTypes: "*",
            //For list of acceptFiles
            // http://stackoverflow.com/questions/11832930/html-input-file-accept-attribute-file-type-csv
            acceptFiles: "*",
            fileName: "file",
            formData: {},
            dynamicFormData: function () {
                return {};
            },
            maxFileSize: -1,
            maxFileCount: -1,
            multiple: true,
            dragDrop: true,
            autoSubmit: true,
            showCancel: true,
            showAbort: true,
            showDone: true,
            showDelete: false,
            showError: true,
            showStatusAfterSuccess: true,
            showStatusAfterError: true,
            showFileCounter: true,
            fileCounterStyle: "). ",
            showProgress: false,
            nestedForms: true,
            showDownload: false,
            onLoad: function (obj) {},
            onSelect: function (files) {
                return true;
            },
            onSubmit: function (files, xhr) {},
            onSuccess: function (files, response, xhr, pd) {},
            onError: function (files, status, message, pd) {},
            onCancel: function (files, pd) {},
            downloadCallback: false,
            deleteCallback: false,
            afterUploadAll: false,
            abortButtonClass: "ajax-file-upload-abort",
            cancelButtonClass: "ajax-file-upload-cancel",
            dragDropContainerClass: "ajax-upload-dragdrop",
            dragDropHoverClass: "state-hover",
            errorClass: "ajax-file-upload-error",
            uploadButtonClass: "ajax-file-upload",
            dragDropStr: "<span><b>Drag &amp; Drop Files</b></span>",
            abortStr: "Abort",
            cancelStr: "Cancel",
            deletelStr: "Delete",
            doneStr: "Done",
            multiDragErrorStr: "Multiple File Drag &amp; Drop is not allowed.",
            extErrorStr: "is not allowed. Allowed extensions: ",
            duplicateErrorStr: "is not allowed. File already exists.",
            sizeErrorStr: "is not allowed. Allowed Max size: ",
            uploadErrorStr: "Upload is not allowed",
            maxFileCountErrorStr: " is not allowed. Maximum allowed files are:",
            downloadStr: "Download",
            customErrorKeyStr: "jquery-upload-file-error",
            showQueueDiv: false,
            statusBarWidth: 500,
            dragdropWidth: 500,
            showPreview: false,
            previewHeight: "auto",
            previewWidth: "100%",
            uploadFolder:"uploads/"
        }, options);

        this.fileCounter = 1;
        this.selectedFiles = 0;
        this.fCounter = 0; //failed uploads
        this.sCounter = 0; //success uploads
        this.tCounter = 0; //total uploads
        var formGroup = "ajax-file-upload-" + (new Date().getTime());
        this.formGroup = formGroup;
        this.hide();
        this.errorLog = $("<div></div>"); //Writing errors
        this.after(this.errorLog);
        this.responses = [];
        this.existingFileNames = [];
        if(!feature.formdata) //check drag drop enabled.
        {
            s.dragDrop = false;
        }
        if(!feature.formdata) {
            s.multiple = false;
        }

        var obj = this;
        var uploadLabel = $('<div>' + $(this).html() + '</div>');
        $(uploadLabel).addClass(s.uploadButtonClass);

        // wait form ajax Form plugin and initialize
        (function checkAjaxFormLoaded() {
            if($.fn.ajaxForm) {

                if(s.dragDrop) {
                    var dragDrop = $('<div class="' + s.dragDropContainerClass + '" style="vertical-align:top;"></div>').width(s.dragdropWidth);
                    $(obj).before(dragDrop);
                    $(dragDrop).append(uploadLabel);
                    $(dragDrop).append($(s.dragDropStr));
                    setDragDropHandlers(obj, s, dragDrop);

                } else {
                    $(obj).before(uploadLabel);
                }
                s.onLoad.call(this, obj);
                createCutomInputFile(obj, formGroup, s, uploadLabel);

            } else window.setTimeout(checkAjaxFormLoaded, 10);
        })();

        this.startUpload = function () {
            $("." + this.formGroup).each(function (i, items) {
                if($(this).is('form')) $(this).submit();
            });
        }

        this.getFileCount = function () {
            return obj.selectedFiles;

        }
        this.stopUpload = function () {
            $("." + s.abortButtonClass).each(function (i, items) {
                if($(this).hasClass(obj.formGroup)) $(this).click();
            });
        }
        this.cancelAll = function () {
            $("." + s.cancelButtonClass).each(function (i, items) {
                if($(this).hasClass(obj.formGroup)) $(this).click();
            });
        }
        this.update = function (settings) {
            //update new settings
            s = $.extend(s, settings);
        }

        //This is for showing Old files to user.
        this.createProgress = function (filename) {
            var pd = new createProgressDiv(this, s);
            pd.progressDiv.show();
            pd.progressbar.width('100%');

            var fileNameStr = "";
            if(s.showFileCounter) fileNameStr = obj.fileCounter + s.fileCounterStyle + filename;
            else fileNameStr = filename;

            pd.filename.html(fileNameStr);
            obj.fileCounter++;
            obj.selectedFiles++;
            if(s.showPreview)
            {
                pd.preview.attr('src',s.uploadFolder+filename);
                pd.preview.show();
            }
            
            if(s.showDownload) {
                pd.download.show();
                pd.download.click(function () {
                    if(s.downloadCallback) s.downloadCallback.call(obj, [filename]);
                });
            }
            pd.del.show();

            pd.del.click(function () {
                pd.statusbar.hide().remove();
                var arr = [filename];
                if(s.deleteCallback) s.deleteCallback.call(this, arr, pd);
                obj.selectedFiles -= 1;
                updateFileCounter(s, obj);
            });

        }

        this.getResponses = function () {
            return this.responses;
        }
        var checking = false;

        function checkPendingUploads() {
            if(s.afterUploadAll && !checking) {
                checking = true;
                (function checkPending() {
                    if(obj.sCounter != 0 && (obj.sCounter + obj.fCounter == obj.tCounter)) {
                        s.afterUploadAll(obj);
                        checking = false;
                    } else window.setTimeout(checkPending, 100);
                })();
            }

        }

        function setDragDropHandlers(obj, s, ddObj) {
            ddObj.on('dragenter', function (e) {
                e.stopPropagation();
                e.preventDefault();
                $(this).addClass(s.dragDropHoverClass);
            });
            ddObj.on('dragover', function (e) {
                e.stopPropagation();
                e.preventDefault();
                var that = $(this);
                if (that.hasClass(s.dragDropContainerClass) && !that.hasClass(s.dragDropHoverClass)) {
                    that.addClass(s.dragDropHoverClass);
                }
            });
            ddObj.on('drop', function (e) {
                e.preventDefault();
                $(this).removeClass(s.dragDropHoverClass);
                obj.errorLog.html("");
                var files = e.originalEvent.dataTransfer.files;
                if(!s.multiple && files.length > 1) {
                    if(s.showError) $("<div class='" + s.errorClass + "'>" + s.multiDragErrorStr + "</div>").appendTo(obj.errorLog);
                    return;
                }
                if(s.onSelect(files) == false) return;
                serializeAndUploadFiles(s, obj, files);
            });
            ddObj.on('dragleave', function (e) {
                $(this).removeClass(s.dragDropHoverClass);
            });

            $(document).on('dragenter', function (e) {
                e.stopPropagation();
                e.preventDefault();
            });
            $(document).on('dragover', function (e) {
                e.stopPropagation();
                e.preventDefault();
                var that = $(this);
                if (!that.hasClass(s.dragDropContainerClass)) {
                    that.removeClass(s.dragDropHoverClass);
                }
            });
            $(document).on('drop', function (e) {
                e.stopPropagation();
                e.preventDefault();
                $(this).removeClass(s.dragDropHoverClass);
            });

        }

        function getSizeStr(size) {
            var sizeStr = "";
            var sizeKB = size / 1024;
            if(parseInt(sizeKB) > 1024) {
                var sizeMB = sizeKB / 1024;
                sizeStr = sizeMB.toFixed(2) + " MB";
            } else {
                sizeStr = sizeKB.toFixed(2) + " KB";
            }
            return sizeStr;
        }

        function serializeData(extraData) {
            var serialized = [];
            if(jQuery.type(extraData) == "string") {
                serialized = extraData.split('&');
            } else {
                serialized = $.param(extraData).split('&');
            }
            var len = serialized.length;
            var result = [];
            var i, part;
            for(i = 0; i < len; i++) {
                serialized[i] = serialized[i].replace(/\+/g, ' ');
                part = serialized[i].split('=');
                result.push([decodeURIComponent(part[0]), decodeURIComponent(part[1])]);
            }
            return result;
        }

        function serializeAndUploadFiles(s, obj, files) {
            for(var i = 0; i < files.length; i++) {
                if(!isFileTypeAllowed(obj, s, files[i].name)) {
                    if(s.showError) $("<div class='" + s.errorClass + "'><b>" + files[i].name + "</b> " + s.extErrorStr + s.allowedTypes + "</div>").appendTo(obj.errorLog);
                    continue;
                }
                if(!s.allowDuplicates && isFileDuplicate(obj, files[i].name)) {
                    if(s.showError) $("<div class='" + s.errorClass + "'><b>" + files[i].name + "</b> " + s.duplicateErrorStr + "</div>").appendTo(obj.errorLog);
                    continue;
                }
                if(s.maxFileSize != -1 && files[i].size > s.maxFileSize) {
                    if(s.showError) $("<div class='" + s.errorClass + "'><b>" + files[i].name + "</b> " + s.sizeErrorStr + getSizeStr(s.maxFileSize) + "</div>").appendTo(
                        obj.errorLog);
                    continue;
                }
                if(s.maxFileCount != -1 && obj.selectedFiles >= s.maxFileCount) {
                    if(s.showError) $("<div class='" + s.errorClass + "'><b>" + files[i].name + "</b> " + s.maxFileCountErrorStr + s.maxFileCount + "</div>").appendTo(
                        obj.errorLog);
                    continue;
                }
                obj.selectedFiles++;
                obj.existingFileNames.push(files[i].name);
                var ts = s;
                var fd = new FormData();
                var fileName = s.fileName.replace("[]", "");
                fd.append(fileName, files[i]);
                var extraData = s.formData;
                if(extraData) {
                    var sData = serializeData(extraData);
                    for(var j = 0; j < sData.length; j++) {
                        if(sData[j]) {
                            fd.append(sData[j][0], sData[j][1]);
                        }
                    }
                }
                ts.fileData = fd;

                var pd = new createProgressDiv(obj, s);
                var fileNameStr = "";
                if(s.showFileCounter) fileNameStr = obj.fileCounter + s.fileCounterStyle + files[i].name
                else fileNameStr = files[i].name;

                pd.filename.html(fileNameStr);
                var form = $("<form style='display:block; position:absolute;left: 150px;' class='" + obj.formGroup + "' method='" + s.method + "' action='" +
                    s.url + "' enctype='" + s.enctype + "'></form>");
                form.appendTo('body');
                var fileArray = [];
                fileArray.push(files[i].name);
                ajaxFormSubmit(form, ts, pd, fileArray, obj, files[i]);
                obj.fileCounter++;
            }
        }

        function isFileTypeAllowed(obj, s, fileName) {
            var fileExtensions = s.allowedTypes.toLowerCase().split(",");
            var ext = fileName.split('.').pop().toLowerCase();
            if(s.allowedTypes != "*" && jQuery.inArray(ext, fileExtensions) < 0) {
                return false;
            }
            return true;
        }

        function isFileDuplicate(obj, filename) {
            var duplicate = false;
            if (obj.existingFileNames.length) {
                for (var x=0; x<obj.existingFileNames.length; x++) {
                    if (obj.existingFileNames[x] == filename
                        || s.duplicateStrict && obj.existingFileNames[x].toLowerCase() == filename.toLowerCase()
                    ) {
                        duplicate = true;
                    }
                }
            }
            return duplicate;
        }

        function removeExistingFileName(obj, fileArr) {
            if (obj.existingFileNames.length) {
                for (var x=0; x<fileArr.length; x++) {
                    var pos = obj.existingFileNames.indexOf(fileArr[x]);
                    if (pos != -1) {
                        obj.existingFileNames.splice(pos, 1);
                    }
                }
            }
        }

        function getSrcToPreview(file, obj) {
            if(file) {
                obj.show();
                var reader = new FileReader();
                reader.onload = function (e) {
                    obj.attr('src', e.target.result);
                };
                reader.readAsDataURL(file);
            }
        }

        function updateFileCounter(s, obj) {
            if(s.showFileCounter) {
                var count = $(".ajax-file-upload-filename").length;
                obj.fileCounter = count + 1;
                $(".ajax-file-upload-filename").each(function (i, items) {
                    var arr = $(this).html().split(s.fileCounterStyle);
                    var fileNum = parseInt(arr[0]) - 1; //decrement;
                    var name = count + s.fileCounterStyle + arr[1];
                    $(this).html(name);
                    count--;
                });
            }
        }

        function createCutomInputFile(obj, group, s, uploadLabel) {

            var fileUploadId = "ajax-upload-id-" + (new Date().getTime());

            var form = $("<form method='" + s.method + "' action='" + s.url + "' enctype='" + s.enctype + "'></form>");
            var fileInputStr = "<input type='file' id='" + fileUploadId + "' name='" + s.fileName + "' accept='" + s.acceptFiles + "'/>";
            if(s.multiple) {
                if(s.fileName.indexOf("[]") != s.fileName.length - 2) // if it does not endwith
                {
                    s.fileName += "[]";
                }
                fileInputStr = "<input type='file' id='" + fileUploadId + "' name='" + s.fileName + "' accept='" + s.acceptFiles + "' multiple/>";
            }
            var fileInput = $(fileInputStr).appendTo(form);

            fileInput.change(function () {

                obj.errorLog.html("");
                var fileExtensions = s.allowedTypes.toLowerCase().split(",");
                var fileArray = [];
                if(this.files) //support reading files
                {
                    for(i = 0; i < this.files.length; i++) {
                        fileArray.push(this.files[i].name);
                    }

                    if(s.onSelect(this.files) == false) return;
                } else {
                    var filenameStr = $(this).val();
                    var flist = [];
                    fileArray.push(filenameStr);
                    if(!isFileTypeAllowed(obj, s, filenameStr)) {
                        if(s.showError) $("<div class='" + s.errorClass + "'><b>" + filenameStr + "</b> " + s.extErrorStr + s.allowedTypes + "</div>").appendTo(
                            obj.errorLog);
                        return;
                    }
                    //fallback for browser without FileAPI
                    flist.push({
                        name: filenameStr,
                        size: 'NA'
                    });
                    if(s.onSelect(flist) == false) return;

                }
                updateFileCounter(s, obj);

                uploadLabel.unbind("click");
                form.hide();
                createCutomInputFile(obj, group, s, uploadLabel);

                form.addClass(group);
                if(feature.fileapi && feature.formdata) //use HTML5 support and split file submission
                {
                    form.removeClass(group); //Stop Submitting when.
                    var files = this.files;
                    serializeAndUploadFiles(s, obj, files);
                } else {
                    var fileList = "";
                    for(var i = 0; i < fileArray.length; i++) {
                        if(s.showFileCounter) fileList += obj.fileCounter + s.fileCounterStyle + fileArray[i] + "<br>";
                        else fileList += fileArray[i] + "<br>";;
                        obj.fileCounter++;

                    }
                    if(s.maxFileCount != -1 && (obj.selectedFiles + fileArray.length) > s.maxFileCount) {
                        if(s.showError) $("<div class='" + s.errorClass + "'><b>" + fileList + "</b> " + s.maxFileCountErrorStr + s.maxFileCount + "</div>").appendTo(
                            obj.errorLog);
                        return;
                    }
                    obj.selectedFiles += fileArray.length;

                    var pd = new createProgressDiv(obj, s);
                    pd.filename.html(fileList);
                    ajaxFormSubmit(form, s, pd, fileArray, obj, null);
                }



            });

            if(s.nestedForms) {
                form.css({
                    'margin': 0,
                    'padding': 0
                });
                uploadLabel.css({
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'default'
                });
                fileInput.css({
                    position: 'absolute',
                    'cursor': 'pointer',
                    'top': '0px',
                    'width': '100%',
                    'height': '100%',
                    'left': '0px',
                    'z-index': '100',
                    'opacity': '0.0',
                    'filter': 'alpha(opacity=0)',
                    '-ms-filter': "alpha(opacity=0)",
                    '-khtml-opacity': '0.0',
                    '-moz-opacity': '0.0'
                });
                form.appendTo(uploadLabel);

            } else {
                form.appendTo($('body'));
                form.css({
                    margin: 0,
                    padding: 0,
                    display: 'block',
                    position: 'absolute',
                    left: '-250px'
                });
                if(navigator.appVersion.indexOf("MSIE ") != -1) //IE Browser
                {
                    uploadLabel.attr('for', fileUploadId);
                } else {
                    uploadLabel.click(function () {
                        fileInput.click();
                    });
                }
            }
        }


        function createProgressDiv(obj, s) {
            this.statusbar = $("<div class='ajax-file-upload-statusbar'></div>").width(s.statusBarWidth);
            this.preview = $("<img class='ajax-file-upload-preview' />").width(s.previewWidth).height(s.previewHeight).appendTo(this.statusbar).hide();
            this.filename = $("<div class='ajax-file-upload-filename'></div>").appendTo(this.statusbar);
            this.progressDiv = $("<div class='ajax-file-upload-progress'>").appendTo(this.statusbar).hide();
            this.progressbar = $("<div class='ajax-file-upload-bar " + obj.formGroup + "'></div>").appendTo(this.progressDiv);
            this.abort = $("<div class='ajax-file-upload-red " + s.abortButtonClass + " " + obj.formGroup + "'>" + s.abortStr + "</div>").appendTo(this.statusbar)
                .hide();
            this.cancel = $("<div class='ajax-file-upload-red " + s.cancelButtonClass + " " + obj.formGroup + "'>" + s.cancelStr + "</div>").appendTo(this.statusbar)
                .hide();
            this.done = $("<div class='ajax-file-upload-green'>" + s.doneStr + "</div>").appendTo(this.statusbar).hide();
            this.download = $("<div class='ajax-file-upload-green'>" + s.downloadStr + "</div>").appendTo(this.statusbar).hide();
            this.del = $("<div class='ajax-file-upload-red'>" + s.deletelStr + "</div>").appendTo(this.statusbar).hide();
            if(s.showQueueDiv)
                $("#" + s.showQueueDiv).append(this.statusbar);
            else
                obj.errorLog.after(this.statusbar);
            return this;
        }


        function ajaxFormSubmit(form, s, pd, fileArray, obj, file) {
            var currentXHR = null;
            var options = {
                cache: false,
                contentType: false,
                processData: false,
                forceSync: false,
                type: s.method,
                data: s.formData,
                formData: s.fileData,
                dataType: s.returnType,
                beforeSubmit: function (formData, $form, options) {
                    if(s.onSubmit.call(this, fileArray) != false) {
                        var dynData = s.dynamicFormData();
                        if(dynData) {
                            var sData = serializeData(dynData);
                            if(sData) {
                                for(var j = 0; j < sData.length; j++) {
                                    if(sData[j]) {
                                        if(s.fileData != undefined) options.formData.append(sData[j][0], sData[j][1]);
                                        else options.data[sData[j][0]] = sData[j][1];
                                    }
                                }
                            }
                        }
                        obj.tCounter += fileArray.length;
                        //window.setTimeout(checkPendingUploads, 1000); //not so critical
                        checkPendingUploads();
                        return true;
                    }
                    pd.statusbar.append("<div class='" + s.errorClass + "'>" + s.uploadErrorStr + "</div>");
                    pd.cancel.show()
                    form.remove();
                    pd.cancel.click(function () {
                        removeExistingFileName(obj, fileArray);
                        pd.statusbar.remove();
                        s.onCancel.call(obj, fileArray, pd);
                        obj.selectedFiles -= fileArray.length; //reduce selected File count
                        updateFileCounter(s, obj);
                    });
                    return false;
                },
                beforeSend: function (xhr, o) {

                    pd.progressDiv.show();
                    pd.cancel.hide();
                    pd.done.hide();
                    if(s.showAbort) {
                        pd.abort.show();
                        pd.abort.click(function () {
                            removeExistingFileName(obj, fileArray);
                            xhr.abort();
                            obj.selectedFiles -= fileArray.length; //reduce selected File count
                        });
                    }
                    if(!feature.formdata) //For iframe based push
                    {
                        pd.progressbar.width('5%');
                    } else pd.progressbar.width('1%'); //Fix for small files
                },
                uploadProgress: function (event, position, total, percentComplete) {
                    //Fix for smaller file uploads in MAC
                    if(percentComplete > 98) percentComplete = 98;

                    var percentVal = percentComplete + '%';
                    if(percentComplete > 1) pd.progressbar.width(percentVal)
                    if(s.showProgress) {
                        pd.progressbar.html(percentVal);
                        pd.progressbar.css('text-align', 'center');
                    }

                },
                success: function (data, message, xhr) {

                    //For custom errors.
                    if(s.returnType == "json" && $.type(data) == "object" && data.hasOwnProperty(s.customErrorKeyStr)) {
                        pd.abort.hide();
                        var msg = data[s.customErrorKeyStr];
                        s.onError.call(this, fileArray, 200, msg, pd);
                        if(s.showStatusAfterError) {
                            pd.progressDiv.hide();
                            pd.statusbar.append("<span class='" + s.errorClass + "'>ERROR: " + msg + "</span>");
                        } else {
                            pd.statusbar.hide();
                            pd.statusbar.remove();
                        }
                        obj.selectedFiles -= fileArray.length; //reduce selected File count
                        form.remove();
                        obj.fCounter += fileArray.length;
                        return;
                    }
                    obj.responses.push(data);
                    pd.progressbar.width('100%')
                    if(s.showProgress) {
                        pd.progressbar.html('100%');
                        pd.progressbar.css('text-align', 'center');
                    }

                    pd.abort.hide();
                    s.onSuccess.call(this, fileArray, data, xhr, pd);
                    if(s.showStatusAfterSuccess) {
                        if(s.showDone) {
                            pd.done.show();
                            pd.done.click(function () {
                                pd.statusbar.hide("slow");
                                pd.statusbar.remove();
                            });
                        } else {
                            pd.done.hide();
                        }
                        if(s.showDelete) {
                            pd.del.show();
                            pd.del.click(function () {
                                pd.statusbar.hide().remove();
                                if(s.deleteCallback) s.deleteCallback.call(this, data, pd);
                                obj.selectedFiles -= fileArray.length; //reduce selected File count
                                updateFileCounter(s, obj);

                            });
                        } else {
                            pd.del.hide();
                        }
                    } else {
                        pd.statusbar.hide("slow");
                        pd.statusbar.remove();

                    }
                    if(s.showDownload) {
                        pd.download.show();
                        pd.download.click(function () {
                            if(s.downloadCallback) s.downloadCallback(data);
                        });
                    }
                    form.remove();
                    obj.sCounter += fileArray.length;
                },
                error: function (xhr, status, errMsg) {
                    pd.abort.hide();
                    if(xhr.statusText == "abort") //we aborted it
                    {
                        pd.statusbar.hide("slow").remove();
                        updateFileCounter(s, obj);

                    } else {
                        s.onError.call(this, fileArray, status, errMsg, pd);
                        if(s.showStatusAfterError) {
                            pd.progressDiv.hide();
                            pd.statusbar.append("<span class='" + s.errorClass + "'>ERROR: " + errMsg + "</span>");
                        } else {
                            pd.statusbar.hide();
                            pd.statusbar.remove();
                        }
                        obj.selectedFiles -= fileArray.length; //reduce selected File count
                    }

                    form.remove();
                    obj.fCounter += fileArray.length;

                }
            };

            if(s.showPreview && file != null) {
                if(file.type.toLowerCase().split("/").shift() == "image") getSrcToPreview(file, pd.preview);
            }

            if(s.autoSubmit) {
                form.ajaxSubmit(options);
            } else {
                if(s.showCancel) {
                    pd.cancel.show();
                    pd.cancel.click(function () {
                        removeExistingFileName(obj, fileArray);
                        form.remove();
                        pd.statusbar.remove();
                        s.onCancel.call(obj, fileArray, pd);
                        obj.selectedFiles -= fileArray.length; //reduce selected File count
                        updateFileCounter(s, obj);
                    });
                }
                form.ajaxForm(options);

            }

        }
        return this;

    }
}(jQuery));

$(function() {
    $.ajaxSetup({
        headers: {
            'X-XSRF-Token': $('meta[name="csrf"]').attr('content')
        }
    });
    $("img").unveil(200);
    $("#q").select2({
        ajax: {
            url: "/api/v2/search",
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term, // search term
                    page: params.page
                };
            },
            cache: true
        },
        minimumInputLength: 1
    });
});

toastr.options = {
    "closeButton": false,
    "debug": false,
    "progressBar": false,
    "positionClass": "toast-bottom-right",
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};



function sticky()
{
    $("#quiz-sidebar, #mainRow").stick_in_parent();
}
function resize_do(){
    width=parseInt($(window).width());
    scrollTop=parseInt($(window).scrollTop());
    if(width<=767){
        if(scrollTop>=100){
            $('#quiz-sidebar').addClass('quiz-side-fixed');
        }
        else{
            $('#quiz-sidebar').removeClass('quiz-side-fixed');
        }
    }
}

function validationError(response)
{
    $.each(response, function(key, object) {
        object.forEach(function(message)
        {
            toastr['warning'](message);
        });
    });
}
function quizDoInt()
{
    resize_do();
    $(window).on('resize', (function(){
        resize_do();
    }))
    .on('scroll', (function(){
        resize_do();
    }));
    $('#btnSheet').on('click', function(){
        $('.quiz-sidebar-section').slideToggle();
    });
    $('.icontest-option').on('click', function(event){
        event.preventDefault();
        toastr.info('Hãy nhấn bắt đầu để làm bài');
    });

    $('#btnSubmit').on('click',function(){
        submitTest();
    });

    $('#btnStart').on('click',function(){

        $('.icontest-option').off('click');
        $('#quiz-content').removeClass('hide');
        $('#quiz-rule').hide();

        $('#btnSubmit').show();
        $('#btnStart').hide();

        sticky();

        toastr.info('Bắt đầu làm bài thôi nào ^_^');
        choiceDo();
        setCounter();
    })
}
function setCounter(){
    counter = setInterval(timer, 1000);
    $.ajax({
        type: "POST",
        dataType: "json",
        url: '/api/v2/tests/'+testId+'/start',
        success: function(data){
            userHistoryId = data.user_history_id;
        }

    });

}
function timer() {
    count = count - 1;
    if (count == -1) {
        clearInterval(counter);
        sendSubmitTest();
        return;
    }

    var seconds = count % 60;
    var minutes = Math.floor(count / 60);
    var hours = Math.floor(minutes / 60);
    minutes %= 60;
    hours %= 60;

    $('.timecou').html(hours + ":" + minutes + ":" + seconds);
}

function submitTest(){
    swal({
            title: "Bạn có muốn nộp bài chứ?",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Có!",
            closeOnConfirm: false
        },
        function(){
            sendSubmitTest();
        });
}
function sendSubmitTest(){
    $.ajax({
        type: "POST",
        dataType: "json",
        beforeSend: function(){
            $("#btnSubmit").button('loading');
        },
        url: $('#frmTest').attr('action'),
        data: {
            'user_history_id': userHistoryId,
            'test_id': testId,
            'answers': gatherAnswer()
        },
        error: function(data){
            console.log(data.responseText);
            toastr.error('Có lỗi xảy ra. Vui lòng kiểm tra kĩ và thử lại');
        },
        success: function(data){

            swal({
                    title: "Bạn làm đúng "+data.score+'/'+data.totalQuestion+' câu hỏi',
                    text: "Bạn có muốn xem lại kết quả chi tiết chứ?",
                    type: "success",
                    showCancelButton: true,
                    confirmButtonClass: "btn-info",
                    confirmButtonText: "Có chứ!",
                    cancelButtonText: "Không, để làm lại!",
                    closeOnConfirm: true,
                    closeOnCancel: true
                },
                function(isConfirm) {
                    if (isConfirm) {
                        location.href = data.url;
                    } else {
                        location.href = location.href;
                    }
                });
        }
    });
}
function gatherAnswer(){
    var answers= [];
    $('.questionRow').each(function(){
        questionId = $(this).data('question-id');
        questionOrder = $(this).data('question-order');
        givenAnswer = $('input[id^="answer_'+questionOrder+'_"][value=1]').attr('name');
        if (!givenAnswer)
        {
            givenAnswer = 0;
        } else {
            // Cut the final char (givenAnswer)
            givenAnswer = givenAnswer.substring(givenAnswer.length-1, givenAnswer.length);
        }
//            answer = {
//                'qID' : questionId,
//                'a' : givenAnswer
//            };
        answers.push(givenAnswer);
    });
    return answers;
}
function choiceDo(){
    $('.icontest-option').on('click', function(event){
        event.preventDefault();
        questionId = $(this).data('question-id');
        questionRow = $(this).parent().parent();
//            Add class answered to row (for counting)
        questionRow.alterClass('unanswered','answered');
        questionOrder = questionRow.data('question-order');

//                Alter all answer in the same question to default value
        var questionLink = $('a[id^="a_'+questionOrder+'_"]');
        var questionInput = $('input[id^="answer_'+questionOrder+'_"]');
//            Remove active class for answers in the same row
        questionLink.each(function(){
            $(this).alterClass('op-*','op-'+$(this).html());
        });
//            Reset input for answers in the same row
        questionInput.each(function(){
            $(this).val(0);
        });
//                Add class and value to current click element
        $(this).alterClass('op-*', 'op-choice');
        $(this).siblings().val(1);

        updateAnswerCount();
    });
}
function updateAnswerCount(){
    answered = $('tr.answered').length;

    $('#answeredCount').html(answered);
    $('.userAnswerCount').attr('value',answered);

    totalAnswer = parseInt($('#totalAnswer').html());
//        Only submit when answered half of questions
    if (answered >= (totalAnswer/2))
        $('#btnSubmit').attr('disabled',null);
}
(function ( $ ) {
    $.fn.quiz = function() {
        data = global.data;

        switch(data.type)
        {
            case 'edit': initEdit(); break;
            case 'create': initCreate(); break;
        }
    };

    var $ele = {
        name: $('#input-name'),
        content: $('#content'),
        description : $('#input-description'),
        begin : $('#begin'),
        tag : $('#select-tags'),
        tabContent : $('#tab-content a'),
        adjustTotal : $('#adjustTotal'),
        answerTable : $("#answer"),
        btnCreateSubmit : $('#btnCreateSubmit'),
    };

    var quiz= {
        postUrl : '/api/v2/tests',
        postAjaxMethod : 'POST',
        answerArray : {},
        preventClose: true
    };

    function initCreate()
    {
        setupQuestion();
        buttonListener();
        iconListener();

        $('#frmTest').on('submit', function(event)
        {
            event.preventDefault();
            post();
        });
        sticky();
        editor();
        uploader();
        

        preventClosing();

    }

    function initEdit()
    {
        test = global.data.test;

        $ele.name.val(test.name);
        $ele.description.val(test.description);
        $ele.content.html(test.content);
        $ele.begin.html(test.begin);

        if(test.file)
        {
            $ele.tabContent.last().tab('show');
            embedPdf(test.file);
        }

        if (test.tags)
            $ele.tag.val(test.tags.join());
        $ele.adjustTotal.hide();

        quiz.postAjaxMethod = 'PUT';
        quiz.postUrl = '/api/v2/tests/'+test.id;

        initCreate();
    }


    function post()
    {
        data = validator();
        if (data) {
            $.ajax({
                type: quiz.postAjaxMethod,
                dataType: "json",
                url: quiz.postUrl,
                data: data,
                beforesend: function(){
                    $ele.btnCreateSubmit.button('loading');
                },
                error: function (data) {
                    toastr.error('Có lỗi xảy ra. Vui lòng kiểm tra kĩ và thử lại');
                    data = $.parseJSON(data.responseText);
                    validationError(data);
                    debug(data);
                    $ele.btnCreateSubmit.button('reset');
                },
                success: function (data) {
                    swal({
                            title: "Đã gửi đề thi thành công",
                            text: "Làm gì tiếp theo?",
                            type: "success",
                            showCancelButton: true,
                            confirmButtonClass: "btn-info",
                            confirmButtonText: "Xem đề thi",
                            cancelButtonText: "Chỉnh sửa",
                            closeOnConfirm: true,
                            closeOnCancel: true
                        },
                        function (isConfirm) {
                            quiz.preventClose = false;
                            if (isConfirm) {
                                location.href = data.url;
                            } else {
                                location.href = data.editUrl;
                            }
                        });
                }
            });
        }
    }

    function validator()
    {
        if (!filledAllAnswer()) return false;
        name = $('#input-name').val();
        description =  $('#input-description').val();
        content =  editorContent.serialize().content.value;
        begin = $('#begin').val();
        begin = (parseInt(begin) >= 1) ? parseInt(begin) : 1;

        tags = $('#select-tags').val();
        time = $('#select-time').val();
        is_file = 0;
        file_id = null;

        if (!name || name.length <6)
        {
            toastr['warning']('Tên đề thi có độ dài tối thiểu là 6');
            return false;
        }

        if (description && description.length <6)
        {
            toastr['warning']('Mô tả có độ dài tối thiểu là 6');
            return false;
        }
        // Detect upload tab to create a pdf-based exam
        pdf_upload = $('a[role="tab"][aria-expanded="true"]').attr('href');
        if(pdf_upload == '#upload')
        {
            if (!global.pdf_file_id)
            {
                toastr['warning']('Bạn chưa upload file pdf');
                return false;
            }
            is_file = 1;
            file_id = global.pdf_file_id;
        }

        if (!content)
        {
            toastr['warning']('Bạn chưa nhập nội dung đề thi');
            return false;
        }

        return {
            name: name,
            description: description,
            content: content,
            begin: begin,
            tags: tags,
            thoigian: time,
            is_file: is_file,
            file_id: file_id,
            questions : gatherQuestion()
        }
    }

    function gatherQuestion(){
        var questions= [];
        $('.ansRow').each(function(index){
            questionOrder = $(this).data('question-order');
            givenAnswer = $('input[id^="answer_'+questionOrder+'_"][value=1]').attr('name');
            givenAnswer = givenAnswer.substring(givenAnswer.length-1, givenAnswer.length);
            question = {
                'right_answer' : givenAnswer.toUpperCase(),
                'content' : (quiz.answerArray[index+1]) ? quiz.answerArray[index+1] : '',
            };
            questions.push(question);
        });
        return questions;
    }

    function iconListener()
    {
        choiceDo();
        answerModal();
        sticky();
    }
    function buttonListener()
    {
        $('#btn-add').on('click', function(event)
        {
            event.preventDefault();
            addQuestion($('#total_add').val());
        });
        $('#btn-remove').on('click', function(event)
        {
            event.preventDefault();
            removeQuestion($('#total_remove').val());
        });
        $('#begin').on('keyup', function()
        {
            adjustBegin();
        })

    }

    function setupQuestion()
    {
        if (global.data.test)
            addQuestion(global.data.test.questionsCount,global.data.test.questions);
        else
            addQuestion(5,false);
    }

    function addQuestion(value,data)
    {
        for(i=1; i<=value; i++)
        {
            qIndex = $('.ansRow:last').data('question-order');
            qIndex = (qIndex) ? qIndex : 0;

            dataNode = (data) ? data[i-1] : false;
            addNewRow(parseInt(qIndex)+1,dataNode);
        }
        iconListener();
        totalQuestion();
        adjustBegin();
    }

    function removeQuestion(value)
    {
        if (totalQuestion() - parseInt(value) <1)
        {
            toastr['warning']('Tổng số câu hỏi không được nhỏ hơn 1');
            return false;
        }
        qIndex = $('.ansRow:last').data('question-order');
        toIndex = parseInt(qIndex)-parseInt(value);

        for(i=qIndex; i>toIndex; i--)
        {
            $('tr[data-question-order="'+i+'"]').remove();
        }
        totalQuestion();
    }

    function addNewRow(index, data)
    {
        selectedAnswer = false;
        content = false;
        answerd = ''
        if (data)
        {
            selectedAnswer = data.answer.toLowerCase();
            content = data.content;
            answerd = ' answered';
            if(content)
                quiz.answerArray[index] = content;
        }
        row = '<tr class="ansRow'+answerd+'" data-question-order="'+index+'">' +
        '<td align="center" class="questionNumber">'+index+'.</td>';

        ['a','b','c','d','e'].forEach(function(option)
            {
                opchoice = (selectedAnswer == option) ? ' op-choice' : '';
                value = (selectedAnswer == option) ? 1 : 0;
                hinted = (content) ? ' hinted' : '';
                row  += '<td><a id="a_'+index+'_'+option+'" rel="1" ' +
                'class="icontest-option op-'+option+opchoice+'"' +
                'href="#"">' +option+ '</a>'+
                '<input type="hidden" id="answer_'+index+'_'+option+'" name="answer_'+index+'_'+option+'" value="'+value+'">'+
                '</td>';
            }
        );
        row += '<td><a href="javscript::void(0)" class="iconHint"><i class="zn-icon icon-hint'+hinted+'"></i></a></td></tr>';

        $('#answer>tbody').append(row);
    }

    function adjustBegin()
    {
        val = $('#begin').val();
        val = (parseInt(val) >= 1) ? parseInt(val) : 1;
        $('.questionNumber').each(function(index)
        {
            $(this).html(parseInt(index)+val+'.');
        });
    }
    function totalQuestion()
    {
        total = $('.ansRow').length;
        $('#total').html(total);

        return total;
    }
    function filledAllAnswer()
    {
        unanswered = $('.ansRow:not(".answered")').length;
        if (unanswered != 0)
            toastr['warning']('Bạn chưa điền đầy đủ đáp án cho các câu hỏi');
        return unanswered == 0;
    }

    function answerModal()
    {
        $('.icon-hint').unbind('click');
        $('.icon-hint')
            .on('click', function()
            {
                qIndex = $(this).closest('tr').data('question-order');

                hint = $('#answerModalArea');
                icon = $(this);
                currentValue = (quiz.answerArray[qIndex]) ? quiz.answerArray[qIndex] : '';
                hint.val(currentValue);

                questionNumber = parseInt(qIndex) + parseInt($ele.begin.val()) -1;
                $('#answerModal .modal-title').html('Gợi ý trả lời cho câu '+ questionNumber);

                quiz.preventClose = false;

                $('#answerModal').modal()
                    .on('hide.bs.modal', function()
                    {
                        quiz.preventClose = true;
                        quiz.answerArray[qIndex] = hint.val();
                        icon.removeClass('hinted');
                        if (hint.val())
                            icon.addClass('hinted');
                    });
            });
    }

    function uploader()
    {
        $("#uploadarea").uploadFile({
            url:"/api/v2/files",
            maxFileSize: 10*1024*1024,   //Bytes
            allowedTypes: 'pdf',
            showStatusAfterSuccess: false,
            formData: { type: 'json' },
            dragDropStr: "<span><b>Kéo và thả file vào đây để upload</b></span>",
            sizeErrorStr: "quá lớn. Dung lượng file tối đa là ",
            uploadErrorStr: "Đã có lỗi xảy ra trong quá trình upload",
            uploadButtonClass:"btn btn-info",
            onSuccess:function(files,data,xhr)
            {
                embedPdf(data);
            }
        });
    }

    function embedPdf(data)
    {
        $('#pdf').html('<iframe width="100%" height="750px" src="http://hoidapyhoc.com/assets/pdfjs/web/viewer.html?file='+data.url+'"></iframe>');
        global.pdf_file_id = data.id;
    }

    function editor()
    {
        editorContent = new MediumEditor('#content', {
            anchorInputPlaceholder: 'Nhập một liên kết mới',
            buttonLabels: 'fontawesome',
            firstHeader: 'h1',
            secondHeader: 'h2',
            targetBlank: true,
            cleanPastedHTML: true,
        });
        $('#content').mediumInsert({
            editor: editorContent,
            addons: {
                images: {
                    imagesUploadScript: '/api/v2/files',
                    imagesDeleteScript: '/api/v2/files'
                }
            }
        });

        $("#select-tags").select2({
            tags: true,
            data: global.data.tags,
            maximumSelectionLength: 3,
            templateResult: function(result) {
                if (result.count === undefined) {
                    return result.text;
                }
                return '<span class="post-tag">' + result.text + '</span>'
                + '<span class="item-multiplier"><span class="item-multiplier-x">×</span>&nbsp;' +
                '<span class="item-multiplier-count">' + result.count
                '</span></span>';
            }
        });
    }

    function preventClosing()
    {
        window.onbeforeunload = function (e) {
            e = e || window.event;
            if(quiz.preventClose){
                // For IE and Firefox prior to version 4
                if (e) {
                    e.returnValue = 'Bạn có chắc chắn muốn thoát ? ';
                }
                // For Safari
                return 'Bạn có chắc chắn muốn thoát ? ';
            }
        };
    }

    function debug(data)
    {
        window.console.log(data);
    }

}( jQuery ));