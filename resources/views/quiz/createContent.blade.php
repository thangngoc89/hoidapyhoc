{!! Form::open(['url' => 'api/v2/tests', 'id' => 'frmTest' ]) !!}

<div class="col-md-8 threads-inner white">

    <div class="wrap">
        <div class="form-group">
            {!! Form::label('name','Tên đề thi' ) !!}
            <div id="name"></div>
        </div>
        <div class="form-group">
            {!! Form::label('description','Mô tả' ) !!}
            <div id="description"></div>
        </div>
        <div class="form-group">
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
                <div id="content" data-placeholder="Nhập nội dung cho đề thi"></div>
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
        <div class="form-group">
            <h4><i class="glyphicon glyphicon-question-sign"></i> Số câu: <span class="color-red" id="total"> 5 </span></h4>
        </div>
        <div class="form-group row">
                <div class="col-md-4">
                {!! Form::input('number','total_add','1', ['class' => 'form-control', 'id' => 'total_add']) !!}
                </div>
                <div class="col-md-4 pull-right">
                <button class="btn btn-info" id="btn-add"><i class="fa fa-plus"></i> THÊM</button>
                </div>
            </div>
        <div class="form-group row">
                <div class="col-md-4">
                {!! Form::input('number','total_remove','1', ['class' => 'form-control', 'id' => 'total_remove']) !!}
                </div>
                <div class="col-md-4 pull-right">
                <button class="btn btn-primary" id="btn-remove"><i class="fa fa-times"></i> XÓA</button>
                </div>
        </div>
        <div class="answer-box option_test" id="option_test">
            <table width="100%" border="0" id="answer">
            <tbody>
            @for($i=1; $i<=5; $i++)
                <tr class="ansRow" data-question-order="{{$i}}">
                    <td align="center" class="questionNumber">{{$i}}.</td>
                    <td><a id="a_{{$i}}_a" rel="1" class="icontest-option op-a " href="#"">a</a>
                        <input type="hidden" id="answer_{{$i}}_a" name="answer_{{$i}}_a" value="0">
                    </td>
                    <td><a id="a_{{$i}}_b" rel="1" class="icontest-option op-b " href="#"">b</a>
                        <input type="hidden" id="answer_{{$i}}_b" name="answer_{{$i}}_b" value="0">
                    </td>
                    <td><a id="a_{{$i}}_c" rel="1" class="icontest-option op-c " href="#"">c</a>
                        <input type="hidden" id="answer_{{$i}}_c" name="answer_{{$i}}_c" value="0">
                    </td>
                    <td><a id="a_{{$i}}_d" rel="1" class="icontest-option op-d " href="#"">d</a>
                        <input type="hidden" id="answer_{{$i}}_d" name="answer_{{$i}}_d" value="0">
                    </td>
                    <td><a id="a_{{$i}}_e" rel="1" class="icontest-option op-e " href="#"">e</a>
                        <input type="hidden" id="answer_{{$i}}_d" name="answer_{{$i}}_e" value="0">
                    </td>
                    <td>
                        <a href="javscript::void(0)" class="iconHint">
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

