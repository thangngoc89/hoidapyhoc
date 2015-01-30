<?php

use Quiz\Models\User;

class TagControllerTest extends TestCase{

    public function test_it_should_show_a_tag_list()
    {
        $this->call('GET', "/tag");
        $this->assertResponseOk();

        $this->call('GET', "/tag?tab=new");
        $this->assertResponseOk();

        $this->call('GET', "/tag?tab=list");
        $this->assertResponseOk();
    }

    public function test_it_should_show_a_list_of_test_with_given_tag()
    {
        $this->call('GET', "/tag/giai-phau");
        $this->assertResponseOk();
    }
}