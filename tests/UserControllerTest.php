<?php

use Quiz\Models\User;

class UserControllerTest extends TestCase{

    public function test_it_should_show_a_member_profile()
    {
        $user = User::find(5);

        $this->call('GET', "/@{$user->username}");
        $this->assertResponseOk();
    }

    public function test_it_should_redirect_to_auth_finish_page_if_username_is_null()
    {
        $user = new User(array('name' => 'John'));
        $this->be($user);

        $this->call('GET', "/quiz/create");
        $this->assertRedirectedTo('/auth/edit');
    }
}