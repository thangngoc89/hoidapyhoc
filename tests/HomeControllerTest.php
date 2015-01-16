<?php
/**
 * Created by PhpStorm.
 * User: Dang
 * Date: 16/01/2015
 * Time: 6:40 AM
 */

class HomeControllerTest extends TestCase {

    public function testBasicExample()
    {
        $response = $this->call('GET', '/');

        $this->assertEquals(200, $response->getStatusCode());
    }
}
 