<?php

use Quiz\Models\Exam;
use Quiz\Models\User;

class QuizControllerTest extends TestCase{

    public function test_it_should_show_quiz_index()
    {
        $this->call('GET', '/');
        $this->assertResponseOk();
    }

    public function test_it_should_show_a_quiz_page()
    {
        $test = Exam::find(5);

        $this->call('GET', "/quiz/lam-bai/{$test->slug}/{$test->id}");
        $this->assertResponseOk();
    }

    public function test_it_should_redirect_to_correct_url_when_using_old_slug()
    {
        $test = Exam::find(5);

        $this->call('GET', "/quiz/lam-bai/some-fucking-slug/{$test->id}");
        $this->assertRedirectedTo("/quiz/lam-bai/{$test->slug}/{$test->id}");
    }

    public function test_it_should_show_leaderboard()
    {
        $test = Exam::find(5);

        $this->call('GET', "/quiz/bang-diem/{$test->slug}/{$test->id}");
        $this->assertResponseOk();
    }

    public function test_it_should_redirect_to_correct_url_when_using_old_slug_on_leaderboard()
    {
        $test = Exam::find(5);

        $this->call('GET', "/quiz/bang-diem/some-fucking-slug/{$test->id}");
        $this->assertRedirectedTo("/quiz/bang-diem/{$test->slug}/{$test->id}");
    }

    public function test_it_should_return_history_page()
    {
        $test = Exam::find(5);
        $history = $test->history->first();

        $this->call('GET', "/quiz/ket-qua/{$test->slug}/{$history->id}");
        $this->assertResponseOk();
    }

    public function test_it_should_redirect_to_auth_page_on_create_or_edit_view_when_not_logged_in()
    {
        $this->call('GET', "/quiz/create");
        $this->assertRedirectedTo("/auth/login");

        $this->call('GET', "/quiz/1/edit");
        $this->assertRedirectedTo("/auth/login");
    }

    public function test_it_should_show_create_or_edit_form_when_logged_in()
    {
        $user = new User(array('name' => 'John', 'username' => 'john'));
        $this->be($user);

        $this->call('GET', "/quiz/create");
        $this->assertResponseOk();

        $this->call('GET', "/quiz/1/edit");
        $this->assertResponseOk();

    }
}