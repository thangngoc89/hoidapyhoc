<div class="col-md-8 threads-inner white">
    <div class="lessons-nav lessons-nav--forum inline-nav">
         <div class="container">
             <ul class="lessons-nav__primary">
                 <li class="active">
                     <a href="#test">Đề thi</a>
                 </li>
                 <li>
                    <a href="#comment">Bình luận</a>
                 </li>
             </ul>
         </div>
     </div>
    <div class="wrap">
         @include('quiz.partials.content')
    </div>
</div>
<div id="quiz-sidebar" class="col-md-4 white">
    <div class="quiz-nav lessons-nav--forum inline-nav">
        <div class="container">
           <div class="result-box">
               <ul>
                   <li class="pull-left">
                       <strong>Bạn đạt được:</strong>
                       <span class="text-error"> {{ $history->score }} điểm</span>
                   </li>
                   <li class="pull-right">
                        <button id="btnSheet" type="button" class="btn btn-primary"><i class="fa fa-th-list"></i></button>
                    </li>
               </ul>
               <div class="row no-padding static-box">
                    <dl class="col-md-8 dl-horizontal score">
                        <dt>Điểm cao nhất:</dt>
                        <dd>7.5<dd>
                        <dt>Điểm trung bình:</dt>
                        <dd>1.25</dd>
                        <dt>Xếp hạng:</dt>
                        <dd>9&nbsp;/&nbsp;15</dd>
                    </dl>
                   <dl class="col-md-4 dl-horizontal dl-custome desc">
                        <dt><a class="icontest-option op-choice" href="#"></a></dt>
                        <dd>Đáp án</dd>
                        <dt><a class="icontest-option op-true" href="#"></a></dt>
                        <dd>đúng</dd>
                        <dt><a class="icontest-option op-fail" href="#"></a></dt>
                        <dd>sai</dd>
                    </dl>
               </div>
           </div>
        </div>
    </div>
    @if ($history)
    <div class="quiz-sidebar-section">
        <div class="statistic-box testHeader" class="answer-box option_test">
            <div class="userAnswerCount" value="0">
                <strong>Bạn đã trả lời: </strong>
                <span id="answeredCount">{{ $history->answeredCount() }}</span>
                /
                <span id="totalAnswer">{{ $t->questionsCount }}</span>
            </div>
        </div>
        <div class="answer-box option_test" id="option_test">
            <table class="table_test_result" width="100%" border="0">
                <tbody>
                <?php
                    $i=$t->begin;
                    $option = ['a','b','c','d','e'];
                    $userChoices = str_split($history->answer,1);
                ?>
                @foreach( $t->questions as $index => $q)
                <tr class="ansRow" data-qindex="{{ $i }}" data-content="{{ $q->content }}">
                    <td align="center">{{$i}}.</td>
                    <?php
                        $rightAnswer = strtolower($q->answer);
                        $userChoice = strtolower($userChoices[$index]);
                        foreach($option as $op)
                        {
                            if (($rightAnswer == $op) && ($userChoice == $op))
                                $iconType = 'op-true';
                            elseif ($userChoice == $op)
                                $iconType = 'op-fail';
                            elseif ($rightAnswer == $op)
                                $iconType = 'op-choice';
                            else $iconType = 'op-'.$op;
                            echo '<td><a class="icontest-option '.$iconType.'" href="javascript:void(0);">'.$op.'</a></td>';
                        }
                    ?>
                    <td>
                        <a data-original-title="Xem gợi ý" href="javascript:void(0);" class="iconHint " data-toggle="tooltip" title="" data-questionid="63963">
                            <i class="zn-icon icon-hint @unless (empty($q->content)) hinted @endunless"></i>
                        </a>
                    </td>
                </tr>
                <?php $i++; ?>
                @endforeach
                </tbody>
            </table>
        </div>
    </div>
    @endif
</div>