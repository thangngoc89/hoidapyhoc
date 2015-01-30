<?php

use Quiz\Models\User;

class UserControllerTest extends TestCase{

    public function test_it_should_require_when_request_members_profile_and_not_logged_in()
    {
        $this->call('GET', "/@user");
        $this->assertRedirectedTo('/auth/login');
    }
    public function test_it_should_show_a_member_profile_when_logged_in()
    {
        $user = new User(array('name' => 'John','username' => 'faker'));
        $this->be($user);

        $this->call('GET', "/@user");
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