{!! Form::open(['url' => 'api/v2/tests', 'id' => 'frmTest', 'data-toggle' => 'validator' ]) !!}
<div class="col-md-8 threads-inner white">
    <div class="wrap">
        <div class="form-row">
            {!! Form::label('name','Tên đề thi' ) !!}
            {!! Form::text('name','', ['class' => 'form-control input-md',
                                        'id' => 'input-name',
                                        'placeholder' => 'Nhập tên đề thi',
                                        'required',
                                        'pattern' => '.{6,}',
                                        'title' => 'Tên đề thi có độ dài tối thiểu 6 kí tự' ]) !!}
            <div class="help-block with-errors">Tên đề thi có độ dài tối thiểu 6 kí tự</div>
        </div>
        <div class="form-row">
            {!! Form::label('description','Mô tả' ) !!}
            {!! Form::text('description','', ['class' => 'form-control input-md',
                                            'id' => 'input-description',
                                            'placeholder' => 'Mô tả ngắn về đề thi',
                                            'pattern' => '.{6,}',
                                            'title' =>
                                            'Mô tả có đô dài tối thiểu 6 kí tự' ]) !!}
            <div class="help-block with-errors">Mô tả có đô dài tối thiểu 6 kí tự</div>
        </div>
        <div class="form-group">
            {!! Form::label('content','Nội dung' ) !!}
        </div>
        <div id="tab-content" role="tabpanel">
        <!-- Nav tabs -->
            <ul class="nav nav-pills" role="tablist">
                <li role="presentation" class="active">
                    <a href="#editor" aria-controls="editor" role="tab" data-toggle="tab">
                        <i class="fa fa-pencil"></i> Tự soạn</a>
                </li>
                <li role="presentation">
                    <a href="#upload" aria-controls="upload" role="tab" data-toggle="tab">
                        <i class="fa fa-file-pdf-o"></i> Upload file PDF</a>
                </li>
                <li role="presentation" class="pull-right">
                    <a href="javascript:void(0)" id="toggle-uploader" title="Ẩn/Hiện trình upload ảnh">
                        <i class="fa fa-image"></i> Upload ảnh</a>
                </li>
            </ul>
            <!-- Tab panes -->
            <div class="tab-content">
                <!-- Composer tab -->
                <div role="tabpanel" class="tab-pane active" id="editor">
                    <div id="images-uploader" class="dropzone">
                        <div id="close-uploader" class="pull-right">
                            x Đóng
                        </div>
                    </div>
                    <div id="content" data-placeholder="Nhập nội dung cho đề thi">
                        <h3><strong>Chú ý : Khu vực này chính là trình soạn thảo của các bạn</strong></h3><p>Hãy xóa tất cả để bắt đầu soạn thảo đề thi.</p><p><br></p><h3><strong>1. Cần thanh công cụ? </strong></h3><p>Nhấp chuột/bôi đen đoạn văn bản cần định dạng, thanh công cụ sẽ xuất hiện. Các bạn có thể định dạng văn bản với những chức hay hay dùng như Work.<img alt="Image title" class="fr-fin fr-dib" src="/img/tut/select-tut.jpg" width="561"></p><h3><strong>2. Soạn thảo nhanh bằng phím tắt:</strong></h3><p>Đây là một danh sách ngắn những phím tắt có sẵn để các bạn sử dụng:</p><p>- Ctrl + <strong>B</strong> : <strong>In đậm</strong></p><p><strong>- </strong>Ctrl + <u>U</u> : Gạch chân</p><p>- Ctrl + <em>I &nbsp;</em>: Chữ nghiêng</p><p>- Ctrl + S : <strike>Gạch ngang qua chữ</strike></p><p><br></p><p><strong style="font-size: 24px; letter-spacing: -0.1px; line-height: 1.1;">3. Chèn hình ảnh ?</strong></p><p>Quiz cho phép các bạn upload ảnh chụp một cách nhanh chóng để tạo một đề thi mới. Các bạn có thể thực hiện theo các bước sau:</p><p>- Bấm vào nút upload ảnh ở phía trên, góc trái&nbsp;<img alt="Image title" class="fr-image-dropped fr-fin fr-dii" src="/img/tut/upload-button-tut.jpg"></p><p>- Khung upload sẽ xuất hiện như hình bên dưới. Các bạn có thể kéo thả, nhấn vào để chọn hình và upload.&nbsp;</p><p><img class="fr-fin fr-dib" alt="Image title" src="/img/tut/upload-frame-tut.jpg" width="689"></p><p>- Nếu không có lỗi gì xảy ra thì hình ảnh bạn upload sẽ được tự động chèn vào khung soạn thảo. Tiện lợi phải không nào.</p><p style="text-align: left;"><strong>Bây giờ thì hãy soạn đề thôi.</strong></p>
                    </div>
                </div>
                <!-- Pdf uploader tab -->
                <div role="tabpanel" class="tab-pane" id="upload">
                    <div class="description">
                        <label>Tệp tin</label>
                        <p>Chọn file pdf để upload tài liệu (kích thước tối đa là 10MB)</p>
                    </div>
                    <div id="pdf-uploader" class="dropzone"></div>
                    <div id="pdf"></div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Quiz Sidebar column -->
<div id="quiz-sidebar" class="col-md-4 white">
    <div class="quiz-sidebar-section">
        <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
            <!-- Answer box group -->
            <div class="panel">
                <div class="panel-heading" role="tab" id="headingOne">
                    <h4 class="panel-title">
                        <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            <i class="fa fa-angle-double-down"></i> Đáp án </a>
                    </h4>
                </div>
                <div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                    <div class="panel-body">
                        <div class="form-group row">
                            <div class="col-md-12">
                                <h4>Số câu: <span class="color-red" id="total">5</span></h4>
                            </div>
                        </div>
                        <div class="form-group row" id="adjustTotal">
                            <div class="input-group col-md-5 col-sm-5">
                                  <span class="input-group-btn">
                                    <button class="btn btn-info" id="btn-add"><i class="fa fa-plus"></i></button>
                                  </span>
                                  {!! Form::input('number','total_add','1', ['class' => 'form-control', 'id' => 'total_add']) !!}
                            </div>
                            <div class="input-group col-md-5 col-sm-5">
                                  <span class="input-group-btn">
                                    <button class="btn btn-primary" id="btn-remove"><i class="fa fa-times"></i></button>
                                  </span>
                                  {!! Form::input('number','total_remove','1', ['class' => 'form-control', 'id' => 'total_remove']) !!}
                            </div>
                        </div>
                        <div class="form-group row">
                                <div class="col-md-6">
                                    <h4>{!! Form::label('begin','Bắt đầu từ' ) !!}</h4>
                                </div>
                                <div class="col-md-6 pull-right">
                                    {!! Form::input('number','begin','1', ['class' => 'form-control', 'id' => 'begin', 'min' => 1]) !!}
                                </div>
                        </div>
                        <div class="answer-box option_test" id="option_test">
                            <table width="100%" border="0" id="answer">
                            <tbody>
                            <!-- Answer box render here-->
                            </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Exam's property group-->
            <div class="panel">
                <div class="panel-heading" role="tab" id="headingTwo">
                    <h4 class="panel-title">
                        <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            <i class="fa fa-angle-double-down"></i> Thuộc tính</a>
                  </h4>
                </div>
                <div id="collapseTwo" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingTwo">
                    <div class="panel-body">
                        <label for="select-tags">Tag</label>
                        <input class="form-control" name="tags" id="select-tags" placeholder="Chọn hoặc tạo mới môn học liên quan">
                        <div class="help-block with-errors">Hãy chọn ít nhất một tag liên quan đến đề thi</div>

                        <label for="select-time">Thời gian (phút)</label>
                        <select class="form-control" name="time" id="select-time" required>
                            @for ($i=5; $i<=200; $i=$i+5)
                            <option value="{{ $i }}">{{ $i }}</option>
                            @endfor
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <!-- Submit button -->
        <div class="form-group">
            <div class="pull-right">
                {!! Form::submit('Lưu', ['class' => 'btn btn-primary', 'id' => 'btnCreateSubmit', 'data-loading-text' => 'Đang gửi...']) !!}
            </div>
        </div>
    </div>
</div>
{!! Form::close() !!}


