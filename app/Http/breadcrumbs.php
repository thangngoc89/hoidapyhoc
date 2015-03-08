<?php

// Home
Breadcrumbs::register('home', function($breadcrumbs)
{
    $breadcrumbs->push('Trang chủ', route('home'));
});

// Home
Breadcrumbs::register('site.statistic', function($breadcrumbs)
{
    $breadcrumbs->parent('home');
    $breadcrumbs->push('Thống kê', route('site.statistic'));
});

// Home > Testimonials
Breadcrumbs::register('site.testimonials', function($breadcrumbs)
{
    $breadcrumbs->parent('home');
    $breadcrumbs->push('Thống kê', route('site.statistic'));
});

// Home > Quiz
Breadcrumbs::register('quiz', function($breadcrumbs)
{
    $breadcrumbs->parent('home');
    $breadcrumbs->push('Quiz', route('quiz.index'));
});

// Home > Quiz > [Exam]
Breadcrumbs::register('quiz.do', function($breadcrumbs, $exam)
{
    $breadcrumbs->parent('quiz');
    $breadcrumbs->push($exam->name, route('quiz.do', [$exam->slug, $exam->id]  ));
});

// Home > Quiz > Create
Breadcrumbs::register('quiz.create', function($breadcrumbs)
{
    $breadcrumbs->parent('quiz');
    $breadcrumbs->push('Tạo đề thi mới', route('quiz.create'));
});

// Home > Quiz > [Exam] > Edit

Breadcrumbs::register('quiz.edit', function($breadcrumbs, $exam)
{
    $breadcrumbs->parent('quiz');
    $breadcrumbs->push($exam->name, route('quiz.do', $exam->id));
    $breadcrumbs->push('Sửa', route('quiz.edit', $exam->id));
});

// Home > Video

Breadcrumbs::register('video.index', function($breadcrumbs)
{
    $breadcrumbs->parent('home');
    $breadcrumbs->push('Video', route('video.index'));
});

// Home > Video > [Video]

Breadcrumbs::register('video.show', function($breadcrumbs, $video)
{
    $breadcrumbs->parent('video.index');
    $breadcrumbs->push($video->title, route('video.index', [$video->slug, $video->id]));
});

