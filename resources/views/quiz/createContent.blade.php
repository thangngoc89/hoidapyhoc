{!! Form::open(['url' => 'api/v2/tests', 'id' => 'frmTest' ]) !!}

<div class="col-md-8 threads-inner white">
    <div class="wrap">
        <div class="form-group">
            {!! Form::label('name','Tên đề thi' ) !!}
            <div id="name">Tên đề thi</div>
        </div>
        <div class="form-group">
            {!! Form::label('description','Mô tả' ) !!}
            <div id="description">Mô tả đề thi</div>
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
                    <i class="fa fa-file-pdf-o"></i> Upload file PDF
                </a>
            </li>
          </ul>
          <br>
          <!-- Tab panes -->
          <div class="tab-content">
            <div role="tabpanel" class="tab-pane active" id="editor">
                <div id="content" data-placeholder="Nhập nội dung cho đề thi">
                    <h3><b>!! Các bạn hãy xóa đoạn hướng dẫn bên dưới (bao gồm cả dòng này) và bắt đầu soạn đề !!</b></h3><p><b>Hướng dẫn soạn đề (dùng tốt nhất trên Chrome và Firefox) :</b></p><p>- Để định dạng một đoạn văn bản bất kì hãy bôi đen đoạn văn bản, thanh công cụ sẽ xuất hiện</p><div class="mediumInsert" id="mediumInsert-14"><figure class="mediumInsert-images"><img src="/img/tut/composer1.jpg" alt=""></figure></div><p><br></p><div class="mediumInsert small" id="mediumInsert-0"><figure class="mediumInsert-images small"><img src="/img/tut/composer2.jpg" alt=""></figure></div><p><!--StartFragment-->- Để chèn hình vào để thi, kéo thả vào khung soạn thảo hoặc rê chuột vào góc trái. Sẽ xuất hiện dấu + để các bạn chèn ảnh<!--EndFragment-->&nbsp;&nbsp;<br></p><p>- Bấm nút <b>Img</b>&nbsp;và chọn hình ảnh bạn muốn chèn (có thể chèn nhiều ảnh)</p>
                </div>
            </div>
            <div role="tabpanel" class="tab-pane" id="upload">
                <div class="description">
                    <label>Tệp tin</label><br>
                        Chọn file pdf để upload tài liệu (kích thước tối đa là 10MB)
                </div>
                <div id="uploadarea">Upload</div>
                <div id="pdf"></div>
            </div>
          </div>

        </div>
    </div>
</div>
<div id="quiz-sidebar" class="col-md-4 white">
    <div class="quiz-sidebar-section">
    <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
      <div class="panel">
        <div class="panel-heading" role="tab" id="headingOne">
          <h4 class="panel-title">
            <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
              <i class="fa fa-angle-double-down"></i> Đáp án
            </a>
          </h4>
        </div>
        <div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
          <div class="panel-body">
            <div class="form-group row">
                <div class="col-md-4">
                    <h4>Số câu: <span class="color-red" id="total"> 5 </span></h4>
                </div>
                <div class="input-group col-md-4">
                      <span class="input-group-btn">
                        <button class="btn btn-info" id="btn-add"><i class="fa fa-plus"></i></button>
                      </span>
                      {!! Form::input('number','total_add','1', ['class' => 'form-control', 'id' => 'total_add']) !!}
                </div>
                <div class="input-group col-md-4">
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
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-heading" role="tab" id="headingTwo">
          <h4 class="panel-title">
            <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
              <i class="fa fa-angle-double-down"></i> Thuộc tính
            </a>
          </h4>
        </div>
        <div id="collapseTwo" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingTwo">
          <div class="panel-body">
            <label>Môn học</label>
            <select class="form-control no-border full-width" name="category_id" id="select-category">
                @foreach ($categories as $c)
                <option value="{{ $c->id }}" >{{ $c->name }}</option>
                @endforeach
            </select>
            <label>Thời gian (phút)</label>
            <select class="form-control no-border full-width" name="time" id="select-time">
                    @for ($i=5; $i<=200; $i=$i+5)
                    <option value="{{ $i }}">{{ $i }}</option>
                    @endfor
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="form-group pull-right">
        {!! Form::submit('Lưu', ['class' => 'btn btn-primary', 'id' => 'btnCreateSubmit']) !!}
    </div>
    </div>
</div>
{!! Form::close() !!}

