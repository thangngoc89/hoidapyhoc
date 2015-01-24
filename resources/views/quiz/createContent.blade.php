{!! Form::open(['url' => 'api/v2/tests', 'id' => 'frmTest' ]) !!}
<div class="col-md-8 threads-inner white">
    <div class="wrap">
        	<div class="form-row">
                {!! Form::label('name','Tên đề thi' ) !!}
                {!! Form::text('name','bbbbbb', ['class' => 'form-control input-md',
                                                'placeholder' => 'Nhập tên đề thi',
                                                'required','pattern' => '.{6,}',
                                                'title' => 'Tiêu đề có độ dài tối thiểu 6 kí tự'
                                                ]) !!}
            </div>
            <div class="form-row">
                {!! Form::label('description','Mô tả' ) !!}
                {!! Form::text('description','aaaaaa', ['class' => 'form-control input-md',
                                                'placeholder' => 'Mô tả ngắn về đề thi',
                                                'required','pattern' => '.{6,}',
                                                'title' => 'Mô tả có đợ dài tối thiểu 6 kí tự'
                                                ]) !!}
            </div>
            <div class="form-row">
                {!! Form::label('content','Nội dung' ) !!}
            </div>

            <div role="tabpanel">

              <!-- Nav tabs -->
              <ul class="nav nav-pills" role="tablist">
                <li role="presentation" class="active">
                    <a href="#editor" aria-controls="editor" role="tab" data-toggle="tab">
                        <i class="fa fa-pencil"></i> Tự soạn nội dung
                     </a>
                </li>
                <li role="presentation">
                    <a href="#upload" aria-controls="upload" role="tab" data-toggle="tab">
                        <i class="fa fa-upload"></i> Upload file PDF
                    </a>
                </li>
              </ul>
              <br>
              <!-- Tab panes -->
              <div class="tab-content">
                <div role="tabpanel" class="tab-pane active" id="editor">
                    <textarea class="form-control ckeditor_content ckeditor" name="content" id="ckeditor_content" ></textarea>
                </div>
                <div role="tabpanel" class="tab-pane" id="upload">
                    {!! Form::file('file_pdf'); !!}
                    <div class="description">
                        <label>Tệp tin</label><br>
                            Chọn file pdf để upload tài liệu (kích thước tối đa là 10MB)
                    </div>
                </div>
              </div>

            </div>
    </div>
</div>
<div id="quiz-sidebar" class="col-md-4 white">
    <div class="quiz-sidebar-section">
        <div class="statistic-box testHeader">
            Đáp án
        </div>
        <div class="answer-box option_test" id="option_test">
            <div class="form-group">
                {!! Form::label('questionCount','Số câu hỏi', ['class' => 'col-md-8 control-label'] ) !!}
                <div class="col-md-4">
                {!! Form::input('number','questionCount','5', ['class' => 'form-control', 'id' => 'questionCount']) !!}
                </div>
            </div>
            <div class="form-group">
                {!! Form::label('begin','Bắt đầu từ', ['class' => 'col-md-8 control-label'] ) !!}
                <div class="col-md-4">
                {!! Form::input('number','begin','1', ['class' => 'form-control' ]) !!}
                </div>
            </div>
            <table width="100%" border="0" id="answer">
            <tbody>
            @for($i=1; $i<=5; $i++)
                <tr class="ansRow" data-question-order="{{$i}}">
                    <td align="center" class="questionNumber">{{$i}}.</td>
                    <td><a id="a_{{$i}}_a" rel="1" class="icontest-option op-a " href="#"">a</a>
                        <input type="hidden" id="answer_{{$i}}_a" name="answer_{{$i}}_1" value="0">
                    </td>
                    <td><a id="a_{{$i}}_b" rel="1" class="icontest-option op-b " href="#"">b</a>
                        <input type="hidden" id="answer_{{$i}}_b" name="answer_{{$i}}_2" value="0">
                    </td>
                    <td><a id="a_{{$i}}_c" rel="1" class="icontest-option op-c " href="#"">c</a>
                        <input type="hidden" id="answer_{{$i}}_c" name="answer_{{$i}}_3" value="0">
                    </td>
                    <td><a id="a_{{$i}}_d" rel="1" class="icontest-option op-d " href="#"">d</a>
                        <input type="hidden" id="answer_{{$i}}_d" name="answer_{{$i}}_4" value="0">
                    </td>
                    <td><a id="a_{{$i}}_e" rel="1" class="icontest-option op-e " href="#"">e</a>
                        <input type="hidden" id="answer_{{$i}}_d" name="answer_{{$i}}_5" value="0">
                    </td>
                    <td>
                        <a href="javscript::void(0)">
                            <i class="zn-icon icon-hint"></i>
                        </a>
                    </td>
                </tr>
             @endfor
            </tbody>
            </table>
        </div>
        <div class="form-group pull-right">
            <hr>
            {!! Form::submit('Lưu', ['class' => 'btn btn-primary', 'id' => 'btnCreateSubmit']) !!}
        </div>
    </div>
</div>
{!! Form::close() !!}
