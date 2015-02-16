<article class="col-md-4 lesson-block lesson-block-lesson lesson-213 ">

    <div class="full-center lesson-block-inner" style="background: -webkit-linear-gradient(top, rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url({{ $video->thumb }}); background: -moz-linear-gradient(top, rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url({{ $video->thumb }}); background: linear-gradient(top, rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url({{ $video->thumb }}); background-size: cover;">
        <span class="lesson-block-status lesson-block-status__watched label" style="display: none;">
            Watched
        </span>


        <div class="lesson-block-thumbnail">
            <i class="lesson-thumbnail icon-letter-5"></i>
        </div>

        <!--<h5 class="lesson-block-difficulty">intermediate</h5>-->

        <h3 class="lesson-block-title  not-watched">
            <a href="{{ $video->link() }}" title="{{ $video->title }}">{{ str_limit($video->title,20) }}</a>
        </h3>

        <!--<small class="lesson-block-length">11:27</small>-->
    </div>

    <div class="lesson-block-meta">
        <div class="lesson-date">{{ $video->updated_at->format('d/m/Y') }} </div>

        <div class="lesson-status lesson-meta-item">
            <form method="POST" action="https://laracasts.com/lessons/complete" accept-charset="UTF-8" class="watched-form lesson-watched-toggle">
                <input name="_token" type="hidden" value="ISN2qSvBgCGyHGKhMFIMBK6DUXgC6ZfcKvKnZMmU">
                <input name="lesson-id" type="hidden" value="213">
                <input name="completed" type="hidden" value="">
                <input name="type" type="hidden" value="lesson">
                <button type="submit" class="icon-check-1-1 naked-btn lesson-completed-checkbox tt" title="" data-delay="500" data-original-title="Mark as Watched">
                </button>
            </form>
        </div>

        <div class="lesson-watch-later lesson-meta-item">
            <form method="POST" action="https://laracasts.com/lessons/213/save" accept-charset="UTF-8" id="watch-later-213">
                <input name="_token" type="hidden" value="ISN2qSvBgCGyHGKhMFIMBK6DUXgC6ZfcKvKnZMmU">
                <input name="type" type="hidden" value="Laracasts\Lesson">
                <button type="submit" class="lesson-watch-later-button tt naked-btn icon-clock-2-1" title="" data-delay="500" data-original-title="Watch Later">
                </button>
            </form>
        </div>

        <!-- This displays the favorited form and heart icon thing -->
        <div class="lesson-favorite">
            <form method="POST" action="https://laracasts.com/lessons/213/favorite" accept-charset="UTF-8" class="favorite-form">
                <input name="_token" type="hidden" value="ISN2qSvBgCGyHGKhMFIMBK6DUXgC6ZfcKvKnZMmU">
                <input name="lesson_type" type="hidden" value="lesson">
                <button type="submit" class="icon-heart-1-1 not-favorite naked-btn tt" title="" data-delay="500" data-original-title="Favorite Lesson">
                </button>
            </form>
        </div>
    </div>

    <div class="lesson-block-excerpt">
        <p>{{ str_limit($video->description,100) }}...</p>
    </div>
</article>