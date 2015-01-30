<?php

class HomeControllerTest extends TestCase {

    public function test_it_should_show_homepage()
    {
        $response = $this->call('GET', '/');
        $this->assertEquals(200, $response->getStatusCode());
    }

    public function test_it_should_show_stat_page()
    {
        $response = $this->call('GET', '/thongke');
        $this->assertEquals(200, $response->getStatusCode());
    }

    public function test_it_should_show_testimonials_page()
    {
        $response = $this->call('GET', '/testimonials');
        $this->assertEquals(200, $response->getStatusCode());
    }
}
 